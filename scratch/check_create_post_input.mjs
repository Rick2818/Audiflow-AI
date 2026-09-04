import dotenv from 'dotenv';
import { BufferPublisher } from '../lib/buffer-publisher.js';
dotenv.config();

async function checkCreatePostInput() {
  const p = new BufferPublisher();
  const query = `
    query IntrospectCreatePostInput {
      __type(name: "CreatePostInput") {
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
  console.log('Campos de CreatePostInput:', JSON.stringify(res.__type.inputFields, null, 2));
}

checkCreatePostInput().catch(console.error);
