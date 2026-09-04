import dotenv from 'dotenv';
import { BufferPublisher } from '../lib/buffer-publisher.js';

dotenv.config();

async function programarSemanaBuffer() {
  console.log('================================================================================');
  console.log('🗓️ AUDITFLOW AI — PROGRAMADOR SEMANAL DE BUFFER (HORARIOS ESTRATÉGICOS)');
  console.log('   • LinkedIn: Martes, Miércoles y Jueves a las 08:00 AM');
  console.log('   • Facebook e Instagram: Lunes, Miércoles y Viernes a las 05:30 PM');
  console.log('================================================================================\n');

  const token = (process.env.BUFFER_ACCESS_TOKEN || '').trim();
  if (!token) {
    console.error('❌ Falta BUFFER_ACCESS_TOKEN en .env');
    return;
  }

  const publisher = new BufferPublisher(token);
  const channels = await publisher.getChannels();

  const fbChannel = channels.find(c => (c.service || '').toLowerCase() === 'facebook');
  const liChannel = channels.find(c => (c.service || '').toLowerCase() === 'linkedin');
  const igChannel = channels.find(c => (c.service || '').toLowerCase() === 'instagram');

  console.log('Canales vinculados listos:');
  if (fbChannel) console.log(`   - [FACEBOOK] ${fbChannel.displayName} (${fbChannel.id})`);
  if (liChannel) console.log(`   - [LINKEDIN] ${liChannel.displayName} (${liChannel.id})`);
  if (igChannel) console.log(`   - [INSTAGRAM] ${igChannel.displayName} (${igChannel.id})`);

  // Ejemplo programado para el Lunes Próximo (7 Septiembre 2026, 17:30 El Salvador = 23:30 UTC)
  const fechaLunesFB = '2026-09-07T23:30:00.000Z';
  const postLunesFB = `El verdadero costo de un contrato con proveedores nunca es lo que pagas al firmar... es la cláusula oculta que nadie vio antes de la firma. 📄⚠️

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

  // Ejemplo programado para el Martes Próximo (8 Septiembre 2026, 08:00 AM El Salvador = 14:00 UTC)
  const fechaMartesLI = '2026-09-08T14:00:00.000Z';
  const postMartesLI = `¿Cuánto le cuesta realmente a su firma revisar un contrato comercial de 50 páginas? ⏱️💼

El modelo tradicional:
❌ 4.5 horas de lectura manual exhaustiva.
❌ Fatiga cognitiva y riesgo humano de omisión en anexos técnicos.
❌ Más de $250 USD en costo de horas facturables del equipo legal.

El estándar fiduciario 2026 con AuditFlow AI:
⚡ 8 segundos de auditoría forense en memoria RAM volátil.
⚡ 100% de cláusulas analizadas bajo estándares mercantiles y fiduciarios.
⚡ Exportación directa a Microsoft Word (.docx con Control de Cambios) para enviarlo al proveedor sin perder la tarde.
⚡ Solo $19 USD por contrato auditado. Sin contratos forzosos ni comités de compras.

Los despachos medianos y los departamentos jurídicos ágiles no necesitan software pesado; necesitan velocidad y precisión quirúrgica.

Realice una auditoría de prueba de cortesía con nuestro contrato de muestra interactivo:
🔗 audiflowai.com/?ref=linkedin-comparativa

#Compliance #GobiernoCorporativo #LegalOps #M&A #AsesoríaLegal #AuditFlowAI #EficienciaB2B`;

  console.log('\n⏳ Programando posts en Buffer con fecha y hora personalizada...');

  if (fbChannel) {
    try {
      const fbScheduled = await publisher.createPost({
        channelId: fbChannel.id,
        text: postLunesFB,
        mode: 'customScheduled',
        dueAt: fechaLunesFB,
        service: 'facebook',
        assets: [{ image: { url: 'https://audiflowai.com/images/redline_forense_clausulas.jpg' } }]
      });
      console.log(`✅ [FACEBOOK PROGRAMADO] Post del Lunes 17:30 programado con éxito. ID: ${fbScheduled.id} | Fecha: ${fbScheduled.dueAt}`);
    } catch (e) {
      console.warn(`⚠️ [FACEBOOK ERROR]:`, e.message);
    }
  }

  if (liChannel) {
    try {
      const liScheduled = await publisher.createPost({
        channelId: liChannel.id,
        text: postMartesLI,
        mode: 'customScheduled',
        dueAt: fechaMartesLI,
        service: 'linkedin',
        assets: [{ image: { url: 'https://audiflowai.com/images/comparativa_eficiencia.jpg' } }]
      });
      console.log(`✅ [LINKEDIN PROGRAMADO] Post del Martes 08:00 AM programado con éxito. ID: ${liScheduled.id} | Fecha: ${liScheduled.dueAt}`);
    } catch (e) {
      console.warn(`⚠️ [LINKEDIN ERROR]:`, e.message);
    }
  }

  console.log('\n🎉 ¡Configuración de calendario en Buffer completada!');
}

programarSemanaBuffer().catch(console.error);
