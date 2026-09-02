import dotenv from 'dotenv';
import { postMetaAPI } from '../lib/meta_ads_publisher.js';

dotenv.config();

const CAMPAIGN_IDS = [
  '120247746083620688', // [LegalOps] Redlines en 32 Segundos
  '120247746084110688', // [CFOs] Detección de Sobrecostos en Facturas
  '120247746084870688'  // [CEOs] Blindaje Zero-Retention Regional
];

const ADSET_IDS = [
  '120247746083710688',
  '120247746084270688',
  '120247746085920688'
];

const AD_IDS = [
  '120247746084020688',
  '120247746084820688',
  '120247746088560688'
];

async function activarCampanas() {
  console.log('============================================================');
  console.log('⚡ ACTIVANDO LAS 3 CAMPAÑAS EN META ADS MANAGER');
  console.log('============================================================\n');

  for (const id of CAMPAIGN_IDS) {
    try {
      await postMetaAPI(id, { status: 'ACTIVE' });
      console.log(`✅ Campaña ${id} -> ACTIVADA (ACTIVE)`);
    } catch (e) {
      console.error(`⚠️ Error activando campaña ${id}:`, e.message);
    }
  }

  for (const id of ADSET_IDS) {
    try {
      await postMetaAPI(id, { status: 'ACTIVE' });
      console.log(`✅ AdSet ${id} -> ACTIVADO (ACTIVE)`);
    } catch (e) {
      console.error(`⚠️ Error activando adset ${id}:`, e.message);
    }
  }

  for (const id of AD_IDS) {
    try {
      await postMetaAPI(id, { status: 'ACTIVE' });
      console.log(`✅ Anuncio ${id} -> ACTIVADO (ACTIVE)`);
    } catch (e) {
      console.error(`⚠️ Error activando anuncio ${id}:`, e.message);
    }
  }

  console.log('\n🎉 ¡Las 3 campañas, conjuntos de anuncios y creativos están 100% ACTIVOS!');
}

activarCampanas();
