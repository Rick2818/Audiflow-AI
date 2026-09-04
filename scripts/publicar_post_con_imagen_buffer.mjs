import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { BufferPublisher } from '../lib/buffer-publisher.js';

dotenv.config();

async function publishImagePost() {
  console.log('================================================================================');
  console.log('📸 AUDITFLOW AI — PUBLICACIÓN MULTICANAL CON IMAGEN EN BUFFER (+44% ENGAGEMENT)');
  console.log('================================================================================\n');

  const token = (process.env.BUFFER_ACCESS_TOKEN || '').trim();
  if (!token) {
    console.error('❌ Falta BUFFER_ACCESS_TOKEN en .env');
    return;
  }

  const publisher = new BufferPublisher(token);
  const channels = await publisher.getChannels();

  console.log(`📡 ${channels.length} Canales Detectados en Buffer:`);
  channels.forEach((ch, idx) => {
    console.log(`   ${idx + 1}. [${ch.service.toUpperCase()}] ${ch.displayName} (${ch.id})`);
  });

  const fbChannel = channels.find(c => (c.service || '').toLowerCase() === 'facebook');
  const liChannel = channels.find(c => (c.service || '').toLowerCase() === 'linkedin');

  const post1TextFB = `El verdadero costo de un contrato con proveedores nunca es lo que pagas al firmar... es la cláusula oculta que nadie vio antes de la firma. 📄⚠️

En un despacho boutique o en una empresa mediana, revisar 40 páginas bajo la presión del cierre deja trampas como esta:
🔴 Cláusula de Responsabilidad Solidaria Ilimitada sin tope por lucro cesante.
(Una sola contingencia de un subcontratista puede comprometer el flujo de caja del año).

🛡️ Con AuditFlow AI:
1️⃣ Subes el borrador a memoria RAM privada (cero retención en disco).
2️⃣ En 8 segundos detecta la cláusula desproporcionada.
3️⃣ Te entrega la solución redactada y lista para descargar en Word (.docx con Control de Cambios).

No pagues licencias anuales de $5,000 USD. Audita tu contrato por solo $19 USD o prueba una muestra gratis:
👉 Haz tu escaneo de prueba ahora: https://audiflowai.com/?ref=fb-redline-post

#LegalTech #Contratos #AbogadosCorporativos #PYMES #CFO #AuditFlowAI #ProductividadLegal`;

  const imageUrl = 'https://audiflowai.com/images/redline_forense_clausulas.jpg';

  if (fbChannel) {
    console.log(`\n🚀 Despachando a Facebook Page: ${fbChannel.displayName}...`);
    try {
      const fbResult = await publisher.createPost({
        channelId: fbChannel.id,
        text: post1TextFB,
        mode: 'shareNow',
        service: 'facebook',
        assets: [{ image: { url: imageUrl } }]
      });
      console.log(`✅ [FACEBOOK OK] Publicado exitosamente. ID: ${fbResult.id}`);
    } catch (errFB) {
      console.warn(`⚠️ [FACEBOOK NOTA] Error al compartir en vivo: ${errFB.message}`);
    }
  }

  if (liChannel) {
    console.log(`\n🚀 Despachando a LinkedIn Company Page: ${liChannel.displayName}...`);
    try {
      const liResult = await publisher.createPost({
        channelId: liChannel.id,
        text: post1TextFB,
        mode: 'shareNow',
        service: 'linkedin',
        assets: [{ image: { url: imageUrl } }]
      });
      console.log(`✅ [LINKEDIN OK] Publicado exitosamente. ID: ${liResult.id}`);
    } catch (errLI) {
      console.warn(`⚠️ [LINKEDIN NOTA] Error al compartir en vivo: ${errLI.message}`);
    }
  }

  console.log('\n================================================================================');
  console.log('🎯 Proceso de publicación multicanal completado.');
  console.log('================================================================================\n');
}

publishImagePost().catch(console.error);
