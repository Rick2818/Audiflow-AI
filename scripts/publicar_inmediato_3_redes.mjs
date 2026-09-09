import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { BufferPublisher } from '../lib/buffer-publisher.js';
import { CONFIG } from '../lib/config.js';
import { Resend } from 'resend';

dotenv.config();

/**
 * ==============================================================================
 * AUDITFLOW AI — PUBLICACIÓN INMEDIATA MULTICANAL EN 3 REDES (SHARE NOW)
 * Solicitud Directa de Don Ricardo (Director General)
 * Canales: LinkedIn (Audiflowai), Instagram (audiflowai), Facebook (Audiflowai.com)
 * ==============================================================================
 */

async function publicarEnLas3Redes() {
  console.log('================================================================================');
  console.log('🚀 AUDITFLOW AI — EJECUTANDO PUBLICACIÓN INMEDIATA EN LAS 3 REDES SOCIALES');
  console.log('🎯 LinkedIn Company Page + Instagram Feed/Reels + Facebook Fanpage');
  console.log('================================================================================\n');

  const token = (process.env.BUFFER_ACCESS_TOKEN || '').trim();
  if (!token) {
    throw new Error('❌ Falta BUFFER_ACCESS_TOKEN en el archivo .env');
  }

  const publisher = new BufferPublisher(token);

  const LI_CHANNEL_ID = '6a97043a065799be4669fadb'; // LinkedIn
  const IG_CHANNEL_ID = '6a970416065799be4669fa58'; // Instagram
  const FB_CHANNEL_ID = '6a970164065799be4669eea1'; // Facebook

  const postTitle = 'Auditoría Forense de Contratos: Protección Fiduciaria y Redlines en Word';
  const imageUrl = 'https://audiflowai.com/images/auditoria_forense_dashboard_nueva.jpg';

  const copyText = `El mayor riesgo en un contrato B2B nunca es evidente en la primera lectura... 📄⚖️

Las contingencias más costosas se esconden en la redacción ambigua de anexos técnicos y cláusulas de penalización asimétricas.

En AuditFlow AI hemos diseñado un motor de auditoría forense que transforma la revisión contractual:
⚡ Análisis completo en 8.2 segundos.
🔒 Procesamiento 100% en memoria RAM volátil (cero almacenamiento en disco, estricto secreto profesional).
📝 Descarga inmediata en Word (.docx) con Control de Cambios y Redlines listos para negociar en la mesa.

Optimiza el tiempo de tu equipo legal y blinda las decisiones de tu junta directiva.

👉 Realiza tu auditoría de prueba confidencial hoy mismo:
https://audiflowai.com/?ref=publicacion-directora-3redes

#LegalTech #Contratos #CFO #Compliance #DireccionLegal #AuditoriaContractual #AuditFlowAI`;

  const results = {};

  // 1. LINKEDIN
  console.log('🚀 [1/3] Publicando en LINKEDIN COMPANY PAGE (Audiflowai)...');
  try {
    const li = await publisher.createPost({
      channelId: LI_CHANNEL_ID,
      text: copyText,
      mode: 'shareNow',
      service: 'linkedin',
      assets: [{ image: { url: imageUrl } }]
    });
    console.log(`✅ [LINKEDIN OK] Publicado exitosamente. ID: ${li?.id || 'OK'}`);
    results.linkedin = { success: true, id: li?.id };
  } catch (errLI) {
    console.warn(`⚠️ [LINKEDIN NOTA]: ${errLI.message}`);
    results.linkedin = { success: false, error: errLI.message };
  }

  // 2. INSTAGRAM
  console.log('\n🚀 [2/3] Publicando en INSTAGRAM (@audiflowai)...');
  try {
    const ig = await publisher.createPost({
      channelId: IG_CHANNEL_ID,
      text: copyText,
      mode: 'shareNow',
      service: 'instagram',
      metadata: {
        instagram: {
          type: 'post',
          shouldShareToFeed: true
        }
      },
      assets: [{ image: { url: imageUrl } }]
    });
    console.log(`✅ [INSTAGRAM OK] Publicado exitosamente. ID: ${ig?.id || 'OK'}`);
    results.instagram = { success: true, id: ig?.id };
  } catch (errIG) {
    console.warn(`⚠️ [INSTAGRAM NOTA]: ${errIG.message}`);
    results.instagram = { success: false, error: errIG.message };
  }

  // 3. FACEBOOK
  console.log('\n🚀 [3/3] Publicando en FACEBOOK (Audiflowai.com)...');
  try {
    const fb = await publisher.createPost({
      channelId: FB_CHANNEL_ID,
      text: copyText,
      mode: 'shareNow',
      service: 'facebook',
      metadata: {
        facebook: { type: 'post' }
      },
      assets: [{ image: { url: imageUrl } }]
    });
    console.log(`✅ [FACEBOOK OK] Publicado exitosamente. ID: ${fb?.id || 'OK'}`);
    results.facebook = { success: true, id: fb?.id };
  } catch (errFB) {
    console.warn(`⚠️ [FACEBOOK NOTA]: ${errFB.message}`);
    results.facebook = { success: false, error: errFB.message };
  }

  // Registrar en la bitácora social_published_feed.json
  const auditPath = path.resolve('social_published_feed.json');
  try {
    let feed = [];
    if (fs.existsSync(auditPath)) {
      feed = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
    }
    feed.unshift({
      timestamp: new Date().toISOString(),
      eventType: 'DIRECT_DISPATCH_3_NETWORKS_MANUAL',
      theme: postTitle,
      textSnippet: copyText.substring(0, 50),
      imageUrls: [imageUrl],
      results
    });
    fs.writeFileSync(auditPath, JSON.stringify(feed, null, 2), 'utf8');
    console.log('\n📊 Registro guardado en social_published_feed.json.');
  } catch (e) {
    console.warn('Error guardando en social_published_feed:', e.message);
  }

  // Enviar confirmación por correo al Director General
  const resendKey = process.env.RESEND_API_KEY || CONFIG.EMAIL.RESEND_API_KEY;
  if (resendKey) {
    try {
      const resend = new Resend(resendKey);
      const liStatus = results.linkedin?.success ? '✅ Publicado' : '❌ Error';
      const igStatus = results.instagram?.success ? '✅ Publicado' : '❌ Error';
      const fbStatus = results.facebook?.success ? '✅ Publicado' : '❌ Error';

      await resend.emails.send({
        from: 'Directora de Marketing | AuditFlow AI <cmvo@audiflowai.com>',
        to: [CONFIG.EMAIL.OWNER_SALES, CONFIG.EMAIL.OWNER_CONTROL],
        subject: `🎯 [DESPACHO INMEDIATO] Publicación en las 3 Redes Sociales Completada`,
        html: `
          <div style="font-family: Arial, sans-serif; background: #0f172a; color: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #10b981; max-width: 600px;">
            <h2 style="color: #34d399; margin-top: 0;">🚀 Publicación Multicanal Despachada</h2>
            <p style="color: #cbd5e1; font-size: 14px;">Estimado Don Ricardo, se ha completado la publicación inmediata en las 3 redes sociales:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px;">
              <tr style="border-bottom: 1px solid #334155;">
                <td style="padding: 10px; color: #94a3b8;">LinkedIn (Audiflowai):</td>
                <td style="padding: 10px; font-weight: bold; color: #ffffff;">${liStatus} (ID: ${results.linkedin?.id || 'N/A'})</td>
              </tr>
              <tr style="border-bottom: 1px solid #334155;">
                <td style="padding: 10px; color: #94a3b8;">Instagram (audiflowai):</td>
                <td style="padding: 10px; font-weight: bold; color: #ffffff;">${igStatus} (ID: ${results.instagram?.id || 'N/A'})</td>
              </tr>
              <tr>
                <td style="padding: 10px; color: #94a3b8;">Facebook (Audiflowai.com):</td>
                <td style="padding: 10px; font-weight: bold; color: #ffffff;">${fbStatus} (ID: ${results.facebook?.id || 'N/A'})</td>
              </tr>
            </table>
            <p style="font-size: 12px; color: #64748b; margin-top: 20px;">AuditFlow AI &bull; Despacho en Vivo de Dirección de Marketing</p>
          </div>
        `
      });
      console.log('📬 Confirmación por correo enviada a Don Ricardo.');
    } catch (mailErr) {
      console.warn('Advertencia envío correo:', mailErr.message);
    }
  }

  console.log('================================================================================');
  console.log('🎉 PROCESO FINALIZADO CON ÉXITO');
  console.log('================================================================================\n');

  return results;
}

publicarEnLas3Redes()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Error fatal al publicar:', err);
    process.exit(1);
  });
