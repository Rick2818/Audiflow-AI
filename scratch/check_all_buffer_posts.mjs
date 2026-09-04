import dotenv from 'dotenv';
import { BufferPublisher } from '../lib/buffer-publisher.js';
dotenv.config();

async function checkAllBufferPosts() {
  const p = new BufferPublisher();
  const orgId = await p.getOrganizationId();

  const query = `
    query GetAllPosts($input: PostsInput!) {
      posts(input: $input) {
        edges {
          node {
            id
            channelService
            status
            sentAt
            dueAt
            text
            metrics {
              name
              value
            }
          }
        }
      }
    }
  `;

  const res = await p.executeGraphQL(query, { input: { organizationId: orgId } });
  const posts = res.posts?.edges || [];
  console.log(`Total de posts encontrados en Buffer: ${posts.length}\n`);

  posts.forEach((p, idx) => {
    const n = p.node;
    console.log(`[${idx + 1}] Canal: ${n.channelService} | Estado: ${n.status} | SentAt: ${n.sentAt || 'No enviado'} | DueAt: ${n.dueAt || 'N/A'}`);
    console.log(`    Texto: ${n.text?.substring(0, 70).replace(/\n/g, ' ')}...`);
    console.log(`    Métricas: ${JSON.stringify(n.metrics)}`);
  });
}

checkAllBufferPosts().catch(console.error);
