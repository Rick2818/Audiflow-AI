import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import { CONFIG } from '../lib/config.js';
import { filterActiveLeads } from '../lib/bounce-suppression.js';

dotenv.config();

/**
 * ==============================================================================
 * AUDITFLOW AI — CAMPAÑA DE REFUERZO SECTOR MEDIO (VIERNES 2:00 PM CST)
 * ==============================================================================
 * Despacho exclusivo mediante Resend API con certificación DKIM corporativa.
 * Aislamiento total de rebotes: NUNCA envía desde ni notifica a rick28191@gmail.com.
 * ==============================================================================
 */

const REINFORCEMENT_TARGETS = [
  { name: 'Mats Dahlberg', firm: 'Delphi Advokatbyrå', city: 'Stockholm', email: 'mats.dahlberg@delphi.se' },
  { name: 'Peter Högström', firm: 'Cirio Advokatbyrå', city: 'Stockholm', email: 'peter.hogstrom@cirio.se' },
  { name: 'Mårten Steen', firm: 'Advokatfirman Cederquist', city: 'Stockholm', email: 'marten.steen@cederquist.se' },
  { name: 'Tone Østensen', firm: 'Kvale Advokatfirma', city: 'Oslo', email: 'toe@kvale.no' },
  { name: 'Vibe Lindhart', firm: 'Lundgrens Advokatpartnerselskab', city: 'Copenhagen', email: 'vli@lundgrens.com' }
];

export async function runMidmarketReinforcementCampaign() {
  console.log('================================================================================');
  console.log('⚡ AUDITFLOW AI — DISPARO DE REFUERZO SECTOR MEDIO (RESEND DKIM)');
  console.log('================================================================================\n');

  const resendApiKey = (process.env.RESEND_API_KEY || CONFIG.EMAIL.RESEND_API_KEY || '').trim();
  if (!resendApiKey) {
    console.error('❌ Falta RESEND_API_KEY');
    return;
  }

  const resend = new Resend(resendApiKey);
  const activeTargets = filterActiveLeads(REINFORCEMENT_TARGETS);
  let sentCount = 0;

  for (const lead of activeTargets) {
    const trialUrl = `https://audiflowai.com/?ref=refuerzo-viernes-2pm&lead=${encodeURIComponent(lead.name)}`;
    const subject = `[Viernes 2:00 PM] Cierre de contratos antes de las 6:00 PM / ${lead.firm}`;

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: #1e293b; max-width: 580px; line-height: 1.6;">
        <p>Estimado/a <strong>${lead.name}</strong>,</p>
        <p>Quedan menos de 4 horas para terminar la semana y en una firma como <strong>${lead.firm}</strong> suele ser el momento en que entran los borradores finales de proveedores y clientes exigiendo firma antes de las 6:00 PM.</p>
        <p style="font-size: 15px; color: #0f172a; font-weight: 600;">
          No sacrifiques tu tarde de viernes ni la de tus asociados leyendo 50 páginas de prisa con riesgo de omitir cláusulas de renovación forzosa o penalidades asimétricas.
        </p>
        <p>
          En <strong>AuditFlow AI</strong> subes el borrador confidencial a memoria RAM volátil (0 almacenamiento en disco) y en <strong>8.2 segundos</strong> obtienes tu Redline en Word (.docx con Control de Cambios) listo para contraofertar.
        </p>
        <p style="margin: 20px 0;">
          <a href="${trialUrl}" style="background-color: #0284c7; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
            Auditar Borrador Urgente de Viernes (8s) →
          </a>
        </p>
        <p style="color: #64748b; font-size: 12px;">
          Ricardo Bolaños &bull; AuditFlow AI &bull; audiflowai.com
        </p>
      </div>
    `;

    try {
      await resend.emails.send({
        from: 'Directora de Marketing | AuditFlow AI <cmvo@audiflowai.com>',
        reply_to: CONFIG.EMAIL.REPLY_TO_OUTREACH,
        to: lead.email,
        subject,
        html
      });
      console.log(`✅ [REFUERZO ENVIADO] ${lead.name} (${lead.firm})`);
      sentCount++;
    } catch (e) {
      console.warn(`⚠️ Error en refuerzo para ${lead.email}:`, e.message);
    }
  }

  console.log(`\n🎉 Campaña de refuerzo completada. Total enviados: ${sentCount}`);
}
