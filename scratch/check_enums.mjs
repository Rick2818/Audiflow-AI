import dotenv from 'dotenv';
import { BufferPublisher } from '../lib/buffer-publisher.js';
dotenv.config();

async function checkEnums() {
  const p = new BufferPublisher();
  const query = `
    query IntrospectEnums {
      shareMode: __type(name: "ShareMode") {
        enumValues { name }
      }
      schedulingType: __type(name: "SchedulingType") {
        enumValues { name }
      }
    }
  `;
  const res = await p.executeGraphQL(query);
  console.log('ShareMode:', res.shareMode.enumValues.map(e => e.name));
  console.log('SchedulingType:', res.schedulingType.enumValues.map(e => e.name));
}

checkEnums().catch(console.error);
