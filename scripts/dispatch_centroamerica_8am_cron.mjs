import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import { CONFIG } from '../lib/config.js';
import { filterActiveLeads, isBounced, addBouncedEmail } from '../lib/bounce-suppression.js';

dotenv.config();

/**
 * ==============================================================================
 * AUDITFLOW AI — CRON JOB MATUTINO CENTROAMÉRICA (7:00 AM CST)
 * ==============================================================================
 * Audiencia: 103 Decisores Reales Auditados (48 Socios de Bufetes + 55 CFOs)
 * Países: El Salvador, Guatemala, Costa Rica, Honduras y Panamá.
 * Cero datos sintéticos. Todos con verificación DNS MX activa.
 * 
 * Lotes diarios de 15 prospectos (7-8 bufetes + 7-8 CFOs) en rotación continua.
 * ==============================================================================
 */

const RESEND_API_KEY = (process.env.RESEND_API_KEY || CONFIG.EMAIL.RESEND_API_KEY || '').trim();
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

const LEADS_FILE = path.resolve('CENTROAMERICA_PARETO_85_REAL_LEADS.json');
const STATE_FILE = path.resolve('centroamerica_8am_state.json');
const LOG_FILE = path.resolve('logs/centroamerica_8am_cron.log');

// Asegurar directorio logs
const logsDir = path.resolve('logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

function loadState(cfoCount = 55, bufeteCount = 48) {
  let state = {
    cfoIndex: 0,
    bufeteIndex: 0,
    batchSize: 15,
    cfoQuota: 12,    // 80% de 15 decisores diarios
    bufeteQuota: 3,   // 20% de 15 decisores diarios
    currentIndex: 0,
    totalDispatched: 0,
    cycleCount: 1,
    lastRun: null,
    history: []
  };

  if (fs.existsSync(STATE_FILE)) {
    try {
      const raw = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
      state = { ...state, ...raw };
      if (state.cfoIndex === undefined) state.cfoIndex = 0;
      if (state.bufeteIndex === undefined) state.bufeteIndex = 0;
      if (state.cfoQuota === undefined) state.cfoQuota = 12;
      if (state.bufeteQuota === undefined) state.bufeteQuota = 3;
    } catch (e) {
      console.warn('⚠️ No se pudo leer estado previo de Centroamérica 8AM, iniciando desde cero.');
    }
  }

  // Reiniciar ciclo si los CFOs llegaron al final
  if (cfoCount > 0 && state.cfoIndex >= cfoCount) {
    state.cfoIndex = 0;
    state.cycleCount = (state.cycleCount || 1) + 1;
  }
  if (bufeteCount > 0 && state.bufeteIndex >= bufeteCount) {
    state.bufeteIndex = 0;
  }

  return state;
}

function saveState(state) {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
  } catch (e) {
    console.error('❌ Error guardando estado:', e.message);
  }
}

function appendLog(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  console.log(msg);
  try {
    fs.appendFileSync(LOG_FILE, line, 'utf8');
  } catch (e) {
    // Ignorar error de log local
  }
}

// Plantilla para Socios de Bufetes de Abogados
function buildBufeteHtml(lead) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f8fafc; padding: 32px 24px; max-width: 600px; margin: 0 auto; border-radius: 12px; border: 1px solid #1e293b; line-height: 1.65;">
      <div style="border-bottom: 1px solid #1e293b; padding-bottom: 14px; margin-bottom: 22px;">
        <span style="font-size: 15px; font-weight: 800; letter-spacing: 1px; color: #38bdf8;">AUDITFLOW AI</span>
        <span style="font-size: 11px; color: #64748b; margin-left: 10px; text-transform: uppercase;">| Corporate Law Firms Desk</span>
      </div>

      <p style="font-size: 15px; color: #e2e8f0; margin-bottom: 16px;">
        Estimado/a Lic. <strong>${lead.firstName} ${lead.lastName}</strong>,
      </p>

      <p style="font-size: 14px; color: #cbd5e1; margin-bottom: 14px;">
        En firmas del calibre de <strong>${lead.company}</strong> (${lead.country}), la revisión línea por línea de borradores mercantiles de 40 a 60 páginas representa decenas de horas de fatiga visual para los asociados senior.
      </p>

      <p style="font-size: 14px; color: #cbd5e1; margin-bottom: 16px;">
        Desarrollamos <strong>AuditFlow AI</strong> como un motor de <strong>diagnóstico y blindaje contractual inteligente</strong> diseñado bajo los más estrictos estándares de confidencialidad fiduciaria:
      </p>

      <div style="background-color: #0f172a; border-left: 4px solid #38bdf8; padding: 18px 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0 0 8px 0; font-size: 13px; color: #ffffff;">⚡ <strong>Auditoría en 8 Segundos:</strong> Detecta penalizaciones asimétricas, cláusulas de renovación automática y desajustes de indemnidad sin tope.</p>
        <p style="margin: 0 0 8px 0; font-size: 13px; color: #ffffff;">🔒 <strong>Memoria RAM Volátil:</strong> Cumplimiento SOC-2 y GDPR Art. 28. Cero almacenamiento en disco; el documento se destruye al cerrar la sesión.</p>
        <p style="margin: 0; font-size: 13px; color: #34d399;">📄 <strong>Entrega Inmediata en Word (.docx):</strong> Genera el Redline editable con Control de Cambios listo para enviar a la contraparte negociadora.</p>
      </div>

      <p style="font-size: 14px; color: #e2e8f0; margin-bottom: 22px;">
        Le hemos habilitado un <strong>acceso de cortesía sin costo ni tarjeta de crédito</strong> para que su equipo audite un borrador de prueba en vivo:
      </p>

      <div style="text-align: center; margin: 26px 0;">
        <a href="${lead.trialUrl}" style="background-color: #0284c7; color: #ffffff; padding: 14px 30px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 14px; display: inline-block;">
          Auditar 1 Contrato de Muestra (8s Gratis) →
        </a>
      </div>

      <div style="border-top: 1px solid #1e293b; padding-top: 18px; margin-top: 26px; font-size: 12px; color: #64748b;">
        <p style="margin: 0 0 4px 0; color: #e2e8f0; font-weight: 600;">Ricardo Bolaños</p>
        <p style="margin: 0 0 4px 0;">Director General • AuditFlow AI</p>
        <p style="margin: 0;"><a href="https://audiflowai.com" style="color: #38bdf8; text-decoration: none;">audiflowai.com</a> • ricardo@audiflowai.com</p>
      </div>
    </div>
  `;
}

// Plantilla para Directores Financieros (CFOs)
function buildCfoHtml(lead) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f8fafc; padding: 32px 24px; max-width: 600px; margin: 0 auto; border-radius: 12px; border: 1px solid #1e293b; line-height: 1.65;">
      <div style="border-bottom: 1px solid #1e293b; padding-bottom: 14px; margin-bottom: 22px;">
        <span style="font-size: 15px; font-weight: 800; letter-spacing: 1px; color: #10b981;">AUDITFLOW AI</span>
        <span style="font-size: 11px; color: #64748b; margin-left: 10px; text-transform: uppercase;">| Dirección Financiera & Control de EBITDA</span>
      </div>

      <p style="font-size: 15px; color: #e2e8f0; margin-bottom: 16px;">
        Estimado/a <strong>${lead.firstName} ${lead.lastName}</strong>,
      </p>

      <p style="font-size: 14px; color: #cbd5e1; margin-bottom: 14px;">
        En corporaciones como <strong>${lead.company}</strong> (${lead.country}), los acuerdos comerciales con proveedores (Cloud IT, logística, telecomunicaciones y arrendamiento) suelen esconder sobrecostos silenciosos que impactan el EBITDA.
      </p>

      <p style="font-size: 14px; color: #cbd5e1; margin-bottom: 16px;">
        El 74% de las fugas contractuales provienen de <strong>fórmulas de indexación inflacionaria sin tope</strong>, cláusulas de prórroga automática con preavisos abusivos y penalizaciones desmedidas de salida.
      </p>

      <div style="background-color: #0f172a; border-left: 4px solid #10b981; padding: 18px 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0 0 8px 0; font-size: 13px; color: #ffffff;">🛡️ <strong>Blindaje de EBITDA en 8 Segundos:</strong> Diagnóstico preventivo en memoria RAM volátil (cumplimiento SOC-2 / GDPR Art. 28, cero retención de archivos).</p>
        <p style="margin: 0 0 8px 0; font-size: 13px; color: #ffffff;">📄 <strong>Redline Editable en Word (.docx):</strong> Entrega el documento con Control de Cambios y cláusulas de contra-propuesta listas para negociar.</p>
        <p style="margin: 0; font-size: 13px; color: #38bdf8;">💼 <strong>Ahorro Real de Honorarios:</strong> Evite minutas legales externas de $500–$1,500 USD por borrador. Formato accesible desde $19 USD por contrato o Pro $69 USD/mes.</p>
      </div>

      <p style="font-size: 14px; color: #e2e8f0; margin-bottom: 22px;">
        Le hemos habilitado un acceso de cortesía para auditar 1 contrato de prueba en vivo, 100% confidencial y sin tarjeta de crédito:
      </p>

      <div style="text-align: center; margin: 26px 0;">
        <a href="${lead.trialUrl}" style="background-color: #10b981; color: #022c22; padding: 14px 30px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 14px; display: inline-block;">
          Auditar 1 Contrato de Muestra en RAM (Gratis) →
        </a>
      </div>

      <div style="border-top: 1px solid #1e293b; padding-top: 18px; margin-top: 26px; font-size: 12px; color: #64748b;">
        <p style="margin: 0 0 4px 0; color: #e2e8f0; font-weight: 600;">Ricardo Bolaños</p>
        <p style="margin: 0 0 4px 0;">Director General • AuditFlow AI</p>
        <p style="margin: 0;"><a href="https://audiflowai.com" style="color: #38bdf8; text-decoration: none;">audiflowai.com</a> • ricardo@audiflowai.com</p>
      </div>
    </div>
  `;
}

export async function runCentroamerica8AMDispatch(options = {}) {
  appendLog('================================================================================');
  appendLog('☀️ AUDITFLOW AI — DESPACHO MATUTINO CENTROAMÉRICA (07:00 AM CST)');
  appendLog('🎯 Universo: 100% Leads Reales (80% CFOs Corporativos + 20% Socios de Bufetes)');
  appendLog(`⏰ Hora de Ejecución: ${new Date().toLocaleTimeString()} CST`);
  appendLog('🛡️ MODO OPERATIVO: 100% REAL EN PRODUCCIÓN (CERO SIMULACIÓN - CERO DRY-RUN)');
  appendLog('================================================================================\n');

  if (new Date().getDay() === 0 && !options.forceSunday) {
    appendLog('ℹ️ DOMINGO: Pausa fiduciaria comercial activa. No se disparan correos en fin de semana. El ciclo se reanuda el LUNES a las 7:00 AM CST.');
    return { paused: true, reason: 'SUNDAY_COMMERCIAL_PAUSE' };
  }

  if (!fs.existsSync(LEADS_FILE)) {
    throw new Error(`❌ No se encontró la base oficial en ${LEADS_FILE}`);
  }

  const rawContent = fs.readFileSync(LEADS_FILE, 'utf8').replace(/^\uFEFF/, '');
  const allLeads = JSON.parse(rawContent);
  const cleanLeads = filterActiveLeads(allLeads);

  const cfoLeads = cleanLeads.filter(l => l.type === 'CFO');
  const bufeteLeads = cleanLeads.filter(l => l.type === 'BUFETE');

  appendLog(`📋 Universo Total: ${allLeads.length} | Validados sin rebotes: ${cleanLeads.length} (${cfoLeads.length} CFOs + ${bufeteLeads.length} Bufetes)`);

  const state = loadState(cfoLeads.length, bufeteLeads.length);
  const cfoQuota = state.cfoQuota || 12;      // 80% CFOs
  const bufeteQuota = state.bufeteQuota || 3;  // 20% Bufetes

  // Seleccionar 12 CFOs rotativos
  const batchCfos = [];
  for (let i = 0; i < cfoQuota && cfoLeads.length > 0; i++) {
    const idx = (state.cfoIndex + i) % cfoLeads.length;
    batchCfos.push(cfoLeads[idx]);
  }

  // Seleccionar 3 Bufetes rotativos
  const batchBufetes = [];
  for (let i = 0; i < bufeteQuota && bufeteLeads.length > 0; i++) {
    const idx = (state.bufeteIndex + i) % bufeteLeads.length;
    batchBufetes.push(bufeteLeads[idx]);
  }

  const targetBatch = [...batchCfos, ...batchBufetes];

  appendLog(`🚀 Despachando Lote del Día: ${targetBatch.length} decisores [80% CFOs (${batchCfos.length}) + 20% Bufetes (${batchBufetes.length})] | CFO Idx ${state.cfoIndex + 1} | Bufete Idx ${state.bufeteIndex + 1} | Ciclo #${state.cycleCount}`);

  if (!resend) {
    throw new Error('❌ Error crítico de infraestructura: RESEND_API_KEY no está configurado. Prohibido modo simulación.');
  }

  let sentOk = 0;
  let sentFail = 0;

  for (let i = 0; i < targetBatch.length; i++) {
    const lead = targetBatch[i];
    const isBufete = lead.type === 'BUFETE';
    
    const subject = isBufete
      ? `[Diagnóstico Contractual] Redlines en Word y revisión en RAM volátil para ${lead.company}`
      : `[Control de EBITDA] Detección preventiva de sobrecostos en contratos para ${lead.company}`;

    const html = isBufete ? buildBufeteHtml(lead) : buildCfoHtml(lead);

    try {
      const resp = await resend.emails.send({
        from: 'Ricardo Bolaños | AuditFlow AI <ricardo@audiflowai.com>',
        to: lead.email,
        reply_to: 'ricardo@audiflowai.com',
        subject: subject,
        html: html
      });

      appendLog(`✅ [${i + 1}/${targetBatch.length}] ENVIADO: ${lead.firstName} ${lead.lastName} (${lead.role}) @ ${lead.company} [${lead.country}] -> ${lead.email} (ID: ${resp?.data?.id || resp?.id || 'OK'})`);
      sentOk++;
    } catch (err) {
      appendLog(`⚠️ [${i + 1}/${targetBatch.length}] FALLO en ${lead.email}: ${err.message}`);
      sentFail++;
      if (err.message && (err.message.includes('bounce') || err.message.includes('not exist'))) {
        addBouncedEmail(lead.email, err.message);
      }
    }

    // Pausa de cortesía entre correos (1.5 segundos)
    await new Promise(r => setTimeout(r, 1500));
  }

  // Actualizar estado del cron job con rotación independiente 80/20
  state.cfoIndex = (state.cfoIndex + batchCfos.length) % (cfoLeads.length || 1);
  state.bufeteIndex = (state.bufeteIndex + batchBufetes.length) % (bufeteLeads.length || 1);
  state.currentIndex = state.cfoIndex + state.bufeteIndex;
  state.totalDispatched = (state.totalDispatched || 0) + sentOk;
  state.lastRun = new Date().toISOString();
  state.history.push({
    date: state.lastRun,
    batchCount: targetBatch.length,
    cfoCount: batchCfos.length,
    bufeteCount: batchBufetes.length,
    sentOk,
    sentFail
  });

  saveState(state);

  appendLog('\n================================================================================');
  appendLog(`🏁 DESPACHO MATUTINO CENTROAMÉRICA FINALIZADO:`);
  appendLog(`   - Exitosos: ${sentOk}`);
  appendLog(`   - Fallidos: ${sentFail}`);
  appendLog(`   - Próximo Índice: ${state.currentIndex + 1} de ${cleanLeads.length}`);
  appendLog('================================================================================\n');

  // Enviar telemetría al Director General
  if (resend) {
    try {
      const adminTarget = CONFIG.EMAIL.OWNER_CONTROL || 'tendenciaiatufuturo@gmail.com';
      await resend.emails.send({
        from: 'Operaciones AuditFlow AI <ricardo@audiflowai.com>',
        to: adminTarget,
        subject: `📊 [CRON 7:00 AM] Despacho Matutino Centroamérica (${sentOk} decisores contactados: ${batchCfos.length} CFOs + ${batchBufetes.length} Bufetes)`,
        html: `
          <div style="font-family: Arial, sans-serif; background: #0f172a; color: #ffffff; padding: 22px; border-radius: 10px;">
            <h3 style="color: #38bdf8; margin-top: 0;">☀️ Reporte de Despacho Centroamérica (7:00 AM CST)</h3>
            <p>Se ha ejecutado la siembra matutina programada hacia la base fiduciaria verificada (100% real):</p>
            <ul>
              <li><strong>Decisores Contactados:</strong> ${sentOk} (${batchCfos.length} CFOs Corporativos [80%] + ${batchBufetes.length} Socios de Bufetes [20%])</li>
              <li><strong>Fallos / Rebotes:</strong> ${sentFail}</li>
              <li><strong>Ciclo Actual:</strong> #${state.cycleCount}</li>
              <li><strong>Índice CFO:</strong> ${state.cfoIndex} de ${cfoLeads.length} | <strong>Índice Bufetes:</strong> ${state.bufeteIndex} de ${bufeteLeads.length}</li>
            </ul>
            <p style="font-size: 11px; color: #64748b;">AuditFlow AI — Operación Fiduciaria 100% Datos Reales</p>
          </div>
        `
      });
    } catch (e) {
      // Telemetría opcional
    }
  }

  return { sentOk, sentFail, nextIndex: state.currentIndex };
}

// Ejecución directa por CLI o Cron (SIEMPRE 100% REAL)
if (process.argv[1] && process.argv[1].includes('dispatch_centroamerica_8am_cron.mjs')) {
  runCentroamerica8AMDispatch().catch(err => {
    console.error('❌ Error fatal en cron matutino Centroamérica:', err);
    process.exit(1);
  });
}
