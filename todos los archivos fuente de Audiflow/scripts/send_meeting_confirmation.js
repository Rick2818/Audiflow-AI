import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: 'rick28191@gmail.com',
    pass: 'humycnvzdtyzmnos'
  }
});

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b1120; color: #f8fafc; padding: 25px; margin: 0; }
    .container { max-width: 620px; margin: 0 auto; background: #1e293b; border-radius: 12px; border: 1px solid #334155; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .header { background: #0f172a; padding: 24px; text-align: center; border-bottom: 3px solid #10b981; }
    .header h2 { color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 0.5px; }
    .header p { color: #94a3b8; margin: 6px 0 0 0; font-size: 13px; }
    .content { padding: 26px; }
    .badge { display: inline-block; background: #064e3b; color: #34d399; border: 1px solid #10b981; padding: 4px 12px; border-radius: 9999px; font-weight: 700; font-size: 12px; margin-bottom: 16px; }
    .card { background: #0f172a; border-radius: 8px; padding: 18px; margin: 18px 0; border-left: 4px solid #10b981; }
    .card-title { margin: 0 0 10px 0; font-weight: bold; color: #10b981; font-size: 14px; }
    .list { margin: 0; padding-left: 20px; color: #e2e8f0; font-size: 13px; line-height: 1.8; }
    .footer { background: #0f172a; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #334155; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>AuditFlow AI — Comité de Dirección Ejecutiva</h2>
      <p>Convocatoria Oficial • Sesión de Inicio de Semana (Lunes 8:00 AM)</p>
    </div>
    <div class="content">
      <span class="badge">CONVOCATORIA EJECUTIVA CONFIRMADA</span>
      <h3 style="color: #ffffff; font-size: 18px; margin-top: 0;">📅 Reunión de Dirección: Lunes 31 de Agosto de 2026 — 8:00 AM</h3>
      
      <p style="font-size: 13.5px; color: #cbd5e1; line-height: 1.6;">
        Estimado <strong>Ricardo (Director General)</strong>,
      </p>
      <p style="font-size: 13.5px; color: #cbd5e1; line-height: 1.6;">
        La <strong>Directora de Marketing y Ventas (CMVO)</strong> y el <strong>Gerente General (COO)</strong> confirman formalmente su asistencia y compromiso incondicional para la reunión de inicio de semana de mañana lunes a las <strong>8:00 AM CST</strong>.
      </p>

      <div class="card">
        <p class="card-title">🎯 Compromiso Innegociable y Orden del Día:</p>
        <ul class="list">
          <li><strong>Meta Diaria Innegociable:</strong> Generar <strong>AL MENOS 1 CLIENTE NUEVO AL DÍA</strong> en las 3 líneas de negocio ($19 Diagnóstico, $69/mes Pro, $599/año Corporativo).</li>
          <li><strong>Revisión del Plan de Marketing:</strong> Despliegue del plan maestro presentado al cierre de la semana anterior.</li>
          <li><strong>Estrategia de Conversión de Choque:</strong> Activación del nuevo embudo con Demo en 1 Clic ($14,400 en fugas detectadas) y Garantía Fiduciaria 10x ($190 USD).</li>
          <li><strong>Monitoreo de Meta Ads & Anti-Fatiga:</strong> Control estricto de ROAS &ge; 4.5x y frecuencia de impactos por usuario &lt; 2.8.</li>
          <li><strong>Control Financiero en USD:</strong> Reporte del Gerente General sobre MRR, ARR y margen neto operativo.</li>
        </ul>
      </div>

      <p style="font-size: 13px; color: #94a3b8; line-height: 1.6;">
        Ambos directores presentarán sus tableros de control y planes de acción específicos para garantizar que la meta de 1 cliente diario se cumpla desde la primera jornada.
      </p>
    </div>
    <div class="footer">
      AuditFlow AI &bull; audiflowai.com &bull; Despacho Automatizado por n8n + MCP Google Workspace
    </div>
  </div>
</body>
</html>
`;

async function enviarConvocatoria() {
  const mailOptions = {
    from: '"AuditFlow AI Executive Desk" <cmvo@audiflowai.com>',
    to: 'ricardo@audiflowai.com, rick28191@gmail.com',
    subject: '📅 [AuditFlow AI] Convocatoria Confirmada: Reunión Ejecutiva Lunes 8:00 AM (Compromiso 1 Cliente/Día)',
    html: htmlContent
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Correo de convocatoria despachado exitosamente a Ricardo:', info.messageId);
  } catch (err) {
    console.warn('⚠️ Nota de envío:', err.message);
  }
}

enviarConvocatoria();
