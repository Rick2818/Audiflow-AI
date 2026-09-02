/**
 * ==============================================================================
 * AUDITFLOW AI — META AD CREATIVE FACTORY
 * ==============================================================================
 * Generadores estandarizados de creativos para Meta Ads (Facebook & Instagram):
 * 1. Imagen Estática (Single Image)
 * 2. Carrusel Multi-Card (Multi-Slide Carousel)
 * 3. Video / Reel (Reels & Feed Video)
 * ==============================================================================
 */

/**
 * Genera el payload de un creativo con imagen estática (vía image_hash o URL)
 */
export function generarCreativoImagen({
  pageId = process.env.META_PAGE_ID,
  urlLanding = 'https://audiflowai.com',
  urlImagen = null,
  imageHash = null,
  texto,
  titulo,
  descripcion,
  callToAction = 'LEARN_MORE',
  nombre = null
}) {
  const linkData = {
    link: urlLanding,
    message: texto,
    name: titulo,
    description: descripcion,
    call_to_action: {
      type: callToAction,
      value: { link: urlLanding }
    }
  };

  if (imageHash) {
    linkData.image_hash = imageHash;
  } else if (urlImagen) {
    linkData.picture = urlImagen;
  }

  return {
    name: nombre || `Creativo Imagen - ${Date.now()}`,
    object_story_spec: {
      page_id: pageId,
      link_data: linkData
    }
  };
}

/**
 * Genera el payload de un creativo de carrusel multi-slide
 * @param {Object} params
 * @param {Array<{titulo: string, descripcion: string, urlImagen: string, urlLanding?: string}>} params.tarjetas
 */
export function generarCreativoCarrusel({
  pageId = process.env.META_PAGE_ID,
  urlLandingGlobal = 'https://audiflowai.com',
  textoPrincipal,
  tarjetas = [],
  callToAction = 'LEARN_MORE',
  nombre = null
}) {
  const childAttachments = tarjetas.map((card, idx) => {
    const cardData = {
      link: card.urlLanding || urlLandingGlobal,
      name: card.titulo,
      description: card.descripcion || '',
      call_to_action: {
        type: callToAction,
        value: { link: card.urlLanding || urlLandingGlobal }
      }
    };

    if (card.imageHash) {
      cardData.image_hash = card.imageHash;
    } else if (card.urlImagen) {
      cardData.picture = card.urlImagen;
    }

    return cardData;
  });

  return {
    name: nombre || `Creativo Carrusel - ${Date.now()}`,
    object_story_spec: {
      page_id: pageId,
      link_data: {
        link: urlLandingGlobal,
        message: textoPrincipal,
        child_attachments: childAttachments
      }
    }
  };
}

/**
 * Genera el payload de un creativo de Video / Reel
 */
export function generarCreativoVideo({
  pageId = process.env.META_PAGE_ID,
  urlLanding = 'https://audiflowai.com',
  videoId,
  urlMiniatura,
  texto,
  titulo,
  callToAction = 'LEARN_MORE',
  nombre = null
}) {
  return {
    name: nombre || `Creativo Video - ${Date.now()}`,
    object_story_spec: {
      page_id: pageId,
      video_data: {
        video_id: videoId,
        image_url: urlMiniatura,
        message: texto,
        title: titulo,
        call_to_action: {
          type: callToAction,
          value: { link: urlLanding }
        }
      }
    }
  };
}

export default {
  generarCreativoImagen,
  generarCreativoCarrusel,
  generarCreativoVideo
};
