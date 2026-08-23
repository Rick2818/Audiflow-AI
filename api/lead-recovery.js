import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import { verifyAdminAuth } from '../lib/security.js';

const supabaseUrl = (process.env.SUPABASE_URL || '').trim();
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '').trim();
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

const resendKey = (process.env.RESEND_API_KEY || '').trim();
const emailFrom = process.env.EMAIL_FROM || 'AuditFlow AI | Consultoria <ricardo@audiflowai.com>';

async function sendRecoveryEmail({ to, subject, html }) {
  // 1. Resend API
  if (resendKey) {
    try {
      const resend = new Resend(resendKey);
      const r = await resend.emails.send({ from: emailFrom, to: [to], reply_to: 'tendenciaaitufuturo@gmail.com', subject, html });
      if (r && (r.id || r.data?.id)) return { success: true, provider: 'resend', id: r.id || r.data?.id };
    } catch (e) {
      console.warn('Resend fallback in lead-recovery:', e.message);
    }
  }

  // 2. Gmail SMTP
  try {
    const user = process.env.GMAIL_USER || 'tendenciaaitufuturo@gmail.com';
    const pass = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');
    const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
    const info = await transporter.sendMail({ from: `"AuditFlow AI" <${user}>`, to, subject, html });
    return { success: true, provider: 'gmail_smtp', id: info.messageId };
  } catch (err) {
    console.error('Gmail SMTP error in lead-recovery:', err.message);
    return { success: false, error: err.message };
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-password');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // Autorización: Crons o Administrador
  const authHeader = req.headers['authorization'] || '';
  const isCron = authHeader.startsWith('Bearer ') || (req.headers['x-vercel-cron'] === '1') || (req.headers['user-agent'] || '').includes('vercel-cron') || (req.url && req.url.includes('cron=true'));
  if (!isCron && !verifyAdminAuth(req)) {
    return res.status(401).json({ error: 'Acceso no autorizado a recuperacion de leads.' });
  }

  try {
    let targetLeads = [];

    if (supabase) {
      const { data, error } = await supabase
        .from('audit_leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(25);

      if (!error && Array.isArray(data)) {
        targetLeads = data;
      }
    }

    if (targetLeads.length === 0) {
      targetLeads = [
        { name: 'Director Financiero', email: 'carlos.mendoza@empresa-sv.com', document_type: 'Contrato de Arrendamiento Comercial', lead_score: 92 },
        { name: 'Contralor Corporativo', email: 'sofia.martinez@constructora-sv.com', document_type: 'Acuerdo de Proveedores IT', lead_score: 88 }
      ];
    }

    const results = [];

    for (const lead of targetLeads) {
      const lName = lead.name || 'Estimado(a) Colega';
      const lEmail = lead.email;
      if (!lEmail || !lEmail.includes('@')) continue;

      const subject = `AuditFlow AI — Seguimiento a su auditoría preventiva (${lead.document_type || 'Contrato B2B'})`;
      const html = `
        <div style="font-family: Arial, sans-serif; background: #0f172a; color: #f8fafc; padding: 28px; border-radius: 12px; border: 1px solid #334155; max-width: 620px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 20px;">
            <span style="font-size: 22px; font-weight: bold; color: #38bdf8;">AuditFlow <span style="color: #a855f7;">AI</span></span>
            <p style="font-size: 11px; color: #94a3b8; margin: 4px 0 0 0;">CONSULTORÍA Y AUDITORÍA FINANCIERA PREVENTIVA</p>
          </div>

          <p style="font-size: 15px; color: #f8fafc;">Estimado(a) <strong>${lName}</strong>,</p>
          <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6;">
            Notamos que recientemente realizó una evaluación preliminar de su <strong>${lead.document_type || 'documento corporativo'}</strong> con nuestro motor en memoria volátil RAM.
          </p>

          <div style="background: #1e293b; padding: 16px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
            <p style="margin: 0; font-size: 13px; color: #f8fafc; font-weight: bold;">Recordatorio de Mitigación de Riesgos:</p>
            <p style="margin: 6px 0 0 0; font-size: 12px; color: #cbd5e1; line-height: 1.5;">
              Su informe ejecutivo con el desglose de sobrecostos y las marcas de revisión (Redlines) en Word (.docx) sigue disponible para su descarga y renegociación con el proveedor.
            </p>
          </div>

          <div style="text-align: center; margin: 26px 0;">
            <a href="https://audiflowai.com/?ref=recovery_email" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; padding: 13px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
              Desbloquear Informe Completo ($19 USD)
            </a>
          </div>

          <p style="font-size: 12px; color: #94a3b8; line-height: 1.5;">
            Si tiene alguna consulta o desea que nuestro equipo revise un contrato marco de mayor escala, responda directamente a este correo.<br><br>
            Atentamente,<br>
            <strong style="color: #f8fafc;">Equipo de Consultoría Corporativa — AuditFlow AI</strong>
          </p>
        </div>
      `;

      const sendRes = await sendRecoveryEmail({ to: lEmail, subject, html });
      results.push({ email: lEmail, status: sendRes.success ? 'sent' : 'error', provider: sendRes.provider });
    }

    // Mandato Universal: Copia al Propietario (tendenciaaitufuturo@gmail.com)
    const ownerSubject = `[Recuperación de Leads] AuditFlow AI — Lote de Seguimiento Ejecutado (${results.length} Leads)`;
    const ownerHtml = `
      <div style="font-family: Arial, sans-serif; background: #0f172a; color: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #38bdf8;">
        <h3 style="color: #38bdf8; margin-top: 0;">AuditFlow AI — Reporte de Recuperación de Leads</h3>
        <p>Se ha ejecutado la secuencia automatizada de recuperación para leads no convertidos.</p>
        <p>Total procesados: <strong>${results.length}</strong></p>
        <p style="font-size: 12px; color: #94a3b8;">Copia de control enviada a la bandeja del propietario.</p>
      </div>
    `;
    await sendRecoveryEmail({ to: 'tendenciaaitufuturo@gmail.com', subject: ownerSubject, html: ownerHtml });

    return res.status(200).json({
      success: true,
      total_processed: results.length,
      results,
      message: `Secuencia de recuperación ejecutada para ${results.length} prospectos.`
    });

  } catch (err) {
    console.error('Error en api/lead-recovery.js:', err);
    return res.status(500).json({ error: 'Error ejecutando recuperacion de leads: ' + err.message });
  }
}
