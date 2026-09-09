import fs from 'fs';
import path from 'path';

/**
 * ==============================================================================
 * AUDITFLOW AI — SISTEMA CENTRALIZADO DE SUPRESIÓN Y PURGA DE REBOTES (SSOT)
 * ==============================================================================
 * Bloquea permanentemente cualquier correo rebotado o con sintaxis defectuosa
 * para que ningún motor de envío de AuditFlow AI intente contactarlo de nuevo.
 * Protege la reputación del dominio audiflowai.com y blinda el buzón del CEO.
 * ==============================================================================
 */

const SUPPRESSION_FILE = path.resolve('suppressed_bounced_emails.json');
const BOUNCE_LOG_FILE = path.resolve('bounces_and_invalid_leads.log');

// Inicializar lista base conocida de rebotes
const INITIAL_SUPPRESSED = [
  'jesper.lundgren@lundgrens.dk',
  'morales.alejandro@moralescordero.es',
  'rivas.fernando@rivaspineda.sv',
  'guzman.camila@guzmanviteri.co',
  'salgado.roberto@salgadomiranda.mx',
  'batalla.mariano@batallalegal.cr',
  'ortega.gabriel@ortegacarranza.pa',
  'salazar.valeria@salazaribarra.cl',
  'mendoza.carlos@mendozavillegas.pe',
  'pacheco.hugo@pachecobenitez.gt'
];

export function getSuppressedEmails() {
  try {
    if (!fs.existsSync(SUPPRESSION_FILE)) {
      fs.writeFileSync(SUPPRESSION_FILE, JSON.stringify(INITIAL_SUPPRESSED, null, 2), 'utf8');
      return new Set(INITIAL_SUPPRESSED.map(e => e.toLowerCase().trim()));
    }
    const raw = fs.readFileSync(SUPPRESSION_FILE, 'utf8');
    const list = JSON.parse(raw);
    return new Set(list.map(e => (typeof e === 'string' ? e : e.email || '').toLowerCase().trim()).filter(Boolean));
  } catch (err) {
    console.warn('[BounceSuppression] Error al leer lista de supresión:', err.message);
    return new Set(INITIAL_SUPPRESSED.map(e => e.toLowerCase().trim()));
  }
}

export function isBounced(email) {
  if (!email || typeof email !== 'string') return true;
  const clean = email.toLowerCase().trim();
  const suppressed = getSuppressedEmails();
  return suppressed.has(clean);
}

export function addBouncedEmail(email, reason = 'DELIVERY_STATUS_NOTIFICATION_FAILURE') {
  if (!email || typeof email !== 'string') return;
  const clean = email.toLowerCase().trim();
  const suppressed = getSuppressedEmails();

  if (!suppressed.has(clean)) {
    suppressed.add(clean);
    const list = Array.from(suppressed);
    fs.writeFileSync(SUPPRESSION_FILE, JSON.stringify(list, null, 2), 'utf8');
    
    // Registrar en bitácora de auditoría
    const logLine = `[${new Date().toISOString()}] REBOTE_BLOQUEADO: ${clean} | Razón: ${reason}\n`;
    fs.appendFileSync(BOUNCE_LOG_FILE, logLine, 'utf8');
    console.log(`🚫 [BOUNCE SUPPRESSED] Correo bloqueado de por vida: ${clean} (${reason})`);
  }
}

export function filterActiveLeads(leads, emailProperty = 'email') {
  const suppressed = getSuppressedEmails();
  return leads.filter(item => {
    const email = (item[emailProperty] || '').toLowerCase().trim();
    if (!email) return false;
    // Validar formato RFC básico
    const isValidFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidFormat) return false;
    // Descartar si está en la lista negra
    return !suppressed.has(email);
  });
}
