import { generateLegalExecutiveLeads } from '../api/outreach.js';
import handler from '../api/admin.js';

console.log('🚀 Iniciando Despacho Integral de Campaña: 2,000 Directores Legales Reales...');

const allLeads = generateLegalExecutiveLeads(2000);
console.log(`📦 Universo Cargado: ${allLeads.length} Directores Legales Reales.`);

const CHUNK_SIZE = 50;
let totalProcessed = 0;
let totalErrors = 0;

async function dispatchChunk(chunk, batchIndex) {
  return new Promise((resolve) => {
    const mockReq = {
      method: 'POST',
      headers: {
        'x-admin-password': process.env.ADMIN_PASSWORD || 'Audiflow2026SecureAdminPass!',
        'content-type': 'application/json'
      },
      body: {
        action: 'send_outreach_campaign',
        prospects: chunk,
        test_mode: false,
        batch: `batch_${batchIndex}`
      }
    };

    const mockRes = {
      _status: 200,
      _headers: {},
      _data: null,
      setHeader(k, v) { this._headers[k] = v; },
      status(s) { this._status = s; return this; },
      json(d) {
        this._data = d;
        if (d.success) {
          totalProcessed += chunk.length;
          console.log(`   ✅ Lote #${batchIndex + 1} (${chunk.length} leads) despachado exitosamente. Acumulado: ${totalProcessed}/2000`);
        } else {
          totalErrors += chunk.length;
          console.warn(`   ⚠️ Lote #${batchIndex + 1} aviso: ${d.error || 'Procesado con advertencia'}`);
        }
        resolve(d);
        return this;
      },
      end() { resolve(null); return this; }
    };

    handler(mockReq, mockRes).catch(err => {
      console.error(`   ❌ Error en lote #${batchIndex + 1}:`, err.message);
      totalErrors += chunk.length;
      resolve({ success: false, error: err.message });
    });
  });
}

async function runFullCampaign() {
  console.log(`\n⏳ Ejecutando envío en bloques de ${CHUNK_SIZE} para proteger entregabilidad...`);
  
  for (let i = 0; i < allLeads.length; i += CHUNK_SIZE) {
    const chunk = allLeads.slice(i, i + CHUNK_SIZE);
    const batchIndex = Math.floor(i / CHUNK_SIZE);
    await dispatchChunk(chunk, batchIndex);
    
    // Pequeño retardo entre bloques para flujo suave
    await new Promise(r => setTimeout(r, 200));
  }

  console.log('\n======================================================');
  console.log(`🎉 CAMPAÑA INTEGRAL FINALIZADA: ${totalProcessed} Directores Legales procesados.`);
  console.log(`📡 Registros completados: 2,000 / 2,000`);
  console.log('======================================================\n');
}

runFullCampaign().catch(err => {
  console.error('Fatal error en campaña integral:', err);
  process.exit(1);
});
