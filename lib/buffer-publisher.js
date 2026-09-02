import dotenv from 'dotenv';
dotenv.config();

/**
 * ==============================================================================
 * AUDITFLOW AI — BUFFER GRAPHQL INTEGRATION ENGINE (MODERN GRAPHQL SPEC)
 * ==============================================================================
 * Conecta AuditFlow AI a Buffer.com mediante la API oficial GraphQL (https://api.buffer.com)
 * para publicar y programar simultáneamente en Facebook Page, Instagram Business,
 * LinkedIn Company/Profile, X (Twitter), Pinterest, Threads, etc.
 * ==============================================================================
 */

export class BufferPublisher {
  constructor(accessToken = null) {
    this.accessToken = (accessToken || process.env.BUFFER_ACCESS_TOKEN || '').trim();
    this.endpoint = 'https://api.buffer.com';
  }

  /**
   * Ejecuta consultas y mutaciones GraphQL contra Buffer API
   */
  async executeGraphQL(query, variables = {}) {
    if (!this.accessToken) {
      throw new Error(
        'Falta BUFFER_ACCESS_TOKEN en las variables de entorno (.env).\n' +
        '👉 Obtén tu Token en: https://buffer.com/manage/apps (Personal Access Token / Developer API).'
      );
    }

    let response;
    try {
      response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`,
          'User-Agent': 'AuditFlow-AI-Publisher/1.0'
        },
        body: JSON.stringify({ query, variables })
      });
    } catch (networkError) {
      throw new Error(`Error de red al conectar con Buffer API (${this.endpoint}): ${networkError.message}`);
    }

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      throw new Error(`Respuesta inválida del servidor Buffer (HTTP ${response.status}): ${parseError.message}`);
    }

    if (data.errors && data.errors.length > 0) {
      const errorMsg = data.errors.map(e => e.message || JSON.stringify(e)).join(' | ');
      throw new Error(`Buffer GraphQL Error: ${errorMsg}`);
    }

    return data.data;
  }

  /**
   * Obtiene la cuenta y todos los canales sociales conectados (Facebook, Instagram, LinkedIn, etc.)
   */
  async getChannels() {
    const query = `
      query GetAccountChannels {
        account {
          id
          email
          organizations {
            id
            name
            channels {
              id
              name
              displayName
              service
              serviceId
              avatar
              isDisconnected
              isLocked
              type
            }
          }
        }
      }
    `;

    const data = await this.executeGraphQL(query);
    const orgs = data?.account?.organizations || [];
    const channels = [];

    for (const org of orgs) {
      if (Array.isArray(org.channels)) {
        org.channels.forEach(ch => {
          channels.push({
            ...ch,
            organizationId: org.id,
            organizationName: org.name
          });
        });
      }
    }

    return channels;
  }

  /**
   * Filtra canales por tipo de red social (facebook, instagram, linkedin, etc.)
   */
  async getChannelsByService(allowedServices = ['facebook', 'instagram', 'linkedin']) {
    const channels = await this.getChannels();
    const normalized = allowedServices.map(s => s.toLowerCase());
    return channels.filter(c => normalized.includes((c.service || '').toLowerCase()) && !c.isDisconnected);
  }

  /**
   * Publica un post en un canal específico de Buffer
   * @param {Object} options
   * @param {string} options.channelId ID del canal social en Buffer
   * @param {string} options.text Texto del post (incluye enlaces y hashtags)
   * @param {string[]} [options.mediaUrls] URLs públicas de imágenes
   * @param {string[]} [options.videoUrls] URLs públicas de videos
   * @param {'shareNow'|'addToQueue'|'customScheduled'|'shareNext'} [options.mode='shareNow'] Modo de publicación
   * @param {'automatic'|'notification'} [options.schedulingType='automatic'] Tipo de programación
   * @param {string} [options.dueAt] Fecha ISO 8601 (para customScheduled)
   * @param {boolean} [options.saveToDraft=false] Guardar como borrador
   */
  async createPost({
    channelId,
    text,
    mediaUrls = [],
    videoUrls = [],
    mode = 'shareNow',
    schedulingType = 'automatic',
    dueAt = null,
    saveToDraft = false
  }) {
    if (!channelId) {
      throw new Error('channelId es obligatorio para crear un post en Buffer.');
    }
    if (!text && (!mediaUrls || mediaUrls.length === 0) && (!videoUrls || videoUrls.length === 0)) {
      throw new Error('El post debe contener al menos texto o contenido multimedia (imágenes/videos).');
    }

    const mutation = `
      mutation CreatePost($input: CreatePostInput!) {
        createPost(input: $input) {
          __typename
          ... on PostActionSuccess {
            post {
              id
              text
              status
              createdAt
              dueAt
            }
          }
          ... on MutationError {
            message
          }
        }
      }
    `;

    // Formatear assets según el schema GraphQL de Buffer (AssetInput)
    const assets = [];
    if (Array.isArray(mediaUrls)) {
      mediaUrls.forEach(url => {
        if (url && typeof url === 'string') {
          assets.push({ image: { url: url.trim() } });
        }
      });
    }
    if (Array.isArray(videoUrls)) {
      videoUrls.forEach(url => {
        if (url && typeof url === 'string') {
          assets.push({ video: { url: url.trim() } });
        }
      });
    }

    const input = {
      channelId,
      text: text || '',
      schedulingType: schedulingType || 'automatic',
      mode: mode || 'shareNow',
      saveToDraft: Boolean(saveToDraft),
      source: 'auditflow_ai'
    };

    if (assets.length > 0) {
      input.assets = assets;
    }

    if (dueAt && mode === 'customScheduled') {
      input.dueAt = dueAt;
    }

    const result = await this.executeGraphQL(mutation, { input });
    const payload = result?.createPost;

    if (!payload) {
      throw new Error('No se recibió respuesta del mutation createPost de Buffer.');
    }

    if (payload.__typename && payload.__typename.endsWith('Error')) {
      throw new Error(`Error en Buffer API (${payload.__typename}): ${payload.message || 'Error desconocido'}`);
    }

    if (payload.post) {
      return {
        success: true,
        postId: payload.post.id,
        status: payload.post.status,
        dueAt: payload.post.dueAt,
        createdAt: payload.post.createdAt,
        raw: payload.post
      };
    }

    return {
      success: true,
      raw: payload
    };
  }

  /**
   * Despacha una publicación simultáneamente a todos los canales conectados
   * @param {Object} postData
   */
  async broadcastPost(postData) {
    const channels = await this.getChannels();
    const results = [];

    if (!channels || channels.length === 0) {
      return {
        total: 0,
        published: 0,
        failed: 0,
        results: [],
        message: 'No hay canales sociales vinculados en Buffer.'
      };
    }

    for (const channel of channels) {
      try {
        const res = await this.createPost({
          channelId: channel.id,
          text: postData.text,
          mediaUrls: postData.mediaUrls || [],
          videoUrls: postData.videoUrls || [],
          mode: postData.mode || 'shareNow',
          schedulingType: postData.schedulingType || 'automatic',
          dueAt: postData.dueAt || null,
          saveToDraft: postData.saveToDraft || false
        });

        results.push({
          channelId: channel.id,
          channelName: channel.name,
          service: channel.service,
          success: true,
          postId: res.postId,
          status: res.status
        });
      } catch (err) {
        results.push({
          channelId: channel.id,
          channelName: channel.name,
          service: channel.service,
          success: false,
          error: err.message
        });
      }
    }

    const published = results.filter(r => r.success).length;
    return {
      total: channels.length,
      published,
      failed: channels.length - published,
      results
    };
  }
}
