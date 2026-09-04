import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { BufferPublisher } from '../lib/buffer-publisher.js';

dotenv.config();

async function runBufferPublication() {
  console.log('================================================================================');
  console.log('🛰️ AUDITFLOW AI — PUBLICACIÓN EN VIVO VÍA BUFFER (API GRAPHQL 2026)');
  console.log('================================================================================\n');

  const token = (process.env.BUFFER_ACCESS_TOKEN || '').trim();
  console.log(`🔑 Token detectado: ${token.substring(0, 8)}...${token.slice(-4)}\n`);

  const publisher = new BufferPublisher(token);

  try {
    console.log('⏳ Consultando canales conectados en Buffer...');
    const channels = await publisher.getChannels();

    console.log(`✅ ${channels.length} Canales Detectados:\n`);
    channels.forEach((ch, idx) => {
      console.log(`   ${idx + 1}. [${ch.service.toUpperCase()}] ${ch.displayName} (ID: ${ch.id})`);
    });

    // Buscar canal de LinkedIn
    const linkedinChannel = channels.find(c => (c.service || '').toLowerCase() === 'linkedin');

    if (!linkedinChannel) {
      console.error('\n❌ No se encontró ningún canal de LinkedIn conectado en Buffer.');
      return;
    }

    console.log(`\n🎯 Canal Objetivo Seleccionado: [LINKEDIN] ${linkedinChannel.displayName} (${linkedinChannel.id})`);

    // Leer el Post 1 desde Audiflow Marketing/LINKEDIN_COMPANY_PAGE_POSTS_HOY.md
    const mdPath = path.resolve('Audiflow Marketing/LINKEDIN_COMPANY_PAGE_POSTS_HOY.md');
    const mdContent = fs.readFileSync(mdPath, 'utf8');
    const post1Match = mdContent.match(/### Copy para Publicar:\s*```text\s*([\s\S]*?)```/);
    const postText = post1Match ? post1Match[1].trim() : '';

    console.log('✍️ Enviando publicación a LinkedIn a través de Buffer API (mode: shareNow)...');
    const result = await publisher.createPost({
      channelId: linkedinChannel.id,
      text: postText,
      mode: 'shareNow'
    });

    console.log('\n================================================================================');
    console.log('🎉 ¡PUBLICACIÓN EXITOSA EN LINKEDIN EN VIVO!');
    console.log(`   - ID del Post en Buffer: ${result.id}`);
    console.log(`   - Estado: ${result.status}`);
    console.log('================================================================================\n');
  } catch (err) {
    console.error('\n❌ Error al publicar en Buffer:', err.message);
  }
}

runBufferPublication();
