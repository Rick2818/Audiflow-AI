/**
 * ==============================================================================
 * AUDITFLOW AI — TRIANGULAR AGENT BUS & EXECUTIVE DISPATCH CONTRACT (SSOT)
 * ==============================================================================
 * Centraliza la comunicación estructurada y fiduciaria entre los 5 roles clave:
 * 1. Directora de Marketing & Ventas (CMVO)
 * 2. Gerente General y Director de Operaciones (GM / COO)
 * 3. Don Ricardo (Director General / CEO)
 * 4. Psicólogo del Consumidor & Anti-Fatiga (Diagnostician)
 * 5. Especialista en LinkedIn (Thought Leadership B2B)
 * 6. Especialista en Buffer (Distribución Multicanal)
 * ==============================================================================
 */

export const AUTHORIZED_ROLES = Object.freeze([
  'marketing-director',
  'general-manager-coo',
  'consumer-behavior-diagnostician',
  'linkedin-specialist',
  'buffer-specialist',
  'ceo-ricardo'
]);

export class TriangularAgentBus {
  constructor() {
    this.eventLog = [];
    this.activeMetrics = {
      grossRevenueToday: 0.00,
      mrr: 0.00,
      arr: 0.00,
      adFatigueDetected: false,
      dailyTargetUSD: 300.00
    };
  }

  /**
   * Valida que un mensaje cumpla con la regla inmutable de síntesis ejecutiva (50% más conciso)
   */
  validateExecutiveSynthesis(text) {
    if (!text || typeof text !== 'string') return false;
    const words = text.trim().split(/\s+/).length;
    // La regla de síntesis exige mensajes directos de menos de 250 palabras por despacho ejecutivo
    return words <= 250;
  }

  /**
   * Canal 1: Directora de Marketing (CMVO) -> Don Ricardo (Director General)
   */
  dispatchCMVOtoCEO({ title, summary, metrics = {}, timeSlot = '2:00 PM' }) {
    if (!title || !summary) {
      throw new Error('[AgentBus] CMVO -> CEO requiere título y resumen ejecutivo.');
    }

    const payload = {
      id: `CMVO_CEO_${Date.now()}`,
      from: 'marketing-director',
      to: 'ceo-ricardo',
      channel: 'EXECUTIVE_CONSOLE_AND_RESEND',
      timeSlot,
      timestamp: new Date().toISOString(),
      senderEmail: 'cmvo@audiflowai.com',
      recipientEmail: 'rick28191@gmail.com',
      title,
      summary,
      metrics: {
        grossRevenueToday: metrics.grossRevenueToday || 0.00,
        pipelineLeads: metrics.pipelineLeads || 250,
        activeDemos: metrics.activeDemos || 0
      },
      synthesisRulePassed: this.validateExecutiveSynthesis(summary)
    };

    this.eventLog.push(payload);
    return payload;
  }

  /**
   * Canal 2: Directora de Marketing (CMVO) <-> Gerente General (COO)
   */
  syncCMVOandCOO({ campaignMetrics = {}, operationalNotes = '' }) {
    const payload = {
      id: `SYNC_CMVO_COO_${Date.now()}`,
      from: 'marketing-director',
      to: 'general-manager-coo',
      channel: 'INTERNAL_FIDUCIARY_BUS',
      timestamp: new Date().toISOString(),
      campaignMetrics: {
        spendUSD: campaignMetrics.spendUSD || 0.00,
        impressions: campaignMetrics.impressions || 0,
        conversions: campaignMetrics.conversions || 0,
        roas: campaignMetrics.roas || 0.0
      },
      operationalNotes,
      status: 'SYNCHRONIZED'
    };

    this.eventLog.push(payload);
    return payload;
  }

  /**
   * Canal 3: Gerente General (COO) -> Don Ricardo (Director General)
   */
  dispatchCOOActionPlan({ revenueTodayUSD = 0, adSpendUSD = 0, actionItems = [] }) {
    const netProfitUSD = revenueTodayUSD - adSpendUSD;

    const payload = {
      id: `COO_ACTION_PLAN_${Date.now()}`,
      from: 'general-manager-coo',
      to: 'ceo-ricardo',
      channel: 'EXECUTIVE_FINANCIAL_DISPATCH',
      timestamp: new Date().toISOString(),
      financials: {
        revenueTodayUSD,
        adSpendUSD,
        netProfitUSD,
        mrrUSD: this.activeMetrics.mrr,
        targetDailyUSD: this.activeMetrics.dailyTargetUSD,
        targetAchieved: revenueTodayUSD >= this.activeMetrics.dailyTargetUSD
      },
      actionItems: actionItems.slice(0, 3), // Máximo 3 prioridades directas
      status: 'DISPATCHED_TO_CEO'
    };

    this.eventLog.push(payload);
    return payload;
  }

  /**
   * Módulo Auxiliar: Diagnóstico del Psicólogo (Anti-Fatiga y Salud del Embudo)
   */
  evaluateAudienceHealth({ frequency = 1.0, ctr = 2.5, bounceRate = '10%' }) {
    const isFatigued = frequency >= 2.8 || ctr < 1.5;
    this.activeMetrics.adFatigueDetected = isFatigued;

    const report = {
      from: 'consumer-behavior-diagnostician',
      to: 'marketing-director',
      timestamp: new Date().toISOString(),
      frequency,
      ctr,
      bounceRate,
      adFatigueDetected: isFatigued,
      recommendedAction: isFatigued
        ? 'ROTAR_CREATIVOS: Saturación detectada. Aplicar nuevo gancho y ángulo de privacidad en RAM.'
        : 'SALUDABLE: Audiencia receptiva. Mantener cadencia de publicación.'
    };

    this.eventLog.push(report);
    return report;
  }

  /**
   * Módulo Auxiliar: Auditoría de Post B2B de LinkedIn
   */
  auditLinkedInPost({ hookText, bodyText, ctaText }) {
    if (!hookText || !bodyText) {
      throw new Error('[AgentBus] LinkedIn Specialist requiere hookText y bodyText.');
    }

    const hasClearLineBreaks = bodyText.includes('\n\n');
    const hasDwellTimeOptimization = bodyText.length >= 200;

    return {
      from: 'linkedin-specialist',
      to: 'buffer-specialist',
      timestamp: new Date().toISOString(),
      hookText,
      hasClearLineBreaks,
      hasDwellTimeOptimization,
      ctaText: ctaText || 'Comenta AUDITORIA para acceder al informe gratuito',
      approvedForBuffer: hasClearLineBreaks && hasDwellTimeOptimization
    };
  }

  /**
   * Historial de eventos del bus
   */
  getAuditTrail() {
    return [...this.eventLog];
  }
}

export const agentBus = new TriangularAgentBus();
export default agentBus;
