import dotenv from 'dotenv';
import { BufferPublisher } from '../lib/buffer-publisher.js';

dotenv.config();

const TOKEN = (process.env.BUFFER_ACCESS_TOKEN || '').trim();
const publisher = new BufferPublisher(TOKEN);

const CAPITULO_1_COPY = `📖 EXPEDIENTE FORENSE CONTRACTUAL #1 (Capítulo 1 de 3): El Anexo C de $142,000 USD

Para quienes nos consultaron por el origen de este caso: aquí está la historia completa de cómo 45 páginas aparentemente impecables terminaron en un reclamo que ningún abogado pudo frenar.

---

En 2025, el equipo legal de una multinacional aprobó un contrato de logística de 45 páginas para sus operaciones de distribución.

A simple vista, el documento parecía perfecto:
• Precios unitarios debidamente pactados.
• Acuerdos de nivel de servicio (SLAs) claros y medibles.
• Jurisdicción y cláusula arbitral local bien definidas.

Durante 11 meses, el servicio operó con aparente normalidad. Sin embargo, en el mes 12, el proveedor emitió una factura de ajuste acumulativo retroactivo por $142,000 USD.

La dirección financiera intentó rechazar el cobro de inmediato. La respuesta del proveedor fue demoledora: los remitió directamente al Anexo C, página 41, párrafo 4.

Tras consultar con especialistas, los abogados corporativos confirmaron la peor noticia: la cláusula era plenamente vinculante e indefendible.

El error no estuvo en las cláusulas comerciales visibles de las primeras páginas, sino en una redacción ambigua de 18 palabras en un anexo técnico que ningún ojo humano cansado detectó tras 4 horas de revisión mecánica bajo fatiga cognitiva.

⚡ ¿La lección fiduciaria?
La fatiga humana al revisar contratos extensos de proveedores es hoy el mayor riesgo financiero silencioso para cualquier bufete o empresa.

En AuditFlow AI, nuestro motor forense analiza 45 páginas en 8.2 segundos dentro de memoria RAM volátil (sin almacenar datos en disco ni violar el secreto profesional, bajo GDPR Art. 28) y genera el Redline en Word (.docx con Control de Cambios) listo para negociar.

👉 Revise nuestra publicación complementaria donde revelamos el texto textual e indefendible de esa cláusula.

Audite un borrador confidencial sin costo:
🔗 https://audiflowai.com/?ref=storytelling-ch1

#DerechoCorporativo #LegalTech #AuditoriaForense #Contratos #CFO #DireccionLegal #AuditFlowAI #SocialSelling #GestionDeRiesgos`;

async function publishStorytellingChapter1() {
  console.log('================================================================================');
  console.log('🚀 AUDITFLOW AI — PUBLICACIÓN DE STORYTELLING FORENSE: CAPÍTULO 1');
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
          text: CAPITULO_1_COPY,
          mode: 'shareNow'
        });
        console.log(`   ✅ Publicado con éxito en ${ch.service.toUpperCase()}! ID: ${res.id}`);
      } catch (postErr) {
        console.error(`   ❌ Error en ${ch.service.toUpperCase()}:`, postErr.message);
      }
    }

    console.log('\n================================================================================');
    console.log('🎉 CAPÍTULO 1 PUBLICADO EXITOSAMENTE VÍA BUFFER EN LINKEDIN Y FACEBOOK');
    console.log('================================================================================\n');
  } catch (err) {
    console.error('Error general:', err.message);
  }
}

publishStorytellingChapter1();
