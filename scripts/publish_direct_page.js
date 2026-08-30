import fetch from 'node-fetch';

const pageToken = 'EAAfLgHVZCKeoBSWNFEJRTNUGQZBouCklD2ekVC8AsE71KXgpvsrQOwvMYCy1TOt76DOutClZAuJ9TA8pirazt70YRQtZBnC2CEVblfcSQaq8FosJcBStT8XGuK7JxIWtxhtqwhyIF9B6jZCXxPKOEDqWB39Kxd9ApUkmTLIBJJExMIu3xwVAKMvC97friM98ZAczcmmpaK4nCt7eBklSTFf7cHQDRpJBryShQOoZC8ZD';
const pageId = '1285349454663691';

const message = `🚨 ANTES DE FIRMAR CUALQUIER CONTRATO ESTE SÁBADO: El 74% de las penalizaciones contractuales en 2026 provienen de cláusulas invisibles de renovación forzosa y jurisdicción desproporcionada.

En AuditFlow AI creamos el primer auditor forense 100% privado en memoria RAM volátil:
✅ 0% persistencia de datos (tus contratos jamás se almacenan en disco ni entrenan modelos).
✅ Detección en 10 segundos de cláusulas leoninas y sobrecostos.
✅ Descarga inmediata del informe Redline en Word (.docx) con control de cambios.

👉 Audita tu primer contrato GRATIS en 10s: https://audiflowai.com

💬 Comenta "AUDITORIA" para recibir el Checklist Fiduciario 2026 sin costo.

#AuditFlowAI #LegalTech #Compliance2026 #CFO`;

async function publish() {
  console.log('⏳ Despachando publicación a la página de Facebook...');
  try {
    const res = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: message,
        access_token: pageToken
      })
    });

    const data = await res.json();
    console.log('RESULTADO:', JSON.stringify(data, null, 2));

    if (data.id) {
      console.log(`\n🎉 ¡PUBLICADO CON ÉXITO EN PRODUCCIÓN!`);
      console.log(`🔗 Enlace directo al post: https://www.facebook.com/${data.id}`);
    }
  } catch(err) {
    console.error('Error:', err.message);
  }
}

publish();
