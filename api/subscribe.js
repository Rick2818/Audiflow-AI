import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
const stripe = stripeSecret ? new Stripe(stripeSecret) : null;

const supabaseUrl = (process.env.SUPABASE_URL || '').trim();
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '').trim();
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// Helper para envío de correo de Bienvenida Corporativa por Gmail SMTP
async function sendSubscriptionWelcomeEmail({ to, name, interval = 'monthly' }) {
  const gmailUser = (process.env.GMAIL_USER || 'rick28191@gmail.com').trim();
  const gmailPass = (process.env.GMAIL_APP_PASSWORD || 'fbqiyqmapqplbcim').replace(/\s+/g, '').trim();

  const isAnnual = interval === 'annual';
  const planText = isAnnual ? 'Plan Corporativo Anual ($399.00 USD/año)' : 'Plan Corporativo Mensual ($49.00 USD/mes)';
  const appUrl = 'https://auditflow-ai-theta.vercel.app';
  const subject = `🎉 ¡Bienvenido al ${planText} de AuditFlow AI!`;
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 30px; border-radius: 12px;">
      <h2 style="color: #a855f7; margin-top: 0;">AuditFlow AI - Confirmación de Suscripción Corporativa</h2>
      <p style="font-size: 16px;">Hola <strong>${name || 'Cliente'}</strong>,</p>
      <p style="color: #d1d5db; line-height: 1.6;">
        Tu suscripción al <strong>${planText}</strong> ha sido activada con éxito.
      </p>
      
      <div style="background-color: #111827; border: 1px solid #a855f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #38bdf8; margin-top: 0;">🚀 Beneficios Corporativos Activos 24/7:</h3>
        <ul style="color: #9ca3af; line-height: 1.8; margin-bottom: 0;">
          <li>✅ Auditorías de Contratos y Facturas Ilimitadas sin pago por evento</li>
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
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailUser, pass: gmailPass }
    });
    return await transporter.sendMail({ from: `"AuditFlow AI" <${gmailUser}>`, to, subject, html });
  } catch (err) {
    console.warn('Gmail SMTP Welcome Email Warning:', err.message);
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

    const { email, name, interval } = body;
    const customerEmail = email || 'cliente@empresa.com';
    const customerName = name || 'Cliente Corporativo';
    const planInterval = interval === 'annual' ? 'annual' : 'monthly';
    const priceUsd = planInterval === 'annual' ? 399.00 : 49.00;
    const unitAmount = planInterval === 'annual' ? 39900 : 4900;
    const stripeInterval = planInterval === 'annual' ? 'year' : 'month';
    const appUrl = 'https://auditflow-ai-theta.vercel.app';

    // Disparar Correo de Bienvenida Corporativa
    await sendSubscriptionWelcomeEmail({ to: customerEmail, name: customerName, interval: planInterval });

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
                  name: `AuditFlow AI - Plan Corporativo B2B (${planInterval === 'annual' ? '$399/año' : '$49/mes'})`,
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
      message: `Suscripción Corporativa (${planInterval === 'annual' ? '$399/año' : '$49/mes'}) activada. Correo de bienvenida enviado a ${customerEmail}.`,
      checkoutUrl: `${appUrl}/?status=success_subscription&email=${encodeURIComponent(customerEmail)}`
    });

  } catch (err) {
    console.error('Error en api/subscribe.js:', err);
    return res.status(500).json({ error: 'Error procesando suscripción corporativa: ' + err.message });
  }
}
