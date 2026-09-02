import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const API_VERSION = 'v20.0';
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;

const POSTS = [
  {
    tema: 'LegalOps & Redlines Fiduciarios en 32 Segundos',
    mensaje: `⚖️ ¿Tu equipo legal sigue dedicando 4 horas a revisar manualmente contratos de 50+ páginas?

En el derecho corporativo moderno, el tiempo no es solo dinero: es blindaje fiduciario.

Una cláusula de limitación de responsabilidad ambigua, una penalidad por rescisión desproporcionada o una discrepancia en la jurisdicción aplicable pueden costarle cientos de miles de dólares a tu empresa.

Con AuditFlow AI, los General Counsels y despachos legales líderes en México, Colombia, Perú y Centroamérica auditan contratos complejos en menos de 30 segundos:
🔹 Detección automática de discrepancias y cláusulas de alto riesgo.
🔹 Generación instantánea de Redlines fiduciarios en formato Word (.docx) y PDF.
🔹 Arquitectura de Memoria Volátil (Zero-Retention): Tu secreto profesional blindado al 100%.

🚀 Plan Pro disponible por solo $69/mes (o Licencia Corporativa anual).
👉 Haz una auditoría de prueba en: https://audiflowai.com

#LegalTech #DerechoCorporativo #GeneralCounsel #Compliance #AbogadosLatam #DirectoresLegales #AuditFlowAI #LegalOps`
  },
  {
    tema: 'CFOs & Detección de Sobrecostos del 18% en Facturas Legales',
    mensaje: `📊 El 18% de las facturas de proveedores externos y firmas legales contienen sobrecostos ocultos o conceptos no autorizados.

Como CFO o Director Financiero, autorizar pagos sin una auditoría línea por línea es una fuga constante de EBITDA.

¿El problema? Tu equipo de finanzas no tiene tiempo de cotejar cada anexo contractual contra cada factura emitida.

AuditFlow AI resuelve esto de forma instantánea:
✅ Cruce forense entre términos contractuales acordados y facturas recibidas.
✅ Detección de tarifas infladas, horas duplicadas y conceptos fuera de alcance.
✅ Reporte ejecutivo con justificación numérica para solicitar notas de crédito inmediatas.

💡 Una sola discrepancia detectada paga meses o años de tu suscripción de AuditFlow AI ($69/mes).

Comienza hoy a auditar tus contratos y facturas en https://audiflowai.com

#CFO #FinanzasCorporativas #ControlPresupuestario #EBITDA #DirectoresFinancieros #AuditoriaFinanciera #LatAmBusiness`
  },
  {
    tema: 'Blindaje Zero-Retention para CEOs & Expansión Regional (Brasil y LatAm)',
    mensaje: `🇧🇷 🇪🇸 Auditoría Fiduciaria de Contratos con Seguridad Bancaria para América Latina y Brasil.

Para CEOs y Directores Generales que lideran operaciones transfronterizas: la complejidad regulatoria y la seguridad de la información son innegociables.

AuditFlow AI combina inteligencia forense de IA con seguridad corporativa de nivel bancario:
🔒 Zero Retención de Datos: Tus contratos confidenciales jamás se almacenan ni entrenan modelos públicos.
⚡ Redlines y reportes fiduciarios generados en menos de 30 segundos.
🌐 Compatibilidad con marcos normativos en Centroamérica, Colombia, México, Perú, Argentina y Brasil.

Experimenta el Plan Pro ($69 USD/mes) o solicita una licencia corporativa multiusuario:
👉 https://audiflowai.com

#CEO #LatAm #DireitoEmpresarial #CFOsBrasil #GovTech #InovacaoCorporativa #InteligenciaArtificial #AuditFlowAI`
  }
];

async function publicarEnMuro() {
  console.log('============================================================');
  console.log('📢 AUDITFLOW AI — PUBLICACIÓN ORGÁNICA EN EL MURO DE FACEBOOK');
  console.log('============================================================\n');

  const userToken = process.env.META_ACCESS_TOKEN;
  const pageId = process.env.META_PAGE_ID || '1285349454663691';

  // 1. Obtener el Page Access Token dinámico
  console.log('⏳ Obteniendo Page Access Token para Audiflowai.com...');
  const accRes = await fetch(`${BASE_URL}/me/accounts?access_token=${encodeURIComponent(userToken)}`);
  const accData = await accRes.json();

  const page = accData.data?.find(p => p.id === pageId || p.name.toLowerCase().includes('audi'));
  if (!page || !page.access_token) {
    throw new Error(`No se encontró el Page Access Token para la página ID: ${pageId}`);
  }

  const pageToken = page.access_token;
  console.log(`✅ Conectado a la Página: ${page.name} (ID: ${page.id})\n`);

  // 2. Publicar cada post en el muro
  for (let i = 0; i < POSTS.length; i++) {
    const post = POSTS[i];
    console.log(`⏳ [${i + 1}/3] Publicando en el muro: "${post.tema}"...`);

    const publishUrl = `${BASE_URL}/${pageId}/feed`;
    const res = await fetch(publishUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: post.mensaje,
        link: 'https://audiflowai.com',
        access_token: pageToken
      })
    });

    const resData = await res.json();
    if (resData.id) {
      console.log(`✅ [${i + 1}/3] Post publicado exitosamente en Facebook: ID ${resData.id}`);
      console.log(`   👉 Ver post: https://facebook.com/${resData.id}`);
    } else {
      console.error(`⚠️ Error al publicar post [${i + 1}/3]:`, resData.error?.message || JSON.stringify(resData));
    }
  }

  console.log('\n============================================================');
  console.log('🎉 ¡LOS 3 POSTS HAN SIDO PUBLICADOS EN EL MURO DE TU PÁGINA!');
  console.log('============================================================');
  console.log('👉 Visita tu página de Facebook: https://facebook.com/1285349454663691');
}

publicarEnMuro().catch(err => console.error('❌ Error fatal:', err.message));
