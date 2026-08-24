import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import { CONFIG } from '../lib/config.js';
import { verifyAdminAuth, escapeHtml } from '../lib/security.js';
import { generateOutreachProspects } from './outreach.js';

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
    // Tomar los leads de más alta puntuación (Score 98-99)
    const targetLeads = allLeads.slice(0, Math.min(limit, 50));

    const appUrl = (process.env.APP_URL || CONFIG.URLS.APP_URL || 'https://audiflowai.com').replace(/\/+$/, '');
    const results = [];

    for (const lead of targetLeads) {
      const { name, email, company, role, country } = lead;
      if (!email || !email.includes('@')) continue;

      const subject = `🚨 Programa Piloto de Urgencia: 1 Auditoría Preventiva de Blindaje para ${company}`;
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #10b981; max-width: 620px; margin: 0 auto;">
          <div style="border-bottom: 1px solid #1f2937; padding-bottom: 12px; margin-bottom: 20px;">
            <span style="color: #10b981; font-size: 11px; font-weight: bold; font-family: monospace; text-transform: uppercase;">PROGRAMA PILOTO 24 HORAS • ACCESO PRIORITARIO CFO</span>
            <h2 style="color: #ffffff; margin: 6px 0 0 0; font-size: 20px;">AuditFlow AI — Detección de Fugas Contractuales</h2>
          </div>

          <p>Estimado/a <strong>${escapeHtml(name)}</strong> (${escapeHtml(role)} en <strong>${escapeHtml(company)}</strong>),</p>

          <p style="line-height: 1.6; color: #d1d5db;">
            En auditorías corporativas recientes, el <strong>78% de los contratos de proveedores IT, arrendamiento y servicios</strong> contienen cláusulas de indexación doble o penalizaciones desproporcionadas que generan fugas silenciosas de <strong>$3,500 a $18,500 USD</strong>.
          </p>

          <div style="background-color: #111827; border-left: 4px solid #10b981; padding: 14px; margin: 18px 0; border-radius: 4px;">
            <h4 style="margin: 0 0 6px 0; color: #34d399; font-size: 14px;">⚡ Propuesta Especial de Blindaje (Fricción Cero):</h4>
            <p style="margin: 0; color: #cbd5e1; font-size: 13px; line-height: 1.5;">
              Hemos habilitado una <strong>Auditoría Completa de Emergencia</strong> para su empresa. Puede cargar cualquier contrato o factura en formato PDF y recibir en menos de 10 segundos el informe de riesgos y las contra-cláusulas de blindaje en Word (.docx).
            </p>
          </div>

          <div style="text-align: center; margin: 26px 0 20px 0;">
            <a href="${appUrl}/?ref=fast_track_cfo&lead=${encodeURIComponent(email)}" style="background-color: #10b981; color: #000000; font-weight: bold; font-size: 14px; padding: 13px 26px; border-radius: 8px; text-decoration: none; display: inline-block;">
              🔍 Realizar Auditoría de Prueba en 10s (RAM Volátil) →
            </a>
          </div>

          <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0 0 15px 0;">
            Garantía de confidencialidad absoluta: Cero almacenamiento de archivos en disco (Memoria RAM Efímera).
          </p>

          <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #1f2937; font-size: 11px; color: #64748b;">
            <p style="margin: 0 0 2px 0;">AuditFlow AI Corp. • Ricardo (Fundador &amp; CTO)</p>
            <p style="margin: 0;">Contacto: <a href="mailto:tendenciaiatufuturo@gmail.com" style="color: #38bdf8; text-decoration: none;">tendenciaiatufuturo@gmail.com</a></p>
          </div>
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
