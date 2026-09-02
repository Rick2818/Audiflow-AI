import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { generarCreativoImagen, generarCreativoCarrusel, generarCreativoVideo } from './meta_creative_factory.js';

dotenv.config();

/**
 * ==============================================================================
 * AUDITFLOW AI — SERVICIO DE AUTOMATIZACIÓN DE META ADS (FACEBOOK & INSTAGRAM)
 * ==============================================================================
 * Ejecuta en cascada: Campaña -> Conjunto de anuncios -> Creativo -> Anuncio.
 * Soporta:
 * - Subida directa de imágenes locales a Meta Ad Library (image_hash).
 * - Creativos de Imagen, Carrusel y Video/Reel.
 * - Segmentación Abierta, Intereses B2B, Custom Audiences (Retargeting) y Lookalikes.
 * ==============================================================================
 */

const API_VERSION = 'v20.0';
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;

/**
 * Función auxiliar para realizar peticiones POST a la Graph API de Meta
 */
export async function postMetaAPI(endpoint, body, customToken = null) {
  const token = customToken || process.env.META_ACCESS_TOKEN;
  if (!token) {
    throw new Error('Falta META_ACCESS_TOKEN en las variables de entorno o parámetros.');
  }

  const url = `${BASE_URL}/${endpoint}?access_token=${encodeURIComponent(token)}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(`Error en Meta API [${endpoint}]: ${JSON.stringify(data.error || data)}`);
  }

  return data;
}

/**
 * Sube una imagen local o remota a la biblioteca de Meta Ads y retorna su image_hash
 */
export async function subirImagenMeta({
  adAccountId = process.env.META_AD_ACCOUNT_ID,
  imagePath = null,
  accessToken = process.env.META_ACCESS_TOKEN
} = {}) {
  const formattedAdAcc = adAccountId?.startsWith('act_') ? adAccountId : `act_${adAccountId}`;

  let filePath = imagePath;
  if (!filePath || !fs.existsSync(filePath)) {
    // Si no existe, intentar con el banner predeterminado del proyecto
    if (fs.existsSync('banner_facebook_audiflowai.png')) {
      filePath = 'banner_facebook_audiflowai.png';
    } else if (fs.existsSync('avatar_audiflowai.png')) {
      filePath = 'avatar_audiflowai.png';
    }
  }

  if (filePath && fs.existsSync(filePath)) {
    const buffer = fs.readFileSync(filePath);
    const base64 = buffer.toString('base64');
    const filename = path.basename(filePath);

    const res = await postMetaAPI(`${formattedAdAcc}/adimages`, {
      bytes: base64,
      filename: filename
    }, accessToken);

    if (res.images && res.images.bytes && res.images.bytes.hash) {
      return res.images.bytes.hash;
    }
    // Si viene indexado por el nombre del archivo
    for (const key in res.images) {
      if (res.images[key].hash) return res.images[key].hash;
    }
  }

  return null;
}

/**
 * Construye el objeto de targeting para el AdSet
 */
export function buildTargeting({
  paisCodigo = 'SV',
  paisesAdicionales = [],
  customAudiences = [],
  excludedCustomAudiences = [],
  ageMin = 25,
  ageMax = 65,
  publisherPlatforms = ['facebook', 'instagram'],
  flexibleSpec = null,
  customTargeting = null
}) {
  if (customTargeting) {
    return customTargeting;
  }

  const countries = [paisCodigo, ...paisesAdicionales.filter(c => c !== paisCodigo)];

  const targeting = {
    geo_locations: {
      countries: countries
    },
    age_min: ageMin,
    age_max: ageMax,
    publisher_platforms: publisherPlatforms
  };

  if (Array.isArray(customAudiences) && customAudiences.length > 0) {
    targeting.custom_audiences = customAudiences.map(aud => {
      return typeof aud === 'object' && aud.id ? aud : { id: String(aud) };
    });
  }

  if (Array.isArray(excludedCustomAudiences) && excludedCustomAudiences.length > 0) {
    targeting.excluded_custom_audiences = excludedCustomAudiences.map(aud => {
      return typeof aud === 'object' && aud.id ? aud : { id: String(aud) };
    });
  }

  if (flexibleSpec && Array.isArray(flexibleSpec) && flexibleSpec.length > 0) {
    targeting.flexible_spec = flexibleSpec;
  }

  return targeting;
}

/**
 * Función principal orquestadora para publicar anuncios en Meta Ads
 * @param {Object} params Parámetros dinámicos del anuncio
 * @returns {Promise<Object>} Resultado con IDs creados o error
 */
export async function publicarAnuncioMeta(params) {
  const {
    nombreCampana,
    presupuestoDiarioUSD = 5.00,
    urlLanding = 'https://audiflowai.com',
    urlImagen = null,
    imagePath = null,
    imageHash = null,
    videoId = null,
    urlMiniatura = null,
    textoPrincipal,
    tituloAnuncio,
    descripcionAnuncio,
    tarjetasCarrusel = null,
    tipoCreativo = 'IMAGEN',
    callToAction = 'LEARN_MORE',
    paisCodigo = 'SV',
    paisesAdicionales = [],
    customAudiences = [],
    excludedCustomAudiences = [],
    customTargeting = null,
    estadoCampana = 'PAUSED',
    estadoAdSet = 'PAUSED',
    estadoAnuncio = 'ACTIVE',
    accessToken = process.env.META_ACCESS_TOKEN,
    adAccountId = process.env.META_AD_ACCOUNT_ID,
    pageId = process.env.META_PAGE_ID
  } = params;

  if (!accessToken) throw new Error('META_ACCESS_TOKEN no está definido.');
  if (!adAccountId) throw new Error('META_AD_ACCOUNT_ID no está definido.');
  if (!pageId) throw new Error('META_PAGE_ID no está definido.');

  const formattedAdAccountId = adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`;

  try {
    console.log(`\n🚀 [Meta Ads] Iniciando proceso de publicación para: "${nombreCampana}"...`);

    // 1. Crear Campaña
    console.log(`⏳ [1/4] Creando campaña...`);
    const campanaData = await postMetaAPI(`${formattedAdAccountId}/campaigns`, {
      name: `${nombreCampana} - Campaña`,
      objective: 'OUTCOME_LEADS',
      status: estadoCampana,
      special_ad_categories: [],
      is_adset_budget_sharing_enabled: false
    }, accessToken);
    const campaignId = campanaData.id;
    console.log(`✓ Campaña creada con ID: ${campaignId}`);

    // 2. Construir Targeting y Crear Conjunto de Anuncios (AdSet)
    console.log(`⏳ [2/4] Creando conjunto de anuncios (AdSet)...`);
    const budgetEnCentavos = Math.round(Number(presupuestoDiarioUSD) * 100);
    
    const finalTargeting = buildTargeting({
      paisCodigo,
      paisesAdicionales,
      customAudiences,
      excludedCustomAudiences,
      customTargeting
    });

    const finalPixelId = process.env.META_PIXEL_ID || '1091744373394259';

    const adSetPayload = {
      name: `${nombreCampana} - AdSet`,
      campaign_id: campaignId,
      daily_budget: budgetEnCentavos.toString(),
      billing_event: 'IMPRESSIONS',
      optimization_goal: 'OFFSITE_CONVERSIONS',
      bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
      status: estadoAdSet,
      targeting: finalTargeting,
      promoted_object: {
        pixel_id: finalPixelId,
        custom_event_type: 'LEAD'
      }
    };

    const adSetData = await postMetaAPI(`${formattedAdAccountId}/adsets`, adSetPayload, accessToken);
    const adSetId = adSetData.id;
    console.log(`✓ Conjunto de anuncios (AdSet) creado con ID: ${adSetId}`);

    // 3. Obtener o Subir image_hash si es creativo de imagen
    let finalImageHash = imageHash;
    if (tipoCreativo === 'IMAGEN' && !finalImageHash) {
      console.log(`⏳ [3/4] Asegurando imagen en Meta Ad Library...`);
      try {
        finalImageHash = await subirImagenMeta({
          adAccountId: formattedAdAccountId,
          imagePath: imagePath || (urlImagen && fs.existsSync(urlImagen) ? urlImagen : 'banner_facebook_audiflowai.png'),
          accessToken
        });
        if (finalImageHash) {
          console.log(`✓ Imagen cargada con hash: ${finalImageHash}`);
        }
      } catch (err) {
        console.warn(`⚠️ Subida directa de imagen omitida, usando fallback:`, err.message);
      }
    }

    // 4. Crear el Creativo (AdCreative)
    console.log(`⏳ [3/4] Creando creativo publicitario (${tipoCreativo})...`);
    let creativePayload;

    if (tipoCreativo === 'CARRUSEL' && tarjetasCarrusel) {
      creativePayload = generarCreativoCarrusel({
        pageId,
        urlLandingGlobal: urlLanding,
        textoPrincipal,
        tarjetas: tarjetasCarrusel,
        callToAction,
        nombre: `${nombreCampana} - Creativo Carrusel`
      });
    } else if (tipoCreativo === 'VIDEO' && videoId) {
      creativePayload = generarCreativoVideo({
        pageId,
        urlLanding,
        videoId,
        urlMiniatura,
        texto: textoPrincipal,
        titulo: tituloAnuncio,
        callToAction,
        nombre: `${nombreCampana} - Creativo Video`
      });
    } else {
      creativePayload = generarCreativoImagen({
        pageId,
        urlLanding,
        urlImagen,
        imageHash: finalImageHash,
        texto: textoPrincipal,
        titulo: tituloAnuncio,
        descripcion: descripcionAnuncio,
        callToAction,
        nombre: `${nombreCampana} - Creativo Imagen`
      });
    }

    const creativeData = await postMetaAPI(`${formattedAdAccountId}/adcreatives`, creativePayload, accessToken);
    const creativeId = creativeData.id;
    console.log(`✓ Creativo creado con ID: ${creativeId}`);

    // 5. Crear y publicar el Anuncio final (Ad)
    console.log(`⏳ [4/4] Creando anuncio final...`);
    const adData = await postMetaAPI(`${formattedAdAccountId}/ads`, {
      name: `${nombreCampana} - Anuncio Final`,
      adset_id: adSetId,
      creative: {
        creative_id: creativeId
      },
      status: estadoAnuncio
    }, accessToken);
    const adId = adData.id;
    console.log(`✓ Anuncio final creado con ID: ${adId}`);

    return {
      success: true,
      campaignId,
      adSetId,
      creativeId,
      adId,
      imageHash: finalImageHash,
      targeting: finalTargeting,
      creativeType: tipoCreativo,
      summary: {
        nombreCampana,
        presupuestoDiarioUSD,
        estadoCampana,
        estadoAdSet,
        estadoAnuncio
      }
    };

  } catch (error) {
    console.error('❌ Falló la automatización de Meta Ads:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

export {
  generarCreativoImagen,
  generarCreativoCarrusel,
  generarCreativoVideo
};

export default {
  postMetaAPI,
  subirImagenMeta,
  buildTargeting,
  publicarAnuncioMeta,
  generarCreativoImagen,
  generarCreativoCarrusel,
  generarCreativoVideo
};
