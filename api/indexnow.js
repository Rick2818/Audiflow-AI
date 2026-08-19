export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-password');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const host = 'audiflowai.com';
    const key = 'auditflow2026indexnowkey';
    const urlList = [
      'https://audiflowai.com/',
      'https://audiflowai.com/auditar-contrato-arrendamiento',
      'https://audiflowai.com/auditar-factura-proveedor',
      'https://audiflowai.com/auditar-contrato-servicios-it'
    ];

    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key,
        keyLocation: `https://${host}/auditflow2026indexnow.txt`,
        urlList
      })
    });

    return res.status(200).json({
      success: response.ok,
      status: response.status,
      urls_submitted: urlList.length,
      urls: urlList,
      message: response.ok 
        ? 'Notificación de indexación enviada exitosamente a los motores IndexNow (Bing, Yandex, Seznam)' 
        : 'Respuesta IndexNow API: ' + response.status
    });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
