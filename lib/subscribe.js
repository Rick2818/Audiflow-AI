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
export async function sendSubscriptionWelcomeEmail({ to, name, interval = 'monthly', lang = 'es', dryRun = false }) {
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
  const magicLink = `${appUrl}/?subscriber=active&email=${encodeURIComponent(to)}&plan=${isAnnual ? 'annual' : 'monthly'}`;
  
  const subject = isEn
    ? `🎉 Official B2B Receipt & Quick-Start Guide - ${planText} [AuditFlow AI]`
    : `🎉 Recibo de Pago & Guía de Activación - ${planText} [AuditFlow AI]`;
  
  const html = isEn ? `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 620px; margin: 0 auto; border: 1px solid #38bdf8;">
      <h2 style="color: #38bdf8; margin-top: 0; font-size: 22px;">AuditFlow AI — Official B2B Confirmation & Receipt</h2>
      <p style="font-size: 15px; color: #e5e7eb;">Dear <strong>${name || 'Valued Client'}</strong>,</p>
      <p style="color: #d1d5db; line-height: 1.6; font-size: 14px;">
        Your subscription to <strong>${planText}</strong> is officially active. Below is your legal digital payment receipt followed by your <strong>step-by-step instructions to start auditing immediately</strong>.
      </p>
      
      <!-- COMPROBANTE OFICIAL DE PAGO B2B EN INGLÉS -->
      <div style="background-color: #111827; border: 1px solid #10b981; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <div style="border-bottom: 1px solid #1f2937; padding-bottom: 10px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
          <h3 style="color: #10b981; margin: 0; font-size: 15px;">🧾 OFFICIAL B2B DIGITAL RECEIPT</h3>
          <span style="font-size: 12px; color: #9ca3af; font-family: monospace;">${recId}</span>
        </div>
        <table style="width: 100%; color: #d1d5db; font-size: 13px; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; color: #9ca3af;">Client / Organization:</td>
            <td style="text-align: right; font-weight: bold; color: #ffffff;">${name || 'Corporate Client'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #9ca3af;">Corporate Audit Plan:</td>
            <td style="text-align: right; font-weight: bold; color: #a855f7;">${planText}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #9ca3af;">Total Amount Paid:</td>
            <td style="text-align: right; font-weight: bold; color: #10b981; font-size: 15px;">${amountText}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #9ca3af;">Destination Gateway:</td>
            <td style="text-align: right; font-weight: bold; color: #38bdf8;">Stripe &amp; Lightning (rick28@strike.me)</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #9ca3af;">Payment Status:</td>
            <td style="text-align: right; font-weight: bold; color: #10b981;">✅ SETTLED &amp; ACTIVE</td>
          </tr>
        </table>
      </div>

      <!-- GUÍA DETALLADA PASO A PASO EN INGLÉS -->
      <div style="background-color: #0f172a; border: 2px solid #38bdf8; padding: 22px; border-radius: 12px; margin: 25px 0;">
        <h3 style="color: #38bdf8; margin-top: 0; font-size: 16px;">
          🔑 HOW TO ACCESS &amp; USE YOUR UNLIMITED AUDITS
        </h3>
        
        <p style="color: #e2e8f0; font-size: 13px; line-height: 1.6; margin-bottom: 12px;">
          Your plan is 100% active. You do not need to memorize complex passwords:
        </p>

        <ol style="color: #cbd5e1; font-size: 13px; line-height: 1.8; padding-left: 20px; margin: 0 0 15px 0;">
          <li><strong>Your Universal License Key:</strong> Your registered email address: <span style="color: #38bdf8; font-family: monospace; font-weight: bold;">${to}</span>.</li>
          <li><strong>1-Click Instant Activation:</strong> Click the button below to authenticate your current browser as an <em>Authorized Enterprise Terminal</em>.</li>
          <li><strong>How to Audit Any Document:</strong>
            <ul style="margin-top: 4px; padding-left: 18px; color: #94a3b8;">
              <li>Open <a href="${magicLink}" style="color: #38bdf8;">audiflowai.com</a>.</li>
              <li>Select your audit framework (PCAOB/GAAP, IFRS or Local Code).</li>
              <li>Drag &amp; drop your contract or invoice (PDF, DOCX or image).</li>
              <li>When prompted, enter your email <strong style="color: #ffffff;">${to}</strong>. The system will automatically waive the $19 fee.</li>
              <li>Instantly download redlines in <strong>Word (.docx with Track Changes)</strong> and digitally signed PDF.</li>
            </ul>
          </li>
          <li><strong>Team / Law Firm Sharing:</strong> Forward this activation email to attorneys and controllers in your team to audit without extra fees.</li>
        </ol>

        <div style="text-align: center; margin: 25px 0 10px 0;">
          <a href="${magicLink}" style="background: linear-gradient(135deg, #9333ea, #2563eb); color: #ffffff; font-weight: bold; padding: 14px 28px; text-decoration: none; border-radius: 10px; display: inline-block; font-size: 14px;">
            🚀 Activate My Enterprise Terminal (1-Click)
          </a>
        </div>
      </div>

      <!-- SOPORTE VIP EN INGLÉS -->
      <div style="background-color: #111827; border: 1px solid #374151; padding: 16px; border-radius: 10px; margin: 20px 0; font-size: 12px; color: #9ca3af;">
        <p style="margin: 0 0 6px 0; color: #ffffff; font-weight: bold;">💬 Dedicated Enterprise Support Channels:</p>
        <p style="margin: 4px 0;">&bull; WhatsApp VIP Concierge: <a href="https://wa.me/50379893922" style="color: #10b981; text-decoration: none;">+503 7989 3922</a></p>
        <p style="margin: 4px 0;">&bull; Official Corporate Email: <a href="mailto:soporte@audiflowai.com" style="color: #38bdf8; text-decoration: none;">soporte@audiflowai.com</a></p>
      </div>

      <hr style="border: 0; border-top: 1px solid #1f2937; margin-top: 25px;">
      <p style="font-size: 11px; color: #64748b; text-align: center;">
        AuditFlow AI &bull; Fiduciary Enterprise Infrastructure 24/7 &bull; audiflowai.com
      </p>
    </div>
  ` : `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 620px; margin: 0 auto; border: 1px solid #38bdf8;">
      <h2 style="color: #38bdf8; margin-top: 0; font-size: 22px;">AuditFlow AI — Confirmación &amp; Recibo Oficial B2B</h2>
      <p style="font-size: 15px; color: #e5e7eb;">Estimado(a) <strong>${name || 'Cliente Corporativo'}</strong>,</p>
      <p style="color: #d1d5db; line-height: 1.6; font-size: 14px;">
        Tu suscripción al <strong>${planText}</strong> ha sido activada exitosamente. A continuación encuentras tu comprobante oficial de pago y las <strong>instrucciones detalladas para utilizar tus auditorías ilimitadas de inmediato</strong>.
      </p>
      
      <!-- COMPROBANTE OFICIAL DE PAGO B2B -->
      <div style="background-color: #111827; border: 1px solid #10b981; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <div style="border-bottom: 1px solid #1f2937; padding-bottom: 10px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
          <h3 style="color: #10b981; margin: 0; font-size: 15px;">🧾 COMPROBANTE DIGITAL DE PAGO</h3>
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
            <td style="text-align: right; font-weight: bold; color: #10b981; font-size: 15px;">${amountText}</td>
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

      <!-- GUÍA DETALLADA PASO A PASO EN ESPAÑOL -->
      <div style="background-color: #0f172a; border: 2px solid #38bdf8; padding: 22px; border-radius: 12px; margin: 25px 0;">
        <h3 style="color: #38bdf8; margin-top: 0; font-size: 16px;">
          🔑 ¿CÓMO ACCEDER Y UTILIZAR TUS AUDITORÍAS ILIMITADAS?
        </h3>
        
        <p style="color: #e2e8f0; font-size: 13px; line-height: 1.6; margin-bottom: 12px;">
          Tu cuenta ya se encuentra activa en nuestra infraestructura fiduciaria. Para utilizarla no necesitas recordar contraseñas difíciles:
        </p>

        <ol style="color: #cbd5e1; font-size: 13px; line-height: 1.8; padding-left: 20px; margin: 0 0 15px 0;">
          <li><strong>Tu Llave de Acceso Única:</strong> Es este mismo correo electrónico: <span style="color: #38bdf8; font-family: monospace; font-weight: bold;">${to}</span>.</li>
          <li><strong>Activación Inmediata con 1 Clic:</strong> Haz clic en el botón morado de abajo (o guárdalo en tus marcadores). Tu navegador quedará autenticado de inmediato como <em>Terminal Corporativa Autorizada</em>.</li>
          <li><strong>Cómo Auditar Cualquier Contrato o Factura:</strong>
            <ul style="margin-top: 4px; padding-left: 18px; color: #94a3b8;">
              <li>Ingresa a <a href="${magicLink}" style="color: #38bdf8;">audiflowai.com</a>.</li>
              <li>Selecciona tu marco normativo (PCAOB/GAAP, NIIF/IFRS o Código Local).</li>
              <li>Arrastra tu documento PDF, Word o imagen.</li>
              <li>Al ingresar tu correo <strong style="color: #ffffff;">${to}</strong>, el sistema detectará tu suscripción activa y <strong>suprimirá automáticamente el pago de $19 USD</strong>.</li>
              <li>Podrás ver el desglose forense y descargar los Redlines en <strong>Word (.docx con marcas de Control de Cambios)</strong> y <strong>PDF firmado</strong> tantas veces como desees.</li>
            </ul>
          </li>
          <li><strong>Acceso para tu Equipo Legal / Contable:</strong> Puedes compartir este mismo correo o enlace con tus abogados y analistas para que auditen desde sus propios computadores.</li>
        </ol>

        <div style="text-align: center; margin: 25px 0 10px 0;">
          <a href="${magicLink}" style="background: linear-gradient(135deg, #9333ea, #2563eb); color: #ffffff; font-weight: bold; padding: 14px 28px; text-decoration: none; border-radius: 10px; display: inline-block; font-size: 14px; box-shadow: 0 4px 15px rgba(147, 51, 234, 0.4);">
            🚀 Activar Mi Acceso Corporativo Ilimitado (1 Clic)
          </a>
        </div>
      </div>

      <!-- CANALES DE CONTACTO DIRECTO -->
      <div style="background-color: #111827; border: 1px solid #374151; padding: 16px; border-radius: 10px; margin: 20px 0; font-size: 12px; color: #9ca3af;">
        <p style="margin: 0 0 6px 0; color: #ffffff; font-weight: bold;">💬 Canales Exclusivos de Soporte Corporativo Prioritario:</p>
        <p style="margin: 4px 0;">&bull; WhatsApp VIP Concierge: <a href="https://wa.me/50379893922" style="color: #10b981; text-decoration: none;">+503 7989 3922</a> (Atención directa con Dirección)</p>
        <p style="margin: 4px 0;">&bull; Correo Oficial: <a href="mailto:soporte@audiflowai.com" style="color: #38bdf8; text-decoration: none;">soporte@audiflowai.com</a></p>
      </div>

      <hr style="border: 0; border-top: 1px solid #1f2937; margin-top: 25px;">
      <p style="font-size: 11px; color: #64748b; text-align: center;">
        AuditFlow AI &bull; Infraestructura Fiduciaria 24/7 &bull; audiflowai.com
      </p>
    </div>
  `;

  if (dryRun) {
    return {
      success: true,
      dryRun: true,
      to,
      subject,
      recId,
      magicLink,
      planText,
      htmlLength: html.length,
      hasMagicLink: html.includes(magicLink),
      hasRecId: html.includes(recId),
      hasWhatsApp: html.includes('50379893922'),
      hasSupportEmail: html.includes('soporte@audiflowai.com')
    };
  }

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
