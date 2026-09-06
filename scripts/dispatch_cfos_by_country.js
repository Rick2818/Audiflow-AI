import fs from 'fs';
import path from 'path';
import { CONFIG } from '../lib/config.js';
import { waalaxyProspectsStore } from '../lib/waalaxy-sync.js';

function cleanVal(str) {
  return (str || '').replace(/^"|"$/g, '').trim();
}

function resolveCountry(email, location) {
  const domain = (email.split('@')[1] || '').toLowerCase();
  const tld = domain.split('.').pop();

  const map = {
    sv: { name: 'El Salvador', lang: 'es', region: 'Latam' },
    co: { name: 'Colombia', lang: 'es', region: 'Latam' },
    cr: { name: 'Costa Rica', lang: 'es', region: 'Latam' },
    cl: { name: 'Chile', lang: 'es', region: 'Latam' },
    gt: { name: 'Guatemala', lang: 'es', region: 'Latam' },
    pa: { name: 'Panamá', lang: 'es', region: 'Latam' },
    mx: { name: 'México', lang: 'es', region: 'Latam' },
    pe: { name: 'Perú', lang: 'es', region: 'Latam' },
    uk: { name: 'Reino Unido', lang: 'en', region: 'Europe' },
    ch: { name: 'Suiza', lang: 'en', region: 'Europe' },
    de: { name: 'Alemania', lang: 'en', region: 'Europe' },
    it: { name: 'Italia', lang: 'en', region: 'Europe' },
    se: { name: 'Suecia', lang: 'en', region: 'Europe' }
  };

  if (map[tld]) return map[tld];

  if (location.includes('Latam') || location.includes('España')) {
    return { name: 'Latam & España', lang: 'es', region: 'Latam' };
  }
  return { name: 'Global & Europe', lang: 'en', region: 'Europe' };
}

function getCfoMessage(lead, countryInfo) {
  const { firstName, lastName, companyName, occupation } = lead;

  if (countryInfo.lang === 'en') {
    // English corporate copy for Global/Europe CFOs & Audit Partners
    return `Hi ${firstName}, managing capital allocation and complex vendor contracts at ${companyName} requires precision. AuditFlow AI executes automated contractual and invoice auditing in 8 seconds strictly in volatile RAM, detecting fee leakages, penalty clauses, and generating a track-changes Word Redline. Zero data storage, full IFRS/PCAOB compliance. Complimentary executive test: https://audiflowai.com/?lang=en&ref=cfo-${countryInfo.name.toLowerCase().replace(/\s+/g, '')}&lead=${encodeURIComponent(firstName)}`;
  }

  // Spanish corporate copy for Latam/Spain CFOs & Contralores
  return `Estimado/a ${firstName} ${lastName}, en la dirección financiera de ${companyName}, frenar fugas presupuestarias y sobrecostos en contratos de proveedores es una prioridad crítica de EBITDA. AuditFlow AI audita contratos mercantiles y facturas en 8s en memoria RAM privada, generando un informe de contingencias y Redline en Word (.docx). Escaneo de cortesía para su equipo: https://audiflowai.com/?ref=cfo-${countryInfo.name.toLowerCase().replace(/[\s\u0300-\u036f]/g, '')}&lead=${encodeURIComponent(firstName)}`;
}

async function dispatchCfosByCountry() {
  console.log('======================================================================');
  console.log('🚀 DISPARANDO CAMPAÑA: 500 CFOS INTERNACIONALES (SEGMENTACIÓN POR PAÍS E IDIOMA)');
  console.log('======================================================================');

  const csvPath = path.resolve('Waalaxy/CFOs_Audiflow_AI.csv');
  if (!fs.existsSync(csvPath)) {
    throw new Error(`Archivo no encontrado: ${csvPath}`);
  }

  const raw = fs.readFileSync(csvPath, 'utf8');
  const lines = raw.split('\n').filter(l => l.trim().length > 0).slice(1);

  const outDir = path.resolve('Waalaxy/Paises_CFOs');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const countryGroups = {};
  let totalDispatched = 0;
  let countLatam = 0;
  let countEurope = 0;

  for (const line of lines) {
    const parts = line.split(',').map(cleanVal);
    if (parts.length < 7) continue;

    const linkedinUrl = parts[0];
    const firstName = parts[1];
    const lastName = parts[2];
    const companyName = parts[3];
    const occupation = parts[4];
    const email = parts[5];
    const location = parts[6];

    const countryInfo = resolveCountry(email, location);

    const lead = {
      linkedinUrl,
      firstName,
      lastName,
      companyName,
      occupation,
      email,
      location,
      country: countryInfo.name,
      lang: countryInfo.lang,
      region: countryInfo.region
    };

    lead.customMessage = getCfoMessage(lead, countryInfo);
    lead.status = 'DISPARADO_POR_PAIS';
    lead.campaign = `Waalaxy CFO - ${lead.country} (${countryInfo.lang.toUpperCase()})`;
    lead.timestamp = new Date().toISOString();

    if (!countryGroups[lead.country]) {
      countryGroups[lead.country] = [];
    }
    countryGroups[lead.country].push(lead);

    waalaxyProspectsStore.set(lead.email, lead);
    totalDispatched++;
    if (countryInfo.lang === 'es') countLatam++;
    else countEurope++;
  }

  // Exportar archivos por país
  const headers = ['firstName', 'lastName', 'occupation', 'companyName', 'country', 'language', 'email', 'linkedinUrl', 'customMessage'];

  console.log('--- 🌎 BLOQUE 1: LATAM & ESPAÑA (ESPAÑOL) ---');
  for (const [country, leads] of Object.entries(countryGroups)) {
    if (leads[0].lang !== 'es') continue;
    const safeName = country.toLowerCase().replace(/[\s\u0300-\u036f]/g, '_');
    const targetFile = path.join(outDir, `cfo_latam_${safeName}_${leads.length}.csv`);

    const rows = leads.map(l => [
      `"${l.firstName}"`,
      `"${l.lastName}"`,
      `"${l.occupation}"`,
      `"${l.companyName}"`,
      `"${l.country}"`,
      `"${l.lang}"`,
      `"${l.email}"`,
      `"${l.linkedinUrl}"`,
      `"${l.customMessage.replace(/"/g, '""')}"`
    ].join(','));

    fs.writeFileSync(targetFile, [headers.join(','), ...rows].join('\n'), 'utf8');
    console.log(`✅ [${country}] -> ${leads.length} CFOs disparados [ESPAÑOL] -> ${path.basename(targetFile)}`);
  }

  console.log('\n--- 🌍 BLOQUE 2: EUROPA & ANGLO (INTERNATIONAL ENGLISH) ---');
  for (const [country, leads] of Object.entries(countryGroups)) {
    if (leads[0].lang !== 'en') continue;
    const safeName = country.toLowerCase().replace(/[\s\u0300-\u036f]/g, '_');
    const targetFile = path.join(outDir, `cfo_europe_${safeName}_${leads.length}.csv`);

    const rows = leads.map(l => [
      `"${l.firstName}"`,
      `"${l.lastName}"`,
      `"${l.occupation}"`,
      `"${l.companyName}"`,
      `"${l.country}"`,
      `"${l.lang}"`,
      `"${l.email}"`,
      `"${l.linkedinUrl}"`,
      `"${l.customMessage.replace(/"/g, '""')}"`
    ].join(','));

    fs.writeFileSync(targetFile, [headers.join(','), ...rows].join('\n'), 'utf8');
    console.log(`✅ [${country}] -> ${leads.length} CFOs disparados [ENGLISH] -> ${path.basename(targetFile)}`);
  }

  console.log('\n----------------------------------------------------------------------');
  console.log(`🎯 Total CFOs Disparados: ${totalDispatched}`);
  console.log(`📊 Distribución: ${countLatam} CFOs en Español (Latam) | ${countEurope} CFOs en Inglés (Europa)`);
  console.log('======================================================================\n');
}

dispatchCfosByCountry().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
