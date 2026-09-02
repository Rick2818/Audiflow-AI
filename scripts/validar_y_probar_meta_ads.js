import dotenv from 'dotenv';
import { enviarEventoCAPI } from '../lib/metaCapiService.js';
import { publicarAnuncioMeta } from '../lib/meta_ads_publisher.js';

dotenv.config();

/**
 * ==============================================================================
 * AUDITFLOW AI — VALIDACIÓN FORENSE DE CREDENCIALES Y PRUEBA DE META ADS
 * ==============================================================================
 * 1. Valida el Access Token, Permisos y Usuario en Meta Graph API.
 * 2. Verifica la Cuenta Publicitaria (act_...) y el estado de facturación.
 * 3. Verifica la Página de Facebook y la cuenta de Instagram vinculada.
 * 4. Valida el Pixel y envía un evento CAPI de prueba.
 * 5. Ejecuta una prueba de creación de campaña en modo "PAUSED" (Seguro / Cero Gasto).
 * ==============================================================================
 */

const API_VERSION = 'v20.0';
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;

async function getMeta(endpoint, token) {
  const url = `${BASE_URL}/${endpoint}${endpoint.includes('?') ? '&' : '?'}access_token=${encodeURIComponent(token)}`;
  const res = await fetch(url);
  return await res.json();
}

async function ejecutarValidacionYPrueba() {
  console.log('\n============================================================');
  console.log('🔍 AUDITFLOW AI — DIAGNÓSTICO FORENSE DE CREDENCIALES META');
  console.log('============================================================\n');

  const token = process.env.META_ACCESS_TOKEN;
  const adAccountId = process.env.META_AD_ACCOUNT_ID;
  const pageId = process.env.META_PAGE_ID;
  const pixelId = process.env.META_PIXEL_ID;
  const testEventCode = process.env.META_TEST_EVENT_CODE;

  console.log('📋 Variables detectadas en .env:');
  console.log(`• META_ACCESS_TOKEN:  ${token ? token.substring(0, 15) + '...' + token.substring(token.length - 10) : '❌ NO DEFINIDO'}`);
  console.log(`• META_AD_ACCOUNT_ID: ${adAccountId || '❌ NO DEFINIDO'}`);
  console.log(`• META_PAGE_ID:       ${pageId || '❌ NO DEFINIDO'}`);
  console.log(`• META_PIXEL_ID:      ${pixelId || '❌ NO DEFINIDO'}`);
  console.log(`• TEST_EVENT_CODE:    ${testEventCode || 'No especificado'}\n`);

  if (!token || token.startsWith('tu_token') || token.startsWith('EAAG...tu_token')) {
    console.error('❌ ERROR: META_ACCESS_TOKEN contiene un valor de marcador de posición.');
    console.log('👉 Por favor coloca tu token permanente o generado en .env para continuar.');
    return;
  }

  // --- PASO 1: Validar Usuario y Token ---
  console.log('⏳ [1/5] Autenticando con Meta Graph API (/me)...');
  try {
    const me = await getMeta('me?fields=id,name,email', token);
    if (me.error) {
      console.error('❌ Token Inválido o Expirado:', me.error.message);
      return;
    }
    console.log(`✅ Usuario autenticado: ${me.name} (ID: ${me.id})`);
  } catch (err) {
    console.error('❌ Error de conexión:', err.message);
    return;
  }

  // --- PASO 2: Validar Cuenta Publicitaria ---
  console.log('\n⏳ [2/5] Verificando Cuenta Publicitaria...');
  const formattedAdAcc = adAccountId?.startsWith('act_') ? adAccountId : `act_${adAccountId}`;
  try {
    const adAcc = await getMeta(`${formattedAdAcc}?fields=id,name,account_status,currency,timezone_name,amount_spent,balance,capabilities`, token);
    if (adAcc.error) {
      console.warn(`⚠️ Advertencia en Cuenta Publicitaria (${formattedAdAcc}):`, adAcc.error.message);
      
      // Intentar auto-detectar cuentas asociadas al usuario
      console.log('⏳ Buscando cuentas publicitarias asociadas al token...');
      const userAccounts = await getMeta('me/adaccounts?fields=id,name,account_status,currency', token);
      if (userAccounts.data && userAccounts.data.length > 0) {
        console.log(`ℹ️ Cuentas publicitarias disponibles para este token:`);
        userAccounts.data.forEach((acc, i) => {
          console.log(`   [${i + 1}] ${acc.name} (${acc.id}) - Moneda: ${acc.currency} - Estado: ${acc.account_status === 1 ? 'ACTIVA' : 'INACTIVA'}`);
        });
      }
    } else {
      const statusMap = { 1: 'ACTIVA Y LISTA', 2: 'DESACTIVADA', 3: 'NO LIQUIDADA', 7: 'PENDIENTE DE REVISIÓN' };
      console.log(`✅ Cuenta Publicitaria Encontrada: ${adAcc.name} (${adAcc.id})`);
      console.log(`   • Estado:    ${statusMap[adAcc.account_status] || adAcc.account_status}`);
      console.log(`   • Moneda:    ${adAcc.currency}`);
      console.log(`   • Zona Horaria: ${adAcc.timezone_name}`);
      console.log(`   • Total Invertido Histórico: $${(Number(adAcc.amount_spent || 0) / 100).toFixed(2)} USD`);
    }
  } catch (err) {
    console.warn('⚠️ Error al consultar ad account:', err.message);
  }

  // --- PASO 3: Validar Página de Facebook e Instagram ---
  console.log('\n⏳ [3/5] Verificando Página de Facebook e Instagram vinculada...');
  try {
    const page = await getMeta(`${pageId}?fields=id,name,is_published,instagram_business_account{id,username,name}`, token);
    if (page.error) {
      console.warn(`⚠️ Error al consultar Página (${pageId}):`, page.error.message);
    } else {
      console.log(`✅ Página Facebook: ${page.name} (ID: ${page.id})`);
      console.log(`   • Publicada: ${page.is_published ? 'SÍ' : 'NO'}`);
      if (page.instagram_business_account) {
        console.log(`   • Instagram Vinculado: @${page.instagram_business_account.username} (ID: ${page.instagram_business_account.id})`);
      } else {
        console.log('   • Instagram: Sin cuenta de Instagram Business vinculada directamente a la página.');
      }
    }
  } catch (err) {
    console.warn('⚠️ Error al consultar página:', err.message);
  }

  // --- PASO 4: Prueba de Conversions API (CAPI) ---
  console.log('\n⏳ [4/5] Probando Meta Conversions API (CAPI)...');
  try {
    if (pixelId && !pixelId.startsWith('12345')) {
      const capiRes = await enviarEventoCAPI({
        nombreEvento: 'Lead',
        email: 'auditoria.prueba@audiflowai.com',
        telefono: '+50370000000',
        ipUsuario: '127.0.0.1',
        userAgent: 'Mozilla/5.0 ForensicValidation AuditFlowAI/1.0',
        urlOrigen: 'https://audiflowai.com/prueba-pro',
        valorUSD: 69.00
      });
      console.log(`✅ CAPI Respondió con éxito: ${capiRes.events_received || 1} evento(s) recibido(s) por Meta.`);
    } else {
      console.log('ℹ️ META_PIXEL_ID no tiene un ID real asignado aún. Omitiendo disparo a CAPI.');
    }
  } catch (err) {
    console.warn('⚠️ Prueba CAPI:', err.message);
  }

  // --- PASO 5: Prueba de Creación de Campaña en Meta Ads ---
  console.log('\n⏳ [5/5] Ejecutando prueba de creación de Campaña en cascada (Modo Seguro: PAUSED)...');
  try {
    const resCampana = await publicarAnuncioMeta({
      nombreCampana: `[Test] AuditFlow AI - Pro $69 (${new Date().toISOString().slice(0, 10)})`,
      presupuestoDiarioUSD: 5.00,
      urlLanding: 'https://audiflowai.com',
      urlImagen: 'https://audiflowai.com/banner_facebook_audiflowai.png',
      textoPrincipal: 'Prueba piloto automatizada: Auditoría Fiduciaria y Detección de Sobrecostos con AuditFlow AI.',
      tituloAnuncio: 'Detección de Sobrecostos B2B en 30 Segundos',
      descripcionAnuncio: 'Prueba Plan Pro $69/mes sin permanencia.',
      paisCodigo: 'SV',
      estadoCampana: 'PAUSED', // Seguridad total: queda en pausa
      estadoAdSet: 'PAUSED',
      estadoAnuncio: 'PAUSED'
    });

    if (resCampana.success) {
      console.log('\n🎉 ¡PRUEBA DE LANZAMIENTO EXITOSA!');
      console.log(`============================================================`);
      console.log(`🆔 Campaña ID:   ${resCampana.campaignId}`);
      console.log(`🆔 AdSet ID:     ${resCampana.adSetId}`);
      console.log(`🆔 Creativo ID:  ${resCampana.creativeId}`);
      console.log(`🆔 Anuncio ID:   ${resCampana.adId}`);
      console.log(`============================================================`);
      console.log('💡 La campaña se creó en estado PAUSED (Pausada) para que puedas inspeccionarla en tu Meta Ads Manager sin generar costos:');
      console.log('👉 https://adsmanager.facebook.com');
    } else {
      console.error('\n⚠️ La API de Meta rechazó la creación:', resCampana.error);
    }
  } catch (err) {
    console.error('❌ Error fatal en prueba de lanzamiento:', err.message);
  }
}

ejecutarValidacionYPrueba();
