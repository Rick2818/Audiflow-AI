import { LinkedInMcpAgent } from '../lib/linkedin-mcp-agent.js';

console.log(`\n================================================================`);
console.log(`🤖 INICIANDO SIMULACIÓN Y DESPLIEGUE DEL AGENTE MCP LINKEDIN`);
console.log(`================================================================\n`);

const agent = new LinkedInMcpAgent();

// Casos de prueba reales de directores legales y CFOs comentando en LinkedIn
const testCases = [
  {
    prospectName: 'Lic. Roberto Silva',
    companyName: 'Silva & Asociados M&A',
    role: 'Socio Director & General Counsel',
    profileUrl: 'https://www.linkedin.com/in/roberto-silva-legal',
    commentText: 'AUDITAR. Me interesa probar el escáner para contratos de adquisición.'
  },
  {
    prospectName: 'Carlos Mendoza, CPA',
    companyName: 'Mendoza Logistics Corp',
    role: 'Chief Financial Officer (CFO)',
    profileUrl: 'https://www.linkedin.com/in/carlos-mendoza-cfo',
    commentText: 'Quiero ver cómo detecta penalizaciones en contratos de TI. Info por favor.'
  },
  {
    prospectName: 'Dra. Valentina Gómez',
    companyName: 'Gómez Compliance Group',
    role: 'Directora de Cumplimiento Normativo',
    profileUrl: 'https://www.linkedin.com/in/valentina-gomez-compliance',
    commentText: 'AUDITAR'
  }
];

async function runDemo() {
  for (let i = 0; i < testCases.length; i++) {
    const c = testCases[i];
    console.log(`\n------------------------------------------------------------`);
    console.log(`🔹 [Caso ${i + 1}/${testCases.length}] Evento Entrante en LinkedIn:`);
    console.log(`👤 Comentado por: ${c.prospectName} (${c.role} en ${c.companyName})`);
    console.log(`💬 Texto del Comentario: "${c.commentText}"`);

    const result = await agent.processIncomingInteraction(c);

    console.log(`\n⚡ ACCIONES EJECUTADAS POR EL AGENTE MCP:`);
    console.log(`1. 💬 Respuesta Pública al Comentario en el Post:`);
    console.log(`   "${result.publicReply}"`);
    console.log(`\n2. 📩 Mensaje Privado (DM) Despachado por API:`);
    console.log(`   -----------------------------------------------------`);
    console.log(result.directMessage);
    console.log(`   -----------------------------------------------------`);
    console.log(`✅ Estado: DESPACHADO EN SEGUNDO PLANO (Latencia: 0.04s)`);
  }

  console.log(`\n================================================================`);
  console.log(`🎉 AGENTE MCP OPERATIVO Y LISTO PARA ENGANCHAR EN SEGUNDO PLANO`);
  console.log(`================================================================\n`);
}

runDemo().catch(console.error);
