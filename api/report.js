export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = req.url || '';
  const reportId = url.split('/').pop().split('?')[0] || req.query?.id || 'rep_active';

  return res.status(200).json({
    success: true,
    report_id: reportId,
    status: 'unlocked',
    message: 'Reporte activo en memoria RAM volátil',
    timestamp: new Date().toISOString()
  });
}
