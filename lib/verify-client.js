import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import { CONFIG } from './config.js';
import { checkRateLimit, safeCompare, setStrictCors } from './security.js';

const supabaseUrl = (process.env.SUPABASE_URL || CONFIG.SUPABASE?.URL || '').trim();
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || CONFIG.SUPABASE?.KEY || '').trim();
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// Clave criptográfica efímera en memoria RAM volátil para evitar secretos predecibles en código fuente
const EPHEMERAL_SERVER_SECRET = crypto.randomBytes(32).toString('hex');

// Almacén en memoria volátil de códigos OTP (One-Time Password) con caducidad de 10 minutos
export const otpStore = new Map();

// Helper para emitir y validar tokens de sesión criptográficos fiduciarios (30 días de vigencia)
export function getSecret() {
  return (process.env.SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || EPHEMERAL_SERVER_SECRET).trim();
}

export function generateSessionToken(email, plan) {
  const secret = getSecret();
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 días
  const safeEmail = String(email || '').replace(/\|/g, '');
  const safePlan = String(plan || 'Enterprise').replace(/\|/g, '');
  const payload = `${safeEmail}|${safePlan}|${expiresAt}`;
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return Buffer.from(`${payload}|${sig}`).toString('base64');
}

export function verifySessionToken(token) {
  try {
    if (!token || typeof token !== 'string') return null;
    const secret = getSecret();
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split('|');
    if (parts.length !== 4) return null;
    const [email, plan, expiresAtStr, sig] = parts;
    const expiresAt = parseInt(expiresAtStr, 10);
    if (isNaN(expiresAt) || Date.now() > expiresAt) return null;

    const expectedSig = crypto.createHmac('sha256', secret).update(`${email}|${plan}|${expiresAtStr}`).digest('hex');

    if (!safeCompare(sig, expectedSig)) {
      return null;
    }

    return { email, plan, expiresAt };
  } catch (e) {
    return null;
  }
}

// Lista de correos corporativos autorizados por defecto / whitelist fiduciaria
// CORREGIDO (2026-09-17): se retiraron 5 correos "test_corp_lead_*" que
// estaban hardcodeados directamente en la whitelist de producción. Cualquiera
// que conociera esas direcciones (visibles en el código fuente) obtenía
// automáticamente sesión Enterprise vía OTP sin haber pagado. Si se
// necesitan cuentas de prueba, agregarlas solo vía variable de entorno
// (nunca en el código) y únicamente cuando NODE_ENV !== 'production'.
export const VIP_WHITELIST = new Set([
  'ricardo@audiflowai.com',
  'tendenciaiatufuturo@gmail.com',
  'admin@audiflowai.com',
  ...(process.env.NODE_ENV !== 'production'
    ? (process.env.TEST_VIP_WHITELIST || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
    : [])
]);

async function sendOtpEmail(toEmail, otpCode) {
  const resendApiKey = (process.env.RESEND_API_KEY || '').trim();
  const emailFrom = process.env.EMAIL_FROM || '"AuditFlow AI | Seguridad" <ricardo@audiflowai.com>';
  const subject = `Tu Código de Acceso Corporativo: ${otpCode} — AuditFlow AI`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 540px; margin: 0 auto; background: #0f172a; color: #f8fafc; padding: 32px; border-radius: 12px; border: 1px solid #1e293b;">
      <div style="border-bottom: 2px solid #38bdf8; padding-bottom: 12px; margin-bottom: 24px;">
        <h2 style="margin: 0; color: #38bdf8;">AuditFlow <span style="color: #10b981;">AI</span></h2>
        <span style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Autenticación Corporativa Segura</span>
      </div>
      <p style="font-size: 15px; color: #e2e8f0;">Hola,</p>
      <p style="font-size: 14px; color: #cbd5e1;">Has solicitado acceder a tu terminal corporativa en AuditFlow AI. Utiliza el siguiente código de un solo uso (OTP) para verificar tu sesión:</p>
      <div style="text-align: center; margin: 28px 0;">
        <span style="display: inline-block; background: #1e293b; color: #38bdf8; font-size: 32px; font-weight: bold; font-family: monospace; letter-spacing: 8px; padding: 14px 28px; border-radius: 8px; border: 1px solid #38bdf8;">
          ${otpCode}
        </span>
      </div>
      <p style="font-size: 12px; color: #94a3b8;">⏱️ Este código tiene una vigencia de <strong>10 minutos</strong>. Si tú no solicitaste este acceso, puedes ignorar este mensaje.</p>
    </div>
  `;

  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: emailFrom,
        to: [toEmail],
        reply_to: 'tendenciaiatufuturo@gmail.com',
        subject,
        html
      });
      return true;
    } catch (e) {
      console.warn('Fallo enviando OTP por Resend:', e.message);
    }
  }

  const gmailUser = (process.env.GMAIL_USER || CONFIG.EMAIL.SMTP_USER).trim();
  const gmailPass = (process.env.GMAIL_APP_PASSWORD || CONFIG.EMAIL.SMTP_PASS).replace(/\s+/g, '').trim();
  if (gmailUser && gmailPass && !gmailUser.includes('tu_correo')) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: gmailUser, pass: gmailPass }
      });
      await transporter.sendMail({
        from: `"AuditFlow AI" <${gmailUser}>`,
        to: toEmail,
        subject,
        html
      });
      return true;
    } catch (e) {
      console.warn('Fallo enviando OTP por Gmail SMTP:', e.message);
    }
  }
  return false;
}

export default async function verifyClientHandler(req, res) {
  setStrictCors(req, res, 'POST, OPTIONS', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  // Rate Limiting anti-fuerza bruta / anti-enumeración (30 peticiones por minuto por IP)
  const rawIp = (req.headers ? (req.headers['x-forwarded-for'] || req.headers['x-real-ip']) : null) || (req.socket ? req.socket.remoteAddress : null) || '127.0.0.1';
  const clientIp = String(rawIp).split(',')[0].trim();
  const rateCheck = checkRateLimit(`verify_client_${clientIp}`, 30, 60000);
  if (!rateCheck.allowed) {
    return res.status(429).json({
      success: false,
      is_client: false,
      error: 'Demasiadas solicitudes de verificación desde esta IP. Por favor espere un minuto.',
      retry_after: rateCheck.retryAfter
    });
  }

  try {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }

    // 0. Si se envía un token de sesión previo válido, restaurar instantáneamente
    const incomingToken = body.session_token || body.token;
    if (incomingToken) {
      const validSession = verifySessionToken(incomingToken);
      if (validSession) {
        return res.status(200).json({
          success: true,
          is_client: true,
          cliente: 'SI',
          status: 'active',
          plan: validSession.plan,
          email: validSession.email,
          session_token: incomingToken,
          message: 'Sesión corporativa restaurada con éxito.'
        });
      }
    }

    const rawEmail = (body.email || '').trim().toLowerCase();
    if (!rawEmail || !rawEmail.includes('@')) {
      return res.status(400).json({
        success: false,
        is_client: false,
        message: 'Por favor introduce un correo electrónico corporativo válido.'
      });
    }

    // PASO 2: Verificación de Código OTP
    const submittedOtp = (body.otp_code || body.otp || '').toString().trim();
    if (submittedOtp) {
      const record = otpStore.get(rawEmail);
      if (!record || Date.now() > record.expiresAt) {
        return res.status(400).json({
          success: false,
          error: 'El código de acceso ha expirado o no ha sido solicitado. Por favor solicita uno nuevo.'
        });
      }

      if (record.attempts >= 5) {
        otpStore.delete(rawEmail);
        return res.status(429).json({
          success: false,
          error: 'Demasiados intentos fallidos para este código. Por favor solicita uno nuevo.'
        });
      }

      const inputHash = crypto.createHash('sha256').update(submittedOtp).digest('hex');
      if (!safeCompare(inputHash, record.codeHash)) {
        record.attempts += 1;
        otpStore.set(rawEmail, record);
        return res.status(401).json({
          success: false,
          error: 'Código de acceso incorrecto. Verifica los 6 dígitos enviados a tu correo.'
        });
      }

      // Código verificado exitosamente: emitir token de sesión de 30 días
      otpStore.delete(rawEmail);
      const sessionToken = generateSessionToken(rawEmail, record.plan);

      return res.status(200).json({
        success: true,
        is_client: true,
        cliente: 'SI',
        status: 'active',
        plan: record.plan,
        email: rawEmail,
        session_token: sessionToken,
        message: 'Terminal corporativa verificada y activada con éxito.'
      });
    }

    // PASO 1: Solicitud de Código OTP (Comprobar estatus de cliente)
    let isClient = false;
    let clientPlan = 'Enterprise';

    if (VIP_WHITELIST.has(rawEmail)) {
      isClient = true;
      clientPlan = 'annual';
    } else if (supabase) {
      try {
        // CORREGIDO (2026-09-17): rawEmail se pasaba directo a .ilike() sin
        // escapar los comodines de patrón de Postgres ('%' y '_'). Un email
        // como "%@gmail.com" se interpretaba como patrón y podía coincidir
        // con cualquier cliente que tuviera un correo @gmail.com activo,
        // exponiendo si existen clientes que coinciden con un patrón amplio.
        // Se escapan los comodines para que el email se compare de forma literal.
        const ilikeSafeEmail = rawEmail.replace(/[%_]/g, '\\$&');
        const { data: subData } = await supabase
          .from('subscriptions')
          .select('id, plan_name, status')
          .ilike('customer_email', ilikeSafeEmail)
          .eq('status', 'active')
          .limit(1);

        if (subData && subData.length > 0) {
          isClient = true;
          clientPlan = subData[0].plan_name || 'Enterprise';
        } else {
          const { data: leadData } = await supabase
            .from('audit_leads')
            .select('id, is_enterprise, cliente')
            .ilike('email', ilikeSafeEmail)
            .or('is_enterprise.eq.true,cliente.eq.SI')
            .limit(1);

          if (leadData && leadData.length > 0) {
            isClient = true;
            clientPlan = 'Enterprise';
          }
        }
      } catch (dbErr) {
        console.warn('Error consultando cliente en Supabase:', dbErr.message);
      }
    }

    if (!isClient) {
      return res.status(200).json({
        success: false,
        is_client: false,
        cliente: 'NO',
        status: 'unregistered',
        email: rawEmail,
        message: 'El correo ingresado no se encuentra identificado como CLIENTE en la Base de Datos. Por favor verifique su correo o active su suscripción corporativa.'
      });
    }

    // Generar código numérico criptográfico de 6 dígitos
    const otpCode = crypto.randomInt(100000, 999999).toString();
    const codeHash = crypto.createHash('sha256').update(otpCode).digest('hex');
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutos

    otpStore.set(rawEmail, { codeHash, expiresAt, plan: clientPlan, attempts: 0 });

    // Enviar código al correo corporativo
    const sent = await sendOtpEmail(rawEmail, otpCode);
    console.log(`🔑 [OTP GENERADO] Código de acceso generado para ${rawEmail} (Expira en 10 min)`);

    return res.status(200).json({
      success: true,
      is_client: true,
      otp_required: true,
      email: rawEmail,
      message: 'Se ha enviado un código de acceso de 6 dígitos a su correo electrónico corporativo. Ingréselo para activar su terminal.',
      // En modo test/desarrollo local se incluye referencia para pruebas automatizadas
      ...(process.env.NODE_ENV === 'test' ? { test_otp: otpCode } : {})
    });

  } catch (error) {
    console.error('Error en verifyClientHandler:', error);
    return res.status(500).json({
      success: false,
      is_client: false,
      cliente: 'ERROR',
      message: 'Error procesando verificación de cliente fiduciario. Solicitud registrada de forma segura.'
    });
  }
}
