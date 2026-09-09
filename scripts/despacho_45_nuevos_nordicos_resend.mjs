import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import { CONFIG } from '../lib/config.js';

dotenv.config();

const JSON_PATH = path.resolve('nordicos_80_leads.json');
const LOG_PATH = path.resolve('nordicos_despacho_completo.log');

console.log('🚀 [AUDITFLOW AI] INICIANDO DESPACHO INMEDIATO: 45 NUEVOS LEADS NÓRDICOS (MOTOR RESEND)...');

if (!fs.existsSync(JSON_PATH)) {
  throw new Error(`No se encontró el archivo de leads en: ${JSON_PATH}`);
}

const allLeads = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8').replace(/^\uFEFF/, ''));
// Filtrar los 45 nuevos leads (a partir del índice 38 en adelante, o los de los nuevos bufetes)
const new45Leads = allLeads.slice(38);
console.log(`📋 Total nuevos leads a despachar hoy: ${new45Leads.length} socios directores.`);

const resendApiKey = (process.env.RESEND_API_KEY || CONFIG.EMAIL.RESEND_API_KEY || '').trim();
if (!resendApiKey) {
  throw new Error('Falta RESEND_API_KEY en variables de entorno.');
}
const resend = new Resend(resendApiKey);

let sentCount = 0;
let errorCount = 0;

const startTime = new Date().toISOString();
fs.appendFileSync(LOG_PATH, `\n--- INICIO DESPACHO 45 NUEVOS NORDICOS: ${startTime} ---\n`, 'utf8');

for (let i = 0; i < new45Leads.length; i++) {
  const lead = new45Leads[i];
  const trialUrl = `https://audiflowai.com/?ref=nordic-midmarket&lang=en&lead=${encodeURIComponent(lead.Nombre)}`;
  const subject = `commercial contract audit & instant word redlines / ${lead.Empresa}`;
  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: #1e293b; max-width: 590px; line-height: 1.6;">
      <p>Dear <strong>${lead.Nombre}</strong>,</p>
      <p>Reaching out regarding commercial agreements and vendor contract oversight at <strong>${lead.Empresa}</strong>.</p>
      <p>Mid-market Nordic practices frequently review multi-page vendor and cross-border agreements where manual line-by-line checks risk missing indexation caps, unilateral penalties, or auto-renewal traps.</p>
      <p>We engineered <strong>AuditFlow AI</strong> as a deterministic fiduciary audit engine specifically designed for mid-market legal teams:</p>
      <div style="background-color: #f8fafc; padding: 14px 18px; border-left: 4px solid #0284c7; margin: 16px 0; border-radius: 6px;">
        <p style="margin: 0 0 6px 0; font-weight: 600; color: #0f172a;">⚡ 8-Second Forensic Review:</p>
        <p style="margin: 0 0 10px 0; color: #334155; font-size: 13px;">Identifies asymmetric liabilities, CPI inflation multipliers, and termination conditions instantly.</p>
        <p style="margin: 0 0 6px 0; font-weight: 600; color: #0f172a;">📄 Direct Word (.docx) Redline with Track Changes:</p>
        <p style="margin: 0 0 10px 0; color: #334155; font-size: 13px;">Outputs institutional counter-clauses ready to negotiate ($19 USD / €19 EUR per agreement, no annual lock-in).</p>
        <p style="margin: 0 0 6px 0; font-weight: 600; color: #0f172a;">🛡️ Strict EU GDPR Art. 28 Compliance:</p>
        <p style="margin: 0; color: #334155; font-size: 13px;">100% ephemeral volatile RAM execution. Zero disk retention. Zero client data used for model retraining.</p>
      </div>
      <p>You can test a complimentary benchmark audit with your team without uploading client confidential documents:</p>
      <p style="margin: 18px 0;">
        👉 <a href="${trialUrl}" style="background-color: #0284c7; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-weight: bold; display: inline-block;">Test Complimentary Agreement Audit (8s) →</a>
      </p>
      <p>Would you be open to running a draft agreement through the engine this week?</p>
      <p style="margin-top: 24px; font-size: 13px; color: #64748b;">
        Best regards,<br>
        <strong style="color: #0f172a;">Ricardo Bolaños</strong><br>
        CEO • AuditFlow AI (<a href="https://audiflowai.com/?lang=en" style="color: #0284c7;">audiflowai.com</a>)
      </p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: 'Ricardo Bolaños | AuditFlow AI <ricardo@audiflowai.com>',
      reply_to: 'tendenciaiatufuturo@gmail.com',
      to: lead.Email,
      subject,
      html: htmlContent
    });

    sentCount++;
    const logLine = `[${new Date().toISOString()}] ✅ [${sentCount}/${new45Leads.length}] ENVIADO (RESEND): ${lead.Nombre} ${lead.Apellido} (${lead.Cargo}) @ ${lead.Empresa} <${lead.Email}> [${lead.Pais}]\n`;
    fs.appendFileSync(LOG_PATH, logLine, 'utf8');
    console.log(`✅ [${sentCount}/${new45Leads.length}] Enviado a: ${lead.Nombre} ${lead.Apellido} @ ${lead.Empresa} (${lead.Pais}) - ${lead.Email}`);

    await new Promise(res => setTimeout(res, 500));
  } catch (err) {
    errorCount++;
    const errLine = `[${new Date().toISOString()}] ⚠️ ERROR en ${lead.Email}: ${err.message}\n`;
    fs.appendFileSync(LOG_PATH, errLine, 'utf8');
    console.warn(`⚠️ [${i + 1}/${new45Leads.length}] Error en ${lead.Email}:`, err.message);
  }
}

// Telemetría al buzón de control
try {
  await resend.emails.send({
    from: 'AuditFlow AI Telemetría <ricardo@audiflowai.com>',
    to: CONFIG.EMAIL.OWNER_CONTROL,
    subject: `❄️ [AUDITFLOW AI] Despacho Completado: 45 Nuevos Socios Nórdicos`,
    html: `
      <div style="font-family: Arial, sans-serif; background: #0f172a; color: #ffffff; padding: 20px; border-radius: 10px;">
        <h3 style="color: #38bdf8; margin-top: 0;">Despacho de los 45 Nuevos Socios Nórdicos Completado</h3>
        <p>Director Ricardo, se ejecutó con éxito el despacho vía Resend API:</p>
        <ul>
          <li><strong>Enviados:</strong> ${sentCount}</li>
          <li><strong>Fallos:</strong> ${errorCount}</li>
          <li><strong>Motor:</strong> Resend API (audiflowai.com)</li>
          <li><strong>Buzón Personal:</strong> Blindado (cero rebotes)</li>
        </ul>
      </div>
    `
  });
  console.log(`\n📬 Telemetría entregada al buzón de control (${CONFIG.EMAIL.OWNER_CONTROL})`);
} catch (adminErr) {
  console.warn('Alerta admin omitida:', adminErr.message);
}

console.log('\n======================================================================');
console.log(`🎉 DESPACHO COMPLETADO: ${sentCount} enviados con éxito, ${errorCount} fallos.`);
console.log('======================================================================\n');
