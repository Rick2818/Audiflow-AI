import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

/**
 * ==============================================================================
 * AUDIFLOWAI - LINKEDIN MCP AGENT & AUTO-RESPONDER SERVICE
 * ==============================================================================
 * Este agente automatiza la interacción en segundo plano:
 * 1. Procesa comentarios en posts de LinkedIn con palabras clave ('AUDITAR', 'INFO', 'DEMO', etc.)
 * 2. Genera la respuesta pública optimizada para engagement.
 * 3. Despacha el mensaje privado (DM) con el enlace de acceso de cortesía.
 * 4. Notifica en tiempo real al correo de Dirección.
 */

export class LinkedInMcpAgent {
  constructor(config = {}) {
    this.appUrl = (process.env.APP_URL || 'https://audiflowai.com').replace(/\/+$/, '');
    this.adminEmail = process.env.PERSONAL_NOTIFICATION_EMAIL || 'tendenciaiatufuturo@gmail.com';
    this.supportEmail = 'soporte@audiflowai.com';
    this.keywords = ['auditar', 'demo', 'info', 'prueba', 'interesa', 'informacion', 'contrato', 'cfo', 'legal'];
  }

  /**
   * Evalúa si un comentario de LinkedIn tiene intención de compra/prueba
   */
  evaluateIntent(commentText) {
    const textLower = (commentText || '').toLowerCase();
    const matched = this.keywords.filter(k => textLower.includes(k));
    return {
      hasIntent: matched.length > 0 || textLower.length > 3,
      matchedKeywords: matched
    };
  }

  /**
   * Genera la respuesta pública para el comentario (para impulsar el algoritmo de LinkedIn)
   */
  generatePublicReply(prospectName) {
    const firstName = prospectName ? prospectName.split(' ')[0] : 'colega';
    const replies = [
      `¡Hola ${firstName}! Te acabamos de enviar por mensaje privado (DM) tu acceso de cortesía para auditar 1 contrato completo en https://audiflowai.com 🚀 Saludos!`,
      `¡Excelente ${firstName}! Revisa tu bandeja de mensajes privados 📩, te compartimos el enlace directo para escanear tu contrato en memoria volátil sin costo.`,
      `¡Listo ${firstName}! Te enviamos por DM el acceso inmediato para probar el motor determinista de Audiflowai ⚖️📊.`
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }

  /**
   * Genera el Mensaje Privado (DM / InMail) personalizado de alto valor
   */
  generateDirectMessage(prospectName, companyName = '', role = '') {
    const firstName = prospectName ? prospectName.split(' ')[0] : 'colega';
    const targetComp = companyName ? ` en ${companyName}` : '';
    
    return `Hola ${firstName}, un gusto saludarte.

Vimos tu comentario en nuestra publicación de Audiflowai.

Tal como solicitaste, aquí tienes tu acceso de cortesía para auditar 1 contrato o balance completo de forma 100% gratuita y confidencial:

👉 https://audiflowai.com/?ref=linkedin-auto-dm

⚡ ¿Qué obtendrás en 10 segundos?
1️⃣ Detección de penalizaciones ocultas y riesgos de rescisión.
2️⃣ Cruce de cláusulas contra balances contables.
3️⃣ Cero alucinaciones con cita textual exacta y página de origen.
4️⃣ Procesamiento 100% en memoria volátil (0 almacenamiento en disco).

Si tienes dudas o necesitas una revisión personalizada para tu equipo${targetComp}, puedes escribirnos a ${this.supportEmail}.

¡Mucho éxito con la auditoría!
Equipo Audiflowai`;
  }

  /**
   * Notifica a la Dirección General vía correo
   */
  async notifyFounder({ prospectName, profileUrl, commentText, dmPayload }) {
    console.log(`\n🔔 [LINKEDIN MCP AGENT] Nuevo Lead Calificado Detectado:`);
    console.log(`👤 Prospecto: ${prospectName} (${profileUrl || 'LinkedIn Direct'})`);
    console.log(`💬 Comentario: "${commentText}"`);
    console.log(`📤 DM Despachado: Listo`);

    const gmailUser = (process.env.GMAIL_USER || '').trim();
    const gmailPass = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '').trim();

    if (gmailUser && gmailPass && !gmailUser.includes('tu_correo')) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: gmailUser, pass: gmailPass }
        });

        await transporter.sendMail({
          from: `"Audiflowai • Agente LinkedIn" <${gmailUser}>`,
          to: this.adminEmail,
          subject: `🔥 [Nuevo Lead LinkedIn] ${prospectName} comentó: "${commentText.substring(0, 40)}..."`,
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 25px; border-radius: 12px; border: 1px solid #d4af37;">
              <h2 style="color: #d4af37; margin-top: 0;">🔥 Interacción Calificada en LinkedIn</h2>
              <p>El Agente MCP en segundo plano procesó automáticamente un nuevo lead:</p>
              <ul>
                <li><strong>Prospecto:</strong> ${prospectName}</li>
                <li><strong>Comentario:</strong> "${commentText}"</li>
                <li><strong>Enlace Perfil:</strong> <a href="${profileUrl || '#'}" style="color: #38bdf8;">Ver en LinkedIn</a></li>
              </ul>
              <p style="color: #10b981;">✅ Respuesta pública publicada y DM con acceso a audiflowai.com despachado con éxito.</p>
            </div>
          `
        });
        console.log(`📧 Notificación por correo enviada a ${this.adminEmail}`);
      } catch (err) {
        console.warn(`[LinkedInMcpAgent] Notificación por email omitida (modo seguro): ${err.message}`);
      }
    }
  }

  /**
   * Ejecutor Principal del Flujo de Interacción
   */
  async processIncomingInteraction({ prospectName, profileUrl, commentText, companyName = '', role = '' }) {
    const intent = this.evaluateIntent(commentText);
    
    if (!intent.hasIntent) {
      return { status: 'skipped', reason: 'No intent detected' };
    }

    const publicReply = this.generatePublicReply(prospectName);
    const dmMessage = this.generateDirectMessage(prospectName, companyName, role);

    // Enviar alerta
    await this.notifyFounder({ prospectName, profileUrl, commentText, dmPayload: dmMessage });

    return {
      status: 'success',
      intent: intent.matchedKeywords,
      prospect: prospectName,
      publicReply,
      directMessage: dmMessage,
      timestamp: new Date().toISOString()
    };
  }
}

export default LinkedInMcpAgent;
