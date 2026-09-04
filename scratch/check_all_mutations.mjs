import dotenv from 'dotenv';
import { BufferPublisher } from '../lib/buffer-publisher.js';
dotenv.config();

async function checkChannelMutations() {
  const p = new BufferPublisher();
  const query = `
    query IntrospectAllMutations {
      __schema {
        mutationType {
          fields {
            name
            description
          }
        }
      }
    }
  `;
  const res = await p.executeGraphQL(query);
  console.log(res.__schema.mutationType.fields);
}

checkChannelMutations().catch(console.error);
