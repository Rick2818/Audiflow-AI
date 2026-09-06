import dotenv from 'dotenv';
import { BufferPublisher } from '../lib/buffer-publisher.js';

dotenv.config();

async function programarSabadoTarde() {
  console.log('================================================================================');
  console.log('🗓️ AUDITFLOW AI — PROGRAMANDO PUBLICACIÓN DE FIN DE SEMANA EN BUFFER (HOY 5:30 PM)');
  console.log('================================================================================\n');

  const token = (process.env.BUFFER_ACCESS_TOKEN || '').trim();
  if (!token) {
    console.error('❌ Falta BUFFER_ACCESS_TOKEN en .env');
    return;
  }

  const publisher = new BufferPublisher(token);
  const channels = await publisher.getChannels();

  console.log(`📡 Canales detectados en Buffer: ${channels.length}`);
  channels.forEach(ch => console.log(`   - [${ch.service.toUpperCase()}] ${ch.displayName} (${ch.id})`));

  // Horario: Hoy Sábado 5 Septiembre a las 5:30 PM El Salvador (UTC-6) = 23:30 UTC
  const dueAtTime = '2026-09-05T23:30:00.000Z';
  const imageUrl = 'https://audiflowai.com/images/redline_forense_clausulas.jpg';

  const postCopy = `¿Pasarás el domingo revisando contratos para la reunión del lunes a las 8 AM? 📄☕

El 82% de los Directores Legales y Gerentes Financieros confiesan que el cierre de mes y los contratos de proveedores les roban sus fines de semana.

Revisar 50 páginas con la vista cansada es donde se escapan las trampas:
⚠️ Cláusulas de renovación tácita con penalidad del 30%.
⚠️ Ajustes por inflación indexados sin tope anual.
⚠️ Exclusión de garantías y cesión forzosa de jurisdicción.

🛡️ El nuevo estándar de trabajo con AuditFlow AI:
1️⃣ Subes el borrador o contrato en PDF/Word.
2️⃣ En 8 segundos, nuestra IA en memoria RAM privada audita cada riesgo.
3️⃣ Descargas el Redline en Word (.docx) con las correcciones listas para contraparte.

Cero almacenamiento de datos. Privacidad empresarial estricta.

👉 Audita tu primer contrato GRATIS en 8 segundos antes del lunes:
https://audiflowai.com/?ref=buffer-weekend

#LegalTech #CFO #DerechoCorporativo #Productividad #Contratos #AuditFlowAI #FinDeSemanaTranquilo`;

  for (const ch of channels) {
    const service = (ch.service || '').toLowerCase();
    console.log(`\n⏳ Programando para [${service.toUpperCase()}] ${ch.displayName}...`);

    try {
      // Intentar programar con customScheduled a las 5:30 PM (23:30 UTC)
      const res = await publisher.createPost({
        channelId: ch.id,
        text: postCopy,
        mode: 'customScheduled',
        dueAt: dueAtTime,
        service: service,
        assets: [{ image: { url: imageUrl } }]
      });

      console.log(`✅ [${service.toUpperCase()}] Programado con éxito para hoy 5:30 PM. Post ID: ${res?.id || 'OK'}`);
    } catch (schedErr) {
      console.warn(`⚠️ [${service.toUpperCase()}] Falló customScheduled (${schedErr.message}). Intentando addToQueue...`);
      try {
        const queueRes = await publisher.createPost({
          channelId: ch.id,
          text: postCopy,
          mode: 'addToQueue',
          service: service,
          assets: [{ image: { url: imageUrl } }]
        });
        console.log(`✅ [${service.toUpperCase()}] Añadido a la cola de Buffer con éxito. ID: ${queueRes?.id || 'OK'}`);
      } catch (queueErr) {
        console.error(`❌ [${service.toUpperCase()}] Error crítico: ${queueErr.message}`);
      }
    }
  }

  console.log('\n================================================================================');
  console.log('🎉 PROCESO COMPLETADO: POST VESPERTINO DE FIN DE SEMANA PROGRAMADO');
  console.log('================================================================================\n');
}

programarSabadoTarde().catch(err => {
  console.error('❌ Error general:', err);
  process.exit(1);
});
