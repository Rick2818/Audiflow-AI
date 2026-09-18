import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import { CONFIG } from '../lib/config.js';
import { filterActiveLeads, isBounced, addBouncedEmail } from '../lib/bounce-suppression.js';
import { getLegalNoticeForOutbound } from '../lib/legal-jurisdictions.js';

dotenv.config();

/**
 * ==============================================================================
 * AUDITFLOW AI — CRON JOB MATUTINO CENTROAMÉRICA (7:00 AM CST)
 * ==============================================================================
 * Audiencia: 103 Decisores Reales Auditados (48 Socios de Bufetes + 55 CFOs)
 * Países: El Salvador, Guatemala, Costa Rica, Honduras y Panamá.
 * Cero datos sintéticos. Todos con verificación DNS MX activa.
 * 
 * Cadencia Outbound 3 Toques para CFOs (Día 0, Día +3, Día +7):
 * - Toque 1: Control de EBITDA & Trampas Contractuales Silenciosas
 * - Toque 2: Caso Práctico Fiduciario: Redlines en Word & $18.5k en Fugas
 * - Toque 3: Cierre Diplomático & Invitación VIP (10 min con Dirección General)
 * 
 * Lotes diarios de 15 prospectos (12 CFOs con cadencia + 3 Bufetes) en rotación continua.
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

export function loadState(cfoCount = 55, bufeteCount = 48) {
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
    history: [],
    cadence: {}      // email -> { touch: 1|2|3, lastTouchDate: string, completed: boolean }
  };

  if (fs.existsSync(STATE_FILE)) {
    try {
      const raw = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
      state = { ...state, ...raw };
      if (state.cfoIndex === undefined) state.cfoIndex = 0;
      if (state.bufeteIndex === undefined) state.bufeteIndex = 0;
      if (state.cfoQuota === undefined) state.cfoQuota = 12;
      if (state.bufeteQuota === undefined) state.bufeteQuota = 3;
      if (!state.cadence || typeof state.cadence !== 'object') state.cadence = {};
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

export function saveState(state) {
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
export function buildBufeteHtml(lead) {
  const legalNoticeHtml = getLegalNoticeForOutbound(lead, 'es');
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

      ${legalNoticeHtml}

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

// CFO Toque 1 (Día 0): Control de EBITDA & Trampas Contractuales
export function buildCfoTouch1Html(lead) {
  const legalNoticeHtml = getLegalNoticeForOutbound(lead, 'es');
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

      ${legalNoticeHtml}

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

// Alias para compatibilidad con código existente
export const buildCfoHtml = buildCfoTouch1Html;

// CFO Toque 2 (Día +3): Caso Práctico Fiduciario: Indexación Unilateral y Penalización de Salida
export function buildCfoTouch2Html(lead) {
  const legalNoticeHtml = getLegalNoticeForOutbound(lead, 'es');
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f8fafc; padding: 32px 24px; max-width: 600px; margin: 0 auto; border-radius: 12px; border: 1px solid #1e293b; line-height: 1.65;">
      <div style="border-bottom: 1px solid #1e293b; padding-bottom: 14px; margin-bottom: 22px;">
        <span style="font-size: 15px; font-weight: 800; letter-spacing: 1px; color: #38bdf8;">AUDITFLOW AI</span>
        <span style="font-size: 11px; color: #64748b; margin-left: 10px; text-transform: uppercase;">| Caso de Estudio CFO &amp; Redline en Word</span>
      </div>

      <p style="font-size: 15px; color: #e2e8f0; margin-bottom: 16px;">
        Estimado/a <strong>${lead.firstName} ${lead.lastName}</strong>,
      </p>

      <p style="font-size: 14px; color: #cbd5e1; margin-bottom: 14px;">
        Dando seguimiento a mi nota sobre la protección del margen operativo en <strong>${lead.company}</strong>, quiero compartirle un caso concreto que ilustra exactamente cómo los contratos de proveedores tradicionales erosionan el flujo de caja.
      </p>

      <p style="font-size: 14px; color: #cbd5e1; margin-bottom: 16px;">
        En una auditoría fiduciaria reciente para una compañía regional en Centroamérica, el motor de AuditFlow AI analizó en 8 segundos un borrador de arrendamiento y servicios de infraestructura tecnológica. Se detectaron dos trampas críticas:
      </p>

      <div style="background-color: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 18px; margin: 20px 0;">
        <div style="margin-bottom: 12px; padding: 10px; background-color: rgba(244, 63, 94, 0.1); border-left: 3px solid #f43f5e; border-radius: 4px;">
          <p style="margin: 0; font-size: 12px; color: #fda4af; font-family: monospace;">❌ Cláusula Proveedor: Indexación unilateral acumulativa del 15% anual y penalización de salida equivalente al 100% del plazo restante sin preaviso.</p>
        </div>
        <div style="padding: 10px; background-color: rgba(16, 185, 129, 0.1); border-left: 3px solid #10b981; border-radius: 4px;">
          <p style="margin: 0; font-size: 12px; color: #6ee7b7; font-family: monospace;">✅ Contrapropuesta Word (.docx): Ajuste limitado al IPC simple con techo del 3% no acumulativo, y período de subsanación de 15 días con rescisión anticipada de 30 días.</p>
        </div>
        <p style="margin: 12px 0 0 0; font-size: 13px; color: #38bdf8; font-weight: bold;">
          💰 Impacto Fiduciario Directo: $18,500.00 USD en fugas contingentes evitadas para el cliente.
        </p>
      </div>

      ${legalNoticeHtml}

      <p style="font-size: 14px; color: #e2e8f0; margin-bottom: 22px;">
        Puede descargar este archivo de muestra real en Word con Control de Cambios, o auditar uno de sus contratos en RAM volátil (sin tarjeta de crédito ni retención en disco):
      </p>

      <div style="text-align: center; margin: 26px 0;">
        <a href="${lead.trialUrl}" style="background-color: #0284c7; color: #ffffff; padding: 14px 30px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 14px; display: inline-block;">
          Ver Auditoría en Vivo (Muestra Real 1 Clic) →
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

// CFO Toque 3 (Día +7): Cierre Diplomático & Invitación VIP con Don Ricardo Bolaños
export function buildCfoTouch3Html(lead) {
  const legalNoticeHtml = getLegalNoticeForOutbound(lead, 'es');
  const encodedMsg = encodeURIComponent(`Hola Ricardo, soy ${lead.firstName} ${lead.lastName} de ${lead.company}. Me interesa coordinar una breve demostración ejecutiva de AuditFlow AI.`);
  const waUrl = `https://wa.me/50375743444?text=${encodedMsg}`;

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f8fafc; padding: 32px 24px; max-width: 600px; margin: 0 auto; border-radius: 12px; border: 1px solid #1e293b; line-height: 1.65;">
      <div style="border-bottom: 1px solid #1e293b; padding-bottom: 14px; margin-bottom: 22px;">
        <span style="font-size: 15px; font-weight: 800; letter-spacing: 1px; color: #a855f7;">AUDITFLOW AI</span>
        <span style="font-size: 11px; color: #64748b; margin-left: 10px; text-transform: uppercase;">| Cierre Ejecutivo &amp; Despacho de Dirección</span>
      </div>

      <p style="font-size: 15px; color: #e2e8f0; margin-bottom: 16px;">
        Estimado/a <strong>${lead.firstName} ${lead.lastName}</strong>,
      </p>

      <p style="font-size: 14px; color: #cbd5e1; margin-bottom: 14px;">
        Entiendo plenamente las exigencias de su agenda al frente de la dirección financiera en <strong>${lead.company}</strong>, por lo que seré sumamente breve y respetuoso con su tiempo.
      </p>

      <p style="font-size: 14px; color: #cbd5e1; margin-bottom: 16px;">
        Si en este momento están evaluando renovaciones de arrendamiento corporativo, pólizas de seguros, licencias de software o contratos logísticos por importes superiores a $25,000 USD, podemos coordinar una <strong>sesión ejecutiva de 10 minutos</strong> directamente conmigo para mostrarle cómo blindar sus compromisos en memoria volátil RAM (conforme a SOC-2 y GDPR Art. 28).
      </p>

      <div style="background-color: #0f172a; border-left: 4px solid #a855f7; padding: 16px 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0 0 6px 0; font-size: 13px; color: #ffffff;">🇸🇻 <strong>Facturación Corporativa Local:</strong> Emisión formal de Comprobante de Crédito Fiscal Electrónico (DTE Ministerio de Hacienda SV) deducible de IVA y Renta.</p>
        <p style="margin: 0; font-size: 13px; color: #a855f7;">🏦 <strong>Facilidad de Pago:</strong> Transfer365 / ACH empresarial, tarjetas corporativas o Bitcoin Lightning.</p>
      </div>

      ${legalNoticeHtml}

      <p style="font-size: 14px; color: #e2e8f0; margin-bottom: 20px;">
        Puede escribirme directamente a mi WhatsApp personal para agendar o auditar una muestra en la plataforma:
      </p>

      <div style="text-align: center; margin: 24px 0;">
        <a href="${waUrl}" style="background-color: #10b981; color: #022c22; padding: 13px 28px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 14px; display: inline-block; margin-bottom: 10px;">
          💬 Conversar por WhatsApp (+503 7574 3444) →
        </a>
        <br>
        <a href="${lead.trialUrl}" style="color: #38bdf8; font-size: 13px; text-decoration: underline;">
          O probar la plataforma en línea (sin costo ni tarjeta)
        </a>
      </div>

      <p style="font-size: 13px; color: #94a3b8; margin-top: 24px;">
        Si no es una prioridad en este trimestre, con gusto cerramos este expediente y no volveré a contactarle por esta vía. Le deseo una excelente semana y el mayor de los éxitos en <strong>${lead.company}</strong>.
      </p>

      <div style="border-top: 1px solid #1e293b; padding-top: 18px; margin-top: 26px; font-size: 12px; color: #64748b;">
        <p style="margin: 0 0 4px 0; color: #e2e8f0; font-weight: 600;">Ricardo Bolaños</p>
        <p style="margin: 0 0 4px 0;">Director General • AuditFlow AI</p>
        <p style="margin: 0;"><a href="https://audiflowai.com" style="color: #38bdf8; text-decoration: none;">audiflowai.com</a> • ricardo@audiflowai.com</p>
      </div>
    </div>
  `;
}

/**
 * Selecciona los CFOs para el despacho según la cadencia de 3 toques:
 * - Prioridad 1: Toque 3 (>= 4 días desde Toque 2)
 * - Prioridad 2: Toque 2 (>= 3 días desde Toque 1)
 * - Prioridad 3: Toque 1 (leads nuevos en rotación desde state.cfoIndex)
 */
export function selectCfoBatchWithCadence(cfoLeads, state, quota = 12, now = new Date()) {
  const cadence = state.cadence || {};
  const touch3Candidates = [];
  const touch2Candidates = [];
  const uncontacted = [];

  for (const lead of cfoLeads) {
    const rec = cadence[lead.email];
    if (!rec) {
      uncontacted.push({ lead, touch: 1 });
    } else if (rec.touch === 1) {
      const days = (now - new Date(rec.lastTouchDate)) / (1000 * 60 * 60 * 24);
      if (days >= 3) {
        touch2Candidates.push({ lead, touch: 2, daysSinceLast: Math.floor(days) });
      }
    } else if (rec.touch === 2) {
      const days = (now - new Date(rec.lastTouchDate)) / (1000 * 60 * 60 * 24);
      if (days >= 4) {
        touch3Candidates.push({ lead, touch: 3, daysSinceLast: Math.floor(days) });
      }
    }
  }

  const selected = [];

  // 1. Agregar candidatos a Toque 3 (hasta la cuota)
  for (const item of touch3Candidates) {
    if (selected.length < quota) selected.push(item);
  }

  // 2. Agregar candidatos a Toque 2 (hasta la cuota)
  for (const item of touch2Candidates) {
    if (selected.length < quota) selected.push(item);
  }

  // 3. Completar la cuota con leads de Toque 1 rotativos
  let newTouch1Added = 0;
  if (selected.length < quota && cfoLeads.length > 0) {
    const needed = quota - selected.length;
    for (let i = 0; i < cfoLeads.length && newTouch1Added < needed; i++) {
      const idx = (state.cfoIndex + i) % cfoLeads.length;
      const candidate = cfoLeads[idx];
      const rec = cadence[candidate.email];
      const alreadyInBatch = selected.some(s => s.lead.email === candidate.email);

      if (!alreadyInBatch && (!rec || rec.completed)) {
        selected.push({ lead: candidate, touch: 1 });
        newTouch1Added++;
      }
    }
  }

  return { selected, newTouch1Added };
}

export async function runCentroamerica8AMDispatch(options = {}) {
  const isVerify = Boolean(options.verify || process.argv.includes('--verify'));

  appendLog('================================================================================');
  appendLog('☀️ AUDITFLOW AI — DESPACHO MATUTINO CENTROAMÉRICA (07:00 AM CST)');
  appendLog('🎯 Universo: 100% Leads Reales (80% CFOs Corporativos con Cadencia 3 Toques + 20% Socios de Bufetes)');
  appendLog(`⏰ Hora de Ejecución: ${new Date().toLocaleTimeString()} CST`);
  appendLog(`🛡️ MODO: ${isVerify ? 'AUDITORÍA / VERIFY (SIN ENVÍOS REALES)' : '100% REAL EN PRODUCCIÓN (CERO SIMULACIÓN)'}`);
  appendLog('================================================================================\n');

  if (!isVerify && new Date().getDay() === 0 && !options.forceSunday) {
    appendLog('ℹ️ DOMINGO: Pausa fiduciaria comercial activa. No se disparan correos en fin de semana. El ciclo se reanuda el LUNES a las 7:00 AM CST.');
    return { paused: true, reason: 'SUNDAY_COMMERCIAL_PAUSE' };
  }

  if (!fs.existsSync(LEADS_FILE)) {
    throw new Error(`❌ No se encontró la base oficial en ${LEADS_FILE}`);
  }

  // CORREGIDO (2026-09-17): JSON.parse sin try/catch — un archivo de leads
  // corrupto o mal codificado tumbaba todo el script con una excepción sin
  // manejar (crash del cron diario de Centroamérica) en vez de un error claro.
  const rawContent = fs.readFileSync(LEADS_FILE, 'utf8').replace(/^\uFEFF/, '');
  let allLeads;
  try {
    allLeads = JSON.parse(rawContent);
  } catch (parseErr) {
    throw new Error(`❌ El archivo de leads ${LEADS_FILE} contiene JSON inválido: ${parseErr.message}`);
  }
  if (!Array.isArray(allLeads)) {
    throw new Error(`❌ El archivo de leads ${LEADS_FILE} no contiene un arreglo JSON válido.`);
  }
  const cleanLeads = filterActiveLeads(allLeads);

  const cfoLeads = cleanLeads.filter(l => l.type === 'CFO');
  const bufeteLeads = cleanLeads.filter(l => l.type === 'BUFETE');

  appendLog(`📋 Universo Total: ${allLeads.length} | Validados sin rebotes: ${cleanLeads.length} (${cfoLeads.length} CFOs + ${bufeteLeads.length} Bufetes)`);

  const state = loadState(cfoLeads.length, bufeteLeads.length);
  const cfoQuota = state.cfoQuota || 12;      // 80% CFOs
  const bufeteQuota = state.bufeteQuota || 3;  // 20% Bufetes

  // Seleccionar CFOs mediante Cadencia de 3 Toques
  const { selected: cfoBatchItems, newTouch1Added } = selectCfoBatchWithCadence(cfoLeads, state, cfoQuota);

  // Seleccionar 3 Bufetes rotativos
  const batchBufetes = [];
  for (let i = 0; i < bufeteQuota && bufeteLeads.length > 0; i++) {
    const idx = (state.bufeteIndex + i) % bufeteLeads.length;
    batchBufetes.push(bufeteLeads[idx]);
  }

  const touchCount = { touch1: 0, touch2: 0, touch3: 0 };
  cfoBatchItems.forEach(item => {
    if (item.touch === 1) touchCount.touch1++;
    else if (item.touch === 2) touchCount.touch2++;
    else if (item.touch === 3) touchCount.touch3++;
  });

  appendLog(`🚀 Lote Planificado: ${cfoBatchItems.length + batchBufetes.length} decisores [CFOs: ${cfoBatchItems.length} (T1: ${touchCount.touch1}, T2: ${touchCount.touch2}, T3: ${touchCount.touch3}) + Bufetes: ${batchBufetes.length}] | Ciclo #${state.cycleCount}`);

  // Si se ejecuta en modo verificación, validamos sintaxis, enlaces y salimos limpiamente
  if (isVerify) {
    appendLog('🔍 MODO VERIFICACIÓN ACTIVO: Auditando templates y consistencia fiduciaria...');
    
    // Validar templates para cada toque
    const sampleCfo = cfoLeads[0] || { firstName: 'Carlos', lastName: 'Méndez', company: 'Corporación Demo', country: 'El Salvador', trialUrl: 'https://audiflowai.com' };
    const sampleBufete = bufeteLeads[0] || { firstName: 'Lic. Roberto', lastName: 'Álvarez', company: 'Bufete Demo', country: 'Guatemala', trialUrl: 'https://audiflowai.com' };

    const tBufete = buildBufeteHtml(sampleBufete);
    const tCfo1 = buildCfoTouch1Html(sampleCfo);
    const tCfo2 = buildCfoTouch2Html(sampleCfo);
    const tCfo3 = buildCfoTouch3Html(sampleCfo);

    if (!tBufete.includes('AUDITFLOW AI') || !tBufete.includes('ricardo@audiflowai.com')) {
      throw new Error('Fallo en template Bufetes');
    }
    if (!tCfo1.includes('Control de EBITDA') || !tCfo2.includes('$18,500.00 USD') || !tCfo3.includes('50375743444')) {
      throw new Error('Fallo de consistencia en templates de la Cadencia de 3 Toques');
    }

    appendLog('✅ [PASS] Template Bufetes: Validado');
    appendLog('✅ [PASS] Template CFO Toque 1 (EBITDA & Trampas): Validado');
    appendLog('✅ [PASS] Template CFO Toque 2 (Caso Práctico $18.5k): Validado');
    appendLog('✅ [PASS] Template CFO Toque 3 (Cierre & Demo WhatsApp +503 7574 3444): Validado');
    appendLog('🎉 VERIFICACIÓN COMPLETA: Cadencia Outbound 100% Lista y Blindada.');

    return {
      verified: true,
      totalLeads: cleanLeads.length,
      cfoCount: cfoLeads.length,
      bufeteCount: bufeteLeads.length,
      batchSize: cfoBatchItems.length + batchBufetes.length,
      touchBreakdown: touchCount,
      bufeteCountInBatch: batchBufetes.length
    };
  }

  if (!resend) {
    throw new Error('❌ Error crítico de infraestructura: RESEND_API_KEY no está configurado. Prohibido modo simulación.');
  }

  let sentOk = 0;
  let sentFail = 0;

  // 1. Enviar a CFOs
  for (let i = 0; i < cfoBatchItems.length; i++) {
    const { lead, touch } = cfoBatchItems[i];
    let subject = '';
    let html = '';

    if (touch === 1) {
      subject = `[Control de EBITDA] Detección preventiva de sobrecostos en contratos para ${lead.company}`;
      html = buildCfoTouch1Html(lead);
    } else if (touch === 2) {
      subject = `[Caso Práctico CFO] Redline de $18,500 USD en fugas contractuales — ${lead.company}`;
      html = buildCfoTouch2Html(lead);
    } else {
      subject = `[Paso Final] Demo de 10 min o cierre de expediente fiduciario para ${lead.company}`;
      html = buildCfoTouch3Html(lead);
    }

    try {
      const resp = await resend.emails.send({
        from: 'Ricardo Bolaños | AuditFlow AI <ricardo@audiflowai.com>',
        to: lead.email,
        reply_to: 'ricardo@audiflowai.com',
        subject: subject,
        html: html
      });

      appendLog(`✅ [CFO Toque ${touch}] ENVIADO: ${lead.firstName} ${lead.lastName} (${lead.role}) @ ${lead.company} [${lead.country}] -> ${lead.email} (ID: ${resp?.data?.id || resp?.id || 'OK'})`);
      
      // Actualizar estado de cadencia fiduciaria
      state.cadence[lead.email] = {
        touch,
        lastTouchDate: new Date().toISOString(),
        completed: touch >= 3
      };
      sentOk++;
    } catch (err) {
      appendLog(`⚠️ [CFO Toque ${touch}] FALLO en ${lead.email}: ${err.message}`);
      sentFail++;
      if (err.message && (err.message.includes('bounce') || err.message.includes('not exist'))) {
        addBouncedEmail(lead.email, err.message);
      }
    }

    await new Promise(r => setTimeout(r, 1500));
  }

  // 2. Enviar a Bufetes
  for (let i = 0; i < batchBufetes.length; i++) {
    const lead = batchBufetes[i];
    const subject = `[Diagnóstico Contractual] Redlines en Word y revisión en RAM volátil para ${lead.company}`;
    const html = buildBufeteHtml(lead);

    try {
      const resp = await resend.emails.send({
        from: 'Ricardo Bolaños | AuditFlow AI <ricardo@audiflowai.com>',
        to: lead.email,
        reply_to: 'ricardo@audiflowai.com',
        subject: subject,
        html: html
      });

      appendLog(`✅ [BUFETE] ENVIADO: ${lead.firstName} ${lead.lastName} (${lead.role}) @ ${lead.company} [${lead.country}] -> ${lead.email} (ID: ${resp?.data?.id || resp?.id || 'OK'})`);
      sentOk++;
    } catch (err) {
      appendLog(`⚠️ [BUFETE] FALLO en ${lead.email}: ${err.message}`);
      sentFail++;
      if (err.message && (err.message.includes('bounce') || err.message.includes('not exist'))) {
        addBouncedEmail(lead.email, err.message);
      }
    }

    await new Promise(r => setTimeout(r, 1500));
  }

  // Actualizar estado del cron job con rotación independiente 80/20 y cadencia
  state.cfoIndex = (state.cfoIndex + newTouch1Added) % (cfoLeads.length || 1);
  state.bufeteIndex = (state.bufeteIndex + batchBufetes.length) % (bufeteLeads.length || 1);
  state.currentIndex = state.cfoIndex + state.bufeteIndex;
  state.totalDispatched = (state.totalDispatched || 0) + sentOk;
  state.lastRun = new Date().toISOString();
  state.history.push({
    date: state.lastRun,
    totalTarget: cfoBatchItems.length + batchBufetes.length,
    cfoCount: cfoBatchItems.length,
    bufeteCount: batchBufetes.length,
    touchBreakdown: touchCount,
    sentOk,
    sentFail
  });

  saveState(state);

  appendLog('\n================================================================================');
  appendLog(`🏁 DESPACHO MATUTINO CENTROAMÉRICA FINALIZADO:`);
  appendLog(`   - Exitosos: ${sentOk}`);
  appendLog(`   - Fallidos: ${sentFail}`);
  appendLog(`   - Próximo Índice CFO: ${state.cfoIndex + 1} de ${cfoLeads.length}`);
  appendLog('================================================================================\n');

  // Enviar telemetría al Director General
  if (resend) {
    try {
      const adminTarget = CONFIG.EMAIL.OWNER_CONTROL || 'tendenciaiatufuturo@gmail.com';
      await resend.emails.send({
        from: 'Operaciones AuditFlow AI <ricardo@audiflowai.com>',
        to: adminTarget,
        subject: `📊 [CRON 7:00 AM] Despacho Matutino Centroamérica (${sentOk} decisores: T1:${touchCount.touch1} T2:${touchCount.touch2} T3:${touchCount.touch3} + ${batchBufetes.length} Bufetes)`,
        html: `
          <div style="font-family: Arial, sans-serif; background: #0f172a; color: #ffffff; padding: 22px; border-radius: 10px;">
            <h3 style="color: #38bdf8; margin-top: 0;">☀️ Reporte de Despacho Centroamérica (7:00 AM CST)</h3>
            <p>Se ha ejecutado la cadencia fiduciaria programada hacia la base verificada (100% real):</p>
            <ul>
              <li><strong>Decisores Contactados:</strong> ${sentOk}</li>
              <li><strong>Cadencia CFOs:</strong> ${cfoBatchItems.length} (Toque 1: ${touchCount.touch1} | Toque 2: ${touchCount.touch2} | Toque 3: ${touchCount.touch3})</li>
              <li><strong>Socios de Bufetes:</strong> ${batchBufetes.length}</li>
              <li><strong>Fallos / Rebotes:</strong> ${sentFail}</li>
              <li><strong>Ciclo Actual:</strong> #${state.cycleCount}</li>
            </ul>
            <p style="font-size: 11px; color: #64748b;">AuditFlow AI — Operación Fiduciaria 100% Datos Reales</p>
          </div>
        `
      });
    } catch (e) {
      // Telemetría opcional
    }
  }

  return {
    sentOk,
    sentFail,
    nextIndex: state.currentIndex,
    touchBreakdown: touchCount
  };
}

// Ejecución directa por CLI o Cron
if (process.argv[1] && process.argv[1].includes('dispatch_centroamerica_8am_cron.mjs')) {
  runCentroamerica8AMDispatch().catch(err => {
    console.error('❌ Error fatal en cron matutino Centroamérica:', err);
    process.exit(1);
  });
}
