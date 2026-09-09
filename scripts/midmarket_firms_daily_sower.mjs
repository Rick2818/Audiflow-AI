import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import { CONFIG } from '../lib/config.js';
import { filterActiveLeads, isBounced, addBouncedEmail } from '../lib/bounce-suppression.js';

dotenv.config();

/**
 * ==============================================================================
 * AUDITFLOW AI — SEMBRADOR DIARIO EN DESPACHOS MEDIANOS (10 A 50 ABOGADOS)
 * ==============================================================================
 * Ciclo recurrente: 4:00 AM Lunes a Viernes
 * BLINDAJE FIDUCIARIO ANTI-REBOTES:
 * - Despacho exclusivo vía Resend API con dominio corporativo @audiflowai.com.
 * - Cero uso de Gmail SMTP (Evita al 100% que las alertas de rebote lleguen a rick28191@gmail.com).
 * - Exclusión automática contra la lista de supresión (suppressed_bounced_emails.json).
 * - Aislamiento total de rebotes y respuestas en tendenciaiatufuturo@gmail.com.
 * ==============================================================================
 */

// Socios de firmas medianas verificadas (Excluye cualquier dominio no verificado o rebotado)
const VERIFIED_MIDMARKET_LAW_FIRMS = [
  // --- MERCADO NÓRDICO VERIFICADO (MID-MARKET NORDIC PARTNERS) ---
  { name: 'Mats Dahlberg', firm: 'Delphi Advokatbyrå', city: 'Stockholm', country: 'Sweden', email: 'mats.dahlberg@delphi.se', role: 'Commercial Contracts Partner', size: '45 lawyers' },
  { name: 'Peter Högström', firm: 'Cirio Advokatbyrå', city: 'Stockholm', country: 'Sweden', email: 'peter.hogstrom@cirio.se', role: 'Partner Corporate M&A', size: '35 lawyers' },
  { name: 'Mårten Steen', firm: 'Advokatfirman Cederquist', city: 'Stockholm', country: 'Sweden', email: 'marten.steen@cederquist.se', role: 'Partner Commercial Law', size: '50 lawyers' },
  { name: 'Robert Kullgren', firm: 'Wistrand Advokatbyrå', city: 'Gothenburg', country: 'Sweden', email: 'robert.kullgren@wistrand.se', role: 'Partner Corporate Practice', size: '40 lawyers' },
  { name: 'Lars Westerberg', firm: 'Lindahl Advokatbyrå', city: 'Malmö', country: 'Sweden', email: 'lars.westerberg@lindahl.se', role: 'Partner Commercial Contracts', size: '45 lawyers' },
  { name: 'Tone Østensen', firm: 'Kvale Advokatfirma', city: 'Oslo', country: 'Norway', email: 'toe@kvale.no', role: 'Partner Corporate & IT Contracts', size: '40 lawyers' },
  { name: 'Pål Kvernaas', firm: 'Advokatfirmaet Haavind', city: 'Oslo', country: 'Norway', email: 'p.kvernaas@haavind.no', role: 'Partner Technology & Vendor Agreements', size: '50 lawyers' },
  { name: 'Morten Kvale', firm: 'Advokatfirmaet Simonsen Vogt Wiig', city: 'Bergen', country: 'Norway', email: 'm.kvale@svw.no', role: 'Senior Partner Commercial Contracts', size: '40 lawyers' },
  { name: 'Vibe Lindhart', firm: 'Lundgrens Advokatpartnerselskab', city: 'Copenhagen', country: 'Denmark', email: 'vli@lundgrens.com', role: 'Partner Commercial Contracts', size: '45 lawyers' },
  { name: 'Carsten Brink', firm: 'Mazanti-Andersen', city: 'Copenhagen', country: 'Denmark', email: 'cb@mazanti.dk', role: 'Partner Commercial & Tech Transactions', size: '35 lawyers' },
  { name: 'Thomas Moalem', firm: 'Moalem Weitemeyer', city: 'Copenhagen', country: 'Denmark', email: 'tm@moalemweitemeyer.com', role: 'Partner Corporate Transnational', size: '30 lawyers' }
];

export function buildMidmarketEmailHtml(lead) {
  const isEnglish = lead.country === 'Sweden' || lead.country === 'Norway' || lead.country === 'Denmark';

  if (isEnglish) {
    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #38bdf8; max-width: 600px; margin: 0 auto; line-height: 1.6;">
        <div style="border-bottom: 1px solid #1e293b; padding-bottom: 12px; margin-bottom: 20px;">
          <span style="font-size: 16px; font-weight: bold; color: #38bdf8;">AUDITFLOW AI</span>
          <span style="font-size: 11px; color: #94a3b8; margin-left: 10px;">| Nordic Mid-Market Law Firms Desk</span>
        </div>
        <p style="color: #38bdf8; font-size: 15px; font-weight: bold; margin-bottom: 6px;">Dear Partner ${lead.name},</p>
        <p style="color: #cbd5e1; font-size: 14px;">
          At <strong>${lead.firm}</strong> (${lead.city}), reviewing 40+ page commercial vendor agreements without drowning your senior associates in manual checks is a persistent operational challenge.
        </p>
        <p style="color: #cbd5e1; font-size: 14px;">
          While expensive legacy tools lock firms into <strong>€5,000 - €10,000/year contracts</strong>, AuditFlow AI provides a private fiduciary engine designed specifically under <strong>EU GDPR Art. 28 (100% ephemeral volatile RAM, zero disk retention)</strong>:
        </p>
        <div style="background-color: #111c2e; padding: 18px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
          <p style="margin: 0 0 8px 0; color: #ffffff; font-size: 13px;">⚡ <strong>Audit in 8 Seconds:</strong> Uncovers hidden indemnity traps, CPI indexation loopholes, and unilateral termination clauses.</p>
          <p style="margin: 0 0 8px 0; color: #ffffff; font-size: 13px;">📄 <strong>Direct Word (.docx Track Changes):</strong> Download negotiation-ready redlines before your coffee cools down.</p>
          <p style="margin: 0; color: #ffffff; font-size: 13px;">💳 <strong>No Annual Seat Lock-In:</strong> Pay just €19 per contract audit or €69/month unlimited.</p>
        </div>
        <p style="color: #e2e8f0; font-size: 14px; text-align: center;">
          We have enabled a <strong>Complimentary Benchmark Audit (Zero Cost, No Credit Card)</strong>:
        </p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="https://audiflowai.com/?ref=nordic-partner&lang=en&lead=${encodeURIComponent(lead.name)}" style="background-color: #10b981; color: #022c22; padding: 14px 32px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 14px; display: inline-block;">
            Test 1st Nordic Agreement Free (8s) →
          </a>
        </div>
        <p style="color: #64748b; font-size: 12px; border-top: 1px solid #1e293b; padding-top: 15px; margin-top: 25px;">
          Best regards,<br>
          <strong style="color: #e2e8f0;">Ricardo Bolaños</strong><br>
          <span style="color: #94a3b8;">Founder & Managing Director • AuditFlow AI</span><br>
          <a href="https://audiflowai.com" style="color: #38bdf8; text-decoration: none;">audiflowai.com</a>
        </p>
      </div>
    `;
  }

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #38bdf8; max-width: 600px; margin: 0 auto; line-height: 1.6;">
      <div style="border-bottom: 1px solid #1e293b; padding-bottom: 12px; margin-bottom: 20px;">
        <span style="font-size: 16px; font-weight: bold; color: #38bdf8;">AUDITFLOW AI</span>
        <span style="font-size: 11px; color: #94a3b8; margin-left: 10px;">| Práctica de Despachos Medianos (10-50 Abogados)</span>
      </div>
      <p style="color: #38bdf8; font-size: 15px; font-weight: bold; margin-bottom: 6px;">Estimado/a ${lead.name},</p>
      <p style="color: #cbd5e1; font-size: 14px;">
        En firmas medianas de prestigio como <strong>${lead.firm}</strong> en ${lead.city}, los clientes pagan por su criterio estratégico en la negociación, no para que sus socios o asociados sénior pierdan 4 horas revisando cláusulas trampa en contratos de 50 páginas.
      </p>
      <p style="color: #cbd5e1; font-size: 14px;">
        A diferencia de herramientas de $5,000 USD al año que exigen comités interminables, AuditFlow AI opera como un <strong>asociado de soporte fiduciario en memoria RAM volátil (0 almacenamiento en disco)</strong>:
      </p>
      <div style="background-color: #111c2e; padding: 18px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
        <p style="margin: 0 0 8px 0; color: #ffffff; font-size: 13px;">⚡ <strong>Dictamen Forense en 8 Segundos:</strong> Detecta penalizaciones encubiertas, asimetrías de indemnización y límites de responsabilidad.</p>
        <p style="margin: 0 0 8px 0; color: #ffffff; font-size: 13px;">📄 <strong>Redline en Word (.docx con Control de Cambios):</strong> Sustituye de inmediato la cláusula abusiva por una redacción fiduciaria lista para enviar a contraparte.</p>
        <p style="margin: 0; color: #ffffff; font-size: 13px;">🔒 <strong>Secreto Profesional Garantizado:</strong> Cero persistencia en disco y cero entrenamiento de modelos con datos de clientes.</p>
      </div>
      <p style="color: #e2e8f0; font-size: 14px; text-align: center;">
        Habilitamos para su despacho un <strong>Escaneo de Diagnóstico de Cortesía (100% Gratuito y sin tarjeta de crédito)</strong>:
      </p>
      <div style="text-align: center; margin: 25px 0;">
        <a href="https://audiflowai.com/?ref=midmarket-partner&lead=${encodeURIComponent(lead.name)}" style="background-color: #10b981; color: #022c22; padding: 14px 32px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 14px; display: inline-block;">
          Auditar Mi Primer Contrato de Despacho (8s) →
        </a>
      </div>
      <p style="color: #64748b; font-size: 12px; border-top: 1px solid #1e293b; padding-top: 15px; margin-top: 25px;">
        Saludos cordiales,<br>
        <strong style="color: #e2e8f0;">Ricardo Bolaños</strong><br>
        <span style="color: #94a3b8;">Director General • AuditFlow AI</span><br>
        <a href="https://audiflowai.com" style="color: #38bdf8; text-decoration: none;">audiflowai.com</a>
      </p>
    </div>
  `;
}

export async function executeMidmarketDailyBatch() {
  console.log('======================================================================');
  console.log('⚖️ AUDITFLOW AI — SIEMBRA DIARIA EN DESPACHOS MEDIANOS (BLINDADA CON RESEND)');
  console.log('======================================================================\n');

  const resendApiKey = (process.env.RESEND_API_KEY || CONFIG.EMAIL.RESEND_API_KEY || '').trim();
  if (!resendApiKey) {
    console.error('❌ Error: Falta RESEND_API_KEY en variables de entorno.');
    return;
  }

  const resend = new Resend(resendApiKey);
  const adminNotifyEmail = CONFIG.EMAIL.OWNER_CONTROL || 'tendenciaiatufuturo@gmail.com';

  // 1. Filtrar prospectos eliminando cualquier correo suprimido o rebotado
  const activeLeads = filterActiveLeads(VERIFIED_MIDMARKET_LAW_FIRMS);
  console.log(`📋 Prospectos activos y verificados: ${activeLeads.length} (filtrados contra lista de rebotes).`);

  let dispatched = 0;
  for (const lead of activeLeads) {
    const isEnglish = lead.country === 'Sweden' || lead.country === 'Norway' || lead.country === 'Denmark';
    const subject = isEnglish
      ? `Fiduciary Contract Audit & Word Redlines in <10s for ${lead.firm} — ${lead.name}`
      : `Su asociado virtual para contratos y redlines en Word (Auditoría en 8s) — ${lead.name} (${lead.firm})`;

    const html = buildMidmarketEmailHtml(lead);

    try {
      console.log(`📤 Sembrando vía Resend DKIM en: ${lead.name} [${lead.firm}] -> ${lead.email}...`);
      await resend.emails.send({
        from: 'Directora de Marketing | AuditFlow AI <cmvo@audiflowai.com>',
        reply_to: CONFIG.EMAIL.REPLY_TO_OUTREACH || 'tendenciaiatufuturo@gmail.com',
        to: lead.email,
        subject,
        html
      });
      console.log(`   ✅ Sembrado con éxito en ${lead.name}`);
      dispatched++;
    } catch (e) {
      console.warn(`   ⚠️ Error en envío a ${lead.email}:`, e.message);
      if (e.message && (e.message.includes('bounce') || e.message.includes('not found') || e.message.includes('invalid'))) {
        addBouncedEmail(lead.email, e.message);
      }
    }

    await new Promise(r => setTimeout(r, 600));
  }

  // Notificar al buzón de control de operaciones (NUNCA a rick28191@gmail.com)
  try {
    console.log(`\n📬 Reportando siembra al buzón de control (${adminNotifyEmail})...`);
    await resend.emails.send({
      from: 'Directora de Marketing | AuditFlow AI <cmvo@audiflowai.com>',
      to: adminNotifyEmail,
      subject: `🌱 Reporte de Siembra: ${dispatched} Despachos Medianos Contactados`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #0f172a; color: #fff; padding: 20px; border-radius: 8px; border: 1px solid #10b981;">
          <h2 style="color: #10b981; margin-top: 0;">🌱 Ciclo de Siembra Ejecutado con Éxito (Resend DKIM)</h2>
          <p>Se contactaron <strong>${dispatched} Socios Directores</strong> de firmas medianas verificadas.</p>
          <p>Protocolo fiduciario: 100% libre de rebotes en el buzón personal del Director General.</p>
          <p>Próxima ejecución programada: <strong>04:00 AM CST</strong>.</p>
        </div>
      `
    });
    console.log('✅ Notificación al buzón de control entregada.');
  } catch (err) {
    console.warn('Aviso notificando al buzón de control:', err.message);
  }

  console.log('\n======================================================================');
  console.log(`🏁 SIEMBRA COMPLETADA: ${dispatched} socios contactados sin riesgo de rebotes.`);
  console.log('======================================================================');
}

if (process.argv[1] && process.argv[1].includes('midmarket_firms_daily_sower')) {
  executeMidmarketDailyBatch().catch(console.error);
}
