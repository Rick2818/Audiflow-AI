import { runCentroamerica8AMDispatch } from '../../scripts/dispatch_centroamerica_8am_cron.mjs';
import { verifyAdminAuth, safeCompare } from '../security.js';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-password, x-vercel-cron');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const isVercelCron = Boolean(
    req.headers['x-vercel-cron'] === '1' ||
    (req.headers['user-agent'] || '').includes('vercel-cron')
  );
  const tokenCandidate = req.query?.token || req.query?.admin_password || '';
  // CORREGIDO (2026-09-17): sin fallback hardcodeado y comparacion en tiempo constante.
  const adminPasswordEnv = (process.env.ADMIN_PASSWORD || '').trim();
  const isTokenAuth = Boolean(adminPasswordEnv) && safeCompare(String(tokenCandidate), adminPasswordEnv);
  const isAuthorized = isVercelCron || isTokenAuth || verifyAdminAuth(req);

  if (!isAuthorized) {
    return res.status(401).json({ success: false, error: 'No autorizado.' });
  }

  try {
    const result = await runCentroamerica8AMDispatch();
    return res.status(200).json({
      success: true,
      event: 'CENTROAMERICA_7AM_CLOUD_DISPATCH_COMPLETE',
      timestamp: new Date().toISOString(),
      ...result
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
