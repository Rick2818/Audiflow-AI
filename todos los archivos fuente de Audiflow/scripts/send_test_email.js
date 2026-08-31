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

async function main() {
  console.log('⏳ Enviando correo de prueba a ricardo@audiflowai.com y tendenciaiatufuturo@gmail.com...');

  const info = await transporter.sendMail({
    from: '"Directora de Marketing | AuditFlow AI" <cmvo@audiflowai.com>',
    to: 'ricardo@audiflowai.com, tendenciaiatufuturo@gmail.com',
    subject: '🔔 [AuditFlow AI] Confirmación de Enrutamiento y Conectividad',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 24px; background: #0f172a; color: #ffffff; border-radius: 10px; max-width: 580px; margin: auto;">
        <h2 style="color: #10b981; margin-top: 0;">AuditFlow AI — Despacho de Prueba</h2>
        <p style="font-size: 15px; line-height: 1.6; color: #e2e8f0;">
          Estimado Ricardo, este es un correo de prueba enviado en tiempo real para verificar la conectividad de <strong>ricardo@audiflowai.com</strong>.
        </p>
        <div style="background: #1e293b; padding: 16px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0;">
          <p style="margin: 0; color: #38bdf8; font-weight: bold;">Estado del Sistema:</p>
          <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 13px;">
            • Meta Ads MCP: <strong>Conectado (act_2224127671159585)</strong><br/>
            • Página Facebook: <strong>Audiflowai.com</strong><br/>
            • Despacho Automático: <strong>Activo</strong>
          </p>
        </div>
        <hr style="border: 0; border-top: 1px solid #334155; margin: 20px 0;" />
        <p style="font-size: 12px; color: #64748b; margin: 0; text-align: center;">
          AuditFlow AI &bull; audiflowai.com &bull; San Salvador &bull; Cobertura 14 Países
        </p>
      </div>
    `
  });

  console.log('✅ Correo enviado con éxito! ID:', info.messageId);
}

main().catch(err => {
  console.error('❌ Error al enviar:', err.message);
});
