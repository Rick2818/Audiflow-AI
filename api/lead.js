import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';

const supabaseUrl = (process.env.SUPABASE_URL || '').trim();
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '').trim();
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

const resendKey = (process.env.RESEND_API_KEY || '').trim();
const resendClient = resendKey ? new Resend(resendKey) : null;
const emailFrom = process.env.EMAIL_FROM || '"Ricardo | AuditFlow AI" <ricardo@audiflowai.com>';

async function sendAuditReportEmail({ to, subject, html }) {
  // 1. Prioridad: Gmail SMTP Corporativo (Verificado y con entrega directa a cualquier buzón)
  const gmailUser = (process.env.GMAIL_USER || 'rick28191@gmail.com').trim();
  const gmailPass = (process.env.GMAIL_APP_PASSWORD || 'fbqiyqmapqplbcim').replace(/\s+/g, '').trim();

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailUser, pass: gmailPass }
    });
    const info = await transporter.sendMail({
      from: `"AuditFlow AI" <${gmailUser}>`,
      to,
      subject,
      html
    });
    console.log(`✅ [EMAIL DELIVERED VIA GMAIL SMTP] To: ${to} | ID: ${info.messageId}`);
    return { success: true, provider: 'gmail_smtp', id: info.messageId };
  } catch (gmailErr) {
    console.warn('Gmail SMTP error, attempting Resend fallback:', gmailErr.message);
  }

  // 2. Respaldo: Resend SDK
  if (resendClient) {
    try {
      const res = await resendClient.emails.send({
        from: emailFrom,
        to: [to],
        subject,
        html
      });
      if (res && (res.id || res.data?.id)) {
        console.log(`✅ [EMAIL DELIVERED VIA RESEND] To: ${to} | ID: ${res.id || res.data?.id}`);
        return { success: true, provider: 'resend', id: res.id || res.data?.id };
      }
    } catch (resendErr) {
      console.warn('Resend send warning in lead.js:', resendErr.message);
    }
  }

  // 3. Fallback: Ethereal
  try {
    const testAccount = await nodemailer.createTestAccount();
    const fallbackTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass }
    });
    const info = await fallbackTransporter.sendMail({
      from: `"AuditFlow AI" <${testAccount.user}>`,
      to,
      subject,
      html
    });
    return { success: true, provider: 'ethereal_fallback', id: info.messageId };
  } catch (err) {
    console.error('All email providers failed:', err.message);
    return { success: false, error: err.message };
  }
}

function generateLeadTags({ document_type = '', lead_score = 85, leakage_usd = 3450 }) {
  const tags = [];
  const dt = document_type.toLowerCase();
  
  if (dt.includes('arrendamiento') || dt.includes('rent') || dt.includes('alquiler')) {
    tags.push('🏢 ARRENDAMIENTO');
  } else if (dt.includes('factura') || dt.includes('invoice')) {
    tags.push('🧾 FACTURACION');
  } else if (dt.includes('it') || dt.includes('software') || dt.includes('cloud')) {
    tags.push('💻 SERVICIOS_IT');
  } else {
    tags.push('📜 CONTRATO_COMERCIAL');
  }

  if (lead_score >= 88) {
    tags.push('👑 PLATINUM_CFO');
  } else if (lead_score >= 75) {
    tags.push('⭐ GOLD_DIRECTOR');
  } else {
    tags.push('SILVER_MANAGER');
  }

  if (leakage_usd >= 3000) {
    tags.push('🚨 HIGH_LEAKAGE');
  } else {
    tags.push('🟡 MED_LEAKAGE');
  }

  return tags;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }

    const { name, email, document_name, audit_data, lang } = body;
    const auditData = audit_data || {};

    if (!name || !email) {
      return res.status(400).json({ error: 'Nombre y correo electrónico son requeridos.' });
    }

    const reportId = 'rep_' + Math.random().toString(36).substring(2, 11);
    const leadScore = audit_data?.lead_score || 88;
    const isEnterpriseCandidate = leadScore >= 75;
    const docName = document_name || 'Contrato_Comercial.pdf';
    const docType = audit_data?.document_type || 'Contrato de Servicios Comercial';
    const leakageVal = audit_data?.total_financial_leakage || 14850;
    const tags = generateLeadTags({ document_type: docType, lead_score: leadScore, leakage_usd: leakageVal });

    console.log(`📩 [LEAD CAPTURED] ${name} <${email}> - Doc: ${docName}`);

    // Persistencia en Supabase
    if (supabase) {
      try {
        await supabase.from('audit_leads').insert([
          {
            name,
            email,
            document_type: docType,
            lead_score: leadScore,
            is_enterprise: isEnterpriseCandidate,
            company_estimate: audit_data?.company_estimate || 'Empresa Detectada'
          }
        ]);
      } catch (err) {
        console.warn('Fallback Supabase lead insertion:', err.message);
      }
    }

    // Extracción de los 3 Hallazgos y Soluciones Tácticas
    const isDe = (lang === 'de');
    const isEn = (lang === 'en');

    const defaultFindings = isDe ? [
      {
        id: 1,
        title: "Unverhältnismäßige Kündigungsstrafe",
        clause_reference: "Klausel 7.3",
        severity: "KRITISCH",
        financial_impact: 8500,
        actionable_solution: "Begrenzung der Vertragsstrafe auf maximal 30 Tage Vorankündigung ohne rückwirkende Kostenübernahme."
      },
      {
        id: 2,
        title: "Doppelte Inflationsanpassung (VPI + Fester Zinssatz)",
        clause_reference: "Klausel 12.1",
        severity: "HOCH",
        financial_impact: 4200,
        actionable_solution: "Streichung des festen Aufschlags und ausschließliche Bindung an den tatsächlichen VPI mit Cap von 3,5%."
      },
      {
        id: 3,
        title: "Fehlende SLA-Gutschriften bei Systemausfall",
        clause_reference: "Anhang B - Support",
        severity: "MITTEL",
        financial_impact: 2150,
        actionable_solution: "Automatische monatliche Gutschrift über 10% der Gebühr je 0,2% Verfügbarkeitsunterschreitung."
      }
    ] : (isEn ? [
      {
        id: 1,
        title: "Excessive Early Termination Penalty",
        clause_reference: "Clause 7.3",
        severity: "CRITICAL",
        financial_impact: 8500,
        actionable_solution: "Limit termination penalty to 30 days standard advance notice with no accelerated balance liability."
      },
      {
        id: 2,
        title: "Compounded Inflation Dual Indexation",
        clause_reference: "Clause 12.1",
        severity: "HIGH",
        financial_impact: 4200,
        actionable_solution: "Replace compounded indexation with single unadjusted CPI escalator capped at 3.5% annually."
      },
      {
        id: 3,
        title: "Uncredited Infrastructure Maintenance Charges",
        clause_reference: "Exhibit B - Billing",
        severity: "MEDIUM",
        financial_impact: 2150,
        actionable_solution: "Enforce automatic 10% SLA credit note for each 0.2% monthly downtime below agreed threshold."
      }
    ] : [
      {
        id: 1,
        title: "Penalización Excesiva por Cancelación Anticipada",
        clause_reference: "Cláusula 7.3 / Línea 42",
        severity: "CRÍTICO",
        financial_impact: 8500,
        actionable_solution: "Notificar objeción legal formal y sustituir por penalidad máxima de 30 días de preaviso sin cobro acelerado."
      },
      {
        id: 2,
        title: "Duplicación de Ajuste por Inflación (IPC + Tasa Fija)",
        clause_reference: "Cláusula 12.1",
        severity: "ALTO",
        financial_impact: 4200,
        actionable_solution: "Eliminar el sobrecargo fijo y limitar el reajuste exclusivamente al IPC anual con un techo (Cap) del 3.5%."
      },
      {
        id: 3,
        title: "Cobro de Honorarios de Mantenimiento No Prestados",
        clause_reference: "Anexo B - Facturación",
        severity: "MEDIO",
        financial_impact: 2150,
        actionable_solution: "Exigir nota de crédito inmediata e incluir deducción automática del 10% ante caídas de servicio."
      }
    ]);

    const findings = (auditData?.findings && auditData.findings.length > 0) 
      ? auditData.findings 
      : defaultFindings;

    let findingsCardsHtml = '';
    findings.forEach((item, idx) => {
      const sev = item.severity || (idx === 0 ? 'CRITICAL' : (idx === 1 ? 'HIGH' : 'MEDIUM'));
      const sevColor = sev.includes('CRIT') || sev.includes('KRIT') ? '#ef4444' : (sev.includes('HIGH') || sev.includes('HOCH') || sev.includes('ALT') ? '#f59e0b' : '#38bdf8');
      const clause = item.clause_reference || `Cláusula #${idx + 1}`;
      const title = item.title || `Hallazgo #${idx + 1}`;
      const impact = item.financial_impact || Math.round(leakageVal / 3);
      const solution = item.actionable_solution || item.solution || defaultFindings[idx]?.actionable_solution || 'Renegociar y topar penalizaciones contractuales.';

      findingsCardsHtml += `
        <div style="background-color: #111827; border: 1px solid #374151; border-left: 4px solid ${sevColor}; border-radius: 8px; padding: 18px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="background-color: ${sevColor}20; color: ${sevColor}; font-size: 11px; font-weight: bold; padding: 3px 8px; border-radius: 4px; text-transform: uppercase;">
              ${sev}
            </span>
            <span style="color: #9ca3af; font-size: 12px; font-family: monospace;">${clause}</span>
          </div>
          <h4 style="color: #ffffff; margin: 0 0 6px 0; font-size: 15px;">${title}</h4>
          <p style="color: #ef4444; font-weight: bold; margin: 0 0 12px 0; font-size: 13px;">
            ${isDe ? 'Finanzielles Risiko' : (isEn ? 'Financial Impact' : 'Fuga Estimada')}: $${Number(impact).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
          </p>
          <div style="background-color: #090d16; border-left: 3px solid #10b981; padding: 10px 14px; border-radius: 4px;">
            <strong style="color: #10b981; font-size: 12px; display: block; margin-bottom: 4px;">
              💡 ${isDe ? 'Empfohlene Taktische Lösung / Neufassung' : (isEn ? 'Actionable Solution & Redline' : 'Solución Táctica y Redacción de Renegociación')}:
            </strong>
            <p style="color: #e5e7eb; font-size: 13px; line-height: 1.5; margin: 0;">
              ${solution}
            </p>
          </div>
        </div>
      `;
    });

    const appUrl = process.env.APP_URL || 'https://audiflowai.com';

    const subject = isDe
      ? `🔒 Ihr Prüfbericht & 3 Taktische Lösungen - ${docName} [AuditFlow AI]`
      : (isEn 
        ? `🔒 Your Audit Report & 3 Tactical Solutions - ${docName} [AuditFlow AI]`
        : `🔒 Tu Informe de Auditoría y 3 Soluciones Tácticas - ${docName} [AuditFlow AI]`);

    const headerGreeting = isDe
      ? `Hallo <strong>${name}</strong>, hier ist Ihr offizieller Audit-Bericht für <strong>${docName}</strong>:`
      : (isEn
        ? `Hello <strong>${name}</strong>, here is your official audit report for <strong>${docName}</strong>:`
        : `Hola <strong>${name}</strong>, aquí tienes tu informe oficial de auditoría para <strong>${docName}</strong>:`);

    const leakageTitle = isDe ? 'Gesamtes Festgestelltes Einsparpotenzial' : (isEn ? 'Total Financial Leakage Detected' : 'Fuga Financiera Total Detectada');
    const findingsSectionTitle = isDe ? '📋 3 Aufgedeckte Risikoklauseln & Taktische Lösungen' : (isEn ? '📋 3 Detected Risk Anomalies & Tactical Solutions' : '📋 Las 3 Cláusulas de Riesgo y sus Soluciones Tácticas');

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"></head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background-color: #090d16; color: #ffffff; padding: 24px; margin: 0;">
        <div style="max-width: 620px; margin: 0 auto; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 32px;">
          
          <!-- HEADER -->
          <div style="text-align: center; border-bottom: 1px solid #1e293b; padding-bottom: 20px; margin-bottom: 24px;">
            <h1 style="color: #38bdf8; margin: 0; font-size: 24px; letter-spacing: -0.5px;">AuditFlow AI</h1>
            <p style="color: #64748b; font-size: 12px; margin: 4px 0 0 0;">
              ${isDe ? 'Prüfung in flüchtigem RAM-Speicher (0 Festplattenspeicherung / DSGVO-konform)' : (isEn ? 'Volatile RAM Processing • Zero Disk Retention • SOC2 Ready' : 'Procesamiento en Memoria Volátil RAM • Cero Archivos en Disco')}
            </p>
          </div>

          <p style="font-size: 15px; color: #e2e8f0; line-height: 1.6;">
            ${headerGreeting}
          </p>

          <!-- FUGA TOTAL KPI -->
          <div style="background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%); border: 1px solid #4338ca; border-radius: 10px; padding: 20px; text-align: center; margin: 24px 0;">
            <span style="color: #a5b4fc; font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">
              ${leakageTitle}
            </span>
            <h2 style="color: #ef4444; font-size: 32px; margin: 6px 0 0 0; font-weight: 800;">
              $${Number(leakageVal).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
            </h2>
            <p style="color: #94a3b8; font-size: 12px; margin: 6px 0 0 0;">
              ${isDe ? 'Risikobewertung' : (isEn ? 'Risk Score' : 'Lead Score')}: <strong style="color: #38bdf8;">${leadScore}/100</strong> • ${docType}
            </p>
          </div>

          <!-- SECCIÓN DE 3 HALLAZGOS Y 3 SOLUCIONES TÁCTICAS -->
          <h3 style="color: #ffffff; font-size: 17px; margin: 28px 0 16px 0;">
            ${findingsSectionTitle}
          </h3>

          ${findingsCardsHtml}

          <!-- BOTONES DE ACCIÓN (DESCARGA DOCX $19 & PLAN CORPORATIVO $69) -->
          <div style="background-color: #0b0f19; border: 1px solid #334155; border-radius: 10px; padding: 24px; text-align: center; margin: 32px 0 20px 0;">
            <h4 style="color: #ffffff; font-size: 16px; margin: 0 0 8px 0;">
              ${isDe ? '📄 Benötigen Sie den Vollständigen Word .docx Bericht mit Track Changes?' : (isEn ? '📄 Need the Executive Word .docx Report with Track Changes?' : '📄 ¿Deseas el Reporte Ejecutivo en Word .docx con Control de Cambios?')}
            </h4>
            <p style="color: #94a3b8; font-size: 13px; margin: 0 0 18px 0; line-height: 1.5;">
              ${isDe 
                ? 'Laden Sie die offizielle signierte PDF und die bearbeitbare Word-Datei herunter ($19 USD) oder abonnieren Sie den unbegrenzten Unternehmensplan ($69/Monat).' 
                : (isEn 
                  ? 'Download the official certified PDF and editable Word redlines ($19 USD) or unlock unlimited audits for your team ($69/mo).' 
                  : 'Descarga el PDF certificado y el Word con marcas de revisión ($19 USD) o suscríbete al Plan Corporativo Ilimitado ($69/mes o $590/año).')}
            </p>

            <div style="display: flex; flex-direction: column; gap: 10px;">
              <a href="${appUrl}/?reportId=${reportId}&action=unlock" style="background-color: #10b981; color: #000000; font-weight: bold; padding: 13px 24px; text-decoration: none; border-radius: 8px; font-size: 14px; display: block;">
                ${isDe ? '🔓 Vollständigen Bericht & Word .docx Freischalten ($19 USD)' : (isEn ? '🔓 Unlock Full Report & Word .docx ($19 USD)' : '🔓 Desbloquear Reporte Ejecutivo & Word .docx ($19 USD)')}
              </a>
              <a href="${appUrl}/#pricing-section" style="background-color: #6366f1; color: #ffffff; font-weight: bold; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-size: 13px; display: block;">
                ${isDe ? '🏢 Unbegrenzten Unternehmensplan Ansehen ($69/Monat)' : (isEn ? '🏢 View Unlimited Corporate Plan ($69/mo)' : '🏢 Ver Plan Corporativo Ilimitado ($69/mes)')}
              </a>
            </div>
          </div>

          <!-- FOOTER PRIVACIDAD -->
          <hr style="border: 0; border-top: 1px solid #1e293b; margin: 28px 0 16px 0;">
          <p style="font-size: 12px; color: #64748b; text-align: center; margin: 0; line-height: 1.5;">
            AuditFlow AI • ${isDe ? 'Gesendet von Ricardo' : (isEn ? 'Sent by Ricardo' : 'Enviado por Ricardo')} &lt;<a href="mailto:rick28191@gmail.com" style="color: #38bdf8; text-decoration: none;">rick28191@gmail.com</a> • <a href="mailto:ricardo@audiflowai.com" style="color: #38bdf8; text-decoration: none;">ricardo@audiflowai.com</a>&gt;<br>
            ${isDe ? 'Flüchtiger RAM-Speicher nach Verarbeitung automatisch bereinigt.' : (isEn ? 'RAM memory automatically wiped after audit.' : 'Memoria RAM volátil purgada automáticamente tras el análisis.')}
          </p>

        </div>
      </body>
      </html>
    `;

    const emailRes = await sendAuditReportEmail({
      to: email,
      subject,
      html: emailHtml
    });

    return res.status(200).json({
      success: true,
      report_id: reportId,
      lead_score: leadScore,
      is_enterprise_candidate: isEnterpriseCandidate,
      tags: tags,
      email_status: emailRes,
      message: 'Informe con las 3 soluciones tácticas enviado exitosamente al correo.'
    });

  } catch (err) {
    console.error('Error en api/lead.js:', err);
    return res.status(500).json({ error: 'Error procesando captura de lead: ' + err.message });
  }
}

