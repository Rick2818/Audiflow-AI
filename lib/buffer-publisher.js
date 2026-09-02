import dotenv from 'dotenv';
dotenv.config();

/**
 * ==============================================================================
 * AUDITFLOW AI — BUFFER INTEGRATION ENGINE (ZERO META/LINKEDIN BUREAUCRACY)
 * ==============================================================================
 * Conecta AuditFlow AI a Buffer para publicar simultáneamente en:
 * 1. Facebook Page (Audiflowai.com)
 * 2. Instagram Business (Audiflow AI)
 * 3. LinkedIn Company Page
 * Sin lidiar con Graph API Explorer, OAuth popups, ni permisos temporales.
 * ==============================================================================
 */

export class BufferPublisher {
  constructor(accessToken = null) {
    this.accessToken = accessToken || process.env.BUFFER_ACCESS_TOKEN || '';
    this.baseUrl = 'https://api.bufferapp.com/1';
  }

  /**
   * Obtiene todos los perfiles conectados en Buffer (FB, IG, LinkedIn)
   */
  async getProfiles() {
    if (!this.accessToken) {
      throw new Error('No se ha configurado BUFFER_ACCESS_TOKEN en el archivo .env');
    }

    const res = await fetch(${this.baseUrl}/profiles.json?access_token=);
    const data = await res.json();

    if (!res.ok || data.error) {
      throw new Error(data.error || Error al consultar perfiles de Buffer (Status: ));
    }

    return data;
  }

  /**
   * Publica un post en uno o todos los perfiles conectados en Buffer
   * @param {Object} params
   * @param {string} params.text - Texto del post
   * @param {Array<string>} params.mediaUrls - URLs de imágenes o videos adjuntos
   * @param {Array<string>} [params.profileIds] - IDs de perfiles específicos (opcional, por defecto todos)
   * @param {boolean} [params.now=true] - Si se publica de inmediato o se encola en el horario de Buffer
   */
  async publish({ text, mediaUrls = [], profileIds = null, now = true }) {
    if (!this.accessToken) {
      throw new Error('Falta BUFFER_ACCESS_TOKEN en el archivo .env');
    }

    let targetProfileIds = profileIds;

    // Si no se pasaron profileIds específicos, obtenemos todos los canales conectados
    if (!targetProfileIds || targetProfileIds.length === 0) {
      const profiles = await this.getProfiles();
      targetProfileIds = profiles.map(p => p.id);
      console.log([Buffer] Perfiles detectados ():, profiles.map(p => ${p.formatted_service} (@)).join(', '));
    }

    if (targetProfileIds.length === 0) {
      throw new Error('No hay canales sociales conectados en tu cuenta de Buffer.');
    }

    const results = [];

    // Buffer API usa formato application/x-www-form-urlencoded
    for (const pid of targetProfileIds) {
      const params = new URLSearchParams();
      params.append('text', text);
      params.append('profile_ids[]', pid);
      params.append('now', now ? 'true' : 'false');

      if (mediaUrls && mediaUrls.length > 0) {
        params.append('media[photo]', mediaUrls[0]);
        if (mediaUrls.length > 1) {
          mediaUrls.slice(1).forEach(m => params.append('extra_media[]', m));
        }
      }

      console.log(⏳ [Buffer] Enviando publicación al perfil ID: 11008...);
      const res = await fetch(${this.baseUrl}/updates/create.json?access_token=, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      });

      const json = await res.json();
      results.push({ profileId: pid, response: json });
    }

    return {
      status: 'success',
      totalDispatched: results.length,
      details: results
    };
  }
}
