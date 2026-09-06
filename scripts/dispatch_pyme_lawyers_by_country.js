import fs from 'fs';
import path from 'path';
import { CONFIG } from '../lib/config.js';
import { waalaxyProspectsStore } from '../lib/waalaxy-sync.js';

function cleanVal(str) {
  return (str || '').replace(/^"|"$/g, '').trim();
}

function getGreetingAndMessage(lead) {
  const { country, firstName, lastName, companyName, city } = lead;
  
  if (['El Salvador', 'Guatemala', 'Costa Rica', 'Panamá', 'México'].includes(country)) {
    return `Estimado Lic. ${lastName}, en firmas de práctica contractual como ${companyName} (${city}), revisar contratos mercantiles y de proveedores de 40 págs a mano consume horas valiosas. AuditFlow AI audita en 8s en RAM privada y genera el Redline en Word directo para su contraparte. Prueba de cortesía: https://audiflowai.com/?ref=pyme-${country.toLowerCase().replace(/\s+/g, '')}&lead=${encodeURIComponent(firstName)}`;
  }

  if (['Colombia', 'Perú'].includes(country)) {
    return `Estimado Dr. ${lastName}, en la práctica jurídica de ${companyName} en ${city}, la auditoría preventiva de contratos comerciales y proveedores evita litigios y fugas. AuditFlow AI procesa en 8s en RAM fiduciaria generando el informe y Redline Word con control de cambios. Diagnóstico gratuito: https://audiflowai.com/?ref=pyme-${country.toLowerCase()}&lead=${encodeURIComponent(firstName)}`;
  }

  if (country === 'Chile') {
    return `Estimado/a ${firstName} ${lastName}, un cordial saludo. Para una firma enfocada en contratos como ${companyName} en ${city}, agilizar la revisión técnica de acuerdos sin exponer datos de clientes es clave. AuditFlow AI audita cláusulas y contingencias en 8s en memoria RAM volátil. Demostración directa: https://audiflowai.com/?ref=pyme-chile&lead=${encodeURIComponent(firstName)}`;
  }

  if (country === 'España') {
    return `Hola ${firstName}, un saludo desde el equipo de AuditFlow AI. Para un despacho mercantil como ${companyName} (${city}), la revisión manual de contratos consume horas de equipo. AuditFlow AI audita contratos en 8s y entrega el Redline en Word (.docx) listo para el cliente, sin almacenar datos en servidores. Pruébalo sin coste: https://audiflowai.com/?ref=pyme-espana&lead=${encodeURIComponent(firstName)}`;
  }

  return `Estimado/a ${firstName} ${lastName}, optimice la revisión de contratos de ${companyName} con auditoría algorítmica en 8 segundos en RAM volátil: https://audiflowai.com`;
}

async function dispatchPymeLawyersByCountry() {
  console.log('🛑 [DEPRECADO]: Campaña a Abogados PyME / Boutique desactivada por Directiva Inmutable del Director General.');
  console.log('📌 Motivo: Sustituida por el Nuevo Pareto de Firmas Corporativas Tier 1/2 (>25 abogados) en los 14 países.');
  return;


  const csvPath = path.resolve('Waalaxy/pyme_lawyers_250_waalaxy.csv');
  if (!fs.existsSync(csvPath)) {
    throw new Error(`Archivo no encontrado: ${csvPath}`);
  }

  const raw = fs.readFileSync(csvPath, 'utf8');
  const lines = raw.split('\n').filter(l => l.trim().length > 0).slice(1);

  const outDir = path.resolve('Waalaxy/Paises_Pyme');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const countryGroups = {};
  let totalDispatched = 0;

  for (const line of lines) {
    const parts = line.split('","').map(cleanVal);
    if (parts.length < 8) continue;

    const lead = {
      firstName: parts[0],
      lastName: parts[1],
      occupation: parts[2],
      companyName: parts[3],
      city: parts[4],
      country: parts[5],
      email: parts[6],
      linkedinUrl: parts[7],
      trialUrl: parts[8] || ''
    };

    const message = getGreetingAndMessage(lead);
    lead.customMessage = message;
    lead.status = 'DISPARADO_POR_PAIS';
    lead.campaign = `Waalaxy PYME - ${lead.country}`;
    lead.timestamp = new Date().toISOString();

    if (!countryGroups[lead.country]) {
      countryGroups[lead.country] = [];
    }
    countryGroups[lead.country].push(lead);

    waalaxyProspectsStore.set(lead.email, lead);
    totalDispatched++;
  }

  // Exportar archivos por país
  const headers = ['firstName', 'lastName', 'occupation', 'companyName', 'city', 'country', 'email', 'linkedinUrl', 'customMessage'];
  
  for (const [country, leads] of Object.entries(countryGroups)) {
    const safeName = country.toLowerCase().replace(/[\s\u0300-\u036f]/g, '_');
    const targetFile = path.join(outDir, `pyme_${safeName}_${leads.length}.csv`);
    
    const rows = leads.map(l => [
      `"${l.firstName}"`,
      `"${l.lastName}"`,
      `"${l.occupation}"`,
      `"${l.companyName}"`,
      `"${l.city}"`,
      `"${l.country}"`,
      `"${l.email}"`,
      `"${l.linkedinUrl}"`,
      `"${l.customMessage.replace(/"/g, '""')}"`
    ].join(','));

    fs.writeFileSync(targetFile, [headers.join(','), ...rows].join('\n'), 'utf8');
    console.log(`✅ [${country}] -> ${leads.length} decisores disparados y archivados en: ${path.basename(targetFile)}`);
  }

  console.log('----------------------------------------------------------------------');
  console.log(`🎯 Total Abogados PYME disparados con adaptación cultural: ${totalDispatched}`);
  console.log('======================================================================\n');
}

dispatchPymeLawyersByCountry().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
