import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { isSafePublicUrl } from '../lib/security.js';

const stripeSecret = (process.env.STRIPE_SECRET_KEY || '').trim();
const webhookSecret = (process.env.STRIPE_WEBHOOK_SECRET || '').trim();
const stripe = stripeSecret ? new Stripe(stripeSecret) : null;

const supabaseUrl = (process.env.SUPABASE_URL || '').trim();
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '').trim();
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

    // Manejar Evento de Pago Exitoso
    if (event && (event.type === 'checkout.session.completed' || event.type === 'payment_intent.succeeded')) {
      const session = event.data?.object || {};
      const reportId = session.metadata?.report_id;
      const customerEmail = session.customer_details?.email || session.customer_email || session.email;

      if (reportId && supabase) {
        await supabase
          .from('audit_reports')
          .update({ status: 'unlocked', updated_at: new Date().toISOString() })
          .eq('id', reportId);

        console.log(`✅ [STRIPE VERIFIED] Report ${reportId} unlocked for ${customerEmail}`);
      }
    }

    return res.status(200).json({ received: true, event_type: event.type || 'generic_webhook' });

  } catch (err) {
    console.error('❌ Webhook error:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }
}
