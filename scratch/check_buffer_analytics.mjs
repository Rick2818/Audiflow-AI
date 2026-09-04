import dotenv from 'dotenv';
import { BufferPublisher } from '../lib/buffer-publisher.js';
dotenv.config();

async function checkBufferAnalytics() {
  const p = new BufferPublisher();
  const orgId = await p.getOrganizationId();
  const channels = await p.getChannels();

  for (const ch of channels) {
    console.log(`\n======================================================`);
    console.log(`CANAL: [${ch.service.toUpperCase()}] ${ch.displayName} (${ch.id})`);
    console.log(`======================================================`);
    
    // Consultar posts recientes (sent / updates)
    const query = `
      query GetChannelPosts($input: PostsInput!) {
        posts(input: $input) {
          total
          edges {
            node {
              id
              status
              text
              createdAt
              sentAt
            }
          }
        }
      }
    `;
    try {
      const res = await p.executeGraphQL(query, { input: { channelId: ch.id } });
      console.log(`Total posts en historial: ${res.posts?.total}`);
      if (res.posts?.edges) {
        res.posts.edges.slice(0, 5).forEach(e => {
          console.log(`- Post ID: ${e.node.id} | Status: ${e.node.status} | SentAt: ${e.node.sentAt} | Texto: ${e.node.text?.substring(0, 60)}...`);
        });
      }
    } catch(err) {
      console.warn(`Error consultando posts de ${ch.displayName}:`, err.message);
    }
  }
}

checkBufferAnalytics().catch(console.error);
