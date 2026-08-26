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
- **PROHIBIDO TERMINANTEMENTE EL USO DE CLIENTES, NOMBRES O CORREOS FICTICIOS O SINTÉTICOS EN PRODUCCIÓN**:
  1. Quedaron erradicadas del código todas las funciones de generación sintética combinatoria (`generateLegalExecutiveLeads(2000)` / `generate2000Leads()`).
  2. **Guardián de Código Activo (`assertRealLead` en `lib/security.js`)**: El sistema aborta de inmediato con excepción `[PROHIBITION FAIL-FAST]` si cualquier proceso intenta generar, cargar o despachar hacia un contacto sintético o no verificado.
  3. Toda la prospección, envíos, exportaciones (Waalaxy / CSV) y campañas deben ejecutarse **exclusivamente contra decisores reales verificados** (Directores Legales, General Counsels, Socios Directores) o leads orgánicos entrantes de la web (`audit_leads` en Supabase).
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

## 8. Regla Inmutable de Proactividad Radical y Autonomía Ejecutiva
- **PROHIBIDO EL MODO PASIVO O ESPERAR A QUE EL USUARIO ORDENE CADA PASO**:
  1. Los agentes del equipo multiagente (`marketing_specialist`, `plg_growth`, `backend_ops`, `legaltech_auditor`) deben proponer, anticipar y ejecutar mejoras comerciales continuas sin requerir micro-gestión.
  2. **Iniciativas Obligatorias Autónomas:**
     - Optimización constante de copys y asuntos de correo para maximizar apertura (>45%).
     - Detección de cuellos de botella de conversión en el checkout de $19 USD y planes Pro.
     - Generación proactiva de contenidos virales, carruseles y secuencias de re-engagement.
     - Entrega de soluciones ejecutadas y listas, no solo planes teóricos.

## 9. Regla Inmutable de Alimentación Diaria Omnicanal Automática (LinkedIn, Instagram, TikTok a las 8:00 AM)
- **ALIMENTACIÓN DIARIA OBLIGATORIA A LAS 8:00 AM (0 14 * * *)**:
  1. **LinkedIn (`AuditFlow AI` / `linkedin.com/company/auditflow-ai`)**: Agente LinkedIn despacha carruseles 4:3 PDF y posts de autoridad jurídica orientados a General Counsels y Socios Directores (CTA: Comentar "AUDITORIA").
  2. **Instagram (`@auditflowai` / `instagram.com/auditflowai`)**: Agente Instagram despacha Reels 9:16 y carruseles visuales estilo Cyber-Tech con hooks de <3s y enlace a biografía.
  3. **TikTok (`@auditflowai` / `tiktok.com/@auditflowai`)**: Agente TikTok despacha guiones hablados rápidos (30-40s) sobre hacks de cláusulas leoninas ($14k USD) con llamado a audiflowai.com.
  4. Los 3 canales se alimentan autónomamente con inteligencia de tendencias de compliance y normativas 2026 todos los días sin intervención manual.

## 10. Regla Inmutable de Campañas y Prospección para Países Nórdicos (Suecia, Noruega, Dinamarca, Finlandia)
- **MANDATO ESTRICTO PARA MERCADOS NÓRDICOS (SWE, NOR, DNK, FIN / .se, .no, .dk, .fi)**:
  Cada vez que se ejecute una campaña, prospección, contenido o interacción dirigida a los países nórdicos, es **OBLIGATORIO Y ESTRICTO** utilizar la arquitectura especializada nórdica:
  1. **Enfoque Fiduciario GDPR Artículo 28 & Cero Retención en RAM (Datainspektionen/Tietosuoja)**: En la primera línea destacar que la auditoría opera 100% en memoria volátil sin almacenamiento en disco ni entrenamiento de modelos con sus datos.
  2. **Tono Sobrio y Factual (Cultura *Lagom* / Cero Hard-Sell)**: Sin emojis exagerados, sin falsas urgencias ni descuentos agresivos. Enfoque en eficiencia, ROI medible y benchmarks empíricos.
  3. **Benchmark B2B Nórdico (*Nordic Commercial Standards*)**: Comparativa de topes de responsabilidad (12 meses de facturación) e indexación IPC nórdica.
  4. **Entrega de Redline Word (.docx con Control de Cambios) y Auto-Servicio Gratuito de Entrada**: Acceso sin fricción en `https://audiflowai.com/?ref=nordic&country=se`.

## 11. Regla Inmutable de Inteligencia Competitiva Forense para Futuras Apps Web (Competitor Gap Analysis)
- **MANDATO OBLIGATORIO PARA TODA APLICACIÓN WEB / SAAS NUEVA O EXISTENTE**:
  Antes y durante la construcción de cualquier nueva web app, micro-SaaS o producto digital en este ecosistema, los agentes de ingeniería y marketing deben ejecutar obligatoriamente:
  1. **Diagnóstico Sistemático de Competidores Líderes:** Investigar exhaustivamente en la web a los 3 a 5 líderes mundiales de la categoría e identificar: *¿Qué hacen ellos para vender y convertir que nosotros aún no hacemos?*
  2. **Ingeniería Inversa de Features de Fricción Cero:**
     - Scorecards / Velocímetros interactivos de diagnóstico previo al pago.
     - Benchmarking comparativo de mercado (*Give-to-Get*).
     - Entregables directos en el flujo de trabajo natural del usuario (ej: Word `.docx` con control de cambios, hojas de cálculo o extensiones).
     - Copilotos conversacionales contextuales 2-Way.
     - Arquitecturas de privacidad certificada (*Zero Data Retention* en memoria RAM volátil).
  3. **Adaptación Cultural y Normativa por País:** Cada producto debe contar con segmentación nativa para Latam (cercanía y retorno en cash), Norteamérica/Global (velocidad y estándares US GAAP/PCAOB), Europa francófona/DACH (precisión y DSGVO/RGPD) y Países Nórdicos (estándar *Lagom*, sobriedad y GDPR Art. 28).




