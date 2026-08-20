export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-password, x-webhook-signature');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    const { event = 'audit.completed', payload = {}, target_url } = body;

    // Disparar Webhook Saliente si se especifica target_url
    if (target_url && target_url.startsWith('http')) {
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
