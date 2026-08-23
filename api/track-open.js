import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (process.env.SUPABASE_URL || '').trim();
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '').trim();
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// Registro global en memoria de aperturas de correos y visitas de Waalaxy
export const openedLeadsMap = new Map();

// 1x1 GIF Transparente
const TRANSPARENT_GIF_BUFFER = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');

async function sendOwnerNotification({ subject, html }) {
  const gmailUser = (process.env.GMAIL_USER || 'rick28191@gmail.com').trim();
  const gmailPass = (process.env.GMAIL_APP_PASSWORD || 'fbqiyqmapqplbcim').replace(/\s+/g, '').trim();

  if (gmailUser && gmailPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: gmailUser, pass: gmailPass }
      });
      await transporter.sendMail({
        from: '"AuditFlow AI | Radar de Prospectos" <' + gmailUser + '>',
        to: 'rick28191@gmail.com',
        subject,
        html
      });
    } catch (err) {
      console.warn('Aviso enviando notificación de apertura:', err.message);
    }
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const url = new URL(req.url || '', 'http://' + (req.headers.host || 'localhost'));
    const email = (url.searchParams.get('email') || req.query?.email || req.body?.email || '').toLowerCase().trim();
    const source = url.searchParams.get('source') || req.query?.source || req.body?.source || 'email_open';
    const touch = url.searchParams.get('touch') || req.query?.touch || 'outbound';
    const company = url.searchParams.get('company') || req.query?.company || 'Empresa B2B';

    if (email && email.includes('@')) {
      const existing = openedLeadsMap.get(email) || { count: 0, first_opened: new Date().toISOString() };
      const newCount = existing.count + 1;
      openedLeadsMap.set(email, {
        count: newCount,
        first_opened: existing.first_opened,
        last_opened: new Date().toISOString(),
        source,
        touch,
        company
      });

      // Actualizar en base de datos Supabase si existe
      if (supabase) {
        try {
          await supabase.from('audit_leads').update({
            email_opened: true,
            opens_count: newCount,
            opened_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }).eq('email', email);
        } catch (dbErr) {}
      }

      // Notificar al propietario en la 1ra y 3ra apertura para no saturar
      if (newCount === 1 || newCount === 3 || source === 'waalaxy_visit') {
        const isWaalaxy = source.includes('waalaxy') || source.includes('linkedin');
        const alertTitle = isWaalaxy 
          ? '🚀 [Visita desde Waalaxy/LinkedIn] ' + email + ' ingresó a la web'
          : '👀 [Correo Abierto / Visto] ' + email + ' abrió el correo #' + newCount;
        
        const alertHtml = `
          <div style="font-family: Arial, sans-serif; background: #0f172a; color: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #38bdf8; max-width: 600px; margin: 0 auto;">
            <h3 style="color: #38bdf8; margin-top: 0;">${alertTitle}</h3>
            <p>Un prospecto acaba de interactuar con AuditFlow AI:</p>
            <ul style="color: #cbd5e1; font-size: 13px; line-height: 1.6;">
              <li><strong>Prospecto:</strong> ${email}</li>
              <li><strong>Empresa:</strong> ${company}</li>
              <li><strong>Origen:</strong> ${isWaalaxy ? 'Campaña Waalaxy / LinkedIn' : 'Campaña de Correo Outbound'}</li>
              <li><strong>Total Aperturas/Visitas:</strong> ${newCount} veces</li>
              <li><strong>Fecha y Hora:</strong> ${new Date().toLocaleString()}</li>
            </ul>
            <div style="background: #1e293b; padding: 12px; border-radius: 8px; font-size: 12px; color: #10b981;">
              💡 <strong>Acción Recomendada:</strong> El prospecto tiene interés activo. Si visita la web, el nuevo demo de 1 clic lo guiará al desbloqueo del informe.
            </div>
          </div>
        `;

        sendOwnerNotification({ subject: alertTitle, html: alertHtml }).catch(() => {});
      }
    }

    if (req.method === 'POST' || (req.headers.accept && req.headers.accept.includes('application/json'))) {
      return res.status(200).json({ success: true, tracked: true, email, source });
    }

    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    return res.status(200).send(TRANSPARENT_GIF_BUFFER);

  } catch (err) {
    if (req.method === 'POST') {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.setHeader('Content-Type', 'image/gif');
    return res.status(200).send(TRANSPARENT_GIF_BUFFER);
  }
}
