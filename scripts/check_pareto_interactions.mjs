import fs from 'fs';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import { CONFIG } from '../lib/config.js';

dotenv.config();

const RESEND_API_KEY = (process.env.RESEND_API_KEY || CONFIG.EMAIL.RESEND_API_KEY || '').trim();
const resend = new Resend(RESEND_API_KEY);

const telemetryFile = 'logs/nuevo_pareto_dispatch_telemetry.json';
if (!fs.existsSync(telemetryFile)) {
  console.log('No telemetry file found.');
  process.exit(1);
}

const telemetry = JSON.parse(fs.readFileSync(telemetryFile, 'utf8'));
const leads = telemetry.results || [];

async function checkInteractions() {
  console.log(`🔍 [${new Date().toISOString()}] Auditando interacciones para ${leads.length} despachos...`);
  
  const interactions = [];
  const checks = leads.map(async lead => {
    if (!lead.resendId) return null;
    try {
      const res = await resend.emails.get(lead.resendId);
      const lastEvent = res.data?.last_event || 'unknown';
      return {
        name: lead.name,
        firm: lead.firm,
        email: lead.email,
        resendId: lead.resendId,
        lastEvent,
        hasInteracted: lastEvent === 'opened' || lastEvent === 'clicked'
      };
    } catch (e) {
      return { name: lead.name, firm: lead.firm, error: e.message };
    }
  });

  const results = await Promise.all(checks);
  
  const opened = results.filter(r => r && r.lastEvent === 'opened');
  const clicked = results.filter(r => r && r.lastEvent === 'clicked');
  const delivered = results.filter(r => r && r.lastEvent === 'delivered');
  const other = results.filter(r => r && !['opened', 'clicked', 'delivered'].includes(r.lastEvent));

  console.log(`📊 Balance: ${delivered.length} Entregados | ${opened.length} Abiertos | ${clicked.length} Clics | ${other.length} Otros`);
  
  if (opened.length > 0 || clicked.length > 0) {
    console.log('🚨 ¡INTERACCIONES DETECTADAS!');
    opened.forEach(o => console.log(`   👁️ APERTURA: ${o.name} (${o.firm})`));
    clicked.forEach(c => console.log(`   🎯 CLIC ENLACE: ${c.name} (${c.firm})`));
  }

  // Guardar estado de monitoreo
  fs.writeFileSync('logs/pareto_interactions_snapshot.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    total: results.length,
    deliveredCount: delivered.length,
    openedCount: opened.length,
    clickedCount: clicked.length,
    opened,
    clicked
  }, null, 2), 'utf8');

  return { opened, clicked, delivered };
}

checkInteractions().catch(console.error);
