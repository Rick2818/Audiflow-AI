# 📘 MANUAL DE USUARIO — AUDITFLOW AI (WEB APP)
**Versión:** 5.0 Enterprise • **Última Actualización:** Septiembre 2026

---

## 🛒 1. CÓMO COMPRAR Y QUÉ HACER DESPUÉS DE PAGAR EN PLANES CORPORATIVOS ($19 USD, $69/MES Y $590/AÑO)

Esta es la sección más importante para el cliente y usuario de **AuditFlow AI**. Aquí se detalla exactamente cómo realizar la compra y qué pasos seguir inmediatamente después de pagar para que la plataforma valide tu acceso y te dé paso libre e ilimitado.

---

### 1.1. Cómo Comprar el Reporte Oficial Individual ($19.00 USD)
Diseñado para despachos contables, auditores externos, abogados o juntas directivas que analizan un contrato o factura específica y requieren un informe ejecutivo formal con validez institucional.

* **Paso 1:** Tras procesar tu documento en la pantalla principal (o probar el contrato de ejemplo), haz clic en **«💳 Desbloquear Informe Completo en Word (.docx)»** o en el botón de compra en cualquiera de las tarjetas de hallazgos.
* **Paso 2:** Selecciona tu pasarela de pago fiduciaria:
  * 💳 **Tarjetas de Crédito / Débito vía Wompi SV (Banco Agrícola / Grupo Bancolombia):** Pago en USD con tarjetas Visa o Mastercard, o escaneando directamente con la app de tu banco el **Código QR oficial Wompi** desplegado en pantalla.
  * ⚡ **Bitcoin Lightning BOLT11 / Strike (`rick28@strike.me`):** Pago instantáneo en Satoshis (~29,200 Sats) mediante código QR BOLT11 o abriendo directamente la app de Strike sin comisiones de red.
  * 🏛️ **Facturación Fiscal / Transferencia Bancaria B2B:** Enlace directo para solicitar factura empresarial o coordinar transferencia ACH/SEPA/SPEI.
* **Paso 3:** Una vez liquidado el pago, el informe se desbloquea de inmediato en pantalla sin recargar la página, habilitando la descarga de los **Redlines en Microsoft Word (.docx con Control de Cambios)** y el **PDF oficial firmado por IA**.

---

### 1.2. Cómo Comprar los Planes Corporativos B2B ($69/mes o $590/año)
Diseñado para corporativos, firmas de abogados, entidades financieras y departamentos de finanzas que auditan contratos y pólizas de forma recurrente:

* **Plan Mensual:** **$69.00 USD / mes** (Auditorías ilimitadas 24/7, multi-usuario, soporte prioritario y exportaciones Word/PDF sin costo por evento).
* **Plan Anual Recomendado:** **$590.00 USD / año** (~3.5 meses gratis, ahorro directo de $238 USD, onboarding asistido y cuota multi-usuario compartida para todo tu equipo).

**Instrucciones de Compra:**
1. Haz clic en el botón **«🚀 Plan Corporativo B2B»** ubicado en la barra de navegación superior o en el banner de planes corporativos.
2. Selecciona la frecuencia: **💳 Mensual ($69 USD)** o **⭐ Anual ($590 USD)**.
3. Ingresa el **Correo Electrónico Corporativo** y el **Nombre de la Empresa o Despacho Legal**.
4. Elige tu método de pago preferido:
   * **⚡ 1-Clic Wompi:** Pago directo y seguro con tarjeta guardada procesada por Banco Agrícola.
   * **💳 Nueva Tarjeta:** Ingreso de tarjeta de crédito/débito internacional vía pasarela protegida.
   * **⚡ Lightning (Strike):** Pago en satoshis al nodo oficial `rick28@strike.me`.
5. Haz clic en **«🚀 Activar Suscripción»** para liquidar.

---

### 1.3. ¿Qué hacer después de pagar en los Planes Corporativos? (Paso a Paso Obligatorio)

Una vez completado el pago de tu membresía corporativa, la activación y uso de la plataforma opera bajo el siguiente protocolo:

#### Paso 1: Localizar el espacio «Introducir el correo electrónico del cliente»
En la barra superior de navegación de [audiflowai.com](https://audiflowai.com), haz clic en el botón **«🔑 Acceso Clientes»**. Se abrirá la ventana oficial de autenticación fiduciaria donde encontrarás el espacio etiquetado explícitamente:
👉 **«Introducir el correo electrónico del cliente:»**

#### Paso 2: Mensaje del Sistema: «Verifique su correo»
Una vez que el cliente ingresa su correo electrónico corporativo y presiona **«⚡ Verificar Correo y Dar Paso →»**, la plataforma le notificará en pantalla:
> 📩 **«Verifique su correo»**  
> *Revise su bandeja de entrada. Se ha enviado su comprobante digital oficial de pago emitido por `ricardo@audiflowai.com` con su número de recibo B2B único (ej. `REC-9X82LA`) y su enlace de activación directa (Magic Link).*

#### Paso 3: Validación Fiduciaria en la Base de Datos
Simultáneamente, la plataforma realiza una consulta en tiempo real contra la base de datos fiduciaria (Supabase).  
**Siempre y cuando en la Base de Datos el correo esté identificado como CLIENTE (`cliente = 'SI'`)**, el sistema valida tu vigencia activa en milisegundos.

#### Paso 4: La Plataforma le da Paso Inmediato
Si el correo existe identificado como cliente en la Base de Datos:
1. **Acceso Concedido:** La plataforma le da paso de inmediato a la terminal de trabajo.
2. **Supresión de Cobro:** Se suprime automáticamente cualquier pantalla o modal de cobro de $19 USD.
3. **Insignia Corporativa:** Se activa el distintivo *«👑 Terminal Corporativa Autorizada — Auditorías Ilimitadas Activas»*.
4. **Descargas Ilimitadas:** Tienes acceso irrestricto para arrastrar cualquier contrato y descargar Word (.docx con Control de Cambios) y PDF oficial firmado todas las veces que requieras.

---

### 1.4. Tabla Fiduciaria de Identificación de Clientes en Base de Datos

Para total claridad y control de seguridad, la plataforma utiliza la siguiente regla fiduciaria en sus tablas de base de datos:

| Tabla en Base de Datos | Campo Evaluado | Condición en la BD | Línea en Tabla / Estatus | Comportamiento y Acción de la Plataforma |
| :--- | :--- | :--- | :--- | :--- |
| **`subscriptions`** | `customer_email` | Correo con suscripción activa ($69/mes o $590/año) | **`cliente = 'SI'` (CLIENTE ACTIVO)** | **DA PASO INMEDIATO:** Activa terminal corporativa ilimitada, suprime cobro de $19 USD y permite descargas Word/PDF ilimitadas. |
| **`audit_leads`** | `email` | Correo marcado como cuenta empresarial / socio | **`cliente = 'SI'` (CLIENTE CORPORATIVO)** | **DA PASO INMEDIATO:** Valida terminal autorizada y habilita acceso a todo el equipo o despacho. |
| **`subscriptions` / `audit_leads`** | `email` | Correo no registrado en la BD o pago no liquidado | **`cliente = 'NO'` (PROSPECTO / NO CLIENTE)** | **ACCESO RESTRINGIDO:** Notifica al usuario verificar su correo, ingresar el correo con el que pagó o adquirir un Plan Corporativo. |

---

## 🌟 2. INTRODUCCIÓN Y PROPUESTA DE VALOR

**AuditFlow AI** es la plataforma Micro-SaaS B2B líder en auditoría financiera y legal automatizada mediante Inteligencia Artificial (**Gemini 2.5 Flash**).

### Principales Beneficios:
* ⚡ **Velocidad Extrema:** Analiza contratos comerciales, facturas y pólizas en **menos de 10 segundos**.
* 🛡️ **Privacidad Absoluta (0 Disco):** Los documentos se procesan en memoria RAM volátil efímera y se destruyen inmediatamente tras la auditoría. No se guardan archivos en disco duro ni se utilizan tus datos para entrenar modelos de IA.
* ⚖️ **Multi-Jurisdicción y Normativa:** Valida cláusulas bajo estándares **PCAOB & US GAAP**, **NIIF / IFRS** o **Códigos de Comercio Locales**.
* 🎁 **Acceso Gratuito de Prueba (14 Días):** Diagnóstico inicial y desbloqueo de soluciones tácticas en 1 clic sin necesidad de ingresar tarjeta de crédito.

---

## 🧭 3. PRIMEROS PASOS: NAVEGACIÓN Y CONFIGURACIÓN

### 3.1. Selector de Idioma (Tri-Lingüe)
Tanto en la barra de navegación superior como dentro de la ventana interactiva del **Manual de Usuario** (`#manual-modal`), dispones del conmutador de idioma en tiempo real:
* **ES:** Español (Latinoamérica y España).
* **EN:** Inglés (Estados Unidos, Reino Unido y corporativos globales).
* **DE:** Alemán (Región DACH: Alemania, Suiza y Austria).

### 3.2. Selector de Marco Normativo
Antes de subir tu documento, localiza el selector ubicado sobre la zona de carga:
1. **🇺🇸 PCAOB & US GAAP:** Selecciona esta opción para papeles de trabajo de auditoría, conciliación automatizada (*tie-outs*) y estándares estadounidenses/británicos.
2. **🌍 NIIF / IFRS:** Recomendado para empresas multinacionales y corporativos con estados financieros bajo normativa internacional.
3. **⚖️ Código de Comercio Local:** Ideal para PyMEs, arrendamientos comerciales y contratos en el ámbito hispano/latinoamericano.

---

## 📤 4. CARGA Y ANÁLISIS DE DOCUMENTOS

### 4.1. Métodos de Carga
* **Arrastrar y Soltar (Drag & Drop):** Arrastra tu archivo PDF, Word (.docx) o imagen PNG, JPG o WebP (hasta 25 MB) sobre la zona punteada.
* **Explorar Archivos:** Haz clic en cualquier parte de la caja de carga para abrir el explorador de archivos de tu computadora o móvil.
* **⚡ Probar con Contrato de Ejemplo:** Si deseas evaluar la plataforma sin subir un archivo propio, haz clic en el botón *«📄 Ver auditoría interactiva de ejemplo»* para cargar una auditoría preconfigurada al instante.

### 4.2. Filtro Pre-Vuelo OCR
La plataforma incluye un motor de visión artificial inteligente. Si el documento subido es un escaneo ilegible o una imagen borrosa que contiene menos de 50 palabras legibles, el sistema te notificará de inmediato para que subas una versión de mayor nitidez y garantizar la máxima precisión en el cálculo de fugas.

---

## 📊 5. INTERPRETACIÓN DEL REPORTE DE AUDITORÍA

Una vez completado el análisis en < 10s, la plataforma despliega el **Panel Ejecutivo de Resultados**:

### 5.1. Métricas Principales del Encabezado
* **Tipo de Documento e ID Único:** Muestra la categoría detectada (ej. *Contrato Comercial*, *Factura de Proveedor*, *Arrendamiento*) y el identificador de sesión.
* **Insignia Normativa:** Indica el marco normativo aplicado (ej. *PCAOB & US GAAP*).
* **Semáforo de Riesgo:** Nivel de exposición financiera (*BAJO*, *MEDIO*, *ALTO*, *CRÍTICO*).
* **Fuga Financiera Total Estimada ($ USD):** El monto cuantitativo exacto que tu empresa podría perder o pagar en exceso debido a las cláusulas abusivas.
* **Lead Score (0 - 100):** Calificación algorítmica de vulnerabilidad y urgencia de renegociación.

### 5.2. Tarjetas de Hallazgos (3 Fallas Críticas)
Cada hallazgo contiene:
1. **Título y Referencia de Cláusula:** Identifica la sección exacta del contrato (ej. *Cláusula 8.2 — Penalización por Cancelación Anticipada*).
2. **Impacto Financiero Individual:** Pérdida económica atribuida a esa falla específica.
3. **🔍 Resumen de la Anomalía (Gratis):** Explicación clara y concisa del riesgo detectado.
4. **💡 Solución Táctica & Texto Sustitutivo de Renegociación:** Redacción jurídica exacta recomendada para reemplazar la cláusula abusiva.

---

## 🛠️ 6. HERRAMIENTAS Y FUNCIONALIDADES AVANZADAS

Una vez desbloqueado el reporte, dispones de una barra de herramientas integral:

### 6.1. 👁️ Visor Visual de Redlines en Pantalla (Control de Cambios)
* En cada tarjeta de hallazgo, haz clic en **«👁️ Ver Control de Cambios en Vivo (Redlines)»**.
* Permite comparar el **Texto Original Detectado** (tachado en rojo) contra la **Propuesta Sustitutiva Optimizada** (en verde).

### 6.2. 📄 Descargar Word (.docx) Redlines
* Genera y descarga un archivo `.docx` con formato corporativo, membrete de auditoría verificada y las cláusulas sustitutivas listas para enviar a tu contraparte o proveedor.

### 6.3. 🖨️ Imprimir / Guardar en PDF
* Genera la versión para imprimir o exportar en PDF oficial con el **Sello y Firma Digital de Validación por IA**.

### 6.4. 📅 Recordatorios de Calendario (.ics)
* Descarga automáticamente un archivo `.ics` que programa recordatorios estratégicos en tu calendario (Google Calendar, Apple Calendar, Outlook) antes de las fechas límite de renovación o preaviso de terminación.

### 6.5. 💬 Copiloto IA Interactivo (Chat con el Documento)
* Haz clic en **«💬 Chatear con la IA sobre este Contrato»**.
* Puedes hacer preguntas en lenguaje natural sobre multas, plazos, garantías o interpretar párrafos complejos.

### 6.6. 📁 Historial de Sesión Local Cifrado (Vault)
* En la barra superior, haz clic en **«📁 Historial Local»**.
* Podrás ver y restaurar tus últimas 10 auditorías realizadas en el día sin que nada se haya almacenado en servidores externos.

### 6.7. 📅 Agendar Demo de 10 min en Vivo
* En la barra superior, haz clic en **«📅 Demo 10 min»** para agendar una sesión en vivo con un especialista en conciliación automatizada y descargar tu invitación de calendario.

---

## 🏢 7. CANALES EXCLUSIVOS DE ATENCIÓN VIP Y SOPORTE 24/7

Como cliente o suscriptor corporativo, cuentas con canales de atención VIP directos:
* 💬 **WhatsApp Concierge VIP:** [+503 7989 3922](https://wa.me/50379893922) (Comunicación directa y en vivo con Dirección para resolución inmediata de dudas o casos complejos).
* ✉️ **Correo Oficial de Soporte:** [soporte@audiflowai.com](mailto:soporte@audiflowai.com) (Tiempo de respuesta garantizado < 2 horas).
* 🎧 **Pestaña de Soporte en la Web:** Puedes abrir el Centro de Soporte en cualquier momento desde la barra superior de la app para enviar consultas o solicitar re-análisis asistido por IA.
