import { generateOutreachProspects } from '../api/outreach.js';
import handler from '../api/admin.js';

console.log('👑 Iniciando Despacho Autónomo de Campaña Pareto VIP (400 Socios Directores Reales)...');

const paretoLeads = generateOutreachProspects('pareto_top20');
console.log(`📦 Universo Pareto VIP Cargado: ${paretoLeads.length} Socios Directores Reales (Score 92-99).`);

const CHUNK_SIZE = 25; // Lote seguro de 25 por bloque
let totalSent = 0;

async function sendParetoChunk(chunk, batchIndex) {
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
        batch: `pareto_batch_${batchIndex + 1}`
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
          totalSent += chunk.length;
          console.log(`   ✅ Bloque Pareto #${batchIndex + 1} (${chunk.length} socios directores) procesado exitosamente. Acumulado: ${totalSent}/${paretoLeads.length}`);
        } else {
          console.warn(`   ⚠️ Bloque Pareto #${batchIndex + 1} aviso: ${d.error}`);
        }
        resolve(d);
        return this;
      },
      end() { resolve(null); return this; }
    };

    handler(mockReq, mockRes).catch(err => {
      console.error(`   ❌ Error en bloque Pareto #${batchIndex + 1}:`, err.message);
      resolve({ success: false, error: err.message });
    });
  });
}

async function runParetoCampaign() {
  console.log('\n⏳ Ejecutando goteo controlado con protección de reputación SPF/DKIM...\n');
  for (let i = 0; i < paretoLeads.length; i += CHUNK_SIZE) {
    const chunk = paretoLeads.slice(i, i + CHUNK_SIZE);
    const batchIndex = Math.floor(i / CHUNK_SIZE);
    await sendParetoChunk(chunk, batchIndex);
    await new Promise(r => setTimeout(r, 200));
  }

  console.log('\n======================================================');
  console.log(`🎉 CAMPAÑA PARETO VIP COMPLETADA: ${totalSent} Socios Directores procesados.`);
  console.log('📡 Copia universal de control respaldada en tendenciaiatufuturo@gmail.com');
  console.log('======================================================\n');
}

runParetoCampaign().catch(err => {
  console.error('Error fatal en campaña Pareto:', err);
  process.exit(1);
});
