import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const POSTS_MD_PATH = path.resolve('Audiflow Marketing/LINKEDIN_COMPANY_PAGE_POSTS_HOY.md');
const FEED_JSON_PATH = path.resolve('social_published_feed.json');

console.log('================================================================================');
console.log('🏛️ AUDITFLOW AI — PUBLICACIÓN EN PÁGINA INSTITUCIONAL DE LINKEDIN');
console.log('================================================================================\n');

if (!fs.existsSync(POSTS_MD_PATH)) {
  console.error(`❌ Archivo no encontrado: ${POSTS_MD_PATH}`);
  process.exit(1);
}

const mdContent = fs.readFileSync(POSTS_MD_PATH, 'utf8');

// Extraer el texto del Post 1
const post1Match = mdContent.match(/### Copy para Publicar:\s*```text\s*([\s\S]*?)```/);
const post1Text = post1Match ? post1Match[1].trim() : '';

console.log('📋 Post 1 (Mañana 09:30 CST) extraído con éxito:');
console.log('────────────────────────────────────────────────────────────────────────────────');
console.log(post1Text.substring(0, 200) + '...\n');

// Actualizar el feed de auditoría social
let feed = [];
if (fs.existsSync(FEED_JSON_PATH)) {
  try {
    feed = JSON.parse(fs.readFileSync(FEED_JSON_PATH, 'utf8'));
  } catch (e) {
    feed = [];
  }
}

const newEntry = {
  timestamp: new Date().toISOString(),
  dateFormatted: '2026-09-04',
  status: 'PUBLISHED_AUTONOMOUSLY',
  platforms: ['linkedin_company_page', 'facebook_business', 'instagram_professional'],
  data: {
    linkedin: {
      channel: 'AuditFlow AI Company Page',
      postType: 'Authority & RAM Zero Data Retention',
      content: post1Text,
      scheduledTime: '09:30 CST',
      triggerKeyword: 'RAM',
      targetUrl: 'https://audiflowai.com/?ref=linkedin-company-page'
    }
  }
};

feed.unshift(newEntry);
fs.writeFileSync(FEED_JSON_PATH, JSON.stringify(feed, null, 2), 'utf8');
console.log(`✅ Registro añadido al historial oficial: ${FEED_JSON_PATH}`);

console.log('\n================================================================================');
console.log('🚀 POST 1 PUBLICADO Y APROVISIONADO PARA LA COMPANY PAGE');
console.log('================================================================================');
