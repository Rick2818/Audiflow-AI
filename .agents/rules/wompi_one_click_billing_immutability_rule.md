# 🔒 REGLA INMUTABLE: MOTOR DE FACTURACIÓN, 1-CLIC WOMPI Y NOTIFICACIONES DE PAGO

**Versión:** 1.0 Enterprise Blindada  
**Fecha de Certificación:** Septiembre 2026  
**Aprobación:** Dirección General (Ricardo)  
**Estado:** INMUTABLE / PRODUCCIÓN ACTIVA

---

## 🏛️ 1. DIRECTIVA DE CERO REGRESIONES EN PASARELAS DE PAGO

Cualquier agente, desarrollador o proceso automatizado que interactúe con el repositorio **Audiflow-AI** debe respetar de forma estricta e inviolable las siguientes reglas:

### 💳 A. Arquitectura 1-Click Checkout con Tokenización Wompi SV
1. **Flujo de Tarjeta Guardada (Card-on-File):**
   - La opción **`⚡ 1-Clic Wompi`** debe mantenerse activa por defecto en el modal del Plan Corporativo (`#enterprise-modal`) y en el modal de reportes individuales (`#payment-modal`).
   - Queda estrictamente prohibido obligar al usuario recurrente a rellenar los 16 dígitos de la tarjeta o el código CVC si ya cuenta con método registrado.
2. **Inmutabilidad del Catálogo de Precios en Servidor (Anti-Parameter Tampering):**
   - Los precios están fijados en el backend (`api/payment.js`):
     * `report_entry_9`: $9.00 USD
     * `modulo_facturacion_9_99`: $9.99 USD
     * `modulo_redlines_19_99`: $19.99 USD
     * `plan_pro_69`: $69.00 USD
     * `plan_anual_590`: $590.00 USD
   - Ningún parámetro enviado desde el cliente (`body.amount`) puede sobreescribir el catálogo oficial del servidor.

---

## 📧 2. PROTOCOLO OBLIGATORIO DE DESPACHO DUAL DE CORREOS

Cada transacción o compra confirmada (1-Clic, Wompi, Strike Lightning, Stripe) debe despachar de forma inmediata e ininterrumpida:

1. **Notificación de Venta al Propietario:**  
   - Destinatarios obligatorios: `rick28191@gmail.com` y `tendenciaiatufuturo@gmail.com`.
   - Remitente: `CONFIG.EMAIL.FROM_SALES` (`rick28191@gmail.com` / Gmail Relay).
2. **Recibo Digital Oficial al Cliente:**  
   - Destinatario: Correo corporativo proporcionado por el comprador.
   - Contenido: Detalle del plan, monto en USD y código de autorización bancaria (`AUTH_XXXXXX`).

---

## ⚡ 3. RESTRICCIÓN DE INFRAESTRUCTURA VERCEL (LÍMITE DE 12 FUNCIONES)

- La carpeta `api/` debe contener **estrictamente 11 o menos funciones Serverless** para cumplir con el límite de Vercel Hobby.
- Toda lógica accesoria de sincronización o herramientas (`indexnow`, `waalaxy-sync`) debe residir en la carpeta `lib/` y ser enrutada a través de `api/admin.js` o `api/outreach.js`.
