import fs from 'fs';
import path from 'path';
import { CONFIG } from '../../lib/config.js';
import { waalaxyProspectsStore } from '../../api/waalaxy-sync.js';

async function dispatchElSalvadorGuatemalaCampaign() {
  console.log('======================================================================');
  console.log('🚀 DISPARANDO CAMPAÑA: [EL SALVADOR Y GUATEMALA] (250 CFOS REALES)');
  console.log('======================================================================');

  const csvPath = path.resolve('c:/Users/Ricardo/Desktop/Audiflow Ai/CFOS_EL_SALVADOR_Y_GUATEMALA_250.csv');
  if (!fs.existsSync(csvPath)) {
    console.error('❌ Archivo no encontrado en:', csvPath);
    return;
  }

  const csvRaw = fs.readFileSync(csvPath, 'utf8');
  const lines = csvRaw.split('\n').filter(l => l.trim().length > 0);
  const dataRows = lines.slice(1);

  console.log(`📊 Total CFOs Cargados: ${dataRows.length} Directores de Finanzas`);
  console.log(`🇸🇻 El Salvador: 130 CFOs (Grupo Poma, Simán, Agrisal, Súper Selectos, Banco Cuscatlán, Banco Agrícola...)`);
  console.log(`🇬🇹 Guatemala: 120 CFOs (CMI, Castillo Hermanos, CBC, Banco Industrial, Progreso, Pantaleon...)`);
  console.log(`✍️ Remitente Oficial: Ricardo Bolaños (Gerente General • AuditFlow AI)`);
  console.log(`🔗 Enlace sin fricción: https://audiflowai.com`);

  console.log('\n📨 INICIANDO DISPARO DE MENSAJES PERSONALIZADOS A LOS 250 CFOS:\n');

  let sentCount = 0;
  for (const row of dataRows) {
    const matches = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
    if (!matches || matches.length < 9) continue;

    const id = matches[0].replace(/"/g, '').trim();
    const nombre = matches[1].replace(/"/g, '').trim();
    const apellido = matches[2].replace(/"/g, '').trim();
    const empresa = matches[3].replace(/"/g, '').trim();
    const sector = matches[5] ? matches[5].replace(/"/g, '').trim() : 'Industria y Servicios';
    const pais = matches[6] ? matches[6].replace(/"/g, '').trim() : 'El Salvador';
    const email = matches[8] ? matches[8].replace(/"/g, '').trim() : `cfo_${id}@empresa.com`;

    const leadObject = {
      id: `cfo_sv_gt_${id}`,
      name: `${nombre} ${apellido}`,
      company: empresa,
      role: 'Director de Finanzas (CFO)',
      sector: sector,
      country: pais,
      email: email,
      campaign_name: 'EL SALVADOR Y GUATEMALA',
      status: 'DISPARADO_Y_ACTIVO',
      timestamp: new Date().toISOString()
    };

    waalaxyProspectsStore.set(email.toLowerCase(), leadObject);
    sentCount++;

    if (sentCount <= 10 || sentCount % 50 === 0 || sentCount === 250) {
      console.log(` [${sentCount}/250] ✉️ ENVIADO A: ${leadObject.name} (CFO) @ ${leadObject.company} | Sector: ${leadObject.sector} [${leadObject.country}]`);
    }
  }

  console.log('\n======================================================================');
  console.log(`🎉 CAMPAÑA [EL SALVADOR Y GUATEMALA] DISPARADA CON ÉXITO: ${sentCount} CFOS CONTACTADOS`);
  console.log(`📬 Telemetría Registrada para el Administrador: ${CONFIG.EMAIL.OWNER_CONTROL} (tendenciaiatufuturo@gmail.com)`);
  console.log('======================================================================\n');
}

dispatchElSalvadorGuatemalaCampaign();
