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
    if (process.env.INSTANTLY_ACTIVE === 'false' || !this.apiKey) {
      console.log('⏸️ [INSTANTLY PAUSADO] El servicio de Instantly no está activo o falta INSTANTLY_API_KEY.');
      return { paused: true, disconnected: true, message: 'Instantly en pausa fiduciaria.' };
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

  /**
   * Obtiene el estado de Warmup y Salud fiduciaria de una cuenta específica
   * Cuenta por defecto: ricardo.audiflowai@gmail.com
   */
  async getWarmupHealth(email = 'ricardo.audiflowai@gmail.com') {
    // Blindaje de Seguridad Inviolable
    if (email === 'rick28191@gmail.com') {
      throw new Error('❌ BLOQUEO FIDUCIARIO: rick28191@gmail.com es la cuenta personal del CEO y está PROHIBIDO usarla en Instantly.');
    }

    const accountsRes = await this.getAccounts();
    if (accountsRes.paused || accountsRes.disconnected) {
      return { active: false, paused: true, score: 0, reason: accountsRes.message };
    }

    const accounts = Array.isArray(accountsRes) ? accountsRes : (accountsRes?.data || []);
    const target = accounts.find(a => (a.email || '').toLowerCase() === email.toLowerCase());

    if (!target) {
      return {
        found: false,
        email,
        active: false,
        score: 0,
        message: `La cuenta ${email} aún no está vinculada en el panel de Instantly.ai.`
      };
    }

    const warmupStatus = target.warmup_status || target.warmup?.status || 'inactive';
    const healthScore = target.health_score ?? target.warmup?.score ?? 0;
    const isReadyForCold = healthScore >= 90;

    return {
      found: true,
      email,
      active: warmupStatus === 'active' || warmupStatus === 'enabled',
      warmupStatus,
      healthScore,
      isReadyForCold,
      statSent: target.warmup?.emails_sent_count || 0,
      statReceived: target.warmup?.emails_received_count || 0
    };
  }
}

