import dotenv from 'dotenv';
import { BufferPublisher } from '../lib/buffer-publisher.js';
dotenv.config();

async function checkPostsInputDetail() {
  const p = new BufferPublisher();
  const query = `
    query IntrospectPostsInputDetail {
      __type(name: "PostsInput") {
        inputFields {
          name
          type {
            name
            kind
            ofType {
              name
              kind
            }
          }
        }
      }
    }
  `;
  const res = await p.executeGraphQL(query);
  console.log(JSON.stringify(res.__type.inputFields, null, 2));
}

checkPostsInputDetail().catch(console.error);
