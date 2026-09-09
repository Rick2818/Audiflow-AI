import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';
import { CONFIG } from '../lib/config.js';
import { InstantlyClient } from '../lib/instantly-client.js';

dotenv.config();

/**
 * ==============================================================================
 * AUDITFLOW AI — MONITOR DE CALENTAMIENTO INSTANTLY & PUENTE CON WAALAXY
 * ==============================================================================
 * Supervisa de forma autónoma el Health Score del buzón oficial de outreach:
 *      ricardo.audiflowai@gmail.com
 *
 * BLINDAJE INVIOLABLE:
 *      rick28191@gmail.com queda 100% aislado y reservado para ventas.
 * ==============================================================================
 */

const TARGET_OUTREACH_EMAIL = 'ricardo.audiflowai@gmail.com';
const STATE_FILE = path.resolve('waalaxy_dispatch_state.json');

function loadWaalaxyState() {
  if (fs.existsSync(STATE_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    } catch (e) {
      // Ignorar error de lectura
    }
  }
  return { lastIndex: 0, totalProcessed: 0, currentWarmupDay: 1, warmupCycleStart: new Date().toISOString() };
}

export async function checkWarmupBridgeStatus() {
  console.log('======================================================================');
  console.log('🛰️ AUDITFLOW AI — MONITOR DE SALUD DE WARMUP Y PUENTE CON WAALAXY');
  console.log(`🎯 Buzón Oficial de Outreach en Calentamiento: ${TARGET_OUTREACH_EMAIL}`);
  console.log('🛡️ Buzón Personal del CEO (Aislado para Ventas): rick28191@gmail.com');
  console.log('======================================================================\n');

  // 1. Verificación de blindaje
  if (process.env.GMAIL_USER === 'rick28191@gmail.com' && process.env.INSTANTLY_ACTIVE === 'true') {
    console.warn('⚠️ ALERTA: GMAIL_USER personal no debe asociarse a campañas frías masivas.');
  }

  const waalaxyState = loadWaalaxyState();
  const currentDay = waalaxyState.currentWarmupDay || 1;
  const processedLeads = waalaxyState.totalProcessed || 0;

  console.log(`📊 Progreso del Puente Waalaxy:`);
  console.log(`   - Día del Protocolo: Día ${currentDay} de 14`);
  console.log(`   - Decisores alcanzados en LinkedIn: ${processedLeads} contactos\n`);

  // 2. Consulta de Instantly
  const instantly = new InstantlyClient();
  let healthInfo = null;

  try {
    healthInfo = await instantly.getWarmupHealth(TARGET_OUTREACH_EMAIL);
    console.log(`🔥 Estado Instantly para ${TARGET_OUTREACH_EMAIL}:`);
    console.log(`   - Warmup Activo: ${healthInfo.active ? 'SÍ ✅' : 'NO / PENDIENTE ⏳'}`);
    console.log(`   - Health Score: ${healthInfo.healthScore || 0}%`);
    console.log(`   - Listo para Cold Email: ${healthInfo.isReadyForCold ? 'SÍ (Score >= 90%) 🚀' : 'NO (En calentamiento progresivo) 🛡️'}`);
  } catch (err) {
    console.warn(`⚠️ Nota de consulta Instantly: ${err.message}`);
    healthInfo = {
      active: false,
      healthScore: 0,
      isReadyForCold: false,
      message: err.message
    };
  }

  // 3. Telemetría fiduciaria hacia tendenciaiatufuturo@gmail.com
  const resendApiKey = (process.env.RESEND_API_KEY || CONFIG.EMAIL.RESEND_API_KEY || '').trim();
  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      const adminEmail = CONFIG.EMAIL.OWNER_CONTROL || 'tendenciaiatufuturo@gmail.com';

      const statusBadge = healthInfo.isReadyForCold
        ? '<span style="color:#34d399;font-weight:bold;">🚀 LISTO PARA RELEVO (Score ≥ 90%)</span>'
        : `<span style="color:#38bdf8;font-weight:bold;">⏳ EN CALENTAMIENTO (Día ${currentDay}/14)</span>`;

      await resend.emails.send({
        from: 'Directora de Marketing | AuditFlow AI <cmvo@audiflowai.com>',
        to: adminEmail,
        subject: `🔥 [MONITOR WARMUP] ${TARGET_OUTREACH_EMAIL} — Día ${currentDay}/14 (Waalaxy Activo)`,
        html: `
          <div style="font-family: Arial, sans-serif; background: #0f172a; color: #ffffff; padding: 22px; border-radius: 10px; border: 1px solid #38bdf8; max-width: 620px;">
            <h3 style="color: #38bdf8; margin-top: 0;">🛰️ Estado Diario del Protocolo de Calentamiento y Relevo</h3>
            <p style="font-size: 13px; color: #cbd5e1;">Reporte consolidado del puente de captación para la Dirección:</p>
            <div style="background: #1e293b; padding: 14px; border-radius: 8px; margin-bottom: 15px;">
              <p style="margin: 0; font-size: 13px;"><strong>Estado General:</strong> ${statusBadge}</p>
              <p style="margin: 6px 0 0 0; font-size: 13px;"><strong>Buzón Outreach:</strong> <code>${TARGET_OUTREACH_EMAIL}</code></p>
              <p style="margin: 6px 0 0 0; font-size: 13px;"><strong>Health Score Actual:</strong> ${healthInfo.healthScore || 0}%</p>
            </div>
            <ul style="color: #e2e8f0; font-size: 13px; line-height: 1.8;">
              <li><strong>Estrategia Activa:</strong> Waalaxy LinkedIn en la Nube (50 toques/día a Socios y CFOs).</li>
              <li><strong>Decisores Alcanzados en LinkedIn:</strong> ${processedLeads} perfiles calificados.</li>
              <li><strong>Buzón Personal CEO (Blindado):</strong> <code>rick28191@gmail.com</code> (100% protegido para ventas).</li>
              <li><strong>Relevo Previsto:</strong> Al cumplir los 14 días y Score ≥ 90%, se transferirá el volumen de prospección a cold email en Instantly.</li>
            </ul>
            <p style="font-size: 11px; color: #64748b; margin-top: 15px;">AuditFlow AI • Operación Fiduciaria Continua 24/7</p>
          </div>
        `
      });
      console.log(`📬 Reporte fiduciario remitido a: ${adminEmail}`);
    } catch (telemetryErr) {
      console.warn('⚠️ Alerta de telemetría omitida:', telemetryErr.message);
    }
  }

  console.log('\n======================================================================');
  console.log('🏁 MONITOR DE CALENTAMIENTO Y PUENTE COMPLETADO EXITOSAMENTE');
  console.log('======================================================================\n');

  return { currentDay, processedLeads, healthInfo };
}

if (process.argv[1] && process.argv[1].includes('monitor_instantly_warmup_bridge.js')) {
  checkWarmupBridgeStatus().catch(err => {
    console.error('❌ Error en monitor de calentamiento:', err);
    process.exit(1);
  });
}
