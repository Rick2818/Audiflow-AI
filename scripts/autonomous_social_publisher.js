import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

/**
 * ==============================================================================
 * AUDITFLOW AI — AUTONOMOUS SOCIAL MEDIA PUBLISHER (CHROME ENGINE)
 * ==============================================================================
 */

const USER_DATA_DIR = path.resolve(process.env.LOCALAPPDATA || 'C:\\Users\\Ricardo\\AppData\\Local', 'AuditFlowChromeProfile');

export async function launchSocialPublisher() {
  console.log('\n============================================================');
  console.log('🤖 AUDITFLOW AI — PUBLICADOR AUTÓNOMO EN GOOGLE CHROME');
  console.log('============================================================');
  console.log('⏳ Abriendo Google Chrome con perfil dedicado y persistente...');

  try {
    const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
      channel: 'chrome',
      headless: false,
      viewport: { width: 1280, height: 850 },
      args: ['--start-maximized', '--disable-blink-features=AutomationControlled']
    });

    const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

    console.log('🌐 Abriendo Meta Business Suite y LinkedIn...');
    await page.goto('https://business.facebook.com/latest/composer', { waitUntil: 'domcontentloaded' });
    console.log('📄 Meta Composer cargado: ', page.url());

    console.log('\n✅ El navegador de automatización está abierto y listo.');
    console.log('ℹ️ Para cerrar este proceso cuando termines, presiona Ctrl+C en la consola.');

    // Mantenemos el proceso abierto para que el usuario pueda ver/usar la ventana o la sesión
    await new Promise(() => {});
  } catch (error) {
    console.error('❌ Error al iniciar Chrome:', error.message);
  }
}

launchSocialPublisher();
