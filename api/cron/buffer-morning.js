import { BufferPublisher } from '../../lib/buffer-publisher.js';
import { getDailyBufferSchedule } from '../../lib/buffer-content-calendar.js';
import { getSocialFeedCloudState, saveSocialFeedCloudState } from '../../lib/cloud-state.js';
import { verifyAdminAuth } from '../../lib/security.js';
import { CONFIG } from '../../lib/config.js';
import { Resend } from 'resend';
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
    return res.status(401).json({
      success: false,
      error: 'No autorizado. Se requiere autorización de Vercel Cron o token admin (?token=AuditFlow2026!).'
    });
  }

  const timestamp = new Date().toISOString();
  const day = new Date().getDay();
  const trend = getDailyBufferSchedule(day);

  if (req.query?.dryRun === 'true') {
    return res.status(200).json({
      dryRun: true,
      event: 'VERCEL_CRON_BUFFER_8AM_DRY_RUN',
      timestamp,
      day,
      theme: trend.title,
      format: trend.format
    });
  }

  const bufferToken = (process.env.BUFFER_ACCESS_TOKEN || '').trim();
  if (!bufferToken) {
    return res.status(500).json({
      success: false,
      error: 'Falta BUFFER_ACCESS_TOKEN en las variables de entorno de Vercel.'
    });
  }

  const publisher = new BufferPublisher(bufferToken);
  const LI_CHANNEL_ID = '6a97043a065799be4669fadb';
  const FB_CHANNEL_ID = '6a970164065799be4669eea1';
  const IG_CHANNEL_ID = '6a970416065799be4669fa58';

  const hasImage = Boolean(trend.image);
  const assetsForPost = hasImage ? [{ image: { url: trend.image } }] : [];
  const results = {};

  // 1. LinkedIn (Prioridad #1)
  try {
    const li = await publisher.createPost({
      channelId: LI_CHANNEL_ID,
      text: trend.copy,
      mode: 'shareNow',
      service: 'linkedin',
      assets: assetsForPost
    });
    results.linkedin = { success: true, id: li?.id || 'OK', skipped: li?.skipped || false };
  } catch (err) {
    results.linkedin = { success: false, error: err.message };
  }

  // 2. Facebook
  try {
    const fb = await publisher.createPost({
      channelId: FB_CHANNEL_ID,
      text: trend.copy,
      mode: 'shareNow',
      service: 'facebook',
      metadata: { facebook: { type: 'post' } },
      assets: assetsForPost
    });
    results.facebook = { success: true, id: fb?.id || 'OK', skipped: fb?.skipped || false };
  } catch (err) {
    results.facebook = { success: false, error: err.message };
  }

  // 3. Instagram
  try {
    const igAssets = assetsForPost.length > 0 ? assetsForPost : [{
      image: { url: 'https://audiflowai.com/images/carousel/slide1_cover.jpg' }
    }];
    const ig = await publisher.createPost({
      channelId: IG_CHANNEL_ID,
      text: trend.copy,
      mode: 'shareNow',
      service: 'instagram',
      metadata: { instagram: { type: 'post', shouldShareToFeed: true } },
      assets: igAssets
    });
    results.instagram = { success: true, id: ig?.id || 'OK', skipped: ig?.skipped || false };
  } catch (err) {
    results.instagram = { success: false, error: err.message };
  }

  // Persistir en Cloud State (Supabase + local)
  try {
    const feed = await getSocialFeedCloudState();
    feed.unshift({
      timestamp,
      eventType: 'VERCEL_CRON_BUFFER_8AM',
      dayOfWeek: day,
      theme: trend.title,
      imageUrls: hasImage ? [trend.image] : [],
      results
    });
    await saveSocialFeedCloudState(feed);
  } catch (e) {
    console.warn('[VercelCron] Advertencia guardando feed:', e.message);
  }

  // Telemetría por correo
  const resendKey = process.env.RESEND_API_KEY || CONFIG.EMAIL?.RESEND_API_KEY;
  if (resendKey) {
    try {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: 'Directora de Marketing | AuditFlow AI <cmvo@audiflowai.com>',
        to: CONFIG.EMAIL?.OWNER_CONTROL || 'tendenciaiatufuturo@gmail.com',
        subject: `[Vercel Cron 8:00 AM] Publicación Buffer: ${results.linkedin?.success ? 'OK' : 'Atención'}`,
        html: `<p>Ejecutado desde Vercel Cloud Serverless Cron.</p><p>Tema: <strong>${trend.title}</strong></p><pre>${JSON.stringify(results, null, 2)}</pre>`
      });
    } catch (_) {}
  }

  return res.status(200).json({
    event: 'VERCEL_CRON_BUFFER_8AM_SUCCESS',
    timestamp,
    day,
    theme: trend.title,
    results
  });
}
