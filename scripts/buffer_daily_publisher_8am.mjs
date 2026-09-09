import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { BufferPublisher } from '../lib/buffer-publisher.js';
import { CONFIG } from '../lib/config.js';
import { getDailyBufferSchedule } from '../lib/buffer-content-calendar.js';
import { Resend } from 'resend';

dotenv.config();

/**
 * ==============================================================================
 * AUDITFLOW AI — PUBLICADOR MATUTINO EN BUFFER (8:00 AM CST — LUNES A DOMINGO)
 * ==============================================================================
 * PARRILLA MAESTRA DE 7 DÍAS SIN REPETICIÓN (APROBADA POR DON RICARDO):
 *  - Lunes: Reel / Video (Caso $142k USD)
 *  - Martes: Texto Puro (CFO Briefing - Fuga de EBITDA)
 *  - Miércoles: Post con Imagen (Comparativa 4.5 Horas vs 8 Segundos)
 *  - Jueves: Reel / Video (Autopsia Cláusulas de Indexación)
 *  - Viernes: Texto Puro (Cierre de Semana sin Pasivos Ocultos)
 *  - Sábado: Post con Imagen (Seguridad RAM Volátil vs IAs Públicas)
 *  - Domingo: Reflexión Estratégica & Visión de Negocio
 * ==============================================================================
 */

export async function runDailyBuffer8AMPublication() {
  console.log('================================================================================');
  console.log('☀️ AUDITFLOW AI — PUBLICADOR DIARIO EN BUFFER (CALENDARIO 7 DÍAS SIN REPETICIÓN)');
  console.log('🎯 CANAL PRIORITARIO #1: LINKEDIN COMPANY PAGE (Audiflowai)');
  console.log('📱 Canales Complementarios: Facebook Page & Instagram');
  console.log('================================================================================\n');

  const token = (process.env.BUFFER_ACCESS_TOKEN || '').trim();
  if (!token) {
    throw new Error('❌ Falta BUFFER_ACCESS_TOKEN en las variables de entorno');
  }

  const publisher = new BufferPublisher(token);
  const dayOfWeek = new Date().getDay();
  const trend = getDailyBufferSchedule(dayOfWeek);
  const isReel = trend.format === 'REEL';
  const hasImage = Boolean(trend.image);
  const assetsForPost = hasImage ? [{ image: { url: trend.image } }] : [];

  console.log(`📅 Día de la Semana: ${dayOfWeek} | Tema Matutino: "${trend.title}"`);

  // Canales oficiales registrados en Buffer
  const LI_CHANNEL_ID = '6a97043a065799be4669fadb'; // PRIORIDAD MÁXIMA
  const FB_CHANNEL_ID = '6a970164065799be4669eea1';
  const IG_CHANNEL_ID = '6a970416065799be4669fa58';

  const results = {};

  // 1. PUBLICAR PRIMERO EN LINKEDIN (PRIORIDAD ABSOLUTA)
  console.log('\n🚀 [1/3] Publicando en LINKEDIN COMPANY PAGE (Canal Estrella)...');
  try {
    const li = await publisher.createPost({
      channelId: LI_CHANNEL_ID,
      text: trend.copy,
      mode: 'shareNow',
      service: 'linkedin',
      assets: assetsForPost
    });
    console.log(`✅ [LINKEDIN OK] Publicado exitosamente. ID: ${li?.id || 'OK'}`);
    results.linkedin = { success: true, id: li?.id };
  } catch (errLI) {
    console.error(`❌ [LINKEDIN FALLO]: ${errLI.message}`);
    results.linkedin = { success: false, error: errLI.message };
  }

  // 2. PUBLICAR EN FACEBOOK PAGE
  console.log('\n🚀 [2/3] Publicando en FACEBOOK PAGE (Audiflowai.com)...');
  try {
    const fb = await publisher.createPost({
      channelId: FB_CHANNEL_ID,
      text: trend.copy,
      mode: 'shareNow',
      service: 'facebook',
      metadata: {
        facebook: { type: isReel ? 'reel' : 'post' }
      },
      assets: assetsForPost
    });
    console.log(`✅ [FACEBOOK OK] Publicado exitosamente. ID: ${fb?.id || 'OK'}`);
    results.facebook = { success: true, id: fb?.id };
  } catch (errFB) {
    console.warn(`⚠️ [FACEBOOK NOTA]: ${errFB.message}`);
    results.facebook = { success: false, error: errFB.message };
  }

  // 3. PUBLICAR EN INSTAGRAM (REELS O FEED CON ASSET VISUAL)
  console.log('\n🚀 [3/3] Publicando en INSTAGRAM (@audiflowai)...');
  try {
    const igAssets = assetsForPost.length > 0 ? assetsForPost : [{
      image: { url: 'https://audiflowai.com/images/carousel/slide1_cover.jpg' }
    }];

    const ig = await publisher.createPost({
      channelId: IG_CHANNEL_ID,
      text: trend.copy,
      mode: 'shareNow',
      service: 'instagram',
      metadata: {
        instagram: {
          type: isReel ? 'reel' : 'post',
          shouldShareToFeed: true
        }
      },
      assets: igAssets
    });
    console.log(`✅ [INSTAGRAM OK] Publicado exitosamente. ID: ${ig?.id || 'OK'}`);
    results.instagram = { success: true, id: ig?.id };
  } catch (errIG) {
    console.warn(`⚠️ [INSTAGRAM NOTA]: ${errIG.message}`);
    results.instagram = { success: false, error: errIG.message };
  }

  // Registro persistente en bitácora social
  const auditPath = path.resolve('social_published_feed.json');
  try {
    let feed = [];
    if (fs.existsSync(auditPath)) {
      feed = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
    }
    feed.unshift({
      timestamp: new Date().toISOString(),
      eventType: 'BUFFER_DAILY_8AM_MATUTINO',
      dayOfWeek,
      theme: trend.title,
      results
    });
    fs.writeFileSync(auditPath, JSON.stringify(feed, null, 2), 'utf8');
  } catch (auditErr) {
    console.warn('Advertencia registro social feed:', auditErr.message);
  }

  // Remitir telemetría de control a tendenciaiatufuturo@gmail.com
  const resendKey = process.env.RESEND_API_KEY || CONFIG.EMAIL.RESEND_API_KEY;
  if (resendKey) {
    try {
      const resend = new Resend(resendKey);
      const liStatus = results.linkedin?.success ? '✅ Publicado' : '❌ Falló';
      const fbStatus = results.facebook?.success ? '✅ Publicado' : '⚠️ Falló';
      const igStatus = results.instagram?.success ? '✅ Publicado' : '⚠️ Falló';

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; background: #0f172a; color: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #38bdf8; max-width: 600px;">
          <h3 style="color: #38bdf8; margin-top: 0;">☀️ [BUFFER 8:00 AM] Reporte de Publicación Matutina</h3>
          <p style="font-size: 13px; color: #cbd5e1;">Ejecución programada para la Dirección General:</p>
          <ul style="color: #e2e8f0; font-size: 13px; line-height: 1.8;">
            <li><strong>Tema:</strong> ${trend.title}</li>
            <li><strong>LinkedIn (Prioridad #1):</strong> ${liStatus} (ID: ${results.linkedin?.id || 'N/A'})</li>
            <li><strong>Facebook:</strong> ${fbStatus} (ID: ${results.facebook?.id || 'N/A'})</li>
            <li><strong>Instagram:</strong> ${igStatus} (ID: ${results.instagram?.id || 'N/A'})</li>
            <li><strong>Fecha y Hora:</strong> ${new Date().toLocaleString()}</li>
          </ul>
        </div>
      `;

      await resend.emails.send({
        from: 'Directora de Marketing | AuditFlow AI <cmvo@audiflowai.com>',
        to: CONFIG.EMAIL.OWNER_CONTROL,
        subject: `☀️ [BUFFER 8:00 AM] Publicación Matutina: LinkedIn ${liStatus}`,
        html: emailHtml
      });
      console.log(`📬 Telemetría matutina enviada a: ${CONFIG.EMAIL.OWNER_CONTROL}`);
    } catch (telemetryErr) {
      console.warn('⚠️ Telemetría no enviada:', telemetryErr.message);
    }
  }

  console.log('\n================================================================================');
  console.log('🏁 PUBLICACIÓN MATUTINA 8:00 AM BUFFER FINALIZADA');
  console.log('================================================================================\n');

  return results;
}

// Invocación directa CLI
if (process.argv[1] && process.argv[1].endsWith('buffer_daily_publisher_8am.mjs')) {
  runDailyBuffer8AMPublication()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('❌ Error crítico en publicador matutino 8 AM:', err);
      process.exit(1);
    });
}
