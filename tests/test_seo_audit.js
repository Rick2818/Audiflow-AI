// ==============================================================================
// AUDITFLOW AI - AUTOMATED SEO & INDEXING AUDIT VERIFICATION SUITE
// ==============================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${message}`);
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
  }
}

console.log(`\n=======================================================`);
console.log(`🔍 INICIANDO SUITE DE AUDITORÍA AUTOMATIZADA SEO E INDEXACIÓN`);
console.log(`=======================================================\n`);

// 1. Verificación de robots.txt
console.log(`[TEST GROUP 1] Verificación de /robots.txt:`);
const robotsPath = path.join(rootDir, 'frontend', 'robots.txt');
assert(fs.existsSync(robotsPath), 'El archivo frontend/robots.txt existe');

if (fs.existsSync(robotsPath)) {
  const robotsContent = fs.readFileSync(robotsPath, 'utf8');
  assert(robotsContent.includes('User-agent: *'), 'robots.txt incluye User-agent: *');
  assert(robotsContent.includes('Allow: /'), 'robots.txt incluye Allow: /');
  assert(robotsContent.includes('Disallow: /admin'), 'robots.txt bloquea /admin');
  assert(robotsContent.includes('Sitemap: https://'), 'robots.txt declara la URL del Sitemap XML en HTTPS');
}

// 2. Verificación de sitemap.xml
console.log(`\n[TEST GROUP 2] Verificación de /sitemap.xml:`);
const sitemapPath = path.join(rootDir, 'frontend', 'sitemap.xml');
assert(fs.existsSync(sitemapPath), 'El archivo frontend/sitemap.xml existe');

if (fs.existsSync(sitemapPath)) {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  assert(sitemapContent.includes('<?xml'), 'sitemap.xml es un documento XML válido');
  assert(sitemapContent.includes('<urlset'), 'sitemap.xml contiene etiqueta <urlset>');
  assert(sitemapContent.includes('<loc>https://'), 'sitemap.xml contiene URL canónica en HTTPS');
  assert(!sitemapContent.includes('localhost'), 'sitemap.xml no contiene URLs de localhost');
  assert(!sitemapContent.includes('admin'), 'sitemap.xml no contiene URLs no indexables de administración');
}

// 3. Verificación de frontend/index.html (Canonicals, Open Graph, Schema.org, HTML semántico)
console.log(`\n[TEST GROUP 3] Verificación de frontend/index.html:`);
const indexPath = path.join(rootDir, 'frontend', 'index.html');
assert(fs.existsSync(indexPath), 'El archivo frontend/index.html existe');

if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  assert(indexContent.includes('<link rel="canonical" href="https://'), 'index.html contiene canonical HTTPS pública');
  assert(!indexContent.includes('<link rel="canonical" href="http://localhost'), 'index.html NO contiene canonical a localhost');
  assert(indexContent.includes('og:url') && !indexContent.includes('og:url" content="http://localhost'), 'Open Graph og:url no usa localhost');
  assert(indexContent.includes('og:image') && !indexContent.includes('og:image" content="http://localhost'), 'Open Graph og:image no usa localhost');
  assert(indexContent.includes('google-site-verification'), 'index.html incluye ranura de verificación de Google Search Console');
  assert(indexContent.includes('G-KMESC5J8WH'), 'index.html incluye la etiqueta de Google Analytics 4 GA4');
  assert(indexContent.includes('favicon.svg'), 'index.html referencia al favicon SVG');
  assert(indexContent.includes('@type": "Organization"'), 'Schema.org incluye entidad Organization');
  assert(indexContent.includes('@type": "WebSite"'), 'Schema.org incluye entidad WebSite');
  assert(indexContent.includes('@type": "SoftwareApplication"'), 'Schema.org incluye entidad SoftwareApplication');
  assert(indexContent.includes('aggregateRating'), 'SoftwareApplication incluye aggregateRating');
  assert(indexContent.includes('@type": "FAQPage"'), 'Schema.org incluye entidad FAQPage');
  
  // Verificación de sintaxis limpia (no contiene tags duplicados corruptos)
  assert(!indexContent.includes('</div>                        <span data-i18n="upsell_btn">'), 'index.html no contiene fragmentos de HTML corruptos');
}

// 4. Verificación de frontend/admin.html (noindex, nofollow)
console.log(`\n[TEST GROUP 4] Verificación de frontend/admin.html:`);
const adminPath = path.join(rootDir, 'frontend', 'admin.html');
assert(fs.existsSync(adminPath), 'El archivo frontend/admin.html existe');

if (fs.existsSync(adminPath)) {
  const adminContent = fs.readFileSync(adminPath, 'utf8');
  assert(adminContent.includes('name="robots" content="noindex, nofollow"'), 'admin.html contiene directiva noindex, nofollow');
  assert(adminContent.includes('favicon.svg'), 'admin.html referencia al favicon SVG');
}

// 5. Verificación de frontend/js/i18n.js (HTML lang dinámico)
console.log(`\n[TEST GROUP 5] Verificación de frontend/js/i18n.js:`);
const i18nPath = path.join(rootDir, 'frontend', 'js', 'i18n.js');
assert(fs.existsSync(i18nPath), 'El archivo frontend/js/i18n.js existe');

if (fs.existsSync(i18nPath)) {
  const i18nContent = fs.readFileSync(i18nPath, 'utf8');
  assert(i18nContent.includes('document.documentElement.lang = lang'), 'i18n.js actualiza dinámicamente el atributo lang de <html>');
}

// 6. Verificación de server.js y vercel.json
console.log(`\n[TEST GROUP 6] Verificación de server.js & vercel.json:`);
const serverPath = path.join(rootDir, 'server.js');
const vercelPath = path.join(rootDir, 'vercel.json');

if (fs.existsSync(serverPath)) {
  const serverContent = fs.readFileSync(serverPath, 'utf8');
  assert(serverContent.includes("app.get('/robots.txt'"), 'server.js contiene endpoint para /robots.txt');
  assert(serverContent.includes("app.get('/sitemap.xml'"), 'server.js contiene endpoint para /sitemap.xml');
  assert(serverContent.includes('X-Content-Type-Options'), 'server.js incluye cabeceras HTTP de seguridad');
}

if (fs.existsSync(vercelPath)) {
  const vercelContent = fs.readFileSync(vercelPath, 'utf8');
  assert(vercelContent.includes('/robots.txt'), 'vercel.json define ruta estática para /robots.txt');
  assert(vercelContent.includes('/sitemap.xml'), 'vercel.json define ruta estática para /sitemap.xml');
}

// RESUMEN FINAL
console.log(`\n=======================================================`);
console.log(`📊 RESULTADO FINAL DE LA SUITE SEO & INDEXACIÓN:`);
console.log(`  Pruebas ejecutadas: ${totalTests}`);
console.log(`  Pruebas superadas: ${passedTests}`);
console.log(`  Pruebas fallidas:   ${totalTests - passedTests}`);
console.log(`=======================================================\n`);

if (passedTests === totalTests) {
  console.log(`🎉 ¡TODAS LAS PRUEBAS DE SEO TÉCNICO E INDEXABILIDAD 100% FUNCIONAL HAN PASADO SATISFACTORIAMENTE!\n`);
  process.exit(0);
} else {
  console.error(`⚠️ ALGUNAS PRUEBAS FALLARON. POR FAVOR REVISA EL DIAGNÓSTICO ANTERIOR.\n`);
  process.exit(1);
}
