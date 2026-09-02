import dotenv from 'dotenv';
import { BufferPublisher } from '../lib/buffer-publisher.js';

dotenv.config();

async function testBufferGraphQL() {
  console.log('============================================================');
  console.log('🛰️ AUDITFLOW AI — CONECTOR BUFFER.COM (GRAPHQL API 2026)');
  console.log('============================================================\n');

  const token = process.env.BUFFER_ACCESS_TOKEN;
  console.log('🔑 Token detectado:', token ? `${token.slice(0, 8)}...` : 'NO CONFIGURADO');

  const publisher = new BufferPublisher(token);

  try {
    console.log('⏳ Conectando con https://api.buffer.com ...');
    const channels = await publisher.getChannels();
    console.log(`\n✅ Canales vinculados detectados (${channels.length}):`);
    
    if (channels.length === 0) {
      console.log('⚠️ No hay canales/páginas sociales conectadas todavía en tu cuenta de Buffer.');
      console.log('👉 Entra a https://publish.buffer.com y conecta tu Página de Facebook, Instagram o LinkedIn.');
      return;
    }

    channels.forEach(c => {
      console.log(`   👉 [${c.service.toUpperCase()}] ${c.name} (ID: ${c.id})`);
    });

    const copyHoy = `💡 CASO REAL: Cómo detectar una fuga de $14,400 USD en una factura de proveedor antes de pagar (Desliza ➔)

El 62% de las empresas pagan sobrecostos en facturas de tecnología y compras porque conciliar manualmente 50 páginas de contrato contra una factura es inviable para un equipo ocupado.

Con AuditFlow AI:
✅ Subes el contrato y la factura.
✅ Gemini 2.5 Flash cruza las cláusulas en 8 segundos en memoria RAM volátil.
✅ Genera la carta de objeción en Word (.docx) lista para frenar el pago indebido.

🛡️ Sin almacenamiento en disco. Máxima confidencialidad fiduciaria.
👉 Haz tu prueba gratuita hoy: https://audiflowai.com

#AuditoriaFinanciera #CFO #ControlDeCostos #FinanzasEmpresariales #MicroSaaS #LegalTech`;

    console.log('\n⏳ Despachando publicación a todos los canales conectados...');
    for (const ch of channels) {
      console.log(`   🚀 Publicando en ${ch.name} (${ch.service})...`);
      try {
        const res = await publisher.createPost({
          text: copyHoy,
          channelId: ch.id,
          mediaUrls: ['https://audiflowai.com/assets/demo_hyperframes.jpg'],
          schedulingType: 'SHARE_NOW'
        });
        console.log(`   ✅ Éxito en ${ch.name}:`, JSON.stringify(res));
      } catch (postErr) {
        console.warn(`   ⚠️ Aviso en canal ${ch.name}:`, postErr.message);
      }
    }

  } catch (err) {
    console.error('\n❌ Diagnóstico Buffer API:', err.message);
  }
}

testBufferGraphQL();
