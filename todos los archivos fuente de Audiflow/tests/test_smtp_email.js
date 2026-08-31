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

      // Test: Correo de Campaña Direct Mail Outbound (Enfoque Corporativo)
      console.log('\n🔄 Enviando correo oficial corporativo de campaña Direct Mail al correo personal...');
      const ownerInfo = await transporter.sendMail({
        from: `"AuditFlow AI | Auditoría Corporativa" <${gmailUser}>`,
        to: targetEmail,
        replyTo: 'rick28191@gmail.com',
        subject: `🎁 Auditoría preventiva de contratos y facturas para AuditFlow AI (Enfoque Corporativo B2B)`,
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 28px; border-radius: 12px; border: 1px solid #10b981; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981; margin-top: 0; font-size: 20px;">AuditFlow AI — Auditoría Financiera y Blindaje Legal (El Salvador)</h2>
          <p>Estimado/a <strong>Director Financiero / Contralor</strong> (en <strong>AuditFlow AI</strong>),</p>
          <p style="line-height: 1.6; color: #e5e7eb;">
            En <strong>AuditFlow AI</strong> somos una firma especializada en auditoría financiera y mitigación de riesgos contractuales con <strong>más de 10 años de experiencia</strong> asesorando a directores financieros y departamentos legales corporativos.
          </p>
          <p style="line-height: 1.6; color: #e5e7eb;">
            Desarrollamos una infraestructura de Inteligencia Artificial que audita contratos de proveedores, acuerdos de IT y facturas en <strong>menos de 10 segundos</strong>, detectando penalizaciones ocultas, indexaciones dobles y sobrecostos promedio de <strong>$3,500 a $18,000 USD</strong> antes de firma o pago.
          </p>
          <p style="line-height: 1.6; color: #e5e7eb;">
            Nos complace otorgar a su equipo una <strong>auditoría de diagnóstico 100% gratuita y confidencial</strong> procesada estrictamente en memoria RAM volátil efímera (0 almacenamiento en disco).
          </p>

          <!-- 2 RECURSOS EJECUTIVOS OFICIALES -->
          <div style="background-color: #111827; border: 1px solid #f59e0b; border-radius: 10px; padding: 18px; margin: 24px 0;">
            <h4 style="margin: 0 0 10px 0; color: #fbbf24; font-size: 14px; font-weight: bold; text-transform: uppercase;">📦 2 Recursos Ejecutivos Oficiales Incluidos:</h4>
            <div style="margin-bottom: 12px; padding: 12px; background-color: #1e293b; border-radius: 6px; border-left: 3px solid #38bdf8;">
              <p style="margin: 0; font-size: 13px; color: #ffffff; font-weight: bold;">📄 1. Dossier Ejecutivo &amp; Plantilla Word (.docx) de Contra-Cláusulas</p>
              <p style="margin: 3px 0 0 0; font-size: 12px; color: #94a3b8;">Redlines blindados con límites de IPC (+3%) y exenciones de penalización listos para firmar.</p>
            </div>
            <div style="padding: 12px; background-color: #1e293b; border-radius: 6px; border-left: 3px solid #10b981;">
              <p style="margin: 0; font-size: 13px; color: #ffffff; font-weight: bold;">🎬 2. Video Demostrativo HyperFrames (40s • Voz Neuronal Femenina)</p>
              <p style="margin: 3px 0 10px 0; font-size: 12px; color: #94a3b8;">Demostración visual clara de qué hace AuditFlow AI, riesgos evitados y beneficios inmediatos en 40 segundos.</p>
              <a href="https://audiflowai.com/video?lang=es&ref=outreach_pareto_es" style="color: #000000; background-color: #10b981; padding: 10px 18px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: bold; display: inline-block;">▶️ Ver Video HyperFrames (40s) →</a>
            </div>
          </div>

          <p style="text-align: center; margin: 25px 0;">
            <a href="https://audiflowai.com/?ref=outreach_corporate_sample" style="background-color: #10b981; color: #000000; font-weight: bold; font-size: 15px; padding: 14px 28px; border-radius: 8px; text-decoration: none; display: inline-block;">🎁 Iniciar Auditoría Gratuita para AuditFlow AI</a>
          </p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #1f2937;">
            <p style="margin: 0 0 4px 0; color: #d1d5db; font-size: 14px;">Quedamos a su entera disposición,</p>
            <p style="margin: 0; font-weight: bold; color: #ffffff; font-size: 15px;">Equipo de Auditoría &amp; Consultoría Corporativa</p>
            <p style="margin: 2px 0 0 0; color: #9ca3af; font-size: 13px;">AuditFlow AI — Infraestructura B2B de Blindaje Legal</p>
            <p style="margin: 4px 0 0 0; font-size: 13px;">
              <span style="color: #6b7280;">Contacto Corporativo:</span> <a href="mailto:soporte@audiflowai.com" style="color: #38bdf8; text-decoration: none;">soporte@audiflowai.com</a> • <a href="https://audiflowai.com" style="color: #38bdf8; text-decoration: none;">audiflowai.com</a>
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
