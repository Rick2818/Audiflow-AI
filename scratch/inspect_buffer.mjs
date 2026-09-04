import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.BUFFER_ACCESS_TOKEN;

async function test() {
  const query = `
    query {
      __type(name: "PostActionPayload") {
        possibleTypes {
          name
          fields {
            name
          }
        }
      }
    }
  `;
  const res = await fetch('https://api.buffer.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ query })
  });
  const data = await res.json();
  console.log('POSSIBLE TYPES:', JSON.stringify(data?.data?.__type?.possibleTypes, null, 2));
}

test();
