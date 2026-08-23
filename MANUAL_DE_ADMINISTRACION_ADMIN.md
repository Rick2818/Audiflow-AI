# ⚙️ MANUAL DE ADMINISTRACIÓN — AUDITFLOW AI (PANEL DE CONTROL B2B)
**Ruta del Módulo:** `/admin` • **Versión:** 5.0 Enterprise • **Última Actualización:** Agosto 2026

---

## 🔐 1. ACCESO Y SEGURIDAD DEL PANEL
El panel de administración está ubicado en la ruta protegida:
👉 **URL Oficial:** `https://audiflowai.com/admin` (o `http://localhost:3000/admin` en entorno local).

### 1.1. Mecanismo de Autenticación
* **Contraseña Maestra:** `AuditFlow2026!`
* **Cifrado y Seguridad:** Protegido contra ataques de fuerza bruta, comparación en tiempo constante (*timing-attack proof* vía `crypto.timingSafeEqual`) y limitación de tasa (*rate limit* de 20 peticiones/min).
* **Persistencia de Sesión:** Al autenticarte con éxito, el token administrativo se guarda en el almacenamiento local de tu navegador para que no tengas que ingresar la contraseña en cada recarga.
* **Cierre de Sesión Seguro:** Botón **«Salir»** en el encabezado superior para revocar el token de sesión.

---

## 📊 2. DASHBOARD EJECUTIVO & MÉTRICAS EN TIEMPO REAL

Al ingresar, el panel despliega 4 tarjetas de métricas clave (KPIs):

1. **👥 Total de Leads Registrados:** Conteo acumulado de prospectos capturados en los escaneos y campañas.
2. **💰 Fuga Financiera Global Detectada ($ USD):** Sumatoria de todas las pérdidas económicas y sobrecostos identificados por la IA en contratos auditados.
3. **📈 Ingresos Proyectados / Monetización ($ USD):** Facturación total estimada entre desbloqueos de $19 USD y suscripciones corporativas de $69/mes y $590/año.
4. **🎯 Tasa de Conversión B2B (%):** Porcentaje de leads que avanzan desde el escaneo gratuito hasta la activación del plan corporativo.

---

## 🚀 3. MOTOR DE PROSPECCIÓN DIRECTA B2B (1,000 LEADS EN 14 PAÍSES)

AuditFlow AI cuenta con un motor integrado de prospección automatizada para directores financieros y controllers.

### 3.1. Segmentación y Distribución Equitativa:
* **Total de Prospectos:** 1,000 ejecutivos calificados de alto nivel.
* **Proporción de Roles:**
  * 👑 **500 Directores Financieros (`CFO_FINANCE`)**
  * 📊 **500 Financial Controllers (`FINANCIAL_CONTROLLER`)**
* **Segmentación Lingüística en 14 Mercados:**
  * 🇪🇸 **Español (360 Leads):** El Salvador (72), Guatemala (72), Costa Rica (72), Panamá (72), México (72).
  * 🇺🇸 / 🇬🇧 **Inglés (500 Leads):** Estados Unidos (72), Inglaterra (72), Francia (72), Luxemburgo (70), Dinamarca (70), Noruega (70), Finlandia (70).
  * 🇩🇪 **Alemán (144 Leads):** Alemania (72), Suiza (72).

### 3.2. Lanzamiento de Campañas de Correo B2B:
1. Selecciona el país objetivo en el menú desplegable **«Seleccionar Mercado / País»** (ej. *El Salvador*, *México*, *Estados Unidos*, *Alemania*).
2. Haz clic en el botón **«🚀 Lanzar Campaña B2B Automatizada»**.
3. **Motor Dual de Envíos:**
   * **Canal Primario:** **Resend API (`ricardo@audiflowai.com`)** con dominio verificado y entregabilidad certificada (SPF, DKIM, DMARC, RFC 8058 `List-Unsubscribe`).
   * **Canal Secundario de Respaldo:** Gmail SMTP Corporativo (`rick28191@gmail.com`).
4. **Consola de Registro en Vivo:** En la parte inferior del panel se mostrará en tiempo real el progreso de entrega correo por correo con código de estatus.

---

## 🏆 4. ENRIQUECIMIENTO AUTOMÁTICO DE TIERS (PLATINUM / GOLD / SILVER)

El panel categoriza automáticamente a los prospectos según su volumen de fuga financiera y Lead Score:
* 💎 **Tier Platinum (Lead Score > 85 y Fuga > $15,000 USD):** Candidatos inmediatos para el Plan Anual Corporativo ($590/año) y sesión en vivo de 10 min.
* 🥇 **Tier Gold (Lead Score 70 - 84 y Fuga $5,000 - $14,999 USD):** Candidatos para Plan Mensual ($69/mes) y desbloqueo de soluciones tácticas.
* 🥈 **Tier Silver (Lead Score < 70 o Fuga < $5,000 USD):** Candidatos para el Tripwire oficial de $19 USD.

---

## 📥 5. EXPORTACIÓN Y REPORTES EN CSV

* Haz clic en **«📥 Exportar Leads (CSV)»** en la barra superior.
* Genera una hoja de cálculo estructurada con Nombre, Email, Empresa, País, Rol, Lead Score, Fuga Financiera y Fecha de Captura, lista para importar en **HubSpot, Salesforce, Lemlist o Apollo.io**.

---

## 💳 6. GESTIÓN DE TRANSACCIONES & SUSCRIPCIONES

* **Transacciones de Reportes ($19 USD):** Registro de pagos procesados mediante Stripe Checkout y Bitcoin Lightning BOLT11.
* **Suscripciones Corporativas ($69 / $590):** Listado de cuentas empresariales activas, fechas de renovación y estado de facturación recurrente.
* **Reservas de Demo (`demo_bookings`):** Registro de llamadas de 10 minutos agendadas por directores financieros a través del widget de la web.

---

## 🛠️ 7. DIAGNÓSTICO DEL SERVIDOR Y SALUD DE INFRAESTRUCTURA

* **Botón «🔄 Actualizar»:** Refresca las métricas directamente desde Supabase y la memoria del servidor.
* **Comprobación de Conectividad SMTP / Resend:** Botón para enviar un correo de prueba y validar que las credenciales de correo se encuentren 100% operativas.
* **Protección WAF y Firewall:** Monitoreo pasivo de peticiones bloqueadas por rate limit o payloads maliciosos.

---

## 📬 8. MANDATO UNIVERSAL: COPIA Y CONTROL DE DESPACHOS AL PROPIETARIO

**Regla Inviolable de Operatividad:**
Siempre que el módulo de administración (`/admin`) o cualquier servicio del backend ejecute un envío de correo electrónico —ya sea:
1. Oferta individual a un lead (`🚀 Enviar Oferta` o `📩 Re-enviar`).
2. Despacho masivo a prospectos filtrados (`🚀 Despachar Ofertas a Leads Filtrados`).
3. Campaña de prospección B2B (`🚀 Disparar Campaña B2B Real`).
4. Secuencia de recuperación de leads (`/api/lead-recovery`).
5. Notificación post-pago de venta desbloqueada (`/api/webhook`).
6. Prueba de conectividad SMTP (`⚡ Probar Conexión Gmail SMTP`).

**Acción Obligatoria del Sistema:**
* El sistema **DEBE SIEMPRE** enviar de forma automática e inmediata una **Copia de Control** detallada a la bandeja del propietario: **`rick28191@gmail.com`**.
* Utiliza como canal seguro el transporte autenticado de **Gmail SMTP** con reintento garantizado y cero desvíos a sandboxes de prueba.

