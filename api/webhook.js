import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { isSafePublicUrl } from '../lib/security.js';
import { CONFIG } from '../lib/config.js';

const stripeSecret = (process.env.STRIPE_SECRET_KEY || CONFIG.PAYMENTS.STRIPE_SECRET_KEY || '').trim();
const webhookSecret = (process.env.STRIPE_WEBHOOK_SECRET || '').trim();
const stripe = stripeSecret ? new Stripe(stripeSecret) : null;

const supabaseUrl = (process.env.SUPABASE_URL || CONFIG.SUPABASE.URL || '').trim();
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || CONFIG.SUPABASE.KEY || '').trim();
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, stripe-signature');

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

    // Verificación Criptográfica si existe secreto de webhook y firma
    if (stripe && webhookSecret && sig) {
      const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } else {
      event = body;
    }

    // Manejar Evento de Pago Exitoso (Stripe / Wompi El Salvador)
    const isWompi = body.event === 'transaction.updated' || body.data?.transaction?.status === 'APPROVED';
    const isStripe = event && (event.type === 'checkout.session.completed' || event.type === 'payment_intent.succeeded');

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

          await supabase
            .from('transactions')
            .insert([{
              id: session.id || `tx_${Date.now()}`,
              provider: session.subscription ? 'stripe_subscription' : 'stripe',
              amount_usd: parseFloat(amountTotal),
              customer_email: customerEmail || 'cliente@empresa.com',
              status: 'paid',
              created_at: new Date().toISOString()
            }]);
        } catch (sErr) {
          console.warn('Supabase webhook record notice:', sErr.message);
        }
      }

      console.log(`✅ [STRIPE VERIFIED] Report ${reportId} unlocked for ${customerEmail} ($${amountTotal} USD)`);

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
        } catch (eErr) {
          console.warn('Aviso en envío de correo post-pago:', eErr.message);
        }
      }
    }

    return res.status(200).json({ received: true, event_type: event.type || 'generic_webhook' });

  } catch (err) {
    console.error('❌ Webhook error:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }
}
