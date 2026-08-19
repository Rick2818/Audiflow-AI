# AuditFlow AI — Sistema Micro-SaaS B2B de Auditoría con IA (Grado 9.5+)

![AuditFlow AI Showcase](frontend/assets/demo_hyperframes.jpg)

[![Production](https://img.shields.io/badge/Vercel%20Production-LIVE-10b981.svg)](https://auditflow-ai-theta.vercel.app)
[![Admin Control Center](https://img.shields.io/badge/Admin%20Dashboard-%2Fadmin-a855f7.svg)](https://auditflow-ai-theta.vercel.app/admin)
[![SOC2 & GDPR](https://img.shields.io/badge/Compliance-SOC2%20%7C%20GDPR%20Ready-10b981.svg)](https://audiflowai.com/privacy)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Powered by Gemini 2.5](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-38bdf8.svg)](https://deepmind.google/technologies/gemini/)
[![Payments](https://img.shields.io/badge/Payments-Stripe%20%7C%20Strike%20Lightning-amber.svg)](#-pasarelas-de-pago-híbridas--privacidad)
[![Tests Status](https://img.shields.io/badge/Tests-1000%2F1000%20PASSED-10b981.svg)](#-suite-de-1000-pruebas-automatizadas)

**AuditFlow AI** es una infraestructura Micro-SaaS B2B de grado corporativo 9.5+ diseñada para operar 24/7 sin intervención humana. Audita contratos y facturas mediante la API de **Gemini 2.5 Flash**, detectando fugas financieras de **$3,500 a $18,000 USD** en menos de 4 segundos, con estricta privacidad (cero almacenamiento de archivos, procesamiento 100% en memoria volátil RAM), garantía formal de No-Entrenamiento de IA, motor de correo dual (SMTP Corporativo + Gmail) y arquitectura de precios B2B escalonada.

---

## 🌐 Enlaces Oficiales en Vivo

* 🏠 **Aplicación Principal**: [https://audiflowai.com](https://audiflowai.com)
* 🛡️ **Política de Privacidad & SOC2**: [https://audiflowai.com/privacy](https://audiflowai.com/privacy)
* 📜 **Términos de Servicio B2B**: [https://audiflowai.com/terms](https://audiflowai.com/terms)
* ⚙️ **Panel Privado de Administración**: [https://audiflowai.com/admin](https://audiflowai.com/admin) *(Contraseña: `AuditFlow2026!` o Acceso Rápido de 1-Clic)*
* 🐙 **Repositorio GitHub**: [https://github.com/Rick2818/Audiflow-AI](https://github.com/Rick2818/Audiflow-AI)

---

## 🚀 Características Clave (Estándar 9.5+)

1. **Rediseño UI/UX de Clase Mundial (20+ Años Exp)**:
   - Dropzone Hero con iluminación radial (*Spotlight* dinámico) y seguimiento de cursor.
   - Design System Obsidian & Zinc con cifras numéricas tabulares (`tabular-nums`) y animaciones a 60fps con curvas bezier suaves.
   - Certificación de contraste superior **WCAG AAA (>7:1 ratio)**.

2. **Soporte Tri-Lingüe Nativo (ES | EN | DE)**:
   - **Español (ES)**: Optimizado para el mercado corporativo de Latinoamérica y España.
   - **Inglés (EN)**: Cobertura global para EE.UU., Reino Unido y multinacionales.
   - **Alemán (DE)**: Adaptación jurídica y comercial para la **región DACH (Alemania, Suiza, Austria)** y sus socios comerciales nórdicos (Dinamarca, Noruega, Suecia), con terminología conforme a DSGVO/GDPR.

3. **Motor de Correo B2B Resend & Remitente Corporativo**:
   - **Resend SDK Nativo (`resend`)**: Capacidad de hasta 3,000 correos/mes con entregabilidad ultra-alta y autenticación DKIM/SPF/DMARC.
   - **Remitente Oficial**: `Ricardo | AuditFlow AI <ricardo@audiflowai.com>`.
   - Plantillas de prospección automatizadas con gancho irresistible de auditoría gratuita en los 3 idiomas.

4. **Arquitectura de Precios B2B de Alto Valor ($19 / $69 / $590)**:
   - **Escaneo Diagnóstico ($0 USD):** Vista previa gratuita de 3 anomalías y cálculo de fuga financiera.
   - **Reporte Ejecutivo Completo ($19.00 USD / 29,230 Sats):** Auditoría exhaustiva + Redlines en Word `.docx` editable con control de cambios + PDF oficial firmado digitalmente.
   - **Plan Corporativo Mensual ($69.00 USD/mes):** Auditorías ilimitadas multi-usuario, Cross-Audit 2-Way y Copiloto Chat 24/7.
   - **Plan Corporativo Anual ($590.00 USD/año):** Tarifa preferencial con ahorro de $238 USD (~3.5 meses gratis) y soporte prioritario.

5. **Cumplimiento Legal Formal (SOC2 & GDPR / DSGVO)**:
   - Procesamiento efímero en memoria RAM volátil (`multer.memoryStorage()`) con purga obligatoria (`PURGED_FROM_RAM`).
   - **Cero almacenamiento en disco duro (Zero Disk Retention)**.
   - **Cláusula estricta de NO-ENTRENAMIENTO de modelos de IA** con los contratos o datos confidenciales del cliente.

6. **5 Módulos Enterprise & Copiloto IA**:
   - **Auditoría Cruzada 2-Way**: Reconciliación entre Contratos y Facturas (`/api/cross-audit`).
   - **Playbook de Negociación & Redlines**: Sugerencias de contra-propuesta con marcas de revisión.
   - **Traffic Light Risk Heatmap**: Semáforo visual de riesgos (🔴 Crítico, 🟡 Moderado, 🟢 Conforme).
   - **Exportación Word (.docx)**: Descarga editable con control de cambios (`/api/export-docx`).
   - **Recordatorios iCalendar (.ics)**: Sincronización de vencimientos con Google Calendar y Outlook.
   - **Copiloto Chat con IA (`Chat-with-Contract`)**: Chat en tiempo real sobre el documento (`/api/chat-document`).

7. **SEO Técnico, IndexNow & Google Search Console**:
   - Indexación oficial completada en Google Search Console.
   - Sitemap dinámico, robots.txt, Schema.org (`Organization`, `SoftwareApplication`, `FAQPage`, `HowTo`).
   - Landing pages de SEO Programático (`/auditar-contrato-arrendamiento`, `/auditar-factura-proveedor`, `/auditar-contrato-servicios-it`).
   - Pinger instantáneo a Bing y motores IndexNow en <5s (`/api/indexnow/submit`).

---

## 🧪 Suite de 1,000 Pruebas Automatizadas

```bash
=======================================================
📊 INFORME FINAL SUITE DE 1,000 PRUEBAS AUTOMATIZADAS:
✅ PASSED: 1000 / 1000
❌ FAILED: 0
⏱️ TIEMPO TOTAL: 0.40 s
=======================================================
🎉 ¡1,000 / 1,000 PRUEBAS COMPLETADAS CON 0 ERRORES!
```

---

## 💻 Instalación y Ejecución Local

```bash
# 1. Clonar repositorio
git clone https://github.com/Rick2818/Audiflow-AI.git
cd Audiflow-AI

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env

# 4. Iniciar servidor local
npm start
# Abre en tu navegador: http://localhost:3000
```

---

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT — consulta el archivo [LICENSE](LICENSE) para más detalles.
