import { createClient } from '@supabase/supabase-js';
import { CONFIG } from '../lib/config.js';

const supabaseUrl = (process.env.SUPABASE_URL || CONFIG.SUPABASE?.URL || '').trim();
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || CONFIG.SUPABASE?.KEY || '').trim();
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// Lista de correos corporativos autorizados por defecto / whitelist fiduciaria
const VIP_WHITELIST = new Set([
  'ricardo@audiflowai.com',
  'tendenciaiatufuturo@gmail.com',
  'admin@audiflowai.com',
  'test_corp_lead_1@lexcapital.com',
  'test_corp_lead_2@corporacionandina.com',
  'test_corp_lead_3@bancofiduciario.com',
  'test_corp_lead_4@auditpartners.org',
  'test_corp_lead_5@complianceglobal.net'
]);

export default async function verifyClientHandler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }

    const rawEmail = (body.email || '').trim().toLowerCase();

    if (!rawEmail || !rawEmail.includes('@')) {
      return res.status(400).json({ 
        success: false, 
        is_client: false, 
        message: 'Por favor introduce un correo electrónico válido.' 
      });
    }

    // 1. Verificación en Whitelist fiduciaria
    if (VIP_WHITELIST.has(rawEmail)) {
      return res.status(200).json({
        success: true,
        is_client: true,
        cliente: 'SI',
        status: 'active',
        plan: 'annual',
        email: rawEmail,
        message: 'Verifique su correo — ✅ Correo identificado como CLIENTE en la Base de Datos. Dando paso a la plataforma...'
      });
    }

    // 2. Consulta en Supabase
    if (supabase) {
      try {
        // Verificar en tabla subscriptions
        const { data: subData, error: subErr } = await supabase
          .from('subscriptions')
          .select('id, plan_name, status, customer_email, cliente')
          .ilike('customer_email', rawEmail)
          .eq('status', 'active')
          .limit(1);

        if (!subErr && subData && subData.length > 0) {
          const sub = subData[0];
          return res.status(200).json({
            success: true,
            is_client: true,
            cliente: 'SI',
            status: 'active',
            plan: sub.plan_name || 'Enterprise',
            email: rawEmail,
            message: 'Verifique su correo — ✅ Correo identificado como CLIENTE en la Base de Datos. Dando paso a la plataforma...'
          });
        }

        // Verificar en tabla audit_leads
        const { data: leadData, error: leadErr } = await supabase
          .from('audit_leads')
          .select('id, is_enterprise, cliente')
          .ilike('email', rawEmail)
          .or('is_enterprise.eq.true,cliente.eq.SI')
          .limit(1);

        if (!leadErr && leadData && leadData.length > 0) {
          return res.status(200).json({
            success: true,
            is_client: true,
            cliente: 'SI',
            status: 'active',
            plan: 'Enterprise',
            email: rawEmail,
            message: 'Verifique su correo — ✅ Correo identificado como CLIENTE en la Base de Datos. Dando paso a la plataforma...'
          });
        }
      } catch (dbErr) {
        console.warn('Advertencia consultando Supabase en verify-client:', dbErr.message);
      }
    }

    // Si no se encuentra como cliente en la base de datos
    return res.status(200).json({
      success: false,
      is_client: false,
      cliente: 'NO',
      status: 'unregistered',
      email: rawEmail,
      message: 'El correo ingresado no se encuentra identificado como CLIENTE en la Base de Datos. Por favor verifique su correo o active su membresía corporativa.'
    });

  } catch (error) {
    console.error('Error en verifyClientHandler:', error);
    return res.status(500).json({ 
      success: false, 
      is_client: false, 
      cliente: 'ERROR',
      message: 'Error interno verificando cliente: ' + error.message 
    });
  }
}
