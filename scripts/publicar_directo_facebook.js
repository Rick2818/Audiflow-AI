import dotenv from 'dotenv';
dotenv.config();

async function publishDirectToMeta() {
  console.log('============================================================');
  console.log('🚀 AUDITFLOW AI — PUBLICACIÓN DIRECTA VÍA META GRAPH API');
  console.log('============================================================\n');

  const pageId = process.env.META_PAGE_ID;
  const token = process.env.META_ACCESS_TOKEN;

  if (!pageId || !token) {
    console.error('❌ Falta META_PAGE_ID o META_ACCESS_TOKEN en .env');
    return;
  }

  const message = `💡 CASO REAL: Cómo detectar una fuga de $14,400 USD en una factura de proveedor antes de pagar.

El 62% de las empresas pagan sobrecostos en contratos porque conciliar 50 páginas de letra chica manualmente es inviable.

Con AuditFlow AI:
✅ Subes el contrato y la factura.
✅ Gemini 2.5 Flash cruza las cláusulas en 8s en memoria RAM volátil.
✅ Genera la carta de objeción en Word (.docx) lista para frenar el cobro indebido.

🛡️ 0 Almacenamiento en disco. Privacidad total garantizada.
👉 Prueba gratis tu 1er contrato hoy: https://audiflowai.com

#LegalTech #CFO #DireccionGeneral #AuditoriaFinanciera #ControlDeCostos #ContratosB2B #MicroSaaS`;

  try {
    console.log(`⏳ Publicando directamente en la Página de Facebook (ID: ${pageId})...`);
    const res = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: message,
        link: 'https://audiflowai.com',
        access_token: token
      })
    });

    const data = await res.json();
    console.log('\n📊 Respuesta de Facebook Graph API:', data);

    if (data.id) {
      console.log(`\n🎉 ¡PUBLICACIÓN EN FACEBOOK EXITOSA! ID del Post: ${data.id}`);
      console.log(`👉 Puedes verlo en tu página: https://facebook.com/${pageId}`);
    } else if (data.error) {
      console.error(`\n❌ Error de Meta:`, data.error.message);
    }
  } catch (err) {
    console.error('❌ Error de red:', err.message);
  }
}

publishDirectToMeta();
