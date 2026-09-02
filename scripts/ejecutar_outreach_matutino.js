import dotenv from 'dotenv';
import { REAL_LEGAL_DIRECTORS, NORDIC_LEGAL_EXECUTIVE_LEADS, DACH_LEGAL_EXECUTIVE_LEADS, sendPersonalizedOutreachEmail } from '../api/outreach.js';

dotenv.config();

async function runMorningOutreach() {
  console.log('============================================================');
  console.log('🚀 AUDITFLOW AI — DESPACHO DE PROSPECCIÓN MATUTINA B2B');
  console.log('============================================================\n');

  console.log(`📋 Tomadores de decisión cargados:`);
  console.log(`   - Latam (Directores Jurídicos & Socios): ${REAL_LEGAL_DIRECTORS.length}`);
  console.log(`   - Zona Nórdica (General Counsels SWE/NOR/DNK): ${NORDIC_LEGAL_EXECUTIVE_LEADS.length}`);
  console.log(`   - DACH Alemania (Rechtsabteilung / M&A): ${DACH_LEGAL_EXECUTIVE_LEADS.length}`);

  // Seleccionar los 10 primeros decisores de alta prioridad (Tier Top 20)
  const priorityLeads = REAL_LEGAL_DIRECTORS.slice(0, 10);
  console.log(`\n⏳ Ejecutando despacho de mensajes con borrador Word (.docx con Track Changes) y enlace 1-Clic a ${priorityLeads.length} directores...`);

  let dispatchedCount = 0;
  for (const lead of priorityLeads) {
    try {
      console.log(`   👉 Despachando a: ${lead.name} (${lead.company}) - ${lead.email}...`);
      const res = await sendPersonalizedOutreachEmail(lead);
      if (res && res.success) {
        dispatchedCount++;
      }
    } catch (err) {
      console.warn(`   ⚠️ Aviso en ${lead.name}:`, err.message);
    }
  }

  console.log(`\n🎉 ¡DESPACHO COMPLETADO! Total directores contactados con éxito: ${dispatchedCount}`);
}

runMorningOutreach();
