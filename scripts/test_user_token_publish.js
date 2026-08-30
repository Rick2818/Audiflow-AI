import fetch from 'node-fetch';

const userToken = 'EAAfLgHVZCKeoBSbN0QdZCohlZA9MKOkd4sHlOqK0gQQdZCh7d9YW7aUOuzBZCYQKNwfgWI9kxZCqWNMAlBmsdHiqZCIBqYV7fabDxEsA0CqLG5jlLVi7bMK2C9e1cv7ZCRMKxYO91j3ALaZBZAharF3NEbWvzZB9ltdetRyEy8aWTkoDGZCYF6daqPWEPZA0ZB0wTg3OnVidIAwa9B0WsaFH3FCZCTiXu2wEjPlZCSho2MZAQcxcBSaUJ1SPHLp1NXOi4yacSt5XZA9qlUdiPySZCHoL2ZCtsZCtY';

async function testPublish() {
  try {
    console.log('⏳ 1. Consultando cuentas y páginas vinculadas...');
    const accountsRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?fields=id,name,access_token,instagram_business_account{id,username}&access_token=${userToken}`);
    const accountsData = await accountsRes.json();
    
    if (accountsData.error) {
      console.error('❌ Error en cuentas:', accountsData.error.message);
      return;
    }

    console.log(`✅ Cuentas encontradas (${accountsData.data ? accountsData.data.length : 0}):`);
    accountsData.data.forEach(p => console.log(`   📄 Página: ${p.name} (ID: ${p.id})`));

    const page = accountsData.data.find(p => p.id === '1285349454663691') || accountsData.data[0];
    console.log(`\n🎯 Página seleccionada: ${page.name} (${page.id})`);

    const message = `🚨 ANTES DE FIRMAR CUALQUIER CONTRATO ESTE SÁBADO: El 74% de las penalizaciones contractuales en 2026 provienen de cláusulas invisibles de renovación forzosa y jurisdicción desproporcionada.

En AuditFlow AI creamos el primer auditor forense 100% privado en memoria RAM volátil:
✅ 0% persistencia de datos (tus contratos jamás se almacenan en disco ni entrenan modelos).
✅ Detección en 10 segundos de cláusulas leoninas y sobrecostos.
✅ Descarga inmediata del informe Redline en Word (.docx) con control de cambios.

👉 Audita tu primer contrato GRATIS en 10s: https://audiflowai.com

💬 Comenta "AUDITORIA" para recibir el Checklist Fiduciario 2026 sin costo.

#AuditFlowAI #LegalTech #Compliance2026 #CFO`;

    console.log('⏳ 2. Despachando publicación a la página de Facebook...');
    const postRes = await fetch(`https://graph.facebook.com/v19.0/${page.id}/feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: message,
        access_token: page.access_token
      })
    });

    const postData = await postRes.json();
    console.log('\n============================================================');
    console.log('📊 RESULTADO DE PUBLICACIÓN:');
    console.log(JSON.stringify(postData, null, 2));
    console.log('============================================================\n');

    if (postData.id) {
      console.log(`🎉 ¡PUBLICACIÓN EXITOSA EN PRODUCCIÓN!`);
      console.log(`🔗 Ver en Facebook: https://www.facebook.com/${postData.id}`);
    }
  } catch(err) {
    console.error('Error general:', err.message);
  }
}

testPublish();
