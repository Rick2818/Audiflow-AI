import dotenv from 'dotenv';
import { BufferPublisher } from '../lib/buffer-publisher.js';
dotenv.config();

async function checkScheduleV2Fields() {
  const p = new BufferPublisher();
  const query = `
    query IntrospectScheduleV2 {
      __type(name: "ScheduleV2") {
        fields {
          name
          type {
            name
            kind
          }
        }
      }
    }
  `;
  const res = await p.executeGraphQL(query);
  console.log('ScheduleV2 fields:', JSON.stringify(res.__type.fields, null, 2));
}

checkScheduleV2Fields().catch(console.error);
