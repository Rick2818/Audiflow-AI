import dotenv from 'dotenv';
import { InstantlyClient } from '../lib/instantly-client.js';

dotenv.config();

/**
 * ==============================================================================
 * AUDITFLOW AI — PUENTE DE CONTROL INSTANTLY.AI (WARMUP & CAMPAÑAS)
 * ==============================================================================
 */

async function main() {
  const apiKey = (process.env.INSTANTLY_API_KEY || '').trim();
  if (!apiKey) {
    console.log('ℹ️ Instantly Bridge en espera: Falta configurar INSTANTLY_API_KEY en .env');
    process.exit(0);
  }

  try {
    const client = new InstantlyClient(apiKey);
    console.log('🔄 Consultando estado de cuentas y Warmup en Instantly.ai...');
    const accounts = await client.getAccounts();
    console.log(`✅ Cuentas conectadas: ${Array.isArray(accounts) ? accounts.length : 'OK'}`);
  } catch (err) {
    console.error('Error al conectar con Instantly.ai:', err.message);
  }
}

main();
