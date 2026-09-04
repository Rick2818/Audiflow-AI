import dotenv from 'dotenv';
import { BufferPublisher } from '../lib/buffer-publisher.js';
dotenv.config();

async function getSentPosts() {
  const p = new BufferPublisher();
  const channels = await p.getChannels();

  for (const ch of channels) {
    console.log(`\n======================================================`);
    console.log(`CANAL: [${ch.service.toUpperCase()}] ${ch.displayName} (${ch.id})`);
    console.log(`======================================================`);
    
    const query = `
      query GetChannelPosts($input: PostsInput!) {
        posts(input: $input) {
          edges {
            node {
              id
              status
              text
              createdAt
              sentAt
              externalLink
              metrics {
                name
                value
              }
            }
          }
        }
      }
    `;
    try {
      const res = await p.executeGraphQL(query, { input: { channelId: ch.id } });
      const edges = res.posts?.edges || [];
      console.log(`Posts encontrados: ${edges.length}`);
      edges.forEach(e => {
        const n = e.node;
        console.log(`\n- ID: ${n.id} | Status: ${n.status} | SentAt: ${n.sentAt}`);
        console.log(`  Enlace externo: ${n.externalLink || 'N/A'}`);
        console.log(`  Texto: ${n.text?.substring(0, 80).replace(/\n/g, ' ')}...`);
        console.log(`  Métricas:`, JSON.stringify(n.metrics));
      });
    } catch(err) {
      console.warn(`Error en ${ch.displayName}:`, err.message);
    }
  }
}

getSentPosts().catch(console.error);
