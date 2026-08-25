import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import { CONFIG } from './config.js';
import { verifyAdminAuth, escapeHtml } from './security.js';
import { generateOutreachProspects } from '../api/outreach.js';

dotenv.config();

// Helper de Envío de Correo por Resend API / Gmail SMTP
async function sendFastTrackEmail({ to, subject, html, replyTo }) {
  const resendApiKey = (process.env.RESEND_API_KEY || CONFIG.EMAIL.RESEND_API_KEY || '').trim();

  if (resendApiKey && resendApiKey.startsWith('re_')) {
    try {
      const resend = new Resend(resendApiKey);
      const resendResult = await resend.emails.send({
        from: CONFIG.EMAIL.FROM_TRANSACTIONAL,
        to,
        reply_to: replyTo || CONFIG.EMAIL.REPLY_TO_CONTROL,
        subject,
        html,
        headers: {
          'List-Unsubscribe': `<mailto:tendenciaiatufuturo@gmail.com?subject=Unsubscribe>`,
          'X-Campaign': 'fast_track_10_clients_24h'
        }
      });
      if (resendResult && resendResult.data && resendResult.data.id) {
        return { success: true, provider: 'resend', id: resendResult.data.id };
      }
    } catch (err) {
      console.warn('[FastTrack] Resend error, usando Gmail SMTP:', err.message);
    }
  }

  const gmailUser = (process.env.GMAIL_USER || CONFIG.EMAIL.SMTP_USER).trim();
  const gmailPass = (process.env.GMAIL_APP_PASSWORD || CONFIG.EMAIL.SMTP_PASS).replace(/\s+/g, '').trim();

  if (gmailUser && gmailPass && !gmailUser.includes('tu_correo')) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: gmailUser, pass: gmailPass }
      });
      const info = await transporter.sendMail({
        from: `"AuditFlow AI | Mesa Directiva" <${gmailUser}>`,
        to,
        replyTo: replyTo || CONFIG.EMAIL.REPLY_TO_CONTROL,
        subject,
        html
      });
      return { success: true, provider: 'gmail_smtp', messageId: info.messageId };
    } catch (gErr) {
      console.warn('[FastTrack] Gmail SMTP limit/error, cayendo a Ethereal/Log fallback:', gErr.message);
    }
  }

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
  return { success: true, provider: 'ethereal', messageId: info.messageId };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-password');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Utilice POST.' });
  }

  // Verificación de autenticación de administrador
  if (!verifyAdminAuth(req)) {
    return res.status(401).json({ error: 'No autorizado. Contraseña maestra requerida.' });
  }

  try {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    const { limit = 25, test_mode = false } = body;
    const allLeads = generateOutreachProspects('pareto_top20');
    // Tomar los leads con la puntuación fiduciaria más alta (Lote seguro por defecto: 25)
    const targetLeads = allLeads.sort((a, b) => (b.lead_score || 0) - (a.lead_score || 0)).slice(0, Math.min(limit, 50));

    const appUrl = (process.env.APP_URL || CONFIG.URLS.APP_URL || 'https://audiflowai.com').replace(/\/+$/, '');
    const results = [];

    for (const lead of targetLeads) {
      const { name, email, company, role, country } = lead;
      if (!email || !email.includes('@')) continue;

      const cleanFirstName = name ? name.split(' ')[0] : 'colega';
      const subject = `análisis gratis de contratos (10s) y redlines / ${company}`;
      const emailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; color: #111827; line-height: 1.6; max-width: 580px;">
          <p>Hola ${escapeHtml(cleanFirstName)},</p>
          <p>Veo que lideras la práctica legal / corporativa en <strong>${escapeHtml(company)}</strong>.</p>
          <p>Desarrollamos <strong>AuditFlow AI</strong> (<a href="${appUrl}/?ref=waalaxy" style="color: #2563eb; text-decoration: none;">audiflowai.com</a>), una herramienta copiloto para firmas y directores legales que audita contratos de proveedores en <strong>menos de 10 segundos</strong> y genera el <strong>Redline en Word (.docx con control de cambios)</strong> detectando penalizaciones ocultas y sobrecostos.</p>
          
          <div style="background-color: #f8fafc; padding: 14px; border-left: 3px solid #2563eb; margin: 16px 0; border-radius: 6px; font-size: 14px;">
            <p style="margin: 0 0 8px 0;"><strong>🎁 Tu 1er Análisis: 100% Gratis</strong> en 10s (en memoria RAM volátil, sin guardar archivos): <a href="${appUrl}/?ref=waalaxy" style="color: #2563eb; font-weight: bold; text-decoration: underline;">Probar gratis aquí →</a></p>
            <p style="margin: 0 0 8px 0;"><strong>⚡ Oferta Redline Individual:</strong> Solo <strong>$19 USD</strong> por contrato completo con exportación en Word.</p>
            <p style="margin: 0;"><strong>💼 Planes:</strong> <strong>$69 USD/mes</strong> (auditorías ilimitadas) o <strong>$599 USD/año</strong> (licencia corporativa anual con marca blanca para clientes de la firma).</p>
          </div>

          <p>¿Te parece que te comparta un resumen de 1 página con las cláusulas de fuga más frecuentes que estamos detectando en el sector?</p>
          <p style="margin-top: 24px;">Saludos,<br><strong>Ricardo</strong><br><span style="color: #4b5563; font-size: 13px;">Fundador • AuditFlow AI Corp. (<a href="${appUrl}" style="color: #2563eb; text-decoration: none;">audiflowai.com</a>)</span></p>
        </div>
      `;

      if (!test_mode) {
        const dispatchRes = await sendFastTrackEmail({
          to: email,
          subject,
          html: emailHtml
        });
        results.push({ email, name, company, status: 'sent', provider: dispatchRes.provider });
      } else {
        results.push({ email, name, company, status: 'simulated' });
      }
    }

    // Copia fiduciaria de resumen a tendenciaiatufuturo@gmail.com
    const summarySubject = `🚀 [Operación 10 Clientes Hoy] Despacho Fast-Track Completado (${results.length} contactos)`;
    const summaryHtml = `
      <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #ffffff; padding: 20px; border-radius: 10px;">
        <h3 style="color: #10b981; margin-top: 0;">🚀 Resumen de Despacho Relámpago (Operación 10 Clientes)</h3>
        <p>Total de contactos procesados: <strong>${results.length}</strong> (Top 20% Pareto)</p>
        <p>Modo de prueba: <strong>${test_mode ? 'SÍ (Simulación)' : 'NO (Envíos Reales)'}</strong></p>
        <div style="margin-top: 15px; background: #1e293b; padding: 10px; border-radius: 6px; font-size: 12px; font-family: monospace;">
          ${results.slice(0, 10).map(r => `• ${r.name} (${r.company}) -> ${r.email} [${r.status}]`).join('<br>')}
          ${results.length > 10 ? `<br>... y ${results.length - 10} más.` : ''}
        </div>
        <p style="font-size: 11px; color: #94a3b8; margin-top: 15px;">Copia automática de control fiduciario enviada a tendenciaiatufuturo@gmail.com.</p>
      </div>
    `;

    await sendFastTrackEmail({
      to: CONFIG.EMAIL.OWNER_CONTROL,
      subject: summarySubject,
      html: summaryHtml
    }).catch(e => console.warn('[FastTrack] Error en copia a owner:', e.message));

    return res.status(200).json({
      success: true,
      message: `Campaña Fast-Track ejecutada con éxito hacia ${results.length} decisores Top 20%.`,
      count: results.length,
      dispatched: results
    });

  } catch (error) {
    console.error('[Fast Track Error]:', error);
    return res.status(500).json({ error: 'Error al ejecutar la campaña Fast-Track.', details: error.message });
  }
}
