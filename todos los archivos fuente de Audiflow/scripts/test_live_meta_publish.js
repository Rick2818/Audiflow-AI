import fetch from 'node-fetch';

const pageToken = 'EAAfLgHVZCKeoBSdAiJqaI2uZBN3XHXj822i7LI3ZCpZAREc0IxZATA4GEgZBm4B3ttrc1KdBzIvfBUz4yHLx5zPtALkMwbxOPfjgkZABpQDZCMqIXbjet3zg7E9IFHIs2YQiz0KSytX0EJmh573Y1SRBo8T5vKShZAT9IZAeHKZBn1JhRZBG7snZAacSp4uo6GZBG16RZBvBnCPRjZBzq9AEbhHkK8yEZBewZC5QW3rnmGYHAC';
const pageId = '1285349454663691';

const message = `🚨 ANTES DE FIRMAR CUALQUIER CONTRATO ESTE FIN DE SEMANA: El 74% de las penalizaciones contractuales en 2026 provienen de cláusulas invisibles de renovación forzosa y jurisdicción desproporcionada.

En AuditFlow AI creamos el primer auditor forense 100% privado en memoria RAM volátil:
✅ 0% persistencia de datos (tus contratos jamás se almacenan en disco ni entrenan modelos).
✅ Detección en 10 segundos de cláusulas leoninas y sobrecostos.
✅ Descarga inmediata del informe Redline en Word (.docx) con control de cambios.

👉 Audita tu primer contrato GRATIS en 10s: https://audiflowai.com

💬 Comenta "AUDITORIA" para recibir el Checklist Fiduciario 2026 sin costo.

#AuditFlowAI #LegalTech #Compliance2026 #CFO`;

async function publish() {
  console.log('⏳ Publicando en vivo en Facebook Page (Audiflowai.com)...');
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
    console.log('RESULTADO DE PUBLICACIÓN:', JSON.stringify(data, null, 2));

    if (data.id) {
      console.log(`\n🎉 ¡PUBLICADO CON ÉXITO EN VIVO! Post ID: ${data.id}`);
      console.log(`🔗 Puedes verlo directamente en tu página: https://www.facebook.com/${data.id}`);
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

publish();
