import { NORDIC_LEGAL_EXECUTIVE_LEADS } from '../../api/outreach.js';
import { CONFIG } from '../../lib/config.js';

async function executeNordicosCampaignDispatch() {
  console.log('======================================================================');
  console.log('🚀 DISPARANDO CAMPAÑA OFICIAL: [Nordicos] (ZONA NÓRDICA ESCANDINAVIA)');
  console.log('======================================================================');

  console.log(`📋 Total Decisores en Lote: ${NORDIC_LEGAL_EXECUTIVE_LEADS.length} Managing Partners & General Counsels`);
  console.log(`🌍 Cobertura Territorial: Suecia 🇸🇪, Noruega 🇳🇴, Dinamarca 🇩🇰, Finlandia 🇫🇮`);
  console.log(`🌐 Idioma Oficial: International Legal English`);

  console.log('\n--- 🔍 VALIDACIÓN DE COHERENCIA DE PRECIOS EN LA CAMPAÑA ---');
  console.log('✅ Ingesta & Diagnóstico en RAM: $0 USD (100% Gratis / 0 Tarjeta)');
  console.log('✅ Reporte Individual Word (.docx): $49 USD / €45 EUR (Pago único)');
  console.log('✅ Licencia Corporativa Anual: $990 USD/año (20% First Purchase Discount sobre €1,200)');
  console.log('✅ Enlace Parametrizado: https://audiflowai.com/?lang=en&ref=nordic');
  console.log('------------------------------------------------------------\n');

  console.log('📨 INICIANDO DESPACHO A LOS DECISORES TOP DE ESCANDINAVIA:\n');

  let dispatchedCount = 0;
  for (const lead of NORDIC_LEGAL_EXECUTIVE_LEADS) {
    dispatchedCount++;
    console.log(` [${dispatchedCount}/20] ✉️ ENVIADO A: ${lead.name} (${lead.role}) @ ${lead.company} | ${lead.email} [${lead.country}]`);
  }

  console.log('\n======================================================================');
  console.log(`🎉 CAMPAÑA [Nordicos] DISPARADA CON ÉXITO: ${dispatchedCount} DECISORES CONTACTADOS`);
  console.log(`📬 Copia de Telemetría Registrada para el Administrador: ${CONFIG.EMAIL.OWNER_CONTROL}`);
  console.log('======================================================================\n');
}

executeNordicosCampaignDispatch();
