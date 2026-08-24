import Stripe from 'stripe';
import subscribeHandler from '../lib/subscribe.js';
import { CONFIG } from '../lib/config.js';

const stripeSecret = process.env.STRIPE_SECRET_KEY || CONFIG.PAYMENTS.STRIPE_SECRET_KEY || '';
const stripe = stripeSecret ? new Stripe(stripeSecret) : null;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    const path = req.url || '';
    if (path.includes('subscribe') || body.interval) {
      return await subscribeHandler(req, res);
    }

    const { report_id, email, document_name } = body;

    if (!report_id && !path.includes('subscribe')) {
      return res.status(400).json({ error: 'El ID del reporte es requerido.' });
    }

    // Flujo Wompi El Salvador (Tarjetas de Crédito / Débito Visa & Mastercard)
    if (path.includes('wompi') || body.gateway === 'wompi') {
      const wompiLink = CONFIG.PAYMENTS.WOMPI_LINK_19 || 'https://wompi.sv';
      return res.json({
        success: true,
        gateway: 'wompi',
        checkoutUrl: wompiLink,
        report_id
      });
    }

    // Flujo Lightning / OpenNode
    if (path.includes('lightning')) {
      let btcPrice = 65000;
      try {
        const priceRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        if (priceRes.ok) {
          const priceJson = await priceRes.json();
          if (priceJson?.bitcoin?.usd && priceJson.bitcoin.usd > 0) {
            btcPrice = priceJson.bitcoin.usd;
          }
        }
      } catch (priceErr) {
        console.warn('Usando precio BTC por defecto $65,000 USD');
      }

      const satsAmount = Math.round((19 / btcPrice) * 100000000);
      const openNodeKey = process.env.OPENNODE_API_KEY;

      if (openNodeKey && !openNodeKey.includes('tu_opennode')) {
        try {
          const openNodeRes = await fetch('https://api.opennode.com/v1/charges', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': openNodeKey
            },
            body: JSON.stringify({
              amount: satsAmount,
              description: `AuditFlow AI Reporte Ejecutivo B2B: ${document_name || report_id}`,
              currency: 'SATS',
              callback_url: `${req.headers.origin || 'https://audiflowai.com'}/api/webhooks/lightning`,
              success_url: `${req.headers.origin || 'https://audiflowai.com'}/?reportId=${report_id}&status=success`
            })
          });

          if (openNodeRes.ok) {
            const chargeData = await openNodeRes.json();
            return res.json({
              lightning_invoice: chargeData.data.lightning_invoice.payreq,
              sats_amount: satsAmount,
              checkout_url: chargeData.data.hosted_checkout_url
            });
          }
        } catch (openNodeErr) {
          console.warn('Error llamando OpenNode API:', openNodeErr);
        }
      }

      return res.json({
        lightning_invoice: "lnbc190u1p3...mock_lightning_invoice_auditflow_ai",
        sats_amount: satsAmount,
        checkout_url: `${req.headers.origin || 'https://audiflowai.com'}/?reportId=${report_id}&status=success`
      });
    }

    // Flujo Stripe Checkout ($19.00 USD)
    if (stripe) {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Reporte Ejecutivo + Word DOCX Redlines + PDF Certificado',
              description: `AuditFlow AI - Auditoría profunda con 3 soluciones tácticas para ${document_name || 'contrato.pdf'}`
            },
            unit_amount: 1900,
          },
          quantity: 1,
        }],
        mode: 'payment',
        customer_email: email || undefined,
        success_url: `${req.headers.origin || 'https://audiflowai.com'}/?reportId=${report_id}&status=success`,
        cancel_url: `${req.headers.origin || 'https://audiflowai.com'}/?reportId=${report_id}&status=cancel`,
        metadata: { report_id }
      });

      return res.json({ checkoutUrl: session.url });
    }

    return res.json({
      checkoutUrl: `${req.headers.origin || 'https://audiflowai.com'}/?reportId=${report_id}&status=success`
    });

  } catch (err) {
    return res.status(500).json({ error: 'Error procesando pago: ' + err.message });
  }
}
