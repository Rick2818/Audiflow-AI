import verifyClientHandler from '../lib/verify-client.js';

export default async function handler(req, res) {
  return await verifyClientHandler(req, res);
}
