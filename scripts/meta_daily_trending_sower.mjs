import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { BufferPublisher } from '../lib/buffer-publisher.js';

dotenv.config();

/**
 * ==============================================================================
 * AUDITFLOW AI — PUBLICADOR DIARIO DE TRENDS META ADS (FACEBOOK & INSTAGRAM) 8:00 AM
 * ==============================================================================
 * Publica contenido estratégico y visual diario en Facebook (Audiflowai.com) e
 * Instagram (@audiflowai) a través de Buffer GraphQL API.
 * Cumple estrictamente con la Regla de Oro #0 (sin sembrar miedo ni desconfianza).
 * ==============================================================================
 */

const DAILY_TRENDS = {
  // Lunes (1)
  1: {
    title: 'Blindaje Contractual de Inicio de Semana',
    copy: `⚖️ [LUNES DE NEGOCIACIONES] Iniciar la semana firmando contratos sin una auditoría preliminar es un riesgo evitable.

AuditFlow AI analiza acuerdos comerciales en 8 segundos y te entrega el Redline listo en Word (.docx con Control de Cambios) con propuestas de redacción fiduciaria.

Protege el margen de tu empresa desde el primer día:
👉 https://audiflowai.com/?ref=meta-monday

#LegalTech #DerechoCorporativo #ContratosComerciales #CFO #AuditFlowAI`,
    image: 'https://audiflowai.com/images/carousel/slide1_cover.jpg'
  },
  // Martes (2)
  2: {
    title: 'Equilibrio Fiduciario en Cláusulas de Penalización',
    copy: `📊 ¿Tus contratos de proveedores tienen penalizaciones asimétricas del 100%?

Con AuditFlow AI, los directores legales y financieros nivelan los términos contractuales en 8 segundos y descargan la contrapropuesta editable en Word.

Audita tu contrato sin costo hoy:
👉 https://audiflowai.com/?ref=meta-tuesday

#Negociaciones #ContratosB2B #LegalTech #ProductividadLegal #AuditFlowAI`,
    image: 'https://audiflowai.com/images/carousel/slide4_sla.jpg'
  },
  // Miércoles (3)
  3: {
    title: 'Entrega Profesional Directa en Word (.docx)',
    copy: `📄 La diferencia entre una herramienta genérica y un auditor fiduciario especializado:

AuditFlow AI no te da resúmenes vagos. Te descarga directamente el contrato en Word (.docx) con el Control de Cambios activado y las cláusulas sustitutas listas para negociar.

Pruébalo con tu próximo acuerdo:
👉 https://audiflowai.com/?ref=meta-wednesday

#LegalTech #ContratosWord #Abogados #CFO #EficienciaOperativa #AuditFlowAI`,
    image: 'https://audiflowai.com/images/carousel/slide5_redline.jpg'
  },
  // Jueves (4)
  4: {
    title: 'Control Total de Prórrogas y Renovaciones Tácitas',
    copy: `🔍 El 68% de las empresas terminan pagando servicios no deseados por cláusulas de prórroga automática con ventanas de salida imposibles.

AuditFlow AI detecta al instante estas condiciones y propone redacciones claras con preaviso razonable.

Haz tu auditoría forense hoy en:
👉 https://audiflowai.com/?ref=meta-thursday

#AuditoriaContratos #Compliance #DireccionGeneral #CFO #AuditFlowAI`,
    image: 'https://audiflowai.com/images/carousel/slide2_renewal.jpg'
  },
  // Viernes (5)
  5: {
    title: 'Las 4 Trampas Contractuales de Viernes por la Tarde',
    copy: `⚖️ [VIERNES DE CONTRATOS] No dejes que las prisas del cierre de semana comprometan el capital de tu empresa.

AuditFlow AI audita contratos comerciales en 8 segundos y detecta cláusulas abusivas, penalizaciones y términos de rescisión asimétricos antes de firmar.

Entrega inmediata en Word (.docx con Control de Cambios).
👉 Audita tu primer contrato de cortesía: https://audiflowai.com/?ref=meta-friday

#LegalTech #ContratosComerciales #CFO #DerechoCorporativo #AuditFlowAI`,
    image: 'https://audiflowai.com/images/carousel/slide1_cover.jpg'
  },
  // Sábado (6)
  6: {
    title: 'Fin de Semana sin Cargas Contractuales',
    copy: `☕ Los viernes por la tarde y los fines de semana no son para pasar 6 horas leyendo 50 páginas de anexos comerciales.

La tecnología fiduciaria de AuditFlow AI realiza el escaneo forense de tus acuerdos en 8 segundos para que tomes decisiones informadas al instante.

Descubre cómo funciona:
👉 https://audiflowai.com/?ref=meta-saturday

#Productividad #Abogados #DireccionFinanciera #LegalTech #AuditFlowAI`,
    image: 'https://audiflowai.com/images/carousel/slide6_cta.jpg'
  },
  // Domingo (0)
  0: {
    title: 'Planificación Contractual y Protección de Márgenes',
    copy: `🎯 Prepárate para las negociaciones de la semana entrante con rigor fiduciario.

AuditFlow AI pone en manos de despachos y gerencias medianas un auditor contractual de alta precisión por solo $19 USD por acuerdo, sin comités burocráticos ni contratos anuales cautivos.

Conoce más y prueba un escaneo gratuito:
👉 https://audiflowai.com/?ref=meta-sunday

#LegalTech #Contratos #CFO #DireccionGeneral #AuditFlowAI`,
    image: 'https://audiflowai.com/images/carousel/slide3_inflation.jpg'
  }
};

export async function runDailyMetaTrendingPublication() {
  console.log('================================================================================');
  console.log('📱 AUDITFLOW AI — PUBLICACIÓN DIARIA META ADS (8:00 AM CST)');
  console.log('================================================================================\n');

  const publisher = new BufferPublisher();
  const dayOfWeek = new Date().getDay(); // 0 = Domingo, 1 = Lunes, ..., 5 = Viernes, 6 = Sábado
  const trend = DAILY_TRENDS[dayOfWeek];

  console.log(`📅 Día de la semana: ${dayOfWeek} | Tema: "${trend.title}"`);

  // Canales oficiales
  const FB_CHANNEL_ID = '6a970164065799be4669eea1'; // Audiflowai.com
  const IG_CHANNEL_ID = '6a970416065799be4669fa58'; // audiflowai

  const results = {};

  // 1. Publicar en Facebook Page
  try {
    console.log('\n⏳ Publicando en Facebook (Audiflowai.com)...');
    const fbPost = await publisher.createPost({
      channelId: FB_CHANNEL_ID,
      text: trend.copy,
      mode: 'shareNow',
      service: 'facebook'
    });
    console.log(`✅ ¡Éxito en Facebook! Post ID: ${fbPost.id} | Estado: ${fbPost.status}`);
    results.facebook = { success: true, id: fbPost.id, status: fbPost.status };
  } catch (fbErr) {
    console.error(`❌ Error en Facebook: ${fbErr.message}`);
    results.facebook = { success: false, error: fbErr.message };
  }

  // 2. Publicar en Instagram
  try {
    console.log('\n⏳ Publicando en Instagram (@audiflowai)...');
    const igPost = await publisher.createPost({
      channelId: IG_CHANNEL_ID,
      text: trend.copy,
      mode: 'shareNow',
      service: 'instagram',
      assets: [
        {
          image: {
            url: trend.image
          }
        }
      ]
    });
    console.log(`✅ ¡Éxito en Instagram! Post ID: ${igPost.id} | Estado: ${igPost.status}`);
    results.instagram = { success: true, id: igPost.id, status: igPost.status };
  } catch (igErr) {
    console.error(`❌ Error en Instagram: ${igErr.message}`);
    results.instagram = { success: false, error: igErr.message };
  }

  // Registrar en feed de auditoría
  const auditPath = path.resolve('social_published_feed.json');
  try {
    let feed = [];
    if (fs.existsSync(auditPath)) {
      feed = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
    }
    feed.unshift({
      timestamp: new Date().toISOString(),
      eventType: 'META_DAILY_TRENDING_8AM',
      dayOfWeek,
      theme: trend.title,
      results
    });
    fs.writeFileSync(auditPath, JSON.stringify(feed, null, 2), 'utf8');
    console.log(`\n📋 Registro guardado en ${auditPath}`);
  } catch (auditErr) {
    console.warn('Advertencia guardando feed:', auditErr.message);
  }

  console.log('\n================================================================================');
  console.log('🏁 CICLO DIARIO DE META ADS COMPLETADO');
  console.log('================================================================================\n');

  return results;
}

if (process.argv[1] && process.argv[1].includes('meta_daily_trending_sower.mjs')) {
  runDailyMetaTrendingPublication().catch(console.error);
}
