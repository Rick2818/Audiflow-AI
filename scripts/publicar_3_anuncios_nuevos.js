import dotenv from 'dotenv';
import { publicarAnuncioMeta } from '../lib/meta_ads_publisher.js';

dotenv.config();

/**
 * ==============================================================================
 * AUDITFLOW AI — PUBLICADOR DE 3 ANUNCIOS B2B DE ALTO IMPACTO EN META ADS
 * ==============================================================================
 * 1. Anuncio 1: Directores Legales & Redlines Fiduciarios en 32 segundos.
 * 2. Anuncio 2: CFOs & Detección de Sobrecostos del 18% en Facturas Legales.
 * 3. Anuncio 3: CEOs & Seguridad Zero-Retention / Multisede Regional (LatAm & Brasil).
 * ==============================================================================
 */

const ANUNCIOS = [
  {
    nombreCampana: 'AuditFlow AI - [LegalOps] Redlines en 32 Segundos',
    presupuestoDiarioUSD: 5.00,
    urlLanding: 'https://audiflowai.com',
    tituloAnuncio: 'Revisa Contratos 10x Más Rápido con IA',
    descripcionAnuncio: 'Redlines en Word (.docx) y PDF. Plan Pro $69/mes.',
    textoPrincipal: `¿Tu equipo legal pasa 4 horas revisando un contrato de 60 páginas?

Un error en una cláusula de limitación de responsabilidad o una penalidad desproporcionada puede costarle cientos de miles de dólares a tu empresa.

Con AuditFlow AI, los General Counsels auditan contratos complejos en menos de 32 segundos:
🔹 Detección instantánea de riesgos y cláusulas abusivas.
🔹 Generación automática de Redlines fiduciarios en .docx y PDF listos para negociar.
🔹 Memoria Volátil (Zero-Retention): Tu secreto profesional blindado al 100%.

🚀 Activa tu Plan Pro por solo $69/mes y audita tu primer contrato hoy.`,
    paisCodigo: 'SV',
    paisesAdicionales: ['GT', 'HN', 'CR', 'PA', 'CO', 'MX', 'PE', 'AR'],
    estadoCampana: 'PAUSED',
    estadoAdSet: 'PAUSED',
    estadoAnuncio: 'PAUSED'
  },
  {
    nombreCampana: 'AuditFlow AI - [CFOs] Detección de Sobrecostos en Facturas',
    presupuestoDiarioUSD: 5.00,
    urlLanding: 'https://audiflowai.com',
    tituloAnuncio: 'Detecta Sobrecostos en Facturas y Contratos',
    descripcionAnuncio: 'Auditoría forense automática. Detén las fugas de presupuesto hoy.',
    textoPrincipal: `El 18% de las facturas de proveedores legales y consultorías contienen sobrecostos ocultos o conceptos fuera de contrato.

Como CFO o Director Financiero, autorizar pagos sin cruzar cada factura contra los acuerdos firmados es una fuga constante de EBITDA.

AuditFlow AI realiza el cruce forense de forma automática:
✅ Coteja términos acordados contra facturas emitidas en segundos.
✅ Detecta tarifas infladas, horas duplicadas y conceptos no autorizados.
✅ Genera reportes con justificación numérica para solicitar notas de crédito inmediatas.

💡 Una sola discrepancia detectada paga años de tu suscripción ($69/mes).

Comienza hoy a auditar tus facturas en audiflowai.com`,
    paisCodigo: 'SV',
    paisesAdicionales: ['GT', 'HN', 'CR', 'PA', 'CO', 'MX', 'PE', 'AR'],
    estadoCampana: 'PAUSED',
    estadoAdSet: 'PAUSED',
    estadoAnuncio: 'PAUSED'
  },
  {
    nombreCampana: 'AuditFlow AI - [CEOs] Blindaje Zero-Retention Regional',
    presupuestoDiarioUSD: 5.00,
    urlLanding: 'https://audiflowai.com',
    tituloAnuncio: 'Blindaje Contractual con Cero Retención de Datos',
    descripcionAnuncio: 'Cumplimiento normativo y velocidad para acuerdos corporativos.',
    textoPrincipal: `Audita contratos transfronterizos multimillonarios con seguridad fiduciaria de nivel bancario.

Para CEOs y Directores Generales en América Latina y Brasil que cierran acuerdos de alta velocidad: la seguridad de la información es innegociable.

AuditFlow AI está diseñado con arquitectura de procesamiento volátil:
🔒 Zero-Retention Architecture: Tus contratos jamás se almacenan en servidores ni se usan para entrenar IA pública.
⚡ Análisis forense de jurisdicciones aplicables y riesgos fiduciarios en segundos.
📑 Reportes ejecutivos para juntas directivas y comités de auditoría.

Prueba el Plan Pro ($69/mes) o consulta por Licencias Corporativas multiusuario en audiflowai.com`,
    paisCodigo: 'SV',
    paisesAdicionales: ['GT', 'HN', 'CR', 'PA', 'CO', 'MX', 'PE', 'AR', 'BR'],
    estadoCampana: 'PAUSED',
    estadoAdSet: 'PAUSED',
    estadoAnuncio: 'PAUSED'
  }
];

async function publicarTresAnuncios() {
  console.log('============================================================');
  console.log('🚀 PUBLICACIÓN DE 3 NUEVOS ANUNCIOS B2B EN META ADS');
  console.log('============================================================\n');

  const resultados = [];

  for (let i = 0; i < ANUNCIOS.length; i++) {
    const anuncio = ANUNCIOS[i];
    console.log(`\n------------------------------------------------------------`);
    console.log(`📢 PUBLICANDO ANUNCIO [${i + 1}/3]: ${anuncio.nombreCampana}`);
    console.log(`------------------------------------------------------------`);
    
    const res = await publicarAnuncioMeta(anuncio);
    resultados.push({ anuncio: anuncio.nombreCampana, res });

    if (res.success) {
      console.log(`✅ [${i + 1}/3] Anuncio Publicado con Éxito:`);
      console.log(`   • Campaña ID:  ${res.campaignId}`);
      console.log(`   • AdSet ID:    ${res.adSetId}`);
      console.log(`   • Creativo ID: ${res.creativeId}`);
      console.log(`   • Anuncio ID:  ${res.adId}`);
    } else {
      console.error(`❌ [${i + 1}/3] Error al publicar anuncio:`, res.error);
    }
  }

  console.log('\n============================================================');
  console.log('🎉 RESUMEN FINAL DE PUBLICACIÓN EN META ADS');
  console.log('============================================================');
  resultados.forEach((r, idx) => {
    console.log(`[${idx + 1}] ${r.anuncio}: ${r.res.success ? '✅ PUBLICADO (PAUSED)' : '❌ ERROR: ' + r.res.error}`);
  });
  console.log('\n👉 Revisa y activa tus campañas en: https://adsmanager.facebook.com');
}

publicarTresAnuncios();
