import handler from './api/admin.js';

async function testApi() {
  console.log('--- Testing API Endpoints ---');

  // Test 1: Unauthorized GET
  {
    const req = { method: 'GET', headers: {} };
    let statusCode = 200;
    let jsonResult = null;
    const res = {
      setHeader: () => {},
      status: (code) => { statusCode = code; return { json: (d) => { jsonResult = d; }, end: () => {} }; }
    };
    await handler(req, res);
    console.log('Test 1 (Unauthorized GET):', statusCode === 401 ? 'PASS (401)' : `FAIL (${statusCode})`);
  }

  // Test 2: Login with correct password
  {
    const req = {
      method: 'POST',
      headers: { 'x-admin-password': 'AuditFlow2026!' },
      body: { action: 'login', password: 'AuditFlow2026!' }
    };
    let statusCode = 200;
    let jsonResult = null;
    const res = {
      setHeader: () => {},
      status: (code) => { statusCode = code; return { json: (d) => { jsonResult = d; } }; }
    };
    await handler(req, res);
    console.log('Test 2 (Login with password):', (statusCode === 200 && jsonResult.success) ? 'PASS (Token: ' + jsonResult.token + ')' : 'FAIL');
  }

  // Test 3: Authorized GET stats & leads
  {
    const req = {
      method: 'GET',
      headers: { 'authorization': 'Bearer admin_token_auditflow_2026' }
    };
    let statusCode = 200;
    let jsonResult = null;
    const res = {
      setHeader: () => {},
      status: (code) => { statusCode = code; return { json: (d) => { jsonResult = d; } }; }
    };
    await handler(req, res);
    console.log('Test 3 (Authorized GET stats):', (statusCode === 200 && jsonResult.success && jsonResult.leads?.length > 0) ? `PASS (${jsonResult.leads.length} leads returned)` : 'FAIL');
  }

  // Test 4: Auto heal configuration
  {
    const req = {
      method: 'POST',
      headers: { 'authorization': 'Bearer admin_token_auditflow_2026' },
      body: { action: 'auto_heal_configuration' }
    };
    let statusCode = 200;
    let jsonResult = null;
    const res = {
      setHeader: () => {},
      status: (code) => { statusCode = code; return { json: (d) => { jsonResult = d; } }; }
    };
    await handler(req, res);
    console.log('Test 4 (Auto-heal):', (statusCode === 200 && jsonResult.success) ? 'PASS' : 'FAIL');
  }

  // Test 5: Outreach test mode campaign
  {
    const req = {
      method: 'POST',
      headers: { 'authorization': 'Bearer admin_token_auditflow_2026' },
      body: {
        action: 'send_outreach_campaign',
        test_mode: true,
        prospects: [
          { email: 'test@empresa.com', name: 'Test User', company: 'Test Corp', role: 'CFO', country: 'El Salvador' }
        ]
      }
    };
    let statusCode = 200;
    let jsonResult = null;
    const res = {
      setHeader: () => {},
      status: (code) => { statusCode = code; return { json: (d) => { jsonResult = d; } }; }
    };
    await handler(req, res);
    console.log('Test 5 (Outreach campaign test mode):', (statusCode === 200 && jsonResult.success && jsonResult.dispatched === 1) ? 'PASS' : 'FAIL');
  }

  console.log('--- All API Tests Completed ---');
}

testApi().catch(console.error);
