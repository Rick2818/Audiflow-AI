# REGLAS FIDUCIARIAS & DE ARQUITECTURA DE AUDITFLOW AI

## 1. Regla Inmutable de Pasarelas de Pago
- **Stripe NO opera nativamente para cuentas bancarias de El Salvador**.
- **Canales de Cobro Oficiales de la Plataforma**:
  1. **Wompi (Banco Agrícola / Grupo Bancolombia)**: Pasarela oficial para tarjetas de crédito/débito y adquirencia bancaria local en El Salvador y Centroamérica.
  2. **Bitcoin Lightning Network / Strike (rick28@strike.me)**: Pasarela oficial para liquidación instantánea (1-2 segundos) directa a la cuenta de Strike del fundador, tanto para clientes locales como internacionales sin fricción.
  3. **Stripe**: Reservado exclusivamente para entidades jurídicas extranjeras (LLC/Delaware) o clientes con cuenta puente internacional.

## 2. Enrutamiento Fiduciario de Correos
- **Control y Notificaciones del Sistema**: tendenciaiatufuturo@gmail.com
- **Ventas y Transacciones Financieras ($19, $69, $590 USD)**: rick28191@gmail.com

## 3. Regla Inmutable de Prospección y Bases de Datos Reales
- **PROHIBIDO TERMINANTEMENTE EL USO DE CLIENTES, NOMBRES O CORREOS FICTICIOS EN PRODUCCIÓN**: Toda la prospección, envíos, exportaciones (Waalaxy / CSV) y campañas deben ejecutarse exclusivamente contra empresas, despachos corporativos, firmas legales y decisores reales (Directores Legales, General Counsels, Socios Directores y Directores Generales / CEOs verificados con dominios institucionales oficiales).
- **Estrategia Comercial de Fricción Cero**:
  - **Hook Irresistible:** 1er análisis 100% gratis en menos de 10 segundos en memoria RAM volátil (sin almacenar archivos).
  - **Oferta de Entrada:** $19 USD por auditoría completa con Redline en Word (.docx con control de cambios).
  - **Planes Transparentes:** $69 USD/mes (ilimitado) y $599 USD/año (licencia corporativa anual con marca blanca para firmas).
- **Cadencia Anti-Spam (Deliverability > 98%):** Lotes controlados por goteo (Drip Mode de 25 decisores/sesión) para proteger la reputación SPF/DKIM del dominio.
- **Formato de Cold Email Obligatorio**: Texto plano / HTML limpio humano, máximo 5 a 6 líneas (65-75 palabras), asunto en minúsculas estilo colega (`análisis gratis de contratos (10s) y redlines / {{empresa}}`), firma personal de Ricardo y CTA de micro-compromiso de baja fricción.

## 4. Regla Inmutable de Especificidad de Cambios y Navegación UI
- **OBLIGATORIO INDICAR UBICACIÓN EXACTA EN CADA RESPUESTA**: Cada vez que se implemente una función, botón, módulo o ajuste, se debe detallar con máxima precisión al usuario:
  1. **Ubicación en Pantalla / Pestaña**: En qué pestaña (Tab) está, en qué sección, y su posición exacta respecto a elementos vecinos (ej: *debajo del recuadro X, arriba del bloque Y*).
  2. **Guía Visual y de Clics**: Nombre exacto del botón, color distintivo, icono y texto que muestra.
  3. **Archivos y Líneas de Código Modificadas**: Ruta del archivo y número de líneas exactas donde reside la implementación.

## 5. Regla Inmutable de Aislamiento de Rebotes (Zero Bounce Spam a Correos Personales)
- **PROHIBIDO REENVIAR REBOTES AL CORREO PERSONAL**: Si un correo despachado por el sistema rebota (NDR / Mailer-Daemon / Hard Bounce / Soft Bounce / Mailbox Full), el sistema debe:
  1. Filtrar y descartar el evento en silencio sin emitir correos de alerta a `rick28191@gmail.com` ni a `tendenciaiatufuturo@gmail.com`.
  2. Registrar el fallo únicamente en los logs internos / base de datos Supabase para métricas.
  3. No usar `bcc` individual en envíos masivos o transaccionales hacia correos personales; usar exclusivamente `reply_to` para respuestas genuinas de personas reales.
  4. La bandeja de `rick28191@gmail.com` queda reservada ÚNICA Y EXCLUSIVAMENTE para VENTAS Y TRANSACCIONES FINANCIERAS CONFIRMADAS ($19, $69, $590 USD).

## 6. Regla Inmutable de los 3 Idiomas Obligatoria (ES / EN / FR)
- **TODAS LAS PRESENTACIONES, COPIES, AUTO-RESPONDERS Y ENTREGABLES DEBEN CUMPLIR LA REGLA DE 3 IDIOMAS**:
  1. 🇪🇸 **Español (ES)**: Palabra clave "AUDITORIA" (audiencias Latam, España y Centroamérica).
  2. 🇺🇸 **Inglés (EN)**: Palabra clave "AUDIT" (audiencias USA Hispanic, North America y Global).
  3. 🇫🇷 **Francés (FR)**: Mot-clé "AUDIT" (audiencias Europa francófona, Canadá y multinacionales).
  - Los auto-responders y webhooks deben detectar automáticamente el idioma del prospecto y responder en su idioma nativo en menos de 3 segundos.

## 7. Regla de Oro Anti-Quiebra & Operación 100% Autónoma
- **PROHIBIDO DEPENDER DE PUBLICIDAD PAGADA (PAID ADS) O TRÁFICO PASIVO**:
  1. Toda la ingeniería debe generar flujo de caja diario inmediato ($19, $69, $599 USD) mediante automatización serverless 24/7.
  2. SLA de auto-respuesta en menos de 3 segundos ante interacciones de LinkedIn/Waalaxy.
  3. Activación constante de bucles virales de producto (PLG) y SEO programático instantáneo (IndexNow).

