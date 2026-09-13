import Stripe from 'stripe';
import subscribeHandler from '../lib/subscribe.js';
import verifyClientHandler from '../lib/verify-client.js';
import { CONFIG } from '../lib/config.js';

const stripeSecret = process.env.STRIPE_SECRET_KEY || CONFIG.PAYMENTS.STRIPE_SECRET_KEY || '';
const stripe = stripeSecret ? new Stripe(stripeSecret) : null;

const ALLOWED_ORIGINS = new Set([
  'https://audiflowai.com',
  'https://www.audiflowai.com',
  'http://localhost:3000',
  'http://localhost:5173'
]);

export default async function handler(req, res) {
  const origin = req.headers ? (req.headers.origin || req.headers.Origin) : null;
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://audiflowai.com');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    const path = req.url || '';
    if (path.includes('verify-client') || path.includes('verify_client') || body.action === 'verify_client' || body.action === 'verify-client') {
      return await verifyClientHandler(req, res);
    }
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

      const CATALOGO_PRECIOS = {
        'report_unlock_19': { amount: 19.00, currency: 'USD', name: 'Informe Oficial Word .docx + PDF ($19 USD)' },
        'plan_pro_69': { amount: 69.00, currency: 'USD', name: 'Suscripción AuditFlow Pro ($69/mes)' },
        'plan_anual_590': { amount: 590.00, currency: 'USD', name: 'Licencia Corporativa Anual ($590/año)' },
        'modulo_facturacion_9_99': { amount: 9.99, currency: 'USD', name: 'Módulo de Facturación Automática DTE' },
        'modulo_redlines_19_99': { amount: 19.99, currency: 'USD', name: 'Generador de Redlines Word (.docx)' }
      };

      const selectedProduct = CATALOGO_PRECIOS[productId] || CATALOGO_PRECIOS['report_unlock_19'];

      const wompiSecret = process.env.WOMPI_API_SECRET || '';
      const wompiAppId = process.env.WOMPI_APP_ID || '';
      const wompiUrl = process.env.WOMPI_API_URL || 'https://api.wompi.sv';

      if (!wompiSecret || wompiSecret.includes('tu_api_secret') || !wompiAppId) {
        return res.status(503).json({
          error: 'Pasarela de cobro Wompi no configurada en producción real. Queda prohibida la simulación de cobros.',
          code: 'REAL_PAYMENT_REQUIRED'
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

    // Flujo Lightning / Strike (LUD-16 & LNURL-pay a rick28@strike.me)
    if (path.includes('lightning') || body.gateway === 'lightning') {
      const amountUsd = Number(body.amount_usd) || 19.00;
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

      const satsAmount = Math.round((amountUsd / btcPrice) * 100000000);
      const millisats = satsAmount * 1000;
      const strikeAddress = process.env.LIGHTNING_ADDRESS || CONFIG.PAYMENTS.LIGHTNING_ADDRESS || 'rick28@strike.me';
      const strikeUser = strikeAddress.split('@')[0] || 'rick28';

      let realBolt11 = null;
      try {
        const strikeRes = await fetch(`https://strike.me/api/lnurlp/${strikeUser}/?amount=${millisats}`);
        if (strikeRes.ok) {
          const strikeJson = await strikeRes.json();
          if (strikeJson?.pr) {
            realBolt11 = strikeJson.pr;
          }
        }
      } catch (strikeErr) {
        console.warn('Error obteniendo invoice directo de Strike:', strikeErr);
      }

      const invoice = realBolt11 || `lightning:${strikeAddress}`;

      return res.json({
        success: true,
        lightningInvoice: invoice,
        lightning_invoice: invoice,
        amountSats: satsAmount,
        sats_amount: satsAmount,
        strikeAddress: strikeAddress,
        checkout_url: `https://strike.me/${strikeUser}`
      });
    }

    // Flujo Stripe Checkout (Fallback opcional secundario si está configurado en entorno)
    if (stripe) {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Reporte Oficial: Word DOCX Redlines + PDF Certificado ($19.00 USD)',
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

      return res.status(200).json({ checkoutUrl: session.url });
    }

    // Pasarela Oficial y Primaria: Wompi El Salvador ($19 USD)
    // Cero bypass libre: Requiere checkout fiduciario verificado
    const defaultWompiLink = CONFIG.PAYMENTS.WOMPI_LINK_19 || 'https://wompi.sv';
    return res.status(200).json({
      success: true,
      gateway: 'wompi',
      checkoutUrl: defaultWompiLink,
      report_id
    });

  } catch (err) {
    console.error('Error procesando pago fiduciario:', err);
    return res.status(500).json({ error: 'Error procesando pasarela de pago fiduciario. Transacción registrada de forma segura.' });
  }
}
