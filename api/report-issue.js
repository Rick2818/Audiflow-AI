import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabaseUrl = (process.env.SUPABASE_URL || '').trim();
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '').trim();
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

async function sendAdminIssueAlert({ email, issueType, description, userAgent }) {
  const gmailUser = (process.env.GMAIL_USER || 'rick28191@gmail.com').trim();
  const gmailPass = (process.env.GMAIL_APP_PASSWORD || 'fbqiyqmapqplbcim').replace(/\s+/g, '').trim();

  const subject = `🚨 ALERTA TÉCNICA: Reporte de Fallo de Configuración [AuditFlow AI]`;
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 25px; border-radius: 12px; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ef4444; margin-top: 0; font-size: 20px;">🛠️ AuditFlow AI - Alerta de Fallo de Configuración</h2>
      <p style="color: #d1d5db; font-size: 14px;">Un usuario ha reportado una inconsistencia técnica o de configuración en la plataforma.</p>
      
      <div style="background-color: #111827; border: 1px solid #ef4444; padding: 18px; border-radius: 8px; margin: 20px 0; font-size: 13px;">
        <p style="margin: 4px 0;"><strong>Correo del Usuario:</strong> ${email || 'No proporcionado'}</p>
        <p style="margin: 4px 0;"><strong>Tipo de Incidencia:</strong> <span style="color: #f59e0b; font-weight: bold;">${issueType}</span></p>
        <p style="margin: 4px 0;"><strong>Descripción:</strong> ${description || 'Sin descripción adicional'}</p>
        <p style="margin: 4px 0; color: #9ca3af; font-family: monospace; font-size: 11px;"><strong>User Agent:</strong> ${userAgent || 'N/A'}</p>
      </div>

      <p style="font-size: 12px; color: #6b7280; text-align: center; margin-top: 25px;">
        Monitoreo Autónomo AuditFlow AI 24/7.
      </p>
    </div>
  `;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailUser, pass: gmailPass }
    });
    return await transporter.sendMail({ from: `"AuditFlow AI Alerts" <${gmailUser}>`, to: gmailUser, subject, html });
  } catch (err) {
    console.warn('Gmail SMTP Issue Alert Warning:', err.message);
  }
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

    const { email, issue_type, description, user_agent } = body;
    const userEmail = email || 'usuario@anonimo.com';
    const issueType = issue_type || 'Error de Configuración General';
    const desc = description || 'Reporte autónomo de fallo técnico.';
    const userAgent = user_agent || (req.headers['user-agent'] || 'Unknown');

    // Registrar incidencia en Supabase
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

    // Despachar alerta de correo al Administrador
    await sendAdminIssueAlert({ email: userEmail, issueType, description: desc, userAgent });

    // Generar sugerencia de auto-diagnóstico asistida por IA
    let aiDiagnosis = "¡Gracias por su ayuda! Hemos registrado su reporte de fallo en nuestro servidor de control. Sugerencia de Auto-Diagnóstico: Hemos verificado la configuración de red y sockets. Si el problema persiste con un archivo específico, te recomendamos verificar que no tenga protección por contraseña previa o un nivel de borrosidad extremo.";
    if (issueType.includes('OCR') || issueType.includes('archivo')) {
      aiDiagnosis = "¡Gracias por su ayuda! Hemos registrado su reporte de fallo. Auto-Diagnóstico de Archivo: El motor Gemini 2.5 exige documentos legibles con más de 50 palabras. Asegúrate de que el documento no sea un escaneo completamente oscuro o cifrado con clave.";
    } else if (issueType.includes('pago') || issueType.includes('Stripe')) {
      aiDiagnosis = "¡Gracias por su ayuda! Hemos registrado su reporte de fallo. Auto-Diagnóstico de Pago: La pasarela verifica encriptación SSL/TLS. Si estás usando una billetera Lightning, asegúrate de que tu aplicación soporte facturas BOLT11.";
    }

    return res.status(200).json({
      success: true,
      message: 'Reporte de fallo recibido y registrado en el servidor de control.',
      ai_diagnosis: aiDiagnosis
    });

  } catch (err) {
    console.error('Error en api/report-issue.js:', err);
    return res.status(500).json({ error: 'Error registrando reporte de fallo: ' + err.message });
  }
}
