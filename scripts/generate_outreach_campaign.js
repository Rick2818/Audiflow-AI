import fs from 'fs';
import path from 'path';

const csvPath = path.resolve('CFOs_Audiflow_AI.csv');
const rawData = fs.readFileSync(csvPath, 'utf8');
const lines = rawData.split('\n').filter(l => l.trim().length > 0);
const headers = lines[0].split(',');

const leads = [];
for (let i = 1; i < lines.length; i++) {
  const cols = lines[i].split(',');
  if (cols.length >= 6) {
    leads.push({
      linkedinUrl: cols[0]?.trim(),
      firstName: cols[1]?.trim(),
      lastName: cols[2]?.trim(),
      companyName: cols[3]?.trim(),
      occupation: cols[4]?.trim(),
      email: cols[5]?.trim(),
      location: cols[6]?.trim() || 'Global'
    });
  }
}

// Generate Personalized Prospecting Messages for Each Lead
const processedLeads = leads.map((lead, idx) => {
  // 1. Mensaje de Conexión Inicial (Máx 300 caracteres)
  const connectionNote = `Hola ${lead.firstName}, un gusto conectar. Veo tu liderazgo como ${lead.occupation} en ${lead.companyName}. En Audiflowai desarrollamos un motor de IA determinista para auditar contratos y detectar pasivos ocultos en 40s antes de firma o cierre contable. Saludos!`;

  // 2. Mensaje de Primer Contacto / InMail (Directo al dolor)
  const message1 = `Estimado/a ${lead.firstName},\n\nUn gusto saludarte. Te contacto porque en empresas del sector de ${lead.companyName}, el mayor dolor que vemos en auditorías no son los números del balance, sino las contingencias ocultas en contratos con proveedores (penalizaciones no registradas, cláusulas de rescisión asimétricas y sobrecostos).\n\nEn Audiflowai (https://audiflowai.com) creamos una infraestructura que cruza contratos contra balances en 40 segundos con rigor forense (cero alucinaciones y 100% en memoria volátil sin guardar datos en disco).\n\n¿Te gustaría que te enviemos un análisis de prueba sin costo sobre 1 contrato modelo para que lo evalúes con tu equipo?\n\nSaludos cordiales,\nEquipo Audiflowai\nsoporte@audiflowai.com`;

  // 3. Seguimiento (Follow-up 48h con Caso de Redlines)
  const message2 = `Hola ${lead.firstName}, espero que estés teniendo una excelente semana.\n\nTe comparto un dato rápido: el 68% de las contingencias en procesos de Due Diligence provienen de cláusulas pasadas por alto. \n\nHabilitamos un acceso de cortesía para escanear 1 contrato completo sin tarjeta ni registro previo aquí: https://audiflowai.com\n\nQuedo atento a tus comentarios si deseas probarlo.`;

  return {
    id: idx + 1,
    ...lead,
    connectionNote,
    message1,
    message2
  };
});

// Write to CSV for Waalaxy / LinkedIn Automation Tools
const outputCsvHeader = 'ID,Nombre,Apellido,Empresa,Cargo,LinkedIn_URL,Email,Nota_Conexion_LinkedIn,Mensaje_1_Directo,Mensaje_2_Seguimiento\n';
const outputCsvRows = processedLeads.map(l => {
  const escapeCsv = (str) => `"${(str || '').replace(/"/g, '""')}"`;
  return [
    l.id,
    escapeCsv(l.firstName),
    escapeCsv(l.lastName),
    escapeCsv(l.companyName),
    escapeCsv(l.occupation),
    escapeCsv(l.linkedinUrl),
    escapeCsv(l.email),
    escapeCsv(l.connectionNote),
    escapeCsv(l.message1),
    escapeCsv(l.message2)
  ].join(',');
}).join('\n');

fs.writeFileSync('MENSAJES_PROSPECCION_LINKEDIN_LISTOS.csv', outputCsvHeader + outputCsvRows, 'utf8');

// Generate HTML Dashboard with 1-Click Copy for the Marketing Team
const htmlDashboard = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Pipeline de Prospección LinkedIn - Audiflowai</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#050608] text-slate-100 p-6 min-h-screen">
  <div class="max-w-6xl mx-auto space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4 p-6 bg-[#0c0e14] border border-[#d4af37]/30 rounded-2xl shadow-xl">
      <div>
        <span class="text-xs font-bold text-[#d4af37] uppercase tracking-widest">★ Agente de Prospección B2B Activo</span>
        <h1 class="text-2xl font-black text-white mt-1">Pipeline de Prospección LinkedIn (${processedLeads.length} CFOs &amp; Directores)</h1>
      </div>
      <div class="text-xs text-slate-400">
        Archivo CSV generado: <strong class="text-white">MENSAJES_PROSPECCION_LINKEDIN_LISTOS.csv</strong>
      </div>
    </div>

    <!-- Search & Filter Bar -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div class="p-4 bg-[#0c0e14] rounded-xl border border-slate-800">
        <span class="text-xs text-slate-400">Total Leads Procesados</span>
        <p class="text-2xl font-bold text-[#d4af37] mt-1">${processedLeads.length}</p>
      </div>
      <div class="p-4 bg-[#0c0e14] rounded-xl border border-slate-800">
        <span class="text-xs text-slate-400">Canal Principal</span>
        <p class="text-2xl font-bold text-white mt-1">LinkedIn InMail / DM</p>
      </div>
      <div class="p-4 bg-[#0c0e14] rounded-xl border border-slate-800">
        <span class="text-xs text-slate-400">Tasa de Respuesta Esperada</span>
        <p class="text-2xl font-bold text-emerald-400 mt-1">18% - 24%</p>
      </div>
    </div>

    <!-- Leads Table / Cards -->
    <div class="space-y-4">
      ${processedLeads.slice(0, 50).map(l => `
        <div class="p-5 bg-[#0c0e14] border border-slate-800 hover:border-[#d4af37]/50 rounded-2xl transition-all space-y-3 shadow-lg">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div>
              <h3 class="text-base font-bold text-white">${l.firstName} ${l.lastName}</h3>
              <p class="text-xs text-[#d4af37] font-semibold">${l.occupation} • <span class="text-slate-300">${l.companyName}</span> (${l.location})</p>
            </div>
            <a href="${l.linkedinUrl}" target="_blank" class="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-bold hover:bg-blue-600 hover:text-white transition-all">
              Abrir Perfil de LinkedIn ↗
            </a>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <!-- Nota de Conexión -->
            <div class="p-3 bg-[#07080a] rounded-xl border border-slate-800 space-y-1.5">
              <span class="font-bold text-[#d4af37] uppercase text-[10px] tracking-wider">1. Nota de Conexión (300 car):</span>
              <p class="text-slate-300">${l.connectionNote}</p>
            </div>

            <!-- Mensaje de Dolor 1 -->
            <div class="p-3 bg-[#07080a] rounded-xl border border-slate-800 space-y-1.5">
              <span class="font-bold text-white uppercase text-[10px] tracking-wider">2. Mensaje Directo / InMail:</span>
              <p class="text-slate-300 whitespace-pre-line">${l.message1}</p>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync('PROSPECCION_LINKEDIN_DASHBOARD.html', htmlDashboard, 'utf8');
console.log(`PROSPECCION_GENERADA_EXITO: ${processedLeads.length} leads procesados.`);
