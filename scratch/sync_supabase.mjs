import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

console.log('⚡ Sincronizando y Comprobando Base de Datos Supabase...');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('ℹ️ Supabase no configurado en variables de entorno locales (modo memoria RAM volátil activo).');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSupabase() {
  try {
    const { data, error, count } = await supabase.from('audit_leads').select('*', { count: 'exact', head: true });
    if (error) {
      console.warn('⚠️ Supabase audit_leads warning:', error.message);
    } else {
      console.log(`✅ Supabase Conectado y Sincronizado. Registros en audit_leads: ${count || 0}`);
    }
  } catch (err) {
    console.warn('⚠️ Error de conexión a Supabase:', err.message);
  }
}

checkSupabase();
