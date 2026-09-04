import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.BUFFER_ACCESS_TOKEN;

async function doDelete() {
  const query = `
    mutation {
      deletePost(input: { id: "6a9ae563ef3e19024e8c9b82" }) {
        __typename
        ... on VoidMutationError {
          message
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
  console.log('DELETE RESULT:', JSON.stringify(data, null, 2));
}

doDelete();
