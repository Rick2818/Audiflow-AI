import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import { CONFIG } from '../lib/config.js';

dotenv.config();

const RESEND_API_KEY = (process.env.RESEND_API_KEY || CONFIG.EMAIL.RESEND_API_KEY || '').trim();
if (!RESEND_API_KEY) {
  console.error('❌ Falta RESEND_API_KEY');
  process.exit(1);
}

const resend = new Resend(RESEND_API_KEY);
const leads = JSON.parse(fs.readFileSync('Nuevo_Pareto_Clientes_Medianos.json', 'utf8'));

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function dispatchAll() {
  console.log(`🚀 Iniciando Despacho Fiduciario a los ${leads.length} Socios Directores del Nuevo Pareto...`);
  const results = [];
  let sentCount = 0;
  let errorCount = 0;

  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    console.log(`\n[${i + 1}/${leads.length}] Despachando a: ${lead.firstName} ${lead.lastName} (${lead.firm}) <${lead.email}>...`);

    const subject = `⚖️ [Forensic Quality Control] A second set of eyes in Microsoft Word (.docx) for ${lead.firm}'s contracts`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>AuditFlow AI — Forensic Quality Control for Law Firms</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f8fafc; padding: 25px; margin: 0;">
  <div style="max-width: 650px; margin: 0 auto; background-color: #111827; border: 1px solid #38bdf8; border-radius: 14px; overflow: hidden; box-shadow: 0 12px 35px rgba(0,0,0,0.6);">
    
    <!-- HEADER -->
    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 25px; border-bottom: 3px solid #10b981;">
      <div style="font-size: 11px; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 1.5px; font-family: monospace;">
        CONFIDENTIAL &bull; EXECUTIVE BRIEFING FOR MANAGING PARTNERS
      </div>
      <h1 style="color: #ffffff; margin: 8px 0 0 0; font-size: 20px; font-weight: 800; line-height: 1.3;">
        Eliminating the Junior Associate Bottleneck in Commercial Agreements
      </h1>
      <p style="color: #94a3b8; font-size: 13px; margin: 6px 0 0 0; font-family: monospace;">
        Prepared for: ${lead.firstName} ${lead.lastName} &bull; ${lead.role} at ${lead.firm}
      </p>
    </div>

    <!-- BODY -->
    <div style="padding: 28px; line-height: 1.65; font-size: 14px; color: #cbd5e1;">
      
      <p style="margin-top: 0; font-size: 15px; color: #ffffff;">
        Dear <strong>${lead.firstName}</strong>,
      </p>

      <p>
        For managing partners and contract practice leads at prestigious firms like <strong>${lead.firm}</strong>, late-night reviews of junior associates' draft agreements remain one of the costliest operational frictions.
      </p>

      <p>
        The danger is rarely obvious; it is the compound price-indexing clause, the hidden unilateral penalty, or the uncapped indemnification tucked away on page 28 that slips past a fatigued second-year associate after hours of screen time.
      </p>

      <!-- VALUE CALLOUT -->
      <div style="background-color: #0f172a; border-left: 4px solid #38bdf8; padding: 18px 20px; border-radius: 8px; margin: 24px 0;">
        <h3 style="margin: 0 0 8px 0; color: #38bdf8; font-size: 15px; font-weight: 700;">
          AuditFlow AI: Deterministic Forensic Auditing Directly in Word (.docx)
        </h3>
        <p style="margin: 0; font-size: 13px; color: #e2e8f0;">
          No new software for your lawyers to learn and zero changes to your existing workflow. Our engine operates strictly in <strong>ephemeral volatile RAM with 0 disk retention (EU GDPR Art. 28 & SOC-2 compliant)</strong>, auditing 50-page agreements in <strong>8 seconds</strong> and generating a redline <strong>Microsoft Word (.docx with Track Changes)</strong> file ready to send to opposing counsel.
        </p>
      </div>

      <h3 style="color: #f59e0b; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 24px 0 12px 0;">
        ⚡ Three Fiduciary Options for ${lead.firm}:
      </h3>

      <!-- TIER 1 -->
      <div style="background: rgba(30, 41, 59, 0.5); border: 1px solid #334155; padding: 16px; border-radius: 10px; margin-bottom: 14px;">
        <strong style="color: #38bdf8; font-size: 14px;">1. Single Forensic Quality Benchmark — $19.00 USD (Single Agreement)</strong>
        <p style="font-size: 13px; color: #94a3b8; margin: 6px 0 0 0;">
          Test any agreement drafted or reviewed by your team this week. Delivers a complete forensic redline in Word (.docx) and an official cryptographic PDF report. Backed by our <strong>10x ROI Fiduciary Guarantee</strong>: it uncovers at least $190+ USD in hidden liability exposure or the fee is instantly refunded.
        </p>
      </div>

      <!-- TIER 2 -->
      <div style="background: rgba(30, 41, 59, 0.5); border: 1px solid #a855f7; padding: 16px; border-radius: 10px; margin-bottom: 14px;">
        <strong style="color: #c084fc; font-size: 14px;">2. Partner's Monthly Shield (Pro) — $69.00 USD / month</strong>
        <p style="font-size: 13px; color: #94a3b8; margin: 6px 0 0 0;">
          Up to 20 comprehensive agreement audits per month ($3.45 USD per contract). The continuous safety net ensuring no client contract leaves your practice without automated forensic verification.
        </p>
      </div>

      <!-- TIER 3 -->
      <div style="background: rgba(30, 41, 59, 0.5); border: 1px solid #10b981; padding: 16px; border-radius: 10px; margin-bottom: 22px;">
        <strong style="color: #34d399; font-size: 14px;">3. Firm-Wide Corporate License — $590.00 USD / year (Unlimited)</strong>
        <p style="font-size: 13px; color: #94a3b8; margin: 6px 0 0 0;">
          Unlimited 24/7 multi-seat access for your entire commercial & corporate practice group, 2-Way Cross-Audit (Contract vs Invoice tie-outs), and priority dedicated engine capacity.
        </p>
      </div>

      <!-- CTA -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://audiflowai.com/?lang=en&ref=pareto-midmarket&lead=${encodeURIComponent(lead.firstName)}" style="display: inline-block; background: linear-gradient(135deg, #38bdf8 0%, #10b981 100%); color: #000000; font-weight: 800; font-size: 14px; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-family: monospace; box-shadow: 0 4px 15px rgba(56, 189, 248, 0.4);">
          ⚡ Run a Confidential Audit (8s Benchmark) &rarr;
        </a>
        <div style="margin-top: 10px; font-size: 11px; color: #64748b; font-family: monospace;">
          Zero Disk Storage &bull; Ephemeral RAM Processing &bull; audiflowai.com
        </div>
      </div>

      <hr style="border: 0; border-top: 1px solid #1f2937; margin: 24px 0;">

      <!-- SIGNATURE -->
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="vertical-align: top; width: 50px;">
            <div style="width: 44px; height: 44px; border-radius: 10px; background: linear-gradient(135deg, #38bdf8, #10b981); display: flex; align-items: center; justify-content: center; font-weight: 800; color: #000; font-size: 20px; text-align: center; line-height: 44px;">
              A
            </div>
          </td>
          <td style="padding-left: 12px; vertical-align: middle;">
            <strong style="color: #ffffff; font-size: 14px; display: block;">AuditFlow AI &bull; Executive Operations</strong>
            <span style="color: #38bdf8; font-size: 12px; font-family: monospace;">cmvo@audiflowai.com &bull; audiflowai.com</span><br>
            <span style="color: #64748b; font-size: 11px;">EU GDPR Article 28 Compliant &bull; Zero Disk Storage Architecture</span>
          </td>
        </tr>
      </table>

    </div>
  </div>
</body>
</html>
    `;

    try {
      const response = await resend.emails.send({
        from: 'Directora de Marketing | AuditFlow AI <cmvo@audiflowai.com>',
        to: [lead.email],
        reply_to: 'tendenciaiatufuturo@gmail.com',
        subject,
        html
      });

      if (response && response.data && response.data.id) {
        console.log(`   ✅ [ENVIADO CON ÉXITO] ID Resend: ${response.data.id}`);
        results.push({
          id: lead.id,
          name: `${lead.firstName} ${lead.lastName}`,
          firm: lead.firm,
          email: lead.email,
          resendId: response.data.id,
          status: 'DELIVERED_TO_RESEND',
          timestamp: new Date().toISOString()
        });
        sentCount++;
      } else {
        throw new Error(response.error?.message || 'Respuesta inesperada de Resend');
      }
    } catch (err) {
      console.error(`   ❌ [ERROR AL ENVIAR]: ${err.message}`);
      results.push({
        id: lead.id,
        name: `${lead.firstName} ${lead.lastName}`,
        firm: lead.firm,
        email: lead.email,
        status: 'FAILED',
        error: err.message,
        timestamp: new Date().toISOString()
      });
      errorCount++;
    }

    // Pausa fiduciaria de 1.5 segundos entre envíos
    await sleep(1500);
  }

  // Guardar log de telemetría auditable
  if (!fs.existsSync('logs')) fs.mkdirSync('logs', { recursive: true });
  const telemetry = {
    campaign: 'Nuevo Pareto Clientes Medianos (25 Bufetes)',
    date: new Date().toISOString(),
    totalLeads: leads.length,
    sentCount,
    errorCount,
    results
  };

  fs.writeFileSync('logs/nuevo_pareto_dispatch_telemetry.json', JSON.stringify(telemetry, null, 2), 'utf8');
  console.log(`\n================================================================================`);
  console.log(`🏁 DESPACHO COMPLETADO: ${sentCount} exitosos de ${leads.length} (${errorCount} errores).`);
  console.log(`📁 Telemetría guardada en: logs/nuevo_pareto_dispatch_telemetry.json`);
  console.log(`================================================================================\n`);
}

dispatchAll().catch(console.error);
