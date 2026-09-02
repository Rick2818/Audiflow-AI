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

    // Contenido oficial de alto impacto para B2B
    const copyPublicacion = `💡 CASO REAL: Cómo detectar una fuga de $14,400 USD en una factura de proveedor antes de pagar (Desliza ➔)

El 62% de las empresas pagan sobrecostos en facturas de tecnología y compras porque conciliar manualmente 50 páginas de contrato contra una factura es inviable para un equipo ocupado.

Con AuditFlow AI:
✅ Subes el contrato y la factura.
✅ Gemini 2.5 Flash cruza las cláusulas en 8 segundos en memoria RAM volátil.
✅ Genera la carta de objeción en Word (.docx) lista para frenar el pago indebido.

🛡️ Sin almacenamiento en disco. Máxima confidencialidad fiduciaria.
👉 Haz tu prueba gratuita hoy: https://audiflowai.com

#AuditoriaFinanciera #CFO #ControlDeCostos #FinanzasEmpresariales #MicroSaaS #LegalTech`;

    const imagenUrl = 'https://audiflowai.com/assets/demo_hyperframes.jpg';

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
