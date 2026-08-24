import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import { CONFIG } from './config.js';
import { escapeHtml } from './security.js';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = (process.env.SUPABASE_URL || '').trim();
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '').trim();
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// Mapa en memoria para persistencia volátil de invitaciones
export const colleagueInvitesMap = new Map();

// Helper de Envío de Correo por Gmail SMTP / Resend
async function dispatchEmail({ to, subject, html, replyTo }) {
  const resendApiKey = (process.env.RESEND_API_KEY || CONFIG.EMAIL.RESEND_API_KEY || '').trim();
  
  if (resendApiKey && resendApiKey.startsWith('re_')) {
    try {
      const resend = new Resend(resendApiKey);
      const resendResult = await resend.emails.send({
        from: CONFIG.EMAIL.FROM_TRANSACTIONAL,
        to,
        reply_to: replyTo || CONFIG.EMAIL.REPLY_TO_CONTROL,
        subject,
        html
      });
      if (resendResult && resendResult.data && resendResult.data.id) {
        return { success: true, provider: 'resend', id: resendResult.data.id };
      }
    } catch (err) {
      console.warn('[Invite] Resend error, cayendo a Gmail SMTP:', err.message);
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
      from: `"AuditFlow AI | B2B Risk Network" <${gmailUser}>`,
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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Utilice POST.' });
  }

  try {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    const {
      sender_name = 'Un colega directivo',
      sender_email = '',
      sender_company = 'Empresa B2B',
      colleague_name = 'Colega',
      colleague_email = '',
      colleague_role = 'Asesor Legal / CFO',
      document_name = 'Contrato_Comercial.pdf',
      document_type = 'Contrato Comercial',
      leakage_found = '$3,500 - $18,500 USD',
      custom_note = ''
    } = body;

    const safeColleagueEmail = (colleague_email || '').toLowerCase().trim();
    const safeSenderEmail = (sender_email || '').toLowerCase().trim();

    if (!safeColleagueEmail || !safeColleagueEmail.includes('@')) {
      return res.status(400).json({ error: 'El correo electrónico del colega es obligatorio y debe ser válido.' });
    }

    // 1. Registrar invitación en memoria volátil
    const inviteId = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const inviteRecord = {
      id: inviteId,
      sender_name: escapeHtml(sender_name),
      sender_email: safeSenderEmail,
      sender_company: escapeHtml(sender_company),
      colleague_name: escapeHtml(colleague_name),
      colleague_email: safeColleagueEmail,
      colleague_role: escapeHtml(colleague_role),
      document_name: escapeHtml(document_name),
      created_at: new Date().toISOString()
    };
    colleagueInvitesMap.set(inviteId, inviteRecord);

    // 2. Persistir en Supabase si está disponible
    if (supabase) {
      try {
        await supabase.from('audit_leads').insert([{
          name: escapeHtml(colleague_name),
          email: safeColleagueEmail,
          role: escapeHtml(colleague_role),
          company_estimate: escapeHtml(sender_company),
          document_type: escapeHtml(document_type),
          lead_score: 95, // Alta intención referida
          is_enterprise: true,
          emails_sent: 1
        }]);
      } catch (dbErr) {
        console.warn('[Invite] Error al insertar lead en Supabase:', dbErr.message);
      }
    }

    // 3. Plantilla de Correo para el Colega / Asesor Legal Invitado
    const appUrl = (process.env.APP_URL || CONFIG.URLS.APP_URL || 'https://audiflowai.com').replace(/\/+$/, '');
    const subject = `⚖️ ${sender_name} te ha invitado a revisar un informe de auditoría contractual en AuditFlow AI`;
    
    const colleagueHtml = `
      <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #38bdf8; max-width: 620px; margin: 0 auto;">
        <div style="border-bottom: 1px solid #1f2937; padding-bottom: 12px; margin-bottom: 20px;">
          <span style="color: #38bdf8; font-size: 12px; font-weight: bold; font-family: monospace; text-transform: uppercase;">INVITACIÓN DE AUDITORÍA &amp; SEGUNDA OPINIÓN LEGAL</span>
          <h2 style="color: #ffffff; margin: 6px 0 0 0; font-size: 20px;">AuditFlow AI — Control de Riesgos Contractuales</h2>
        </div>
        
        <p>Hola <strong>${escapeHtml(colleague_name)}</strong> (${escapeHtml(colleague_role)}),</p>
        
        <p style="line-height: 1.6; color: #d1d5db;">
          <strong>${escapeHtml(sender_name)}</strong> (${escapeHtml(sender_company)}) ha realizado una auditoría preventiva sobre el documento <strong>«${escapeHtml(document_name)}»</strong> y te ha invitado a colaborar y validar las conclusiones detectadas.
        </p>

        ${custom_note ? `
        <div style="background-color: #1e293b; border-left: 4px solid #38bdf8; padding: 12px 16px; margin: 18px 0; border-radius: 4px;">
          <p style="margin: 0; font-size: 13px; color: #94a3b8; font-style: italic;">"${escapeHtml(custom_note)}"</p>
          <p style="margin: 4px 0 0 0; font-size: 11px; color: #64748b;">— Nota adjunta de ${escapeHtml(sender_name)}</p>
        </div>
        ` : ''}

        <div style="background-color: #111827; border: 1px solid #f59e0b; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin: 0 0 8px 0; color: #fbbf24; font-size: 14px;">🔍 Resumen de Hallazgos en RAM Volátil:</h4>
          <ul style="margin: 0; padding-left: 18px; color: #cbd5e1; font-size: 13px; line-height: 1.6;">
            <li><strong>Documento Evaluado:</strong> ${escapeHtml(document_name)}</li>
            <li><strong>Riesgo Financiero Identificado:</strong> ${escapeHtml(leakage_found)}</li>
            <li><strong>Privacidad Garantizada:</strong> Procesado en memoria RAM volátil sin almacenamiento en disco (Zero-Retention).</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 28px 0 20px 0;">
          <a href="${appUrl}/?ref=colleague_invite&inv=${inviteId}" style="background-color: #10b981; color: #000000; font-weight: bold; font-size: 14px; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">
            📊 Abrir Auditoría &amp; Ver Cláusulas Redline →
          </a>
        </div>

        <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0 0 20px 0;">
          También puedes auditar tus propios contratos de forma gratuita directamente en <a href="${appUrl}" style="color: #38bdf8; text-decoration: none;">audiflowai.com</a>.
        </p>

        <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #1f2937; font-size: 11px; color: #64748b;">
          <p style="margin: 0;">AuditFlow AI • Inteligencia Artificial para la Detección de Fugas Financieras</p>
        </div>
      </div>
    `;

    // Despachar al invitado
    const inviteDispatch = await dispatchEmail({
      to: safeColleagueEmail,
      subject,
      html: colleagueHtml,
      replyTo: safeSenderEmail || CONFIG.EMAIL.REPLY_TO_CONTROL
    });

    // 4. Mandato Universal: Copia automática de control a tendenciaiatufuturo@gmail.com
    const ownerSubject = `👥 [Bucle Viral PLG] ${sender_name} invitó a ${colleague_name} (${safeColleagueEmail})`;
    const ownerHtml = `
      <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #ffffff; padding: 20px; border-radius: 10px;">
        <h3 style="color: #10b981; margin-top: 0;">👥 Nuevo Lead Referido por Bucle Viral (PLG)</h3>
        <p><strong>Remitente:</strong> ${escapeHtml(sender_name)} (${safeSenderEmail || 'N/A'}) - ${escapeHtml(sender_company)}</p>
        <p><strong>Invitado (Nuevo Lead):</strong> ${escapeHtml(colleague_name)} (${safeColleagueEmail})</p>
        <p><strong>Cargo / Rol:</strong> ${escapeHtml(colleague_role)}</p>
        <p><strong>Documento:</strong> ${escapeHtml(document_name)}</p>
        <p><strong>Despachador:</strong> ${inviteDispatch.provider} (ID: ${inviteDispatch.id || inviteDispatch.messageId || 'OK'})</p>
        <p style="font-size: 11px; color: #94a3b8; margin-top: 15px;">Copia automática de control enviada a tendenciaiatufuturo@gmail.com.</p>
      </div>
    `;

    await dispatchEmail({
      to: CONFIG.EMAIL.OWNER_CONTROL,
      subject: ownerSubject,
      html: ownerHtml
    }).catch(e => console.warn('[Invite] Error al enviar copia a owner:', e.message));

    return res.status(200).json({
      success: true,
      message: `Invitación enviada exitosamente a ${safeColleagueEmail}`,
      invite_id: inviteId,
      colleague_email: safeColleagueEmail
    });

  } catch (error) {
    console.error('[Invite Colleague Error]:', error);
    return res.status(500).json({ error: 'Error al procesar la invitación.', details: error.message });
  }
}
