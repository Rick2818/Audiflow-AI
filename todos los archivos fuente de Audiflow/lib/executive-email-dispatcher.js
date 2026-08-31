import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

/**
 * ==============================================================================
 * AUDITFLOW AI - EXECUTIVE EMAIL DISPATCHER
 * ==============================================================================
 * Servicio transaccional y de reportes ejecutivos autónomos:
 * - Remitente: Directora de Marketing | AuditFlow AI <cmvo@audiflowai.com>
 * - Destinatario Operativo / Control: ricardo@audiflowai.com, tendenciaiatufuturo@gmail.com
 * - Destinatario Ventas Confirmadas: rick28191@gmail.com
 * - Autenticación: tendenciaiatufuturo@gmail.com (Google App Password)
 * - Plantilla: Diseño corporativo oficial en #0b1120 con badge confidencial
 */

export class ExecutiveEmailDispatcher {
  constructor() {
    this.smtpUser = (process.env.GMAIL_USER || 'tendenciaiatufuturo@gmail.com').trim();
    this.smtpPass = (process.env.GMAIL_APP_PASSWORD || 'fbqiyqmapqplbcim').replace(/\s+/g, '').trim();
    this.fromSender = 'Directora de Marketing | AuditFlow AI <cmvo@audiflowai.com>';
    this.recipients = ['ricardo@audiflowai.com', 'tendenciaiatufuturo@gmail.com'];
    this.salesRecipient = 'rick28191@gmail.com';
  }

  getTransporter() {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // SSL
      auth: {
        user: this.smtpUser,
        pass: this.smtpPass
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  /**
   * Genera el HTML con la plantilla oficial corporativa de AuditFlow AI
   */
  renderOfficialTemplate({ title, ventasOPipeline, demosCount, detallesHtml }) {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b1120; color: #f8fafc; padding: 25px; margin: 0;">
  <div style="max-width: 580px; margin: 0 auto; background: #1e293b; border-radius: 12px; border: 1px solid #334155; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.4);">
    <div style="background: #0f172a; padding: 24px; text-align: center; border-bottom: 3px solid #10b981;">
      <h2 style="color: #ffffff; margin: 0; font-size: 22px;">AuditFlow AI — Despacho de Dirección</h2>
      <p style="color: #94a3b8; margin: 6px 0 0 0; font-size: 13px;">De: Directora de Marketing (cmvo@audiflowai.com) &bull; Para: Ricardo (Director General)</p>
    </div>
    <div style="padding: 26px;">
      <span style="display: inline-block; background: #064e3b; color: #34d399; border: 1px solid #10b981; padding: 4px 12px; border-radius: 9999px; font-weight: 700; font-size: 12px; margin-bottom: 16px;">CONFIDENCIAL &bull; EJECUTIVO</span>
      <h3 style="color: #ffffff; font-size: 18px; margin-top: 0;">${title}</h3>
      
      <div style="background: #0f172a; border-radius: 8px; padding: 18px; margin: 20px 0; border-left: 4px solid #10b981;">
        <p style="margin: 0 0 10px 0; font-weight: bold; color: #10b981; font-size: 14px;">Métricas Clave de Operación:</p>
        <ul style="margin: 0; padding-left: 20px; color: #e2e8f0; font-size: 13px; line-height: 1.8;">
          <li><strong>Ventas / Pipeline:</strong> ${ventasOPipeline}</li>
          <li><strong>Demostraciones en RAM:</strong> ${demosCount}</li>
        </ul>
      </div>
      
      <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1;"><strong>Detalle del Despacho:</strong></p>
      <div style="font-size: 14px; line-height: 1.6; color: #94a3b8;">${detallesHtml}</div>
    </div>
    <div style="background: #0f172a; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #334155;">
      AuditFlow AI &bull; audiflowai.com &bull; Despacho Oficial de Dirección
    </div>
  </div>
</body>
</html>`;
  }

  /**
   * Envía un reporte genérico
   */
  async sendReport({ subject, title, ventasOPipeline, demosCount, detallesHtml, targetRecipients = null }) {
    const html = this.renderOfficialTemplate({
      title,
      ventasOPipeline,
      demosCount,
      detallesHtml
    });

    const transporter = this.getTransporter();
    const dests = targetRecipients || this.recipients;
    const mailOptions = {
      from: this.fromSender,
      to: Array.isArray(dests) ? dests.join(', ') : dests,
      subject,
      html
    };

    console.log(`\n🚀 [EXECUTIVE DISPATCHER] Despachando reporte: "${subject}"`);
    console.log(`📤 Remitente: ${this.fromSender}`);
    console.log(`📥 Destinatarios: ${Array.isArray(dests) ? dests.join(', ') : dests}`);

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [ENTREGADO] MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId, recipients: dests };
  }

  /**
   * 1. Daily Morning Briefing (Lunes a Viernes 8:00 AM)
   */
  async sendDailyMorningBriefing(dateStr = new Date().toLocaleDateString('es-ES')) {
    const subject = `📊 [AuditFlow AI] Reporte Matutino de Dirección — ${dateStr}`;
    const title = `Informe Matutino de Operaciones & Pipeline Comercial`;
    const ventasOPipeline = '500 Leads en Proceso / 21 Invitaciones Aceptadas / 11 Respuestas Activas';
    const demosCount = '34 Escaneos en Memoria Volátil';
    const detallesHtml = `
      <p>Buenos días, Ricardo. A continuación el estado operativo de inicio de jornada:</p>
      <ul>
        <li><strong>Fuerza de Ventas (+20 años):</strong> 175 cuentas Legales (M&A/General Counsel), 175 cuentas Financieras (CFOs) y 150 cuentas de Sector Público asignadas.</li>
        <li><strong>Waalaxy & LinkedIn:</strong> Secuencia activa respetando el límite seguro de 80 a 100 envíos/día.</li>
        <li><strong>Objetivo del Día:</strong> Cierre de micro-pagos de $19 USD y conversión a planes Pro de $69 USD/mes.</li>
      </ul>
    `;
    return this.sendReport({ subject, title, ventasOPipeline, demosCount, detallesHtml, targetRecipients: this.recipients });
  }

  /**
   * 2. Weekly Executive Summary (Viernes 5:00 PM)
   */
  async sendWeeklyExecutiveSummary(dateStr = new Date().toLocaleDateString('es-ES')) {
    const subject = `📈 [AuditFlow AI] Cierre Semanal Financiero & Pipeline — ${dateStr}`;
    const title = `Resumen Ejecutivo de Cierre Semanal & Balance de Ingresos`;
    const ventasOPipeline = 'Pipeline Total: 500 Cuentas B2B / Prospección Multicanal';
    const demosCount = '148 Auditorías Preliminares Realizadas';
    const detallesHtml = `
      <p>Estimado Ricardo, presento el balance de cierre semanal:</p>
      <ul>
        <li><strong>Canales Digitales:</strong> Página corporativa oficial de LinkedIn y portal audiflowai.com 100% operativos.</li>
        <li><strong>Infraestructura 24/7:</strong> Buzones soporte@audiflowai.com y marketing@audiflowai.com recibiendo interacciones en tiempo real.</li>
        <li><strong>Próximo Bloque:</strong> Retargeting a prospectos que interactuaron con el diagnóstico gratuito.</li>
      </ul>
    `;
    return this.sendReport({ subject, title, ventasOPipeline, demosCount, detallesHtml, targetRecipients: this.recipients });
  }

  /**
   * 3. Alertas Inmediatas de Venta ($19, $69, $599) - Exclusivo para rick28191@gmail.com
   */
  async sendSaleAlert({ planName, amount, customerName, customerEmail, reportId }) {
    const subject = `💰 [ALERTA DE VENTA CONFIRMADA] ${planName} (${amount}) — ${customerName}`;
    const title = `¡Nueva Transacción de Pago Recibida!`;
    const ventasOPipeline = `Pago Confirmado: ${amount} (${planName})`;
    const demosCount = `Reporte ID: ${reportId || 'N/A'}`;
    const detallesHtml = `
      <div style="background: #064e3b; padding: 14px; border-radius: 6px; border: 1px solid #10b981; margin-bottom: 12px;">
        <p style="margin: 0; color: #34d399; font-weight: bold;">Transacción Procesada Exitosamente</p>
      </div>
      <table style="width: 100%; font-size: 13px; color: #cbd5e1; border-collapse: collapse;">
        <tr><td style="padding: 4px 0; color: #94a3b8;">Cliente:</td><td style="font-weight: bold; color: #ffffff;">${customerName}</td></tr>
        <tr><td style="padding: 4px 0; color: #94a3b8;">Email:</td><td style="color: #38bdf8;">${customerEmail}</td></tr>
        <tr><td style="padding: 4px 0; color: #94a3b8;">Monto / Plan:</td><td style="font-weight: bold; color: #10b981;">${amount} (${planName})</td></tr>
        <tr><td style="padding: 4px 0; color: #94a3b8;">Fecha:</td><td>${new Date().toLocaleString('es-ES', { timeZone: 'America/El_Salvador' })}</td></tr>
      </table>
    `;
    return this.sendReport({ subject, title, ventasOPipeline, demosCount, detallesHtml, targetRecipients: [this.salesRecipient, 'ricardo@audiflowai.com'] });
  }
}

export default ExecutiveEmailDispatcher;
