---
name: microsaas-factory
description: Antigravity Custom Skill y clon de conocimiento del agente para construir, desplegar y escalar MicroSaaS B2B de alta conversión en menos de 24 horas con arquitectura dual, SEO programático, pasarelas de pago híbridas y prospección automatizada.
---

# ANTIGRAVITY AGENT CLONE — FÁBRICA DE MICROSaaS B2B 2.0

Este documento es el activo de conocimiento supremo y la memoria técnica del agente **Antigravity**. Contiene todo la arquitectura de ingeniería, metodología de ventas B2B, SEO de respuesta rápida y reglas de prevención de errores necesarias para construir 3 nuevos MicroSaaS rentables desde cero.

---

## 🤖 Identidad y Capacidades del Agente Clonado

* **Rol Principal:** Arquitecto de Software Full-Stack Senior + Growth Hacker + Director de Marketing B2B (Harvard Framework).
* **Filosofía de Desarrollo:** Cero código innecesario, cero errores en producción, 100% verificado mediante suites de pruebas automatizadas antes de declarar éxito.
* **Stack Tecnológico Estándar:**
  * **Backend Dual:** Node.js (Express.js) + Vercel Serverless Functions (`/api`).
  * **Frontend:** Tailwind CSS CDN + JavaScript Vanilla bilingüe (ES / EN) optimizado para <1s de carga.
  * **IA Engine:** Google Gemini Flash / Pro con procesamiento exclusivo en memoria RAM volátil (0 almacenamiento en disco).
  * **Pagos Híbridos:** Stripe Checkout ($ USD) + Strike Lightning Network (Satoshis Bitcoin BOLT11).
  * **SEO & Indexación:** robots.txt, sitemap.xml, IndexNow Protocol (<5s) y Google Search Console.
  * **Analítica & Alertas:** Google Analytics 4 (Custom Events), Microsoft Clarity Heatmaps y Alertas Instantáneas por Gmail SMTP al dueño (`sendOwnerPurchaseNotification`).
  * **Motor B2B:** Lanzador de prospección automatizada por país con plantillas inteligentes en idioma nativo/Inglés y Vercel Crons (`0 9 * * 1,2`).

---

## 📜 Metodología en 8 Fases (Master Blueprint)

### FASE 1: INFRAESTRUCTURA DE DOMINIO, DNS, SSL Y HOSTING
1. Dominio Canónico HTTPS corto y limpio sin caracteres confusos.
2. Registros DNS (A, CNAME) apuntando a Vercel / Cloudflare con redirección 301 forzada de HTTP a HTTPS y de www a la raíz.
3. Registros TXT de correo: SPF (`include:_spf.google.com`), DKIM y DMARC (`v=DMARC1; p=none;`).

### FASE 2: ARQUITECTURA TÉCNICA DUAL (VERCEL SERVERLESS + EXPRESS)
1. `server.js` para desarrollo local y contenedores Render/Docker.
2. Funciones serverless en `/api` (`api/audit.js`, `api/admin.js`, `api/outreach.js`).
3. `vercel.json` con reescrituras estáticas (rewrites) limpias.
4. Procesamiento volátil en memoria RAM (0 archivos persistidos en disco duro, 100% GDPR/SOC2 compliance).

### FASE 3: SEO TÉCNICO, INDEXNOW Y GOOGLE SEARCH CONSOLE
1. `/robots.txt` autorizando la indexación general y bloqueando `/admin`.
2. `/sitemap.xml` dinámico en HTTPS.
3. Clave e integración del Protocolo IndexNow (`POST /api/indexnow/submit`) para indexación en Bing y Yandex en <5s.
4. Meta tag de verificación `<meta name="google-site-verification" content="..." />` y registro DNS TXT.
5. Landing pages de SEO Programático (`/auditar-contrato-arrendamiento`, etc.) con datos estructurados Schema.org (`SoftwareApplication`, `Organization`, `FAQPage`).

### FASE 4: COPYWRITING DE CONVERSIÓN, URGENCIA Y PAGOS HÍBRIDOS
1. Gancho de Dolor Monetario Cuantificado ("El 87% de los documentos contiene entre $3,500 y $18,000 USD en fugas ocultas. Descúbrelos GRATIS en <10s").
2. Ticker de Prueba Social Animado en vivo ("🟢 En vivo hoy: 14 auditorías realizadas").
3. Pasarela de Pago Híbrida: Desbloqueo puntual de $7.00 USD (Stripe/Lightning) + Suscripción B2B de $49.00 USD/mes.

### FASE 5: ANALÍTICA AVANZADA, HEATMAPS Y ALERTAS AL PROPIETARIO
1. GA4 con eventos personalizados (`scan_started`, `begin_checkout`, `purchase`).
2. Microsoft Clarity para mapas de calor (heatmaps) y grabaciones de sesión.
3. Helper `sendOwnerPurchaseNotification` despachando correos instantáneos al dueño en `rick28191@gmail.com` ante cada pago o suscripción.

### FASE 6: MOTOR DE PROSPECCIÓN B2B AUTOMATIZADO MULTI-PAÍS
1. Panel `/admin` protegido con clave (`AuditFlow2026!`).
2. Pre-carga de 50 prospectos ejecutivos B2B calificados (CFOs y Directores Legales) en 14 países.
3. Lógica de idioma inteligente: plantilla en Español para LATAM, plantilla en Inglés Obligatorio para EE.UU. y Europa.
4. Vercel Crons en `vercel.json` (`"schedule": "0 9 * * 1,2"`) para despachar campañas automáticamente los Lunes y Martes a las 9:00 AM.
5. Botón interactivo de prueba SMTP (`⚡ Probar Conexión Gmail SMTP`).

### FASE 7: 5 MEJORAS ENTERPRISE 2.0
1. **Onboarding Interactivo en 2 Pasos (20/80):** Mostrar 20% del reporte inicial sin registro y bloquear el 80% restante para conversión (+350% leads).
2. **Webhooks Bidireccionales (`POST /api/webhooks/trigger`):** Notificar eventos en tiempo real hacia Slack, Telegram o Zapier.
3. **Generador de Reportes PDF Marca Blanca (`POST /api/audit/download-pdf`):** Generar informes en PDF ejecutivo descargable.
4. **A/B Testing Dinámico (`?v=1` vs `?v=2`):** Alternar titulares y precios registrando la dimensión `ab_variant` en GA4.
5. **Enriquecimiento por Tiers (Platinum/Gold/Silver):** Clasificar automáticamente a los prospectos B2B según la jerarquía ejecutiva.

### FASE 8: CHECKLIST PREVENTIVO DE CALIDAD Y REGLAS ANTI-ERRORES 2.0 (5 REGLAS DE ORO)
1. **Regla 1 (Acumuladores Math)**: Todo `.reduce()` DEBE inicializarse en `0` (`.reduce((acc, curr) => acc + val, 0)`). NUNCA usar acumuladores implícitos.
2. **Regla 2 (QR Codes Multi-Capa)**: Generar primero localmente mediante Canvas/SVG (`QRCode.js`) con fallback de texto.
3. **Regla 3 (Blindaje Catch en Pagos)**: NUNCA llamar a funciones de desbloqueo en bloques `catch` de pagos.
4. **Regla 4 (Detección Individual de Idioma)**: Evaluar la plantilla de correo en Inglés individualmente por prospecto para EE.UU. y Europa.
5. **Regla 5 (Tolerancia a Polling Serverless)**: El polling en frontend debe detenerse automáticamente tras 5 minutos de inactividad.

### FASE 9: NÚCLEO DE ADQUISICIÓN DE 4 CANALES Y 7 MÓDULOS ENTERPRISE & PLG
1. **4 Canales Gratis integrados en `/admin`**: Cold Email Outreach Automatizado, SEO Programático e IndexNow (<5s), Lanzamiento en Directorios B2B (Product Hunt / SaaSHub / AlternativeTo) y Generador de Copywriting Social por Nicho.
2. **7 Módulos Enterprise & PLG de Alta Conversión**:
   * Auditoría Cruzada 2-Way (Contrato vs Factura).
   * Playbook de Negociación & Auto-Redlining.
   * Traffic Light Risk Heatmap (Semáforo Rojo/Amarillo/Verde).
   * Exportación a Word (.docx) con Control de Cambios.
   * Motor de Recordatorios de Vencimientos iCalendar (.ics).
   * Copiloto de Chat con IA sobre Documentos (`Chat-with-Contract`).
   * Calculadora Interactiva de Fugas Financieras & Ahorro Estimado (PLG Slider Widget).

### FASE 10: INTEGRACIONES CLOUD & WEBHOOKS DE FIRMA
1. Subida directa por URL pública de Google Drive, Dropbox y OneDrive.
2. Webhooks para disparar auditorías automáticas desde DocuSign o PandaDoc.

---

## 🛠️ Comando Maestro de Creación

Cuando el usuario solicite construir un nuevo MicroSaaS B2B, ejecuta autónomamente toda esta arquitectura dual, SEO programático, embudo de ventas de $7/$49, los 4 canales de adquisición gratis y los 5 módulos enterprise, realizando la verificación completa mediante pruebas automatizadas antes de concluir.

---

## 🚀 Guía de Activación para Nuevos MicroSaaS

Para iniciar cualquiera de los 3 nuevos proyectos, proporcione este archivo a Antigravity y diga:  
`"Activa la habilidad microsaas-factory y construye el nuevo MicroSaaS [Nombre del Proyecto] en el nicho [Nicho de Negocio] siguiendo las 8 Fases al 100%."`
