import dotenv from 'dotenv';
import { enviarEventoCAPI } from '../lib/metaCapiService.js';

dotenv.config();

/**
 * ==============================================================================
 * AUDITFLOW AI — SCRIPT DE PRUEBA DE META CONVERSIONS API (CAPI)
 * ==============================================================================
 * Envía un evento de prueba ("Lead" o "InitiateCheckout") a Meta Events Manager
 * ==============================================================================
 */

async function testCAPI() {
  console.log('============================================================');
  console.log('🧪 PRUEBA DE META CONVERSIONS API (CAPI) — AUDITFLOW AI');
  console.log('============================================================\n');

  console.log(`• Pixel ID:         ${process.env.META_PIXEL_ID || 'No configurado'}`);
  console.log(`• Test Event Code:  ${process.env.META_TEST_EVENT_CODE || 'No configurado'}`);
  console.log(`• Access Token:     ${process.env.META_ACCESS_TOKEN ? 'Presente (longitud: ' + process.env.META_ACCESS_TOKEN.length + ')' : 'No configurado'}\n`);

  try {
    const resultado = await enviarEventoCAPI({
      nombreEvento: 'Lead',
      email: 'lead.test@audiflowai.com',
      telefono: '+50370000000',
      ipUsuario: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AuditFlowAI/1.0',
      urlOrigen: 'https://audiflowai.com/prueba-pro',
      valorUSD: 69.00
    });

    console.log('\n🎉 ¡Evento CAPI enviado exitosamente a Meta!');
    console.log('Respuesta de Meta:', JSON.stringify(resultado, null, 2));
    console.log('\n👉 Revisa la pestaña "Probar eventos" en Meta Events Manager para ver el evento en tiempo real.');
  } catch (error) {
    console.error('\n❌ Error al enviar evento CAPI:', error.message);
  }
}

testCAPI();
