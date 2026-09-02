import dotenv from 'dotenv';
import { BufferPublisher } from '../lib/buffer-publisher.js';

dotenv.config();

async function runBufferAutomation() {
  console.log('================================================================================');
  console.log('🛰️  AUDITFLOW AI — DESPACHO MULTICANAL AUTOMATIZADO (BUFFER GRAPHQL 2026)');
  console.log('================================================================================\n');

  const token = (process.env.BUFFER_ACCESS_TOKEN || '').trim();
  const tokenDisplay = token ? `${token.substring(0, 8)}...${token.slice(-4)}` : '❌ NO DETECTADO';
  console.log(`🔑 Estado del Token BUFFER_ACCESS_TOKEN: ${tokenDisplay}\n`);

  if (!token) {
    console.log('────────────────────────────────────────────────────────────────────────────────');
    console.log('⚠️  GUÍA RÁPIDA DE ACTIVACIÓN (30 SEGUNDOS) PARA EL DIRECTOR GENERAL:');
    console.log('────────────────────────────────────────────────────────────────────────────────');
    console.log('1. Ingresa a: https://buffer.com/manage/apps');
    console.log('2. Haz clic en "Create an Application" o selecciona "Personal Access Token".');
    console.log('3. Copia el Token generado (Access Token).');
    console.log('4. Pégalo en tu archivo .env:');
    console.log('   BUFFER_ACCESS_TOKEN=tu_token_aqui');
    console.log('5. Conecta tus redes (Facebook Page, Instagram, LinkedIn) en https://publish.buffer.com');
    console.log('6. Vuelve a ejecutar este script con: node scripts/publicar_con_buffer.js');
    console.log('────────────────────────────────────────────────────────────────────────────────\n');
    return;
  }

  const publisher = new BufferPublisher(token);

  try {
    console.log('⏳ Conectando con Buffer GraphQL API (https://api.buffer.com)...');
    const channels = await publisher.getChannels();

    if (!channels || channels.length === 0) {
      console.log('\n⚠️  Conexión exitosa pero NO hay canales conectados en Buffer.');
      console.log('👉 Ve a https://publish.buffer.com y haz clic en "Connect Channels" para vincular:');
      console.log('   - 📘 Facebook Page (AuditFlow AI)');
      console.log('   - 📸 Instagram Business (@audiflowai)');
      console.log('   - 💼 LinkedIn Page / Perfil (AuditFlow AI / Ricardo)');
      return;
    }

    console.log(`\n✅ ${channels.length} Canales Sociales Conectados y Verificados:\n`);
    channels.forEach((ch, idx) => {
      const statusIcon = ch.isDisconnected ? '🔴 (Desconectado)' : '🟢 (Activo)';
      console.log(`   ${idx + 1}. [${ch.service.toUpperCase()}] ${ch.name} ${statusIcon}`);
      console.log(`      ID Canal: ${ch.id} | Organización: ${ch.organizationName || 'Principal'}`);
    });

    // Copy fresco y de alto valor (Caso Forense Real de Rescisión Anticipada)
    const postPayload = {
      text: `¿Sabías que una cláusula de rescisión mal negociada puede costarle $23,000+ USD a tu empresa?

Hace poco auditamos un contrato donde la Cláusula 11.4 obligaba al cliente a pagar el 100% de las mensualidades restantes ante cualquier salida anticipada por mal servicio.

3 Cláusulas críticas que debes neutralizar antes de firmar:
1️⃣ Salida por incumplimiento de SLA (sin penalización).
2️⃣ Topes de responsabilidad recíprocos.
3️⃣ Preaviso de no-renovación a 30 días (evita amarres de 12 meses).

AuditFlow AI escanea contratos y facturas en menos de 45s en memoria RAM volátil (0 almacenamiento en disco) y te entrega el Redline en Word (.docx con control de cambios) listo para renegociar.

🎁 Prueba tu 1ª auditoría 100% GRATIS (sin tarjeta ni registro):
👉 https://audiflowai.com

#DireccionGeneral #CFO #ContratosB2B #FinanzasCorporativas #LegalTech #MicroSaaS`,
      mediaUrls: ['https://audiflowai.com/assets/demo_hyperframes.jpg'],
      mode: 'shareNow'
    };

    console.log('\n────────────────────────────────────────────────────────────────────────────────');
    console.log('🚀 INICIANDO DESPACHO SIMULTÁNEO (SHARE_NOW) A TODAS LAS REDES ACTIVAS...');
    console.log('────────────────────────────────────────────────────────────────────────────────\n');

    const results = [];
    for (const ch of channels) {
      if (ch.isDisconnected) {
        console.log(`⏭️  Omitiendo ${ch.name} (${ch.service}) porque figura como desconectado en Buffer.`);
        continue;
      }

      console.log(`⏳ Publicando en [${ch.service.toUpperCase()}] "${ch.name}"...`);
      try {
        const response = await publisher.createPost({
          channelId: ch.id,
          text: copyPublicacion,
          mediaUrls: [imagenUrl],
          mode: 'shareNow',
          schedulingType: 'automatic'
        });

        console.log(`   ✅ ¡PUBLICADO CON ÉXITO!`);
        console.log(`      ID de Transacción en Buffer: ${response.postId || 'N/A'}`);
        console.log(`      Estado: ${response.status || 'OK'}\n`);

        results.push({ channel: ch.name, service: ch.service, success: true, postId: response.postId });
      } catch (err) {
        console.error(`   ❌ Error al publicar en ${ch.name}:`, err.message, '\n');
        results.push({ channel: ch.name, service: ch.service, success: false, error: err.message });
      }
    }

    console.log('================================================================================');
    console.log('📊 RESUMEN FINAL DEL DESPACHO:');
    console.log('================================================================================');
    console.table(results);

  } catch (error) {
    console.error('\n❌ Error general en la comunicación con Buffer:', error.message);
  }
}

runBufferAutomation();
