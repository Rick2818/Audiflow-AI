import dotenv from 'dotenv';
dotenv.config();

/**
 * ==============================================================================
 * AUDITFLOW AI — META ADS & INSTAGRAM MCP INTEGRATION ENGINE
 * ==============================================================================
 * Conecta la infraestructura de AuditFlow AI directamente a:
 * 1. Meta Marketing API (Campañas, Conjuntos de Anuncios, Creativos en Instagram)
 * 2. Instagram Graph API (Publicación de Carruseles, Reels, Métricas e Inmails/DMs)
 * ==============================================================================
 */

export class MetaAdsInstagramMcp {
  constructor(config = {}) {
    this.graphApiVersion = 'v19.0';
    this.baseUrl = `https://graph.facebook.com/${this.graphApiVersion}`;
    this.accessToken = config.accessToken || process.env.META_ACCESS_TOKEN || process.env.INSTAGRAM_ACCESS_TOKEN || '';
    this.adAccountId = config.adAccountId || process.env.META_AD_ACCOUNT_ID || '';
    this.instagramAccountId = config.instagramAccountId || process.env.INSTAGRAM_ACCOUNT_ID || '';
    this.appUrl = (process.env.APP_URL || 'https://audiflowai.com').replace(/\/+$/, '');
    this.pageId = config.pageId || process.env.META_PAGE_ID || '1285349454663691';
    this.pageAccessToken = null;
  }

  /**
   * Obtiene el Page Access Token dinámicamente desde me/accounts
   */
  async getPageAccessToken() {
    if (this.pageAccessToken) return this.pageAccessToken;
    try {
      const res = await this.request('/me/accounts', 'GET');
      const page = res.data?.find(p => p.id === this.pageId || p.name.toLowerCase().includes('audi'));
      if (page && page.access_token) {
        this.pageAccessToken = page.access_token;
        return this.pageAccessToken;
      }
    } catch (err) {
      console.warn('[MetaAdsInstagramMcp] No se pudo obtener page token dinámico, usando accessToken general:', err.message);
    }
    return this.accessToken;
  }

  /**
   * Helper para peticiones HTTP a la Graph API
   */
  async request(endpoint, method = 'GET', data = null, customToken = null) {
    const token = customToken || this.accessToken;
    let url = `${this.baseUrl}${endpoint}`;

    const headers = {
      'Content-Type': 'application/json'
    };

    const options = { method, headers };

    if (method === 'GET') {
      const separator = url.includes('?') ? '&' : '?';
      url += `${separator}access_token=${encodeURIComponent(token)}`;
    } else if (data) {
      options.body = JSON.stringify({
        ...data,
        access_token: token
      });
    }

    try {
      const response = await fetch(url, options);
      const json = await response.json();
      if (!response.ok || json.error) {
        throw new Error(json.error?.message || `HTTP ${response.status}: ${JSON.stringify(json)}`);
      }
      return json;
    } catch (err) {
      console.error(`[MetaAdsInstagramMcp] Error en ${method} ${endpoint}:`, err.message);
      throw err;
    }
  }

  // ============================================================================
  // FACEBOOK PAGE GRAPH API METHODS (AUTONOMOUS POSTING)
  // ============================================================================

  /**
   * Publica un post de texto / enlace en la Página de Facebook
   */
  async publishFacebookPost({ message, link = null }) {
    const pageToken = await this.getPageAccessToken();
    const payload = { message };
    if (link) payload.link = link;

    console.log(`[MetaAdsInstagramMcp] Publicando post en Facebook Page (${this.pageId})...`);
    const res = await this.request(`/${this.pageId}/feed`, 'POST', payload, pageToken);
    return {
      status: 'success',
      platform: 'facebook',
      postId: res.id,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Publica una foto con pie de foto en la Página de Facebook
   */
  async publishFacebookPhoto({ photoUrl, caption = '' }) {
    const pageToken = await this.getPageAccessToken();
    const payload = {
      url: photoUrl,
      caption: caption
    };

    console.log(`[MetaAdsInstagramMcp] Publicando foto en Facebook Page (${this.pageId})...`);
    const res = await this.request(`/${this.pageId}/photos`, 'POST', payload, pageToken);
    return {
      status: 'success',
      platform: 'facebook',
      photoId: res.id,
      postId: res.post_id || res.id,
      timestamp: new Date().toISOString()
    };
  }

  // ============================================================================
  // INSTAGRAM GRAPH API METHODS
  // ============================================================================

  /**
   * Publica un Carrusel en Instagram
   */
  async publishCarousel({ mediaUrls, caption }) {
    if (!this.instagramAccountId) {
      throw new Error('INSTAGRAM_ACCOUNT_ID no configurado en el entorno.');
    }
    if (!Array.isArray(mediaUrls) || mediaUrls.length < 2) {
      throw new Error('Un carrusel requiere al menos 2 URLs de imágenes.');
    }

    console.log(`[MetaAdsInstagramMcp] Subiendo ${mediaUrls.length} slides de carrusel...`);

    // 1. Subir cada slide hijo
    const itemContainerIds = [];
    for (const url of mediaUrls) {
      const res = await this.request(`/${this.instagramAccountId}/media`, 'POST', {
        image_url: url,
        is_carousel_item: true
      });
      itemContainerIds.push(res.id);
    }

    // 2. Crear contenedor padre de carrusel
    console.log('[MetaAdsInstagramMcp] Creando contenedor padre de carrusel...');
    const parentContainer = await this.request(`/${this.instagramAccountId}/media`, 'POST', {
      media_type: 'CAROUSEL',
      children: itemContainerIds.join(','),
      caption: caption
    });

    // 3. Publicar el carrusel
    console.log('[MetaAdsInstagramMcp] Publicando carrusel en vivo...');
    const publishRes = await this.request(`/${this.instagramAccountId}/media_publish`, 'POST', {
      creation_id: parentContainer.id
    });

    return {
      status: 'success',
      mediaId: publishRes.id,
      containerId: parentContainer.id,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Publica un Reel en Instagram
   */
  async publishReel({ videoUrl, caption, coverUrl }) {
    if (!this.instagramAccountId) throw new Error('INSTAGRAM_ACCOUNT_ID no configurado.');

    console.log('[MetaAdsInstagramMcp] Creando contenedor de Reel...');
    const payload = {
      media_type: 'REELS',
      video_url: videoUrl,
      caption: caption
    };
    if (coverUrl) payload.cover_url = coverUrl;

    const container = await this.request(`/${this.instagramAccountId}/media`, 'POST', payload);

    // Esperar a que el video sea procesado
    console.log('[MetaAdsInstagramMcp] Esperando procesamiento del video (10s)...');
    await new Promise(r => setTimeout(r, 10000));

    // Publicar Reel
    const publishRes = await this.request(`/${this.instagramAccountId}/media_publish`, 'POST', {
      creation_id: container.id
    });

    return {
      status: 'success',
      mediaId: publishRes.id,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Obtiene métricas e insights de la cuenta de Instagram
   */
  async getInstagramInsights(metrics = ['impressions', 'reach', 'profile_views', 'total_interactions']) {
    if (!this.instagramAccountId) throw new Error('INSTAGRAM_ACCOUNT_ID no configurado.');
    return await this.request(`/${this.instagramAccountId}/insights?metric=${metrics.join(',')}&period=day`);
  }

  // ============================================================================
  // META MARKETING & ADS API METHODS (INSTAGRAM PLACEMENTS)
  // ============================================================================

  /**
   * Crea una Campaña en Meta Ads orientada a Instagram
   */
  async createCampaign({ name, objective = 'OUTCOME_LEADS', dailyBudget = 2000, status = 'PAUSED' }) {
    const actId = this.adAccountId.startsWith('act_') ? this.adAccountId : `act_${this.adAccountId}`;
    
    const payload = {
      name: name || `[AuditFlow AI] Instagram Lead Gen — ${new Date().toISOString().split('T')[0]}`,
      objective: objective,
      status: status,
      special_ad_categories: ['NONE']
    };

    const campaign = await this.request(`/${actId}/campaigns`, 'POST', payload);
    return {
      campaignId: campaign.id,
      name: payload.name,
      objective,
      status
    };
  }

  /**
   * Crea un Conjunto de Anuncios (Ad Set) optimizado para Instagram Feeds & Reels
   */
  async createInstagramAdSet({ campaignId, name, dailyBudgetInCents = 1500, countries = ['MX', 'CO', 'CL', 'PE', 'PA', 'ES'] }) {
    const actId = this.adAccountId.startsWith('act_') ? this.adAccountId : `act_${this.adAccountId}`;

    const payload = {
      name: name || `[AdSet] Instagram B2B Legal/Finance — ${countries.join('/')}`,
      campaign_id: campaignId,
      daily_budget: dailyBudgetInCents,
      billing_event: 'IMPRESSIONS',
      optimization_goal: 'LEAD_GENERATION',
      bid_strategy: 'LOWEST_COST_WITHOUT_BID_CAP',
      targeting: {
        geo_locations: {
          countries: countries
        },
        age_min: 25,
        age_max: 65,
        publisher_platforms: ['instagram'],
        instagram_positions: ['stream', 'story', 'reels', 'explore'],
        flexible_spec: [
          {
            interests: [
              { name: 'Corporate law' },
              { name: 'Financial audit' },
              { name: 'Chief Financial Officer' },
              { name: 'General counsel' }
            ]
          }
        ]
      },
      status: 'PAUSED'
    };

    const adSet = await this.request(`/${actId}/adsets`, 'POST', payload);
    return {
      adSetId: adSet.id,
      campaignId,
      status: 'PAUSED'
    };
  }
}
