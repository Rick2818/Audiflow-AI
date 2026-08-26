import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import { CONFIG } from '../lib/config.js';

dotenv.config();

console.log('📅 PROGRAMANDO REUNIÓN Y ACTIVIDADES DE EVALUACIÓN PARA EL VIERNES 28 DE AGOSTO DE 2026...\n');

const resendApiKey = (process.env.RESEND_API_KEY || CONFIG.EMAIL.RESEND_API_KEY || '').trim();
const gmailUser = (process.env.GMAIL_USER || CONFIG.EMAIL.SMTP_USER || '').trim();
const gmailPass = (process.env.GMAIL_APP_PASSWORD || CONFIG.EMAIL.SMTP_PASS || '').replace(/\s+/g, '').trim();

const resend = resendApiKey && !resendApiKey.includes('re_tu_api') ? new Resend(resendApiKey) : null;
const transporter = gmailUser && gmailPass && !gmailUser.includes('tu_correo') ? nodemailer.createTransport({
  service: 'gmail',
  auth: { user: gmailUser, pass: gmailPass }
}) : null;

async function scheduleFridayNotification() {
  const recipient = 'rick28191@gmail.com';
  const subject = '📅 Confirmación de Agenda: Reporte de Resultados FODA y Sprint Waalaxy / Viernes 28 Ago 9:00 AM';

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; color: #111827; line-height: 1.6; max-width: 600px; border: 1px solid #38bdf8; border-radius: 12px; padding: 24px; background-color: #ffffff;">
      <h2 style="color: #0f172a; margin-top: 0; border-bottom: 2px solid #38bdf8; pb-2;">📅 AuditFlow AI — Confirmación de Reunión Ejecutiva</h2>
      
      <p>Hola <strong>Ricardo</strong>,</p>
      
      <p>Te confirmamos que las 2 actividades clave han sido incorporadas al <strong>Cronograma Oficial de Operaciones</strong> y los agentes ya están ejecutando las tareas correspondientes:</p>

      <div style="background-color: #f0f9ff; border-left: 4px solid #0284c7; padding: 16px; margin: 18px 0; border-radius: 6px;">
        <h4 style="margin: 0 0 8px 0; color: #0369a1;">📋 ACTIVIDADES PROGRAMADAS PARA EL VIERNES 28 DE AGOSTO:</h4>
        <ol style="margin: 0; padding-left: 20px; font-size: 14px; color: #334155;">
          <li style="margin-bottom: 8px;">
            <strong>08:00 AM:</strong> Entrega del <strong>Informe Consolidado de Resultados FODA & Marketing</strong> (Tasas de apertura, interacción, prospectos calificados y avance de flujo de caja).
          </li>
          <li>
            <strong>09:00 AM:</strong> Presentación y Evaluación de Resultados del <strong>Sprint Inmediato de Waalaxy / LinkedIn</strong> y Reunión Estratégica con los Agentes.
          </li>
        </ol>
      </div>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 8px; font-size: 13px; color: #475569; margin: 15px 0;">
        <strong>🚀 Plan Inmediato de Waalaxy en Ejecución:</strong>
        <ul style="margin: 6px 0 0 0; padding-left: 18px;">
          <li>Activación de los 400 Socios Directores con Lead Score > 90.</li>
          <li>Secuencia de 3 toques (Visita + Conexión personalizada + Mensaje con entrega de Redline Word .docx).</li>
          <li>Auto-responder serverless 24/7 en &lt;3s ante comentarios ("AUDITORIA" / "AUDIT").</li>
        </ul>
      </div>

      <p style="font-size: 13px; color: #64748b; margin-top: 20px;">
        Esta notificación ha sido enviada a tu correo personal conforme a tu instrucción directa. Todos los reportes estarán listos en el panel de administración (<a href="https://audiflowai.com/admin" style="color: #0284c7; text-decoration: none; font-weight: bold;">audiflowai.com/admin</a>).
      </p>

      <p style="margin-top: 24px;">Saludos cordiales,<br><strong>Equipo Multiagente de Operaciones & Marketing</strong><br><span style="color: #64748b; font-size: 12px;">AuditFlow AI Corp. • audiflowai.com</span></p>
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
      console.log(`✅ Notificación enviada con éxito vía Resend API a: ${recipient}`);
    } else if (transporter) {
      await transporter.sendMail({
        from: `"AuditFlow AI • Notificaciones" <${gmailUser}>`,
        to: recipient,
        subject,
        html
      });
      console.log(`✅ Notificación enviada con éxito vía SMTP a: ${recipient}`);
    } else {
      console.log(`🛡️ [MODO SEGURO] Notificación simulada para: ${recipient}`);
    }
  } catch (err) {
    console.error('❌ Error enviando notificación:', err.message);
  }
}

scheduleFridayNotification();
