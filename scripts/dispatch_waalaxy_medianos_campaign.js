import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import { CONFIG } from '../lib/config.js';
import { waalaxyProspectsStore } from '../lib/waalaxy-sync.js';

dotenv.config();

const STATE_FILE = path.resolve('waalaxy_dispatch_state.json');

function loadState() {
  if (fs.existsSync(STATE_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    } catch (e) {
      console.warn('⚠️ No se pudo leer estado anterior, iniciando desde cero.');
    }
  }
  return { lastIndex: 0, totalProcessed: 0, lastRun: null };
}

function saveState(state) {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  } catch (e) {
    console.warn('⚠️ Error guardando estado:', e.message);
  }
}

export async function dispatchWaalaxyMedianosCampaign() {
  console.log('======================================================================');
  console.log('🛰️ AUDITFLOW AI — MOTOR WAALAXY LINKEDIN (PUENTE WARMUP 14 DÍAS)');
  console.log('   Estrategia: Prospección ininterrumpida en LinkedIn a Socios y Directores');
  console.log('   Objetivo: Generar clientes y demos mientras se calienta ricardo.audiflowai@gmail.com');
  console.log('   Blindaje: 100% libre de Gmail SMTP • rick28191@gmail.com protegido para ventas');
  console.log('======================================================================\n');

  let csvPath1 = path.resolve('Waalaxy/DIRECTORES_LEGALES_250_WAALAXY.csv');
  let csvPath2 = path.resolve('Waalaxy/waalaxy_pareto_top_medianos_25abog.csv');

  const leads = [];

  // 1. Cargar Base 1 (DIRECTORES_LEGALES_250_WAALAXY.csv)
  if (fs.existsSync(csvPath1)) {
    const raw1 = fs.readFileSync(csvPath1, 'utf8');
    const lines1 = raw1.split('\n').filter(l => l.trim().length > 0).slice(1);
    for (const row of lines1) {
      const matches = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
      if (!matches || matches.length < 7) continue;
      const fn = (matches[1] || '').replace(/"/g, '').trim();
      const ln = (matches[2] || '').replace(/"/g, '').trim();
      const emp = (matches[3] || '').replace(/"/g, '').trim();
      const cargo = (matches[4] || '').replace(/"/g, '').trim();
      const li = (matches[5] || '').replace(/"/g, '').trim();
      const em = (matches[6] || '').replace(/"/g, '').trim();
      const pais = (matches[7] || '').replace(/"/g, '').trim();

      if (em && em.includes('@')) {
        leads.push({
          name: `${fn} ${ln}`.trim() || emp,
          firstName: fn,
          lastName: ln,
          company: emp,
          role: cargo || 'Director Legal / Socio M&A',
          linkedin: li,
          email: em,
          country: pais || 'Latam',
          source: 'Waalaxy Directores Legales 250'
        });
      }
    }
  }

  // 2. Cargar Base 2 (waalaxy_pareto_top_medianos_25abog.csv)
  if (fs.existsSync(csvPath2)) {
    const raw2 = fs.readFileSync(csvPath2, 'utf8');
    const lines2 = raw2.split('\n').filter(l => l.trim().length > 0).slice(1);
    for (const row of lines2) {
      const matches = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
      if (!matches || matches.length < 8) continue;
      const fn = (matches[0] || '').replace(/"/g, '').trim();
      const ln = (matches[1] || '').replace(/"/g, '').trim();
      const cargo = (matches[2] || '').replace(/"/g, '').trim();
      const emp = (matches[3] || '').replace(/"/g, '').trim();
      const em = (matches[6] || '').replace(/"/g, '').trim();
      const li = (matches[7] || '').replace(/"/g, '').trim();

      if (em && em.includes('@')) {
        leads.push({
          name: `${fn} ${ln}`.trim() || emp,
          firstName: fn,
          lastName: ln,
          company: emp,
          role: cargo,
          linkedin: li,
          email: em,
          country: 'El Salvador & Centroamérica',
          source: 'Pareto Top 50'
        });
      }
    }
  }

  console.log(`📊 Universo total de decisores identificados: ${leads.length}`);

  if (leads.length === 0) {
    console.warn('⚠️ No se encontraron prospectos válidos en los archivos CSV de Waalaxy.');
    return;
  }

  // Manejo de Estado y Lotes de Seguridad (Drip Mode de 25 decisores por ciclo)
  const state = loadState();
  const batchSize = 25;
  const startIndex = state.lastIndex % leads.length;
  const endIndex = Math.min(startIndex + batchSize, leads.length);
  const currentBatch = leads.slice(startIndex, endIndex);

  console.log(`⚡ Procesando Lote Drip: ${currentBatch.length} prospectos (Índice: ${startIndex + 1} a ${endIndex})...\n`);

  let count = 0;
  for (const lead of currentBatch) {
    count++;
    lead.status = 'ENCOLADO_WAALAXY_LINKEDIN';
    lead.timestamp = new Date().toISOString();
    lead.profileUrl = lead.linkedin;
    waalaxyProspectsStore.set(lead.email, lead);

    if (count <= 3 || count === currentBatch.length) {
      console.log(`   [${count}/${currentBatch.length}] 🔗 Decisor: ${lead.name} | ${lead.company} (${lead.role})`);
      console.log(`         LinkedIn: ${lead.linkedin}`);
    }
  }

  // Actualizar estado persistente y seguimiento del ciclo de 14 días
  if (!state.warmupCycleStart) {
    state.warmupCycleStart = new Date().toISOString();
  }
  const daysElapsed = Math.floor((Date.now() - new Date(state.warmupCycleStart).getTime()) / (1000 * 60 * 60 * 24));
  const currentWarmupDay = Math.min(14, daysElapsed + 1);

  state.lastIndex = (endIndex >= leads.length) ? 0 : endIndex;
  state.totalProcessed = (state.totalProcessed || 0) + currentBatch.length;
  state.currentWarmupDay = currentWarmupDay;
  state.lastRun = new Date().toISOString();
  saveState(state);

  console.log('\n======================================================================');
  console.log(`✅ LOTE WAALAXY PROCESADO CON ÉXITO: ${currentBatch.length} DECISORES`);
  console.log(`📈 Total Acumulado en Secuencia: ${state.totalProcessed} prospectos`);
  console.log(`📅 Ciclo Warmup Instantly: Día ${currentWarmupDay} de 14`);
  console.log(`🔒 Modo Seguro: 100% LinkedIn B2B (Sin impacto en cuentas de Google)`);
  console.log(`🛡️ Cuenta Outreach Oficial: ricardo.audiflowai@gmail.com`);
  console.log(`👑 Cuenta Personal CEO: rick28191@gmail.com (Blindada para Ventas)`);
  console.log('======================================================================\n');

  // Telemetría por Resend DKIM al buzón de control
  const resendApiKey = (process.env.RESEND_API_KEY || CONFIG.EMAIL.RESEND_API_KEY || '').trim();
  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      const adminEmail = CONFIG.EMAIL.OWNER_CONTROL || 'tendenciaiatufuturo@gmail.com';

      await resend.emails.send({
        from: 'Directora de Marketing | AuditFlow AI <cmvo@audiflowai.com>',
        to: adminEmail,
        subject: `🛰️ [WAALAXY PUENTE DÍA ${currentWarmupDay}/14] Lote Procesado: ${currentBatch.length} Socios Directores en LinkedIn`,
        html: `
          <div style="font-family: Arial, sans-serif; background: #0f172a; color: #ffffff; padding: 22px; border-radius: 10px; border: 1px solid #38bdf8; max-width: 620px;">
            <h3 style="color: #38bdf8; margin-top: 0;">🛰️ Reporte de Ejecución: Waalaxy LinkedIn (Puente 14 Días)</h3>
            <p style="font-size: 13px; color: #cbd5e1;">Don Ricardo, reporte ejecutivo de la prospección activa mientras corre el calentamiento de Instantly:</p>
            <ul style="color: #e2e8f0; font-size: 13px; line-height: 1.7;">
              <li><strong>Lote Ejecutado:</strong> ${currentBatch.length} decisores calificados.</li>
              <li><strong>Canal Activo:</strong> LinkedIn B2B / Waalaxy (Directores Legales & Socios M&A).</li>
              <li><strong>Día del Protocolo de Calentamiento:</strong> Día ${currentWarmupDay} de 14.</li>
              <li><strong>Cuenta Outreach Oficial en Instantly:</strong> <code>ricardo.audiflowai@gmail.com</code> (Warmup P2P).</li>
              <li><strong>Buzón Personal del CEO (Blindado):</strong> <code>rick28191@gmail.com</code> (Exclusivo para Ventas $19, $69, $590).</li>
              <li><strong>Total Acumulado en Secuencia:</strong> ${state.totalProcessed} contactos alcanzados.</li>
              <li><strong>Muestra de Decisores:</strong> ${currentBatch.slice(0, 3).map(l => `${l.name} (${l.company})`).join(', ')}.</li>
            </ul>
            <div style="margin-top: 15px; padding: 12px; background: #1e293b; border-radius: 6px; font-size: 12px; color: #94a3b8;">
              🔄 <em>Estrategia de Relevo:</em> Waalaxy continuará ejecutando 50 toques/día hasta que <code>ricardo.audiflowai@gmail.com</code> certifique Health Score ≥ 90% al día 14, momento en el cual comenzará el cold email masivo en Instantly.
            </div>
            <p style="font-size: 11px; color: #64748b; margin-top: 15px;">AuditFlow AI • Operación Fiduciaria Continua 24/7</p>
          </div>
        `
      });
      console.log(`📬 Telemetría entregada a: ${adminEmail}`);
    } catch (e) {
      console.warn('Alerta admin omitida:', e.message);
    }
  }
}

if (process.argv[1] && process.argv[1].includes('dispatch_waalaxy_medianos_campaign.js')) {
  dispatchWaalaxyMedianosCampaign().catch(err => {
    console.error('❌ Error crítico en ejecución Waalaxy:', err);
    process.exit(1);
  });
}
