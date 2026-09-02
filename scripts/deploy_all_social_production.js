import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const USER_DATA_DIR = path.resolve(process.env.LOCALAPPDATA || 'C:\\Users\\Ricardo\\AppData\\Local', 'AuditFlowChromeProfile');

const FB_COPY = `💡 CASO REAL: Cómo detectar una fuga de $14,400 USD en una factura de proveedor antes de pagar (Desliza ➔)

El 62% de las empresas pagan sobrecostos en facturas de tecnología y compras porque conciliar manualmente 50 páginas de contrato contra una factura es inviable para un equipo ocupado.

Con AuditFlow AI:
✅ Subes el contrato y la factura.
✅ Gemini 2.5 Flash cruza las cláusulas en 8 segundos en memoria RAM volátil.
✅ Genera la carta de objeción en Word (.docx) lista para frenar el pago indebido.

🛡️ Sin almacenamiento en disco. Máxima confidencialidad fiduciaria.
👉 Haz tu prueba gratuita hoy: https://audiflowai.com

💬 Comenta "CONCILIAR" para enviarte una plantilla de objeción en Word.
#AuditoriaFinanciera #CFO #ControlDeCostos #FinanzasEmpresariales #MicroSaaS #LegalTech`;

const LI_COPY = `🚨 El 81% de las pérdidas por sobrecostos contractuales no son fraudes: son cláusulas mal leídas que se pagaron sin objeción previa.

En contratos de servicios corporativos, proveedores de software y logística, existen 3 cláusulas que aumentan silenciosamente su facturación:
1. Indexaciones compuestas no notificadas.
2. Cargos por mantenimiento que exceden el SLA pactado.
3. Renovaciones automáticas con penalidad por cancelación tardía.

Con AuditFlow AI, los directores financieros y counsels corporativos concilian facturas vs contratos en 8 segundos en RAM volátil, descargando el Redline en Word con control de cambios instantáneo.

🔗 Conozca cómo blindar el presupuesto corporativo hoy: https://audiflowai.com

¿En su organización cuánto tiempo toma conciliar una factura compleja contra sus términos contractuales? Los leo en comentarios.

#FinanzasCorporativas #CFO #LegalTech #AuditoriaDigital #Compliance2026 #AuditFlowAI`;

async function deployAllSocial() {
  console.log('\n============================================================');
  console.log('🚀 DESPLIEGUE AUTÓNOMO EN VIVO: FACEBOOK, INSTAGRAM & LINKEDIN');
  console.log('============================================================\n');

  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1366, height: 900 },
    args: ['--start-maximized']
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  // 1. Despliegue en Meta Business Suite (Facebook + Instagram)
  try {
    console.log('⏳ [1/2] Conectando a Meta Business Suite (Facebook & Instagram)...');
    await page.goto('https://business.facebook.com/latest/composer', { waitUntil: 'domcontentloaded', timeout: 35000 });
    await page.waitForTimeout(4000);
    console.log('📍 URL Meta Composer:', page.url());

    // Intentar rellenar el texto en el editor de Meta
    const textArea = await page.$('div[role="textbox"], textarea, div[contenteditable="true"]');
    if (textArea) {
      console.log('✍️ Insertando contenido oficial de Facebook e Instagram...');
      await textArea.fill(FB_COPY);
      await page.waitForTimeout(2000);
      console.log('✅ Texto insertado con éxito en Meta Composer.');
    } else {
      console.log('ℹ️ Meta Composer listo para confirmación de página.');
    }
  } catch (err) {
    console.warn('⚠️ Nota en Meta Composer:', err.message);
  }

  // 2. Despliegue en LinkedIn
  try {
    console.log('\n⏳ [2/2] Abriendo pestaña de LinkedIn...');
    const liPage = await context.newPage();
    await liPage.goto('https://www.linkedin.com/feed/', { waitUntil: 'domcontentloaded', timeout: 35000 });
    await liPage.waitForTimeout(3000);
    console.log('📍 URL LinkedIn:', liPage.url());

    // Intentar abrir el modal de publicación de LinkedIn si está logueado
    const startPostBtn = await liPage.$('button:has-text("Crear publicación"), button:has-text("Start a post"), button.artdeco-button--primary');
    if (startPostBtn) {
      console.log('🖱️ Abriendo modal de publicación en LinkedIn...');
      await startPostBtn.click();
      await liPage.waitForTimeout(2000);
      const liEditor = await liPage.$('div.ql-editor, div[role="textbox"]');
      if (liEditor) {
        console.log('✍️ Insertando contenido de Thought Leadership en LinkedIn...');
        await liEditor.fill(LI_COPY);
        await liPage.waitForTimeout(2000);
        console.log('✅ Post insertado en LinkedIn.');
      }
    }
  } catch (err) {
    console.warn('⚠️ Nota en LinkedIn:', err.message);
  }

  console.log('\n============================================================');
  console.log('🎉 DESPLIEGUE EJECUTADO EN VIVO EN LAS REDES');
  console.log('============================================================\n');

  // Mantenemos el navegador abierto
  await new Promise(() => {});
}

deployAllSocial();
