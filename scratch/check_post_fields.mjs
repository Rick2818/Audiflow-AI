import dotenv from 'dotenv';
import { BufferPublisher } from '../lib/buffer-publisher.js';
dotenv.config();

async function checkPostFields() {
  const p = new BufferPublisher();
  const query = `
    query IntrospectPost {
      __type(name: "Post") {
        fields {
          name
        }
      }
    }
  `;
  const res = await p.executeGraphQL(query);
  console.log('Post fields:', res.__type.fields.map(f => f.name));
}

checkPostFields().catch(console.error);
