import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { BufferPublisher } from '../lib/buffer-publisher.js';

dotenv.config();

/**
 * ==============================================================================
 * AUDITFLOW AI — PUBLICADOR VESPERTINO EN BUFFER (5:00 PM CST)
 * ==============================================================================
 * Publica contenido estratégico de autoridad y conversión fiduciaria en:
 * 1. Facebook Page (Audiflowai.com)
 * 2. Instagram (@audiflowai)
 * 3. LinkedIn Company Page (Audiflowai)
 * ==============================================================================
 */

const EVENING_TRENDS = {
  // Lunes (1)
  1: {
    title: 'Cierre del Lunes: Auditoría de Contratos Firmados',
    copy: `¿Cerrando negociaciones este lunes? 📄⚖️

Antes de estampar la firma final en contratos de proveedores o convenios comerciales, asegúrate de que no haya trampas ocultas:
⚠️ Cláusulas de renovación automática sin aviso previo.
⚠️ Responsabilidad ilimitada ante demoras de terceros.
⚠️ Penalizaciones desproporcionadas en el anexo técnico.

En AuditFlow AI auditamos tus acuerdos en 8 segundos en memoria RAM volátil (0% retención en disco) y te entregamos el Redline en Word (.docx con Control de Cambios) listo para negociar.

👉 Prueba tu auditoría de cortesía hoy:
https://audiflowai.com/?ref=buffer-5pm-lunes

#LegalTech #Contratos #CFO #DerechoCorporativo #AuditFlowAI #Buffer`,
    image: 'https://audiflowai.com/images/redline_forense_clausulas.jpg'
  },
  // Martes (2)
  2: {
    title: 'Mitigación de Riesgo Contractual para CFOs',
    copy: `Para un Director Financiero, un contrato mal auditado es una fuga directa de EBITDA. 💼📉

El 74% de los sobrecostos imprevistos en empresas medianas provienen de cláusulas de indexación inflacionaria sin tope y penalidades asimétricas.

AuditFlow AI inspecciona cada párrafo en 8 segundos con inteligencia artificial fiduciaria privada.
✅ Cero almacenamiento de tus documentos en servidores.
✅ Detección algorítmica de pasivos contingentes.
✅ Descarga inmediata del informe de riesgo y Redline en Word.

👉 Audita tu contrato ahora:
https://audiflowai.com/?ref=buffer-5pm-martes

#CFO #FinanzasCorporativas #AuditoriaForense #Compliance #AuditFlowAI`,
    image: 'https://audiflowai.com/images/comparativa_eficiencia.jpg'
  },
  // Miércoles (3)
  3: {
    title: 'Productividad Legal: Redlines en 8 Segundos',
    copy: `¿Cuánto tiempo le toma a tu equipo revisar un contrato de 50 páginas? ⏱️

El modelo tradicional: 4 a 6 horas de lectura manual y fatiga cognitiva.
El estándar 2026 de AuditFlow AI: 8 segundos en memoria RAM privada con entrega directa del archivo Word con control de cambios.

Dedica tu tiempo a la estrategia legal, no a buscar errores de formato a mano.

👉 Haz un escaneo gratuito de prueba:
https://audiflowai.com/?ref=buffer-5pm-miercoles

#LegalTech #AbogadosCorporativos #Bufetes #Eficiencia #AuditFlowAI`,
    image: 'https://audiflowai.com/images/carousel/slide5_redline.jpg'
  },
  // Jueves (4)
  4: {
    title: 'Privacidad Estricta en RAM: Cero Entrenamiento de Modelos',
    copy: `🔒 Tu secreto comercial es innegociable.

Subir contratos confidenciales a herramientas de IA pública viola los acuerdos de confidencialidad de tu empresa.

AuditFlow AI opera bajo una arquitectura de Cero Retención de Datos:
1. El documento se procesa exclusivamente en memoria RAM volátil.
2. Al terminar el análisis, la memoria se purga de forma irreversible.
3. Tus datos jamás entrenan modelos de terceros.

Auditoría forense de alta precisión con seguridad bancaria:
👉 https://audiflowai.com/?ref=buffer-5pm-jueves

#Ciberseguridad #Privacidad #LegalTech #IAConfiable #AuditFlowAI`,
    image: 'https://audiflowai.com/images/post_ig_ciberseguridad.jpg'
  },
  // Viernes (5)
  5: {
    title: 'Blindaje de Fin de Semana: Cierra Contratos sin Preocupaciones',
    copy: `Termina la semana con la tranquilidad de que ningún acuerdo firmado te costará un litigio. 📄✨

Antes de apagar la computadora este viernes:
⚡ Sube tu borrador a AuditFlow AI.
⚡ En 8 segundos detecta inconsistencias y cláusulas abusivas.
⚡ Descarga tu Redline en Word listo para enviar.

Que el lunes comience con contratos blindados y relaciones comerciales claras:
👉 https://audiflowai.com/?ref=buffer-5pm-viernes

#FinDeSemanaTranquilo #ContratosB2B #LegalTech #Empresas #AuditFlowAI`,
    image: 'https://audiflowai.com/images/carousel/slide1_cover.jpg'
  },
  // Sábado (6)
  6: {
    title: 'Estrategia de Fin de Semana para Directivos',
    copy: `¿Revisando contratos para la reunión del lunes a primera hora? ☕📄

No pases el fin de semana descifrando letra chica. AuditFlow AI audita contratos complejos de proveedores y convenios comerciales en 8 segundos.

Recibe el informe forense y el Redline en Word con control de cambios activado, sin fricción y con privacidad empresarial absoluta.

👉 Pruébalo sin costo aquí:
https://audiflowai.com/?ref=buffer-5pm-sabado

#LegalTech #CFO #Productividad #AuditFlowAI`,
    image: 'https://audiflowai.com/images/redline_forense_clausulas.jpg'
  },
  // Domingo (0)
  0: {
    title: 'Preparación Dominical de Negociaciones',
    copy: `Empieza la semana con ventaja competitiva. 🚀

Una auditoría rápida de 8 segundos hoy te ahorra horas de debate contractual y renegociaciones tensas a lo largo de la semana.

AuditFlow AI: tu copiloto fiduciario para blindar contratos mercantiles sin esfuerzo.

👉 Escaneo de prueba gratuito:
https://audiflowai.com/?ref=buffer-5pm-domingo

#Planificacion #Liderazgo #Contratos #AuditFlowAI`,
    image: 'https://audiflowai.com/images/carousel/slide3_inflation.jpg'
  }
};

export async function runDailyBuffer5PMPublication() {
  console.log('================================================================================');
  console.log('📱 AUDITFLOW AI — PUBLICACIÓN VESPERTINA EN BUFFER (5:00 PM CST)');
  console.log('   Canales: Facebook (Audiflowai.com), Instagram (@audiflowai), LinkedIn (Audiflowai)');
  console.log('================================================================================\n');

  const token = (process.env.BUFFER_ACCESS_TOKEN || '').trim();
  if (!token) {
    console.error('❌ Falta BUFFER_ACCESS_TOKEN en .env');
    return;
  }

  const publisher = new BufferPublisher(token);
  const dayOfWeek = new Date().getDay();
  const trend = EVENING_TRENDS[dayOfWeek];

  console.log(`📅 Día: ${dayOfWeek} | Tema: "${trend.title}"`);

  const FB_CHANNEL_ID = '6a970164065799be4669eea1';
  const IG_CHANNEL_ID = '6a970416065799be4669fa58';
  const LI_CHANNEL_ID = '6a97043a065799be4669fadb';

  const results = {};

  // 1. Publicar en Facebook
  try {
    console.log('\n⏳ Publicando en Facebook (Audiflowai.com)...');
    const fb = await publisher.createPost({
      channelId: FB_CHANNEL_ID,
      text: trend.copy,
      mode: 'shareNow',
      service: 'facebook',
      assets: [{ image: { url: trend.image } }]
    });
    console.log(`✅ [FACEBOOK OK] ID: ${fb?.id || 'OK'}`);
    results.facebook = { success: true, id: fb?.id };
  } catch (err) {
    console.warn(`⚠️ [FACEBOOK] Error: ${err.message}`);
    results.facebook = { success: false, error: err.message };
  }

  // 2. Publicar en Instagram
  try {
    console.log('\n⏳ Publicando en Instagram (@audiflowai)...');
    const ig = await publisher.createPost({
      channelId: IG_CHANNEL_ID,
      text: trend.copy,
      mode: 'shareNow',
      service: 'instagram',
      assets: [{ image: { url: trend.image } }]
    });
    console.log(`✅ [INSTAGRAM OK] ID: ${ig?.id || 'OK'}`);
    results.instagram = { success: true, id: ig?.id };
  } catch (err) {
    console.warn(`⚠️ [INSTAGRAM] Error: ${err.message}`);
    results.instagram = { success: false, error: err.message };
  }

  // 3. Publicar en LinkedIn
  try {
    console.log('\n⏳ Publicando en LinkedIn (Audiflowai)...');
    const li = await publisher.createPost({
      channelId: LI_CHANNEL_ID,
      text: trend.copy,
      mode: 'shareNow',
      service: 'linkedin',
      assets: [{ image: { url: trend.image } }]
    });
    console.log(`✅ [LINKEDIN OK] ID: ${li?.id || 'OK'}`);
    results.linkedin = { success: true, id: li?.id };
  } catch (err) {
    console.warn(`⚠️ [LINKEDIN] Error: ${err.message}`);
    results.linkedin = { success: false, error: err.message };
  }

  // Guardar log
  const auditPath = path.resolve('social_published_feed.json');
  try {
    let feed = [];
    if (fs.existsSync(auditPath)) {
      feed = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
    }
    feed.unshift({
      timestamp: new Date().toISOString(),
      eventType: 'BUFFER_DAILY_5PM',
      dayOfWeek,
      theme: trend.title,
      results
    });
    fs.writeFileSync(auditPath, JSON.stringify(feed, null, 2), 'utf8');
  } catch (auditErr) {
    console.warn('Advertencia feed:', auditErr.message);
  }

  console.log('\n================================================================================');
  console.log('🏁 PUBLICACIÓN VESPERTINA 5:00 PM BUFFER COMPLETADA');
  console.log('================================================================================\n');

  return results;
}

if (process.argv[1] && process.argv[1].includes('buffer_daily_publisher_5pm.mjs')) {
  runDailyBuffer5PMPublication().catch(console.error);
}
