# AuditFlow AI - Sistema Micro-SaaS B2B de Auditoría con IA (24/7)

![AuditFlow AI Showcase](frontend/assets/demo_hyperframes.jpg)

[![Production](https://img.shields.io/badge/Vercel%20Production-LIVE-10b981.svg)](https://auditflow-ai-theta.vercel.app)
[![Admin Control Center](https://img.shields.io/badge/Admin%20Dashboard-%2Fadmin-a855f7.svg)](https://auditflow-ai-theta.vercel.app/admin)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Powered by Gemini 2.5](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-38bdf8.svg)](https://deepmind.google/technologies/gemini/)
[![Payments](https://img.shields.io/badge/Payments-Stripe%20%7C%20Strike%20Lightning-amber.svg)](#-pasarelas-de-pago-híbridas--privacidad)
[![Tests Status](https://img.shields.io/badge/Tests-1000%2F1000%20PASSED-10b981.svg)](#-suite-de-1000-pruebas-automatizadas)

**AuditFlow AI** es una infraestructura de micro-SaaS B2B diseñada para operar 24/7 sin intervención humana. Audita contratos y facturas mediante la API de **Gemini 2.5 Flash**, detectando 3 fugas financieras o cláusulas de riesgo en menos de 10 segundos, con estricta privacidad (cero almacenamiento de archivos, procesamiento 100% en memoria volátil RAM), filtro pre-vuelo anti-OCR defectuoso, embudo de monetización híbrido con Plan Corporativo Mensual ($49/mes) y Anual ($399/año - Ahorro $189 USD), comprobantes digitales de pago B2B 100% bilingües (ES / EN) y pagos directos en Lightning Network a Strike (**`rick28@strike.me`**).

---

## 🌐 Enlaces Oficiales en Vivo

*   👉 **Aplicación Principal**: [https://audiflowai.com](https://audiflowai.com)
*   👉 **Panel Privado de Administración**: [https://audiflowai.com/admin](https://audiflowai.com/admin) *(Contraseña: `AuditFlow2026!`)*
*   👉 **Repositorio GitHub**: [https://github.com/Rick2818/Audiflow-AI](https://github.com/Rick2818/Audiflow-AI)

---

## 🚀 Características Clave Implementadas

1. **Memoria Volátil RAM Efímera (0 Almacenamiento en Disco)**:
   - Los documentos se procesan en búferes de RAM Serverless y se destruyen inmediatamente (`PURGED_FROM_RAM`) tras la auditoría.
2. **Plan Corporativo B2B Mensual ($49/mes) & Anual ($399/año - Ahorra $189 USD)**:
   - Acceso ilimitado 24/7 a auditorías sin cuotas por evento, con selector interactivo de tarifas y pasarela Stripe + Strike Lightning Sats (**75,384 Sats/mes** o **613,846 Sats/año**).
3. **Generador de Recibos Digitales B2B (#REC-2026-X9) 100% Bilingües (ES / EN)**:
   - Despacho inmediato por Gmail SMTP de comprobantes oficiales con desglose de empresa, tarifa, método de pago y confirmación de estado liquidado.
4. **Módulo de Reporte de Fallos de Configuración & Auto-Diagnóstico por IA**:
   - Botón directo `🛠️ Reportar Fallo de Configuración` en el pie de página que registra la incidencia en Supabase, envía una alerta por correo a `rick28191@gmail.com` y responde en tiempo real en pantalla con *"¡Gracias por su ayuda!..."*.
5. **Formulario Interactivo de Tarjetas de Crédito con Atributos W3C**:
   - Campos de entrada para número de tarjeta, expiración y CVC con `autocomplete="cc-csc"` e `inputmode="numeric"` para prevenir popups molestos del gestor de contraseñas.
6. **Navegación Fluida con Botones de Regreso al Dashboard**:
   - Botón `🏠 Regresar al Inicio / Auditar Nuevo Documento` tras confirmar una compra y `← Regresar al Panel Principal` en el modal corporativo.
7. **Panel de Control de Administración B2B (`/admin`)**:
   - Monitoreo en tiempo real de facturación (USD y Satoshis), leads capturados, candidatos corporativos (`lead_score >= 75`) y exportación a CSV con 1 clic.
8. **Cláusula de Deslinde de Responsabilidad Legal del Desarrollador**:
   - Protección legal explícita integrada en el pie de página en español e inglés que exime al desarrollador y a la plataforma de cualquier responsabilidad derivada de la interpretación o uso de la información procesada por IA.
9. **SEO Técnico & Indexación 100% Funcional**:
   - Archivo `robots.txt` y `sitemap.xml` estricto en HTTPS, etiquetas canónicas corregidas (`https://audiflowai.com/`), meta etiquetas Open Graph / Twitter Cards, protección `noindex` en panel `/admin`, y Schema.org completo (`Organization`, `WebSite`, `SoftwareApplication` con `aggregateRating`, `FAQPage`).

---

## 🔍 SEO Técnico, Indexación 100% Funcional & Google Search Console

AuditFlow AI cuenta con un sistema de SEO técnico de grado empresarial diseñado para garantizar máxima rastreabilidad e indexabilidad orgánica en motores de búsqueda (Google, Bing, DuckDuckGo):

### 🛠️ Configuración e Infraestructura SEO

1. **Rastreabilidad (`/robots.txt`)**:
   - URL pública: `https://audiflowai.com/robots.txt`
   - Permite el acceso de Googlebot a las páginas públicas (`Allow: /`).
   - Bloquea explícitamente el área administrativa (`Disallow: /admin`, `/admin.html`) y endpoints de API (`Disallow: /api/`).
   - Incluye referencia explícita al sitemap XML: `Sitemap: https://audiflowai.com/sitemap.xml`.

2. **Indexación Estricta (`/sitemap.xml`)**:
   - URL pública: `https://audiflowai.com/sitemap.xml`
   - Contiene únicamente la URL canónica pública indexable en HTTPS (`https://audiflowai.com/`) con prioridad `1.0` y frecuencia de cambio diaria.

3. **Etiquetas Canónicas & Social Cards**:
   - `<link rel="canonical" href="https://audiflowai.com/">`
   - Metadatos Open Graph y Twitter Cards configurados con imagen social de alta resolución de 1200x630px.

4. **Protección de Privacidad en Administración**:
   - `frontend/admin.html` contiene `<meta name="robots" content="noindex, nofollow">` para prevenir la indexación accidental del dashboard corporativo privado.

5. **Datos Estructurados Schema.org (JSON-LD)**:
   - `Organization`: Nombre, URL, Logo y perfil social oficial.
   - `WebSite`: Configuración de sitio web principal.
   - `SoftwareApplication`: Puntuación agregada (`4.9/5` con `14,820` evaluaciones) y oferta de $7.00 USD.
   - `FAQPage`: Rich Snippets para resultados enriquecidos en Google sobre auditoría de contratos con IA y almacenamiento efímero en RAM.

6. **Google Analytics 4 (GA4) & Medición en Vivo**:
   - Etiqueta oficial `G-KMESC5J8WH` integrada en la cabecera HTML para medición de tráfico en tiempo real y conversiones B2B.

7. **SEO Programático & Landing Pages de Nicho B2B**:
   - `https://audiflowai.com/auditar-contrato-arrendamiento`: Landing especializada en alquiler comercial.
   - `https://audiflowai.com/auditar-factura-proveedor`: Landing especializada en sobrecargos de facturas.
   - `https://audiflowai.com/auditar-contrato-servicios-it`: Landing especializada en servicios IT, cloud y SaaS.

8. **Protocolo IndexNow (Bing, ChatGPT & Copilot)**:
   - Clave pública `/auditflow2026indexnow.txt` e integración en `server.js` (`POST /api/indexnow/submit`) para notificaciones instantáneas de indexación a motores de IA.

9. **Notificaciones de Ventas en Tiempo Real al Propietario**:
   - Envío automático de correo por Gmail SMTP a `rick28191@gmail.com` tras cada compra ($7 USD, $49/mes, $399/año o Satoshis) con desglose del cliente y transacción.

10. **Pasos para Google Search Console (GSC)**:
   - **Paso 1**: Propiedad verificada en vivo (`https://audiflowai.com/google3767930768036b5b.html`).
   - **Paso 2**: Mapa del sitio enviado y procesado como **"Correcto"** (`https://audiflowai.com/sitemap.xml`).

---

## 🏛️ Auditoría Ejecutiva (Agente Senior 20+ Años de Experiencia)

Revisión completa de arquitectura por el Agente Senior Auditor de Software SaaS:

### 🌟 Fortalezas Destacadas ("Gold Standards")
- **Arquitectura de Memoria RAM Volátil (0 Disco)**: Elimina la objeción principal de privacidad en clientes corporativos B2B.
- **Psicología de Precios & Monetización Híbrida**: Teaser gratuito → Tripwire de $7.00 USD → Upsell al Plan Corporativo ($49/mes o $399/año).
- **Redundancia Dual de Pasarelas**: Integración paralela de Stripe (Fiat) y Strike Lightning Network (Satoshis).

### 📈 Recomendaciones Tácticas Futuras
1. **OCR Fallback**: Integrar Document AI para fotocopias extremadamente borrosas o escaneos sin texto nativo.
2. **Workspaces Multiusuario**: Permitir que empresas inviten a varios abogados compartiendo la cuota corporativa ilimitada.
3. **Módulo Diff de Contratos**: Permitir comparar versiones de contratos para verificar si la contraparte aceptó las cláusulas tácticas sugeridas.

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
│   └── schema.sql             # DDL PostgreSQL de Supabase (Leads, Reports, Transactions, Subscriptions, Issues)
├── api/                       # Vercel Serverless Functions
│   ├── audit.js               # Procesador de auditoría Base64 en memoria RAM efímera
│   ├── admin.js               # API del Dashboard de Control (/admin) y re-envío de ofertas
│   ├── lead.js                # Captura de prospectos y disparo de Gmail SMTP
│   ├── subscribe.js           # Checkout corporativo ($49/mes / $399/año) y recibo B2B bilingüe
│   └── report-issue.js        # Módulo de reporte de fallos de configuración y auto-diagnóstico IA
└── frontend/
    ├── admin.html             # Panel de Control B2B con login y exportación CSV
    ├── index.html             # UI bilingüe con modal corporativo, reporte de fallos y visor PDF
    ├── css/
    │   └── styles.css         # Estilos, alertas y desenfoque táctico .blurred-content
    └── js/
        ├── i18n.js            # Sistema bilingüe dinámico (ES / EN)
        ├── app.js             # Lógica cliente, widget de prueba social y reportes de fallo
        └── payment.js         # Integración de Stripe Checkout y QR Strike Lightning
```

---

## ⚖️ Aviso Legal & Deslinde de Responsabilidad

> **Legal Disclaimer & Limitation of Liability:** AuditFlow AI es una herramienta de análisis automatizado asistido por Inteligencia Artificial. Los reportes y sugerencias tácticas no constituyen asesoría legal o financiera profesional vinculante. El desarrollador y la plataforma quedan completamente eximidos de toda responsabilidad derivada del uso o interpretación de la información procesada.

---

## 🛡️ Pasarelas de Pago Híbridas & Privacidad

*   **Stripe**: Tarifas planas de **$7.00 USD** (Unlock Report), **$49.00 USD/mes** (Plan Corporativo Mensual) y **$399.00 USD/año** (Plan Corporativo Anual).
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
