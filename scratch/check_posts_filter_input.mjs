import dotenv from 'dotenv';
import { BufferPublisher } from '../lib/buffer-publisher.js';
dotenv.config();

async function checkPostsFilterInput() {
  const p = new BufferPublisher();
  const query = `
    query IntrospectFilter {
      __type(name: "PostsFilterInput") {
        inputFields {
          name
        }
      }
    }
  `;
  const res = await p.executeGraphQL(query);
  console.log('PostsFilterInput fields:', res.__type.inputFields.map(f => f.name));
}

checkPostsFilterInput().catch(console.error);
