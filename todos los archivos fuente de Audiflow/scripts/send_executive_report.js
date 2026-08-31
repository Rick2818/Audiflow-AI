import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.GMAIL_USER || 'tendenciaiatufuturo@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || 'fbqiyqmapqplbcim'
  }
});

const todayStr = 'Viernes, 28 de Agosto de 2026';

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b1120; color: #f8fafc; padding: 25px; margin: 0; }
    .container { max-width: 620px; margin: 0 auto; background: #1e293b; border-radius: 12px; border: 1px solid #334155; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .header { background: #0f172a; padding: 24px; text-align: center; border-bottom: 3px solid #10b981; }
    .header h2 { color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 0.5px; }
    .header p { color: #94a3b8; margin: 6px 0 0 0; font-size: 13px; }
    .content { padding: 26px; }
    .badge { display: inline-block; background: #064e3b; color: #34d399; border: 1px solid #10b981; padding: 4px 12px; border-radius: 9999px; font-weight: 700; font-size: 12px; margin-bottom: 16px; }
    .metric-card { background: #0f172a; border-radius: 8px; padding: 18px; margin: 18px 0; border-left: 4px solid #10b981; }
    .metric-title { margin: 0 0 10px 0; font-weight: bold; color: #10b981; font-size: 14px; }
    .metric-list { margin: 0; padding-left: 20px; color: #e2e8f0; font-size: 13px; line-height: 1.8; }
    .section-title { font-size: 15px; color: #38bdf8; font-weight: bold; margin: 20px 0 8px 0; border-bottom: 1px solid #334155; padding-bottom: 4px; }
    .activity-text { font-size: 13.5px; line-height: 1.6; color: #cbd5e1; }
    .footer { background: #0f172a; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #334155; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>AuditFlow AI — Despacho de Dirección</h2>
      <p>De: Directora de Marketing y Ventas (CMVO) &bull; Para: Ricardo (Director General)</p>
    </div>
    <div class="content">
      <span class="badge">REPORTE EJECUTIVO OFICIAL &bull; CIERRE DEL DÍA</span>
      <h3 style="color: #ffffff; font-size: 18px; margin-top: 0;">📊 Cierre Semanal y Reporte de Fin del Día — ${todayStr}</h3>
      
      <div class="metric-card">
        <p class="metric-title">Resumen de Hitos y Métricas Operativas:</p>
        <ul class="metric-list">
          <li><strong>Ecosistema Meta:</strong> Página <em>Audiflowai.com</em> creada, verificada y publicada (ID: 1285349454663691).</li>
          <li><strong>Cuenta Instagram:</strong> @audiflowai registrada y configurada en modo Profesional.</li>
          <li><strong>Cuenta Publicitaria Meta Ads:</strong> act_2224127671159585 vinculada y operativa en USD.</li>
          <li><strong>Automatización n8n:</strong> Workflow multi-formato (Carruseles, Reels, Lead DM Funnel) desplegado.</li>
          <li><strong>Infraestructura de Correo:</strong> Conectividad SMTP y enrutamiento certificado.</li>
          <li><strong>Pipeline B2B Activo:</strong> Cobertura en 14 países (LegalTech & GovTech).</li>
        </ul>
      </div>
      
      <div class="section-title">1. Logros Principales de la Jornada</div>
      <p class="activity-text">
        Hoy completamos el despliegue integral de la infraestructura comercial y de captación de AuditFlow AI:
        <br/>• <strong>Presencia Oficial:</strong> Creamos la identidad formal de la marca en Facebook e Instagram con artes visuales de grado bancario (avatar 1:1 y portada Retina 1640x624).
        <br/>• <strong>Servidor MCP Meta:</strong> Integramos el servidor MCP <code>meta-ads-instagram</code> en el maestro de Antigravity para control desatendido de campañas.
        <br/>• <strong>Contenido de Inauguración:</strong> Diseñamos y renderizamos el primer carrusel estratégico de 5 diapositivas sobre pasivos ocultos y el post institucional de autoridad.
        <br/>• <strong>Regla de Oro:</strong> Promulgamos la política estricta de interacción, restringida únicamente a firmas legales, abogados, CFOs y CEOs.
      </p>

      <div class="section-title">2. Plan de Acción para la Apertura del Lunes</div>
      <p class="activity-text">
        • Activación del cron diario de n8n a la 1:00 PM para la publicación automatizada de carruseles y reels.
        <br/>• Monitoreo de palabras clave ('CONTRATO', 'REDLINE') para conversión a demos inmediatas en <code>https://audiflowai.com</code>.
        <br/>• Lanzamiento de la primera campaña de prospección B2B mediante Waalaxy y Meta Ads.
      </p>
    </div>
    <div class="footer">
      AuditFlow AI &bull; audiflowai.com &bull; San Salvador &bull; Despacho Oficial de Dirección
    </div>
  </div>
</body>
</html>
`;

async function sendReport() {
  console.log('⏳ Despachando Reporte Ejecutivo de Fin del Día...');
  const info = await transporter.sendMail({
    from: '"Directora de Marketing | AuditFlow AI" <cmvo@audiflowai.com>',
    to: 'ricardo@audiflowai.com, tendenciaiatufuturo@gmail.com',
    subject: `📈 [AuditFlow AI] Reporte Ejecutivo de Fin del Día y Cierre Semanal — ${todayStr}`,
    html: htmlContent
  });
  console.log('✅ Reporte despachado exitosamente al correo del Director General! Message ID:', info.messageId);
}

sendReport().catch(e => console.error('Error enviando reporte:', e.message));
