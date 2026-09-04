import dotenv from 'dotenv';
import { BufferPublisher } from '../lib/buffer-publisher.js';

dotenv.config();

async function programarHoyTarde() {
  console.log('================================================================================');
  console.log('🚀 PROGRAMACIÓN INMEDIATA: INICIO HOY VIERNES POR LA TARDE (05:30 PM)');
  console.log('================================================================================\n');

  const token = (process.env.BUFFER_ACCESS_TOKEN || '').trim();
  const publisher = new BufferPublisher(token);
  const channels = await publisher.getChannels();

  const fbChannel = channels.find(c => (c.service || '').toLowerCase() === 'facebook');
  const igChannel = channels.find(c => (c.service || '').toLowerCase() === 'instagram');
  const liChannel = channels.find(c => (c.service || '').toLowerCase() === 'linkedin');

  // Hora exacta de hoy viernes: 17:30 El Salvador (UTC-6) = 23:30 UTC
  const dueAtHoy = '2026-09-04T23:30:00.000Z';
  const imageUrl = 'https://audiflowai.com/images/comparativa_eficiencia.jpg';

  const copyViernesTarde = `Es viernes por la tarde. ¿Cuánto te costaría quedarte revisando un contrato de 50 páginas hasta la noche? ⏱️💼

El dilema de todo asesor legal y director financiero un viernes:
❌ 4.5 horas de lectura manual exhaustiva y fatiga visual.
❌ El riesgo latente de pasar por alto una penalización o cláusula leonina en los anexos.
❌ Más de $250 USD en costo de horas facturables.

Con AuditFlow AI terminas la jornada a tiempo:
⚡ 8 segundos de auditoría forense en memoria RAM volátil.
⚡ 100% de cláusulas analizadas bajo estándares mercantiles y fiduciarios.
⚡ Redline descargable de inmediato en Microsoft Word (.docx con Control de Cambios).
⚡ Solo $19 USD por contrato auditado. Sin contratos forzosos ni comités de compras.

Prueba la auditoría de muestra interactiva sin subir documentos confidenciales y vete a descansar con total paz mental:
👉 Prueba de cortesía aquí: https://audiflowai.com/?ref=fb-viernes-tarde

#LegalTech #Contratos #Abogados #CFO #AuditFlowAI #ProductividadLegal #Viernes`;

  console.log(`📡 Programando para hoy 17:30 (5:30 PM) local:`);

  if (fbChannel) {
    try {
      const fbRes = await publisher.createPost({
        channelId: fbChannel.id,
        text: copyViernesTarde,
        mode: 'customScheduled',
        dueAt: dueAtHoy,
        service: 'facebook',
        assets: [{ image: { url: imageUrl } }]
      });
      console.log(`✅ [FACEBOOK PROGRAMADO HOY] ID: ${fbRes.id} | Programado para: ${fbRes.dueAt}`);
    } catch (e) {
      console.warn(`⚠️ [FACEBOOK ERROR]:`, e.message);
    }
  }

  if (igChannel) {
    try {
      const igRes = await publisher.createPost({
        channelId: igChannel.id,
        text: copyViernesTarde,
        mode: 'customScheduled',
        dueAt: dueAtHoy,
        service: 'instagram',
        assets: [{ image: { url: imageUrl } }]
      });
      console.log(`✅ [INSTAGRAM PROGRAMADO HOY] ID: ${igRes.id} | Programado para: ${igRes.dueAt}`);
    } catch (e) {
      console.warn(`⚠️ [INSTAGRAM ERROR]:`, e.message);
    }
  }

  console.log('\n================================================================================');
  console.log('🎉 ¡El post de hoy viernes por la tarde ha quedado programado y activo!');
  console.log('================================================================================\n');
}

programarHoyTarde().catch(console.error);
