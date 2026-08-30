import { ExecutiveEmailDispatcher } from '../lib/executive-email-dispatcher.js';

console.log(`\n========================================================================`);
console.log(`📨 PRUEBA DE DESPACHO EJECUTIVO CON NUEVAS CREDENCIALES GMAIL SMTP`);
console.log(`========================================================================\n`);

const dispatcher = new ExecutiveEmailDispatcher();

async function runTest() {
  console.log(`🔹 Probando despacho de Daily Morning Briefing...`);
  const result = await dispatcher.sendDailyMorningBriefing();
  console.log(`✅ Resultado:`, JSON.stringify(result, null, 2));
}

runTest().catch(err => {
  console.error(`❌ Error en prueba de despacho:`, err);
});
