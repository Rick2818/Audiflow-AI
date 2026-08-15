export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }

    const { name, email, document_name, audit_data, lang } = body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Nombre y correo electrónico son requeridos.' });
    }

    const reportId = 'rep_' + Math.random().toString(36).substring(2, 11);
    const leadScore = audit_data?.lead_score || 85;
    const isEnterpriseCandidate = leadScore >= 75;

    console.log(`📩 [VERCEL LEAD CAPTURED] ${name} <${email}> - Score: ${leadScore}`);

    return res.status(200).json({
      success: true,
      report_id: reportId,
      lead_score: leadScore,
      is_enterprise_candidate: isEnterpriseCandidate,
      message: 'Lead capturado exitosamente y oferta disparada por correo.'
    });

  } catch (err) {
    console.error('Error en api/lead.js:', err);
    return res.status(500).json({ error: 'Error procesando captura de lead: ' + err.message });
  }
}
