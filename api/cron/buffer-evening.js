import { BufferPublisher } from '../../lib/buffer-publisher.js';
import { getSocialFeedCloudState, saveSocialFeedCloudState } from '../../lib/cloud-state.js';
import { verifyAdminAuth } from '../../lib/security.js';
import { CONFIG } from '../../lib/config.js';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const REELS_EVENING_TRENDS = {
  1: {
    title: 'Reel Lunes: La Cláusula de $142,000 USD que se le pasó al Abogado',
    hook: '¿Cerrando negociaciones este lunes? Cuidado con el Anexo C...',
    copy: 'Las 3 cláusulas trampa más peligrosas en contratos de proveedores:\n1. Renovación automática sin preaviso.\n2. Ajustes de tarifa sin tope (uncapped).\n3. Responsabilidad solidaria ilimitada.\n\nAudite en 8 segundos con AuditFlow AI:\nhttps://audiflowai.com/?ref=cron-5pm-lunes',
    image: 'https://audiflowai.com/images/redline_forense_clausulas.jpg'
  },
  2: {
    title: 'Reel Martes: 4 Horas de Revisión Manual vs. 8 Segundos de Algoritmo',
    hook: '¿Tu equipo legal sigue revisando contratos de 50 páginas a mano?',
    copy: '4.5 horas de lectura manual = Fatiga y errores.\n8.2 segundos en AuditFlow AI = Detección forense y Redline en Word con control de cambios.\n\nPrueba gratis:\nhttps://audiflowai.com/?ref=cron-5pm-martes',
    image: 'https://audiflowai.com/images/comparativa_eficiencia.jpg'
  },
  3: {
    title: 'Reel Miércoles: Autopsia de una Cláusula de Ajuste Inflacionario',
    hook: 'La cláusula trampa que ningún humano detectó a simple vista...',
    copy: 'Revisar contratos sin una herramienta forense es arriesgar el presupuesto.\nAnálisis de indexación acumulativa no presupuestada.\n\nProteja su empresa:\nhttps://audiflowai.com/?ref=cron-5pm-miercoles',
    image: 'https://audiflowai.com/images/carousel/slide3_inflation.jpg'
  },
  4: {
    title: 'Reel Jueves: El Peligro Oculto de Subir Contratos a IAs Públicas',
    hook: '¿Sabías que subir contratos a IAs públicas puede violar tus acuerdos de confidencialidad?',
    copy: 'AuditFlow AI procesa 100% en memoria RAM volátil:\nAl terminar la auditoría, la sesión se destruye.\nCero retención en disco.\nCumplimiento fiduciario estricto.\n\nhttps://audiflowai.com/?ref=cron-5pm-jueves',
    image: 'https://audiflowai.com/images/post_ig_ciberseguridad.jpg'
  },
  5: {
    title: 'Reel Viernes: Apaga la Computadora con tus Contratos Blindados',
    hook: 'Viernes 5:00 PM: ¿Contratos pendientes para el lunes?',
    copy: 'Termina la semana con la certeza de que ningún contrato firmado te quitará el sueño.\nSube el borrador a AuditFlow AI y descarga tu Redline en Word.\n\nhttps://audiflowai.com/?ref=cron-5pm-viernes',
    image: 'https://audiflowai.com/images/galeria_redline_forense.jpg'
  },
  6: {
    title: 'Reel Sábado: Arquitectura de Privacidad Bancaria',
    hook: 'Seguridad institucional para firmas que no negocian la confidencialidad',
    copy: 'Memoria RAM volátil, purga irreversible y cero reentrenamiento algorítmico.\n\nhttps://audiflowai.com/?ref=cron-5pm-sabado',
    image: 'https://audiflowai.com/images/post_ig_ciberseguridad.jpg'
  },
  0: {
    title: 'Reel Domingo: Estrategia y Visión Contractual',
    hook: 'La ventaja de quienes deciden con certeza fiduciaria',
    copy: 'Inicie la semana con tranquilidad jurídica absoluta.\n\nhttps://audiflowai.com/?ref=cron-5pm-domingo',
    image: 'https://audiflowai.com/images/carousel/slide1_cover.jpg'
  }
};

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

  const timestamp = new Date().toISOString();
  const day = new Date().getDay();
  const trend = REELS_EVENING_TRENDS[day] || REELS_EVENING_TRENDS[1];

  if (req.query?.dryRun === 'true') {
    return res.status(200).json({
      dryRun: true,
      event: 'VERCEL_CRON_BUFFER_5PM_DRY_RUN',
      timestamp,
      day,
      theme: trend.title
    });
  }

  const bufferToken = (process.env.BUFFER_ACCESS_TOKEN || '').trim();
  if (!bufferToken) {
    return res.status(500).json({ success: false, error: 'Falta BUFFER_ACCESS_TOKEN.' });
  }

  const publisher = new BufferPublisher(bufferToken);
  const LI_CHANNEL_ID = '6a97043a065799be4669fadb';
  const IG_CHANNEL_ID = '6a970416065799be4669fa58';
  const FB_CHANNEL_ID = '6a970164065799be4669eea1';

  const fullText = `${trend.hook}\n\n${trend.copy}`;
  const assetsForPost = [{ image: { url: trend.image } }];
  const results = {};

  // 1. LinkedIn
  try {
    const li = await publisher.createPost({
      channelId: LI_CHANNEL_ID,
      text: fullText,
      mode: 'shareNow',
      service: 'linkedin',
      assets: assetsForPost
    });
    results.linkedin = { success: true, id: li?.id || 'OK', skipped: li?.skipped || false };
  } catch (err) {
    results.linkedin = { success: false, error: err.message };
  }

  // 2. Instagram
  try {
    const ig = await publisher.createPost({
      channelId: IG_CHANNEL_ID,
      text: fullText,
      mode: 'shareNow',
      service: 'instagram',
      metadata: { instagram: { type: 'post', shouldShareToFeed: true } },
      assets: assetsForPost
    });
    results.instagram = { success: true, id: ig?.id || 'OK', skipped: ig?.skipped || false };
  } catch (err) {
    results.instagram = { success: false, error: err.message };
  }

  // 3. Facebook
  try {
    const fb = await publisher.createPost({
      channelId: FB_CHANNEL_ID,
      text: fullText,
      mode: 'shareNow',
      service: 'facebook',
      metadata: { facebook: { type: 'post' } },
      assets: assetsForPost
    });
    results.facebook = { success: true, id: fb?.id || 'OK', skipped: fb?.skipped || false };
  } catch (err) {
    results.facebook = { success: false, error: err.message };
  }

  // Persistir en Cloud State
  try {
    const feed = await getSocialFeedCloudState();
    feed.unshift({
      timestamp,
      eventType: 'VERCEL_CRON_BUFFER_5PM_REELS',
      dayOfWeek: day,
      theme: trend.title,
      imageUrls: [trend.image],
      results
    });
    await saveSocialFeedCloudState(feed);
  } catch (e) {
    console.warn('[VercelCron 5PM] Error guardando feed:', e.message);
  }

  return res.status(200).json({
    event: 'VERCEL_CRON_BUFFER_5PM_SUCCESS',
    timestamp,
    day,
    theme: trend.title,
    results
  });
}
