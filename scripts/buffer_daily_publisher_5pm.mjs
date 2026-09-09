import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { BufferPublisher } from '../lib/buffer-publisher.js';
import { CONFIG } from '../lib/config.js';
import { Resend } from 'resend';

dotenv.config();

/**
 * ==============================================================================
 * AUDITFLOW AI — PUBLICADOR VESPERTINO EN BUFFER (5:00 PM CST — LUNES A DOMINGO)
 * ==============================================================================
 * FORMATO: REELS / ASSETS VISUALES DINÁMICOS
 * PRIORIDAD B2B: LINKEDIN COMPANY PAGE (Audiflowai)
 * Canales Multimedia: Instagram Reels (@audiflowai) & Facebook Reels / Video
 * ==============================================================================
 */

const REELS_EVENING_TRENDS = {
  // Lunes (1): Reel de Inicio de Semana - "La Cláusula Trampa de los $142k"
  1: {
    title: 'Reel Lunes: La Cláusula de $142,000 USD que se le pasó al Abogado',
    hook: '¿Cerrando negociaciones este lunes? Cuidado con el Anexo C...',
    copy: `¿Cerrando contratos o acuerdos este lunes? 📄⚖️

En este Reel te mostramos el caso real de una empresa que pagó $142,000 USD por 8 palabras ambiguas en la página 41 de un anexo técnico.

Las 3 cláusulas trampa más peligrosas en contratos de proveedores:
1️⃣ Renovación automática sin preaviso ni opción de salida.
2️⃣ Ajustes de tarifa vinculados a "costos directos" sin tope porcentual (uncapped).
3️⃣ Responsabilidad solidaria ilimitada por demoras de terceros.

⚡ Con AuditFlow AI:
• Subes el borrador confidencial a memoria RAM volátil.
• En 8.2 segundos el algoritmo resalta las contingencias.
• Descargas tu Redline en Word (.docx con Control de Cambios) listo para negociar.

👉 Haz tu auditoría de prueba sin costo:
https://audiflowai.com/?ref=buffer-reels-5pm-lunes

#Reels #LegalTech #Contratos #CFO #DerechoCorporativo #AuditFlowAI #LinkedInVideo`,
    image: 'https://audiflowai.com/images/auditoria_forense_dashboard_nueva.jpg',
    videoUrl: 'https://audiflowai.com/images/reel_forense_muestra.mp4'
  },
  // Martes (2): Reel de Productividad - "4 Horas de Lectura vs. 8 Segundos"
  2: {
    title: 'Reel Martes: 4 Horas de Revisión Manual vs. 8 Segundos de Algoritmo',
    hook: '¿Tu equipo legal sigue revisando contratos de 50 páginas a mano?',
    copy: `Para un Director Financiero o Socio de Bufete, el tiempo de su equipo es el activo más costoso. 💼⏱️

❌ 4.5 horas leyendo párrafos monótonos = Fatiga cognitiva y errores humanos.
⚡ 8.2 segundos en AuditFlow AI = Detección forense automática y Redline en Word con control de cambios.

Cero instalación, cero almacenamiento de documentos en disco y total cumplimiento GDPR Art. 28.

Mira cómo funciona en vivo y pruébalo gratis:
👉 https://audiflowai.com/?ref=buffer-reels-5pm-martes

#Productividad #LegalOps #Innovacion #CFO #AuditFlowAI #Reels`,
    image: 'https://audiflowai.com/images/comparativa_eficiencia.jpg',
    videoUrl: 'https://audiflowai.com/images/reel_forense_muestra.mp4'
  },
  // Miércoles (3): Reel de Cláusula Trampa - "La Autopsia Contractual"
  3: {
    title: 'Reel Miércoles: Autopsia de una Cláusula de Ajuste Inflacionario',
    hook: 'La cláusula trampa que ningún humano detectó a simple vista...',
    copy: `Revisar contratos sin una herramienta forense es apostar el presupuesto anual de la empresa. 📉⚠️

En este reel analizamos la trampa de indexación acumulativa que trasladó sobrecostos del 18% sin previo aviso.

Descubre cómo neutralizarla con solo 3 líneas en tu contrapropuesta de Redline:
👉 https://audiflowai.com/?ref=buffer-reels-5pm-miercoles

#Abogados #Finanzas #ContratosB2B #AuditFlowAI #Reels`,
    image: 'https://audiflowai.com/images/carousel/slide3_inflation.jpg',
    videoUrl: 'https://audiflowai.com/images/reel_forense_muestra.mp4'
  },
  // Jueves (4): Reel de Privacidad - "Por qué no debes subir contratos a ChatGPT"
  4: {
    title: 'Reel Jueves: El Peligro Oculto de Subir Contratos a IAs Públicas',
    hook: '¿Sabías que subir contratos a IAs públicas puede violar tus NDAs?',
    copy: `🔒 Tu secreto profesional no puede comprometerse.

Las IAs públicas utilizan las entradas de texto para reentrenar sus modelos comerciales.

AuditFlow AI procesa 100% en memoria RAM volátil:
✅ Al terminar la auditoría, la sesión se purga.
✅ Cero persistencia en servidores o bases de datos.
✅ Cumplimiento fiduciario estricto para despachos exigentes.

Protege la información confidencial de tu empresa:
👉 https://audiflowai.com/?ref=buffer-reels-5pm-jueves

#Ciberseguridad #Privacidad #LegalTech #Compliance #AuditFlowAI`,
    image: 'https://audiflowai.com/images/post_ig_ciberseguridad.jpg',
    videoUrl: 'https://audiflowai.com/images/reel_forense_muestra.mp4'
  },
  // Viernes (5): Reel de Cierre - "El Fin de Semana Tranquilo del Director Legal"
  5: {
    title: 'Reel Viernes: Apaga la Computadora con tus Contratos Blindados',
    hook: 'Viernes 5:00 PM: ¿Contratos pendientes para el lunes?',
    copy: `Termina la semana con la certeza de que ningún contrato firmado te quitará el sueño. 📄✨

Antes de cerrar tu laptop:
1. Sube el borrador de tu proveedor a AuditFlow AI.
2. Descarga el Redline con las observaciones exactas en Word.
3. Envíalo a la contraparte y disfruta de tu descanso.

👉 Prueba gratuita en segundos:
https://audiflowai.com/?ref=buffer-reels-5pm-viernes

#FinDeSemana #DirectoresLegales #CFO #Tranquilidad #AuditFlowAI`,
    image: 'https://audiflowai.com/images/carousel/slide5_redline.jpg',
    videoUrl: 'https://audiflowai.com/images/reel_forense_muestra.mp4'
  },
  // Sábado (6): Reel de Estrategia - "El Asesor Legal del Futuro"
  6: {
    title: 'Reel Sábado: Cómo los Abogados Top Ahorran 15 Horas por Semana',
    hook: 'El abogado del futuro no cobra por leer contratos mecánicamente...',
    copy: `Los clientes corporativos no pagan por 5 horas de lectura lenta; pagan por estrategia, claridad y negociación de alto nivel. 💡⚖️

AuditFlow AI se encarga de la inspección mecánica en 8 segundos para que tú te enfoques en liderar la mesa de negociación.

👉 Conoce la plataforma fiduciaria:
https://audiflowai.com/?ref=buffer-reels-5pm-sabado

#AbogaciaModerna #LegalOps #EstrategiaB2B #AuditFlowAI`,
    image: 'https://audiflowai.com/images/carousel/slide1_cover.jpg',
    videoUrl: 'https://audiflowai.com/images/reel_forense_muestra.mp4'
  },
  // Domingo (0): Reel de Preparación - "Lunes sin Sorpresas"
  0: {
    title: 'Reel Domingo: Anticipa la Semana y Llega con Redlines Listos',
    hook: '¿Reunión de junta directiva o comité de compras mañana lunes?',
    copy: `Llega a la reunión del lunes con el mapa completo de riesgos y el archivo Word listo para contraofertar. 🚀

Una auditoría preventiva de 8 segundos hoy te ahorra semanas de disputas contractuales.

👉 Escaneo de prueba confidencial:
https://audiflowai.com/?ref=buffer-reels-5pm-domingo

#LiderazgoEmpresarial #CFO #Negociacion #AuditFlowAI`,
    image: 'https://audiflowai.com/images/redline_forense_clausulas.jpg',
    videoUrl: 'https://audiflowai.com/images/reel_forense_muestra.mp4'
  }
};

export async function runDailyBuffer5PMPublication() {
  console.log('================================================================================');
  console.log('🌆 AUDITFLOW AI — PUBLICADOR VESPERTINO EN BUFFER (5:00 PM CST — REELS/VIDEO)');
  console.log('🎯 PRIORIDAD LINKEDIN B2B (Audiflowai) + INSTAGRAM REELS & FACEBOOK VIDEO');
  console.log('================================================================================\n');

  const token = (process.env.BUFFER_ACCESS_TOKEN || '').trim();
  if (!token) {
    throw new Error('❌ Falta BUFFER_ACCESS_TOKEN en las variables de entorno');
  }

  const publisher = new BufferPublisher(token);
  const dayOfWeek = new Date().getDay();
  const trend = REELS_EVENING_TRENDS[dayOfWeek];

  console.log(`📅 Día: ${dayOfWeek} | Tema Reels: "${trend.title}"`);

  const LI_CHANNEL_ID = '6a97043a065799be4669fadb'; // PRIORIDAD MÁXIMA
  const IG_CHANNEL_ID = '6a970416065799be4669fa58';
  const FB_CHANNEL_ID = '6a970164065799be4669eea1';

  const results = {};

  // 1. PUBLICAR EN LINKEDIN (CANAL ESTRELLA)
  console.log('\n🚀 [1/3] Publicando en LINKEDIN COMPANY PAGE (Prioridad #1)...');
  try {
    const li = await publisher.createPost({
      channelId: LI_CHANNEL_ID,
      text: `${trend.hook}\n\n${trend.copy}`,
      mode: 'shareNow',
      service: 'linkedin',
      assets: [{ image: { url: trend.image } }]
    });
    console.log(`✅ [LINKEDIN OK] Publicado exitosamente. ID: ${li?.id || 'OK'}`);
    results.linkedin = { success: true, id: li?.id };
  } catch (errLI) {
    console.error(`❌ [LINKEDIN FALLO]: ${errLI.message}`);
    results.linkedin = { success: false, error: errLI.message };
  }

  // 2. PUBLICAR EN INSTAGRAM (REELS / FEED)
  console.log('\n🚀 [2/3] Publicando en INSTAGRAM (@audiflowai - Formato Reel/Feed)...');
  try {
    const ig = await publisher.createPost({
      channelId: IG_CHANNEL_ID,
      text: `${trend.hook}\n\n${trend.copy}`,
      mode: 'shareNow',
      service: 'instagram',
      metadata: {
        instagram: {
          type: 'post',
          shouldShareToFeed: true
        }
      },
      assets: [{ image: { url: trend.image } }]
    });
    console.log(`✅ [INSTAGRAM OK] Publicado exitosamente. ID: ${ig?.id || 'OK'}`);
    results.instagram = { success: true, id: ig?.id };
  } catch (errIG) {
    console.warn(`⚠️ [INSTAGRAM NOTA]: ${errIG.message}`);
    results.instagram = { success: false, error: errIG.message };
  }

  // 3. PUBLICAR EN FACEBOOK (REELS / VIDEO POST)
  console.log('\n🚀 [3/3] Publicando en FACEBOOK PAGE (Audiflowai.com)...');
  try {
    const fb = await publisher.createPost({
      channelId: FB_CHANNEL_ID,
      text: `${trend.hook}\n\n${trend.copy}`,
      mode: 'shareNow',
      service: 'facebook',
      metadata: {
        facebook: { type: 'post' }
      },
      assets: [{ image: { url: trend.image } }]
    });
    console.log(`✅ [FACEBOOK OK] Publicado exitosamente. ID: ${fb?.id || 'OK'}`);
    results.facebook = { success: true, id: fb?.id };
  } catch (errFB) {
    console.warn(`⚠️ [FACEBOOK NOTA]: ${errFB.message}`);
    results.facebook = { success: false, error: errFB.message };
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
      eventType: 'BUFFER_DAILY_5PM_REELS_VESPERTINO',
      dayOfWeek,
      theme: trend.title,
      textSnippet: (trend.copy || '').substring(0, 50),
      imageUrls: trend.image ? [trend.image] : [],
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
      const igStatus = results.instagram?.success ? '✅ Publicado' : '⚠️ Falló';
      const fbStatus = results.facebook?.success ? '✅ Publicado' : '⚠️ Falló';

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; background: #0f172a; color: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #10b981; max-width: 600px;">
          <h3 style="color: #34d399; margin-top: 0;">🌆 [BUFFER 5:00 PM] Reporte Vespertino (Reels / LinkedIn)</h3>
          <p style="font-size: 13px; color: #cbd5e1;">Despacho vespertino de contenido dinámico:</p>
          <ul style="color: #e2e8f0; font-size: 13px; line-height: 1.8;">
            <li><strong>Tema:</strong> ${trend.title}</li>
            <li><strong>LinkedIn (Prioridad #1):</strong> ${liStatus} (ID: ${results.linkedin?.id || 'N/A'})</li>
            <li><strong>Instagram (Reel/Post):</strong> ${igStatus} (ID: ${results.instagram?.id || 'N/A'})</li>
            <li><strong>Facebook:</strong> ${fbStatus} (ID: ${results.facebook?.id || 'N/A'})</li>
            <li><strong>Fecha y Hora:</strong> ${new Date().toLocaleString()}</li>
          </ul>
        </div>
      `;

      await resend.emails.send({
        from: 'Directora de Marketing | AuditFlow AI <cmvo@audiflowai.com>',
        to: CONFIG.EMAIL.OWNER_CONTROL,
        subject: `🌆 [BUFFER 5:00 PM] Publicación Vespertina Reels: LinkedIn ${liStatus}`,
        html: emailHtml
      });
      console.log(`📬 Telemetría vespertina enviada a: ${CONFIG.EMAIL.OWNER_CONTROL}`);
    } catch (telemetryErr) {
      console.warn('⚠️ Telemetría no enviada:', telemetryErr.message);
    }
  }

  console.log('\n================================================================================');
  console.log('🏁 PUBLICACIÓN VESPERTINA 5:00 PM BUFFER FINALIZADA');
  console.log('================================================================================\n');

  return results;
}

// Invocación directa CLI
if (process.argv[1] && process.argv[1].endsWith('buffer_daily_publisher_5pm.mjs')) {
  runDailyBuffer5PMPublication()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('❌ Error crítico en publicador vespertino 5 PM:', err);
      process.exit(1);
    });
}
