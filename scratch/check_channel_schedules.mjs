import dotenv from 'dotenv';
import { BufferPublisher } from '../lib/buffer-publisher.js';
dotenv.config();

async function checkChannelSchedules() {
  const p = new BufferPublisher();
  const query = `
    query GetPostingSchedules($input: ChannelsInput!) {
      channels(input: $input) {
        id
        displayName
        service
        timezone
        postingSchedule {
          day
          paused
          times
        }
      }
    }
  `;
  const orgId = await p.getOrganizationId();
  const res = await p.executeGraphQL(query, { input: { organizationId: orgId } });
  console.log(JSON.stringify(res.channels, null, 2));
}

checkChannelSchedules().catch(console.error);
