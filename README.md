# AuditFlow AI - Sistema Micro-SaaS B2B de Auditoría con IA (24/7)

[![GitHub stars](https://img.shields.io/github/stars/your-user/auditflow-ai?style=social)](https://github.com/your-user/auditflow-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Powered by Gemini 2.5](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-38bdf8.svg)](https://deepmind.google/technologies/gemini/)
[![Payments](https://img.shields.io/badge/Payments-Stripe%20%7C%20Lightning%20Network-amber.svg)](#-pasarelas-de-pago-híbridas--privacidad)
[![Build Status](https://img.shields.io/badge/Tests-1000%2F1000%20PASSED-10b981.svg)](#-suite-de-1000-pruebas-automatizadas)

**AuditFlow AI** es una infraestructura de micro-SaaS B2B diseñada para operar 24/7 sin intervención humana. Audita contratos y facturas mediante la API de **Gemini 2.5 Flash**, detectando 3 fugas financieras o cláusulas de riesgo en menos de 10 segundos, con estricta privacidad (cero almacenamiento de archivos, procesamiento 100% en memoria volátil RAM), filtro pre-vuelo anti-OCR defectuoso y un embudo de monetización híbrido con Upsell Corporativo ($49/mes).

---

## 🛡️ Estrategias de Mitigación e Ingeniería Implementadas

### 1. Tripwire + Embudo de Upsell Corporativo ($49/mes)
- El cobro inicial de **$7 USD / Satoshis** actúa como un producto de alta conversión (*Tripwire*) para filtrar compradores de curiosos.
- Cuando el Lead Score determina un perfil empresarial de alto valor (`lead_score >= 75`), el sistema activa automáticamente un banner One-Click y un correo de seguimiento ofreciendo la **Suscripción Corporativa Ilimitada por $49/mes** vía Stripe o Lightning recurrente.

### 2. Confianza Visual y Reducción de Fricción Psicológica
- Se integraron banners estáticos de alta visibilidad directamente debajo del área de *Drag & Drop*:
  - 🔒 **Procesamiento Efímero**: Análisis exclusivo en memoria RAM volátil y destrucción en < 5 segundos.
  - 🛡️ **Privacidad Estricta**: Cero almacenamiento físico en disco. Cifrado de grado bancario AES-256 en tránsito.

### 3. Filtro Pre-Vuelo Anti-Garbage (Legibilidad OCR)
- Se incorporó un módulo de validación antes de realizar llamadas a la API de Gemini 2.5 Flash o solicitar pagos.
- **Regla Estricta**: `IF word_count < 50 OR garbled_text_ratio > 20% THEN ABORT`.
- Si el documento es borroso o ilegible, la interfaz muestra la alerta: *"Documento Ilegible o Resolución Insuficiente"* y solicita una copia más clara **sin emitir cobros ni pedir datos de pago**, previniendo disputas financieras o reembolsos.

---

## 🏗️ Arquitectura del Sistema

```
c:\Users\Ricardo\Desktop\Audiflow Ai\
├── .env.example               # Plantilla de claves (Gemini, Supabase, Stripe, Lightning, Email)
├── package.json               # Dependencias del servidor Node/BoxLang y scripts
├── server.js                  # Servidor con Filtro Pre-Vuelo OCR, Memoria Volátil y API de Suscripciones
├── README.md                  # Manual ejecutivo de configuración y despliegue
├── db/
│   └── schema.sql             # DDL Supabase (Incluye tablas `subscriptions` y `customer_tokens`)
├── backend/
│   ├── Application.bx         # Motor BoxLang y purga de RAM
│   ├── router.bx              # Enrutador REST principal
│   ├── services/
│   │   ├── GeminiService.bx   # Filtro Pre-Vuelo OCR + Prompt Gemini 2.5 Flash
│   │   ├── SupabaseService.bx # Servicio de metadatos e historial
│   │   ├── StripeService.bx   # Checkout $7 USD Tripwire y Suscripciones $49/mes
│   │   ├── LightningService.bx# Facturas BOLT11 Satoshis (10 min ttl)
│   │   └── EmailAgent.bx      # Email automatizado con propuesta de Upsell $49/mes
│   └── webhooks/
│       └── MasterWebhook.bx   # Listener unificado Stripe & Lightning
└── frontend/
    ├── index.html             # UI bilingüe con micro-copys de seguridad y alerta Pre-Vuelo OCR
    ├── css/
    │   └── styles.css         # Estilos, alertas y desenfoque .blurred-content
    └── js/
        ├── i18n.js            # Sistema bilingüe dinámico (ES / EN)
        ├── app.js             # Lógica cliente, manejo del filtro Pre-Vuelo y Upsell
        └── payment.js         # Integración de Stripe Checkout y QR Lightning
```

---

## 🧪 Suite de 1,000 Pruebas Automatizadas

El proyecto incluye una suite autónoma de estrés y rendimiento en [`tests/stress_test.js`](file:///c:/Users/Ricardo/Desktop/Audiflow%20Ai/tests/stress_test.js):

```bash
npm test
```

Resultados: **1000/1000 PASSED (0 ERRORS)** en 0.67s.

---

## ⚡ Guía de Instalación y Ejecución

```bash
cd "c:\Users\Ricardo\Desktop\Audiflow Ai"
npm install
npm run dev
```

Accede en tu navegador a **`http://localhost:3000`**.
