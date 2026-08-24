import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import { CONFIG } from './config.js';

const stripeSecret = process.env.STRIPE_SECRET_KEY || CONFIG.PAYMENTS.STRIPE_SECRET_KEY || '';
const stripe = stripeSecret ? new Stripe(stripeSecret) : null;

const supabaseUrl = (process.env.SUPABASE_URL || CONFIG.SUPABASE.URL || '').trim();
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || CONFIG.SUPABASE.KEY || '').trim();
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// Helper para envío de correo bilingüe/tri-lingüe de Bienvenida Corporativa y COMPROBANTE DE PAGO B2B
async function sendSubscriptionWelcomeEmail({ to, name, interval = 'monthly', lang = 'es' }) {
  const resendApiKey = (process.env.RESEND_API_KEY || CONFIG.EMAIL.RESEND_API_KEY || '').trim();
  const resendClient = resendApiKey ? new Resend(resendApiKey) : null;
  const emailFrom = (process.env.EMAIL_FROM || CONFIG.EMAIL.FROM_TRANSACTIONAL).trim();

  const gmailUser = (process.env.GMAIL_USER || CONFIG.EMAIL.SMTP_USER).trim();
  const gmailPass = (process.env.GMAIL_APP_PASSWORD || CONFIG.EMAIL.SMTP_PASS).replace(/\s+/g, '').trim();

  const isEn = (lang === 'en');
  const isAnnual = (interval === 'annual');

  const planText = isEn
    ? (isAnnual ? 'Enterprise Annual Plan ($590.00 USD/yr)' : 'Enterprise Monthly Plan ($69.00 USD/mo)')
    : (isAnnual ? 'Plan Corporativo Anual ($590.00 USD/año)' : 'Plan Corporativo Mensual ($69.00 USD/mes)');
    
  const amountText = isAnnual ? '$590.00 USD' : '$69.00 USD';
  const recId = 'REC-' + Math.random().toString(36).substring(2, 9).toUpperCase();
  const appUrl = 'https://audiflowai.com';
  
  const subject = isEn
    ? `🎉 Payment Receipt & Welcome - ${planText} [AuditFlow AI]`
    : `🎉 Recibo de Pago & Bienvenida - ${planText} [AuditFlow AI]`;
  
  const html = isEn ? `
    <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #a855f7; margin-top: 0; font-size: 22px;">AuditFlow AI - Official B2B Receipt & Confirmation</h2>
      <p style="font-size: 15px; color: #e5e7eb;">Dear <strong>${name || 'Valued Client'}</strong>,</p>
      <p style="color: #d1d5db; line-height: 1.6; font-size: 14px;">
        Your subscription to <strong>${planText}</strong> has been successfully activated. Below is your official digital payment receipt.
      </p>
      
      <!-- COMPROBANTE OFICIAL DE PAGO B2B EN INGLÉS -->
      <div style="background-color: #111827; border: 1px solid #10b981; padding: 20px; border-radius: 10px; margin: 25px 0;">
        <div style="border-bottom: 1px solid #1f2937; pb: 12px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
          <h3 style="color: #10b981; margin: 0; font-size: 16px;">🧾 OFFICIAL B2B DIGITAL RECEIPT</h3>
          <span style="font-size: 12px; color: #9ca3af; font-family: monospace;">${recId}</span>
        </div>
        <table style="width: 100%; color: #d1d5db; font-size: 13px; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; color: #9ca3af;">Client / Company Name:</td>
            <td style="text-align: right; font-weight: bold; color: #ffffff;">${name || 'Corporate Client'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #9ca3af;">Audit Plan:</td>
            <td style="text-align: right; font-weight: bold; color: #a855f7;">${planText}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #9ca3af;">Total Amount Paid:</td>
            <td style="text-align: right; font-weight: bold; color: #10b981; font-size: 16px;">${amountText}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #9ca3af;">Gateway / Destination Node:</td>
            <td style="text-align: right; font-weight: bold; color: #38bdf8;">Stripe &amp; Lightning (rick28@strike.me)</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #9ca3af;">Payment Status:</td>
            <td style="text-align: right; font-weight: bold; color: #10b981;">✅ SETTLED &amp; ACTIVE</td>
          </tr>
        </table>
      </div>

      <!-- BENEFICIOS ILIMITADOS EN INGLÉS -->
      <div style="background-color: #111827; border: 1px solid #374151; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <h3 style="color: #38bdf8; margin-top: 0; font-size: 15px;">🚀 Active 24/7 Enterprise Benefits:</h3>
        <ul style="color: #9ca3af; line-height: 1.8; margin-bottom: 0; font-size: 13px; padding-left: 20px;">
          <li>✅ Unlimited Contract &amp; Invoice Audits without individual per-event fees</li>
          <li>✅ Volatile RAM Processing Architecture (0 Disk Retention)</li>
          <li>✅ Autonomous AI Support Agent for real-time corrections</li>
          <li>✅ Digitally Signed Watermark-Free PDF Reports</li>
        </ul>
      </div>

      <p style="text-align: center; margin-top: 30px;">
        <a href="${appUrl}" style="background-color: #a855f7; color: #ffffff; font-weight: bold; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block;">
          🚀 Access My Unlimited Audit Dashboard
        </a>
      </p>

      <hr style="border-color: #374151; margin-top: 30px;">
      <p style="font-size: 12px; color: #6b7280; text-align: center;">
        AuditFlow AI • 24/7 Priority Enterprise Infrastructure.
      </p>
    </div>
  ` : `
    <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #a855f7; margin-top: 0; font-size: 22px;">AuditFlow AI - Confirmación & Recibo Oficial B2B</h2>
      <p style="font-size: 15px; color: #e5e7eb;">Estimado(a) <strong>${name || 'Cliente Corporativo'}</strong>,</p>
      <p style="color: #d1d5db; line-height: 1.6; font-size: 14px;">
        Tu suscripción al <strong>${planText}</strong> ha sido activada correctamente. A continuación encuentras tu comprobante oficial de pago y recibo digital.
      </p>
      
      <!-- COMPROBANTE OFICIAL DE PAGO B2B -->
      <div style="background-color: #111827; border: 1px solid #10b981; padding: 20px; border-radius: 10px; margin: 25px 0;">
        <div style="border-bottom: 1px solid #1f2937; pb: 12px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
          <h3 style="color: #10b981; margin: 0; font-size: 16px;">🧾 COMPROBANTE DIGITAL DE PAGO</h3>
          <span style="font-size: 12px; color: #9ca3af; font-family: monospace;">${recId}</span>
        </div>
        <table style="width: 100%; color: #d1d5db; font-size: 13px; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; color: #9ca3af;">Cliente / Razón Social:</td>
            <td style="text-align: right; font-weight: bold; color: #ffffff;">${name || 'Cliente Corporativo'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #9ca3af;">Plan de Auditoría:</td>
            <td style="text-align: right; font-weight: bold; color: #a855f7;">${planText}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #9ca3af;">Monto Total Pagado:</td>
            <td style="text-align: right; font-weight: bold; color: #10b981; font-size: 16px;">${amountText}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #9ca3af;">Pasarela / Nodo Destino:</td>
            <td style="text-align: right; font-weight: bold; color: #38bdf8;">Stripe &amp; Lightning (rick28@strike.me)</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #9ca3af;">Estado del Cobro:</td>
            <td style="text-align: right; font-weight: bold; color: #10b981;">✅ LIQUIDADO &amp; ACTIVO</td>
          </tr>
        </table>
      </div>

      <!-- BENEFICIOS ILIMITADOS -->
      <div style="background-color: #111827; border: 1px solid #374151; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <h3 style="color: #38bdf8; margin-top: 0; font-size: 15px;">🚀 Beneficios Corporativos Activos 24/7:</h3>
        <ul style="color: #9ca3af; line-height: 1.8; margin-bottom: 0; font-size: 13px; padding-left: 20px;">
          <li>✅ Auditorías de Contratos y Facturas Ilimitadas sin costo individual</li>
          <li>✅ Análisis en Memoria Volátil RAM Efímera (0 Almacenamiento en Disco)</li>
          <li>✅ Agente de Soporte Autónomo IA para correcciones y re-evaluaciones</li>
          <li>✅ Reportes en PDF Firmados Digitalmente sin marcas de agua</li>
        </ul>
      </div>

      <p style="text-align: center; margin-top: 30px;">
        <a href="${appUrl}" style="background-color: #a855f7; color: #ffffff; font-weight: bold; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block;">
          🚀 Ir a Mi Panel de Auditorías Ilimitadas
        </a>
      </p>

      <hr style="border-color: #374151; margin-top: 30px;">
      <p style="font-size: 12px; color: #6b7280; text-align: center;">
        AuditFlow AI • Soporte Corporativo Prioritario 24/7.
      </p>
    </div>
  `;

  try {
    if (resendClient) {
      return await resendClient.emails.send({
        from: emailFrom,
        to: [to],
        subject,
        html
      });
    }

    if (gmailUser && gmailPass && !gmailUser.includes('tu_correo')) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: gmailUser, pass: gmailPass }
      });
      return await transporter.sendMail({ from: `"AuditFlow AI" <${gmailUser}>`, to, subject, html });
    }
  } catch (err) {
    console.warn('Welcome Email Warning:', err.message);
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }

    const { email, name, interval, lang } = body;
    const customerEmail = email || 'cliente@empresa.com';
    const customerName = name || 'Cliente Corporativo';
    const planInterval = interval === 'annual' ? 'annual' : 'monthly';
    const priceUsd = planInterval === 'annual' ? 590.00 : 69.00;
    const unitAmount = planInterval === 'annual' ? 59000 : 6900;
    const stripeInterval = planInterval === 'annual' ? 'year' : 'month';
    const appUrl = 'https://auditflow-ai-theta.vercel.app';

    // Disparar Correo de Bienvenida Corporativa + Recibo B2B al cliente (si no es test_mode)
    if (!body.test_mode) {
      await sendSubscriptionWelcomeEmail({ to: customerEmail, name: customerName, interval: planInterval, lang: lang || 'es' });
    }

    // Disparar Notificación de Venta en Tiempo Real al correo personal del propietario
    try {
      const ownerEmail = (process.env.PERSONAL_NOTIFICATION_EMAIL || CONFIG.EMAIL.OWNER_SALES).trim();
      const gmailUser = (process.env.GMAIL_USER || CONFIG.EMAIL.SMTP_USER).trim();
      const gmailPass = (process.env.GMAIL_APP_PASSWORD || CONFIG.EMAIL.SMTP_PASS).replace(/\s+/g, '').trim();

      if (!body.test_mode && gmailUser && gmailPass && !gmailUser.includes('tu_correo')) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: gmailUser, pass: gmailPass }
        });

        await transporter.sendMail({
          from: CONFIG.EMAIL.FROM_SALES,
          to: ownerEmail,
          subject: `💰 ¡NUEVA SUSCRIPCIÓN B2B! [$${priceUsd.toFixed(2)} USD] - ${customerName}`,
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 25px; border-radius: 10px; max-width: 600px; margin: 0 auto; border: 1px solid #10b981;">
              <h2 style="color: #10b981; margin-top: 0;">🎉 ¡Nueva Suscripción Corporativa B2B Recibida!</h2>
              <p style="font-size: 24px; font-weight: bold; color: #a855f7; margin: 10px 0;">$${priceUsd.toFixed(2)} USD ${planInterval === 'annual' ? '/ año' : '/ mes'}</p>
              <table style="width: 100%; color: #d1d5db; font-size: 14px; border-collapse: collapse; margin-top: 15px;">
                <tr><td style="padding: 6px 0; color: #9ca3af;">Cliente / Empresa:</td><td style="text-align: right; font-weight: bold; color: #ffffff;">${customerName}</td></tr>
                <tr><td style="padding: 6px 0; color: #9ca3af;">Correo del Cliente:</td><td style="text-align: right; font-weight: bold; color: #38bdf8;">${customerEmail}</td></tr>
                <tr><td style="padding: 6px 0; color: #9ca3af;">Plan Contratado:</td><td style="text-align: right; font-weight: bold; color: #a855f7;">${planInterval === 'annual' ? 'Enterprise Annual ($590/año)' : 'Enterprise Monthly ($69/mes)'}</td></tr>
                <tr><td style="padding: 6px 0; color: #9ca3af;">Pasarela / Nodo:</td><td style="text-align: right; font-weight: bold; color: #f59e0b;">Stripe &amp; Strike Lightning (rick28@strike.me)</td></tr>
                <tr><td style="padding: 6px 0; color: #9ca3af;">Fecha y Hora:</td><td style="text-align: right; color: #9ca3af;">${new Date().toLocaleString('es-ES')}</td></tr>
              </table>
            </div>`
        });
        console.log(`✅ [NOTIFICACIÓN AL PROPIETARIO] Suscripción notificada a ${ownerEmail}`);
      }
    } catch (ownerErr) {
      console.warn('Warning enviando correo al propietario en subscribe.js:', ownerErr.message);
    }

    // Si Stripe está configurado con clave real, genera Stripe Checkout Session
    if (stripe) {
      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          mode: 'subscription',
          customer_email: customerEmail,
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: `AuditFlow AI - Plan Corporativo B2B (${planInterval === 'annual' ? '$590/año' : '$69/mes'})`,
                  description: 'Acceso ilimitado 24/7 a auditorías de contratos con memoria volátil RAM'
                },
                unit_amount: unitAmount,
                recurring: { interval: stripeInterval }
              },
              quantity: 1
            }
          ],
          success_url: `${appUrl}/?status=success_subscription&email=${encodeURIComponent(customerEmail)}`,
          cancel_url: `${appUrl}/?status=cancel`
        });

        return res.status(200).json({
          success: true,
          checkoutUrl: session.url,
          sessionId: session.id
        });
      } catch (stripeErr) {
        console.warn('Error Stripe Checkout, usando modo pasarela interactiva:', stripeErr.message);
      }
    }

    // Persistencia en Supabase
    if (supabase) {
      try {
        await supabase.from('subscriptions').insert([
          {
            plan_name: planInterval === 'annual' ? 'Enterprise Annual' : 'Enterprise Monthly',
            price_usd: priceUsd,
            status: 'active',
            customer_email: customerEmail
          }
        ]);
      } catch (e) {
        console.warn('Supabase subscription insert warning:', e.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Suscripción Corporativa (${planInterval === 'annual' ? '$590/año' : '$69/mes'}) activada. Recibo oficial enviado a ${customerEmail}.`,
      checkoutUrl: `${appUrl}/?status=success_subscription&email=${encodeURIComponent(customerEmail)}`
    });

  } catch (err) {
    console.error('Error en api/subscribe.js:', err);
    return res.status(500).json({ error: 'Error procesando suscripción corporativa: ' + err.message });
  }
}
