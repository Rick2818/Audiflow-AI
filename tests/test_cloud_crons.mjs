import http from 'http';
import bufferMorningHandler from '../api/cron/buffer-morning.js';
import bufferEveningHandler from '../api/cron/buffer-evening.js';
import storytellingHandler from '../api/cron/storytelling.js';
import nordicSowerHandler from '../api/cron/nordic-sower.js';
import masterDispatcherHandler from '../api/cron/master-dispatcher.js';

function mockReqRes(query = {}, headers = {}) {
  const req = {
    method: 'GET',
    headers: {
      'x-vercel-cron': '1',
      ...headers
    },
    query: {
      ...query
    }
  };

  let statusCode = 200;
  let responseData = null;
  const resHeaders = {};

  const res = {
    setHeader: (k, v) => { resHeaders[k] = v; },
    status: (code) => {
      statusCode = code;
      return res;
    },
    json: (data) => {
      responseData = data;
      return res;
    },
    end: () => res
  };

  return { req, res, getResult: () => ({ statusCode, responseData }) };
}

async function runTests() {
  console.log('🧪 Probando Vercel Serverless Crons & Master Dispatcher (Dry Run)...\n');

  // Test 1: buffer-morning
  {
    const { req, res, getResult } = mockReqRes({ dryRun: 'true' });
    await bufferMorningHandler(req, res);
    const { statusCode, responseData } = getResult();
    console.log(`1. /api/cron/buffer-morning: Status ${statusCode}`, responseData?.event || responseData);
    if (statusCode !== 200) throw new Error('Falló buffer-morning');
  }

  // Test 2: buffer-evening
  {
    const { req, res, getResult } = mockReqRes({ dryRun: 'true' });
    await bufferEveningHandler(req, res);
    const { statusCode, responseData } = getResult();
    console.log(`2. /api/cron/buffer-evening: Status ${statusCode}`, responseData?.event || responseData);
    if (statusCode !== 200) throw new Error('Falló buffer-evening');
  }

  // Test 3: storytelling
  {
    const { req, res, getResult } = mockReqRes({ dryRun: 'true' });
    await storytellingHandler(req, res);
    const { statusCode, responseData } = getResult();
    console.log(`3. /api/cron/storytelling: Status ${statusCode}`, responseData?.event || responseData);
    if (statusCode !== 200) throw new Error('Falló storytelling');
  }

  // Test 4: nordic-sower
  {
    const { req, res, getResult } = mockReqRes({ dryRun: 'true' });
    await nordicSowerHandler(req, res);
    const { statusCode, responseData } = getResult();
    console.log(`4. /api/cron/nordic-sower: Status ${statusCode}`, responseData?.event || responseData);
    if (statusCode !== 200) throw new Error('Falló nordic-sower');
  }

  // Test 5: master-dispatcher (dryRun auto-detect)
  {
    const { req, res, getResult } = mockReqRes({ dryRun: 'true' });
    await masterDispatcherHandler(req, res);
    const { statusCode, responseData } = getResult();
    console.log(`5. /api/cron/master-dispatcher: Status ${statusCode}`, responseData?.event, `| Task: ${responseData?.selectedTask}`);
    if (statusCode !== 200) throw new Error('Falló master-dispatcher');
  }

  // Test 6: Auth Rejection Test
  {
    const { req, res, getResult } = mockReqRes({}, { 'x-vercel-cron': '0' });
    await masterDispatcherHandler(req, res);
    const { statusCode } = getResult();
    console.log(`6. Auth Rejection Test: Status ${statusCode} (Esperado: 401)`);
    if (statusCode !== 401) throw new Error('Falló verificación de seguridad');
  }

  console.log('\n✅ TODOS LOS TESTS PASARON CON ÉXITO (6/6). INFRAESTRUCTURA 100% OPERATIVA.');
}

runTests().catch(err => {
  console.error('❌ Error en tests:', err);
  process.exit(1);
});
