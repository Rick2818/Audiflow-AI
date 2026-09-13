import bufferMorningHandler from '../lib/cron-handlers/buffer-morning.js';
import bufferEveningHandler from '../lib/cron-handlers/buffer-evening.js';
import storytellingHandler from '../lib/cron-handlers/storytelling.js';
import nordicSowerHandler from '../lib/cron-handlers/nordic-sower.js';
import centroamericaSowerHandler from '../lib/cron-handlers/centroamerica-sower.js';
import socialPublishHandler from '../lib/social-publish.js';
import { getCloudState, setCloudState } from '../lib/cloud-state.js';
import { verifyAdminAuth, safeCompare, setStrictCors } from '../lib/security.js';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req, res) {
  setStrictCors(req, res, 'GET, POST, OPTIONS', 'Content-Type, Authorization, x-admin-password');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const authHeader = req.headers ? (req.headers['authorization'] || req.headers['Authorization'] || '') : '';
  const cronSecret = (process.env.CRON_SECRET || process.env.ADMIN_PASSWORD || '').trim();
  const isVercelCron = Boolean(cronSecret && authHeader && safeCompare(authHeader, `Bearer ${cronSecret}`));
  const isAuthorized = isVercelCron || verifyAdminAuth(req);

  if (!isAuthorized) {
    return res.status(401).json({ success: false, error: 'No autorizado. Se requiere autorización de Vercel Cron o token de administrador.' });
  }

  const now = new Date();
  const utcHours = now.getUTCHours();
  const utcDay = now.getUTCDay();
  const timestamp = now.toISOString();

  // Permite forzar una tarea específica via querystring: ?task=buffer-morning
  const forcedTask = req.query?.task || null;

  let taskToExecute = forcedTask;
  let scheduleReason = 'Manual / Query Override';

  if (!taskToExecute) {
    // 10:00 UTC = 04:00 AM CST (Lunes a Viernes) -> Siembra Nórdica
    if (utcHours === 10 && utcDay >= 1 && utcDay <= 5) {
      taskToExecute = 'nordic-sower';
      scheduleReason = '04:00 AM CST (10:00 UTC) - Siembra Nórdicos';
    }
    // 12:00 UTC = 06:00 AM CST (Lunes a Sábado) -> Storytelling
    else if (utcHours === 12 && utcDay >= 1 && utcDay <= 6) {
      taskToExecute = 'storytelling';
      scheduleReason = '06:00 AM CST (12:00 UTC) - Storytelling Bufetes';
    }
    // 13:00 UTC = 07:00 AM CST (Lunes a Viernes) -> Prospección Centroamérica
    else if (utcHours === 13 && utcDay >= 1 && utcDay <= 5) {
      taskToExecute = 'centroamerica-sower';
      scheduleReason = '07:00 AM CST (13:00 UTC) - Prospección Centroamérica Bufetes y CFOs';
    }
    // 14:00 UTC = 08:00 AM CST (Lunes a Domingo) -> Buffer Morning
    else if (utcHours === 14) {
      taskToExecute = 'buffer-morning';
      scheduleReason = '08:00 AM CST (14:00 UTC) - Buffer Social Matutino';
    }
    // 23:00 UTC = 05:00 PM CST (Lunes a Domingo) -> Buffer Evening Reels
    else if (utcHours === 23) {
      taskToExecute = 'buffer-evening';
      scheduleReason = '05:00 PM CST (23:00 UTC) - Buffer Social Vespertino Reels';
    }
    else {
      taskToExecute = 'heartbeat';
      scheduleReason = `Sin tarea asignada para la hora ${utcHours}:00 UTC (${(utcHours - 6 + 24) % 24}:00 CST)`;
    }
  }

  // Ejecución según la tarea detectada
  try {
    if (taskToExecute === 'social-publish' || (req.url && req.url.includes('social-publish'))) {
      return await socialPublishHandler(req, res);
    } else if (taskToExecute === 'buffer-morning') {
      return await bufferMorningHandler(req, res);
    } else if (taskToExecute === 'buffer-evening') {
      return await bufferEveningHandler(req, res);
    } else if (taskToExecute === 'storytelling') {
      return await storytellingHandler(req, res);
    } else if (taskToExecute === 'centroamerica-sower') {
      return await centroamericaSowerHandler(req, res);
    } else if (taskToExecute === 'nordic-sower') {
      return await nordicSowerHandler(req, res);
    } else {
      // Heartbeat: confirma que la nube está viva
      await setCloudState('master_dispatcher_heartbeat', {
        lastPing: timestamp,
        utcHours,
        status: 'OK'
      });
      return res.status(200).json({
        event: 'MASTER_DISPATCHER_HEARTBEAT_OK',
        timestamp,
        utcHours,
        cstHours: (utcHours - 6 + 24) % 24,
        scheduleReason,
        status: 'CLOUD_OPERATIONAL_24_7'
      });
    }
  } catch (err) {
    return res.status(500).json({
      event: 'MASTER_DISPATCHER_ERROR',
      timestamp,
      task: taskToExecute,
      error: err.message
    });
  }
}

