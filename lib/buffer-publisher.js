import dotenv from 'dotenv';
dotenv.config();

/**
 * ==============================================================================
 * AUDITFLOW AI — BUFFER GRAPHQL INTEGRATION ENGINE (MODERN GRAPHQL SPEC 2026)
 * ==============================================================================
 * Conecta AuditFlow AI a Buffer.com mediante la API oficial GraphQL (https://api.buffer.com)
 * compatible con la Personal API y Organization Channels (LinkedIn, Instagram, Facebook).
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
      throw new Error('Falta BUFFER_ACCESS_TOKEN en las variables de entorno (.env).');
    }

    let response;
    try {
      response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`,
          'User-Agent': 'AuditFlow-AI-Publisher/2.0'
        },
        body: JSON.stringify({ query, variables })
      });
    } catch (networkError) {
      throw new Error(`Error de red con Buffer API: ${networkError.message}`);
    }

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      throw new Error(`Respuesta inválida de Buffer API (HTTP ${response.status}): ${parseError.message}`);
    }

    if (data.errors && data.errors.length > 0) {
      const errorMsg = data.errors.map(e => e.message || JSON.stringify(e)).join(' | ');
      throw new Error(`Buffer GraphQL Error: ${errorMsg}`);
    }

    return data.data;
  }

  /**
   * Obtiene la organización activa del usuario
   */
  async getOrganizationId() {
    const query = `
      query GetAccountOrg {
        account {
          id
          email
          organizations {
            id
            name
          }
        }
      }
    `;
    const data = await this.executeGraphQL(query);
    const orgs = data?.account?.organizations || [];
    if (orgs.length === 0) {
      throw new Error('No se encontró ninguna organización en la cuenta de Buffer.');
    }
    return orgs[0].id;
  }

  /**
   * Obtiene todos los canales sociales conectados (LinkedIn, Instagram, Facebook)
   */
  async getChannels() {
    const orgId = await this.getOrganizationId();
    const query = `
      query GetChannels($input: ChannelsInput!) {
        channels(input: $input) {
          id
          name
          displayName
          service
        }
      }
    `;
    const data = await this.executeGraphQL(query, { input: { organizationId: orgId } });
    return data?.channels || [];
  }

  /**
   * Filtra canales por servicio (ej: ['linkedin'])
   */
  async getChannelsByService(services = ['linkedin']) {
    const channels = await this.getChannels();
    const normalized = services.map(s => s.toLowerCase());
    return channels.filter(c => normalized.includes((c.service || '').toLowerCase()));
  }

  /**
    * Publica un post directamente o lo añade a la cola de Buffer
   */
  async createPost({
    channelId,
    text,
    mode = 'shareNow', // 'shareNow' | 'addToQueue' | 'customScheduled' | 'shareNext'
    dueAt = null,
    assets = [],
    metadata = null,
    service = null
  }) {
    if (!channelId) throw new Error('channelId es requerido para publicar en Buffer.');
    if (!text) throw new Error('text es requerido para publicar en Buffer.');

    // Auto-detectar canal si no se especificó el servicio
    let targetService = (service || '').toLowerCase();
    if (!targetService) {
      if (channelId === '6a970164065799be4669eea1') targetService = 'facebook';
      else if (channelId === '6a970416065799be4669fa58') targetService = 'instagram';
      else if (channelId === '6a97043a065799be4669fadb') targetService = 'linkedin';
    }

    // Estructurar metadata según la plataforma
    let postMetadata = metadata;
    let postAssets = Array.isArray(assets) ? [...assets] : [];

    if (targetService === 'facebook' && !postMetadata?.facebook) {
      postMetadata = {
        ...(postMetadata || {}),
        facebook: { type: 'post' }
      };
    } else if (targetService === 'instagram') {
      if (!postMetadata?.instagram) {
        postMetadata = {
          ...(postMetadata || {}),
          instagram: {
            type: 'post',
            shouldShareToFeed: true
          }
        };
      }
      // Instagram exige al menos 1 imagen o video
      if (postAssets.length === 0) {
        postAssets.push({
          image: {
            url: 'https://audiflowai.com/images/carousel/slide1_cover.jpg'
          }
        });
      }
    }

    const mutation = `
      mutation CreatePost($input: CreatePostInput!) {
        createPost(input: $input) {
          __typename
          ... on PostActionSuccess {
            post {
              id
              status
              text
              dueAt
            }
          }
          ... on RestProxyError {
            message
            code
          }
          ... on UnauthorizedError {
            message
          }
          ... on LimitReachedError {
            message
          }
          ... on InvalidInputError {
            message
          }
          ... on UnexpectedError {
            message
          }
          ... on NotFoundError {
            message
          }
        }
      }
    `;

    const input = {
      channelId,
      text,
      mode,
      schedulingType: 'automatic',
      needsApproval: false,
      assets: postAssets
    };

    if (dueAt) {
      input.dueAt = typeof dueAt === 'string' ? dueAt : dueAt.toISOString();
    }

    if (postMetadata) {
      input.metadata = postMetadata;
    }

    const data = await this.executeGraphQL(mutation, { input });
    const result = data?.createPost;

    if (result?.__typename !== 'PostActionSuccess') {
      const msg = result?.message || JSON.stringify(result);
      throw new Error(`Fallo al publicar en Buffer (${result?.__typename}): ${msg}`);
    }

    return result.post;
  }
}

export default BufferPublisher;
