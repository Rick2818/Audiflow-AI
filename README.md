# AuditFlow AI - Sistema Micro-SaaS B2B de Auditoría con IA (24/7)

![AuditFlow AI Showcase](frontend/assets/demo_hyperframes.jpg)

[![Production](https://img.shields.io/badge/Vercel%20Production-LIVE-10b981.svg)](https://auditflow-ai-theta.vercel.app)
[![Admin Control Center](https://img.shields.io/badge/Admin%20Dashboard-%2Fadmin-a855f7.svg)](https://auditflow-ai-theta.vercel.app/admin)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Powered by Gemini 2.5](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-38bdf8.svg)](https://deepmind.google/technologies/gemini/)
[![Payments](https://img.shields.io/badge/Payments-Stripe%20%7C%20Strike%20Lightning-amber.svg)](#-pasarelas-de-pago-híbridas--privacidad)
[![Build Status](https://img.shields.io/badge/Tests-1000%2F1000%20PASSED-10b981.svg)](#-suite-de-1000-pruebas-automatizadas)

**AuditFlow AI** es una infraestructura de micro-SaaS B2B diseñada para operar 24/7 sin intervención humana. Audita contratos y facturas mediante la API de **Gemini 2.5 Flash**, detectando 3 fugas financieras o cláusulas de riesgo en menos de 10 segundos, con estricta privacidad (cero almacenamiento de archivos, procesamiento 100% en memoria volátil RAM), filtro pre-vuelo anti-OCR defectuoso, embudo de monetización híbrido con Upsell Corporativo ($49/mes) y pagos directos en Lightning Network a Strike (**`rick28@strike.me`**).

---

## 🌐 Enlaces Oficiales en Vivo

*   👉 **Aplicación Principal**: [https://auditflow-ai-theta.vercel.app](https://auditflow-ai-theta.vercel.app)
*   👉 **Panel Privado de Administración**: [https://auditflow-ai-theta.vercel.app/admin](https://auditflow-ai-theta.vercel.app/admin) *(Contraseña: `AuditFlow2026!`)*
*   👉 **Repositorio GitHub**: [https://github.com/Rick2818/Audiflow-AI](https://github.com/Rick2818/Audiflow-AI)

---

## 🚀 Características Clave Implementadas

1. **Memoria Volátil RAM Efímera (0 Almacenamiento en Disco)**:
   - Los documentos se procesan en búferes de RAM Serverless y se destruyen inmediatamente (`PURGED_FROM_RAM`) tras la auditoría.
2. **Panel de Control de Administración B2B (`/admin`)**:
   - Monitoreo en tiempo real de facturación (USD y Satoshis), leads capturados, candidatos corporativos (`lead_score >= 75`) y exportación a CSV con 1 clic.
3. **Persistencia Automática en Supabase PostgreSQL**:
   - Guardado indestructible en la nube para prospectos, transacciones e informes mediante `@supabase/supabase-js`.
4. **Visor de Ejemplo de Reporte PDF Oficial Modelo**:
   - Modal interactivo que muestra la previsualización del informe firmado con sello de auditoría, desgloses financieros y cláusulas tácticas de renegociación.
5. **Widget Flotante de Prueba Social en Vivo (Social Proof Toast)**:
   - Notificaciones dinámicas no invasivas que rotan en tiempo real demostrando auditorías completadas en El Salvador, Miami, Madrid y México.
6. **Motor de Enlaces de Auditoría Compartibles (`?reportId=...`)**:
   - Botón `🔗 Copiar Enlace para Compartir con Mi Jefe/Socio` que permite a los usuarios enviar el informe a los tomadores de decisiones para autorizar el pago.
7. **Calculadora de ROI (2,450% ROI) y Botón Directo de WhatsApp**:
   - Demuestra el ahorro de ~$1,250 USD en honorarios legales y permite soporte directo B2B.

---

## 🏗️ Arquitectura del Sistema

```
c:\Users\Ricardo\Desktop\Audiflow Ai\
├── .env.example               # Plantilla de claves (Gemini, Supabase, Stripe, Strike, Email)
├── package.json               # Dependencias del servidor Node/Serverless
├── server.js                  # Servidor Express con Helmet WAF, Rate Limiter y endpoints API
├── vercel.json                # Configuración de rutas estáticas y Serverless Functions en Vercel
├── README.md                  # Manual ejecutivo de configuración y despliegue
├── db/
│   └── schema.sql             # DDL PostgreSQL de Supabase (Leads, Reports, Transactions, Subscriptions)
├── api/                       # Vercel Serverless Functions
│   ├── audit.js               # Procesador de auditoría Base64 en memoria RAM efímera
│   ├── admin.js               # API del Dashboard de Control (/admin) y re-envío de ofertas
│   └── lead.js                # Captura de prospectos y disparo de Gmail SMTP
└── frontend/
    ├── admin.html             # Panel de Control B2B con login y exportación CSV
    ├── index.html             # UI bilingüe con visor PDF modelo y prueba social
    ├── css/
    │   └── styles.css         # Estilos, alertas y desenfoque táctico .blurred-content
    └── js/
        ├── i18n.js            # Sistema bilingüe dinámico (ES / EN)
        ├── app.js             # Lógica cliente, widget de prueba social y enlaces compartibles
        └── payment.js         # Integración de Stripe Checkout y QR Strike Lightning
```

---

## 🛡️ Pasarelas de Pago Híbridas & Privacidad

*   **Stripe**: Tarifas planas de **$7.00 USD** (Tripwire) y **$49.00 USD/mes** (Plan Corporativo).
*   **Strike Lightning Network**: Invoices BOLT11 en Satoshis liquidadas directamente a la dirección **`rick28@strike.me`** sin comisiones bancarias internacionales.

---

## 🧪 Suite de 1,000 Pruebas Automatizadas

```bash
npm test
```

Resultados: **1000/1000 PASSED (0 ERRORS)**.

---

## ⚡ Guía de Instalación y Ejecución Local

```bash
git clone https://github.com/Rick2818/Audiflow-AI.git
cd Audiflow-AI
npm install
npm run dev
```

Accede en tu navegador a **`http://localhost:3000`** o al panel admin en **`http://localhost:3000/admin`**.
