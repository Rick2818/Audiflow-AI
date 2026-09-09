import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { filterActiveLeads } from '../lib/bounce-suppression.js';

dotenv.config();

const API_KEY = process.env.INSTANTLY_API_KEY;
const CAMPAIGN_ID = '544d944d-b31e-4d3d-bd82-ce8ddad9e371';

function parseCsvLine(text) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      result.push(cur.trim().replace(/^"|"$/g, ''));
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur.trim().replace(/^"|"$/g, ''));
  return result;
}

async function uploadLeadToInstantly(lead) {
  const payload = {
    campaign_id: CAMPAIGN_ID,
    email: lead.email,
    first_name: lead.firstName,
    last_name: lead.lastName,
    company_name: lead.company,
    custom_variables: {
      city: lead.city || 'San Salvador',
      trial_url: 'https://audiflowai.com/?ref=instantly-partner'
    }
  };

  const res = await fetch('https://api.instantly.ai/api/v2/leads', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return { email: lead.email, status: res.status };
}

export async function syncLeadsToInstantly(limit = 25) {
  console.log('================================================================================');
  console.log('🚀 AUDITFLOW AI — SINCRONIZACIÓN DE PROSPECTOS HACIA INSTANTLY.AI');
  console.log('================================================================================\n');

  if (!API_KEY) {
    throw new Error('Falta INSTANTLY_API_KEY en .env');
  }

  const csvPath = path.resolve('Waalaxy/waalaxy_el_salvador_250_medianos.csv');
  const rawCsv = fs.readFileSync(csvPath, 'utf8').replace(/^\uFEFF/, '');
  const lines = rawCsv.split('\n').filter(l => l.trim().length > 0);
  const leads = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    if (cols.length >= 7) {
      const email = cols[6]?.trim().toLowerCase();
      const firstName = cols[0]?.trim();
      const lastName = cols[1]?.trim();
      const companyName = cols[3]?.trim();
      const city = cols[4]?.trim();

      if (email && email.includes('@')) {
        leads.push({ email, firstName, lastName, company: companyName, city });
      }
    }
  }

  // Filtrar rebotes conocidos
  const cleanLeads = filterActiveLeads(leads);
  const targetBatch = cleanLeads.slice(0, limit);
  console.log(`📋 Total en CSV: ${leads.length} | Validados: ${cleanLeads.length} | Lote actual: ${targetBatch.length}`);

  let uploaded = 0;
  for (const lead of targetBatch) {
    try {
      const result = await uploadLeadToInstantly(lead);
      if (result.status === 200 || result.status === 201) {
        console.log(`   ✅ Sincronizado en Instantly: ${lead.firstName} ${lead.lastName} (${lead.company}) -> ${lead.email}`);
        uploaded++;
      } else {
        console.warn(`   ⚠️ Status ${result.status} para ${lead.email}`);
      }
    } catch (e) {
      console.warn(`   ❌ Error con ${lead.email}:`, e.message);
    }
    await new Promise(r => setTimeout(r, 200));
  }

  console.log('\n================================================================================');
  console.log(`🎉 SINCRONIZACIÓN FINALIZADA: ${uploaded} de ${targetBatch.length} prospectos listos en Instantly.`);
  console.log('================================================================================\n');
}

if (process.argv[1] && process.argv[1].endsWith('configurar_campana_instantly.mjs')) {
  syncLeadsToInstantly(25).catch(console.error);
}
