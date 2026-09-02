import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

/**
 * ==============================================================================
 * AUDITFLOW AI — META CONVERSIONS API (CAPI) SERVICE
 * ==============================================================================
 * Envía eventos de conversión server-side a Meta Events Manager con soporte
 * para hashing SHA-256 (email, teléfono), deduplicación y test_event_code.
 * ==============================================================================
 */

const API_VERSION = 'v20.0';
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;

/**
 * Función para hashear datos sensibles en SHA-256 (requerido por Meta)
 */
export function hashSHA256(value) {
  if (!value) return null;
  return crypto.createHash('sha256').update(String(value).trim().toLowerCase()).digest('hex');
}

/**
 * Envía un evento a Conversions API (CAPI)
 * @param {Object} eventData Datos del evento y del usuario
 */
export async function enviarEventoCAPI({
  nombreEvento = 'Lead',
  email,
  telefono,
  ipUsuario,
  userAgent,
  urlOrigen = 'https://audiflowai.com',
  valorUSD = 0,
  moneda = 'USD',
  eventId,
  customData = {}
} = {}) {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;
  const testEventCode = process.env.META_TEST_EVENT_CODE;

  if (!pixelId) {
    throw new Error('Falta META_PIXEL_ID en las variables de entorno (.env).');
  }
  if (!accessToken) {
    throw new Error('Falta META_ACCESS_TOKEN en las variables de entorno (.env).');
  }

  const userData = {
    client_ip_address: ipUsuario || undefined,
    client_user_agent: userAgent || undefined
  };

  if (email) {
    userData.em = [hashSHA256(email)];
  }
  if (telefono) {
    userData.ph = [hashSHA256(telefono)];
  }

  const payload = {
    data: [
      {
        event_name: nombreEvento,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url: urlOrigen,
        event_id: eventId || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        user_data: userData,
        custom_data: {
          currency: moneda,
          value: Number(valorUSD),
          ...customData
        }
      }
    ]
  };

  // Agregar código de prueba si está presente y no es el placeholder genérico
  if (testEventCode && testEventCode !== 'TEST12345') {
    payload.test_event_code = testEventCode;
  }

  console.log(`📡 [Meta CAPI] Enviando evento "${nombreEvento}" a Pixel ID: ${pixelId}...`);

  const response = await fetch(`${BASE_URL}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const resData = await response.json();
  if (!response.ok || resData.error) {
    throw new Error(`Error en CAPI [${nombreEvento}]: ${JSON.stringify(resData.error || resData)}`);
  }

  console.log(`✅ [Meta CAPI] Evento "${nombreEvento}" procesado con éxito. Eventos recibidos: ${resData.events_received || 1}`);
  return resData;
}

export default {
  enviarEventoCAPI,
  hashSHA256
};
