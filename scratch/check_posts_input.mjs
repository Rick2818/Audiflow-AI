import dotenv from 'dotenv';
import { BufferPublisher } from '../lib/buffer-publisher.js';
dotenv.config();

async function checkPostsInput() {
  const p = new BufferPublisher();
  const query = `
    query IntrospectPostsInput {
      __type(name: "PostsInput") {
        inputFields {
          name
        }
      }
    }
  `;
  const res = await p.executeGraphQL(query);
  console.log('PostsInput fields:', res.__type.inputFields.map(f => f.name));
}

checkPostsInput().catch(console.error);
