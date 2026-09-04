import dotenv from 'dotenv';
import { BufferPublisher } from '../lib/buffer-publisher.js';
dotenv.config();

async function checkMutations() {
  const p = new BufferPublisher();
  const query = `
    query IntrospectMutations {
      __schema {
        mutationType {
          fields {
            name
          }
        }
      }
    }
  `;
  const res = await p.executeGraphQL(query);
  const names = res.__schema.mutationType.fields.map(f => f.name);
  console.log('Mutaciones Buffer disponibles:', names);
}

checkMutations().catch(console.error);
