# ⚙️ Todos los Archivos Fuente de AuditFlow AI

Este directorio agrupa la totalidad del **código fuente, backend, endpoints de API, librerías fiduciarias, scripts de automatización y configuración técnica** de AuditFlow AI.

---

## 📂 Estructura de Archivos Fuente

* **`api/`**: Endpoints Serverless en Node.js (Vercel Serverless Functions):
  * `audit.js`: Motor de auditoría con Gemini 2.5 Flash, Postura 3-Vías, Escudo de Omisiones y Fallbacks.
  * `export-docx.js`: Generador de Word `.docx` con Redlines y Memorando para el CFO.
  * `payment.js`: Pasarelas Lightning (Strike) y Stripe.
  * `admin.js`: Panel de control fiduciario y métricas.
  * `chat-document.js`: Copiloto 2-Way contextual.
  * `cross-audit.js`: Conciliación bilateral de contratos y facturas.
  * `waalaxy-sync.js`: Webhooks y sincronización outbound.
* **`lib/`**: Módulos de seguridad, sanitización AppSec y encriptación.
* **`backend/`**: Servidor Express y utilidades backend.
* **`scripts/`**: Automatizaciones y daemons en segundo plano.
* **`tests/`**: Suite de pruebas unitarias y de integración fiduciaria.
* **`server.js`**: Servidor local de desarrollo y producción.
* **`vercel.json`**: Configuración de despliegue y ruteo en Vercel.
* **`package.json`**: Dependencias y scripts de Node.js.
