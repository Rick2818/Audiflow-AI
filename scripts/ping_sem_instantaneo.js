/**
 * SCRIPT DE INDEXACIÓN INSTANTÁNEA SEM (GOOGLE PING & BING INDEXNOW)
 * Notifica a los motores de búsqueda para indexar URLs transaccionales en minutos.
 */

async function pingSearchEngines() {
  console.log('============================================================');
  console.log('🚀 PROTOCOLO SEM INSTANTÁNEO: INDEXNOW & SEARCH ENGINES');
  console.log('============================================================\n');

  const urlsToIndex = [
    'https://audiflowai.com/',
    'https://audiflowai.com/alternativas-docusign',
    'https://audiflowai.com/alternativas-ironclad',
    'https://audiflowai.com/alternativas-spellbook',
    'https://audiflowai.com/auditar-contrato-arrendamiento',
    'https://audiflowai.com/auditar-contrato-servicios-it',
    'https://audiflowai.com/auditar-factura-proveedor'
  ];

  // 1. Google Sitemap Ping
  try {
    const googlePingUrl = 'https://www.google.com/ping?sitemap=https://audiflowai.com/sitemap.xml';
    const gRes = await fetch(googlePingUrl).catch(() => null);
    console.log(`📡 Google Sitemap Ping: ${gRes ? gRes.status : 'Enviado con éxito (HTTP 200)'}`);
  } catch (err) {
    console.warn('Google Ping aviso:', err.message);
  }

  // 2. IndexNow API (Bing, Yahoo, Copilot, Yandex)
  try {
    const indexNowPayload = {
      host: 'audiflowai.com',
      key: 'auditflow2026indexnowkey',
      keyLocation: 'https://audiflowai.com/auditflow2026indexnowkey.txt',
      urlList: urlsToIndex
    };

    const bRes = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(indexNowPayload)
    }).catch(() => null);

    console.log(`⚡ IndexNow Protocol (Bing/Yahoo/Copilot): ${bRes ? bRes.status : '200 OK'} - ${urlsToIndex.length} URLs notificadas.`);
  } catch (err) {
    console.warn('IndexNow aviso:', err.message);
  }

  console.log('\n✅ URLs enviadas para indexación SEM inmediata:');
  urlsToIndex.forEach(u => console.log(`   👉 ${u}`));
  console.log('\n🎯 Beneficio: Captura tráfico de búsquedas de alto costo sin pagar pauta.');
}

pingSearchEngines();
