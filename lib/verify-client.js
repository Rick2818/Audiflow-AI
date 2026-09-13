import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { CONFIG } from './config.js';
import { checkRateLimit } from './security.js';

const supabaseUrl = (process.env.SUPABASE_URL || CONFIG.SUPABASE?.URL || '').trim();
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || CONFIG.SUPABASE?.KEY || '').trim();
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// Clave criptográfica efímera en memoria RAM volátil para evitar secretos predecibles en código fuente
const EPHEMERAL_SERVER_SECRET = crypto.randomBytes(32).toString('hex');

// Helper para emitir y validar tokens de sesión criptográficos fiduciarios (30 días de vigencia)
function getSecret() {
  return (process.env.SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || EPHEMERAL_SERVER_SECRET).trim();
}

function generateSessionToken(email, plan) {
  const secret = getSecret();
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 días
  const safeEmail = String(email || '').replace(/\|/g, '');
  const safePlan = String(plan || 'Enterprise').replace(/\|/g, '');
  const payload = `${safeEmail}|${safePlan}|${expiresAt}`;
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return Buffer.from(`${payload}|${sig}`).toString('base64');
}

function verifySessionToken(token) {
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
    
    // Comparación segura en tiempo constante contra Timing Attacks
    const sigBuf = Buffer.from(sig, 'hex');
    const expBuf = Buffer.from(expectedSig, 'hex');
    if (sigBuf.length !== 32 || expBuf.length !== 32 || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }
    
    return { email, plan, expiresAt };
  } catch (e) {
    return null;
  }
}

// Lista de correos corporativos autorizados por defecto / whitelist fiduciaria
const VIP_WHITELIST = new Set([
  'ricardo@audiflowai.com',
  'tendenciaiatufuturo@gmail.com',
  'admin@audiflowai.com',
  'test_corp_lead_1@lexcapital.com',
  'test_corp_lead_2@corporacionandina.com',
  'test_corp_lead_3@bancofiduciario.com',
  'test_corp_lead_4@auditpartners.org',
  'test_corp_lead_5@complianceglobal.net'
]);

const ALLOWED_ORIGINS = new Set([
  'https://audiflowai.com',
  'https://www.audiflowai.com',
  'http://localhost:3000',
  'http://localhost:5173'
]);

function setFiduciaryCors(req, res) {
  const origin = req.headers ? (req.headers.origin || req.headers.Origin) : null;
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://audiflowai.com');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function verifyClientHandler(req, res) {
  setFiduciaryCors(req, res);

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

    // 0. Si se envía un token de sesión previo, validarlo instantáneamente
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
        message: 'Por favor introduce un correo electrónico válido.' 
      });
    }

    // 1. Verificación en Whitelist fiduciaria
    if (VIP_WHITELIST.has(rawEmail)) {
      const token = generateSessionToken(rawEmail, 'annual');
      return res.status(200).json({
        success: true,
        is_client: true,
        cliente: 'SI',
        status: 'active',
        plan: 'annual',
        email: rawEmail,
        session_token: token,
        message: 'Verifique su correo — ✅ Correo identificado como CLIENTE en la Base de Datos. Dando paso a la plataforma...'
      });
    }

    // 2. Consulta en Supabase
    if (supabase) {
      try {
        // Verificar en tabla subscriptions
        const { data: subData, error: subErr } = await supabase
          .from('subscriptions')
          .select('id, plan_name, status, customer_email, cliente')
          .ilike('customer_email', rawEmail)
          .eq('status', 'active')
          .limit(1);

        if (!subErr && subData && subData.length > 0) {
          const sub = subData[0];
          const plan = sub.plan_name || 'Enterprise';
          const token = generateSessionToken(rawEmail, plan);
          return res.status(200).json({
            success: true,
            is_client: true,
            cliente: 'SI',
            status: 'active',
            plan: plan,
            email: rawEmail,
            session_token: token,
            message: 'Verifique su correo — ✅ Correo identificado como CLIENTE en la Base de Datos. Dando paso a la plataforma...'
          });
        }

        // Verificar en tabla audit_leads
        const { data: leadData, error: leadErr } = await supabase
          .from('audit_leads')
          .select('id, is_enterprise, cliente')
          .ilike('email', rawEmail)
          .or('is_enterprise.eq.true,cliente.eq.SI')
          .limit(1);

        if (!leadErr && leadData && leadData.length > 0) {
          const token = generateSessionToken(rawEmail, 'Enterprise');
          return res.status(200).json({
            success: true,
            is_client: true,
            cliente: 'SI',
            status: 'active',
            plan: 'Enterprise',
            email: rawEmail,
            session_token: token,
            message: 'Verifique su correo — ✅ Correo identificado como CLIENTE en la Base de Datos. Dando paso a la plataforma...'
          });
        }
      } catch (dbErr) {
        console.warn('Advertencia consultando Supabase en verify-client:', dbErr.message);
      }
    }

    // Si no se encuentra como cliente en la base de datos
    return res.status(200).json({
      success: false,
      is_client: false,
      cliente: 'NO',
      status: 'unregistered',
      email: rawEmail,
      message: 'El correo ingresado no se encuentra identificado como CLIENTE en la Base de Datos. Por favor verifique su correo o active su membresía corporativa.'
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
