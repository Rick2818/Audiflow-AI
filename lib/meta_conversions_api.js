import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

/**
 * ==============================================================================
 * AUDITFLOW AI — META CONVERSIONS API (CAPI) SERVICE
 * ==============================================================================
 * Envía eventos de conversión server-side a Meta Events Manager con soporte
 * para hashing SHA-256 (email, teléfono), deduplicación de eventos y test_event_code.
 * ==============================================================================
 */

const API_VERSION = 'v20.0';
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;

function hashValue(value) {
  if (!value) return null;
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

/**
 * Envía un evento a Meta Conversions API
 * @param {Object} eventData Datos del evento
 * @returns {Promise<Object>}
 */
export async function sendMetaConversionEvent(eventData) {
  const pixelId = eventData.pixelId || process.env.META_PIXEL_ID;
  const accessToken = eventData.accessToken || process.env.META_ACCESS_TOKEN;
  const testEventCode = eventData.testEventCode || process.env.META_TEST_EVENT_CODE;

  if (!pixelId) {
    throw new Error('Falta META_PIXEL_ID para enviar eventos a Conversions API.');
  }
  if (!accessToken) {
    throw new Error('Falta META_ACCESS_TOKEN para autenticar con Conversions API.');
  }

  const {
    eventName, // 'Lead', 'PageView', 'InitiateCheckout', 'Purchase', 'CompleteRegistration', etc.
    eventTime = Math.floor(Date.now() / 1000),
    eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    eventSourceUrl = 'https://audiflowai.com',
    userData = {},
    customData = {}
  } = eventData;

  const formattedUserData = {
    client_ip_address: userData.ip || null,
    client_user_agent: userData.userAgent || null
  };

  if (userData.email) {
    formattedUserData.em = [hashValue(userData.email)];
  }
  if (userData.phone) {
    formattedUserData.ph = [hashValue(userData.phone)];
  }
  if (userData.firstName) {
    formattedUserData.fn = [hashValue(userData.firstName)];
  }
  if (userData.lastName) {
    formattedUserData.ln = [hashValue(userData.lastName)];
  }
  if (userData.country) {
    formattedUserData.country = [hashValue(userData.country)];
  }

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: eventTime,
        event_id: eventId,
        event_source_url: eventSourceUrl,
        action_source: 'website',
        user_data: formattedUserData,
        custom_data: customData
      }
    ]
  };

  if (testEventCode && testEventCode !== 'TEST12345') {
    payload.test_event_code = testEventCode;
  }

  const url = `${BASE_URL}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (!response.ok || result.error) {
      throw new Error(`Error en CAPI [${eventName}]: ${JSON.stringify(result.error || result)}`);
    }

    return {
      success: true,
      eventsReceived: result.events_received,
      fbtraceId: result.fbtrace_id,
      eventId
    };
  } catch (error) {
    console.error('❌ Error enviando evento a Meta CAPI:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

export default {
  sendMetaConversionEvent
};
