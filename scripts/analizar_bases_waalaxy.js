import fs from 'fs';

function inspectPyme() {
  const lines = fs.readFileSync('Waalaxy/pyme_lawyers_250_waalaxy.csv', 'utf8').split('\n').filter(Boolean).slice(1);
  const countries = {};
  const roles = {};
  for (const line of lines) {
    const parts = line.split('","').map(p => p.replace(/"/g, ''));
    const country = parts[5] || 'Desconocido';
    const role = parts[2] || 'Desconocido';
    countries[country] = (countries[country] || 0) + 1;
    roles[role] = (roles[role] || 0) + 1;
  }
  return { total: lines.length, countries, roles };
}

function inspectCfos() {
  const lines = fs.readFileSync('Waalaxy/CFOs_Audiflow_AI.csv', 'utf8').split('\n').filter(Boolean).slice(1);
  const locations = {};
  const roles = {};
  const emailDomains = {};
  for (const line of lines) {
    const parts = line.split(',');
    const location = parts[parts.length - 1]?.trim() || 'Desconocido';
    const role = parts[4]?.trim() || 'Desconocido';
    const email = parts[5]?.trim() || '';
    const domain = email.split('@')[1] || 'none';
    const tld = domain.split('.').pop();
    locations[location] = (locations[location] || 0) + 1;
    roles[role] = (roles[role] || 0) + 1;
    emailDomains[tld] = (emailDomains[tld] || 0) + 1;
  }
  return { total: lines.length, locations, roles, emailDomains };
}

console.log('=== PYME LAWYERS 250 ===');
console.log(JSON.stringify(inspectPyme(), null, 2));

console.log('\n=== CFOS AUDIFLOW AI 500 ===');
console.log(JSON.stringify(inspectCfos(), null, 2));
