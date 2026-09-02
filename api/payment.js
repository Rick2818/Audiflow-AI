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

    // Flujo 1-Click Checkout con Token Wompi (Card-on-File / Tokenización)
    if (path.includes('one-click') || body.action === 'one-click' || body.cardToken) {
      const { cardToken, productId = 'report_entry_9', idempotencyKey } = body;
      
      if (!cardToken || typeof cardToken !== 'string' || cardToken.trim().length === 0) {
        return res.status(400).json({ error: 'Token de tarjeta no proporcionado o formato inválido.' });
      }

      // Catálogo Oficial en Servidor (Previene Parameter Tampering / Manipulación de Precios)
      const CATALOGO_PRECIOS = {
        'report_entry_9': { amount: 9.00, currency: 'USD', name: 'Boleto de Entrada Fiduciario ($9 USD)' },
        'modulo_facturacion_9_99': { amount: 9.99, currency: 'USD', name: 'Módulo de Facturación Automática DTE' },
        'modulo_redlines_19_99': { amount: 19.99, currency: 'USD', name: 'Generador de Redlines Word (.docx)' },
        'plan_pro_69': { amount: 69.00, currency: 'USD', name: 'Suscripción AuditFlow Pro ($69/mes)' }
      };

      const selectedProduct = CATALOGO_PRECIOS[productId] || CATALOGO_PRECIOS['report_entry_9'];

      const wompiSecret = process.env.WOMPI_API_SECRET || '';
      const wompiAppId = process.env.WOMPI_APP_ID || '';
      const wompiUrl = process.env.WOMPI_API_URL || 'https://api.wompi.sv';

      // Principio Fail-Closed: En producción nunca aprobar gratis si falta la credencial
      if (process.env.NODE_ENV === 'production' && (!wompiSecret || wompiSecret.includes('tu_api_secret'))) {
        return res.status(503).json({ error: 'Pasarela Wompi en mantenimiento o configuración pendiente. Por favor contacta a soporte.' });
      }

      // Modo desarrollo / simulación controlada
      if (!wompiSecret || wompiSecret.includes('tu_api_secret') || process.env.NODE_ENV !== 'production') {
        const fakeAuth = `AUTH_${Math.floor(100000 + Math.random() * 900000)}`;
        return res.json({
          success: true,
          oneClick: true,
          status: 'APROBADA',
          authorizationCode: fakeAuth,
          transactionId: `wompi_tx_${Date.now()}`,
          montoCobrado: selectedProduct.amount,
          moneda: selectedProduct.currency,
          message: `Cobro a 1 Clic aprobado exitosamente ($${selectedProduct.amount} ${selectedProduct.currency}). Acceso desbloqueado.`,
          report_id
        });
      }

      try {
        const wompiRes = await fetch(`${wompiUrl}/TransaccionCompraToken`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${wompiSecret}`,
            'X-App-Id': wompiAppId
          },
          body: JSON.stringify({
            tarjetaToken: cardToken.trim(),
            monto: selectedProduct.amount,
            moneda: selectedProduct.currency,
            descripcion: `AuditFlow AI - ${selectedProduct.name} - Ref: ${report_id}`,
            emailCliente: email ? String(email).trim() : 'cliente@audiflowai.com',
            idTransaccionReferencia: `af_${report_id}_${Date.now()}`
          })
        });

        const wompiData = await wompiRes.json();
        if (wompiRes.ok && wompiData.esAprobada) {
          return res.json({
            success: true,
            oneClick: true,
            status: 'APROBADA',
            authorizationCode: wompiData.codigoAutorizacion,
            transactionId: wompiData.idTransaccion,
            montoCobrado: selectedProduct.amount,
            message: 'Cobro a 1 Clic aprobado exitosamente por Wompi SV.',
            report_id
          });
        } else {
          return res.status(402).json({
            error: wompiData.mensaje || 'El banco emisor declinó la transacción.',
            code: wompiData.codigoError || 'BANK_DECLINED'
          });
        }
      } catch (wompiErr) {
        return res.status(502).json({ error: 'No fue posible conectar con el procesador bancario Wompi.' });
      }
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

      const satsAmount = Math.round((9 / btcPrice) * 100000000);
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
              description: `AuditFlow AI Boleto de Entrada Fiduciario ($9 USD): ${document_name || report_id}`,
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
        lightning_invoice: "lnbc90u1p3...mock_lightning_invoice_auditflow_ai",
        sats_amount: satsAmount,
        checkout_url: `${req.headers.origin || 'https://audiflowai.com'}/?reportId=${report_id}&status=success`
      });
    }

    // Flujo Stripe Checkout ($9.00 USD - Boleto de Entrada Fiduciario)
    if (stripe) {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Boleto de Entrada: Reporte Ejecutivo + Word DOCX Redlines + PDF Certificado',
              description: `AuditFlow AI - Auditoría profunda con 3 soluciones tácticas para ${document_name || 'contrato.pdf'}`
            },
            unit_amount: 900,
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
