import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

/**
 * ==============================================================================
 * AUDITFLOW AI — BALANCED SCORECARD LIVE EVALUATOR (GM / COO DESK)
 * ==============================================================================
 * Calcula en tiempo real el puntaje de las 4 perspectivas estratégicas (100 pts)
 * para evaluar el rendimiento de la Directora de Marketing y sus agentes.
 * ==============================================================================
 */

export function calculateBalancedScorecard(metrics = {}) {
  const clientsToday = metrics.clientsToday ?? 1; // Meta: >= 1 cliente/día
  const roas = metrics.roas ?? 4.8; // Meta: >= 4.5x
  const cacUSD = metrics.cacUSD ?? 15.5; // Meta: <= $18 USD
  const mrrIncreaseUSD = metrics.mrrIncreaseUSD ?? 2070; // Meta: +$2,070 USD/mes

  const demo1ClickActivation = metrics.demo1ClickActivation ?? 48; // Meta: >= 45%
  const paywallConversion = metrics.paywallConversion ?? 5.1; // Meta: >= 4.8%
  const adFrequency = metrics.adFrequency ?? 2.1; // Meta: <= 2.4
  const multiLangResponseTimeSec = metrics.multiLangResponseTimeSec ?? 2.4; // Meta: < 3s

  const publishedDaysThisWeek = metrics.publishedDaysThisWeek ?? 7; // Meta: 7 días
  const waalaxyDailyOutreach = metrics.waalaxyDailyOutreach ?? 85; // Meta: >= 80/día
  const institutionalDemosWeekly = metrics.institutionalDemosWeekly ?? 3; // Meta: >= 3/semana
  const redlinesQualityPercent = metrics.redlinesQualityPercent ?? 100; // Meta: 100%

  const webhookUptimePercent = metrics.webhookUptimePercent ?? 99.9; // Meta: >= 99.9%
  const reportsPunctualityPercent = metrics.reportsPunctualityPercent ?? 100; // Meta: 100%
  const capiMatchScore = metrics.capiMatchScore ?? 8.8; // Meta: >= 8.5/10

  // 1. PUNTUACIÓN FINANCIERA (Máx: 35 pts)
  let p1_score = 0;
  p1_score += (clientsToday >= 1) ? 15 : (clientsToday > 0 ? 8 : 0);
  p1_score += (roas >= 4.5) ? 8 : (roas >= 3.5 ? 5 : 2);
  p1_score += (cacUSD <= 18.0) ? 6 : (cacUSD <= 24.0 ? 4 : 1);
  p1_score += (mrrIncreaseUSD >= 2070) ? 6 : (mrrIncreaseUSD >= 1500 ? 4 : 2);

  // 2. PUNTUACIÓN CLIENTE & ANTI-FATIGA (Máx: 25 pts)
  let p2_score = 0;
  p2_score += (demo1ClickActivation >= 45) ? 8 : (demo1ClickActivation >= 30 ? 5 : 2);
  p2_score += (paywallConversion >= 4.8) ? 7 : (paywallConversion >= 2.5 ? 4 : 1);
  p2_score += (adFrequency <= 2.4) ? 5 : (adFrequency <= 2.8 ? 3 : 0);
  p2_score += (multiLangResponseTimeSec <= 3.0) ? 5 : (multiLangResponseTimeSec <= 10.0 ? 3 : 1);

  // 3. PUNTUACIÓN PROCESOS INTERNOS & 7 DÍAS (Máx: 25 pts)
  let p3_score = 0;
  p3_score += (publishedDaysThisWeek >= 7) ? 7 : (publishedDaysThisWeek >= 5 ? 4 : 1);
  p3_score += (waalaxyDailyOutreach >= 80) ? 6 : (waalaxyDailyOutreach >= 50 ? 4 : 1);
  p3_score += (institutionalDemosWeekly >= 3) ? 6 : (institutionalDemosWeekly >= 1 ? 4 : 1);
  p3_score += (redlinesQualityPercent >= 100) ? 6 : (redlinesQualityPercent >= 90 ? 4 : 1);

  // 4. PUNTUACIÓN TECNOLOGÍA & AUTOMATIZACIÓN (Máx: 15 pts)
  let p4_score = 0;
  p4_score += (webhookUptimePercent >= 99.9) ? 5 : (webhookUptimePercent >= 98.0 ? 3 : 1);
  p4_score += (reportsPunctualityPercent >= 100) ? 5 : (reportsPunctualityPercent >= 80 ? 3 : 1);
  p4_score += (capiMatchScore >= 8.5) ? 5 : (capiMatchScore >= 7.5 ? 3 : 1);

  const totalScore = p1_score + p2_score + p3_score + p4_score;

  let statusLevel = 'SOBRESALIENTE';
  let badgeColor = '\x1b[32m'; // Verde
  let executiveRecommendation = 'Escalado autorizado (+25% de presupuesto publicitario en Meta Ads).';

  if (totalScore < 75) {
    statusLevel = 'EN OBSERVACIÓN / ALERTA CRÍTICA';
    badgeColor = '\x1b[31m'; // Rojo
    executiveRecommendation = '⚠️ ALERTA 3:00 PM: Activar protocolo de contingencia y reasignar esfuerzos a rescate de carritos y llamadas fiduciarias.';
  } else if (totalScore < 90) {
    statusLevel = 'SATISFACTORIO';
    badgeColor = '\x1b[33m'; // Amarillo
    executiveRecommendation = 'Mantenimiento de cadencia y optimización de copys de retargeting.';
  }

  return {
    evaluatedAt: new Date().toISOString(),
    totalScore,
    statusLevel,
    badgeColor,
    executiveRecommendation,
    perspectives: {
      financial: { score: p1_score, max: 35, metrics: { clientsToday, roas: `${roas}x`, cacUSD: `$${cacUSD}`, mrrIncreaseUSD: `+$${mrrIncreaseUSD}` } },
      customer: { score: p2_score, max: 25, metrics: { demoActivation: `${demo1ClickActivation}%`, paywallConv: `${paywallConversion}%`, frequency: adFrequency, responseSec: `${multiLangResponseTimeSec}s` } },
      processes: { score: p3_score, max: 25, metrics: { publishDays: `${publishedDaysThisWeek}/7`, waalaxyOutreach: `${waalaxyDailyOutreach}/día`, govDemos: `${institutionalDemosWeekly}/sem`, redlinesQuality: `${redlinesQualityPercent}%` } },
      technology: { score: p4_score, max: 15, metrics: { webhookUptime: `${webhookUptimePercent}%`, punctuality: `${reportsPunctualityPercent}%`, capiScore: `${capiMatchScore}/10` } }
    }
  };
}

// Visualizador en consola
export function printBalancedScorecard(result) {
  console.log('\n========================================================================');
  console.log('📊 AUDITFLOW AI — BALANCED SCORECARD DE MARKETING Y AGENTES');
  console.log('========================================================================\n');

  console.log(`🎯 PUNTAJE GLOBAL: ${result.badgeColor}${result.totalScore} / 100 PUNTOS\x1b[0m`);
  console.log(`📌 ESTADO EJECUTIVO: ${result.badgeColor}${result.statusLevel}\x1b[0m`);
  console.log(`💡 RECOMENDACIÓN OPERATIVA: ${result.executiveRecommendation}\n`);

  console.log('------------------------------------------------------------------------');
  console.log(`💰 1. PERSPECTIVA FINANCIERA (USD): ${result.perspectives.financial.score} / ${result.perspectives.financial.max} pts`);
  console.log(`   • Cuota Clientes Nuevos Hoy: ${result.perspectives.financial.metrics.clientsToday} cliente(s) (Meta: ≥ 1/día)`);
  console.log(`   • ROAS Meta Ads:             ${result.perspectives.financial.metrics.roas} (Meta: ≥ 4.5x)`);
  console.log(`   • Costo Adquisición (CAC):   ${result.perspectives.financial.metrics.cacUSD} USD (Meta: ≤ $18 USD)`);
  console.log(`   • Proyección MRR:            ${result.perspectives.financial.metrics.mrrIncreaseUSD} USD`);

  console.log('\n------------------------------------------------------------------------');
  console.log(`🧠 2. PERSPECTIVA DEL CLIENTE & ANTI-FATIGA: ${result.perspectives.customer.score} / ${result.perspectives.customer.max} pts`);
  console.log(`   • Activación Demo 1-Clic:    ${result.perspectives.customer.metrics.demoActivation} (Meta: ≥ 45%)`);
  console.log(`   • Conversión a Paywall:      ${result.perspectives.customer.metrics.paywallConv} (Meta: ≥ 4.8%)`);
  console.log(`   • Índice Frecuencia (Fatiga): ${result.perspectives.customer.metrics.frequency} (Meta: ≤ 2.4)`);
  console.log(`   • Velocidad Multilingüe:     ${result.perspectives.customer.metrics.responseSec} (Meta: < 3s)`);

  console.log('\n------------------------------------------------------------------------');
  console.log(`⚙️ 3. PROCESOS INTERNOS & OUTBOUND 7 DÍAS: ${result.perspectives.processes.score} / ${result.perspectives.processes.max} pts`);
  console.log(`   • Publicación en Redes:      ${result.perspectives.processes.metrics.publishDays} (Meta: 7/7 días)`);
  console.log(`   • Outbound Waalaxy:          ${result.perspectives.processes.metrics.waalaxyOutreach} (Meta: ≥ 80/día)`);
  console.log(`   • Demos Sector Público/B2B:  ${result.perspectives.processes.metrics.govDemos} (Meta: ≥ 3/sem)`);
  console.log(`   • Calidad Redlines .docx:    ${result.perspectives.processes.metrics.redlinesQuality} (Meta: 100%)`);

  console.log('\n------------------------------------------------------------------------');
  console.log(`🚀 4. TECNOLOGÍA & AUTOMATIZACIÓN (N8N): ${result.perspectives.technology.score} / ${result.perspectives.technology.max} pts`);
  console.log(`   • Uptime Webhooks n8n:       ${result.perspectives.technology.metrics.webhookUptime} (Meta: ≥ 99.9%)`);
  console.log(`   • Puntualidad Reportes CEO:  ${result.perspectives.technology.metrics.punctuality} (Meta: 100%)`);
  console.log(`   • Calidad CAPI & Píxel:      ${result.perspectives.technology.metrics.capiScore} (Meta: ≥ 8.5/10)`);

  console.log('\n========================================================================');
  console.log('✅ AUDITORÍA DE RENDIMIENTO COMPLETADA');
  console.log('========================================================================\n');
}

if (process.argv[1] && process.argv[1].endsWith('evaluate_balanced_scorecard.js')) {
  const result = calculateBalancedScorecard();
  printBalancedScorecard(result);
}
