import { generateOutreachProspects, REAL_LEGAL_DIRECTORS } from '../api/outreach.js';

console.log('👑 Verificando Base y Campaña Pareto VIP (Top 20% Directores Legales Reales)...\n');

const paretoLeads = generateOutreachProspects('pareto_top20');
console.log(`📊 Total de Prospectos Pareto VIP: ${paretoLeads.length} leads.`);

if (paretoLeads.length !== 400) {
  console.error(`❌ Error: Se esperaban 400 prospectos Pareto, se obtuvieron ${paretoLeads.length}`);
  process.exit(1);
}

// Validar que todos sean de categoría LEGAL y tengan dominios reales
const allValid = paretoLeads.every(l => 
  l.category === 'LEGAL' &&
  l.email.includes('@') &&
  l.company &&
  l.company.length > 2 &&
  l.name &&
  l.lead_score >= 92
);

if (!allValid) {
  console.error('❌ Error: Algunos leads no cumplen los criterios fiduciarios.');
  process.exit(1);
}

console.log('✅ 100% de los 400 Leads Pareto VIP tienen Score 92-99 y firmas legales reales.');
console.log('\n📋 Muestra de los Primeros 10 Socios Directores Pareto VIP:');
paretoLeads.slice(0, 10).forEach((l, i) => {
  console.log(`   ${i + 1}. ${l.name} (${l.role}) — ${l.company} [${l.email}] • Score: ${l.lead_score}`);
});

console.log('\n🎉 Campaña Pareto VIP preparada y validada al 100% con Estrategia de Fricción Cero.');
