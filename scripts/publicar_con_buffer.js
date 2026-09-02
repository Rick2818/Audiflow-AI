import dotenv from 'dotenv';
import { BufferPublisher } from '../lib/buffer-publisher.js';

dotenv.config();

async function runBufferPublish() {
  console.log('============================================================');
  console.log('🚀 AUDITFLOW AI — PUBLICACIÓN MULTICANAL VÍA BUFFER');
  console.log('============================================================\n');

  const token = process.env.BUFFER_ACCESS_TOKEN;
  if (!token) {
    console.error('❌ ERROR: Falta BUFFER_ACCESS_TOKEN en el archivo .env');
    console.log('\n🧭 INSTRUCCIONES PARA OBTENER TU TOKEN EN BUFFER (1 MINUTO):');
    console.log('1. Inicia sesión en https://buffer.com');
    console.log('2. Conecta tus cuentas (Facebook Page, Instagram, LinkedIn).');
    console.log('3. Ve a https://buffer.com/developers/api y copia tu Access Token.');
    console.log('4. Agrégalo a tu archivo .env: BUFFER_ACCESS_TOKEN=tu_token_aqui\n');
    return;
  }

  const publisher = new BufferPublisher(token);

  try {
    console.log('⏳ Consultando canales conectados en Buffer...');
    const profiles = await publisher.getProfiles();
    console.log(✅ Canales vinculados ():);
    profiles.forEach(p => console.log(   👉 [] @ (ID: )));

    const copyHoy = 💡 CASO REAL: Cómo detectar una fuga de ,400 USD en una factura de proveedor antes de pagar (Desliza ➔)

El 62% de las empresas pagan sobrecostos en facturas de tecnología y compras porque conciliar manualmente 50 páginas de contrato contra una factura es inviable para un equipo ocupado.

Con AuditFlow AI:
✅ Subes el contrato y la factura.
✅ Gemini 2.5 Flash cruza las cláusulas en 8 segundos en memoria RAM volátil.
✅ Genera la carta de objeción en Word (.docx) lista para frenar el pago indebido.

🛡️ Sin almacenamiento en disco. Máxima confidencialidad fiduciaria.
👉 Haz tu prueba gratuita hoy: https://audiflowai.com

#AuditoriaFinanciera #CFO #ControlDeCostos #FinanzasEmpresariales #MicroSaaS #LegalTech;

    console.log('\n⏳ Publicando en todos los canales de Buffer simultáneamente...');
    const result = await publisher.publish({
      text: copyHoy,
      mediaUrls: ['https://audiflowai.com/assets/og-image.png'],
      now: true
    });

    console.log('\n🎉 ¡PUBLICACIÓN MULTICANAL COMPLETADA CON ÉXITO VÍA BUFFER!');
    console.log('Resultados:', JSON.stringify(result, null, 2));

  } catch (err) {
    console.error('❌ Error publicando vía Buffer:', err.message);
  }
}

runBufferPublish();
