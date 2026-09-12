/**
 * Servicio de Integración con Wompi El Salvador (Banco Agrícola)
 * Soporta cobro con Token de Tarjeta Guardada (Card-on-File / Tokenización)
 */
export class WompiService {
  constructor(config = {}) {
    this.appId = config.appId || process.env.WOMPI_APP_ID;
    this.apiSecret = config.apiSecret || process.env.WOMPI_API_SECRET;
    this.apiUrl = config.apiUrl || process.env.WOMPI_API_URL || 'https://api.wompi.sv';
    this.simulationMode = false;
  }

  /**
   * Ejecuta un cargo con Token de Tarjeta previamente guardado (100% Real Producción)
   * @param {Object} params
   * @param {string} params.cardToken - Token de tarjeta (tok_xxx)
   * @param {number} params.amount - Monto en USD
   * @param {string} params.currency - Moneda (USD)
   * @param {string} params.description - Concepto del cobro
   * @param {string} params.customerEmail - Email del cliente
   * @param {string} params.transactionId - Identificador único de transacción interna
   */
  async chargeCardToken({ cardToken, amount, currency = 'USD', description, customerEmail, transactionId }) {
    if (!this.apiSecret || this.apiSecret.includes('tu_api_secret') || !this.appId) {
      return {
        success: false,
        code: 'REAL_PAYMENT_REQUIRED',
        message: 'Pasarela de pago Wompi requiere credenciales reales de producción. Simulación prohibida.',
        transactionId: null
      };
    }

    // Modo Producción Real Wompi El Salvador
    try {
      const payload = {
        tarjetaToken: cardToken,
        monto: amount,
        moneda: currency,
        descripcion: description,
        emailCliente: customerEmail,
        idTransaccionReferencia: transactionId
      };

      const response = await fetch(`${this.apiUrl}/TransaccionCompraToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiSecret}`,
          'X-App-Id': this.appId
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.esAprobada) {
        return {
          success: true,
          transactionId: data.idTransaccion,
          authorizationCode: data.codigoAutorizacion,
          amountCharged: amount,
          currency,
          timestamp: new Date().toISOString(),
          status: 'APROBADA'
        };
      } else {
        return {
          success: false,
          code: data.codigoError || 'WOMPI_ERROR',
          message: data.mensaje || 'La pasarela Wompi rechazó la transacción.',
          details: data
        };
      }
    } catch (error) {
      console.error('[WompiService Error]:', error);
      return {
        success: false,
        code: 'NETWORK_ERROR',
        message: 'No fue posible establecer conexión segura con el procesador bancario Wompi.',
        details: error.message
      };
    }
  }
}
