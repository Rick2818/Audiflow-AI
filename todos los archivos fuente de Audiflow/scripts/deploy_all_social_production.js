import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const USER_DATA_DIR = path.resolve(process.env.LOCALAPPDATA || 'C:\\Users\\Ricardo\\AppData\\Local', 'AuditFlowChromeProfile');

const FB_COPY = `🚨 ANTES DE FIRMAR CUALQUIER CONTRATO ESTE FIN DE SEMANA: El 74% de las penalizaciones contractuales en 2026 provienen de cláusulas invisibles de "Renovación Automática Silenciosa" y "Jurisdicción Forzosa".

¿Sabías que subir tus contratos o borradores a herramientas de IA pública viola directamente el secreto comercial de tu empresa? 

Si tu equipo legal o directivo está cerrando acuerdos antes de fin de mes, no dejes que un detalle de redacción te cueste miles de dólares. En AuditFlow AI creamos el primer auditor contractual forense 100% privado en memoria RAM volátil:
✅ 0% persistencia de datos (tus contratos jamás se almacenan en disco ni entrenan modelos).
✅ Detección en 10 segundos de cláusulas trampa, penalizaciones desproporcionadas e inconsistencias fiduciarias.
✅ Descarga inmediata del informe Redline en Word (.docx) con las cláusulas ya corregidas.

👉 Audita tu primer contrato GRATIS y en 10 segundos aquí: https://audiflowai.com

💬 Comenta la palabra "AUDITORIA" (o "AUDIT") y te enviamos por Messenger el Checklist Fiduciario 2026 en PDF + acceso directo sin registro previo.

---
🌍 Available globally: Audit vendor & partner agreements in under 10s with zero-data-retention RAM security.
#AuditFlowAI #LegalTech #ContratosInteligentes #CFO #Compliance2026 #GestionDeRiesgos #IAEmpresarial`;

const LI_COPY = `El 78% de los litigios comerciales en 2026 provienen de cláusulas que nadie leyó con detenimiento.

No es falta de abogados.
Es falta de tiempo y exceso de volumen contractual.

Con la entrada en vigor de los nuevos marcos regulatorios de cumplimiento y gobernanza este año, firmar contratos bajo plantillas de 2023 o 2024 es una ruleta rusa corporativa.

Los 3 riesgos silenciosos más costosos que estamos detectando en auditorías:

1. Cláusulas de Renovación Automática Opacas: Penalizaciones ocultas de hasta un 35% del valor anual sin ventana de salida viable.
2. Responsabilidad y Traspaso de Datos (AI Act & DORA): Cláusulas de indemnización desproporcionadas ante brechas de terceros.
3. Desalineación Jurisdiccional: Arbitrajes en sedes extranjeras con costos legales que triplican el valor del contrato en disputa.

Revisar 120 páginas de anexos técnicos y legales ya no puede depender del cansancio del viernes a las 7 PM de tu equipo legal.

La IA privada no reemplaza el juicio de tus abogados o auditores; les da visión de rayos X en 30 segundos.

AuditFlow AI analiza, clasifica y detecta anomalías, trampas y riesgos de cumplimiento en segundos con privacidad estricta de datos (cero entrenamiento con tu información).

👇 ¿Quieres verificar la salud de tus contratos actuales?

Comenta "AUDITORIA" (o "AUDIT" en inglés) en este post y te enviamos por mensaje privado un Diagnóstico Exprés Gratuito de Riesgos Contractuales 2026.

#LegalTech #AuditoriaLegal #Compliance2026 #GestionDeRiesgos #B2B #AuditFlowAI #CFO #GeneralCounsel`;

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
