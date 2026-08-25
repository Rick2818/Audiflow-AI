import handler from '../api/admin.js';

console.log('🚀 Iniciando Despacho Controlado de Campaña Quirúrgica (25 Socios Directores Líderes)...');

const mockReq = {
  method: 'POST',
  headers: {
    'x-admin-password': process.env.ADMIN_PASSWORD || 'Audiflow2026SecureAdminPass!',
    'content-type': 'application/json'
  },
  body: {
    action: 'fast_track_blast',
    limit: 25,
    test_mode: false
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
    console.log(`\n📊 [Resultado del Despacho]: Status ${this._status}`);
    console.log(`✅ Total de Correos Procesados: ${d.count || d.total_processed || 0}`);
    console.log(`📡 Éxito: ${d.success}`);
    if (d.dispatched) {
      console.log(`\n📋 Primeros 5 Decisores Despachados:`);
      d.dispatched.slice(0, 5).forEach((item, idx) => {
        console.log(`   ${idx + 1}. ${item.name} (${item.company}) -> ${item.email} [${item.status}]`);
      });
    }
    return this;
  },
  end() { return this; }
};

handler(mockReq, mockRes).catch(err => {
  console.error('❌ Error durante el despacho:', err);
  process.exit(1);
});
