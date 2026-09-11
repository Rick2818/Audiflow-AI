import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { BufferPublisher } from '../lib/buffer-publisher.js';
import { CONFIG } from '../lib/config.js';
import { getNextUnusedBufferPost, recordBufferPostPublication } from '../lib/buffer-content-calendar.js';
import { Resend } from 'resend';

dotenv.config();

/**
 * ==============================================================================
 * AUDITFLOW AI — PUBLICADOR MATUTINO EN BUFFER (8:00 AM CST — LUNES A DOMINGO)
 * ==============================================================================
 * REGLA INMUTABLE ZERO-REPEAT:
 * Cada post matutino consume una imagen NUEVA y un copy fresco de la librería.
 * Cero repetición visual ni cíclica en redes sociales.
 * ==============================================================================
 */

export async function runDailyBuffer8AMPublication() {
  console.log('================================================================================');
  console.log('☀️ AUDITFLOW AI — PUBLICADOR DIARIO EN BUFFER (MOTOR DINÁMICO ZERO-REPEAT)');
  console.log('🎯 CANAL PRIORITARIO #1: LINKEDIN COMPANY PAGE (Audiflowai)');
  console.log('📱 Canales Complementarios: Facebook Page & Instagram');
  console.log('================================================================================\n');

  const token = (process.env.BUFFER_ACCESS_TOKEN || '').trim();
  if (!token) {
    throw new Error('❌ Falta BUFFER_ACCESS_TOKEN en las variables de entorno');
  }

  const publisher = new BufferPublisher(token);
  const trend = getNextUnusedBufferPost({ format: 'FEED' });
  const assetsForPost = [{ image: { url: trend.image } }];

  console.log(`📅 Fecha: ${new Date().toLocaleDateString()} | Tema Matutino: "${trend.title}"`);
  console.log(`🖼️ Imagen Única Seleccionada: ${trend.image}`);

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
        facebook: { type: 'post' }
      },
      assets: assetsForPost
    });
    console.log(`✅ [FACEBOOK OK] Publicado exitosamente. ID: ${fb?.id || 'OK'}`);
    results.facebook = { success: true, id: fb?.id };
  } catch (errFB) {
    console.warn(`⚠️ [FACEBOOK NOTA]: ${errFB.message}`);
    results.facebook = { success: false, error: errFB.message };
  }

  // 3. PUBLICAR EN INSTAGRAM (FEED CON ASSET VISUAL NUEVO)
  console.log('\n🚀 [3/3] Publicando en INSTAGRAM (@audiflowai)...');
  try {
    const ig = await publisher.createPost({
      channelId: IG_CHANNEL_ID,
      text: trend.copy,
      mode: 'shareNow',
      service: 'instagram',
      metadata: {
        instagram: {
          type: 'post',
          shouldShareToFeed: true
        }
      },
      assets: assetsForPost
    });
    console.log(`✅ [INSTAGRAM OK] Publicado exitosamente. ID: ${ig?.id || 'OK'}`);
    results.instagram = { success: true, id: ig?.id };
  } catch (errIG) {
    console.warn(`⚠️ [INSTAGRAM NOTA]: ${errIG.message}`);
    results.instagram = { success: false, error: errIG.message };
  }

  // Registro persistente en bitácora social y ledger de no repetición
  recordBufferPostPublication({ post: trend, results });

  const auditPath = path.resolve('social_published_feed.json');
  try {
    let feed = [];
    if (fs.existsSync(auditPath)) {
      feed = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
    }
    feed.unshift({
      timestamp: new Date().toISOString(),
      eventType: 'BUFFER_DAILY_8AM_MATUTINO',
      theme: trend.title,
      image: trend.image,
      imageUrls: [trend.image],
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
