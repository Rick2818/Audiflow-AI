import bufferMorningHandler from '../lib/cron-handlers/buffer-morning.js';
import bufferEveningHandler from '../lib/cron-handlers/buffer-evening.js';
import storytellingHandler from '../lib/cron-handlers/storytelling.js';
import nordicSowerHandler from '../lib/cron-handlers/nordic-sower.js';
import { getCloudState, setCloudState } from '../lib/cloud-state.js';
import { verifyAdminAuth } from '../lib/security.js';
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
  const isTokenAuth = tokenCandidate === (process.env.ADMIN_PASSWORD || 'AuditFlow2026!');
  const isAuthorized = isVercelCron || isTokenAuth || verifyAdminAuth(req);

  if (!isAuthorized) {
    return res.status(401).json({ success: false, error: 'No autorizado.' });
  }

  const now = new Date();
  const utcHours = now.getUTCHours();
  const utcDay = now.getUTCDay();
  const timestamp = now.toISOString();

  // Permite forzar una tarea específica via querystring: ?task=buffer-morning
  const forcedTask = req.query?.task || null;
  const isDryRun = req.query?.dryRun === 'true';

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

  if (isDryRun) {
    return res.status(200).json({
      event: 'MASTER_DISPATCHER_DRY_RUN',
      timestamp,
      utcHours,
      cstHours: (utcHours - 6 + 24) % 24,
      utcDay,
      selectedTask: taskToExecute,
      scheduleReason
    });
  }

  // Ejecución según la tarea detectada
  try {
    if (taskToExecute === 'buffer-morning') {
      return await bufferMorningHandler(req, res);
    } else if (taskToExecute === 'buffer-evening') {
      return await bufferEveningHandler(req, res);
    } else if (taskToExecute === 'storytelling') {
      return await storytellingHandler(req, res);
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

