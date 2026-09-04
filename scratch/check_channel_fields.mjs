import dotenv from 'dotenv';
import { BufferPublisher } from '../lib/buffer-publisher.js';
dotenv.config();

async function checkChannelType() {
  const p = new BufferPublisher();
  const query = `
    query IntrospectChannel {
      __type(name: "Channel") {
        fields {
          name
        }
      }
    }
  `;
  const res = await p.executeGraphQL(query);
  console.log('Campos de Channel:', res.__type.fields.map(f => f.name));
}

checkChannelType().catch(console.error);
