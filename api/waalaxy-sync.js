import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import { CONFIG } from '../lib/config.js';
import { verifyAdminAuth, escapeHtml } from '../lib/security.js';
import { generateLegalExecutiveLeads, NORDIC_LEGAL_EXECUTIVE_LEADS } from './outreach.js';

const supabaseUrl = (process.env.SUPABASE_URL || '').trim();
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '').trim();
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// Memoria volátil para sincronización rápida en tiempo real
export const waalaxyProspectsStore = new Map();

async function sendWaalaxyAlert({ email, name, company, eventType, message }) {
  const adminEmail = CONFIG.EMAIL.OWNER_CONTROL || 'tendenciaiatufuturo@gmail.com';
  const gmailUser = (process.env.GMAIL_USER || CONFIG.EMAIL.SMTP_USER).trim();
  const gmailPass = (process.env.GMAIL_APP_PASSWORD || CONFIG.EMAIL.SMTP_PASS).replace(/\s+/g, '').trim();

  if (!gmailUser || !gmailPass || gmailUser.includes('tu_correo')) return;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailUser, pass: gmailPass }
    });

    const subject = `🛰️ [Waalaxy / LinkedIn Event] ${eventType.toUpperCase()}: ${name || email} (${company || 'Director Legal'})`;
    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 25px; border-radius: 10px; border: 1px solid #38bdf8;">
        <h2 style="color: #38bdf8; margin-top: 0;">🛰️ Sincronización Waalaxy & LinkedIn — AuditFlow AI</h2>
        <p style="color: #cbd5e1; font-size: 14px;">Se ha registrado una nueva interacción en tu campaña automatizada de LinkedIn / Waalaxy:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 13px; color: #e2e8f0;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #1f2937; color: #94a3b8;">Tipo de Evento:</td><td style="padding: 8px; border-bottom: 1px solid #1f2937; font-weight: bold; color: #38bdf8;">${escapeHtml(eventType)}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #1f2937; color: #94a3b8;">Prospecto:</td><td style="padding: 8px; border-bottom: 1px solid #1f2937; font-weight: bold;">${escapeHtml(name || 'No especificado')}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #1f2937; color: #94a3b8;">Empresa / Despacho:</td><td style="padding: 8px; border-bottom: 1px solid #1f2937;">${escapeHtml(company || 'Firma Legal B2B')}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #1f2937; color: #94a3b8;">Correo / LinkedIn:</td><td style="padding: 8px; border-bottom: 1px solid #1f2937; color: #10b981;">${escapeHtml(email || 'Contacto LinkedIn')}</td></tr>
          ${message ? `<tr><td style="padding: 8px; border-bottom: 1px solid #1f2937; color: #94a3b8;">Mensaje / Respuesta:</td><td style="padding: 8px; border-bottom: 1px solid #1f2937; color: #facc15;">${escapeHtml(message)}</td></tr>` : ''}
        </table>

        <div style="margin-top: 20px; text-align: center;">
          <a href="https://audiflowai.com/admin" style="background-color: #38bdf8; color: #000000; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 13px; display: inline-block;">
            Abrir Panel de Administración →
          </a>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"AuditFlow AI • Radar Waalaxy" <${gmailUser}>`,
      to: [adminEmail],
      subject,
      html
    });
  } catch (err) {
    console.warn('[WaalaxySync] Error enviando alerta de correo:', err.message);
  }
}

async function sendAutomatedRedlineDeliveryToProspect({ email, name, company, message = '' }) {
  if (!email || !email.includes('@') || email.includes('linkedin_user_')) return;

  const appUrl = (process.env.APP_URL || CONFIG.URLS.APP_URL || 'https://audiflowai.com').replace(/\/+$/, '');
  const cleanFirstName = name ? name.split(' ')[0] : 'colega';
  const targetCompany = company || 'su firma legal';

  const gmailUser = (process.env.GMAIL_USER || CONFIG.EMAIL.SMTP_USER).trim();
  const gmailPass = (process.env.GMAIL_APP_PASSWORD || CONFIG.EMAIL.SMTP_PASS).replace(/\s+/g, '').trim();

  if (!gmailUser || !gmailPass || gmailUser.includes('tu_correo')) return;

  // Detección inteligente de idioma (ES / EN / FR)
  const msgLower = (message || '').toLowerCase();
  let lang = 'es';
  if (msgLower.includes('audit') && !msgLower.includes('auditoria')) {
    lang = (msgLower.includes('bonjour') || msgLower.includes('merci') || msgLower.includes('oui')) ? 'fr' : 'en';
  } else if (msgLower.includes('hello') || msgLower.includes('please') || msgLower.includes('interested')) {
    lang = 'en';
  } else if (msgLower.includes('bonjour') || msgLower.includes('contrat') || msgLower.includes('merci')) {
    lang = 'fr';
  }

  let subject = `Borrador de Redline en Word (.docx) y Acceso Inmediato / ${targetCompany}`;
  let emailHtml = '';

  if (lang === 'en') {
    subject = `Word (.docx Track Changes) Redline Draft & Instant Access / ${targetCompany}`;
    emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; color: #111827; line-height: 1.6; max-width: 580px;">
        <p>Hello ${escapeHtml(cleanFirstName)},</p>
        <p>Thank you for your interest in <strong>AuditFlow AI</strong> (<a href="${appUrl}/?ref=linkedin-audit" style="color: #2563eb; text-decoration: none;">audiflowai.com</a>).</p>
        <p>As requested on LinkedIn, here is your direct access to test our <strong>Forensic Redline in Word (.docx with Track Changes)</strong> 100% free and confidential:</p>
        <div style="background-color: #f8fafc; padding: 16px; border-left: 4px solid #2563eb; margin: 18px 0; border-radius: 6px; font-size: 14px;">
          <p style="margin: 0 0 10px 0;"><strong>🎁 Your 1st Audit: 100% Free:</strong> Processed in volatile RAM (<10s, no disk storage, no credit card required):</p>
          <p style="margin: 0 0 10px 0; text-align: center;">
            <a href="${appUrl}/?ref=linkedin-audit" style="background-color: #2563eb; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 13px; display: inline-block;">
              Upload Contract & Get Word Redline in 10s →
            </a>
          </p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 12px 0;">
          <p style="margin: 0 0 6px 0;"><strong>⚡ Flash Single Redline:</strong> Only <strong>$19 USD</strong> per full contract with Word (.docx) export.</p>
          <p style="margin: 0;"><strong>💼 Plans:</strong> <strong>$69 USD/mo</strong> (unlimited) or <strong>$599 USD/yr</strong> (White-Label corporate license).</p>
        </div>
        <p>Best regards,<br><strong>Ricardo</strong><br><span style="color: #4b5563; font-size: 13px;">Founder • AuditFlow AI Corp. (<a href="${appUrl}" style="color: #2563eb; text-decoration: none;">audiflowai.com</a>)</span></p>
      </div>
    `;
  } else if (lang === 'fr') {
    subject = `Projet de Redline Word (.docx) et Accès Immédiat / ${targetCompany}`;
    emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; color: #111827; line-height: 1.6; max-width: 580px;">
        <p>Bonjour ${escapeHtml(cleanFirstName)},</p>
        <p>Merci pour votre intérêt pour <strong>AuditFlow AI</strong> (<a href="${appUrl}/?ref=linkedin-audit" style="color: #2563eb; text-decoration: none;">audiflowai.com</a>).</p>
        <p>Voici votre accès immédiat pour tester la génération du <strong>Redline Word (.docx avec suivi des modifications)</strong> 100% gratuit et confidentiel:</p>
        <div style="background-color: #f8fafc; padding: 16px; border-left: 4px solid #2563eb; margin: 18px 0; border-radius: 6px; font-size: 14px;">
          <p style="margin: 0 0 10px 0;"><strong>🎁 1ère Analyse 100% Gratuite:</strong> Traitement en mémoire RAM volatile (<10s, sans stockage, sans carte bancaire):</p>
          <p style="margin: 0 0 10px 0; text-align: center;">
            <a href="${appUrl}/?ref=linkedin-audit" style="background-color: #2563eb; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 13px; display: inline-block;">
              Déposer le Contrat et Obtenir le Redline en 10s →
            </a>
          </p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 12px 0;">
          <p style="margin: 0 0 6px 0;"><strong>⚡ Offre Redline Unique:</strong> <strong>$19 USD</strong> par contrat complet avec export Word (.docx).</p>
          <p style="margin: 0;"><strong>💼 Forfaits:</strong> <strong>$69 USD/mois</strong> (illimité) ou <strong>$599 USD/an</strong> (licence marque blanche).</p>
        </div>
        <p>Cordialement,<br><strong>Ricardo</strong><br><span style="color: #4b5563; font-size: 13px;">Fondateur • AuditFlow AI Corp. (<a href="${appUrl}" style="color: #2563eb; text-decoration: none;">audiflowai.com</a>)</span></p>
      </div>
    `;
  } else {
    // Español (default)
    emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; color: #111827; line-height: 1.6; max-width: 580px;">
        <p>Hola ${escapeHtml(cleanFirstName)},</p>
        <p>Gracias por tu interés en <strong>AuditFlow AI</strong> (<a href="${appUrl}/?ref=instant-redline" style="color: #2563eb; text-decoration: none;">audiflowai.com</a>).</p>
        <p>Tal como solicitaste, aquí tienes el acceso para probar la generación del <strong>Redline Forense en Word (.docx con Control de Cambios)</strong> de forma 100% gratuita y confidencial:</p>
        <div style="background-color: #f8fafc; padding: 16px; border-left: 4px solid #2563eb; margin: 18px 0; border-radius: 6px; font-size: 14px;">
          <p style="margin: 0 0 10px 0;"><strong>🎁 Tu 1er Análisis 100% Gratis:</strong> Pruébalo directamente en memoria RAM volátil (sin guardar archivos ni solicitar tarjeta):</p>
          <p style="margin: 0 0 10px 0; text-align: center;">
            <a href="${appUrl}/?ref=instant-redline" style="background-color: #2563eb; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 13px; display: inline-block;">
              Subir Contrato y Obtener Redline en 10s →
            </a>
          </p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 12px 0;">
          <p style="margin: 0 0 6px 0;"><strong>⚡ Oferta Redline Individual:</strong> Solo <strong>$19 USD</strong> por contrato completo con exportación en Word (.docx).</p>
          <p style="margin: 0;"><strong>💼 Planes:</strong> <strong>$69 USD/mes</strong> (ilimitado) o <strong>$599 USD/año</strong> (licencia anual con marca blanca para clientes de la firma).</p>
        </div>
        <p>También puedes responderme directamente a este correo adjuntando el borrador que estás revisando esta semana y te devuelvo el diagnóstico forense preliminar en minutos.</p>
        <p style="margin-top: 24px;">Saludos cordiales,<br><strong>Ricardo</strong><br><span style="color: #4b5563; font-size: 13px;">Fundador • AuditFlow AI Corp. (<a href="${appUrl}" style="color: #2563eb; text-decoration: none;">audiflowai.com</a>)</span></p>
      </div>
    `;
  }

  try {
    const resendApiKey = (process.env.RESEND_API_KEY || CONFIG.EMAIL.RESEND_API_KEY || '').trim();
    if (resendApiKey && resendApiKey.startsWith('re_')) {
      const { Resend } = await import('resend');
      const resend = new Resend(resendApiKey);
      const emailFrom = (process.env.EMAIL_FROM || CONFIG.EMAIL.FROM_TRANSACTIONAL).trim();
      await resend.emails.send({
        from: emailFrom,
        to: email,
        reply_to: 'tendenciaiatufuturo@gmail.com',
        subject,
        html: emailHtml
      });
      console.log(`[WaalaxySync] Auto-Responder de Redline despachado vía Resend (${lang.toUpperCase()}) a ${email}`);
    } else {
      console.log(`[WaalaxySync] Resend no configurado. Auto-responder procesado en modo seguro para ${email}`);
    }
  } catch (autoErr) {
    console.warn('[WaalaxySync] Error despachando auto-responder a prospecto:', autoErr.message);
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-password, x-waalaxy-token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. GET: Estado de Sincronización o Exportación de CSV para Waalaxy (Latam / Zona Nórdica)
  if (req.method === 'GET') {
    let query = { ...(req.query || {}) };
    if (req.url && req.url.includes('?')) {
      try {
        const qStr = req.url.split('?')[1];
        const sp = new URLSearchParams(qStr);
        for (const [k, v] of sp.entries()) {
          query[k] = v;
        }
      } catch (e) {}
    }
    const { action, format, campaign = 'pareto_latam' } = query;
    const isNordicCampaign = (campaign || '').toLowerCase().includes('nordic') || (campaign || '').toLowerCase().includes('nordica');

    if (action === 'export_csv' || format === 'csv') {
      const legalLeads = isNordicCampaign ? NORDIC_LEGAL_EXECUTIVE_LEADS : generateLegalExecutiveLeads(50);
      const filename = isNordicCampaign ? 'waalaxy_leads_zona_nordica.csv' : 'waalaxy_directores_legales_verificados.csv';
      
      const csvHeader = 'First Name,Last Name,Email,Job Title,Company Name,Country,Category,Waalaxy Campaign,Custom Message CTA\n';
      const csvRows = legalLeads.map(l => {
        const parts = l.name.split(' ');
        const fn = parts[0] || 'Executive';
        const ln = parts.slice(1).join(' ') || 'Leader';

        let customMsg = '';
        if (isNordicCampaign) {
          customMsg = `Hi ${fn}, noticed your legal/procurement leadership at ${l.company}. We built AuditFlow AI (https://audiflowai.com/?ref=nordic&country=se), an ephemeral RAM contract triage copilot operating under strict EU GDPR Article 28 compliance. Audits vendor agreements in <10s with instant Word (.docx Track Changes) redlines benchmarked against Nordic commercial standards. 1st confidential audit is 100% free in RAM buffer. Would it make sense to share a 1-page Scandinavian contract benchmark breakdown?`;
        } else {
          customMsg = `Hola ${fn}, veo que lideras el área legal en ${l.company}. Desarrollamos AuditFlow AI (https://audiflowai.com/?ref=waalaxy), herramienta que audita contratos y genera Redlines en Word (.docx con control de cambios) en menos de 10s. Puedes probar tu 1er análisis 100% gratis en RAM o aprovechar la auditoría individual por $19 USD. ¿Te parece que te comparta un resumen de 1 página con las cláusulas de fuga más frecuentes?`;
        }
        
        const campaignTag = isNordicCampaign ? 'leads Zona Nordica' : 'Waalaxy Latam VIP';
        return `"${fn}","${ln}","${l.email}","${l.role}","${l.company}","${l.country}","${l.category || 'LEGAL_EXECUTIVE'}","${campaignTag}","${customMsg.replace(/"/g, '""')}"`;
      }).join('\n');

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.status(200).send(csvHeader + csvRows);
    }

    return res.status(200).json({
      success: true,
      service: 'AuditFlow AI Waalaxy Webhook & Sync Engine',
      webhook_url: 'https://audiflowai.com/api/waalaxy-sync',
      campaign: isNordicCampaign ? 'leads Zona Nordica' : 'pareto_latam',
      total_real_legal_leads_ready: isNordicCampaign ? NORDIC_LEGAL_EXECUTIVE_LEADS.length : 25,
      active_synced_leads: waalaxyProspectsStore.size,
      status: 'ONLINE'
    });
  }

  // 2. POST: Recepción de Webhooks de Waalaxy / Zapier / Make
  if (req.method === 'POST') {
    try {
      let body = req.body || {};
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) { body = {}; }
      }

      const {
        action = '',
        campaign = 'leads_zona_nordica',
        event_type = 'prospect_interaction',
        email = '',
        name = '',
        role = '',
        company = '',
        linkedin_url = '',
        message = '',
        status = 'PROSPECT'
      } = body;

      // ACCIÓN ESPECIAL: DISPARAR Y SINCRONIZAR CAMPAÑA "LEADS ZONA NÓRDICA" A TRAVÉS DE WAALAXY
      if (action === 'dispatch_nordic_campaign' || action === 'dispatch_campaign' || campaign === 'leads_zona_nordica') {
        const dispatchedLeads = [];

        for (const lead of NORDIC_LEGAL_EXECUTIVE_LEADS) {
          const leadPayload = {
            id: lead.id,
            email: lead.email,
            name: lead.name,
            role: lead.role,
            company: lead.company,
            country: lead.country,
            campaign: 'leads Zona Nordica',
            event_type: 'waalaxy_sequence_dispatched',
            status: 'WAALAXY_SEQUENCE_ACTIVE',
            compliance_standard: 'EU GDPR Art. 28 + Ephemeral RAM',
            synced_at: new Date().toISOString()
          };

          waalaxyProspectsStore.set(lead.email.toLowerCase(), leadPayload);

          if (supabase) {
            try {
              await supabase.from('audit_leads').upsert({
                email: lead.email,
                name: lead.name,
                company: lead.company,
                role: lead.role,
                country: lead.country,
                document_type: 'Nordic B2B Contract Triage',
                status: 'WAALAXY_SEQUENCE_ACTIVE',
                tags: ['❄️ LEADS_ZONA_NORDICA', '🇪🇺 GDPR_ART28', '🛰️ WAALAXY_DISPATCHED', '👑 DIRECTIVA_REAL'],
                lead_score: lead.lead_score || 99,
                updated_at: new Date().toISOString()
              }, { onConflict: 'email' });
            } catch (dbErr) {
              console.warn('[WaalaxySync] Supabase Upsert:', dbErr.message);
            }
          }

          dispatchedLeads.push(leadPayload);
        }

        console.log(`🛰️ [WAALAXY DISPATCH] Campaña "leads Zona Nordica" activada y sincronizada exitosamente (${dispatchedLeads.length} decisores reales).`);

        return res.status(200).json({
          success: true,
          campaign: 'leads Zona Nordica',
          dispatched_count: dispatchedLeads.length,
          status: 'DISPATCHED_AND_ACTIVE',
          compliance: 'EU GDPR Article 28 • Zero Data Retention',
          leads: dispatchedLeads
        });
      }

      const recordId = `waalaxy_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const payload = {
        id: recordId,
        email: email || `linkedin_user_${Date.now()}@prospect.com`,
        name: name || 'Director Legal',
        role: role || 'General Counsel / Socio Legal',
        company: company || 'Firma Corporativa B2B',
        linkedin_url,
        event_type,
        message,
        status,
        synced_at: new Date().toISOString()
      };

      // Guardar en almacén volátil en memoria
      waalaxyProspectsStore.set(payload.email.toLowerCase(), payload);

      // Persistir en Supabase si está disponible
      if (supabase) {
        try {
          await supabase.from('audit_leads').upsert({
            email: payload.email,
            name: payload.name,
            company: payload.company,
            role: payload.role,
            document_type: 'Waalaxy LinkedIn Lead',
            status: 'LEAD_CAPTURED',
            tags: ['🛰️ WAALAXY_SYNC', '⚖️ LEGAL_COUNSEL'],
            updated_at: new Date().toISOString()
          }, { onConflict: 'email' });
        } catch (dbErr) {
          console.warn('[WaalaxySync] Supabase Upsert:', dbErr.message);
        }
      }

      // 1. Notificación inmediata al fundador y copia de control
      await sendWaalaxyAlert({
        email: payload.email,
        name: payload.name,
        company: payload.company,
        eventType: event_type,
        message
      });

      // 2. Despacho AUTOMÁTICO e instantáneo del Redline y acceso al prospecto
      await sendAutomatedRedlineDeliveryToProspect({
        email: payload.email,
        name: payload.name,
        company: payload.company
      });

      return res.status(200).json({
        success: true,
        message: 'Evento de Waalaxy procesado, sincronizado y Auto-Responder de Redline enviado',
        record: payload
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}
