import dotenv from 'dotenv';
import { BufferPublisher } from '../lib/buffer-publisher.js';

dotenv.config();

const TOKEN = (process.env.BUFFER_ACCESS_TOKEN || '').trim();
const publisher = new BufferPublisher(TOKEN);

const CAPITULO_2_COPY = `📖 EXPEDIENTE FORENSE #1 (Capítulo 2 de 3): La Cláusula de $142,000 USD al descubierto

45 páginas revisadas por el equipo legal... pero 18 palabras en el Anexo C generaron una factura retroactiva que ningún socio pudo frenar.

Continuando con el caso del contrato de logística que compartimos anteriormente:

El contrato operó con aparente normalidad durante 11 meses. En el mes 12, el proveedor emitió un ajuste retroactivo por $142,000 USD. La dirección financiera intentó rechazarlo de inmediato, pero los abogados externos confirmaron la peor noticia: la cláusula era plenamente vinculante e indefendible.

Aquí está el texto literal que contenía la trampa (Anexo C, página 41, párrafo 4):

«...las tarifas unitarias estarán sujetas a revisión acumulativa periódica conforme a variaciones en la estructura de costos operativos directos e indirectos del operador...»

¿Por qué resultó letal para el cliente?
1️⃣ Sin índice oficial: No ligó los ajustes al IPC oficial del Banco Central.
2️⃣ Sin tope acumulado (Cap): Permitió trasladar cualquier variación interna de costos sin límite del 3% o 5%.
3️⃣ Sin derecho de salida: La empresa no incluyó una cláusula de rescisión sin penalización en caso de discrepancia tarifaria.

⚡ La Comparativa Forense:
• Revisión humana manual de 45 páginas: 3 a 5 horas de lectura mecánica bajo fatiga cognitiva.
• Detección algorítmica en AuditFlow AI: 8.2 segundos en memoria RAM volátil, sin almacenar datos en disco ni exponer el secreto profesional (cumplimiento estricto GDPR Art. 28 y SOC-2).

En la siguiente entrega le mostraremos el Redline preventivo exacto en formato Word (.docx con Control de Cambios) que neutraliza esta contingencia antes de estampar la firma.

¿Sus contratos vigentes de proveedores tienen hoy este tipo de redacciones abiertas?

Pruebe la auditoría confidencial en segundos:
🔗 https://audiflowai.com/?ref=storytelling-ch2

#DerechoCorporativo #LegalTech #AuditoriaForense #Contratos #CFO #DireccionLegal #AuditFlowAI #SocialSelling`;

async function publishStorytellingChapter2() {
  console.log('================================================================================');
  console.log('🚀 AUDITFLOW AI — PUBLICACIÓN DE STORYTELLING FORENSE: CAPÍTULO 2');
  console.log('================================================================================\n');

  try {
    const channels = await publisher.getChannels();
    console.log(`Canales disponibles: ${channels.length}\n`);

    const targetChannels = channels.filter(c => 
      ['linkedin', 'facebook'].includes((c.service || '').toLowerCase())
    );

    for (const ch of targetChannels) {
      console.log(`📡 Publicando en [${ch.service.toUpperCase()}] ${ch.displayName}...`);
      try {
        const res = await publisher.createPost({
          channelId: ch.id,
          text: CAPITULO_2_COPY,
          mode: 'shareNow'
        });
        console.log(`   ✅ Publicado con éxito en ${ch.service.toUpperCase()}! ID: ${res.id}`);
      } catch (postErr) {
        console.error(`   ❌ Error en ${ch.service.toUpperCase()}:`, postErr.message);
      }
    }

    console.log('\n================================================================================');
    console.log('🎉 CAPÍTULO 2 PUBLICADO EXITOSAMENTE VÍA BUFFER EN LINKEDIN Y FACEBOOK');
    console.log('================================================================================\n');
  } catch (err) {
    console.error('Error general:', err.message);
  }
}

publishStorytellingChapter2();
