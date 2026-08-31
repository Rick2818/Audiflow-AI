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

        const subject = `Tu Acceso de Cortesía para Auditar Contratos con IA — Audiflow AI / ${company}`;
        const html = `
          <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 25px; border-radius: 12px; border: 1px solid #d4af37;">
            <h2 style="color: #d4af37; margin-top: 0;">Hola ${name},</h2>
            <p>Tal como conversamos en LinkedIn, aquí tienes el enlace directo para que tu equipo pruebe la auditoría de 1 contrato completo en memoria RAM volátil:</p>
            <div style="text-align: center; margin: 25px 0;">
              <a href="${this.appUrl}/?ref=waalaxy-auto" style="background-color: #d4af37; color: #000000; padding: 12px 24px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 14px; display: inline-block;">
                Auditar 1 Contrato Gratis en 10 Segundos →
              </a>
            </div>
            <p style="color: #94a3b8; font-size: 13px;">🔒 Privacidad de Grado Bancario: Procesamiento efímero en memoria RAM con cero retención en disco.</p>
            <p>Cualquier duda, puedes responder a este correo o escribir a <strong>soporte@audiflowai.com</strong>.</p>
            <p>Saludos cordiales,<br><strong>Equipo Audiflow AI</strong></p>
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
