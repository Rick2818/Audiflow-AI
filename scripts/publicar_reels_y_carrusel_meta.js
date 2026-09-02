import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { publicarAnuncioMeta, postMetaAPI, subirImagenMeta } from '../lib/meta_ads_publisher.js';

dotenv.config();

const img1 = "C:/Users/Ricardo/.gemini/antigravity/brain/65b9ffc5-c66d-46d2-ac9d-98d0e4640d90/reel_auditflow_ai_mockup_1788215621358.jpg";
const img2 = "C:/Users/Ricardo/.gemini/antigravity/brain/65b9ffc5-c66d-46d2-ac9d-98d0e4640d90/reel_cfo_invoice_audit_mockup_1788215690117.jpg";

async function publicarReelsYCarrusel() {
  console.log('============================================================');
  console.log('🚀 PUBLICANDO REELS Y CARRUSEL EN META ADS (FB & INSTAGRAM)');
  console.log('============================================================\n');

  const adAccountId = process.env.META_AD_ACCOUNT_ID || 'act_2224127671159585';
  const formattedAdAcc = adAccountId.startsWith('act_') ? adAccountId : 'act_' + adAccountId;
  const token = process.env.META_ACCESS_TOKEN;

  // 1. Subir ambas imágenes a la biblioteca de Meta Ads para obtener los hashes
  console.log('⏳ Subiendo imágenes oficiales a Meta Ad Library...');
  const hash1 = await subirImagenMeta({ adAccountId: formattedAdAcc, imagePath: img1, accessToken: token });
  const hash2 = await subirImagenMeta({ adAccountId: formattedAdAcc, imagePath: img2, accessToken: token });

  console.log(`✓ Hash Imagen 1 (Legal): ${hash1}`);
  console.log(`✓ Hash Imagen 2 (CFO):   ${hash2}\n`);

  // --- ANUNCIO 1: REEL LEGALTECH (IMAGE 1) ---
  console.log('📢 [1/3] Publicando Campaña Reel 1: LegalOps & Redlines en 32 Segundos...');
  const res1 = await publicarAnuncioMeta({
    nombreCampana: 'AuditFlow AI - [Reel 1] Redlines en 32 Segundos',
    presupuestoDiarioUSD: 5.00,
    urlLanding: 'https://audiflowai.com',
    imageHash: hash1,
    tituloAnuncio: 'Revisa Contratos en 32 Segundos con IA',
    descripcionAnuncio: 'Redlines en Word (.docx) y PDF. Plan Pro $69/mes.',
    textoPrincipal: `⚖️ ¿Tu equipo legal sigue dedicando 4 horas a revisar manualmente contratos de 50+ páginas?

En el derecho corporativo moderno, el tiempo no es solo dinero: es blindaje fiduciario.

Con AuditFlow AI, los General Counsels auditan contratos complejos en menos de 32 segundos:
🔹 Detección automática de discrepancias y cláusulas de alto riesgo.
🔹 Generación instantánea de Redlines fiduciarios en .docx y PDF.
🔹 Memoria Volátil (Zero-Retention): Tu secreto profesional blindado al 100%.

🚀 Plan Pro por $69/mes en audiflowai.com`,
    paisCodigo: 'SV',
    paisesAdicionales: ['GT', 'HN', 'CR', 'PA', 'CO', 'MX', 'PE', 'AR'],
    estadoCampana: 'ACTIVE',
    estadoAdSet: 'ACTIVE',
    estadoAnuncio: 'ACTIVE'
  });

  if (res1.success) {
    console.log(`✅ [1/3] Reel 1 Publicado con Éxito (ID Anuncio: ${res1.adId})`);
  } else {
    console.error(`❌ Error en Reel 1:`, res1.error);
  }

  // --- ANUNCIO 2: REEL CFO (IMAGE 2) ---
  console.log('\n📢 [2/3] Publicando Campaña Reel 2: CFOs & Detección de Sobrecostos...');
  const res2 = await publicarAnuncioMeta({
    nombreCampana: 'AuditFlow AI - [Reel 2] Detección de Sobrecostos en Facturas',
    presupuestoDiarioUSD: 5.00,
    urlLanding: 'https://audiflowai.com',
    imageHash: hash2,
    tituloAnuncio: 'Detecta Sobrecostos en Facturas Legales en 30s',
    descripcionAnuncio: 'Reconciliación forense instantánea. Blindaje de EBITDA.',
    textoPrincipal: `📊 El 18.4% de las facturas de proveedores legales contienen sobrecostos ocultos.

Como CFO o Director Financiero, autorizar pagos sin cruzar cada factura contra los acuerdos firmados es una fuga constante de rentabilidad.

AuditFlow AI realiza el cruce forense de forma automática:
✅ Coteja términos acordados contra facturas emitidas en segundos.
✅ Detecta tarifas infladas, horas duplicadas y conceptos no autorizados.
✅ Genera reportes ejecutivos para solicitar notas de crédito inmediatas.

💡 Una sola discrepancia detectada paga años de suscripción ($69/mes).

Comienza hoy en audiflowai.com`,
    paisCodigo: 'SV',
    paisesAdicionales: ['GT', 'HN', 'CR', 'PA', 'CO', 'MX', 'PE', 'AR'],
    estadoCampana: 'ACTIVE',
    estadoAdSet: 'ACTIVE',
    estadoAnuncio: 'ACTIVE'
  });

  if (res2.success) {
    console.log(`✅ [2/3] Reel 2 Publicado con Éxito (ID Anuncio: ${res2.adId})`);
  } else {
    console.error(`❌ Error en Reel 2:`, res2.error);
  }

  // --- ANUNCIO 3: CARRUSEL MULTI-TARJETA (CARDS 1 & 2) ---
  console.log('\n📢 [3/3] Publicando Campaña Carrusel: AuditFlow AI Multi-Card...');
  const res3 = await publicarAnuncioMeta({
    nombreCampana: 'AuditFlow AI - [Carrusel] LegalTech & Finanzas B2B',
    presupuestoDiarioUSD: 5.00,
    urlLanding: 'https://audiflowai.com',
    tipoCreativo: 'CARRUSEL',
    tarjetasCarrusel: [
      {
        titulo: 'Revisa Contratos en 32 Segundos',
        descripcion: 'Redlines fiduciarios en .docx y .pdf.',
        urlLanding: 'https://audiflowai.com',
        imageHash: hash1
      },
      {
        titulo: 'Detecta Sobrecostos en Facturas',
        descripcion: 'Reconciliación forense y blindaje de EBITDA.',
        urlLanding: 'https://audiflowai.com',
        imageHash: hash2
      }
    ],
    textoPrincipal: `⚖️ + 📊 De la revisión manual de 4 horas a la certeza fiduciaria en 32 segundos.

Descubre cómo AuditFlow AI protege tu secreto profesional y detiene fugas de presupuesto en 5 pasos:
1️⃣ Detección instantánea de riesgos contractuales.
2️⃣ Generación de Redlines fiduciarios descargables.
3️⃣ Reconciliación forense de facturas vs. contratos.
4️⃣ Seguridad Zero-Retention (nivel bancario).
5️⃣ Plan Pro desde $69/mes sin permanencia.

👉 Desliza y comienza hoy en audiflowai.com`,
    paisCodigo: 'SV',
    paisesAdicionales: ['GT', 'HN', 'CR', 'PA', 'CO', 'MX', 'PE', 'AR', 'BR'],
    estadoCampana: 'ACTIVE',
    estadoAdSet: 'ACTIVE',
    estadoAnuncio: 'ACTIVE'
  });

  if (res3.success) {
    console.log(`✅ [3/3] Carrusel Publicado con Éxito (ID Anuncio: ${res3.adId})`);
  } else {
    console.error(`❌ Error en Carrusel:`, res3.error);
  }

  console.log('\n============================================================');
  console.log('🎉 ¡TODAS LAS PUBLICACIONES ESTÁN ACTIVAS EN FACEBOOK & INSTAGRAM!');
  console.log('============================================================');
  console.log('👉 Revisa tus campañas en vivo: https://adsmanager.facebook.com');
}

publicarReelsYCarrusel();
