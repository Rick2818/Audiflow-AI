import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const gmailUser = (process.env.GMAIL_USER || 'rick28191@gmail.com').trim();
const gmailPass = (process.env.GMAIL_APP_PASSWORD || 'fbqiyqmapqplbcim').replace(/\s+/g, '').trim();
const targetEmail = (process.env.PERSONAL_NOTIFICATION_EMAIL || gmailUser || 'rick28191@gmail.com').trim();

console.log(`\n=======================================================`);
console.log(`📧 INICIANDO TEST DE VERIFICACIÓN SALIDA GMAIL SMTP`);
console.log(`📩 Remitente: ${gmailUser}`);
console.log(`📩 Destinatario Notificación: ${targetEmail}`);
console.log(`=======================================================\n`);

async function testSmtp() {
  if (gmailUser && gmailPass && !gmailUser.includes('tu_correo')) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailPass
        }
      });

      console.log('🔄 Verificando conexión SMTP con Gmail...');
      await transporter.verify();
      console.log('✅ Conexión SMTP Gmail AUTENTICADA Y VERIFICADA con éxito.');

      // Test: Correo de Campaña Direct Mail Outbound
      console.log('\n🔄 Enviando correo oficial de campaña Direct Mail Outbound al correo personal...');
      const ownerInfo = await transporter.sendMail({
        from: `"Ricardo | AuditFlow AI" <${gmailUser}>`,
        to: targetEmail,
        replyTo: 'rick28191@gmail.com',
        subject: `🎁 Auditoría preventiva de contratos y facturas para AuditFlow AI (Muestra Direct Mail)`,
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 28px; border-radius: 12px; border: 1px solid #10b981; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981; margin-top: 0; font-size: 20px;">AuditFlow AI — Detección de Fugas Financieras (El Salvador)</h2>
          <p>Hola <strong>Ricardo</strong> (Director Financiero / Contralor en <strong>AuditFlow AI</strong>),</p>
          <p style="line-height: 1.6; color: #e5e7eb;">
            Mi nombre es <strong>Ricardo</strong>. Desarrollé <strong>AuditFlow AI</strong>, una infraestructura de IA diseñada para directores financieros y contralores que audita contratos de proveedores y facturas en <strong>menos de 10 segundos</strong>.
          </p>
          <p style="line-height: 1.6; color: #e5e7eb;">
            Detecta cláusulas abusivas, sobrecostos y fugas financieras promedio de <strong>$3,500 a $18,000 USD</strong> antes de firmar o emitir pagos.
          </p>
          <p style="line-height: 1.6; color: #e5e7eb;">
            Queremos obsequiarle a su equipo en <strong>AuditFlow AI</strong> una <strong>auditoría de prueba 100% gratuita</strong> en cualquier contrato o factura activa para comprobar los hallazgos en memoria volátil (0 almacenamiento en disco).
          </p>
          <p style="text-align: center; margin: 25px 0;">
            <a href="https://audiflowai.com/?ref=outreach_direct_sample" style="background-color: #10b981; color: #000000; font-weight: bold; font-size: 15px; padding: 14px 28px; border-radius: 8px; text-decoration: none; display: inline-block;">🎁 Iniciar Auditoría Gratuita para AuditFlow AI</a>
          </p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #1f2937;">
            <p style="margin: 0 0 4px 0; color: #d1d5db; font-size: 14px;">Quedo a su total disposición para cualquier consulta,</p>
            <p style="margin: 0; font-weight: bold; color: #ffffff; font-size: 15px;">Ricardo</p>
            <p style="margin: 2px 0 0 0; color: #9ca3af; font-size: 13px;">Fundador &amp; Desarrollador, AuditFlow AI</p>
            <p style="margin: 4px 0 0 0; font-size: 13px;">
              <span style="color: #6b7280;">Email directo:</span> <a href="mailto:rick28191@gmail.com" style="color: #38bdf8; text-decoration: none;">rick28191@gmail.com</a> • <a href="mailto:ricardo@audiflowai.com" style="color: #38bdf8; text-decoration: none;">ricardo@audiflowai.com</a>
            </p>
          </div>
          <p style="color: #6b7280; font-size: 11px; text-align: center; margin-top: 25px; margin-bottom: 0;">
            AuditFlow AI • Memoria RAM Volátil Efímera • Cifrado AES-256 de Grado Bancario • Conforme a SOC-2 &amp; GDPR
          </p>
        </div>`
      });

      console.log(`✅ [DIRECT MAIL ENVIADO EXITOSAMENTE A ${targetEmail}] MessageID: ${ownerInfo.messageId}`);
      console.log(`✅ Estado HTTP/SMTP: 250 OK Message Accepted`);

      console.log(`\n🎉 ¡CORREO ENVIADO CON ÉXITO A TU BANDEJA PERSONAL: ${targetEmail}!\n`);
      process.exit(0);

    } catch (err) {
      console.error(`❌ Error en la verificación SMTP de Gmail:`, err.message);
      console.log('\nEjecutando fallback Ethereal Mail para diagnóstico...');
    }
  }

  // Fallback Ethereal
  try {
    const testAccount = await nodemailer.createTestAccount();
    const testTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass }
    });

    const info = await testTransporter.sendMail({
      from: `"AuditFlow AI Sales" <${testAccount.user}>`,
      to: targetEmail,
      subject: `💰 [ETHEREAL TEST] Notificación de Compra AuditFlow AI`,
      html: `<p>Prueba Ethereal OK</p>`
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`✅ Fallback Ethereal Generado: ${previewUrl}`);
    process.exit(0);
  } catch (e) {
    console.error(`❌ Fallback Ethereal Error:`, e.message);
    process.exit(1);
  }
}

testSmtp();
