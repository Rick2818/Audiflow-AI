import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

/**
 * ==============================================================================
 * AUDITFLOW AI — AUTO-CONFIGURADOR DE META ADS & INSTAGRAM
 * ==============================================================================
 * Este script consulta la Graph API con tu token de Meta y:
 * 1. Detecta automáticamente todas tus cuentas publicitarias (act_...)
 * 2. Detecta todas las páginas de Facebook y cuentas de Instagram vinculadas
 * 3. Selecciona y configura automáticamente los IDs en .env y mcp_config.json
 * ==============================================================================
 */

const token = process.argv[2] || process.env.META_ACCESS_TOKEN;

async function runAutoConfig() {
  console.log('\n============================================================');
  console.log('🚀 AUDITFLOW AI — AUTO-CONFIGURACIÓN DE META ADS & INSTAGRAM');
  console.log('============================================================\n');

  if (!token || token.startsWith('EAAG...tu_token')) {
    console.log('ℹ️ Se requiere un Meta Access Token para auto-detectar tus cuentas.');
    console.log('\n📌 OBTÉN TU TOKEN EN 2 PASOS RÁPIDOS:');
    console.log('1. Abre: https://developers.facebook.com/tools/explorer/');
    console.log('2. Selecciona los permisos:');
    console.log('   - ads_management');
    console.log('   - instagram_basic');
    console.log('   - instagram_content_publish');
    console.log('   - pages_show_list');
    console.log('   - pages_read_engagement');
    console.log('3. Haz clic en "Generate Access Token" y cópialo.\n');
    console.log('👉 Ejecuta este comando con tu token:');
    console.log('   node scripts/setup_meta_instagram_connection.js TU_TOKEN_AQUI\n');
    return;
  }

  try {
    console.log('⏳ Conectando con Meta Graph API...');

    // 1. Obtener perfil de usuario
    const meRes = await fetch(`https://graph.facebook.com/v19.0/me?fields=id,name,email&access_token=${token}`);
    const me = await meRes.json();
    if (me.error) throw new Error(me.error.message);
    console.log(`✅ Usuario autenticado: ${me.name} (ID: ${me.id})`);

    // 2. Obtener cuentas publicitarias
    console.log('⏳ Buscando cuentas publicitarias de Meta Ads...');
    const adRes = await fetch(`https://graph.facebook.com/v19.0/me/adaccounts?fields=id,name,account_id,currency&access_token=${token}`);
    const adAccounts = await adRes.json();

    let selectedAdAccount = null;
    if (adAccounts.data && adAccounts.data.length > 0) {
      console.log(`✅ ${adAccounts.data.length} cuenta(s) publicitaria(s) encontrada(s):`);
      adAccounts.data.forEach((acc, i) => {
        console.log(`   [${i + 1}] ${acc.name} (${acc.id}) - Moneda: ${acc.currency}`);
      });
      selectedAdAccount = adAccounts.data[0].id;
    } else {
      console.log('⚠️ No se encontraron cuentas publicitarias activas en este token.');
    }

    // 3. Obtener páginas y cuentas de Instagram vinculadas
    console.log('⏳ Buscando páginas y cuentas de Instagram vinculadas...');
    const pagesRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?fields=id,name,instagram_business_account{id,username,name}&access_token=${token}`);
    const pages = await pagesRes.json();

    let selectedIgAccount = null;
    let selectedIgUsername = '';

    if (pages.data && pages.data.length > 0) {
      console.log(`✅ ${pages.data.length} página(s) de Facebook encontrada(s):`);
      for (const page of pages.data) {
        console.log(`   📄 Página: ${page.name} (ID: ${page.id})`);
        if (page.instagram_business_account) {
          selectedIgAccount = page.instagram_business_account.id;
          selectedIgUsername = page.instagram_business_account.username || page.name;
          console.log(`      📸 Instagram Vinculado: @${selectedIgUsername} (ID: ${selectedIgAccount})`);
        }
      }
    }

    // 4. Actualizar archivo .env
    const envPath = path.resolve(process.cwd(), '.env');
    let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

    if (envContent.includes('META_ACCESS_TOKEN=')) {
      envContent = envContent.replace(/META_ACCESS_TOKEN=.*/, `META_ACCESS_TOKEN=${token}`);
    } else {
      envContent += `\nMETA_ACCESS_TOKEN=${token}`;
    }

    if (selectedAdAccount) {
      if (envContent.includes('META_AD_ACCOUNT_ID=')) {
        envContent = envContent.replace(/META_AD_ACCOUNT_ID=.*/, `META_AD_ACCOUNT_ID=${selectedAdAccount}`);
      } else {
        envContent += `\nMETA_AD_ACCOUNT_ID=${selectedAdAccount}`;
      }
    }

    if (selectedIgAccount) {
      if (envContent.includes('INSTAGRAM_ACCOUNT_ID=')) {
        envContent = envContent.replace(/INSTAGRAM_ACCOUNT_ID=.*/, `INSTAGRAM_ACCOUNT_ID=${selectedIgAccount}`);
      } else {
        envContent += `\nINSTAGRAM_ACCOUNT_ID=${selectedIgAccount}`;
      }
    }

    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log('✅ Archivo .env actualizado automáticamente con las credenciales.');

    // 5. Actualizar mcp_config.json
    const mcpConfigPath = 'C:\\Users\\Ricardo\\.gemini\\antigravity\\mcp_config.json';
    if (fs.existsSync(mcpConfigPath)) {
      const mcpJson = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
      if (mcpJson.mcpServers && mcpJson.mcpServers['meta-ads-instagram']) {
        mcpJson.mcpServers['meta-ads-instagram'].env = {
          META_ACCESS_TOKEN: token,
          META_AD_ACCOUNT_ID: selectedAdAccount || '',
          INSTAGRAM_ACCOUNT_ID: selectedIgAccount || ''
        };
        fs.writeFileSync(mcpConfigPath, JSON.stringify(mcpJson, null, 2), 'utf8');
        console.log('✅ Maestro mcp_config.json actualizado.');
      }
    }

    console.log('\n============================================================');
    console.log('🎉 ¡CONFIGURACIÓN DE META ADS & INSTAGRAM COMPLETADA CON ÉXITO!');
    console.log(`   • Cuenta Publicitaria: ${selectedAdAccount || 'Pendiente'}`);
    console.log(`   • Instagram Account:   ${selectedIgUsername ? `@${selectedIgUsername} (${selectedIgAccount})` : (selectedIgAccount || 'Pendiente')}`);
    console.log('============================================================\n');

  } catch (error) {
    console.error('\n❌ Error durante la auto-configuración:', error.message);
  }
}

runAutoConfig();
