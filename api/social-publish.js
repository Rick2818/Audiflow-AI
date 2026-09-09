import { BufferPublisher } from '../lib/buffer-publisher.js';
import { getDailyBufferSchedule } from '../lib/buffer-content-calendar.js';
import { verifyAdminAuth } from '../lib/security.js';

/**
 * ==============================================================================
 * AUDITFLOW AI — CLOUD SERVERLESS SOCIAL ENGINE (BUFFER INTEGRATION)
 * ==============================================================================
 * Se ejecuta automáticamente en Vercel Serverless para programar y publicar posts.
 * Conectado con Buffer API GraphQL (LinkedIn, Facebook, Instagram) y el
 * Calendario Maestro de 7 Días sin Repetición (Lunes: Reel, Martes: Texto, etc.)
 * ==============================================================================
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-password');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const timestamp = new Date().toISOString();
  const day = new Date().getDay();
  const scheduledItem = getDailyBufferSchedule(day);

  const bufferToken = (process.env.BUFFER_ACCESS_TOKEN || '').trim();
  const publisher = bufferToken ? new BufferPublisher(bufferToken) : null;

  const isVercelCron = Boolean(
    req.headers['x-vercel-cron'] === '1' ||
    (req.headers['user-agent'] || '').includes('vercel-cron')
  );
  const tokenCandidate = req.query?.token || req.query?.admin_password || '';
  const isTokenAuth = tokenCandidate === (process.env.ADMIN_PASSWORD || 'AuditFlow2026!');
  const isAuthorized = isVercelCron || isTokenAuth || verifyAdminAuth(req);

  // 1. Manejo del Cron Diario en la Nube (Vercel Cloud Cron / External Webhook Cron)
  if (req.method === 'GET' || req.query?.action === 'daily_cron_dispatch') {
    if (!isAuthorized) {
      return res.status(401).json({
        success: false,
        error: 'No autorizado. Se requiere autenticación de administrador, token secreto o Vercel Cron.',
        hint: 'Use ?token=AuditFlow2026! o configure el header x-vercel-cron.'
      });
    }

    if (!publisher) {
      console.warn('⚠️ [Buffer Cloud Cron] BUFFER_ACCESS_TOKEN no está configurado en Vercel.');
      return res.status(200).json({
        event: 'CLOUD_CRON_SOCIAL_DISPATCH',
        success: false,
        timestamp,
        status: 'BUFFER_ACCESS_TOKEN_MISSING',
        error: 'Falta configurar la variable BUFFER_ACCESS_TOKEN en Vercel Dashboard -> Settings -> Environment Variables.',
        theme: scheduledItem.title,
        day: scheduledItem.dayName
      });
    }

    const LI_CHANNEL_ID = '6a97043a065799be4669fadb'; // Prioridad #1 (LinkedIn Company Page)
    const FB_CHANNEL_ID = '6a970164065799be4669eea1'; // Facebook Page
    const IG_CHANNEL_ID = '6a970416065799be4669fa58'; // Instagram

    const hasImage = Boolean(scheduledItem.image);
    const assetsForPost = hasImage ? [{ image: { url: scheduledItem.image } }] : [];
    const dispatchResults = {};

    // 1. LinkedIn (Prioridad Absoluta)
    try {
      const liRes = await publisher.createPost({
        channelId: LI_CHANNEL_ID,
        text: scheduledItem.copy,
        mode: 'shareNow',
        assets: assetsForPost,
        service: 'linkedin'
      });
      dispatchResults.linkedin = { success: true, id: liRes?.id || 'OK', skipped: liRes?.skipped || false };
    } catch (liErr) {
      dispatchResults.linkedin = { success: false, error: liErr.message };
    }

    // 2. Facebook
    try {
      const fbRes = await publisher.createPost({
        channelId: FB_CHANNEL_ID,
        text: scheduledItem.copy,
        mode: 'shareNow',
        assets: assetsForPost,
        service: 'facebook'
      });
      dispatchResults.facebook = { success: true, id: fbRes?.id || 'OK', skipped: fbRes?.skipped || false };
    } catch (fbErr) {
      dispatchResults.facebook = { success: false, error: fbErr.message };
    }

    // 3. Instagram (requiere asset de imagen)
    if (hasImage) {
      try {
        const igRes = await publisher.createPost({
          channelId: IG_CHANNEL_ID,
          text: scheduledItem.copy,
          mode: 'shareNow',
          assets: assetsForPost,
          service: 'instagram'
        });
        dispatchResults.instagram = { success: true, id: igRes?.id || 'OK', skipped: igRes?.skipped || false };
      } catch (igErr) {
        dispatchResults.instagram = { success: false, error: igErr.message };
      }
    } else {
      dispatchResults.instagram = { success: true, skipped: true, reason: 'TEXT_ONLY_POST' };
    }

    const overallSuccess = Object.values(dispatchResults).some(r => r.success && !r.skipped);

    return res.status(200).json({
      event: 'CLOUD_CRON_SOCIAL_DISPATCH',
      success: overallSuccess,
      timestamp,
      day: scheduledItem.dayName,
      format: scheduledItem.format,
      theme: scheduledItem.title,
      results: dispatchResults
    });
  }

  // 2. Despacho por POST desde agentes
  if (req.method === 'POST') {
    if (!isAuthorized) {
      return res.status(401).json({ success: false, error: 'No autorizado.' });
    }

    const { content, channelId, service, assets, mode = 'shareNow' } = req.body || {};

    if (!publisher) {
      return res.status(500).json({ success: false, error: 'BUFFER_ACCESS_TOKEN no configurado en el servidor.' });
    }

    if (!channelId || !content) {
      return res.status(400).json({ success: false, error: 'Faltan channelId o content en el body.' });
    }

    try {
      const publishedPost = await publisher.createPost({
        channelId,
        text: content,
        mode,
        assets: assets || [],
        service: service || null
      });

      return res.status(200).json({
        success: true,
        mode: 'BUFFER_API_CONNECTED',
        publishedPost,
        timestamp,
        message: 'Publicación procesada exitosamente en Buffer.'
      });
    } catch (pErr) {
      return res.status(500).json({ success: false, error: pErr.message });
    }
  }

  return res.status(405).json({ error: 'Método no soportado.' });
}
