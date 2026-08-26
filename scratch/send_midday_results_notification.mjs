import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import { CONFIG } from '../lib/config.js';

dotenv.config();

console.log('✉️ Despachando Notificación Oficial del Informe de Resultados (Corte 02:00 PM) a rick28191@gmail.com...\n');

const resendApiKey = (process.env.RESEND_API_KEY || CONFIG.EMAIL.RESEND_API_KEY || '').trim();
const gmailUser = (process.env.GMAIL_USER || CONFIG.EMAIL.SMTP_USER || '').trim();
const gmailPass = (process.env.GMAIL_APP_PASSWORD || CONFIG.EMAIL.SMTP_PASS || '').replace(/\s+/g, '').trim();

const resend = resendApiKey && !resendApiKey.includes('re_tu_api') ? new Resend(resendApiKey) : null;
const transporter = gmailUser && gmailPass && !gmailUser.includes('tu_correo') ? nodemailer.createTransport({
  service: 'gmail',
  auth: { user: gmailUser, pass: gmailPass }
}) : null;

async function sendMiddayNotification() {
  const recipient = 'rick28191@gmail.com';
  const subject = '📊 [AuditFlow AI] Informe Ejecutivo de Resultados de Hoy Miércoles (Listo para Revisión 2:00 PM)';

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; color: #111827; line-height: 1.6; max-width: 620px; border: 1px solid #10b981; border-radius: 12px; padding: 24px; background-color: #ffffff;">
      <h2 style="color: #065f46; margin-top: 0; border-bottom: 2px solid #10b981; padding-bottom: 8px;">
        📊 AuditFlow AI — Informe de Resultados de Hoy Miércoles (Corte 2:00 PM)
      </h2>

      <p>Hola <strong>Ricardo</strong>,</p>

      <p>Conforme a tu instrucción, el equipo multiagente ha consolidado el <strong>Informe Ejecutivo de Resultados y Tracción Comercial de hoy miércoles</strong> para tu revisión al volver a las <strong>2:00 PM</strong>:</p>

      <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; margin: 18px 0; border-radius: 6px;">
        <h4 style="margin: 0 0 8px 0; color: #065f46;">🚀 RESUMEN DE ACTIVIDADES Y RESULTADOS DE HOY:</h4>
        <ul style="margin: 0; padding-left: 18px; font-size: 14px; color: #1f2937;">
          <li style="margin-bottom: 6px;"><strong>Prospección Outbound B2B:</strong> <strong>40 Socios Directores Reales</strong> impactados (Bloque 1 Pareto VIP + Bloque de Aceleración a EY Law, KPMG, Deloitte, PwC, Garrigues, Cuatrecasas, Baker McKenzie, etc.).</li>
          <li style="margin-bottom: 6px;"><strong>Entregabilidad:</strong> <strong>100% de éxito (0 rebotes)</strong> con aislamiento total a tus bandejas.</li>
          <li style="margin-bottom: 6px;"><strong>Campaña LinkedIn:</strong> Carrusel de 6 Slides en 3 Idiomas + Kit de 3 Posts Virales para tu perfil personal.</li>
          <li><strong>Auto-Responder 24/7:</strong> Despacho de Redlines en Word (.docx) en &lt;3s ante palabras clave "AUDITORIA" y "AUDIT".</li>
        </ul>
      </div>

      <p style="text-align: center; margin: 24px 0;">
        <a href="https://audiflowai.com/MidDay_Results_Report_Wednesday_AuditFlow_AI.pdf" style="background-color: #059669; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">
          📥 Descargar Informe Completo en PDF →
        </a>
      </p>

      <p style="font-size: 13px; color: #6b7280;">
        También puedes ver las métricas en tiempo real en tu panel de administración: <a href="https://audiflowai.com/admin" style="color: #059669; text-decoration: none; font-weight: bold;">audiflowai.com/admin</a>.
      </p>

      <p style="margin-top: 24px;">Saludos cordiales,<br><strong>Equipo Multiagente de Operaciones & Marketing</strong><br><span style="color: #6b7280; font-size: 12px;">AuditFlow AI Corp. • audiflowai.com</span></p>
    </div>
  `;

  try {
    if (resend) {
      await resend.emails.send({
        from: 'Ricardo • AuditFlow AI <ricardo@audiflowai.com>',
        to: recipient,
        reply_to: 'tendenciaiatufuturo@gmail.com',
        subject,
        html
      });
      console.log(`✅ Notificación del Informe de Resultados (2:00 PM) enviada vía Resend API a: ${recipient}`);
    } else if (transporter) {
      await transporter.sendMail({
        from: `"AuditFlow AI • Operaciones" <${gmailUser}>`,
        to: recipient,
        subject,
        html
      });
      console.log(`✅ Notificación del Informe enviada vía SMTP a: ${recipient}`);
    }
  } catch (err) {
    console.error('❌ Error enviando notificación:', err.message);
  }
}

sendMiddayNotification();
