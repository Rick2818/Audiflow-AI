import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { WompiService } from './services/WompiService.js';
import { DatabaseService } from './services/DatabaseService.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const db = new DatabaseService();
const wompi = new WompiService();

// ============================================================================
// 1. ENDPOINTS DE API REST (Backend y Embudo Lead-to-Customer)
// ============================================================================

// Registrar un nuevo Lead desde Anuncio/Landing Page con Tarjeta de Verificación
app.post('/api/leads/registrar-prueba', (req, res) => {
  const { nombre, empresa, email, origenLead, tarjetaNumero, tarjetaMarca } = req.body;

  if (!nombre || !email || !empresa) {
    return res.status(400).json({ 
      exito: false, 
      mensaje: 'Nombre, empresa y correo electrónico son requeridos.' 
    });
  }

  const nuevoLead = db.registrarNuevoLead({
    nombre,
    empresa,
    email,
    origenLead: origenLead || 'LinkedIn B2B / Ads',
    tarjetaNumero: tarjetaNumero || '4321',
    tarjetaMarca: tarjetaMarca || 'Visa Corporate'
  });

  return res.status(201).json({
    exito: true,
    mensaje: 'Lead registrado exitosamente con Token Wompi guardado para 1-Click Upsell.',
    lead: nuevoLead
  });
});

// Obtener datos de un usuario o lead
app.get('/api/usuario/:id', (req, res) => {
  const usuario = db.obtenerUsuario(req.params.id);
  if (!usuario) {
    return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado.' });
  }

  res.json({ exito: true, usuario });
});

// Listar todos los usuarios/leads
app.get('/api/usuarios', (req, res) => {
  res.json({ exito: true, usuarios: db.obtenerTodosLosUsuarios() });
});

// Obtener catálogo de servicios
app.get('/api/catalogo', (req, res) => {
  res.json({ exito: true, catalogo: db.obtenerCatalogo() });
});

// Métricas de conversión en tiempo real
app.get('/api/metricas-embudo', (req, res) => {
  res.json({ exito: true, metricas: db.obtenerMetricasEmbudo() });
});

// Endpoint de Conversión 1-Click con Wompi
app.post('/api/comprar-un-clic', async (req, res) => {
  const { userId, targetAppId, idempotencyKey } = req.body;

  if (!userId || !targetAppId) {
    return res.status(400).json({ 
      exito: false, 
      mensaje: 'Faltan parámetros obligatorios: userId y targetAppId.' 
    });
  }

  if (idempotencyKey && db.esIdempotente(idempotencyKey)) {
    return res.status(409).json({
      exito: false,
      mensaje: 'Transacción en proceso o ya ejecutada previamente.'
    });
  }

  const usuario = db.obtenerUsuario(userId);
  const producto = db.obtenerProducto(targetAppId);

  if (!usuario || !producto) {
    return res.status(404).json({ 
      exito: false, 
      mensaje: 'Usuario o producto no encontrado.' 
    });
  }

  if (!usuario.wompiCardToken) {
    return res.status(400).json({ 
      exito: false, 
      mensaje: 'El lead no tiene tarjeta registrada para cobro automático 1-Click.' 
    });
  }

  try {
    const internalTxId = `auditflow_tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    const resultadoCobro = await wompi.chargeCardToken({
      cardToken: usuario.wompiCardToken,
      amount: producto.precio,
      currency: producto.moneda || 'USD',
      description: `AuditFlow AI - Conversión 1-Click: ${producto.nombre}`,
      customerEmail: usuario.email,
      transactionId: internalTxId
    });

    if (resultadoCobro.success) {
      // Convertir LEAD a CLIENTE PAGADOR en el sistema
      db.convertirLeadACliente(userId, targetAppId, producto.precio);

      // Registrar auditoría financiera
      const tx = db.registrarTransaccion({
        userId: usuario.id,
        userNombre: usuario.nombre,
        empresa: usuario.empresa,
        productoId: producto.id,
        productoNombre: producto.nombre,
        monto: producto.precio,
        moneda: producto.moneda || 'USD',
        wompiTxId: resultadoCobro.transactionId,
        codigoAutorizacion: resultadoCobro.authorizationCode,
        tarjetaTerminadaEn: usuario.tarjetaInfo?.ultimos4 || '4321',
        estado: 'COMPLETADA'
      });

      return res.status(200).json({
        exito: true,
        mensaje: `¡Transacción Exitosa! ${usuario.nombre} se convirtió en CLIENTE PAGADOR con ${producto.nombre}.`,
        transaccion: tx,
        usuarioActualizado: usuario,
        metricas: db.obtenerMetricasEmbudo()
      });
    } else {
      db.registrarTransaccion({
        userId: usuario.id,
        productoId: producto.id,
        monto: producto.precio,
        estado: 'FALLIDA',
        motivo: resultadoCobro.message
      });

      return res.status(402).json({ 
        exito: false, 
        mensaje: resultadoCobro.message || 'El banco emisor denegó el cargo.' 
      });
    }
  } catch (error) {
    console.error('[Error 1-Click]:', error);
    return res.status(500).json({ 
      exito: false, 
      mensaje: 'Error interno al procesar con Wompi SV.' 
    });
  }
});

// Transacciones
app.get('/api/transacciones', (req, res) => {
  res.json({ exito: true, transacciones: db.historialTransacciones });
});

// ============================================================================
// 2. INTERFAZ VISUAL COMPLETA: EMBUDO LEAD ➡️ CLIENTE PAGADOR
// ============================================================================
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>AuditFlow AI - Embudo de Conversión de Leads a Clientes (1-Click Wompi)</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
      <style>
        :root {
          --primary: #2563eb;
          --primary-hover: #1d4ed8;
          --accent-green: #10b981;
          --accent-purple: #8b5cf6;
          --bg-dark: #090d16;
          --card-bg: #131b2e;
          --card-border: #22304d;
          --text-main: #f8fafc;
          --text-muted: #94a3b8;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: var(--bg-dark);
          color: var(--text-main);
          min-height: 100vh;
          padding: 2rem 1rem;
        }

        .main-wrapper {
          max-width: 1140px;
          margin: 0 auto;
        }

        .header-brand {
          text-align: center;
          margin-bottom: 2rem;
        }

        .badge-funnel {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(37, 99, 235, 0.15);
          border: 1px solid rgba(37, 99, 235, 0.4);
          color: #60a5fa;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 14px;
          border-radius: 9999px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
        }

        h1 {
          font-size: 2.1rem;
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          color: var(--text-muted);
          font-size: 1rem;
          margin-top: 6px;
        }

        /* Funnel Flow Tabs */
        .funnel-tabs {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .funnel-step-btn {
          background: #1e293b;
          border: 1px solid var(--card-border);
          color: var(--text-muted);
          padding: 10px 18px;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .funnel-step-btn.active {
          background: #1e3a8a;
          color: #fff;
          border-color: #3b82f6;
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
        }

        /* Metrics Bar */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .metric-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 14px;
          padding: 1.25rem;
          text-align: center;
        }

        .metric-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .metric-value {
          font-size: 1.8rem;
          font-weight: 800;
          color: #fff;
          margin-top: 4px;
        }

        .metric-val-green { color: #34d399; }
        .metric-val-blue { color: #60a5fa; }

        /* Step Containers */
        .step-view { display: none; }
        .step-view.active { display: block; animation: fadeIn 0.3s ease; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        @media (max-width: 850px) {
          .grid-2 { grid-template-columns: 1fr; }
        }

        .card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 16px;
          padding: 1.75rem;
          position: relative;
        }

        .card-header {
          font-size: 1.15rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* Form Inputs */
        .form-group {
          margin-bottom: 1rem;
        }

        .form-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: #cbd5e1;
          margin-bottom: 6px;
        }

        .form-input {
          width: 100%;
          background: #090d16;
          border: 1px solid #334155;
          padding: 10px 14px;
          border-radius: 8px;
          color: #fff;
          font-size: 0.9rem;
        }

        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .btn-primary {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.95rem;
          width: 100%;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          transform: translateY(-1px);
        }

        .btn-success {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .btn-success:hover {
          background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
        }

        .badge-status {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 9999px;
        }
        .badge-lead { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); }
        .badge-client { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); }

        /* Modal */
        .modal-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 1rem;
        }

        .modal-card {
          background: #0f172a;
          border: 1px solid #3b82f6;
          box-shadow: 0 25px 50px -12px rgba(37, 99, 235, 0.35);
          border-radius: 20px;
          max-width: 460px;
          width: 100%;
          padding: 2rem;
          text-align: center;
        }

        .log-box {
          background: #090d16;
          border: 1px solid #1e293b;
          border-radius: 8px;
          padding: 12px;
          font-family: monospace;
          font-size: 0.75rem;
          color: #38bdf8;
          max-height: 140px;
          overflow-y: auto;
          margin-top: 1rem;
          line-height: 1.5;
        }
      </style>
    </head>
    <body>

      <div class="main-wrapper">

        <div class="header-brand">
          <div class="badge-funnel">⚡ AUDITFLOW AI • MÁQUINA DE CONVERSIÓN DE LEADS</div>
          <h1>Embudo Completo: Lead Frío ➡️ Cliente Pagador</h1>
          <p class="subtitle">Estrategia Product-Led Growth (PLG) con Tokenización Wompi El Salvador</p>
        </div>

        <!-- Barra de Métricas del Embudo en Vivo -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-label">Leads Capturados</div>
            <div class="metric-value metric-val-blue" id="m-leads">0</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Con Tarjeta (Tokens)</div>
            <div class="metric-value" id="m-tokens">0</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Clientes Pagadores</div>
            <div class="metric-value metric-val-green" id="m-clientes">0</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Tasa de Conversión</div>
            <div class="metric-value" id="m-tasa">0%</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">MRR Facturado (USD)</div>
            <div class="metric-value metric-val-green" id="m-mrr">$0.00</div>
          </div>
        </div>

        <!-- Selector de Etapas del Embudo -->
        <div class="funnel-tabs">
          <button class="funnel-step-btn active" onclick="cambiarPaso(1)">
            <span>1️⃣ Paso 1: Captura del Lead (Prueba $0 con Tarjeta)</span>
          </button>
          <button class="funnel-step-btn" onclick="cambiarPaso(2)">
            <span>2️⃣ Paso 2: Uso en la App & Paywall (Límite Alcanzado)</span>
          </button>
          <button class="funnel-step-btn" onclick="cambiarPaso(3)">
            <span>3️⃣ Paso 3: Conversión a 1-Clic (Wompi SV Live)</span>
          </button>
        </div>

        <!-- ======================================================== -->
        <!-- PASO 1: CAPTURA DEL LEAD DESDE LINKEDIN / ADS -->
        <!-- ======================================================== -->
        <div id="paso-1" class="step-view active">
          <div class="grid-2">
            
            <div class="card">
              <div class="card-header">
                <span>🎯 Oferta Gancho para el Lead (LinkedIn / Ads)</span>
                <span class="badge-status badge-lead">Paso 1</span>
              </div>
              <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.25rem;">
                No le vendes la suscripción de \$69/mes en frío. Le ofreces:
                <br><strong style="color: #60a5fa;">"Audita 3 contratos gratis en RAM Privada con IA y detecta cláusulas de riesgo en 8 segundos"</strong>.
              </p>
              
              <div style="background: #090d16; padding: 14px; border-radius: 12px; border: 1px solid #1e293b; font-size: 0.85rem; color: #94a3b8; margin-bottom: 1rem;">
                💡 <strong>El Secreto Financiero:</strong> Para activar la prueba gratuita, el lead registra su tarjeta (\$0 de cobro hoy). En este segundo obtenemos el <strong>Token Wompi SV</strong>.
              </div>

              <div style="font-size: 0.8rem; color: #64748b;">
                ✓ Cero cobros sorpresa &nbsp;•&nbsp; ✓ Cancelación en 1 clic &nbsp;•&nbsp; ✓ Encriptación Bancaria
              </div>
            </div>

            <!-- Formulario de Registro de Lead con Tarjeta -->
            <div class="card">
              <div class="card-header">
                <span>📝 Simular Entrada de Nuevo Lead</span>
              </div>

              <form onsubmit="registrarLeadForm(event)">
                <div class="form-group">
                  <label class="form-label">Nombre del Director Legal / CFO:</label>
                  <input type="text" id="lead-nombre" class="form-input" value="Lic. Alejandro Rivas" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Empresa / Bufete:</label>
                  <input type="text" id="lead-empresa" class="form-input" value="Inversiones & LegalTech Central SA" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Email Corporativo:</label>
                  <input type="email" id="lead-email" class="form-input" value="arivas@inversioneslegal.com" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Tarjeta Corporativa para Verificación ($0.00 Cobro):</label>
                  <input type="text" id="lead-tarjeta" class="form-input" value="•••• •••• •••• 9812 (Visa Business)" required>
                </div>

                <button type="submit" class="btn-primary btn-success">
                  <span>🚀 Registrar Lead y Capturar Token Wompi</span>
                </button>
              </form>
            </div>

          </div>
        </div>

        <!-- ======================================================== -->
        <!-- PASO 2: EXPERIENCIA DEL LEAD EN LA APP & TOPE DE USO -->
        <!-- ======================================================== -->
        <div id="paso-2" class="step-view">
          <div class="grid-2">

            <div class="card">
              <div class="card-header">
                <span>👤 Lead Activo en la Plataforma</span>
                <span id="lead-tipo-badge" class="badge-status badge-lead">LEAD EN PRUEBA</span>
              </div>

              <div style="background: #090d16; padding: 14px; border-radius: 12px; border: 1px solid #1e293b; margin-bottom: 1.25rem;">
                <div style="font-size: 0.85rem; margin-bottom: 6px;"><strong>Lead:</strong> <span id="lead-info-nombre">Cargando...</span></div>
                <div style="font-size: 0.85rem; margin-bottom: 6px;"><strong>Empresa:</strong> <span id="lead-info-empresa">...</span></div>
                <div style="font-size: 0.85rem; margin-bottom: 6px;"><strong>Origen:</strong> <span id="lead-info-origen">...</span></div>
                <div style="font-size: 0.85rem;"><strong>Método Guardado:</strong> <span id="lead-info-tarjeta" style="color: #60a5fa;">Visa •••• 7890 (Token Wompi SV Listo)</span></div>
              </div>

              <div style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 6px;">Herramientas activas:</div>
              <div id="lead-herramientas-list"></div>
            </div>

            <div class="card" style="border-color: rgba(245, 158, 11, 0.4);">
              <div class="card-header">
                <span>⚠️ Límite de Prueba Alcanzado</span>
                <span style="font-size: 0.75rem; background: #ef4444; color: #fff; padding: 3px 8px; border-radius: 9999px;">3/3 Contratos Auditados</span>
              </div>

              <p style="font-size: 0.9rem; color: #cbd5e1; margin-bottom: 1rem;">
                El lead ha comprobado el valor de AuditFlow AI auditando sus primeros contratos. Al intentar subir el 4to contrato, salta el muro de pago.
              </p>

              <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 10px; padding: 12px; color: #fbbf24; font-size: 0.85rem; margin-bottom: 1.25rem;">
                🔔 <em>"Has alcanzado el límite de tu prueba gratuita. Pasa a la versión Pro o activa Facturación Automática para continuar."</em>
              </div>

              <button class="btn-primary" onclick="abrirModalConversion()">
                <span>⚡ Convertir Lead a Cliente con 1 Clic</span>
              </button>
            </div>

          </div>
        </div>

        <!-- ======================================================== -->
        <!-- PASO 3: AUDITORÍA Y REGISTRO EN VIVO -->
        <!-- ======================================================== -->
        <div id="paso-3" class="step-view">
          <div class="card">
            <div class="card-header">
              <span>📊 Historial de Conversiones y Cobros Wompi en Tiempo Real</span>
              <button onclick="cargarTodo()" style="background: transparent; border: 1px solid #334155; color: #94a3b8; padding: 4px 12px; border-radius: 6px; cursor: pointer; font-size: 0.8rem;">Refrescar</button>
            </div>

            <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 1rem;">
              Cada vez que un lead presiona el botón de 1-Clic, el banco autoriza la transacción inmediatamente y el lead se convierte en un cliente activo recurrente.
            </p>

            <div class="log-box" id="transacciones-log">
              [Auditoría]: Esperando transacciones...
            </div>
          </div>
        </div>

        <!-- Historial de Usuarios / Leads en el Sistema -->
        <div class="card" style="margin-top: 1.5rem;">
          <div class="card-header">
            <span>👥 Directorio de Leads & Clientes en Memoria</span>
          </div>
          <div id="tabla-usuarios" style="font-size: 0.85rem; color: #cbd5e1;"></div>
        </div>

      </div>

      <!-- MODAL DE CONVERSIÓN A 1-CLIC -->
      <div id="modalConversion" class="modal-overlay">
        <div class="modal-card">
          <div style="font-size: 0.75rem; background: rgba(37, 99, 235, 0.2); color: #60a5fa; font-weight: 700; padding: 4px 12px; border-radius: 9999px; display: inline-block; margin-bottom: 1rem;">
            ⚡ CONVERSIÓN INSTANTÁNEA
          </div>

          <h2 style="font-size: 1.35rem; color: #fff;">AuditFlow Pro + Facturación DTE</h2>
          <p style="font-size: 0.85rem; color: #94a3b8; margin-top: 4px;">
            Auditorías ilimitadas de contratos, generación de Redlines Word y emisión de comprobantes DTE.
          </p>

          <div style="font-size: 2.25rem; font-weight: 800; color: #fff; margin: 1rem 0;">
            $69.00 <span style="font-size: 0.9rem; color: #94a3b8; font-weight: 500;">USD / mes</span>
          </div>

          <div style="background: #090d16; border: 1px solid #1e293b; border-radius: 10px; padding: 12px; margin-bottom: 1.25rem; font-size: 0.8rem; color: #94a3b8; text-align: left;">
            💳 <strong>Cobro inmediato a:</strong> <span id="modal-card-info" style="color: #fff;">Tarjeta registrada</span>
            <br>🔒 <em>Autorizado mediante Token Seguro Wompi SV (Sin rellenar formularios).</em>
          </div>

          <button id="btnEjecutarConversion" class="btn-primary btn-success" onclick="ejecutarCobroConversion()">
            <span>⚡ Activar Plan Pro con 1 Clic ($69/mes)</span>
          </button>

          <button onclick="cerrarModalConversion()" style="background: transparent; border: none; color: #94a3b8; margin-top: 10px; cursor: pointer; font-size: 0.85rem;">
            Cerrar
          </button>
        </div>
      </div>

      <script>
        let currentLeadId = 'lead_demo_01';

        function cambiarPaso(paso) {
          document.querySelectorAll('.funnel-step-btn').forEach((btn, idx) => {
            btn.classList.toggle('active', idx === (paso - 1));
          });
          document.querySelectorAll('.step-view').forEach((view, idx) => {
            view.classList.toggle('active', idx === (paso - 1));
          });
        }

        async function cargarTodo() {
          try {
            // Cargar métricas
            const resMetricas = await fetch('/api/metricas-embudo');
            const dataMetricas = await resMetricas.json();
            if (dataMetricas.exito) {
              const m = dataMetricas.metricas;
              document.getElementById('m-leads').innerText = m.leadsTotales;
              document.getElementById('m-tokens').innerText = m.leadsConTarjeta;
              document.getElementById('m-clientes').innerText = m.clientesConvertidos;
              document.getElementById('m-tasa').innerText = m.tasaConversion;
              document.getElementById('m-mrr').innerText = '$' + m.totalMRR;
            }

            // Cargar datos del lead actual
            const resLead = await fetch('/api/usuario/' + currentLeadId);
            const dataLead = await resLead.json();
            if (dataLead.exito) {
              const u = dataLead.usuario;
              document.getElementById('lead-info-nombre').innerText = u.nombre;
              document.getElementById('lead-info-empresa').innerText = u.empresa;
              document.getElementById('lead-info-origen').innerText = u.origenLead || 'Directo';
              document.getElementById('lead-info-tarjeta').innerText = u.tarjetaInfo.marca + ' •••• ' + u.tarjetaInfo.ultimos4 + ' (Token Wompi)';
              document.getElementById('modal-card-info').innerText = u.tarjetaInfo.marca + ' •••• ' + u.tarjetaInfo.ultimos4;

              const badge = document.getElementById('lead-tipo-badge');
              if (u.tipo === 'CLIENTE_PAGADOR') {
                badge.className = 'badge-status badge-client';
                badge.innerText = '🟢 CLIENTE PAGADOR OFICIAL';
              } else {
                badge.className = 'badge-status badge-lead';
                badge.innerText = '🟡 LEAD EN PRUEBA';
              }

              const toolsDiv = document.getElementById('lead-herramientas-list');
              toolsDiv.innerHTML = u.herramientasActivas.map(h => 
                '<span style="display:inline-block; background:#1e3a8a; color:#93c5fd; font-size:0.75rem; padding:3px 8px; border-radius:6px; margin:3px;">✓ ' + h + '</span>'
              ).join('');
            }

            // Cargar todos los usuarios
            const resUsuarios = await fetch('/api/usuarios');
            const dataUsuarios = await resUsuarios.json();
            if (dataUsuarios.exito) {
              const tabla = document.getElementById('tabla-usuarios');
              tabla.innerHTML = dataUsuarios.usuarios.map(u => 
                '<div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #1e293b;">' +
                  '<div><strong>' + u.nombre + '</strong> (' + u.empresa + ') <span style="font-size:0.75rem; color:#94a3b8;">- ' + (u.tipo === 'CLIENTE_PAGADOR' ? '🟢 Cliente ($' + u.mrrGenerado + '/mes)' : '🟡 Lead en Prueba') + '</span></div>' +
                  '<button onclick="seleccionarLead(\\'' + u.id + '\\')" style="background:#1e3a8a; border:none; color:#fff; padding:4px 8px; border-radius:4px; cursor:pointer; font-size:0.75rem;">Ver en App</button>' +
                '</div>'
              ).join('');
            }

            // Cargar logs
            const resTx = await fetch('/api/transacciones');
            const dataTx = await resTx.json();
            const logBox = document.getElementById('transacciones-log');
            if (dataTx.transacciones.length === 0) {
              logBox.innerHTML = '[Auditoría]: No hay cobros registrados en esta sesión.';
            } else {
              logBox.innerHTML = dataTx.transacciones.map(t => 
                '[' + new Date(t.createdAt).toLocaleTimeString() + '] ' + 
                (t.estado === 'COMPLETADA' ? '🟢 COBRO APROBADO' : '🔴 RECHAZADO') + 
                ' | ' + t.userNombre + ' | ' + t.productoNombre + ' ($' + t.monto + ' ' + t.moneda + ') | Auth: ' + (t.codigoAutorizacion || 'N/A') + ' | Wompi TxID: ' + (t.wompiTxId || 'N/A')
              ).join('<br>');
            }

          } catch (e) {
            console.error(e);
          }
        }

        function seleccionarLead(id) {
          currentLeadId = id;
          cargarTodo();
          cambiarPaso(2);
        }

        async function registrarLeadForm(e) {
          e.preventDefault();
          const nombre = document.getElementById('lead-nombre').value;
          const empresa = document.getElementById('lead-empresa').value;
          const email = document.getElementById('lead-email').value;

          try {
            const res = await fetch('/api/leads/registrar-prueba', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                nombre,
                empresa,
                email,
                origenLead: 'Landing Page B2B',
                tarjetaNumero: '9812',
                tarjetaMarca: 'Visa Corporate'
              })
            });

            const data = await res.json();
            if (data.exito) {
              alert('🎉 ¡Lead Registrado! Token Wompi SV capturado con éxito.');
              currentLeadId = data.lead.id;
              cargarTodo();
              cambiarPaso(2); // Pasar al paso 2
            }
          } catch (err) {
            alert('Error al registrar lead');
          }
        }

        function abrirModalConversion() {
          document.getElementById('modalConversion').style.display = 'flex';
        }

        function cerrarModalConversion() {
          document.getElementById('modalConversion').style.display = 'none';
        }

        async function ejecutarCobroConversion() {
          const btn = document.getElementById('btnEjecutarConversion');
          btn.disabled = true;
          btn.innerHTML = '<span>⏳ Conectando con Wompi SV...</span>';

          const idempotencyKey = 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

          try {
            const res = await fetch('/api/comprar-un-clic', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: currentLeadId,
                targetAppId: 'plan_pro_legaltech',
                idempotencyKey: idempotencyKey
              })
            });

            const data = await res.json();

            if (data.exito) {
              alert('🚀 ' + data.mensaje + '\\n\\nCódigo de Autorización: ' + data.transaccion.codigoAutorizacion);
              cerrarModalConversion();
              cargarTodo();
              cambiarPaso(3); // Pasar a ver el log y métricas
            } else {
              alert('❌ Error: ' + data.mensaje);
            }
          } catch (err) {
            alert('❌ Error al procesar conversión.');
          } finally {
            btn.disabled = false;
            btn.innerHTML = '<span>⚡ Activar Plan Pro con 1 Clic ($69/mes)</span>';
          }
        }

        cargarTodo();
      </script>

    </body>
    </html>
  `);
});

const PUERTO = process.env.PORT || 3000;
app.listen(PUERTO, () => {
  console.log(`[AuditFlow AI Lead-to-Customer Funnel Engine] Servidor ejecutándose en http://localhost:${PUERTO}`);
});
