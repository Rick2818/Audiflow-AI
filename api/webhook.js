import crypto from 'crypto';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { isSafePublicUrl, safeCompare, setStrictCors } from '../lib/security.js';
import { CONFIG } from '../lib/config.js';
import { ephemeralReportsCache } from './audit.js';

const stripeSecret = (process.env.STRIPE_SECRET_KEY || CONFIG.PAYMENTS?.STRIPE_SECRET_KEY || '').trim();
const webhookSecret = (process.env.STRIPE_WEBHOOK_SECRET || '').trim();
const stripe = stripeSecret ? new Stripe(stripeSecret) : null;

const supabaseUrl = (process.env.SUPABASE_URL || CONFIG.SUPABASE?.URL || '').trim();
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || CONFIG.SUPABASE?.KEY || '').trim();
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

export default async function handler(req, res) {
  setStrictCors(req, res, 'POST, OPTIONS', 'Content-Type, stripe-signature, x-wompi-signature, x-signature');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }

    // Filtro y Protección Anti-Spam: Descartar eventos de rebote (Bounces / NDR) sin notificar al correo personal
    const eventTypeStr = String(body?.event || body?.type || '').toLowerCase();
    const isBounce = eventTypeStr.includes('bounce') || eventTypeStr.includes('fail') || eventTypeStr.includes('complaint') || eventTypeStr.includes('delayed') || eventTypeStr.includes('dropped') || eventTypeStr.includes('undelivered');
    if (isBounce) {
      const bouncedEmail = body.data?.to?.[0] || body.data?.to || body.data?.email || 'desconocido';
      console.log(`🛡️ [Bounce Filter] Rebote/Fallo detectado y aislado para ${bouncedEmail}. Cero notificaciones al correo personal.`);
      if (supabase && bouncedEmail && bouncedEmail !== 'desconocido') {
        try {
          await supabase.from('audit_leads').update({ email_status: 'BOUNCED', updated_at: new Date().toISOString() }).eq('email', bouncedEmail);
        } catch(e){}
      }
      return res.status(200).json({ received: true, status: 'bounce_isolated_silently' });
    }

    const isWompi = body.event === 'transaction.updated' || body.data?.transaction?.status === 'APPROVED' || body.idTransaccion || body.esAprobada;
    const isStripe = sig && stripe && webhookSecret;

    // Validación Criptográfica Estricta de la Pasarela
    if (isWompi) {
      const wompiSecret = (process.env.WOMPI_INTEGRITY_SECRET || process.env.WOMPI_API_SECRET || CONFIG.PAYMENTS?.WOMPI_API_KEY || 'auditflow_wompi_integrity_secret').trim();
      const wompiSig = req.headers['x-wompi-signature'] || req.headers['x-signature'] || body.signature;

      if (!wompiSig) {
        return res.status(401).json({ error: 'Firma criptográfica de Wompi requerida y no provista. Solicitud rechazada por seguridad fiduciaria.' });
      }

      const rawPayload = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      const expectedWompiSig = crypto.createHmac('sha256', wompiSecret).update(rawPayload).digest('hex');
      if (!safeCompare(wompiSig, expectedWompiSig)) {
        return res.status(401).json({ error: 'Firma criptográfica de Wompi inválida. Solicitud rechazada por seguridad fiduciaria.' });
      }
      event = body;
    } else if (isStripe) {
      const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      try {
        event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
      } catch (stripeErr) {
        return res.status(401).json({ error: 'Firma de Stripe inválida: ' + stripeErr.message });
      }
    } else {
      return res.status(400).json({ error: 'Evento de webhook no reconocido o carente de firma criptográfica válida.' });
    }

    if (isStripe || isWompi) {
      const session = event.data?.object || body.data?.transaction || {};
      const reportId = session.metadata?.report_id || session.reference || 'rep_custom';
      const customerEmail = session.customer_details?.email || session.customer_email || session.email || session.customer_data?.email || 'cliente@empresa.com';
      const amountTotal = (session.amount_total ? session.amount_total / 100 : (session.amount_in_cents ? session.amount_in_cents / 100 : 19.00)).toFixed(2);

      if (supabase) {
        try {
          if (reportId) {
            await supabase
              .from('audit_reports')
              .update({ status: 'unlocked', updated_at: new Date().toISOString() })
              .eq('id', reportId);
          }

          if (reportId && ephemeralReportsCache.has(reportId)) {
            const cached = ephemeralReportsCache.get(reportId);
            cached.is_unlocked = true;
            ephemeralReportsCache.set(reportId, cached);
          }

          await supabase
            .from('transactions')
            .insert([{
              id: session.id || session.idTransaccion || `tx_${Date.now()}`,
              provider: isWompi ? 'wompi_sv' : (session.subscription ? 'stripe_subscription' : 'stripe'),
              amount_usd: parseFloat(amountTotal),
              customer_email: customerEmail || 'cliente@empresa.com',
              status: 'paid',
              created_at: new Date().toISOString()
            }]);
        } catch (sErr) {
          console.warn('Supabase webhook record notice:', sErr.message);
        }
      } else if (reportId && ephemeralReportsCache.has(reportId)) {
        const cached = ephemeralReportsCache.get(reportId);
        cached.is_unlocked = true;
        ephemeralReportsCache.set(reportId, cached);
      }

      console.log(`✅ [PAYMENT VERIFIED] Report ${reportId} unlocked for ${customerEmail} ($${amountTotal} USD) via ${isWompi ? 'Wompi SV' : 'Stripe'}`);

      // Entrega Automática al Cliente (0 Intervención Humana)
      if (customerEmail) {
        try {
          const resendKey = (process.env.RESEND_API_KEY || '').trim();
          const emailFrom = process.env.EMAIL_FROM || '"AuditFlow AI | Entregas" <ricardo@audiflowai.com>';
          const clientSubject = 'AuditFlow AI — Su Informe Ejecutivo y Archivo Word (.docx) están listos';
          const clientHtml = `
            <div style="font-family: Arial, sans-serif; background: #0f172a; color: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #334155; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #38bdf8; margin-top: 0;">¡Pago Confirmado con Éxito!</h2>
              <p>Gracias por su compra en <strong>AuditFlow AI</strong>. Su informe ejecutivo y marcas de revisión han sido desbloqueados.</p>
              <div style="text-align: center; margin: 24px 0;">
                <a href="https://audiflowai.com/Plantilla_Auditoria_Redlines_AuditFlow_AI.docx" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  📥 Descargar Archivo Word (.docx) con Redlines
                </a>
              </div>
              <p style="font-size: 13px; color: #cbd5e1;">Acceso web al informe: <a href="https://audiflowai.com/?reportId=${reportId}&status=success" style="color: #38bdf8;">Ver Reporte Interactivo</a></p>
              <hr style="border: 0; border-top: 1px solid #334155; margin: 20px 0;" />
              <p style="font-size: 11px; color: #64748b;">AuditFlow AI • Soporte Corporativo: soporte@audiflowai.com</p>
            </div>
          `;

          const ownerNotificationHtml = `
            <div style="font-family: Arial, sans-serif; background: #0f172a; color: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #10b981;">
              <h3 style="color: #10b981; margin-top: 0;">🎉 ¡NUEVA VENTA CONFIRMADA EN AUDITFLOW AI!</h3>
              <p>Se ha recibido un pago exitoso en la plataforma:</p>
              <ul>
                <li>Cliente: <strong>${customerEmail}</strong></li>
                <li>Monto: <strong>$${amountTotal} USD</strong></li>
                <li>ID de Reporte: <strong>${reportId}</strong></li>
                <li>Fecha: <strong>${new Date().toISOString()}</strong></li>
              </ul>
              <p style="font-size: 12px; color: #94a3b8;">El cliente ha recibido su archivo Word (.docx) automáticamente.</p>
            </div>
          `;
          try {
            if (!body.test_mode) {
              if (resendKey) {
                try {
                  const { Resend } = await import('resend');
                  const resend = new Resend(resendKey);
                  await resend.emails.send({ from: emailFrom, to: [customerEmail], reply_to: CONFIG.EMAIL.REPLY_TO_CONTROL, subject: clientSubject, html: clientHtml });
                  // Notificación de Venta al Correo Personal del Propietario (rick28191@gmail.com) y al Operativo
                  await resend.emails.send({ from: emailFrom, to: [CONFIG.EMAIL.OWNER_SALES, CONFIG.EMAIL.OWNER_CONTROL], reply_to: CONFIG.EMAIL.REPLY_TO_CONTROL, subject: `🎉 [Venta $${amountTotal} USD] Nueva Compra de ${customerEmail}`, html: ownerNotificationHtml });
                } catch (rErr) {
                  console.warn('Resend webhook notice error:', rErr.message);
                }
              }

              // Fallback a Gmail SMTP para garantizar la llegada al correo personal
              const gmailPass = (process.env.GMAIL_APP_PASSWORD || CONFIG.EMAIL.SMTP_PASS).replace(/\s+/g, '').trim();
              if (gmailPass) {
                try {
                  const nodemailer = (await import('nodemailer')).default;
                  const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: { user: CONFIG.EMAIL.SMTP_USER, pass: gmailPass }
                  });
                  await transporter.sendMail({
                    from: CONFIG.EMAIL.FROM_SALES,
                    to: `${CONFIG.EMAIL.OWNER_SALES}, ${CONFIG.EMAIL.OWNER_CONTROL}`,
                    subject: `🎉 [Venta $${amountTotal} USD] Nueva Compra de ${customerEmail}`,
                    html: ownerNotificationHtml
                  });
                } catch (smtpErr) {
                  console.warn('SMTP purchase notice error:', smtpErr.message);
                }
              }
            }
          } catch (eErr) {
            console.warn('Aviso en envío de correo post-pago:', eErr.message);
          }
        } catch (eErr) {
          console.warn('Aviso en estructura de envío de correo:', eErr.message);
        }
      }
    }

    return res.status(200).json({ received: true, event_type: event.type || 'generic_webhook' });

  } catch (err) {
    console.error('❌ Webhook error:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }
}
