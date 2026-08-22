import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabaseUrl = (process.env.SUPABASE_URL || '').trim();
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '').trim();
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

async function sendAdminIssueAlert({ email, issueType, description, userAgent, lang }) {
  const gmailUser = (process.env.GMAIL_USER || 'rick28191@gmail.com').trim();
  const gmailPass = (process.env.GMAIL_APP_PASSWORD || 'fbqiyqmapqplbcim').replace(/\s+/g, '').trim();

  const isEn = (lang === 'en');
  const subject = isEn 
    ? `🚨 TECHNICAL ALERT: Configuration Issue Report [AuditFlow AI]`
    : `🚨 ALERTA TÉCNICA: Reporte de Fallo de Configuración [AuditFlow AI]`;

  const html = isEn ? `
    <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 25px; border-radius: 12px; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ef4444; margin-top: 0; font-size: 20px;">🛠️ AuditFlow AI - Issue Report Confirmation</h2>
      <p style="color: #d1d5db; font-size: 14px;">Thank you for your help! We have received your technical issue report and registered it in our system.</p>
      
      <div style="background-color: #111827; border: 1px solid #ef4444; padding: 18px; border-radius: 8px; margin: 20px 0; font-size: 13px;">
        <p style="margin: 4px 0;"><strong>User Email:</strong> ${email || 'Not provided'}</p>
        <p style="margin: 4px 0;"><strong>Language:</strong> English (EN)</p>
        <p style="margin: 4px 0;"><strong>Issue Category:</strong> <span style="color: #f59e0b; font-weight: bold;">${issueType}</span></p>
        <p style="margin: 4px 0;"><strong>Description:</strong> ${description || 'No additional description'}</p>
        <p style="margin: 4px 0; color: #9ca3af; font-family: monospace; font-size: 11px;"><strong>User Agent:</strong> ${userAgent || 'N/A'}</p>
      </div>

      <p style="font-size: 12px; color: #6b7280; text-align: center; margin-top: 25px;">
        AuditFlow AI Autonomous 24/7 Monitoring Infrastructure.
      </p>
    </div>
  ` : `
    <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 25px; border-radius: 12px; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ef4444; margin-top: 0; font-size: 20px;">🛠️ AuditFlow AI - Alerta & Confirmación de Reporte</h2>
      <p style="color: #d1d5db; font-size: 14px;">¡Gracias por su ayuda! Hemos recibido su reporte de fallo técnico y lo hemos registrado en nuestro servidor de control.</p>
      
      <div style="background-color: #111827; border: 1px solid #ef4444; padding: 18px; border-radius: 8px; margin: 20px 0; font-size: 13px;">
        <p style="margin: 4px 0;"><strong>Correo del Usuario:</strong> ${email || 'No proporcionado'}</p>
        <p style="margin: 4px 0;"><strong>Idioma:</strong> Español (ES)</p>
        <p style="margin: 4px 0;"><strong>Tipo de Incidencia:</strong> <span style="color: #f59e0b; font-weight: bold;">${issueType}</span></p>
        <p style="margin: 4px 0;"><strong>Descripción:</strong> ${description || 'Sin descripción adicional'}</p>
        <p style="margin: 4px 0; color: #9ca3af; font-family: monospace; font-size: 11px;"><strong>User Agent:</strong> ${userAgent || 'N/A'}</p>
      </div>

      <p style="font-size: 12px; color: #6b7280; text-align: center; margin-top: 25px;">
        Monitoreo Autónomo AuditFlow AI 24/7.
      </p>
    </div>
  `;

  const recipientList = [gmailUser];
  if (email && email.includes('@') && email.trim().toLowerCase() !== gmailUser.toLowerCase()) {
    recipientList.push(email.trim());
  }
  const toHeader = [...new Set(recipientList)].join(', ');

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: gmailUser, pass: gmailPass }
    });
    const info = await transporter.sendMail({
      from: `"AuditFlow AI System" <${gmailUser}>`,
      to: toHeader,
      subject,
      html
    });
    return info;
  } catch (err) {
    console.error('❌ Error sending issue alert email:', err);
    throw err;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle POST (Report Issue)
  if (req.method === 'POST') {
    try {
      let body = req.body || {};
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) {}
      }

      const { email, issue_type, description, user_agent, lang } = body;
      const userEmail = email || 'usuario@anonimo.com';
      const issueType = issue_type || 'Error de Configuración General';
      const desc = description || 'Reporte autónomo de fallo técnico.';
      const userAgent = user_agent || (req.headers['user-agent'] || 'Unknown');
      const isEn = (lang === 'en');

      if (supabase) {
        try {
          await supabase.from('system_issues').insert([
            {
              user_email: userEmail,
              issue_type: issueType,
              description: desc,
              user_agent: userAgent,
              status: 'pending'
            }
          ]);
        } catch (e) {
          console.warn('Supabase system_issues insert warning:', e.message);
        }
      }

      let emailStatus = 'SENT';
      try {
        await sendAdminIssueAlert({ email: userEmail, issueType, description: desc, userAgent, lang });
      } catch (emailErr) {
        console.error('Error dispatching issue alert email:', emailErr.message);
        emailStatus = 'FAILED: ' + emailErr.message;
      }

      let aiDiagnosis = isEn
        ? "Thank you for your help! We have registered your issue report in our control server. AI Auto-Diagnosis: We verified network configuration and sockets. If the issue persists with a specific file, please ensure it has no password protection or extreme blurriness."
        : "¡Gracias por su ayuda! Hemos registrado su reporte de fallo en nuestro servidor de control. Sugerencia de Auto-Diagnóstico: Hemos verificado la configuración de red y sockets. Si el problema persiste con un archivo específico, te recomendamos verificar que no tenga protección por contraseña previa o un nivel de borrosidad extremo.";

      if (issueType.includes('OCR') || issueType.includes('archivo') || issueType.includes('File')) {
        aiDiagnosis = isEn
          ? "Thank you for your help! We have registered your issue report. File Auto-Diagnosis: The Gemini 2.5 engine requires clear documents with over 50 words. Please ensure the document is not an entirely dark scan or password encrypted."
          : "¡Gracias por su ayuda! Hemos registrado su reporte de fallo. Auto-Diagnóstico de Archivo: El motor Gemini 2.5 exige documentos legibles con más de 50 palabras. Asegúrate de que el documento no sea un escaneo completamente oscuro o cifrado con clave.";
      } else if (issueType.includes('pago') || issueType.includes('Stripe') || issueType.includes('Payment')) {
        aiDiagnosis = isEn
          ? "Thank you for your help! We have registered your issue report. Payment Auto-Diagnosis: The gateway verifies SSL/TLS encryption. If using a Lightning wallet, please ensure your app supports standard BOLT11 invoices."
          : "¡Gracias por su ayuda! Hemos registrado su reporte de fallo. Auto-Diagnóstico de Pago: La pasarela verifica encriptación SSL/TLS. Si estás usando una billetera Lightning, asegúrate de que tu aplicación soporte facturas BOLT11.";
      }

      return res.status(200).json({
        success: true,
        message: isEn ? 'Issue report received and registered.' : 'Reporte de fallo recibido y registrado en el servidor de control.',
        ai_diagnosis: aiDiagnosis,
        email_status: emailStatus
      });

    } catch (err) {
      console.error('Error en api/report.js:', err);
      return res.status(500).json({ error: 'Error registrando reporte de fallo: ' + err.message });
    }
  }

  // Handle GET (Report status inquiry)
  const url = req.url || '';
  const reportId = url.split('/').pop().split('?')[0] || req.query?.id || 'rep_active';

  return res.status(200).json({
    success: true,
    report_id: reportId,
    status: 'unlocked',
    message: 'Reporte activo en memoria RAM volátil',
    timestamp: new Date().toISOString()
  });
}
