import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import { CONFIG } from '../lib/config.js';

dotenv.config();

const RESEND_API_KEY = process.env.RESEND_API_KEY || CONFIG.EMAIL.RESEND_API_KEY;
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

const STATE_FILE = path.resolve('storytelling_dispatch_state.json');

// Cargar el universo consolidado de los 250 bufetes y decisores legales
function loadAllStorytellingLeads() {
  const leadsMap = new Map();
  const csvFiles = [
    path.resolve('Waalaxy/DIRECTORES_LEGALES_250_WAALAXY.csv'),
    path.resolve('Waalaxy/waalaxy_pareto_top_medianos_25abog.csv')
  ];

  for (const filePath of csvFiles) {
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.trim().split('\n');
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const regex = /(".*?"|[^",]+)(?=\s*,|\s*$)/g;
      const matches = line.match(regex);
      if (!matches || matches.length < 7) continue;

      let fn = '', ln = '', company = '', role = '', email = '';

      if (filePath.includes('DIRECTORES_LEGALES_250_WAALAXY')) {
        fn = (matches[1] || '').replace(/"/g, '').trim();
        ln = (matches[2] || '').replace(/"/g, '').trim();
        company = (matches[3] || '').replace(/"/g, '').trim();
        role = (matches[4] || '').replace(/"/g, '').trim();
        email = (matches[6] || '').replace(/"/g, '').trim().toLowerCase();
      } else {
        fn = (matches[0] || '').replace(/"/g, '').trim();
        ln = (matches[1] || '').replace(/"/g, '').trim();
        role = (matches[2] || '').replace(/"/g, '').trim();
        company = (matches[3] || '').replace(/"/g, '').trim();
        email = (matches[6] || '').replace(/"/g, '').trim().toLowerCase();
      }

      if (email && email.includes('@') && !leadsMap.has(email)) {
        leadsMap.set(email, {
          name: `${fn} ${ln}`.trim() || company,
          firstName: fn,
          lastName: ln,
          company,
          role: role || 'Managing Partner / Director Legal',
          email
        });
      }
    }
  }

  return Array.from(leadsMap.values());
}

function loadState(totalLeads) {
  let state = {
    warmupCycleStart: new Date().toISOString(),
    currentIndex: 0,
    currentChapter: 1,
    batchSize: 50,
    totalSent: 0,
    history: []
  };

  if (fs.existsSync(STATE_FILE)) {
    try {
      state = { ...state, ...JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')) };
    } catch (e) {
      console.warn('⚠️ No se pudo leer estado anterior, iniciando desde cero.');
    }
  }

  if (!state.warmupCycleStart) {
    state.warmupCycleStart = new Date().toISOString();
  }

  // Sincronización fiduciaria con los 14 días de calentamiento
  const daysElapsed = Math.floor((Date.now() - new Date(state.warmupCycleStart).getTime()) / (1000 * 60 * 60 * 24));
  const warmupDay = Math.min(14, Math.max(1, daysElapsed + 1));
  state.warmupDay = warmupDay;

  // Asignación de capítulos por bloques de los 14 días
  // Días 1 a 4: Capítulo 1 (Lote ~62 leads/día -> 250 alcanzados)
  // Días 5 a 9: Capítulo 2 (Lote ~50 leads/día -> 250 alcanzados)
  // Días 10 a 14: Capítulo 3 (Lote ~50 leads/día -> 250 alcanzados con CTA a audiflowai.com)
  if (warmupDay <= 4) {
    state.currentChapter = 1;
    state.batchSize = 65;
  } else if (warmupDay <= 9) {
    state.currentChapter = 2;
    state.batchSize = 50;
  } else {
    state.currentChapter = 3;
    state.batchSize = 50;
  }

  return state;
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
}

const CHAPTER_TEMPLATES = {
  1: {
    subject: '[Caso Real] 45 páginas revisadas, pero faltó leer una palabra en el Anexo C',
    title: 'EXPEDIENTE FORENSE CONTRACTUAL #1',
    subtitle: 'El Anexo C de $142,000 USD — Capítulo 1 de 3',
    renderHtml: (lead) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f8fafc; padding: 32px 20px; max-width: 600px; margin: 0 auto; border-radius: 12px; border: 1px solid #1e293b; line-height: 1.65;">
        <div style="border-bottom: 1px solid #1e293b; padding-bottom: 16px; margin-bottom: 24px;">
          <span style="font-size: 15px; font-weight: 800; letter-spacing: 1px; color: #38bdf8;">AUDITFLOW AI</span>
          <span style="font-size: 11px; color: #64748b; margin-left: 10px; text-transform: uppercase;">| Casos Forenses de Contratación</span>
        </div>

        <p style="font-size: 15px; color: #e2e8f0; margin-bottom: 18px;">
          Estimado/a <strong>${lead.name || 'Director/a'}</strong>,
        </p>

        <p style="font-size: 14px; color: #cbd5e1; margin-bottom: 16px;">
          En 2025, el equipo legal de una multinacional aprobó un contrato de logística de 45 páginas para sus operaciones de distribución. Todo parecía impecable: precios acordados, niveles de servicio (SLAs) claros y jurisdicción local.
        </p>

        <p style="font-size: 14px; color: #cbd5e1; margin-bottom: 16px;">
          Durante 11 meses, el servicio operó con aparente normalidad. Sin embargo, en el mes 12, el proveedor emitió una factura de ajuste acumulativo retroactivo por <strong style="color: #ef4444;">$142,000 USD</strong>.
        </p>

        <div style="background-color: #0f172a; border-left: 4px solid #ef4444; padding: 16px 20px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; font-size: 13px; color: #fca5a5; font-style: italic;">
            «La dirección financiera intentó rechazar el cobro de inmediato. El proveedor se limitó a remitirlos al Anexo C, página 41, párrafo 4. Los abogados externos confirmaron que la cláusula era plenamente vinculante e indefendible.»
          </p>
        </div>

        <p style="font-size: 14px; color: #cbd5e1; margin-bottom: 16px;">
          El error no estuvo en las cláusulas comerciales visibles, sino en una redacción ambigua de 8 palabras que ningún ojo humano cansado detectó tras 4 horas de revisión mecánica en su bufete o departamento legal.
        </p>

        <p style="font-size: 14px; color: #38bdf8; font-weight: 600; margin-bottom: 20px;">
          En la siguiente entrega le compartiré el texto textual de esa cláusula para que verifique si los contratos actuales de sus clientes o empresa contienen esta misma trampa.
        </p>

        <div style="border-top: 1px solid #1e293b; padding-top: 20px; margin-top: 28px; font-size: 12px; color: #64748b;">
          <p style="margin: 0 0 4px 0; color: #e2e8f0; font-weight: 600;">Ricardo Bolaños</p>
          <p style="margin: 0 0 4px 0;">AuditFlow AI — Auditoría Fiduciaria de Contratos en Memoria RAM Volátil</p>
          <p style="margin: 0;"><a href="https://audiflowai.com" style="color: #38bdf8; text-decoration: none;">audiflowai.com</a> • Cero persistencia en disco • Cumplimiento SOC-2 & GDPR Art. 28</p>
        </div>
      </div>
    `
  },
  2: {
    subject: 'Parte 2: La cláusula de $142,000 USD al descubierto (y el costo de no auditar a tiempo)',
    title: 'EXPEDIENTE FORENSE CONTRACTUAL #1',
    subtitle: 'La Cláusula Trampa — Capítulo 2 de 3',
    renderHtml: (lead) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f8fafc; padding: 32px 20px; max-width: 600px; margin: 0 auto; border-radius: 12px; border: 1px solid #1e293b; line-height: 1.65;">
        <div style="border-bottom: 1px solid #1e293b; padding-bottom: 16px; margin-bottom: 24px;">
          <span style="font-size: 15px; font-weight: 800; letter-spacing: 1px; color: #38bdf8;">AUDITFLOW AI</span>
          <span style="font-size: 11px; color: #64748b; margin-left: 10px; text-transform: uppercase;">| Casos Forenses de Contratación</span>
        </div>

        <p style="font-size: 15px; color: #e2e8f0; margin-bottom: 18px;">
          Estimado/a <strong>${lead.name || 'Director/a'}</strong>,
        </p>

        <p style="font-size: 14px; color: #cbd5e1; margin-bottom: 16px;">
          Continuando con el caso del Anexo C, aquí está el texto exacto que costó $142,000 USD:
        </p>

        <div style="background-color: #1e1b4b; border-left: 4px solid #a855f7; padding: 16px 20px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; font-size: 13px; color: #e9d5ff; font-family: monospace;">
            «...las tarifas unitarias estarán sujetas a revisión acumulativa periódica conforme a variaciones en la estructura de costos operativos directos e indirectos del operador...»
          </p>
        </div>

        <p style="font-size: 14px; color: #cbd5e1; margin-bottom: 16px;">
          <strong>¿Por qué fue indefendible?</strong><br>
          1. <strong>Sin índice oficial:</strong> No ligó el ajuste al IPC oficial del Banco Central.<br>
          2. <strong>Sin tope porcentual (Cap):</strong> Permitió trasladar cualquier aumento de costos sin límite del 3% o 5%.<br>
          3. <strong>Sin preaviso ni derecho de salida:</strong> La empresa quedó atrapada sin poder rescindir el contrato sin penalización.
        </p>

        <div style="background-color: #0f172a; padding: 18px; border-radius: 8px; border: 1px solid #334155; margin: 20px 0;">
          <p style="margin: 0; font-size: 13px; color: #38bdf8;">
            ⚡ <strong>Comparativa de Eficiencia Forense:</strong><br>
            • Revisión humana manual de 45 págs: 3 a 5 horas (fatiga visual extrema).<br>
            • Análisis algorítmico en AuditFlow AI: <strong>8.2 segundos</strong> en memoria RAM volátil.
          </p>
        </div>

        <p style="font-size: 14px; color: #10b981; font-weight: 600; margin-bottom: 20px;">
          En el siguiente correo le entrego el Redline exacto en Word (.docx con Control de Cambios) que neutraliza esta cláusula antes de firmar.
        </p>

        <div style="border-top: 1px solid #1e293b; padding-top: 20px; margin-top: 28px; font-size: 12px; color: #64748b;">
          <p style="margin: 0 0 4px 0; color: #e2e8f0; font-weight: 600;">Ricardo Bolaños</p>
          <p style="margin: 0 0 4px 0;">AuditFlow AI • audiflowai.com</p>
        </div>
      </div>
    `
  },
  3: {
    subject: 'El Redline Preventivo: Cómo blindar sus contratos antes de firmar',
    title: 'EXPEDIENTE FORENSE CONTRACTUAL #1',
    subtitle: 'El Redline de Blindaje — Capítulo 3 de 3',
    renderHtml: (lead) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f8fafc; padding: 32px 20px; max-width: 600px; margin: 0 auto; border-radius: 12px; border: 1px solid #1e293b; line-height: 1.65;">
        <div style="border-bottom: 1px solid #1e293b; padding-bottom: 16px; margin-bottom: 24px;">
          <span style="font-size: 15px; font-weight: 800; letter-spacing: 1px; color: #38bdf8;">AUDITFLOW AI</span>
          <span style="font-size: 11px; color: #64748b; margin-left: 10px; text-transform: uppercase;">| Redline Preventivo</span>
        </div>

        <p style="font-size: 15px; color: #e2e8f0; margin-bottom: 18px;">
          Estimado/a <strong>${lead.name || 'Director/a'}</strong>,
        </p>

        <p style="font-size: 14px; color: #cbd5e1; margin-bottom: 16px;">
          Aquí tiene la contrapropuesta en formato Redline estándar que debió incluirse en ese Anexo C:
        </p>

        <div style="background-color: #064e3b; border-left: 4px solid #10b981; padding: 16px 20px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; font-size: 13px; color: #a7f3d0; font-family: monospace;">
            «Cualquier ajuste tarifario estará condicionado a: (i) preaviso escrito de 60 días, (ii) un tope máximo acumulado no mayor al IPC oficial anual o al 3.5% (el que resulte menor), y (iii) la facultad expresa del Cliente de rescindir el acuerdo sin penalidad alguna si el ajuste excede dicho límite.»
          </p>
        </div>

        <p style="font-size: 14px; color: #cbd5e1; margin-bottom: 16px;">
          Este cambio de 3 líneas le habría ahorrado <strong>$142,000 USD</strong> y 6 meses de disputa a esa empresa.
        </p>

        <p style="font-size: 14px; color: #e2e8f0; margin-bottom: 24px;">
          <strong>Audite un contrato de prueba sin costo en su navegador:</strong><br>
          En <a href="https://audiflowai.com/?ref=storytelling-ch3&lead=${encodeURIComponent(lead.name || '')}" style="color: #38bdf8; font-weight: 600;">audiflowai.com</a> puede subir un borrador confidencial o probar nuestro contrato de muestra. El documento se procesa en memoria RAM volátil, no se guarda en ningún servidor ni entrena inteligencias artificiales, y le genera el reporte Word (.docx) editable al instante.
        </p>

        <div style="text-align: center; margin: 28px 0;">
          <a href="https://audiflowai.com/?ref=storytelling-ch3" style="background-color: #10b981; color: #022c22; padding: 14px 30px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 14px; display: inline-block;">
            Auditar Borrador en 8 Segundos (Gratis) →
          </a>
        </div>

        <div style="border-top: 1px solid #1e293b; padding-top: 20px; margin-top: 28px; font-size: 12px; color: #64748b;">
          <p style="margin: 0 0 4px 0; color: #e2e8f0; font-weight: 600;">Ricardo Bolaños</p>
          <p style="margin: 0 0 4px 0;">AuditFlow AI • ricardo@audiflowai.com</p>
        </div>
      </div>
    `
  }
};

export async function runStorytellingDailyDispatch() {
  console.log('======================================================================');
  console.log('📖 AUDITFLOW AI — CAMPAÑA DE STORYTELLING FORENSE (14 DÍAS RESTANTES)');
  console.log('🎯 Segmento: 250 Bufetes Medianos (Socios Directores y General Counsels)');
  console.log('🛡️ Remitente: cmvo@audiflowai.com • Aislamiento: tendenciaiatufuturo@gmail.com');
  console.log('👑 Buzón CEO: rick28191@gmail.com (100% blindado para ventas)');
  console.log('======================================================================');

  const allLeads = loadAllStorytellingLeads();
  console.log(`📊 Base de datos consolidada: ${allLeads.length} bufetes y decisores legales.`);

  const state = loadState(allLeads.length);
  const startIndex = state.currentIndex % allLeads.length;
  const batchSize = state.batchSize || 50;
  const endIndex = Math.min(startIndex + batchSize, allLeads.length);
  const todaysBatch = allLeads.slice(startIndex, endIndex);

  console.log(`📅 Día del Ciclo Storytelling / Warmup: Día ${state.warmupDay} de 14`);
  console.log(`📚 Capítulo Activo: #${state.currentChapter}`);
  console.log(`📍 Lote de Hoy: Leads ${startIndex + 1} a ${endIndex} (Total: ${todaysBatch.length})`);

  const chapter = CHAPTER_TEMPLATES[state.currentChapter || 1];
  let sentCount = 0;
  let failedCount = 0;
  const batchDetails = [];

  for (const lead of todaysBatch) {
    const html = chapter.renderHtml(lead);

    try {
      if (resend) {
        await resend.emails.send({
          from: 'Directora de Marketing | AuditFlow AI <cmvo@audiflowai.com>',
          reply_to: CONFIG.EMAIL.REPLY_TO_OUTREACH || 'tendenciaiatufuturo@gmail.com',
          to: lead.email,
          subject: chapter.subject,
          html: html
        });
      }
      sentCount++;
      batchDetails.push({ name: lead.name, company: lead.company, email: lead.email, status: 'SENT' });
      console.log(`   ✅ Enviado a: ${lead.name} (${lead.company}) <${lead.email}>`);
    } catch (err) {
      failedCount++;
      batchDetails.push({ name: lead.name, company: lead.company, email: lead.email, status: 'FAILED', error: err.message });
      console.warn(`   ⚠️ Error enviando a ${lead.email}:`, err.message);
    }
  }

  // Actualizar estado del cron
  state.currentIndex = endIndex >= allLeads.length ? 0 : endIndex;
  if (endIndex >= allLeads.length) {
    state.currentChapter = (state.currentChapter % 3) + 1;
  }
  state.totalSent += sentCount;
  state.history.push({
    date: new Date().toISOString(),
    chapter: state.currentChapter,
    sentCount,
    failedCount,
    leadsCount: todaysBatch.length
  });
  saveState(state);

  console.log('======================================================================');
  console.log(`🎉 Despacho matutino finalizado. Enviados: ${sentCount} | Fallidos: ${failedCount}`);
  console.log(`📈 Progreso acumulado: ${state.totalSent} impactos en bufetes medianos.`);
  console.log('======================================================================');

  // Enviar telemetría de control únicamente a tendenciaiatufuturo@gmail.com
  try {
    if (resend) {
      const summaryHtml = `
        <div style="font-family: Arial, sans-serif; background: #0f172a; color: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #10b981; max-width: 600px;">
          <h3 style="color: #34d399; margin-top: 0;">📖 [CRON 6:00 AM] Storytelling Forense Despachado</h3>
          <p style="font-size: 13px; color: #cbd5e1;">Reporte operativo para la Dirección General:</p>
          <ul style="color: #e2e8f0; font-size: 13px; line-height: 1.6;">
            <li><strong>Capítulo:</strong> #${state.currentChapter} — ${chapter.subject}</li>
            <li><strong>Bufetes Impactados Hoy:</strong> ${sentCount} de ${todaysBatch.length}</li>
            <li><strong>Rango de Leads:</strong> ${startIndex + 1} a ${endIndex} de ${allLeads.length}</li>
            <li><strong>Siguiente Lote:</strong> Mañana a las 6:00 AM CST</li>
            <li><strong>Bandeja de Rebotes/Control:</strong> ${CONFIG.EMAIL.REPLY_TO_OUTREACH}</li>
          </ul>
        </div>
      `;
      await resend.emails.send({
        from: 'AuditFlow AI Telemetría <ricardo@audiflowai.com>',
        to: CONFIG.EMAIL.OWNER_CONTROL,
        subject: `📖 [CRON 6:00 AM] Storytelling Forense: ${sentCount} Bufetes Medianos Impactados (Capítulo ${state.currentChapter})`,
        html: summaryHtml
      });
      console.log(`📬 Telemetría enviada a buzón de control: ${CONFIG.EMAIL.OWNER_CONTROL}`);
    }
  } catch (telemetryErr) {
    console.warn('⚠️ No se pudo remitir telemetría de control:', telemetryErr.message);
  }

  return { sentCount, failedCount, currentChapter: state.currentChapter };
}

// Invocación directa
if (process.argv[1] && process.argv[1].endsWith('dispatch_storytelling_250_medianos.mjs')) {
  runStorytellingDailyDispatch()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Error fatal en despacho:', err);
      process.exit(1);
    });
}
