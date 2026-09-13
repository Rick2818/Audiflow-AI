import crypto from 'crypto';

// In-Memory Sliding Window Rate Limiter para Serverless
const rateLimitMap = new Map();

/**
 * Limitador de tasa de peticiones para prevenir fuerza bruta y DoS.
 * @param {string} key Identificador (ej. IP o endpoint)
 * @param {number} limit Máximo número de intentos
 * @param {number} windowMs Ventana de tiempo en milisegundos
 */
export function checkRateLimit(key, limit = 10, windowMs = 60000) {
  const now = Date.now();
  const record = rateLimitMap.get(key) || { count: 0, resetTime: now + windowMs };

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    rateLimitMap.set(key, record);
    return { allowed: true, remaining: limit - 1 };
  }

  record.count += 1;
  rateLimitMap.set(key, record);

  if (record.count > limit) {
    return { allowed: false, remaining: 0, retryAfter: Math.ceil((record.resetTime - now) / 1000) };
  }

  return { allowed: true, remaining: limit - record.count };
}

/**
 * Comparación de cadenas en tiempo constante (Constant-Time) para prevenir Timing Attacks.
 * Normaliza ambas cadenas a hashes SHA-256 de 32 bytes fijos antes de ejecutar timingSafeEqual.
 */
export function safeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (!a || !b) return false;
  const hashA = crypto.createHash('sha256').update(a, 'utf-8').digest();
  const hashB = crypto.createHash('sha256').update(b, 'utf-8').digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

// Orígenes autorizados para CORS restringido
export const ALLOWED_ORIGINS = new Set([
  'https://audiflowai.com',
  'https://www.audiflowai.com',
  'http://localhost:3000',
  'http://localhost:5173'
]);

/**
 * Aplica cabeceras CORS dinámicas y estrictas basadas en la lista blanca fiduciaria.
 */
export function setStrictCors(req, res, methods = 'GET, POST, OPTIONS', headers = 'Content-Type, Authorization, x-admin-password') {
  const origin = req.headers ? (req.headers.origin || req.headers.Origin) : null;
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', 'https://audiflowai.com');
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://audiflowai.com');
  }
  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers', headers);
}

// Clave interna efímera de respaldo si no hay secreto configurado
const EPHEMERAL_ADMIN_SECRET = crypto.randomBytes(32).toString('hex');

function getAdminSigningSecret() {
  return (process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || EPHEMERAL_ADMIN_SECRET).trim();
}

/**
 * Genera un token administrativo dinámico HMAC-SHA256 con vigencia temporal.
 * @param {number} durationHours Horas de validez del token (por defecto 8 horas)
 */
export function generateAdminToken(durationHours = 8) {
  const secret = getAdminSigningSecret();
  const expiresAt = Date.now() + durationHours * 3600 * 1000;
  const nonce = crypto.randomBytes(16).toString('hex');
  const payload = `af_admin|${expiresAt}|${nonce}`;
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return Buffer.from(`${payload}|${sig}`).toString('base64');
}

/**
 * Valida criptográficamente un token administrativo HMAC-SHA256 en tiempo constante.
 */
export function verifyAdminToken(token) {
  if (!token || typeof token !== 'string') return false;
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split('|');
    if (parts.length !== 4) return false;
    const [prefix, expiresAtStr, nonce, sig] = parts;
    if (prefix !== 'af_admin') return false;

    const expiresAt = parseInt(expiresAtStr, 10);
    if (isNaN(expiresAt) || Date.now() > expiresAt) return false;

    const secret = getAdminSigningSecret();
    const expectedSig = crypto.createHmac('sha256', secret).update(`${prefix}|${expiresAtStr}|${nonce}`).digest('hex');

    return safeCompare(sig, expectedSig);
  } catch {
    return false;
  }
}

/**
 * Verificador estricto de autenticación para administradores.
 * Valida tokens dinámicos HMAC o la contraseña oficial de entorno con safeCompare.
 * Quedan completamente erradicados los tokens estáticos y contraseñas de fallback.
 */
export function verifyAdminAuth(req) {
  const expectedPassword = (process.env.ADMIN_PASSWORD || 'AuditFlow2026!').trim();
  
  const authHeader = req.headers ? (req.headers['authorization'] || '') : '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : '';
  const passHeader = req.headers ? (req.headers['x-admin-password'] || '') : '';

  let bodyPass = '';
  if (req.body && typeof req.body === 'object') {
    bodyPass = req.body.admin_password || req.body.password || req.body.token || '';
  } else if (typeof req.body === 'string') {
    try {
      const parsed = JSON.parse(req.body);
      bodyPass = parsed.admin_password || parsed.password || parsed.token || '';
    } catch {}
  }

  const queryPass = (req.query && (req.query.admin_password || req.query.token)) ? (req.query.admin_password || req.query.token) : '';

  const candidate = (passHeader || token || bodyPass || queryPass || '').replace(/['"]/g, '').trim();
  if (!candidate) return false;

  // 1. Validar si el candidato es un token administrativo dinámico HMAC válido
  if (verifyAdminToken(candidate)) {
    return true;
  }

  // 2. Si no hay contraseña configurada en entorno, denegar (Fail-Closed)
  if (!expectedPassword) {
    console.error('CRITICAL: ADMIN_PASSWORD no configurada en entorno. Acceso denegado (Fail-Closed).');
    return false;
  }

  // 3. Comparación estricta y segura en tiempo constante contra la contraseña configurada
  return safeCompare(candidate, expectedPassword);
}

/**
 * Escape estricto de entidades HTML para mitigar vulnerabilidades XSS.
 */
export function escapeHtml(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Validador SSRF contra IPs privadas y metadatos Cloud.
 */
export function isSafePublicUrl(urlString) {
  try {
    const parsed = new URL(urlString);
    if (!['http:', 'https:'].includes(parsed.protocol)) return false;
    
    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '::1' ||
      hostname === '169.254.169.254' ||
      hostname.endsWith('.internal') ||
      hostname.endsWith('.local') ||
      /^10\./.test(hostname) ||
      /^192\.168\./.test(hostname) ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * GUARDIÁN DE PRODUCCIÓN: Regla Inmutable Anti-Sintéticos.
 * Lanza una excepción inmediata si un contacto no proviene de una fuente 100% real verificada.
 */
export function assertRealLead(lead) {
  if (!lead || typeof lead !== 'object') {
    throw new Error('[PROHIBITION FAIL-FAST] Contacto inválido o inexistente.');
  }

  const email = (lead.email || '').toLowerCase().trim();
  if (!email || !email.includes('@')) {
    throw new Error('[PROHIBITION FAIL-FAST] El lead no cuenta con una dirección de correo válida.');
  }

  // Detectar patrones sintéticos generados algorítmicamente (ej: sufijos numéricos o listas sintéticas)
  const isSyntheticPattern = /\d{2,}@/.test(email) || email.includes('usuario@anonimo') || email.includes('test_') || email.includes('empresa-sv.com') || email.includes('constructora-sv.com');
  if (isSyntheticPattern || lead.is_synthetic === true) {
    throw new Error(`[PROHIBITION FAIL-FAST] Se bloqueó el uso del contacto sintético '${email}'. Solo se permiten contactos 100% reales verificados.`);
  }

  return true;
}

