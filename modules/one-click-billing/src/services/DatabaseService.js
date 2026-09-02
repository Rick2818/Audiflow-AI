/**
 * Servicio de Base de Datos y Gestión del Embudo Lead-to-Customer (AuditFlow AI)
 */
export class DatabaseService {
  constructor() {
    // Almacén de Leads y Clientes
    this.usuarios = {
      'lead_demo_01': {
        id: 'lead_demo_01',
        tipo: 'LEAD_EN_PRUEBA', // 'LEAD_EN_PRUEBA' | 'CLIENTE_PAGADOR'
        nombre: 'Dra. Sofía Morales',
        empresa: 'Morales & Asociados LegalTech',
        email: 'sofia.morales@bufete-ejemplo.com',
        origenLead: 'LinkedIn B2B Campaign',
        herramientasActivas: ['prueba_gratuita_ram'],
        wompiCardToken: 'tok_wompi_sv_demo_sofia_7890',
        tarjetaInfo: {
          marca: 'Mastercard Corporate',
          ultimos4: '7890',
          expira: '08/28'
        },
        limiteUso: {
          auditoriasUsadas: 3,
          limiteMaximoGratis: 3
        },
        fechaRegistro: new Date(Date.now() - 86400000 * 2).toISOString(),
        mrrGenerado: 0
      }
    };

    // Catálogo de Productos y Upgrades
    this.catalogoHerramientas = {
      'herramienta_facturacion': {
        id: 'herramienta_facturacion',
        nombre: 'Módulo de Facturación Electrónica Automática DTE',
        precio: 9.99,
        moneda: 'USD',
        recurrencia: 'mensual',
        descripcion: 'Emisión ilimitada de DTE Hacienda y cobros recurrentes automáticos a clientes.'
      },
      'modulo_redlines_word': {
        id: 'modulo_redlines_word',
        nombre: 'Generador de Redlines Automatizado en Word (.docx)',
        precio: 19.99,
        moneda: 'USD',
        recurrencia: 'mensual',
        descripcion: 'Convierte cláusulas de riesgo en control de cambios editable para abogados en 8 segundos.'
      },
      'plan_pro_legaltech': {
        id: 'plan_pro_legaltech',
        nombre: 'Suscripción AuditFlow Pro LegalTech (Completa)',
        precio: 69.00,
        moneda: 'USD',
        recurrencia: 'mensual',
        descripcion: 'Auditorías ilimitadas en RAM privada, 14 legislaciones y soporte prioritario 24/7.'
      }
    };

    this.historialTransacciones = [];
    this.processedIdempotencyKeys = new Set();
  }

  // Crear o registrar un nuevo LEAD con Tarjeta de Verificación
  registrarNuevoLead({ nombre, empresa, email, origenLead = 'Landing Page', tarjetaNumero, tarjetaMarca }) {
    const leadId = `lead_${Date.now()}`;
    const ultimos4 = tarjetaNumero ? tarjetaNumero.slice(-4) : '5521';
    const fakeToken = `tok_wompi_sv_${leadId}_${ultimos4}`;

    const nuevoLead = {
      id: leadId,
      tipo: 'LEAD_EN_PRUEBA',
      nombre,
      empresa,
      email,
      origenLead,
      herramientasActivas: ['prueba_gratuita_ram'],
      wompiCardToken: fakeToken,
      tarjetaInfo: {
        marca: tarjetaMarca || 'Visa Business',
        ultimos4: ultimos4,
        expira: '12/29'
      },
      limiteUso: {
        auditoriasUsadas: 3, // Inicia al límite para disparar la conversión o 0 según demo
        limiteMaximoGratis: 3
      },
      fechaRegistro: new Date().toISOString(),
      mrrGenerado: 0
    };

    this.usuarios[leadId] = nuevoLead;
    return nuevoLead;
  }

  obtenerUsuario(id) {
    return this.usuarios[id] || null;
  }

  obtenerTodosLosUsuarios() {
    return Object.values(this.usuarios);
  }

  obtenerProducto(id) {
    return this.catalogoHerramientas[id] || null;
  }

  obtenerCatalogo() {
    return Object.values(this.catalogoHerramientas);
  }

  convertirLeadACliente(userId, productoId, monto) {
    const usuario = this.usuarios[userId];
    if (usuario) {
      usuario.tipo = 'CLIENTE_PAGADOR';
      usuario.mrrGenerado += monto;
      if (!usuario.herramientasActivas.includes(productoId)) {
        usuario.herramientasActivas.push(productoId);
      }
      return true;
    }
    return false;
  }

  registrarTransaccion(registro) {
    const tx = {
      id: `tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      ...registro
    };
    this.historialTransacciones.unshift(tx);
    return tx;
  }

  esIdempotente(idempotencyKey) {
    if (!idempotencyKey) return false;
    if (this.processedIdempotencyKeys.has(idempotencyKey)) {
      return true;
    }
    this.processedIdempotencyKeys.add(idempotencyKey);
    return false;
  }

  // Métricas del Embudo de Ventas
  obtenerMetricasEmbudo() {
    const totalUsuarios = Object.values(this.usuarios);
    const leadsTotales = totalUsuarios.length;
    const leadsConTarjeta = totalUsuarios.filter(u => !!u.wompiCardToken).length;
    const clientesConvertidos = totalUsuarios.filter(u => u.tipo === 'CLIENTE_PAGADOR').length;
    const totalMRR = totalUsuarios.reduce((sum, u) => sum + (u.mrrGenerado || 0), 0);
    const tasaConversion = leadsTotales > 0 ? ((clientesConvertidos / leadsTotales) * 100).toFixed(1) : '0.0';

    return {
      leadsTotales,
      leadsConTarjeta,
      clientesConvertidos,
      totalMRR: totalMRR.toFixed(2),
      tasaConversion: `${tasaConversion}%`
    };
  }
}
