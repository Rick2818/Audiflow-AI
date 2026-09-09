import fs from 'fs';
import path from 'path';
import { getSuppressedEmails, addBouncedEmail } from '../lib/bounce-suppression.js';

/**
 * ==============================================================================
 * AUDITFLOW AI — DEPURADOR MAESTRO DE CORREOS REBOTADOS E INVÁLIDOS
 * ==============================================================================
 * Escanea todas las bases de datos de prospectos (CSV y JSON) y elimina
 * permanentemente cualquier dirección que haya generado rebotes o fallos de entrega.
 * ==============================================================================
 */

console.log('================================================================================');
console.log('🧹 AUDITFLOW AI — DEPURACIÓN Y PURGA MAESTRA DE REBOTES (ZERO BOUNCE POLICY)');
console.log('================================================================================\n');

// 1. Asegurar que los correos que rebotaron recientemente estén en la lista negra
addBouncedEmail('jesper.lundgren@lundgrens.dk', 'MAIL_DELIVERY_SUBSYSTEM_ADDRESS_NOT_FOUND');
addBouncedEmail('morales.alejandro@moralescordero.es', 'DOMAIN_UNVERIFIED');
addBouncedEmail('rivas.fernando@rivaspineda.sv', 'DOMAIN_UNVERIFIED');
addBouncedEmail('guzman.camila@guzmanviteri.co', 'DOMAIN_UNVERIFIED');
addBouncedEmail('salgado.roberto@salgadomiranda.mx', 'DOMAIN_UNVERIFIED');
addBouncedEmail('batalla.mariano@batallalegal.cr', 'DOMAIN_UNVERIFIED');
addBouncedEmail('ortega.gabriel@ortegacarranza.pa', 'DOMAIN_UNVERIFIED');
addBouncedEmail('salazar.valeria@salazaribarra.cl', 'DOMAIN_UNVERIFIED');
addBouncedEmail('mendoza.carlos@mendozavillegas.pe', 'DOMAIN_UNVERIFIED');
addBouncedEmail('pacheco.hugo@pachecobenitez.gt', 'DOMAIN_UNVERIFIED');

const suppressed = getSuppressedEmails();
console.log(`🚫 Total de correos en la lista de supresión activa: ${suppressed.size}`);

// 2. Archivos a depurar
const filesToClean = [
  'Waalaxy/waalaxy_el_salvador_250_medianos.csv',
  'Waalaxy/waalaxy_nordicos_80_completo.csv',
  'waalaxy_nordicos_sector_medio.csv',
  'Audiflow Marketing/DIRECTORES_LEGALES_250_WAALAXY.csv',
  'nordicos_sector_medio_reforzado.json',
  'nordicos_80_leads.json'
];

let totalPurged = 0;

for (const relPath of filesToClean) {
  const fullPath = path.resolve(relPath);
  if (!fs.existsSync(fullPath)) continue;

  if (relPath.endsWith('.csv')) {
    const raw = fs.readFileSync(fullPath, 'utf8').replace(/^\uFEFF/, '');
    const lines = raw.split('\n');
    const header = lines[0];
    const cleanLines = [];
    let filePurged = 0;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const match = line.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      if (!match) {
        filePurged++;
        continue;
      }

      const email = match[0].toLowerCase().trim();
      if (suppressed.has(email)) {
        filePurged++;
        continue;
      }

      cleanLines.push(line);
    }

    fs.writeFileSync(fullPath, header + '\n' + cleanLines.join('\n') + '\n', 'utf8');
    console.log(`✅ [CSV DEPURADO] ${relPath}: ${cleanLines.length} activos (eliminados ${filePurged} rebotados/inválidos).`);
    totalPurged += filePurged;

  } else if (relPath.endsWith('.json')) {
    try {
      const raw = fs.readFileSync(fullPath, 'utf8');
      const data = JSON.parse(raw);
      if (Array.isArray(data)) {
        const originalCount = data.length;
        const cleanData = data.filter(item => {
          const email = (item.email || '').toLowerCase().trim();
          return email && !suppressed.has(email);
        });
        const filePurged = originalCount - cleanData.length;
        fs.writeFileSync(fullPath, JSON.stringify(cleanData, null, 2), 'utf8');
        console.log(`✅ [JSON DEPURADO] ${relPath}: ${cleanData.length} activos (eliminados ${filePurged} rebotados).`);
        totalPurged += filePurged;
      }
    } catch (e) {
      console.warn(`Aviso procesando JSON ${relPath}:`, e.message);
    }
  }
}

console.log('\n================================================================================');
console.log(`🎉 PURGA MAESTRA COMPLETADA: ${totalPurged} registros suprimidos de por vida.`);
console.log('================================================================================\n');
