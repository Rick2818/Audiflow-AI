import dotenv from 'dotenv';
dotenv.config();

/**
 * ==============================================================================
 * AUDITFLOW AI — BUFFER GRAPHQL INTEGRATION ENGINE (MODERN API)
 * ==============================================================================
 * Conecta AuditFlow AI a Buffer.com mediante la API oficial GraphQL (api.buffer.com)
 * para publicar y programar simultáneamente en todos los canales vinculados.
 * ==============================================================================
 */

export class BufferPublisher {
  constructor(accessToken = null) {
    this.accessToken = accessToken || process.env.BUFFER_ACCESS_TOKEN || '';
    this.endpoint = 'https://api.buffer.com';
  }

  async executeGraphQL(query, variables = {}) {
    if (!this.accessToken) {
      throw new Error('Falta BUFFER_ACCESS_TOKEN en el archivo .env');
    }

    const res = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`
      },
      body: JSON.stringify({ query, variables })
    });

    const data = await res.json();
    if (data.errors && data.errors.length > 0) {
      throw new Error(data.errors.map(e => e.message).join(' | '));
    }

    return data.data;
  }

  /**
   * Obtiene los canales/canales sociales conectados en Buffer
   */
  async getChannels() {
    const query = `
      query GetChannels {
        account {
          organizations {
            id
            name
            channels {
              id
              name
              service
              serviceId
            }
          }
        }
      }
    `;

    const data = await this.executeGraphQL(query);
    const orgs = data?.account?.organizations || [];
    const channels = [];

    for (const org of orgs) {
      if (org.channels) {
        channels.push(...org.channels);
      }
    }

    return channels;
  }

  /**
   * Crea un post o draft en Buffer
   */
  async createPost({ text, channelId, mediaUrls = [], schedulingType = 'SHARE_NOW' }) {
    const mutation = `
      mutation CreatePost($input: CreatePostInput!) {
        createPost(input: $input) {
          post {
            id
            text
            status
          }
        }
      }
    `;

    const input = {
      channelId: channelId,
      text: text,
      schedulingType: schedulingType, // 'SHARE_NOW' o 'ADD_TO_QUEUE'
    };

    if (mediaUrls && mediaUrls.length > 0) {
      input.assets = mediaUrls.map(url => ({
        type: 'IMAGE',
        url: url
      }));
    }

    return await this.executeGraphQL(mutation, { input });
  }
}
