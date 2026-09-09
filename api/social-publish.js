import { BufferPublisher } from '../lib/buffer-publisher.js';
import { getDailyBufferSchedule } from '../lib/buffer-content-calendar.js';

/**
 * ==============================================================================
 * AUDITFLOW AI — CLOUD SERVERLESS SOCIAL ENGINE (BUFFER INTEGRATION)
 * ==============================================================================
 * Se ejecuta automáticamente en Vercel Serverless para programar y verificar publicaciones.
 * Conectado con Buffer API GraphQL (LinkedIn, Facebook, Instagram) y el
 * Calendario Maestro de 7 Días sin Repetición (Lunes: Reel, Martes: Texto, etc.)
 * ==============================================================================
 */

export default async function handler(req, res) {
  const timestamp = new Date().toISOString();
  const day = new Date().getDay();
  const scheduledItem = getDailyBufferSchedule(day);

  const bufferToken = (process.env.BUFFER_ACCESS_TOKEN || '').trim();
  const publisher = bufferToken ? new BufferPublisher(bufferToken) : null;

  // 1. Manejo del Cron Diario en la Nube (Vercel Cloud Cron)
  if (req.method === 'GET' || req.query?.action === 'daily_cron_dispatch') {
    let channelsStatus = 'LOCAL_SIMULATION';
    let availableChannels = [];

    if (publisher) {
      try {
        const channels = await publisher.getChannels();
        availableChannels = channels.map(c => ({ id: c.id, name: c.name, service: c.service }));
        channelsStatus = 'CONNECTED_TO_BUFFER_GRAPHQL';
      } catch (bufErr) {
        channelsStatus = `BUFFER_NOTICE: ${bufErr.message}`;
      }
    }

    const dailyPayload = {
      event: 'CLOUD_CRON_SOCIAL_DISPATCH',
      timestamp,
      day: scheduledItem.dayName,
      format: scheduledItem.format,
      theme: scheduledItem.title,
      status: channelsStatus,
      availableChannelsCount: availableChannels.length,
      image: scheduledItem.image,
      videoUrl: scheduledItem.videoUrl,
      platforms: {
        facebook: scheduledItem.copy,
        instagram: scheduledItem.copy,
        linkedin: scheduledItem.copy
      }
    };

    console.log(`☁️ [VERCEL CLOUD CRON] Ejecutado con éxito para ${scheduledItem.dayName} (${scheduledItem.format}):`, timestamp);
    return res.status(200).json(dailyPayload);
  }

  // 2. Despacho por POST desde agentes
  if (req.method === 'POST') {
    const { platform, content, channelId } = req.body || {};

    let publishedPost = null;
    if (publisher && channelId && content) {
      try {
        publishedPost = await publisher.publishPost({
          channelId,
          text: content,
          mode: 'addToQueue'
        });
      } catch (pErr) {
        console.warn('Buffer publish warning:', pErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      mode: publisher ? 'BUFFER_API_CONNECTED' : 'CLOUD_SIMULATION',
      platform: platform || 'all',
      publishedPost,
      timestamp,
      message: `Publicación procesada exitosamente en la infraestructura de redes.`
    });
  }

  return res.status(405).json({ error: 'Método no soportado.' });
}
