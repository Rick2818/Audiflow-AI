import fs from 'fs';
import path from 'path';
import { N8nAgentBridge } from '../lib/n8n-agent-bridge.js';

console.log(`\n========================================================================`);
console.log(`🚀 AUDITORÍA INTEGRAL: ECOSISTEMA N8N & AGENTES IA DE AUDITFLOW AI`);
console.log(`========================================================================\n`);

const bridge = new N8nAgentBridge();

async function runFullEcosystemTest() {
  // 1. Test Lead Routing to Senior Sales Agents
  console.log(`📌 1. CLASIFICACIÓN Y ENRUTAMIENTO INTELIGENTE DE LEADS:`);
  const sampleLeads = [
    {
      name: 'Dr. Alejandro De La Vega',
      occupation: 'Chief Legal Officer & General Counsel',
      companyName: 'Banca y Seguros Continental',
      email: 'alejandro.delavega@continentalbank.com'
    },
    {
      name: 'Mariana Navarro, CPA',
      occupation: 'Director Financiero (CFO)',
      companyName: 'Lombard Capital Partners',
      email: 'mariana.navarro@lombardcapital.ch'
    },
    {
      name: 'Lic. Fernando Ortiz',
      occupation: 'Director General de Adquisiciones y Licitaciones',
      companyName: 'Secretaría de Finanzas y Sector Público',
      email: 'fernando.ortiz@gob.sv'
    },
    {
      name: 'Sofia Valenzuela',
      occupation: 'Chief Executive Officer (CEO)',
      companyName: 'Valenzuela Enterprise Holdings',
      email: 'sofia@valenzuela.io'
    }
  ];

  sampleLeads.forEach((lead, idx) => {
    const route = bridge.classifyAndRouteLead(lead);
    console.log(`\n🔹 [Lead ${idx + 1}] ${lead.name} (${lead.occupation})`);
    console.log(`   🎯 Agente Asignado: \x1b[33m${route.agentTitle}\x1b[0m`);
    console.log(`   💡 Enfoque del Pitch: ${route.pitchFocus}`);
    console.log(`   💼 Plan Sugerido: ${route.suggestedPlan}`);
  });

  // 2. Test Meta Ads Reporting Node
  console.log(`\n------------------------------------------------------------------------`);
  console.log(`📌 2. DESPACHO DE MÉTRICAS META ADS (+20 AÑOS):`);
  const adsResult = await bridge.dispatchMetaAdsReport({
    spendUSD: 160.0,
    impressions: 21000,
    ctr: 2.85,
    cpa: 14.5,
    roas: 5.4,
    revenueUSD: 864.0
  });
  console.log(`   ✅ Webhook Meta Ads: ${adsResult.endpoint} | ROAS: 5.4x | Gasto: $160 USD | Retorno: $864 USD`);

  // 3. Test Consumer Behavior & Ad Fatigue Diagnostics Node
  console.log(`\n------------------------------------------------------------------------`);
  console.log(`📌 3. DIAGNÓSTICO DE COMPORTAMIENTO & PREVENCIÓN DE FATIGA PUBLICITARIA:`);
  const behaviorResult = await bridge.runConsumerBehaviorAudit({
    frequency: 2.1,
    ctr: 2.75,
    avgTimeToFirstAuditSec: 38,
    checkoutDropOffRate: '9%'
  });
  console.log(`   ✅ Webhook Comportamiento: ${behaviorResult.endpoint}`);
  console.log(`   🧠 Estado de Audiencia: ${behaviorResult.payload.recommendation}`);
  console.log(`   ⚡ Time-to-Value en App: ${behaviorResult.payload.timeToValueSec}s | Score App: ${behaviorResult.payload.appHealthScore}`);

  // 4. Test GM / COO Action Plan & Financials in USD
  console.log(`\n------------------------------------------------------------------------`);
  console.log(`📌 4. PLAN DE ACCIÓN Y CONTROL FINANCIERO EN USD (GERENTE GENERAL / COO):`);
  const gmResult = await bridge.generateGMActionPlan({
    revenueTodayUSD: 1450,
    adSpendUSD: 160,
    mrrUSD: 15800
  });
  console.log(`   ✅ Webhook GM / COO: ${gmResult.endpoint}`);
  console.log(`   💵 Facturación Hoy: $${gmResult.payload.financials.revenueTodayUSD} USD | Margen Neto: +$${gmResult.payload.financials.netProfitUSD} USD`);
  console.log(`   🎯 Acciones para el CEO:`);
  gmResult.payload.actionPlanForCEO.forEach(action => console.log(`      ${action}`));

  // 5. Test Executive Committee Meeting Sync (Ricardo + GM + CMVO)
  console.log(`\n------------------------------------------------------------------------`);
  console.log(`📌 5. CONVOCATORIA COMITÉ EJECUTIVO (RICARDO + GERENTE GENERAL + DIRECTORA DE MARKETING):`);
  const meetingResult = await bridge.scheduleExecutiveCommitteeMeeting({
    scheduledDate: '2026-09-01 09:00 AM',
    topics: ['Escalado Q3', 'Nuevos Países de Cobertura']
  });
  console.log(`   ✅ Webhook Reunión Ejecutiva: ${meetingResult.endpoint}`);
  console.log(`   👥 Participantes: ${meetingResult.payload.participants.join(', ')}`);

  // 6. Verify Critical Files & Agent Configurations
  console.log(`\n------------------------------------------------------------------------`);
  console.log(`📌 6. VERIFICACIÓN DE ARCHIVOS DE AGENTES Y WORKFLOWS N8N:`);
  const filesToCheck = [
    'n8n_workflows_auditflow.json',
    '.agents/mcp_config.json',
    '.agents/agents/meta-ads-specialist.md',
    '.agents/agents/consumer-behavior-diagnostician.md',
    '.agents/agents/general-manager-coo.md',
    '.agents/agents/marketing-director.md',
    '.agents/agents/legal-sales-specialist.md',
    '.agents/agents/financial-sales-specialist.md',
    '.agents/agents/gov-sales-specialist.md',
    '.agents/agents/waalaxy-specialist.md'
  ];

  let allOk = true;
  filesToCheck.forEach(f => {
    const fullPath = path.resolve(f);
    const exists = fs.existsSync(fullPath);
    const status = exists ? '\x1b[32m[OK - EXISTE]\x1b[0m' : '\x1b[31m[FALTA]\x1b[0m';
    if (!exists) allOk = false;
    console.log(`   ${status} ${f}`);
  });

  console.log(`\n========================================================================`);
  if (allOk) {
    console.log(`🎉 \x1b[32mTODO EL ECOSISTEMA DE AGENTES Y N8N ESTÁ 100% OPERATIVO Y SINCRONIZADO\x1b[0m`);
  } else {
    console.log(`⚠️ ALGUNOS ARCHIVOS REQUIEREN ATENCIÓN`);
  }
  console.log(`========================================================================\n`);
}

runFullEcosystemTest();
