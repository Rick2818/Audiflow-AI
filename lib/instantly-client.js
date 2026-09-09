import dotenv from 'dotenv';
dotenv.config();

/**
 * ==============================================================================
 * AUDITFLOW AI — CLIENTE DE INTEGRACIÓN INSTANTLY.AI (API V2 & WARMUP MONITOR)
 * ==============================================================================
 * Permite gestionar campañas de cold email, monitorear el estado del calentamiento
 * de cuentas (warmup) y sincronizar prospectos extraídos de Waalaxy/LinkedIn.
 * ==============================================================================
 */

export class InstantlyClient {
  constructor(apiKey = null) {
    this.apiKey = (apiKey || process.env.INSTANTLY_API_KEY || '').trim();
    this.baseUrl = 'https://api.instantly.ai/api/v2';
  }

  async request(endpoint, method = 'GET', body = null) {
    if (!this.apiKey) {
      throw new Error('Falta INSTANTLY_API_KEY en las variables de entorno (.env).');
    }

    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };

    const options = { method, headers };
    if (body) {
      options.body = JSON.stringify(body);
    }

    const res = await fetch(`${this.baseUrl}${endpoint}`, options);
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Instantly API Error (HTTP ${res.status}): ${errText}`);
    }

    return await res.json();
  }

  /**
   * Obtiene la lista de cuentas conectadas y su estado de Warmup
   */
  async getAccounts() {
    return await this.request('/accounts');
  }

  /**
   * Obtiene todas las campañas activas y métricas
   */
  async getCampaigns() {
    return await this.request('/campaigns');
  }

  /**
   * Añade prospectos calificados a una campaña de Instantly
   */
  async addLeadsToCampaign(campaignId, leads = []) {
    return await this.request(`/campaigns/${campaignId}/leads`, 'POST', {
      leads: leads.map(l => ({
        email: l.email,
        first_name: l.firstName || l.name?.split(' ')[0] || '',
        last_name: l.lastName || l.name?.split(' ').slice(1).join(' ') || '',
        company_name: l.company || l.firm || '',
        custom_variables: {
          city: l.city || '',
          country: l.country || '',
          trial_url: l.trialUrl || 'https://audiflowai.com/?ref=instantly-cold'
        }
      }))
    });
  }
}
