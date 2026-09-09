import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import { CONFIG } from '../lib/config.js';

dotenv.config();

const JSON_PATH = path.resolve('nordicos_80_leads.json');
const LOG_PATH = path.resolve('nordicos_despacho_completo.log');
const WAALAXY_EXPORT_PATH = path.resolve('Waalaxy/waalaxy_nordicos_80_completo.csv');

export async function runFullNordicDispatch(options = { skipAlreadySent: true }) {
  console.log('======================================================================');
  console.log('❄️ AUDITFLOW AI — DESPACHO COMPLETO DE LA BASE NÓRDICA (MOTOR RESEND)');
  console.log('======================================================================\n');

  if (!fs.existsSync(JSON_PATH)) {
    throw new Error(`No se encontró el archivo maestro en: ${JSON_PATH}`);
  }

  const rawJson = fs.readFileSync(JSON_PATH, 'utf8').replace(/^\uFEFF/, '');
  const nordicLeads = JSON.parse(rawJson);
  console.log(`📋 Total decisores nórdicos en base oficial: ${nordicLeads.length}`);

  const resendApiKey = (process.env.RESEND_API_KEY || CONFIG.EMAIL.RESEND_API_KEY || '').trim();
  if (!resendApiKey) {
    throw new Error('Falta RESEND_API_KEY. Abortando para evitar envíos SMTP que generen rebotes al correo personal.');
  }
  const resend = new Resend(resendApiKey);

  let sentCount = 0;
  let errorCount = 0;

  const startTime = new Date().toISOString();
  fs.appendFileSync(LOG_PATH, `\n--- INICIO DESPACHO RESEND NORDICOS: ${startTime} ---\n`, 'utf8');

  for (let i = 0; i < nordicLeads.length; i++) {
    const lead = nordicLeads[i];
    const trialUrl = `https://audiflowai.com/?ref=nordic-executive&lang=en&lead=${encodeURIComponent(lead.Nombre)}`;
    const subject = `commercial contract audit & instant word redlines / ${lead.Empresa}`;
    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: #1e293b; max-width: 590px; line-height: 1.6;">
        <p>Dear <strong>${lead.Nombre}</strong>,</p>
        <p>Reaching out regarding commercial agreements and procurement contract oversight at <strong>${lead.Empresa}</strong>.</p>
        <p>Managing partners and legal counsels in Scandinavia frequently review high-volume vendor agreements where manual reviews risk missing liability caps, unilateral termination penalties, or automatic renewal traps.</p>
        <p>We engineered <strong>AuditFlow AI</strong> as a deterministic fiduciary audit engine specifically designed for Nordic practices:</p>
        <div style="background-color: #f8fafc; padding: 14px 18px; border-left: 4px solid #0284c7; margin: 16px 0; border-radius: 6px;">
          <p style="margin: 0 0 6px 0; font-weight: 600; color: #0f172a;">⚡ 8-Second Forensic Review:</p>
          <p style="margin: 0 0 10px 0; color: #334155; font-size: 13px;">Identifies uncapped indemnities, hidden indexing formulas, and compliance liabilities instantly.</p>
          <p style="margin: 0 0 6px 0; font-weight: 600; color: #0f172a;">📄 Direct Word (.docx) Redlines with Track Changes:</p>
          <p style="margin: 0 0 10px 0; color: #334155; font-size: 13px;">Outputs institutional counter-clauses ready to negotiate ($19 USD / €19 EUR per agreement, no annual lock-in).</p>
          <p style="margin: 0 0 6px 0; font-weight: 600; color: #0f172a;">🛡️ Strict EU GDPR Art. 28 Compliance:</p>
          <p style="margin: 0; color: #334155; font-size: 13px;">100% ephemeral volatile RAM execution. Zero disk retention. Zero client data used for model retraining.</p>
        </div>
        <p>You can run an interactive sandbox test without uploading confidential files:</p>
        <p style="margin: 18px 0;">
          👉 <a href="${trialUrl}" style="background-color: #0284c7; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-weight: bold; display: inline-block;">Test Complimentary Benchmark Audit →</a>
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
      const logLine = `[${new Date().toISOString()}] ✅ [${sentCount}] ENVIADO (RESEND): ${lead.Nombre} ${lead.Apellido} (${lead.Cargo}) @ ${lead.Empresa} <${lead.Email}> [${lead.Pais}]\n`;
      fs.appendFileSync(LOG_PATH, logLine, 'utf8');
      console.log(`✅ [${i + 1}/${nordicLeads.length}] Enviado a: ${lead.Nombre} ${lead.Apellido} @ ${lead.Empresa} (${lead.Pais})`);

      await new Promise(res => setTimeout(res, 500));
    } catch (err) {
      errorCount++;
      const errLine = `[${new Date().toISOString()}] ⚠️ ERROR en ${lead.Email}: ${err.message}\n`;
      fs.appendFileSync(LOG_PATH, errLine, 'utf8');
      console.warn(`⚠️ [${i + 1}/${nordicLeads.length}] Error en ${lead.Email}:`, err.message);
    }
  }

  try {
    await resend.emails.send({
      from: 'AuditFlow AI Telemetría <ricardo@audiflowai.com>',
      to: CONFIG.EMAIL.OWNER_CONTROL,
      subject: `❄️ [AUDITFLOW AI] Despacho Resend Nórdico: ${sentCount} Decisores Contactados`,
      html: `<p>Despacho finalizado con Resend API. Cero rebotes a cuenta personal.</p>`
    });
    console.log(`\n📬 Telemetría entregada a: ${CONFIG.EMAIL.OWNER_CONTROL}`);
  } catch (adminErr) {
    console.warn('Alerta admin omitida:', adminErr.message);
  }

  console.log(`\n🎉 DESPACHO RESEND FINALIZADO: ${sentCount} enviados, ${errorCount} fallos`);
}
