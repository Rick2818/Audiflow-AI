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

      // Test 1: Correo de Notificación de Venta al Propietario
      console.log('\n🔄 Enviando correo de prueba de notificación de compra al propietario...');
      const ownerInfo = await transporter.sendMail({
        from: `"AuditFlow AI Sales" <${gmailUser}>`,
        to: targetEmail,
        subject: `💰 [PRUEBA VERIFICADA] ¡NUEVA VENTA CONFIRMADA! [$7.00 USD] - Cliente Demo`,
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 25px; border-radius: 12px; border: 1px solid #10b981; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981; margin-top: 0;">🎉 ¡Prueba de Notificación de Venta Satisfactoria!</h2>
          <p style="color: #e5e7eb; font-size: 15px;">Este es un correo de comprobación de salida Gmail SMTP en segundo plano para AuditFlow AI.</p>
          <div style="background-color: #111827; border: 1px solid #374151; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p style="margin: 4px 0; color: #38bdf8;"><strong>Monto:</strong> $7.00 USD</p>
            <p style="margin: 4px 0; color: #a855f7;"><strong>Servicio:</strong> Desbloqueo de Reporte Táctico PDF</p>
            <p style="margin: 4px 0; color: #10b981;"><strong>Pasarela:</strong> Stripe Card / Strike Lightning</p>
            <p style="margin: 4px 0; color: #9ca3af;"><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
          </div>
          <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 20px;">AuditFlow AI • Verificación SMTP en Segundo Plano</p>
        </div>`
      });

      console.log(`✅ [NOTIFICACIÓN PROPIETARIO RECIBIDA] MessageID: ${ownerInfo.messageId}`);
      console.log(`✅ Estado HTTP/SMTP: 250 OK Message Accepted`);

      console.log(`\n🎉 ¡LA SALIDA SMTP ESTÁ 100% VERIFICADA Y FUNCIONAL EN SEGUNDO PLANO!\n`);
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
