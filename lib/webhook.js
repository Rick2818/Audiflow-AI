import { verifyAdminAuth, checkRateLimit, isSafePublicUrl, setStrictCors } from './security.js';

export default async function handler(req, res) {
  // CORREGIDO (2026-09-17) — VULNERABILIDAD CRÍTICA SSRF:
  // este endpoint era público (CORS '*'), sin autenticación, y hacía un
  // fetch() del servidor hacia cualquier `target_url` que enviara el
  // cliente (solo validaba que empezara con "http"). Un atacante podía
  // usarlo para escanear/atacar la red interna, alcanzar endpoints de
  // metadatos de la nube (169.254.169.254) o servicios en localhost, y
  // usar el servidor como proxy de ataque hacia terceros. Ahora se exige
  // autenticación de administrador y se valida la URL contra IPs privadas
  // / metadatos con isSafePublicUrl(), además de rate limiting.
  setStrictCors(req, res, 'GET, POST, OPTIONS', 'Content-Type, Authorization, x-admin-password, x-webhook-signature');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const clientIp = (req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket?.remoteAddress || '127.0.0.1').toString().split(',')[0].trim();
  if (!checkRateLimit('webhook_' + clientIp, 20, 60000).allowed) {
    return res.status(429).json({ success: false, error: 'Demasiadas solicitudes. Intente más tarde.' });
  }

  try {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    const { event = 'audit.completed', payload = {}, target_url } = body;

    // Disparar Webhook Saliente si se especifica target_url (requiere admin + URL pública segura)
    if (target_url) {
      if (!verifyAdminAuth(req)) {
        return res.status(401).json({ success: false, error: 'No autorizado para disparar webhooks salientes a target_url.' });
      }
      if (!isSafePublicUrl(target_url)) {
        return res.status(400).json({ success: false, error: 'target_url inválida o apunta a un destino no permitido (IP privada / metadatos).' });
      }
      try {
        const webhookRes = await fetch(target_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'User-Agent': 'AuditFlow-AI-Webhook/2.0' },
          body: JSON.stringify({
            event,
            timestamp: new Date().toISOString(),
            data: payload
          })
        });
        return res.status(200).json({
          success: true,
          message: `Webhook disparado exitosamente a ${target_url}`,
          status_code: webhookRes.status
        });
      } catch (err) {
        return res.status(500).json({ success: false, error: `Error conectando con target_url: ${err.message}` });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Evento de Webhook AuditFlow AI recibido en servidor',
      received_at: new Date().toISOString(),
      event,
      payload
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
