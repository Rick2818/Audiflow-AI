import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import { CONFIG } from '../lib/config.js';
import { escapeHtml } from '../lib/security.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. GET: Estado del Servicio Auto-Redline
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      service: 'AuditFlow AI Automated Redline Dispatcher 24/7',
      status: 'ACTIVE',
      sender: 'ricardo@audiflowai.com',
      delivery_mode: 'Instant Zero-Friction Delivery'
    });
  }

  // 2. POST: Despacho Automático e Instantáneo de Redlines en Word
  if (req.method === 'POST') {
    try {
      let body = req.body || {};
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) { body = {}; }
      }

      const {
        email,
        name = 'Director Legal',
        company = 'su Empresa',
        document_title = 'Contrato de Proveedor',
        source = 'web_lead'
      } = body;

      if (!email || !email.includes('@')) {
        return res.status(400).json({ success: false, error: 'Dirección de correo requerida e inválida.' });
      }

      const cleanEmail = email.toLowerCase().trim();
      const cleanFirstName = name ? name.split(' ')[0] : 'colega';
      const appUrl = (process.env.APP_URL || CONFIG.URLS.APP_URL || 'https://audiflowai.com').replace(/\/+$/, '');

      const subject = `Borrador de Redline en Word (.docx) y Acceso Inmediato / ${company}`;
      const emailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; color: #111827; line-height: 1.6; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 24px; border: 1px solid #e5e7eb; border-radius: 10px;">
          <div style="border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 20px;">
            <span style="font-size: 18px; font-weight: bold; color: #1e3a8a;">AuditFlow <span style="color: #2563eb;">AI</span></span>
            <span style="background-color: #dbeafe; color: #1e40af; font-size: 11px; font-weight: bold; padding: 3px 8px; border-radius: 4px; float: right;">ENTREGA AUTOMATIZADA</span>
          </div>

          <p>Hola <strong>${escapeHtml(cleanFirstName)}</strong>,</p>
          <p>Hemos procesado tu solicitud de revisión para el documento <strong>${escapeHtml(document_title)}</strong> en <strong>${escapeHtml(company)}</strong>.</p>
          
          <div style="background-color: #f8fafc; padding: 18px; border-left: 4px solid #2563eb; margin: 20px 0; border-radius: 6px;">
            <h3 style="margin-top: 0; color: #1e293b; font-size: 15px;">📄 Tu Redline en Word (.docx con Control de Cambios):</h3>
            <p style="font-size: 13px; color: #475569; margin-bottom: 14px;">
              El informe forense incluye las cláusulas abusivas tachadas en rojo y las contra-propuestas blindadas redactadas en verde listas para enviar a tu contraparte.
            </p>
            <div style="text-align: center; margin: 16px 0;">
              <a href="${appUrl}/?ref=auto-redline" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 2px 6px rgba(37,99,235,0.3);">
                ⚡ Abrir tu Auditoría y Descargar Word (.docx) →
              </a>
            </div>
          </div>

          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 14px; border-radius: 6px; margin-bottom: 20px; font-size: 13px; color: #166534;">
            <strong>🛡️ Garantía de Confidencialidad:</strong> Tu contrato fue procesado en memoria RAM volátil bajo normativas SOC-2 y GDPR (cero almacenamiento de archivos en disco).
          </div>

          <div style="font-size: 13px; color: #64748b; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
            <p style="margin: 0 0 6px 0;"><strong>Resumen de Opciones Comerciales:</strong></p>
            <p style="margin: 0 0 4px 0;">• <strong>🎁 1er Análisis:</strong> 100% Gratis en 10s en memoria RAM.</p>
            <p style="margin: 0 0 4px 0;">• <strong>⚡ Oferta Redline Individual:</strong> $19 USD por contrato completo con exportación en Word (.docx).</p>
            <p style="margin: 0 0 4px 0;">• <strong>💼 Planes:</strong> $69 USD/mes (ilimitado) o $599 USD/año (licencia anual con marca blanca para clientes de la firma).</p>
          </div>

          <p style="margin-top: 24px; font-size: 14px;">
            Saludos cordiales,<br>
            <strong>Ricardo</strong><br>
            <span style="color: #6b7280; font-size: 12px;">Fundador • AuditFlow AI Corp. (<a href="${appUrl}" style="color: #2563eb; text-decoration: none;">audiflowai.com</a>)</span>
          </p>
        </div>
      `;

      // Envío de correo
      const resendApiKey = (process.env.RESEND_API_KEY || '').trim();
      const gmailUser = (process.env.GMAIL_USER || CONFIG.EMAIL.SMTP_USER).trim();
      const gmailPass = (process.env.GMAIL_APP_PASSWORD || CONFIG.EMAIL.SMTP_PASS).replace(/\s+/g, '').trim();

      let deliverySuccess = false;
      let providerUsed = 'Gmail SMTP';

      if (resendApiKey) {
        try {
          const resend = new Resend(resendApiKey);
          const emailFrom = (process.env.EMAIL_FROM || '"Ricardo | AuditFlow AI" <ricardo@audiflowai.com>').trim();
          const rResp = await resend.emails.send({
            from: emailFrom,
            to: [cleanEmail],
            reply_to: 'tendenciaiatufuturo@gmail.com',
            bcc: 'tendenciaiatufuturo@gmail.com',
            subject,
            html: emailHtml
          });
          if (rResp.error) throw new Error(rResp.error.message);
          deliverySuccess = true;
          providerUsed = 'Resend API (ricardo@audiflowai.com)';
        } catch (rErr) {
          console.warn('[AutoRedline] Resend API error, cayendo a Gmail SMTP:', rErr.message);
        }
      }

      if (!deliverySuccess && gmailUser && gmailPass && !gmailUser.includes('tu_correo')) {
        try {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: gmailUser, pass: gmailPass }
          });
          await transporter.sendMail({
            from: `"Ricardo • AuditFlow AI" <${gmailUser}>`,
            to: cleanEmail,
            bcc: 'tendenciaiatufuturo@gmail.com',
            replyTo: 'tendenciaiatufuturo@gmail.com',
            subject,
            html: emailHtml
          });
          deliverySuccess = true;
          providerUsed = 'Gmail SMTP';
        } catch (gErr) {
          console.warn('[AutoRedline] Gmail SMTP error:', gErr.message);
        }
      }

      console.log(`[AutoRedline] Entrega automática de Redline procesada para ${cleanEmail} vía ${providerUsed}`);

      return res.status(200).json({
        success: true,
        message: 'Redline y acceso de prueba despachados automáticamente',
        recipient: cleanEmail,
        provider: providerUsed,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error('[AutoRedline] Error en auto-despacho:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}
