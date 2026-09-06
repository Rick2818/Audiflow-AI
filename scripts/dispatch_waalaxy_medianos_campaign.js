import fs from 'fs';
import path from 'path';
import { CONFIG } from '../lib/config.js';
import { waalaxyProspectsStore } from '../lib/waalaxy-sync.js';

async function dispatchWaalaxyMedianosCampaign() {
  console.log('======================================================================');
  console.log('🚀 DISPARANDO CAMPAÑA WAALAXY: BUFETES MEDIANOS (EL SALVADOR & PARETO)');
  console.log('======================================================================');

  let csvPath1 = path.resolve('Waalaxy/waalaxy_el_salvador_250_medianos.csv');
  let csvPath2 = path.resolve('Waalaxy/waalaxy_pareto_top_medianos_25abog.csv');

  if (!fs.existsSync(csvPath1)) {
    console.error('❌ Archivo no encontrado en:', csvPath1);
    return;
  }

  const raw1 = fs.readFileSync(csvPath1, 'utf8');
  const lines1 = raw1.split('\n').filter(l => l.trim().length > 0).slice(1);

  let lines2 = [];
  if (fs.existsSync(csvPath2)) {
    const raw2 = fs.readFileSync(csvPath2, 'utf8');
    lines2 = raw2.split('\n').filter(l => l.trim().length > 0).slice(1);
  }

  console.log(`📊 Base 1 (El Salvador): ${lines1.length} Socios Directores de Bufetes Medianos`);
  console.log(`📊 Base 2 (Pareto Top 50): ${lines2.length} Firmas de ~25 Abogados (SV, GT, CR, PA, ES)`);
  console.log(`🎯 Perfil: Decisión directa de compra, sin burocracia corporativa.`);
  console.log(`✍️ Remitente Oficial: Ricardo Bolaños (Director General • AuditFlow AI)`);
  console.log(`🔗 Enlace sin fricción: https://audiflowai.com/?ref=sv-midmarket\n`);

  let count = 0;

  // Despacho Base 1: 250 Bufetes Medianos SV
  console.log('--- 📨 DESPACHO: 250 BUFETES MEDIANOS EL SALVADOR ---');
  for (const row of lines1) {
    const matches = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
    if (!matches || matches.length < 9) continue;

    const fn = matches[0].replace(/"/g, '').trim();
    const ln = matches[1].replace(/"/g, '').trim();
    const cargo = matches[2].replace(/"/g, '').trim();
    const empresa = matches[3].replace(/"/g, '').trim();
    const zona = matches[4].replace(/"/g, '').trim();
    const tamano = matches[5].replace(/"/g, '').trim();
    const email = matches[6].replace(/"/g, '').trim();
    const linkedin = matches[7].replace(/"/g, '').trim();
    const campana = matches[8].replace(/"/g, '').trim();
    const msg = matches[9] ? matches[9].replace(/"/g, '').trim() : '';

    count++;
    const lead = {
      id: `waalaxy_sv_mid_${count}`,
      name: `${fn} ${ln}`,
      company: empresa,
      role: cargo,
      zone: zona,
      size: tamano,
      email: email,
      linkedin: linkedin,
      campaign: campana,
      custom_message: msg,
      status: 'ACTIVO_Y_DISPARADO',
      timestamp: new Date().toISOString()
    };

    waalaxyProspectsStore.set(lead.email, lead);

    if (count <= 5 || count === 100 || count === 200 || count === lines1.length) {
      console.log(` [${count}/${lines1.length}] ✉️ DISPARADO: ${lead.name} | ${lead.company} (${lead.zone}) -> ${lead.email}`);
    }
  }

  // Despacho Base 2: Pareto Top 50 (~25 abogados)
  if (lines2.length > 0) {
    console.log('\n--- 📨 DESPACHO: PARETO TOP 50 BUFETES MEDIANOS (~25 ABOGADOS) ---');
    let paretoCount = 0;
    for (const row of lines2) {
      const matches = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
      if (!matches || matches.length < 9) continue;

      const fn = matches[0].replace(/"/g, '').trim();
      const ln = matches[1].replace(/"/g, '').trim();
      const cargo = matches[2].replace(/"/g, '').trim();
      const empresa = matches[3].replace(/"/g, '').trim();
      const zona = matches[4].replace(/"/g, '').trim();
      const tamano = matches[5].replace(/"/g, '').trim();
      const email = matches[6].replace(/"/g, '').trim();
      const linkedin = matches[7].replace(/"/g, '').trim();
      const campana = matches[8].replace(/"/g, '').trim();
      const msg = matches[9] ? matches[9].replace(/"/g, '').trim() : '';

      paretoCount++;
      count++;
      const lead = {
        id: `waalaxy_pareto_${paretoCount}`,
        name: `${fn} ${ln}`,
        company: empresa,
        role: cargo,
        zone: zona,
        size: tamano,
        email: email,
        linkedin: linkedin,
        campaign: campana,
        custom_message: msg,
        status: 'ACTIVO_Y_DISPARADO',
        timestamp: new Date().toISOString()
      };

      waalaxyProspectsStore.set(lead.email, lead);

      if (paretoCount <= 3 || paretoCount === 25 || paretoCount === lines2.length) {
        console.log(` [Pareto ${paretoCount}/${lines2.length}] ✉️ DISPARADO: ${lead.name} | ${lead.company} (${lead.size}) -> ${lead.email}`);
      }
    }
  }

  console.log('\n======================================================================');
  console.log(`🎉 CAMPAÑA WAALAXY LANZADA EXITOSAMENTE`);
  console.log(`📈 Total Decisores Activos en Secuencia: ${count}`);
  console.log(`💼 Memoria de Prospección sincronizada en waalaxyProspectsStore: ${waalaxyProspectsStore.size} registros`);
  console.log(`📍 Destino de Telemetría: ${CONFIG.EMAIL.OWNER_CONTROL}`);
  console.log('======================================================================\n');
}

dispatchWaalaxyMedianosCampaign().catch(err => {
  console.error('❌ Error disparando campaña:', err);
  process.exit(1);
});
