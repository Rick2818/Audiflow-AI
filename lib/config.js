import dotenv from 'dotenv';
dotenv.config();

/**
 * ==============================================================================
 * AUDITFLOW AI - FUENTE UNICA DE VERDAD (SINGLE SOURCE OF TRUTH - SSOT)
 * ==============================================================================
 * Centraliza de forma inmutable todas las cuentas de correo, credenciales,
 * parametros operativos y reglas de enrutamiento dual del sistema.
 */

export const CONFIG = Object.freeze({
  // 1. Enrutamiento Dual de Correos Oficiales
  EMAIL: Object.freeze({
    // Receptor Universal: Leads, Shadow Audits, Soporte, Pixeles de Apertura, Reportes de Crons y Copias de Control
    OWNER_CONTROL: 'tendenciaiatufuturo@gmail.com',

    // Receptor Exclusivo Financiero: Ventas y Pagos Confirmados ($9, $19, $29, $69, $590 USD)
    OWNER_SALES: 'rick28191@gmail.com',

    // Remitente Autenticado SMTP (Gmail Relay)
    SMTP_USER: (process.env.GMAIL_USER || 'rick28191@gmail.com').trim(),
    SMTP_PASS: (process.env.GMAIL_APP_PASSWORD || 'fbqiyqmapqplbcim').replace(/\s+/g, '').trim(),
    
    // Remitente Corporativo Transaccional (Resend API)
    RESEND_API_KEY: (process.env.RESEND_API_KEY || '').trim(),
    FROM_TRANSACTIONAL: (process.env.EMAIL_FROM || '"Ricardo | AuditFlow AI" <ricardo@audiflowai.com>').trim(),
    FROM_OUTREACH: '"AuditFlow AI | Auditoría Corporativa" <ricardo@audiflowai.com>',
    FROM_SALES: '"AuditFlow AI | Sistema de Ventas" <rick28191@gmail.com>',
    REPLY_TO_CONTROL: 'tendenciaiatufuturo@gmail.com',
  }),

  // 2. Seguridad y Autenticacion Administrativa
  SECURITY: Object.freeze({
    ADMIN_PASSWORD: (process.env.ADMIN_PASSWORD || 'AuditFlow2026!').trim(),
    RATE_LIMIT_MAX_ATTEMPTS: 15,
    RATE_LIMIT_WINDOW_MS: 60000,
  }),

  // 3. URLs del Ecosistema
  URLS: Object.freeze({
    APP_URL: (process.env.APP_URL || 'https://audiflowai.com').trim(),
    VIDEO_URL: 'https://audiflowai.com/video',
    ADMIN_URL: 'https://audiflowai.com/admin',
  }),

  // 4. Pasarelas de Pago
  PAYMENTS: Object.freeze({
    LIGHTNING_ADDRESS: (process.env.LIGHTNING_ADDRESS || 'rick28@strike.me').trim(),
    STRIPE_SECRET_KEY: (process.env.STRIPE_SECRET_KEY || '').trim(),
  }),

  // 5. Base de Datos Supabase
  SUPABASE: Object.freeze({
    URL: (process.env.SUPABASE_URL || '').trim(),
    KEY: (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '').trim(),
  })
});

/**
 * Validador Estricto de Entorno (Fail-Fast).
 * Lanza una excepcion inmediata si alguna variable o direccion critica no cumple con el estandar.
 */
export function validateSystemConfig() {
  const errors = [];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(CONFIG.EMAIL.OWNER_CONTROL)) {
    errors.push(`CONFIG.EMAIL.OWNER_CONTROL es invalido: ${CONFIG.EMAIL.OWNER_CONTROL}`);
  }
  if (CONFIG.EMAIL.OWNER_CONTROL !== 'tendenciaiatufuturo@gmail.com') {
    errors.push(`CONFIG.EMAIL.OWNER_CONTROL debe ser estrictamente 'tendenciaiatufuturo@gmail.com', recibido: ${CONFIG.EMAIL.OWNER_CONTROL}`);
  }

  if (!emailRegex.test(CONFIG.EMAIL.OWNER_SALES)) {
    errors.push(`CONFIG.EMAIL.OWNER_SALES es invalido: ${CONFIG.EMAIL.OWNER_SALES}`);
  }
  if (CONFIG.EMAIL.OWNER_SALES !== 'rick28191@gmail.com') {
    errors.push(`CONFIG.EMAIL.OWNER_SALES debe ser estrictamente 'rick28191@gmail.com', recibido: ${CONFIG.EMAIL.OWNER_SALES}`);
  }

  if (!CONFIG.EMAIL.SMTP_USER || !CONFIG.EMAIL.SMTP_PASS) {
    errors.push('Credenciales SMTP incompletas.');
  }

  if (!CONFIG.SECURITY.ADMIN_PASSWORD || CONFIG.SECURITY.ADMIN_PASSWORD.length < 8) {
    errors.push('ADMIN_PASSWORD no configurada o demasiado corta.');
  }

  if (errors.length > 0) {
    const errorMsg = `[FAIL-FAST CRITICAL ERROR] Fallo en la validacion del sistema:\n` + errors.map(e => `  [ERROR] ${e}`).join('\n');
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  return true;
}

try {
  validateSystemConfig();
} catch (e) {
  console.warn(e.message);
}
