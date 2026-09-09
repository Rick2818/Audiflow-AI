import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * ==============================================================================
 * AUDITFLOW AI — VALIDADOR DE CREDENCIALES GMAIL PARA INSTANTLY
 * ==============================================================================
 * Valida la autenticación SMTP de ricardo.audiflowai@gmail.com con Google.
 * ==============================================================================
 */

export async function verifyInstantlyGmailCredentials(customPassword = null) {
  const email = process.env.INSTANTLY_OUTREACH_EMAIL || 'ricardo.audiflowai@gmail.com';
  const password = (customPassword || process.env.INSTANTLY_GMAIL_APP_PASSWORD || '').replace(/\s+/g, '').trim();

  console.log('======================================================================');
  console.log('🔍 AUDITFLOW AI — VERIFICADOR DE CREDENCIALES GMAIL (INSTANTLY OUTREACH)');
  console.log(`📧 Cuenta a Verificar: ${email}`);
  console.log('======================================================================\n');

  if (!password) {
    console.log('❌ [PENDIENTE] No hay contraseña de aplicación configurada para ' + email);
    console.log('👉 Se requiere generar una nueva Contraseña de Aplicación de 16 caracteres en Google:');
    console.log('   https://myaccount.google.com/apppasswords\n');
    return { success: false, reason: 'MISSING_PASSWORD' };
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: email,
      pass: password
    }
  });

  try {
    console.log('⏳ Probando apretón de manos (handshake) SMTP con Google...');
    await transporter.verify();
    console.log('✅ ¡AUTENTICACIÓN EXITOSA CON GOOGLE!');
    console.log(`🎉 La cuenta ${email} está 100% lista para ser vinculada a Instantly.ai.`);
    return { success: true, email };
  } catch (err) {
    console.error(`❌ Fallo de autenticación en Google: ${err.message}`);
    return { success: false, error: err.message };
  }
}

if (process.argv[1] && process.argv[1].includes('test_instantly_gmail_credentials.mjs')) {
  const pwdArg = process.argv[2] || null;
  verifyInstantlyGmailCredentials(pwdArg)
    .then(res => {
      if (!res.success) process.exit(1);
    })
    .catch(() => process.exit(1));
}
