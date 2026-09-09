import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// ==============================================================================
// AUDITFLOW AI — CAMPAÑA INBOUND NURTURING & STORYTELLING FORENSE (3 CAPÍTULOS)
// Capítulo 1: Lunes 8:30 AM — El Detonante y Suspenso ($142,000 USD)
// Capítulo 2: Miércoles 8:30 AM — La Autopsia de la Cláusula Trampa
// Capítulo 3: Viernes 8:30 AM — El Redline Preventivo y Cierre en audiflowai.com
// ==============================================================================

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
          El error no estuvo en las cláusulas comerciales visibles, sino en una redacción ambigua de 8 palabras que ningún ojo humano cansado detectó tras 4 horas de revisión mecánica.
        </p>

        <p style="font-size: 14px; color: #38bdf8; font-weight: 600; margin-bottom: 20px;">
          El miércoles le compartiré el texto textual de esa cláusula para que verifique si sus contratos actuales con proveedores contienen esta misma trampa.
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
          El viernes le entrego el Redline exacto en Word (.docx con Control de Cambios) que neutraliza esta cláusula antes de firmar.
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
          En <a href="https://audiflowai.com/?ref=nurturing-ch3&lead=${encodeURIComponent(lead.name || '')}" style="color: #38bdf8; font-weight: 600;">audiflowai.com</a> puede subir un borrador confidencial o probar nuestro contrato de muestra. El documento se procesa en memoria RAM volátil, no se guarda en ningún servidor ni entrena inteligencias artificiales, y le genera el reporte Word (.docx) editable al instante.
        </p>

        <div style="text-align: center; margin: 28px 0;">
          <a href="https://audiflowai.com/?ref=nurturing-ch3" style="background-color: #10b981; color: #022c22; padding: 14px 30px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 14px; display: inline-block;">
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

export async function dispatchStorytellingEpisode(chapterNum = 1, leads = [], isDryRun = false) {
  const chapter = CHAPTER_TEMPLATES[chapterNum];
  if (!chapter) throw new Error(`Capítulo inválido: ${chapterNum}`);

  console.log(`======================================================================`);
  console.log(`🚀 DESPACHO DE STORYTELLING FORENSE — CAPÍTULO ${chapterNum}`);
  console.log(`📌 Asunto: ${chapter.subject}`);
  console.log(`👥 Destinatarios objetivo: ${leads.length}`);
  console.log(`⚙️ Modo: ${isDryRun ? 'SIMULACIÓN (DRY RUN)' : 'PRODUCCIÓN / REAL'}`);
  console.log(`======================================================================`);

  const user = process.env.GMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: { user, pass }
  });


  let sentCount = 0;
  const results = [];

  for (const lead of leads) {
    const htmlContent = chapter.renderHtml(lead);
    const mailOptions = {
      from: `"Ricardo | AuditFlow AI" <${user || 'ricardo@audiflowai.com'}>`,
      to: lead.email,
      replyTo: user || 'rick28191@gmail.com',
      subject: chapter.subject,
      html: htmlContent
    };

    if (isDryRun) {
      console.log(`   [DRY-RUN] Preparado para: ${lead.name} <${lead.email}> (${lead.company || lead.firm})`);
      results.push({ lead: lead.email, status: 'dry_run_ready' });
      sentCount++;
    } else {
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`   ✅ Enviado con éxito a: ${lead.name} <${lead.email}> [ID: ${info.messageId}]`);
        results.push({ lead: lead.email, status: 'sent', messageId: info.messageId });
        sentCount++;
      } catch (err) {
        console.error(`   ❌ Error enviando a ${lead.email}:`, err.message);
        results.push({ lead: lead.email, status: 'error', error: err.message });
      }
    }
  }

  console.log(`\n🎉 Despacho finalizado. Total procesados: ${sentCount} / ${leads.length}`);
  return { chapterNum, total: leads.length, sentCount, results };
}

// Ejecución directa por CLI si se invoca el archivo
if (process.argv[1] && process.argv[1].endsWith('dispatch_storytelling_forense_campaign.mjs')) {
  const chapterArg = parseInt(process.argv[2] || '1');
  const isTestOnly = process.argv.includes('--test');

  const targetLeads = isTestOnly
    ? [
        { name: 'Control Técnico', email: 'tendenciaiatufuturo@gmail.com', company: 'AuditFlow AI Control' }
      ]
    : [
        { name: 'Dr. Alejandro Morales', email: 'alejandro.morales@moralescordero.es', firm: 'Morales & Cordero Abogados', company: 'Morales & Cordero Abogados' },
        { name: 'Lic. Fernando Rivas', email: 'fernando.rivas@rivaspineda.sv', firm: 'Rivas & Pineda Corporativo', company: 'Rivas & Pineda' },
        { name: 'Dra. Camila Guzmán', email: 'camila.guzman@guzmanviteri.co', firm: 'Guzmán, Viteri & Asociados', company: 'Guzmán & Viteri' },
        { name: 'Lic. Mariano Batalla', email: 'mariano.batalla@batallalegal.cr', firm: 'Batalla & Asociados', company: 'Batalla Corporativo' }
      ];

  dispatchStorytellingEpisode(chapterArg, targetLeads, false)
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Fallo crítico en despacho:', err);
      process.exit(1);
    });
}
