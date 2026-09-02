import fetch from 'node-fetch';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

/**
 * ==============================================================================
 * AUDIFLOW AI - SALES NAVIGATOR + WAALAXY + N8N AUTOMATION ENGINE
 * ==============================================================================
 * Orquesta el flujo autónomo de punta a punta:
 * 1. Monitorea o recibe prospectos extraídos de LinkedIn Sales Navigator.
 * 2. Inyecta prospectos y dispara secuencias en Waalaxy en automático.
 * 3. Escucha respuestas y webhooks vía n8n (/waalaxy-incoming-lead).
 * 4. Despacha el acceso a la auditoría gratuita en audiflowai.com.
 * 5. Notifica a Dirección General y registra en CRM Google Sheets.
 */

export class SalesNavWaalaxyN8nEngine {
  constructor() {
    this.appUrl = process.env.APP_URL || 'https://audiflowai.com';
    this.adminEmail = process.env.PERSONAL_NOTIFICATION_EMAIL || 'tendenciaiatufuturo@gmail.com';
    this.n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'https://n8n.audiflowai.com/webhook/waalaxy-incoming-lead';
  }

  /**
   * 1. Procesa un lote de leads de Sales Navigator para sincronización automática con Waalaxy
   */
  prepareSalesNavBatchForWaalaxy(leads = []) {
    return leads.map(lead => {
      const isLegal = (lead.occupation || '').toLowerCase().includes('legal') || (lead.occupation || '').toLowerCase().includes('counsel');
      const isCfo = (lead.occupation || '').toLowerCase().includes('cfo') || (lead.occupation || '').toLowerCase().includes('financiero');

      let customTag = 'B2B_CORPORATIVO';
      let customSequence = 'Secuencia General';

      if (isLegal) {
        customTag = 'LEGAL_GENERAL_COUNSEL';
        customSequence = 'Secuencia Legal: Pasivos Ocultos & Redlines Forenses';
      } else if (isCfo) {
        customTag = 'FINANZAS_CFO';
        customSequence = 'Secuencia CFO: Mitigación de Fuga de Capital & ROI 10x';
      }

      return {
        id: lead.id || Math.random().toString(36).substring(2, 9),
        linkedinUrl: lead.linkedinUrl,
        firstName: lead.firstName,
        lastName: lead.lastName,
        occupation: lead.occupation,
        companyName: lead.companyName,
        email: lead.email,
        tag: customTag,
        campaign: customSequence,
        status: 'READY_TO_DISPATCH',
        trialUrl: `${this.appUrl}/?ref=salesnav-auto&lead=${encodeURIComponent(lead.firstName || '')}`
      };
    });
  }

  /**
   * 2. Recibe el Webhook de Waalaxy/n8n cuando un lead responde o acepta la invitación
   */
  async handleWaalaxyN8nWebhook(payload) {
    const {
      eventType = 'message_replied',
      prospect = {},
      message = ''
    } = payload;

    const name = prospect.firstName || prospect.name || 'Colega';
    const email = prospect.email || '';
    const company = prospect.companyName || prospect.company || 'Empresa';
    const occupation = prospect.occupation || prospect.title || 'Director';

    console.log(`\n⚡ [SALESNAV-WAALAXY-N8N] Evento Recibido: ${eventType.toUpperCase()}`);
    console.log(`👤 Prospecto: ${name} (${occupation} en ${company})`);
    console.log(`💬 Mensaje: "${message}"`);

    // Despacho de Correo Automatizado con Acceso de Cortesía
    let emailDispatched = false;
    const gmailUser = (process.env.GMAIL_USER || '').trim();
    const gmailPass = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '').trim();

    if (email && email.includes('@') && gmailUser && gmailPass && !gmailUser.includes('tu_correo')) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: gmailUser, pass: gmailPass }
        });

        const subject = `Lo costoso de un contrato no es lo que dice, sino lo que no vio a tiempo — Audiflow AI / ${company}`;
        const html = `
          <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 25px; border-radius: 12px; border: 1px solid #38bdf8;">
            <h2 style="color: #38bdf8; margin-top: 0;">Hola ${name},</h2>
            <p>En acuerdos comerciales y de proveedores, lo costoso nunca es lo que dice el documento, sino lo que no se vio a tiempo antes de firmar.</p>
            <p>Tal como conversamos, tu equipo no necesita más pestañas ni hojas de cálculo dispersas, sino un <strong>flujo único de 6 etapas</strong> (Centralizar ➔ Escanear ➔ Detectar ➔ Mitigar ➔ Certificar ➔ Proteger).</p>
            <div style="background-color: #1e293b; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <p style="margin: 0 0 10px 0;"><strong>🎁 Diagnostica tu primer contrato sin costo ni tarjeta:</strong> Si la IA no detecta penalizaciones ocultas ni nada que corregir, no pagas nada.</p>
              <p style="margin: 0;"><strong>⚡ Redline en Word (.docx con Control de Cambios):</strong> Listo antes de que termine tu café.</p>
            </div>
            <div style="text-align: center; margin: 25px 0;">
              <a href="${this.appUrl}/?ref=waalaxy-auto" style="background-color: #10b981; color: #000000; padding: 14px 28px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 14px; display: inline-block;">
                Auditar Mi Primer Contrato sin Costo (30s) →
              </a>
            </div>
            <p style="color: #94a3b8; font-size: 12px;">🔒 Privacidad Estricta: Memoria RAM volátil, cero almacenamiento en disco y garantía de no-entrenamiento de modelos públicos con datos corporativos.</p>
            <p>Saludos cordiales,<br><strong>Ricardo Bolaños</strong><br><span style="color: #94a3b8; font-size: 12px;">Director General • AuditFlow AI (<a href="https://audiflowai.com" style="color: #38bdf8;">audiflowai.com</a>)</span></p>
          </div>
        `;

        await transporter.sendMail({
          from: `"Audiflow AI" <${gmailUser}>`,
          to: email,
          reply_to: 'soporte@audiflowai.com',
          subject,
          html
        });
        emailDispatched = true;
        console.log(`📧 Acceso despachado automáticamente a ${email}`);
      } catch (e) {
        console.warn(`[WaalaxyN8nEngine] Envío de email omitido (modo seguro):`, e.message);
      }
    }

    return {
      status: 'success',
      processedAt: new Date().toISOString(),
      lead: { name, company, occupation, email },
      eventType,
      emailDispatched,
      accessLink: `${this.appUrl}/?ref=waalaxy-auto`
    };
  }
}

export default SalesNavWaalaxyN8nEngine;
