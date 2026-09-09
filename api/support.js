import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import { CONFIG } from '../lib/config.js';

const supabaseUrl = (process.env.SUPABASE_URL || CONFIG.SUPABASE.URL || '').trim();
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || CONFIG.SUPABASE.KEY || '').trim();
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

async function sendSupportNotification({ email, message, reportId, userAgent, lang }) {
  const isEn = (lang === 'en');
  const isDe = (lang === 'de');
  const subject = `🎧 [AUDITFLOW AI SOPORTE] Nueva Consulta / Ticket de: ${email || 'Usuario Web'}`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 25px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #38bdf8;">
      <h2 style="color: #38bdf8; margin-top: 0; font-size: 20px;">🎧 Mensaje Recibido en Centro de Soporte</h2>
      <p style="color: #cbd5e1; font-size: 14px;">Se ha registrado una nueva solicitud de soporte o consulta en AuditFlow AI:</p>
      
      <div style="background-color: #111827; border: 1px solid #334155; padding: 18px; border-radius: 8px; margin: 20px 0; font-size: 13px;">
        <p style="margin: 4px 0;"><strong>Remitente:</strong> <span style="color: #38bdf8;">${email || 'No proporcionado'}</span></p>
        <p style="margin: 4px 0;"><strong>ID de Reporte (si aplica):</strong> ${reportId || 'N/A (Consulta General)'}</p>
        <p style="margin: 4px 0;"><strong>Idioma:</strong> ${lang || 'es'}</p>
        <p style="margin: 4px 0;"><strong>Mensaje:</strong></p>
        <div style="background-color: #0f172a; padding: 12px; border-radius: 6px; border-left: 3px solid #10b981; color: #e2e8f0; font-family: monospace; white-space: pre-wrap; margin-top: 6px;">
${message || 'Sin mensaje'}
        </div>
        <p style="margin: 8px 0 0 0; color: #64748b; font-size: 11px;">User Agent: ${userAgent || 'N/A'}</p>
      </div>

      <p style="font-size: 11px; color: #64748b; text-align: center; margin-top: 20px;">
        AuditFlow AI &bull; Infraestructura de Soporte Fiduciario 24/7 &bull; audiflowai.com
      </p>
    </div>
  `;

  const targetEmails = [CONFIG.EMAIL.OWNER_CONTROL || 'tendenciaiatufuturo@gmail.com'];
  const resendApiKey = (process.env.RESEND_API_KEY || CONFIG.EMAIL.RESEND_API_KEY || '').trim();

  // 1. Resend API
  if (resendApiKey) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(resendApiKey);
      const emailFrom = (process.env.EMAIL_FROM || CONFIG.EMAIL.FROM_TRANSACTIONAL || 'ricardo@audiflowai.com').trim();
      const rResp = await resend.emails.send({
        from: emailFrom,
        to: targetEmails,
        reply_to: email || CONFIG.EMAIL.REPLY_TO_CONTROL,
        subject,
        html
      });
      if (!rResp.error) return { provider: 'resend', id: rResp.data?.id };
    } catch (rErr) {
      console.warn('⚠️ [Support] Resend notification warning:', rErr.message);
    }
  }

  // 2. SMTP Relay Fallback
  const gmailUser = (process.env.GMAIL_USER || CONFIG.EMAIL.SMTP_USER || '').trim();
  const gmailPass = (process.env.GMAIL_APP_PASSWORD || CONFIG.EMAIL.SMTP_PASS || '').replace(/\s+/g, '').trim();

  if (gmailUser && gmailPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: gmailUser, pass: gmailPass }
      });
      const info = await transporter.sendMail({
        from: `"AuditFlow AI Soporte" <${gmailUser}>`,
        to: targetEmails.join(','),
        replyTo: email || CONFIG.EMAIL.REPLY_TO_CONTROL,
        subject,
        html
      });
      return info;
    } catch (err) {
      console.warn('⚠️ [Support] SMTP fallback warning:', err.message);
    }
  }

  return { status: 'logged_locally' };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      let body = req.body || {};
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) {}
      }

      const email = (body.email || body.user_email || '').trim();
      const message = (body.issue_description || body.message || body.description || '').trim();
      const reportId = body.report_id || null;
      const lang = body.lang || 'es';
      const userAgent = req.headers['user-agent'] || 'Unknown';

      if (!message && !email) {
        return res.status(400).json({ 
          success: false, 
          error: 'Por favor ingresa un correo o mensaje.' 
        });
      }

      // Registro en Supabase
      if (supabase) {
        try {
          await supabase.from('system_issues').insert([
            {
              user_email: email || 'anonimo@soporte.com',
              issue_type: reportId ? 'Soporte / Re-análisis IA' : 'Consulta General de Soporte',
              description: message,
              user_agent: userAgent,
              status: 'pending'
            }
          ]);
        } catch (dbErr) {
          console.warn('Supabase system_issues notice:', dbErr.message);
        }
      }

      // Despacho de alerta por correo
      sendSupportNotification({ email, message, reportId, userAgent, lang }).catch(err => {
        console.warn('Support notification dispatch notice:', err.message);
      });

      const responseMessage = lang === 'en'
        ? 'Your support request has been received. Our team and AI assistant will respond shortly.'
        : (lang === 'de'
          ? 'Ihre Support-Anfrage wurde empfangen. Unser Team und der KI-Assistent werden in Kürze antworten.'
          : '¡Tu consulta ha sido recibida! Nuestro equipo de soporte y el asistente de IA te responderán a la brevedad.');

      return res.status(200).json({
        success: true,
        message: responseMessage,
        support_email: 'soporte@audiflowai.com',
        whatsapp: '+503 7989 3922'
      });

    } catch (err) {
      console.error('Error in api/support.js:', err);
      return res.status(500).json({ 
        success: false, 
        error: 'Error procesando solicitud de soporte: ' + err.message 
      });
    }
  }

  // GET Inquiry
  return res.status(200).json({
    success: true,
    channels: {
      email: 'soporte@audiflowai.com',
      whatsapp: '+503 7989 3922',
      status: 'active_24_7'
    }
  });
}
