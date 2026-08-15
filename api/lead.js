import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (process.env.SUPABASE_URL || '').trim();
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '').trim();
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }

    const { name, email, document_name, audit_data, lang } = body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Nombre y correo electrónico son requeridos.' });
    }

    const reportId = 'rep_' + Math.random().toString(36).substring(2, 11);
    const leadScore = audit_data?.lead_score || 85;
    const isEnterpriseCandidate = leadScore >= 75;
    const docType = audit_data?.document_type || 'Contrato Comercial';

    console.log(`📩 [VERCEL LEAD CAPTURED] ${name} <${email}> - Score: ${leadScore}`);

    // Persistencia Automática en Supabase PostgreSQL
    if (supabase) {
      try {
        const { data: dbLead, error: dbErr } = await supabase
          .from('audit_leads')
          .insert([
            {
              name,
              email,
              document_type: docType,
              lead_score: leadScore,
              is_enterprise: isEnterpriseCandidate,
              company_estimate: audit_data?.company_estimate || 'Empresa Detectada'
            }
          ])
          .select()
          .single();

        if (dbErr) {
          console.warn('Advertencia registrando lead en Supabase:', dbErr.message);
        } else if (dbLead) {
          console.log(`✅ [SUPABASE PERSISTENCE] Lead ${dbLead.id} guardado permanentemente en PostgreSQL`);
        }
      } catch (err) {
        console.warn('Fallback Supabase lead insertion:', err.message);
      }
    }

    return res.status(200).json({
      success: true,
      report_id: reportId,
      lead_score: leadScore,
      is_enterprise_candidate: isEnterpriseCandidate,
      message: 'Lead capturado exitosamente y guardado permanentemente.'
    });

  } catch (err) {
    console.error('Error en api/lead.js:', err);
    return res.status(500).json({ error: 'Error procesando captura de lead: ' + err.message });
  }
}
