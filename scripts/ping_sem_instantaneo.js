import fs from 'fs';
import path from 'path';

/**
 * ==============================================================================
 * AUDITFLOW AI — PROTOCOLO DE INDEXACIÓN SEM & SEO INSTANTÁNEO (INDEXNOW / BING / COPILOT)
 * ==============================================================================
 * Notifica inmediatamente a los motores de búsqueda (Bing, Microsoft Copilot,
 * Yahoo, Yandex y Naver) sobre todas las páginas transaccionales de alto CPC.
 * ==============================================================================
 */

async function pingSearchEngines() {
  console.log('============================================================');
  console.log('🚀 PROTOCOLO SEM/SEO INSTANTÁNEO: BING COPILOT & INDEXNOW');
  console.log('============================================================\n');

  // 1. Extraer todas las URLs de sitemap.xml
  const sitemapPath = path.resolve('sitemap.xml');
  let urlsToIndex = [
    'https://audiflowai.com/',
    'https://audiflowai.com/alternativas-docusign',
    'https://audiflowai.com/alternativas-ironclad',
    'https://audiflowai.com/alternativas-spellbook',
    'https://audiflowai.com/auditar-contrato-arrendamiento',
    'https://audiflowai.com/auditar-contrato-servicios-it',
    'https://audiflowai.com/auditar-factura-proveedor',
    'https://audiflowai.com/video',
    'https://audiflowai.com/verificar'
  ];

  if (fs.existsSync(sitemapPath)) {
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    const matches = sitemapContent.match(/<loc>(.*?)<\/loc>/g);
    if (matches && matches.length > 0) {
      urlsToIndex = matches.map(m => m.replace(/<\/?loc>/g, '').trim());
    }
  }

  console.log(`📡 Total de URLs identificadas para indexación: ${urlsToIndex.length}`);

  // 2. IndexNow Protocol (Bing, Yahoo, Copilot, Yandex, Seznam)
  const indexNowPayload = {
    host: 'audiflowai.com',
    key: 'auditflow2026indexnowkey',
    keyLocation: 'https://audiflowai.com/auditflow2026indexnowkey.txt',
    urlList: urlsToIndex
  };

  const endpoints = [
    { name: 'IndexNow Central Gateway', url: 'https://api.indexnow.org/indexnow' },
    { name: 'Microsoft Bing / Copilot Direct', url: 'https://www.bing.com/indexnow' }
  ];

  for (const ep of endpoints) {
    try {
      console.log(`📤 Enviando lote a ${ep.name}...`);
      const response = await fetch(ep.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(indexNowPayload)
      });
      console.log(`   ✅ ${ep.name}: Respuesta HTTP ${response.status} (${response.statusText || 'OK'})`);
    } catch (e) {
      console.warn(`   ⚠️ Aviso en ${ep.name}:`, e.message);
    }
  }

  console.log('\n============================================================');
  console.log('✅ URLs indexadas para tráfico orgánico y consultas de Copilot:');
  urlsToIndex.forEach((u, i) => console.log(`   [${i + 1}] ${u}`));
  console.log('============================================================\n');
}

pingSearchEngines().catch(console.error);
