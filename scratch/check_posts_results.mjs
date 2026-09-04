import dotenv from 'dotenv';
import { BufferPublisher } from '../lib/buffer-publisher.js';
dotenv.config();

async function checkPostsResultsFields() {
  const p = new BufferPublisher();
  const query = `
    query IntrospectPostsResults {
      __type(name: "PostsResults") {
        fields {
          name
        }
      }
    }
  `;
  const res = await p.executeGraphQL(query);
  console.log('PostsResults fields:', res.__type.fields.map(f => f.name));
}

checkPostsResultsFields().catch(console.error);
