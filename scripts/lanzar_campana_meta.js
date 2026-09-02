import dotenv from 'dotenv';
import { publicarAnuncioMeta } from '../lib/meta_ads_publisher.js';

dotenv.config();

/**
 * ==============================================================================
 * AUDITFLOW AI — SCRIPT EJECUTOR DE META ADS
 * ==============================================================================
 * Crea campañas automatizadas para captar Directores Legales, CFOs y Firmas.
 * ==============================================================================
 */

async function main() {
  console.log('============================================================');
  console.log('📢 AUDITFLOW AI — PUBLICADOR DE CAMPAÑAS EN META ADS');
  console.log('============================================================');

  // Parámetros de la campaña para AuditFlow AI
  const configAnuncio = {
    nombreCampana: process.env.META_CAMPAIGN_NAME || 'AuditFlow AI - Detección de Sobrecostos y Redlines B2B',
    presupuestoDiarioUSD: parseFloat(process.env.META_DAILY_BUDGET || '5.00'),
    urlLanding: process.env.META_LANDING_URL || 'https://audiflowai.com',
    urlImagen: process.env.META_IMAGE_URL || 'https://audiflowai.com/banner_facebook_audiflowai.png',
    textoPrincipal: process.env.META_AD_BODY || '¿Tu equipo pierde horas revisando contratos y facturas legales? AuditFlow AI detecta discrepancias normativas y sobrecostos en 30 segundos con Redlines fiduciarios inmediatos.',
    tituloAnuncio: process.env.META_AD_HEADLINE || 'Auditoría Fiduciaria Automatizada con IA',
    descripcionAnuncio: process.env.META_AD_DESCRIPTION || 'Prueba Pro $69/mes y Licencias Corporativas. Sin permanencia.',
    paisCodigo: process.env.META_COUNTRY_CODE || 'SV',
    paisesAdicionales: ['GT', 'HN', 'CR', 'PA', 'CO', 'MX'],
    estadoCampana: 'PAUSED', // Iniciamos en PAUSED para permitir revisión en Ads Manager
    estadoAdSet: 'PAUSED',
    estadoAnuncio: 'ACTIVE'
  };

  console.log('\nConfiguración preparada:');
  console.log(`• Campaña: ${configAnuncio.nombreCampana}`);
  console.log(`• Presupuesto diario: $${configAnuncio.presupuestoDiarioUSD} USD`);
  console.log(`• Países: ${[configAnuncio.paisCodigo, ...configAnuncio.paisesAdicionales].join(', ')}`);
  console.log(`• URL Landing: ${configAnuncio.urlLanding}`);
  console.log(`• Titular: ${configAnuncio.tituloAnuncio}`);
  console.log('------------------------------------------------------------\n');

  const resultado = await publicarAnuncioMeta(configAnuncio);

  if (resultado.success) {
    console.log('\n🎉 ¡Campaña y Anuncio creados exitosamente en Meta Ads!');
    console.log(`🆔 ID Campaña:    ${resultado.campaignId}`);
    console.log(`🆔 ID AdSet:      ${resultado.adSetId}`);
    console.log(`🆔 ID Creativo:   ${resultado.creativeId}`);
    console.log(`🆔 ID Anuncio:    ${resultado.adId}`);
    console.log('\n👉 Puedes verla y activarla en tu Meta Ads Manager: https://adsmanager.facebook.com');
  } else {
    console.error('\n⚠️ Hubo un error al publicar:', resultado.error);
  }
}

main();
