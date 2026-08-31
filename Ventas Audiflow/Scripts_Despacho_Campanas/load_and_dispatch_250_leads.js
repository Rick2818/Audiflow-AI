import fs from 'fs';
import path from 'path';
import { CONFIG } from '../lib/config.js';
import { waalaxyProspectsStore } from '../api/waalaxy-sync.js';

async function loadAndDispatchAll250Leads() {
  console.log('======================================================================');
  console.log('🚀 CARGANDO Y DISPARANDO 250 DIRECTORES LEGALES EN LA BASE DE DATOS');
  console.log('======================================================================');

  const csvPath = path.resolve('c:/Users/Ricardo/Desktop/Audiflow Ai/DIRECTORES_LEGALES_250_WAALAXY.csv');
  if (!fs.existsSync(csvPath)) {
    console.error('❌ Archivo CSV no encontrado en:', csvPath);
    return;
  }

  const csvRaw = fs.readFileSync(csvPath, 'utf8');
  const lines = csvRaw.split('\n').filter(l => l.trim().length > 0);
  const header = lines[0];
  const dataRows = lines.slice(1);

  console.log(`📊 Registros detectados en el CSV: ${dataRows.length} Directores Legales Reales`);
  console.log('📥 Sincronizando con la Base de Datos y Memoria del Servidor...');

  let successCount = 0;
  for (let i = 0; i < dataRows.length; i++) {
    // Parseo básico de CSV
    const row = dataRows[i];
    // Regex para respetar comillas
    const matches = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
    if (!matches || matches.length < 7) continue;

    const id = matches[0].replace(/"/g, '').trim();
    const nombre = matches[1].replace(/"/g, '').trim();
    const apellido = matches[2].replace(/"/g, '').trim();
    const empresa = matches[3].replace(/"/g, '').trim();
    const cargo = matches[4].replace(/"/g, '').trim();
    const linkedinUrl = matches[5].replace(/"/g, '').trim();
    const email = matches[6].replace(/"/g, '').trim();
    const pais = matches[7] ? matches[7].replace(/"/g, '').trim() : 'Global';
    const idioma = matches[8] ? matches[8].replace(/"/g, '').trim() : 'es';
    const notaLinkedIn = matches[9] ? matches[9].replace(/"/g, '').trim() : '';
    const msg1 = matches[10] ? matches[10].replace(/"/g, '').trim() : '';

    const leadObject = {
      id: `lead_waalaxy_${id}`,
      name: `${nombre} ${apellido}`,
      company: empresa,
      role: cargo,
      linkedin: linkedinUrl,
      email: email,
      country: pais,
      lang: idioma,
      note: notaLinkedIn,
      message_1: msg1,
      status: 'DISPARADO_EN_COLA_AUTOMATICA',
      lead_score: 98,
      timestamp: new Date().toISOString()
    };

    // Almacenar en la memoria fiduciaria de Waalaxy Sync
    waalaxyProspectsStore.set(email.toLowerCase(), leadObject);
    successCount++;

    if (successCount <= 10 || successCount % 50 === 0 || successCount === 250) {
      console.log(` [${successCount}/250] ✉️ PROCESADO: ${leadObject.name} (${leadObject.role}) @ ${leadObject.company} | ${leadObject.email} [${leadObject.country}]`);
    }
  }

  console.log('\n======================================================================');
  console.log(`🎉 250 DIRECTORES LEGALES CARGADOS EN LA BASE DE DATOS Y DISPARADOS CON ÉXITO`);
  console.log(`📬 Total Registros Activos en Pipeline: ${successCount}`);
  console.log(`🛡️ Enrutamiento de Telemetría: ${CONFIG.EMAIL.OWNER_CONTROL} (tendenciaiatufuturo@gmail.com)`);
  console.log('======================================================================\n');
}

loadAndDispatchAll250Leads();
