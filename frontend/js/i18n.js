// ==============================================================================
// AUDITFLOW AI - I18N BILINGUAL TRANSLATION SYSTEM (ENGLISH / SPANISH)
// INCLUYE ELEMENTOS SEO, FAQ SCHEMA Y ESTRATEGIA DE MARKETING DIGITAL B2B
// ==============================================================================

window.I18n = {
    currentLang: (typeof localStorage !== 'undefined' ? localStorage.getItem('auditflow_lang') : null) || 'es',

    translations: {
        es: {
            // Header
            nav_privacy_badge: "Memoria Volátil Activa (0 Disco)",
            nav_firewall_badge: "🔒 Firewall & WAF Activo (AES-256)",
            nav_speed_badge: "Auditoría <10s",
            nav_corp_plan: "Plan Corporativo B2B",
            nav_pricing: "Precios",
            
            // Actions Toolbar
            btn_back_home: "← Regresar al Inicio / Auditar Otro",
            btn_back_enterprise: "Regresar al Panel Principal",
            btn_print_report: "🖨️ Imprimir / Guardar en PDF",
            btn_ai_support: "🤖 Soporte IA 24/7 (Corregir con IA)",

            // AI Support Modal
            support_title: "Agente de Soporte Autónomo IA",
            support_sub: "¿Encontraste algún detalle o deseas que la IA re-analice una cláusula específica de tu documento? Escribe tu observación y el Agente de IA corregirá el reporte en < 10s.",
            support_label: "Describe tu observación o consulta",
            support_placeholder: "Ej. Por favor re-evalúa la cláusula 7.3 sobre la multa de cancelación...",
            support_btn_submit: "🤖 Re-Analizar y Corregir con IA",
            
            // Hero
            hero_free_badge: "🎁 Escaneo Inicial 100% Gratuito • Sin tarjeta para analizar",
            hero_engine_badge: "⚡ Motor Gemini 2.5 Flash • Procesamiento ultra-rápido",
            hero_title_1: "Detecta Fugas de Dinero y Cláusulas Abusivas en ",
            hero_title_2: "<10 Segundos",
            hero_sub: "La plataforma de auditoría de contratos y facturas con IA para Directores Financieros y PyMEs. Evita penalizaciones y sobrecostos antes de firmar o pagar. Escaneo de prueba 100% Gratis en memoria volátil.",
            hero_privacy_guarantee: "<strong>Privacidad Total Garantizada:</strong> Tu documento se destruye automáticamente de la memoria RAM efímera tras la auditoría (0 Almacenamiento en Disco).",
            
            // Live Stats Ticker (Confianza Social)
            stat_audits: "Contratos Auditados",
            stat_leakage: "Fugas Detectadas",
            stat_retention: "Archivos en Disco",
            stat_encryption: "Cifrado Volátil",

            // Financial ROI Calculator
            roi_title: "🧮 Calculadora Interactiva de Fugas Financieras B2B",
            roi_badge: "Herramienta de Diagnóstico",
            roi_question: "¿Cuántos contratos o facturas procesas al mes?",
            roi_min_doc: "1 doc/mes",
            roi_max_doc: "50 docs/mes",
            roi_loss_label: "Riesgo / Fuga Anual Estimada sin IA:",
            roi_savings_label: "Ahorro Neto Estimado con AuditFlow AI:",

            // Dropzone & Sample Demo Button
            drag_title: "Arrastra tu archivo aquí o ",
            drag_browse: "explora tus archivos",
            drag_sub_free: "Análisis inicial 100% Gratis • Revisa los hallazgos antes de pagar $19",
            drag_formats: "Soporta PDF, PNG, JPG o WebP (Hasta 15MB)",
            btn_sample_demo: "⚡ Probar con Contrato de Ejemplo (Sin subir archivo)",
            file_ready_ram: "MB • Memoria RAM lista",
            btn_start_scan: "Iniciar Auditoría Gratuita IA",

            // Trust Micro-Copys & Compliance Badges
            trust_title_1: "🔒 Procesamiento efímero:",
            trust_sub_1: "Tu documento se analiza exclusivamente en memoria RAM (volátil) y se destruye en < 5 segundos.",
            trust_title_2: "🛡️ Privacidad estricta:",
            trust_sub_2: "Cero almacenamiento en disco. Cifrado de grado bancario AES-256 en tránsito.",
            badge_soc2: "Conforme a SOC-2 & GDPR",
            badge_iso: "Norma ISO 27001 en RAM",
            badge_stripe: "Comerciante Verificado Stripe",
            badge_guarantee: "Garantía de Satisfacción 100%",

            // Step-by-Step Security Pipeline
            how_title: "🔒 ¿Cómo garantizamos la seguridad de tu información?",
            step_1_title: "1. Buffer RAM Volátil",
            step_1_desc: "El documento entra directamente a memoria RAM sin pasar por discos físicos ni servidores de almacenamiento.",
            step_2_title: "2. Purga Inmediata",
            step_2_desc: "Gemini 2.5 Flash analiza el texto y el buffer de memoria se destruye automáticamente en < 5 segundos.",
            step_3_title: "3. Vista Previa Gratis",
            step_3_desc: "Ves el diagnóstico en pantalla de forma gratuita. Decides pagar $19 solo si deseas descargar las soluciones en Word + PDF.",

            // FAQ SEO Section (Preguntas Frecuentes de Alta Búsqueda)
            faq_title: "❓ Preguntas Frecuentes (SEO & Seguridad B2B)",
            faq_q1: "¿Cómo auditar un contrato o factura con Inteligencia Artificial?",
            faq_a1: "Solo debes arrastrar tu documento PDF o imagen. El motor Gemini 2.5 Flash escanea el texto en <10 segundos, detecta sobrecargos, penalizaciones ocultas y te muestra un resumen de hallazgos gratis en pantalla.",
            faq_q2: "¿Mis contratos o documentos se guardan en algún servidor?",
            faq_a2: "No. AuditFlow AI opera con una arquitectura de memoria RAM volátil estricta (0 Disk Retention). El archivo se analiza en memoria y se destruye en menos de 5 segundos.",
            faq_q3: "¿Qué incluye el Reporte Ejecutivo por $19.00 USD / Satoshis?",
            faq_a3: "La vista previa es 100% gratuita. Al abonar $19.00 USD (vía Stripe o Bitcoin Lightning), desbloqueas las 3 soluciones tácticas de renegociación, exportación de Redlines a Word .docx editable con control de cambios y el informe PDF oficial firmado.",
            faq_q4: "¿Tienen plan corporativo para auditorías ilimitadas?",
            faq_a4: "Sí. Para empresas y despachos legales ofrecemos la suscripción Mensual ($69/mes) o Anual ($590/año con ~3.5 meses gratis) con auditorías ilimitadas, Cross-Audit 2-Way y soporte prioritario.",

            // Scanner Section
            scan_init: "Iniciando escáner en memoria volátil...",
            scan_sub: "Analizando cláusulas financieras con Gemini 2.5 Flash",
            step_ram: "RAM Buffer",
            step_gemini: "Gemini AI",
            step_scoring: "Lead Scoring",
            step_ready: "Reporte Listo",

            // Lead Capture Modal
            lead_modal_title: "Auditoría Completada (Resumen Gratuito)",
            lead_modal_sub: "Se han detectado fugas financieras en tu documento. Ingresa tu nombre y correo para ver la vista previa de hallazgos.",
            lead_label_name: "Nombre Completo",
            lead_placeholder_name: "Ej. Carlos Mendoza",
            lead_label_email: "Correo Electrónico Corporativo",
            lead_placeholder_email: "carlos@empresa.com",
            lead_btn_submit: "Ver Vista Previa Gratuita",

            // OCR Pre-flight Error Box
            ocr_error_title: "⚠️ Documento No Apto para Auditoría",
            ocr_error_sub: "El documento seleccionado no contiene texto legible o es una imagen extremadamente borrosa. Gemini 2.5 exige un mínimo de 50 palabras legibles para calcular fugas financieras.",
            ocr_error_btn: "Intentar con Otro Archivo Legible",

            // Report Header & Metrics
            rep_doc_default: "Contrato Comercial",
            rep_risk_high: "RIESGO ALTO",
            rep_leakage_label: "Fuga Financiera Total",
            rep_lead_score_label: "Lead Score",
            rep_findings_title: "3 Fallas Financieras & Cláusulas de Riesgo Detectadas",
            rep_teaser_label: "🔍 Resumen de la Anomalía (Gratis):",
            rep_solution_label: "💡 Solución Táctica & Texto Sustitutivo de Renegociación:",
            rep_unlock_btn: "🔒 Desbloquear Solución Táctica ($19 USD)",

            // Unlock Banner & Payment Modal
            banner_title: "Desbloquea las 3 Soluciones Tácticas + Word DOCX + PDF",
            banner_sub: "Ya viste los hallazgos en pantalla. Obtén el texto exacto para renegociar contratos, objeción de cargos indebidos, Word .docx editable y el PDF firmado por solo $19.00 USD o Satoshis.",
            btn_unlock_report: "🔓 Desbloquear Reporte Ejecutivo + Word + PDF ($19 USD)",
            modal_pay_title: "Desbloquear Auditoría Completa",
            modal_pay_sub: "Pago único de $19.00 USD para descargar las soluciones tácticas, Word editable y el reporte oficial firmado.",
            tab_stripe: "💳 Stripe ($19.00 USD)",
            tab_lightning: "⚡ Lightning (Satoshis)",
            btn_pay_stripe: "Pagar con Tarjeta ($19 USD)",
            btn_copy_ln: "Copiar Factura BOLT11",

            // Features & Footer
            feat_1_tag: "01. Privacidad Total",
            feat_1_title: "Cero Guardado en Disco",
            feat_1_desc: "El documento se convierte a memoria RAM volátil, se audita por Gemini y se destruye inmediatamente.",
            feat_2_tag: "02. Detección Táctica",
            feat_2_title: "3 Fallas Críticas",
            feat_2_desc: "Detecta penalizaciones ocultas, indexaciones dobles y sobrecargos en minutos de lectura.",
            feat_3_tag: "03. Pagos Híbridos",
            feat_3_title: "$19 USD o Satoshis",
            feat_3_desc: "Mira los hallazgos gratis. Paga $19 sólo para descargar las soluciones en Word .docx + PDF.",

            // Pricing Grid Section (ES)
            pricing_badge_clear: "Precios Claros",
            pricing_section_title: "💰 Planes y Tarifas Transparentes B2B",
            pricing_section_sub: "Sin costos ocultos ni letras pequeñas. Prueba gratis y escala según el volumen de tu empresa.",
            
            pricing_card1_tag: "GRATUITO",
            pricing_card1_title: "Escaneo Inicial",
            pricing_card1_price: "$0",
            pricing_card1_period: "Siempre Gratis",
            pricing_card1_desc: "Ideal para conocer el estado de tu contrato o factura antes de tomar decisiones.",
            pricing_card1_f1: "✓ Vista previa de 3 anomalías financieras",
            pricing_card1_f2: "✓ Cálculo de fuga económica estimada",
            pricing_card1_f3: "✓ Procesamiento en RAM volátil (< 5s)",
            pricing_card1_f4: "✓ 0 Almacenamiento en disco",
            pricing_card1_btn: "⚡ Iniciar Escaneo Gratis",

            pricing_card2_top_badge: "MÁS POPULAR • RECOMENDADO",
            pricing_card2_tag: "POPULAR • PAGO ÚNICO",
            pricing_card2_title: "Reporte Ejecutivo",
            pricing_card2_price: "$19",
            pricing_card2_period: "USD / por auditoría",
            pricing_card2_desc: "Auditoría exhaustiva completa con documentos editables para tu equipo legal.",
            pricing_card2_f1: "✓ Desbloqueo de las 3 Soluciones Tácticas",
            pricing_card2_f2: "✓ Redlines en Word .docx con Control de Cambios",
            pricing_card2_f3: "✓ Informe Oficial PDF Firmado Digitalmente",
            pricing_card2_f4: "✓ Pago único sin suscripciones recurrentes",
            pricing_card2_btn: "🔓 Auditar 1 Documento ($19 USD)",

            pricing_card3_tag: "EMPRESAS • ILIMITADO",
            pricing_card3_title: "Plan Corporativo",
            pricing_card3_price: "$69",
            pricing_card3_period: "USD / mes o $590/año",
            pricing_card3_desc: "Para despachos legales, constructoras y empresas con alto volumen de contratos.",
            pricing_card3_f1: "✓ Auditorías Ilimitadas 24/7 multi-usuario",
            pricing_card3_f2: "✓ Cross-Audit 2-Way (Contrato vs Factura)",
            pricing_card3_f3: "✓ Asistente Copiloto IA de Documentos",
            pricing_card3_f4: "✓ Soporte prioritario & cuota compartida",
            pricing_card3_btn: "🚀 Ver Planes ($69/mes o $590/año)",

            // Actions Toolbar
            btn_chat_contract: "💬 Chatear con la IA sobre este Contrato",
            btn_download_docx: "📄 Descargar Word (.docx) Redlines",
            btn_download_ics: "📅 Recordatorios Calendario (.ics)",

            // Success Purchase Banner
            success_banner_title: "¡Compra Procesada &amp; Reporte Desbloqueado!",
            success_banner_sub: "Has obtenido acceso completo a las 3 Soluciones Tácticas. Se ha enviado una copia firmada en PDF a tu correo.",
            success_btn_home: "🏠 Regresar al Inicio / Auditar Nuevo Documento",

            // Upsell Banner
            upsell_title: "🛡️ Blindaje Financiero Continuo: Auditorías Ilimitadas para tu Empresa",
            upsell_sub: "Actualiza a la suscripción Mensual ($69/mes) o Anual ($590/año). Auditorías ilimitadas, equipo multi-usuario, Cross-Audit 2-Way y soporte prioritario.",
            upsell_btn: "Ver Planes Corporativos ($69/mes o $590/año)",
            roi_calculator_chip: "<strong>Calculadora de ROI:</strong> 10 auditorías/mes ahorran ~$1,850 USD en honorarios legales. ¡Tu ROI es del <strong>2,680%</strong> por $69/mes!",

            // Enterprise Modal
            ent_modal_title: "Plan Corporativo B2B",
            ent_modal_sub: "Auditorías Ilimitadas 24/7 • Soporte Prioritario por IA",
            ent_tab_monthly: "💳 Mensual",
            ent_tab_annual_badge: "AHORRA $238 USD",
            ent_tab_annual: "⭐ Anual (~3.5 Meses Gratis)",
            ent_label_email: "Correo Electrónico Corporativo",
            ent_label_company: "Nombre de la Empresa / Abogado",
            ent_pay_card: "💳 Tarjeta ($ USD)",
            ent_pay_ln: "⚡ Lightning (Strike Sats)",
            ent_label_card_num: "Número de Tarjeta de Crédito / Débito",
            ent_label_expiry: "Expiración (MM/YY)",
            ent_label_cvc: "Código CVC",
            ent_ln_title: "⚡ Pago Lightning (Strike)",
            ent_ln_node_label: "Nodo Destino Strike El Salvador:",
            ent_plan_monthly_name: "Plan Mensual",
            ent_plan_monthly_price: "$69.00 USD / mes",
            ent_plan_annual_name: "Plan Anual (~3.5 Meses Gratis)",
            ent_plan_annual_price: "$590.00 USD / año",
            ent_plan_desc: "Incluye acceso ilimitado para todo tu equipo, Cross-Audit 2-Way, purga automática de RAM y reportes Word + PDF sin marcas de agua.",
            ent_btn_submit_monthly: "🚀 Activar Suscripción por $69/mes",
            ent_btn_submit_annual: "🚀 Activar Suscripción Anual por $590/año",

            // Sample PDF Modal
            sample_pdf_badge: "DOCUMENTO OFICIAL MODELO",
            sample_pdf_ram: "MEMORIA VOLÁTIL RAM (0 DISCO) • SELLO DE AUDITORÍA OFICIAL",
            sample_pdf_doc_label: "Documento Auditado",
            sample_pdf_risk_label: "Nivel de Riesgo",
            sample_pdf_leakage_label: "Fuga Financiera Detectada",
            sample_pdf_solutions_title: "Desglose de Soluciones Tácticas de Renegociación:",
            sample_pdf_seal: "Firma Digital &amp; Sello de Validación por IA Gemini 2.5 Flash",
            sample_pdf_btn_unlock: "🔓 Desbloquear Mi Reporte Oficial ($19 USD)",

            // Interactive Copilot Chat Modal
            chat_copilot_title: "Copiloto IA — Consulta sobre Documento",
            chat_copilot_ram_badge: "Gemini 2.5 Flash • Memoria RAM Volátil",
            chat_copilot_welcome: "👋 Hola. Soy tu Copiloto Legal y Financiero. Puedes hacerme cualquier pregunta sobre este documento (cláusulas, penalizaciones, sugerencias de objeción o plazos).",
            chat_chip_penalty: "❓ Multa cancelación",
            chat_chip_surcharges: "❓ Sobrecargos ocultos",
            chat_chip_letter: "❓ Carta de objeción",
            chat_btn_send: "Enviar",
            chat_placeholder: "Escribe tu pregunta sobre el contrato o factura...",

            // Footer Links
            footer_privacy: "Privacidad &amp; SOC2",
            footer_terms: "Términos B2B",
            footer_admin: "Admin Panel",

            // Social Proof Toast
            social_proof_title_default: "Nueva Auditoría Realizada",
            social_proof_time_default: "Hace 2 minutos • Memoria Volátil RAM",

            footer_rights: "© 2026 AuditFlow AI. Infraestructura Micro-SaaS B2B Operando 24/7.",
            footer_privacy_link: "Garantía Memoria Volátil",
            footer_report_issue: "Reportar Fallo de Configuración",
            
            // Configuration Issue Modal (ES)
            issue_modal_title: "Reportar Fallo de Configuración",
            issue_modal_sub: "Auto-Diagnóstico Autónomo Asistido por IA",
            issue_email_label: "Tu Correo Electrónico",
            issue_type_label: "Tipo de Incidencia o Fallo",
            issue_opt_1: "Falla de Carga de Archivo / OCR Ilegible",
            issue_opt_2: "Inconsistencia en Pasarela de Pago (Stripe/Lightning)",
            issue_opt_3: "Error de Renderizado de Reporte o Soluciones",
            issue_opt_4: "Fallo de Configuración General",
            issue_desc_label: "Descripción del Fallo (Opcional)",
            issue_ai_heading: "🤖 Diagnóstico IA en Tiempo Real:",
            issue_btn_submit: "🛠️ Enviar Reporte &amp; Diagnosticar con IA",
            ent_multi_lawyer_text: "Cuota Anual Multiusuario: Puede ser compartida entre varios abogados de tu firma o despacho legal.",
            legal_disclaimer: "<strong>Aviso Legal &amp; Deslinde de Responsabilidad:</strong> AuditFlow AI es una herramienta de análisis automatizado asistido por Inteligencia Artificial. Los reportes y sugerencias tácticas no constituyen asesoría legal o financiera profesional vinculante. El desarrollador y la plataforma quedan completamente eximidos de toda responsabilidad derivada del uso o interpretación de la información procesada."
        },
        en: {
            // Header
            nav_privacy_badge: "Volatile RAM Memory Active (0 Disk)",
            nav_firewall_badge: "🔒 Firewall & WAF Active (AES-256)",
            nav_speed_badge: "Audit <10s",
            nav_corp_plan: "B2B Enterprise Plan",
            nav_pricing: "Pricing",
            
            // Actions Toolbar
            btn_back_home: "← Back to Home / Audit Another",
            btn_back_enterprise: "Return to Main Dashboard",
            btn_print_report: "🖨️ Print / Save as PDF",
            btn_ai_support: "🤖 24/7 AI Support (Self-Fix with AI)",

            // AI Support Modal
            support_title: "Autonomous AI Support Agent",
            support_sub: "Found an issue or want the AI to re-analyze a specific clause? Type your note and the AI Agent will fix your report in < 10s.",
            support_label: "Describe your issue or request",
            support_placeholder: "e.g. Please re-evaluate clause 7.3 regarding the termination penalty...",
            support_btn_submit: "🤖 Re-Analyze & Fix with AI",
            
            // Hero
            hero_free_badge: "🎁 100% Free Initial Scan • No card required to analyze",
            hero_engine_badge: "⚡ Gemini 2.5 Flash Engine • Ultra-fast processing",
            hero_title_1: "Detect Financial Leakages & Abusive Clauses in ",
            hero_title_2: "<10 Seconds",
            hero_sub: "AI-powered contract & invoice audit infrastructure for CFOs, Controllers, and SMBs. Prevent overcharges and toxic clauses before signing or paying. 100% Free initial scan in volatile RAM.",
            hero_privacy_guarantee: "<strong>Total Privacy Guaranteed:</strong> Your document is automatically purged from volatile RAM memory immediately after auditing (0 Disk Storage).",
            
            // Live Stats Ticker
            stat_audits: "Audited Contracts",
            stat_leakage: "Leakage Detected",
            stat_retention: "Files on Disk",
            stat_encryption: "RAM Encryption",

            // Financial ROI Calculator
            roi_title: "🧮 B2B Financial Leakage Calculator",
            roi_badge: "Diagnostic Tool",
            roi_question: "How many contracts or invoices do you process per month?",
            roi_min_doc: "1 doc/mo",
            roi_max_doc: "50 docs/mo",
            roi_loss_label: "Estimated Annual Financial Leakage without AI:",
            roi_savings_label: "Estimated Net Savings with AuditFlow AI:",

            // Dropzone & Sample Demo Button
            drag_title: "Drag & drop your file here or ",
            drag_browse: "browse your files",
            drag_sub_free: "100% Free initial analysis • Review findings before paying $19",
            drag_formats: "Supports PDF, PNG, JPG or WebP (Up to 15MB)",
            btn_sample_demo: "⚡ Try Sample Contract Demo (No file upload needed)",
            file_ready_ram: "MB • RAM memory ready",
            btn_start_scan: "Start Free AI Audit",

            // Trust Micro-Copys & Compliance Badges
            trust_title_1: "🔒 Ephemeral Processing:",
            trust_sub_1: "Your document is analyzed exclusively in volatile RAM and destroyed in < 5 seconds.",
            trust_title_2: "🛡️ Strict Privacy:",
            trust_sub_2: "Zero disk storage. Bank-grade AES-256 in-transit encryption.",
            badge_soc2: "SOC-2 & GDPR Compliant",
            badge_iso: "ISO 27001 RAM Standard",
            badge_stripe: "Stripe Verified Merchant",
            badge_guarantee: "100% Satisfaction Guarantee",

            // Step-by-Step Security Pipeline
            how_title: "🔒 How do we guarantee the security of your information?",
            step_1_title: "1. Volatile RAM Buffer",
            step_1_desc: "The document enters volatile RAM directly without passing through physical disks or cloud storage.",
            step_2_title: "2. Immediate Purge",
            step_2_desc: "Gemini 2.5 Flash analyzes text and the memory buffer is destroyed in < 5 seconds.",
            step_3_title: "3. Free Preview",
            step_3_desc: "You view the diagnosis on screen for free. Pay $19 only if you wish to download Word + PDF solutions.",

            // FAQ SEO Section
            faq_title: "❓ Frequently Asked Questions (B2B Security & SEO)",
            faq_q1: "How to audit a contract or invoice with Artificial Intelligence?",
            faq_a1: "Just drag & drop your PDF or image. Gemini 2.5 Flash scans text in <10s, detects overcharges and hidden penalties, showing a free summary on screen.",
            faq_q2: "Are my contracts or documents saved on any server?",
            faq_a2: "No. AuditFlow AI operates with strict volatile RAM architecture (0 Disk Retention). Files are analyzed in memory and destroyed in under 5 seconds.",
            faq_q3: "What is included in the $19.00 USD / Satoshis Executive Report?",
            faq_a3: "The preview is 100% free. By paying $19.00 USD (via Stripe or Bitcoin Lightning), you unlock 3 tactical renegotiation solutions, editable Word .docx Redlines with Track Changes, and the signed official PDF report.",
            faq_q4: "Do you have an enterprise plan for unlimited audits?",
            faq_a4: "Yes. For companies and legal firms, we offer Enterprise Subscriptions for $69/mo or $590/yr (~3.5 months free) with unlimited audits, 2-Way Cross-Audit, and priority support.",

            // Scanner Section
            scan_init: "Initializing scanner in volatile memory...",
            scan_sub: "Analyzing financial clauses with Gemini 2.5 Flash",
            step_ram: "RAM Buffer",
            step_gemini: "Gemini AI",
            step_scoring: "Lead Scoring",
            step_ready: "Report Ready",

            // Lead Capture Modal
            lead_modal_title: "Audit Completed (Free Summary)",
            lead_modal_sub: "Financial leakage has been detected in your document. Enter your name and email to view the findings preview.",
            lead_label_name: "Full Name",
            lead_placeholder_name: "e.g. John Doe",
            lead_label_email: "Corporate Email Address",
            lead_placeholder_email: "john@company.com",
            lead_btn_submit: "View Free Preview",

            // OCR Pre-flight Error Box
            ocr_error_title: "⚠️ Document Unsuitable for Auditing",
            ocr_error_sub: "The selected document lacks readable text or is an extremely blurry image. Gemini 2.5 requires at least 50 readable words to calculate financial leakage.",
            ocr_error_btn: "Try Another Readable File",

            // Report Header & Metrics
            rep_doc_default: "Commercial Agreement",
            rep_risk_high: "HIGH RISK",
            rep_leakage_label: "Total Financial Leakage",
            rep_lead_score_label: "Lead Score",
            rep_findings_title: "3 Financial Flaws & Risk Clauses Detected",
            rep_teaser_label: "🔍 Flaw Summary (Free Preview):",
            rep_solution_label: "💡 Tactical Solution & Replacement Renegotiation Clause:",
            rep_unlock_btn: "🔒 Unlock Tactical Solution ($19 USD)",

            // Unlock Banner & Payment Modal
            banner_title: "Unlock 3 Tactical Solutions + Word DOCX + PDF Report",
            banner_sub: "You already saw findings on screen. Get exact text to renegotiate contracts, contest invalid charges, editable Word .docx, and download signed PDF for $19.00 USD or Satoshis.",
            btn_unlock_report: "🔓 Unlock Executive Report + Word + PDF ($19 USD)",
            modal_pay_title: "Unlock Full Audit",
            modal_pay_sub: "One-time $19.00 USD payment to download tactical solutions, editable Word DOCX, and signed official report.",
            tab_stripe: "💳 Stripe ($19.00 USD)",
            tab_lightning: "⚡ Lightning (Satoshis)",
            btn_pay_stripe: "Pay with Card ($19 USD)",
            btn_copy_ln: "Copy BOLT11 Invoice",

            // Features & Footer & Issue Modal (EN)
            feat_1_tag: "01. Total Privacy",
            feat_1_title: "Zero Disk Storage",
            feat_1_desc: "Documents convert to volatile RAM, audited by Gemini, and destroyed immediately.",
            feat_2_tag: "02. Tactical Detection",
            feat_2_title: "3 Critical Flaws",
            feat_2_desc: "Detect hidden penalties, double indexation, and overcharges in minutes.",
            feat_3_tag: "03. Hybrid Payments",
            feat_3_title: "$19 USD or Satoshis",
            feat_3_desc: "See findings free. Pay $19 only to unlock renegotiation Word .docx + PDF.",

            // Pricing Grid Section (EN)
            pricing_badge_clear: "Transparent Pricing",
            pricing_section_title: "💰 Transparent B2B Pricing & Plans",
            pricing_section_sub: "No hidden fees, no fine print. Test for free and scale according to your enterprise document volume.",
            
            pricing_card1_tag: "FREE",
            pricing_card1_title: "Initial Scan",
            pricing_card1_price: "$0",
            pricing_card1_period: "Always Free",
            pricing_card1_desc: "Perfect to check your contract or invoice health before signing or paying.",
            pricing_card1_f1: "✓ Live preview of 3 financial anomalies",
            pricing_card1_f2: "✓ Estimated financial leakage calculation",
            pricing_card1_f3: "✓ Volatile RAM processing (< 5s)",
            pricing_card1_f4: "✓ 0 Disk retention guarantee",
            pricing_card1_btn: "⚡ Start Free Scan",

            pricing_card2_top_badge: "MOST POPULAR • RECOMMENDED",
            pricing_card2_tag: "POPULAR • ONE-TIME",
            pricing_card2_title: "Executive Report",
            pricing_card2_price: "$19",
            pricing_card2_period: "USD / per audit",
            pricing_card2_desc: "Complete in-depth audit with editable files for your legal and finance teams.",
            pricing_card2_f1: "✓ Full unlock of 3 Tactical Solutions",
            pricing_card2_f2: "✓ Editable Word .docx Redlines with Track Changes",
            pricing_card2_f3: "✓ Official Digitally Signed PDF Report",
            pricing_card2_f4: "✓ One-time payment with no recurring lock-in",
            pricing_card2_btn: "🔓 Audit 1 Document ($19 USD)",

            pricing_card3_tag: "ENTERPRISE • UNLIMITED",
            pricing_card3_title: "Enterprise Plan",
            pricing_card3_price: "$69",
            pricing_card3_period: "USD / mo or $590/yr",
            pricing_card3_desc: "For legal practices, enterprises, and teams managing high monthly contract flow.",
            pricing_card3_f1: "✓ Unlimited 24/7 Multi-User Audits",
            pricing_card3_f2: "✓ 2-Way Cross-Audit (Contract vs Invoice)",
            pricing_card3_f3: "✓ Real-Time AI Document Copilot Chat",
            pricing_card3_f4: "✓ Priority 24/7 support & shared lawyer seat",
            pricing_card3_btn: "🚀 View Enterprise Plans ($69/mo)",

            // Actions Toolbar
            btn_chat_contract: "💬 Chat with AI about this Contract",
            btn_download_docx: "📄 Download Word (.docx) Redlines",
            btn_download_ics: "📅 Calendar Reminders (.ics)",

            // Success Purchase Banner
            success_banner_title: "Purchase Processed &amp; Report Unlocked!",
            success_banner_sub: "You have gained full access to the 3 Tactical Solutions. A signed PDF copy has been sent to your email.",
            success_btn_home: "🏠 Back to Home / Audit New Document",

            // Upsell Banner
            upsell_title: "🛡️ Continuous Financial Shield: Unlimited Audits for Your Enterprise",
            upsell_sub: "Upgrade to Monthly ($69/mo) or Annual ($590/yr) subscription. Unlimited audits, multi-user team, 2-Way Cross-Audit and priority support.",
            upsell_btn: "View Enterprise Plans ($69/mo or $590/yr)",
            roi_calculator_chip: "<strong>ROI Calculator:</strong> 10 audits/month save ~$1,850 USD in legal fees. Your ROI is <strong>2,680%</strong> at $69/month!",

            // Enterprise Modal
            ent_modal_title: "B2B Enterprise Plan",
            ent_modal_sub: "Unlimited Audits 24/7 • Priority AI Legal Support",
            ent_tab_monthly: "💳 Monthly",
            ent_tab_annual_badge: "SAVE $238 USD",
            ent_tab_annual: "⭐ Annual (~3.5 Months Free)",
            ent_label_email: "Corporate Email Address",
            ent_label_company: "Company / Law Firm Name",
            ent_pay_card: "💳 Card ($ USD)",
            ent_pay_ln: "⚡ Lightning (Strike Sats)",
            ent_label_card_num: "Credit / Debit Card Number",
            ent_label_expiry: "Expiration (MM/YY)",
            ent_label_cvc: "CVC Security Code",
            ent_ln_title: "⚡ Lightning Payment (Strike)",
            ent_ln_node_label: "Strike Destination Node (El Salvador):",
            ent_plan_monthly_name: "Monthly Plan",
            ent_plan_monthly_price: "$69.00 USD / mo",
            ent_plan_annual_name: "Annual Plan (~3.5 Months Free)",
            ent_plan_annual_price: "$590.00 USD / yr",
            ent_plan_desc: "Includes unlimited access for your entire team, 2-Way Cross-Audit, automatic RAM memory purge, and watermark-free Word + PDF reports.",
            ent_btn_submit_monthly: "🚀 Activate Subscription for $69/mo",
            ent_btn_submit_annual: "🚀 Activate Annual Subscription for $590/yr",

            // Sample PDF Modal
            sample_pdf_badge: "OFFICIAL MODEL DOCUMENT",
            sample_pdf_ram: "VOLATILE RAM MEMORY (0 DISK) • OFFICIAL AUDIT SEAL",
            sample_pdf_doc_label: "Audited Document",
            sample_pdf_risk_label: "Risk Level",
            sample_pdf_leakage_label: "Detected Financial Leakage",
            sample_pdf_solutions_title: "Breakdown of Renegotiation Tactical Solutions:",
            sample_pdf_seal: "Digital Signature &amp; Validation Seal by Gemini 2.5 Flash AI",
            sample_pdf_btn_unlock: "🔓 Unlock My Official Report ($19 USD)",

            // Interactive Copilot Chat Modal
            chat_copilot_title: "AI Copilot — Document Consultation",
            chat_copilot_ram_badge: "Gemini 2.5 Flash • Volatile RAM Memory",
            chat_copilot_welcome: "👋 Hello. I am your Legal and Financial Copilot. Ask me any question about this document (clauses, penalties, objection drafts, or deadlines).",
            chat_chip_penalty: "❓ Termination penalty",
            chat_chip_surcharges: "❓ Hidden surcharges",
            chat_chip_letter: "❓ Objection letter",
            chat_btn_send: "Send",
            chat_placeholder: "Type your question about the contract or invoice...",

            // Footer Links
            footer_privacy: "Privacy &amp; SOC2",
            footer_terms: "B2B Terms",
            footer_admin: "Admin Panel",

            // Social Proof Toast
            social_proof_title_default: "New Audit Performed",
            social_proof_time_default: "2 minutes ago • Volatile RAM Memory",

            footer_rights: "© 2026 AuditFlow AI. 24/7 B2B Micro-SaaS Infrastructure.",
            footer_privacy_link: "Volatile Memory Guarantee",
            footer_report_issue: "Report Configuration Issue",

            // Configuration Issue Modal (EN)
            issue_modal_title: "Report Configuration Issue",
            issue_modal_sub: "Autonomous AI Self-Diagnosis",
            issue_email_label: "Your Email Address",
            issue_type_label: "Issue / Incident Type",
            issue_opt_1: "File Upload Failure / Unreadable OCR",
            issue_opt_2: "Payment Gateway Issue (Stripe/Lightning)",
            issue_opt_3: "Report or Solution Rendering Error",
            issue_opt_4: "General Configuration Issue",
            issue_desc_label: "Issue Description (Optional)",
            issue_ai_heading: "🤖 Real-Time AI Diagnosis:",
            issue_btn_submit: "🛠️ Submit Report &amp; Diagnose with AI",
            ent_multi_lawyer_text: "Multi-User Annual Quota: Can be shared among multiple attorneys in your firm or legal practice.",
            legal_disclaimer: "<strong>Legal Disclaimer &amp; Limitation of Liability:</strong> AuditFlow AI is an automated analysis tool powered by Artificial Intelligence. Reports and tactical suggestions do not constitute binding professional legal or financial advice. The app developer and platform are fully released from any liability arising from the use or interpretation of processed information."
        },
        de: {
            // Header (DE)
            nav_privacy_badge: "Flüchtiger RAM-Speicher aktiv (0 Festplatte)",
            nav_firewall_badge: "🔒 Firewall & WAF aktiv (AES-256)",
            nav_speed_badge: "Prüfung <10s",
            nav_corp_plan: "B2B Unternehmens-Plan",
            nav_pricing: "Preise",
            
            // Actions Toolbar (DE)
            btn_back_home: "← Zurück zur Startseite / Weiteres Dokument prüfen",
            btn_back_enterprise: "Zurück zur Hauptübersicht",
            btn_print_report: "🖨️ Drucken / Als PDF speichern",
            btn_ai_support: "🤖 24/7 KI-Support (Mit KI korrigieren)",

            // AI Support Modal (DE)
            support_title: "Autonomer KI-Support-Agent",
            support_sub: "Haben Sie ein Detail gefunden oder möchten Sie, dass die KI eine bestimmte Klausel erneut prüft? Schreiben Sie Ihren Hinweis, und der KI-Agent korrigiert den Bericht in < 10s.",
            support_label: "Beschreiben Sie Ihre Beobachtung oder Anfrage",
            support_placeholder: "z.B. Bitte überprüfen Sie Klausel 7.3 bezüglich der Kündigungsstrafe...",
            support_btn_submit: "🤖 Mit KI neu analysieren & korrigieren",
            
            // Hero (DE)
            hero_free_badge: "🎁 100% Kostenlose Erstprüfung • Keine Kreditkarte erforderlich",
            hero_engine_badge: "⚡ Gemini 2.5 Flash Engine • Ultraschnelle Verarbeitung",
            hero_title_1: "Finanzverluste & Risikoklauseln erkennen in ",
            hero_title_2: "<10 Sekunden",
            hero_sub: "Die KI-Vertragsprüfungsplattform für Finanzchefs, Controller und KMUs. Vermeiden Sie Überzahlungen und Knebelklauseln vor der Unterschrift. 100% kostenlose Erstprüfung im flüchtigen RAM.",
            hero_privacy_guarantee: "<strong>Garantierter Datenschutz:</strong> Ihr Dokument wird unmittelbar nach der Prüfung automatisch aus dem flüchtigen RAM-Speicher gelöscht (0 Festplattenspeicherung).",
            
            // Live Stats Ticker (DE)
            stat_audits: "Geprüfte Verträge",
            stat_leakage: "Verluste Entdeckt",
            stat_retention: "Dateien auf Festplatte",
            stat_encryption: "RAM-Verschlüsselung",

            // Financial ROI Calculator (DE)
            roi_title: "🧮 B2B-Finanzverlust-Rechner",
            roi_badge: "Diagnose-Tool",
            roi_question: "Wie viele Verträge oder Rechnungen bearbeiten Sie pro Monat?",
            roi_min_doc: "1 Dok/Monat",
            roi_max_doc: "50 Dok/Monat",
            roi_loss_label: "Geschätzter jährlicher Finanzverlust ohne KI:",
            roi_savings_label: "Geschätzte Netto-Ersparnis mit AuditFlow AI:",

            // Dropzone & Sample Demo Button (DE)
            drag_title: "Ziehen Sie Ihre Datei hierher oder ",
            drag_browse: "Dateien durchsuchen",
            drag_sub_free: "100% Kostenlose Erstprüfung • Ergebnisse vor Zahlung von 19 $ ansehen",
            drag_formats: "Unterstützt PDF, PNG, JPG oder WebP (Bis zu 15MB)",
            btn_sample_demo: "⚡ Mustervertrag ausprobieren (Kein Datei-Upload erforderlich)",
            file_ready_ram: "MB • RAM-Speicher bereit",
            btn_start_scan: "Kostenlose KI-Prüfung starten",

            // Trust Micro-Copys & Compliance Badges (DE)
            trust_title_1: "🔒 Flüchtige Verarbeitung:",
            trust_sub_1: "Ihr Dokument wird ausschließlich im flüchtigen RAM analysiert und in < 5 Sekunden vernichtet.",
            trust_title_2: "🛡️ Strenge Privatsphäre:",
            trust_sub_2: "Keine Festplattenspeicherung. Bankübliche AES-256-Verschlüsselung bei der Übertragung.",
            badge_soc2: "SOC-2 & DSGVO-Konform",
            badge_iso: "ISO 27001 RAM-Standard",
            badge_stripe: "Verifizierter Stripe-Händler",
            badge_guarantee: "100% Zufriedenheitsgarantie",

            // Step-by-Step Security Pipeline (DE)
            how_title: "🔒 Wie garantieren wir die Sicherheit Ihrer Daten?",
            step_1_title: "1. Flüchtiger RAM-Puffer",
            step_1_desc: "Das Dokument gelangt direkt in den RAM-Speicher, ohne physische Festplatten oder Cloud-Speicher zu berühren.",
            step_2_title: "2. Sofortige Löschung",
            step_2_desc: "Gemini 2.5 Flash analysiert den Text und der Speicherpuffer wird in < 5 Sekunden zerstört.",
            step_3_title: "3. Kostenlose Vorschau",
            step_3_desc: "Sie sehen die Diagnose kostenlos auf dem Bildschirm. Sie zahlen 19 $ nur, wenn Sie die Lösungen in Word + PDF herunterladen möchten.",

            // FAQ SEO Section (DE)
            faq_title: "❓ Häufig gestellte Fragen (B2B-Sicherheit & DSGVO)",
            faq_q1: "Wie prüft man einen Vertrag oder eine Rechnung mit Künstlicher Intelligenz?",
            faq_a1: "Ziehen Sie einfach Ihr PDF oder Bild hinein. Die Gemini 2.5 Flash Engine scannt den Text in <10s, erkennt unberechtigte Mehrkosten sowie versteckte Vertragsstrafen und zeigt eine kostenlose Übersicht auf dem Bildschirm.",
            faq_q2: "Werden meine Verträge oder Dokumente auf einem Server gespeichert?",
            faq_a2: "Nein. AuditFlow AI arbeitet mit einer strikten flüchtigen RAM-Architektur (0 Disk Retention). Die Datei wird im Speicher analysiert und in unter 5 Sekunden vollständig vernichtet.",
            faq_q3: "Was beinhaltet der Ausführliche Prüfbericht für 19.00 USD / Satoshis?",
            faq_a3: "Die Vorschau ist 100% kostenlos. Bei Zahlung von 19.00 USD (über Stripe oder Bitcoin Lightning) schalten Sie 3 taktische Nachverhandlungslösungen, bearbeitbare Word .docx-Redlines mit Änderungsnachverfolgung und das offiziell digital signierte PDF-Dokument frei.",
            faq_q4: "Gibt es einen Unternehmensplan für unbegrenzte Prüfungen?",
            faq_a4: "Ja. Für Kanzleien und Unternehmen bieten wir das monatliche Abonnement (69 $/Monat) oder das jährliche Abonnement (590 $/Jahr mit ~3,5 Monaten kostenlos) mit unbegrenzten Prüfungen, 2-Way Cross-Audit und bevorzugtem Support an.",

            // Scanner Section (DE)
            scan_init: "Scanner im flüchtigen Speicher wird initialisiert...",
            scan_sub: "Finanzklauseln werden mit Gemini 2.5 Flash analysiert",
            step_ram: "RAM-Puffer",
            step_gemini: "Gemini KI",
            step_scoring: "Lead Scoring",
            step_ready: "Bericht Bereit",

            // Lead Capture Modal (DE)
            lead_modal_title: "Prüfung Abgeschlossen (Kostenlose Übersicht)",
            lead_modal_sub: "In Ihrem Dokument wurden finanzielle Risiken festgestellt. Geben Sie Ihren Namen und Ihre E-Mail ein, um die Ergebnisvorschau zu sehen.",
            lead_label_name: "Vollständiger Name",
            lead_placeholder_name: "z.B. Maximilian Müller",
            lead_label_email: "Geschäftliche E-Mail-Adresse",
            lead_placeholder_email: "m.mueller@unternehmen.de",
            lead_btn_submit: "Kostenlose Vorschau anzeigen",

            // OCR Pre-flight Error Box (DE)
            ocr_error_title: "⚠️ Dokument für Prüfung ungeeignet",
            ocr_error_sub: "Das ausgewählte Dokument enthält keinen lesbaren Text oder ist extrem unscharf. Gemini 2.5 erfordert mindestens 50 lesbare Wörter, um finanzielle Verluste zu berechnen.",
            ocr_error_btn: "Anderes lesbares Dokument versuchen",

            // Report Header & Metrics (DE)
            rep_doc_default: "Gewerblicher Vertrag",
            rep_risk_high: "HOHES RISIKO",
            rep_leakage_label: "Gesamter Finanzieller Verlust",
            rep_lead_score_label: "Lead Score",
            rep_findings_title: "3 Finanzielle Mängel & Risikoklauseln Erkannt",
            rep_teaser_label: "🔍 Zusammenfassung der Anomalie (Kostenlose Vorschau):",
            rep_solution_label: "💡 Taktische Lösung & Nachverhandlungsklausel:",
            rep_unlock_btn: "🔒 Taktische Lösung Freischalten (19 USD)",

            // Unlock Banner & Payment Modal (DE)
            banner_title: "3 Taktische Lösungen + Word DOCX + PDF-Bericht Freischalten",
            banner_sub: "Sie haben die Ergebnisse auf dem Bildschirm gesehen. Erhalten Sie den genauen Nachverhandlungstext, Word .docx-Dateien und das signierte PDF für 19.00 USD oder Satoshis.",
            btn_unlock_report: "🔓 Ausführlichen Bericht + Word + PDF freischalten (19 USD)",
            modal_pay_title: "Vollständige Prüfung Freischalten",
            modal_pay_sub: "Einmalige Zahlung von 19.00 USD zum Download der taktischen Lösungen, bearbeitbaren Word-Dokumente und des signierten Prüfberichts.",
            tab_stripe: "💳 Stripe (19.00 USD)",
            tab_lightning: "⚡ Lightning (Satoshis)",
            btn_pay_stripe: "Mit Karte Bezahlen (19 USD)",
            btn_copy_ln: "BOLT11-Rechnung Kopieren",

            // Features & Footer (DE)
            feat_1_tag: "01. Vollständiger Datenschutz",
            feat_1_title: "Keine Festplattenspeicherung",
            feat_1_desc: "Dokumente werden in flüchtigen RAM umgewandelt, von Gemini geprüft und sofort vernichtet.",
            feat_2_tag: "02. Taktische Erkennung",
            feat_2_title: "3 Kritische Mängel",
            feat_2_desc: "Erkennt versteckte Strafen, doppelte Wertsicherungen und unberechtigte Zuschläge in Minuten.",
            feat_3_tag: "03. Hybride Zahlungen",
            feat_3_title: "19 USD oder Satoshis",
            feat_3_desc: "Ergebnisse kostenlos ansehen. 19 $ nur für Nachverhandlungstexte in Word .docx + PDF bezahlen.",

            // Pricing Grid Section (DE)
            pricing_badge_clear: "Transparente Preise",
            pricing_section_title: "💰 Transparente B2B-Preise & Tarife",
            pricing_section_sub: "Keine versteckten Gebühren, kein Kleingedrucktes. Kostenlos testen und je nach Dokumentenvolumen skalieren.",
            
            pricing_card1_tag: "KOSTENLOS",
            pricing_card1_title: "Erst-Scan",
            pricing_card1_price: "0 $",
            pricing_card1_period: "Dauerhaft Kostenlos",
            pricing_card1_desc: "Ideal, um den Zustand Ihres Vertrags oder Ihrer Rechnung vor Unterschrift oder Zahlung zu prüfen.",
            pricing_card1_f1: "✓ Live-Vorschau von 3 finanziellen Anomalien",
            pricing_card1_f2: "✓ Berechnung des geschätzten finanziellen Verlusts",
            pricing_card1_f3: "✓ Flüchtige RAM-Verarbeitung (< 5s)",
            pricing_card1_f4: "✓ 0 Festplattenspeicherung",
            pricing_card1_btn: "⚡ Kostenlosen Scan Starten",

            pricing_card2_top_badge: "BELIEBTESTE WAHL • EMPFOHLEN",
            pricing_card2_tag: "BELIEBT • EINMALIG",
            pricing_card2_title: "Ausführlicher Bericht",
            pricing_card2_price: "19 $",
            pricing_card2_period: "USD / pro Prüfung",
            pricing_card2_desc: "Vollständige Tiefenprüfung mit bearbeitbaren Dokumenten für Ihr Rechts- und Finanzteam.",
            pricing_card2_f1: "✓ Vollständige Freischaltung von 3 Taktischen Lösungen",
            pricing_card2_f2: "✓ Bearbeitbare Word .docx-Redlines mit Änderungsnachverfolgung",
            pricing_card2_f3: "✓ Offizieller, digital signierter PDF-Prüfbericht",
            pricing_card2_f4: "✓ Einmalzahlung ohne automatische Verlängerung",
            pricing_card2_btn: "🔓 1 Dokument Prüfen (19 USD)",

            pricing_card3_tag: "UNTERNEHMEN • UNBEGRENZT",
            pricing_card3_title: "Unternehmens-Plan",
            pricing_card3_price: "69 $",
            pricing_card3_period: "USD / Monat oder 590 $/Jahr",
            pricing_card3_desc: "Für Kanzleien, Bauunternehmen und Firmen mit hohem monatlichem Vertragsaufkommen.",
            pricing_card3_f1: "✓ Unbegrenzte 24/7 Multi-User-Prüfungen",
            pricing_card3_f2: "✓ 2-Way Cross-Audit (Vertrag vs. Rechnung)",
            pricing_card3_f3: "✓ Echtzeit-KI-Dokumenten-Copilot-Chat",
            pricing_card3_f4: "✓ Bevorzugter 24/7-Support & geteilte Kanzlei-Lizenz",
            pricing_card3_btn: "🚀 Unternehmens-Pläne Ansehen (69 $/Monat)",

            // Actions Toolbar (DE)
            btn_chat_contract: "💬 Mit KI über diesen Vertrag chatten",
            btn_download_docx: "📄 Word (.docx) Redlines herunterladen",
            btn_download_ics: "📅 Kalender-Erinnerungen (.ics)",

            // Success Purchase Banner (DE)
            success_banner_title: "Kauf bestätigt &amp; Bericht freigeschaltet!",
            success_banner_sub: "Sie haben vollen Zugriff auf die 3 taktischen Lösungen erhalten. Eine signierte PDF-Kopie wurde an Ihre E-Mail gesendet.",
            success_btn_home: "🏠 Zurück zur Startseite / Neues Dokument prüfen",

            // Enterprise Modal (DE)
            ent_modal_title: "B2B-Unternehmensplan",
            ent_modal_sub: "Unbegrenzte Audits 24/7 • Bevorzugter KI-Rechtssupport",
            ent_tab_monthly: "💳 Monatlich",
            ent_tab_annual_badge: "SPAREN SIE 238 $ USD",
            ent_tab_annual: "⭐ Jährlich (~3,5 Monate kostenlos)",
            ent_label_email: "Geschäftliche E-Mail-Adresse",
            ent_label_company: "Unternehmens- / Kanzleiname",
            ent_pay_card: "💳 Karte ($ USD)",
            ent_pay_ln: "⚡ Lightning (Strike Sats)",
            ent_label_card_num: "Kredit- / Debitkartennummer",
            ent_label_expiry: "Ablaufdatum (MM/JJ)",
            ent_label_cvc: "CVC-Sicherheitscode",
            ent_ln_title: "⚡ Lightning-Zahlung (Strike)",
            ent_ln_node_label: "Strike-Zielknoten (El Salvador):",
            ent_plan_monthly_name: "Monatlicher Plan",
            ent_plan_monthly_price: "69,00 $ USD / Monat",
            ent_plan_annual_name: "Jahresplan (~3,5 Monate kostenlos)",
            ent_plan_annual_price: "590,00 $ USD / Jahr",
            ent_plan_desc: "Beinhaltet unbegrenzten Zugriff für Ihr gesamtes Team, 2-Way Cross-Audit, automatische RAM-Löschung und wasserzeichenfreie Word- + PDF-Berichte.",
            ent_btn_submit_monthly: "🚀 Abonnement für 69 $/Monat aktivieren",
            ent_btn_submit_annual: "🚀 Jahres-Abonnement für 590 $/Jahr aktivieren",

            // Sample PDF Modal (DE)
            sample_pdf_badge: "OFFIZIELLES MUSTERDOKUMENT",
            sample_pdf_ram: "FLÜCHTIGER RAM-SPEICHER (0 FESTPLATTE) • OFFIZIELLES AUDIT-SIEGEL",
            sample_pdf_doc_label: "Geprüftes Dokument",
            sample_pdf_risk_label: "Risikostufe",
            sample_pdf_leakage_label: "Festgestelltes finanzielles Risiko",
            sample_pdf_solutions_title: "Aufschlüsselung der taktischen Neuverhandlungslösungen:",
            sample_pdf_seal: "Digitale Signatur &amp; Validierungssiegel durch Gemini 2.5 Flash KI",
            sample_pdf_btn_unlock: "🔓 Meinen offiziellen Bericht freischalten (19 $ USD)",

            // Interactive Copilot Chat Modal (DE)
            chat_copilot_title: "KI-Copilot — Dokumentenberatung",
            chat_copilot_ram_badge: "Gemini 2.5 Flash • Flüchtiger RAM-Speicher",
            chat_copilot_welcome: "👋 Hallo. Ich bin Ihr rechtlicher und finanzieller Copilot. Stellen Sie mir beliebige Fragen zu diesem Dokument (Klauseln, Vertragsstrafen, Einwandentwürfe oder Fristen).",
            chat_chip_penalty: "❓ Kündigungsstrafe",
            chat_chip_surcharges: "❓ Versteckte Aufschläge",
            chat_chip_letter: "❓ Einwandschreiben",
            chat_btn_send: "Senden",
            chat_placeholder: "Geben Sie Ihre Frage zum Vertrag oder zur Rechnung ein...",

            // Footer Links (DE)
            footer_privacy: "Datenschutz &amp; SOC2",
            footer_terms: "B2B-AGB",
            footer_admin: "Admin-Panel",

            // Social Proof Toast (DE)
            social_proof_title_default: "Neues Audit Durchgeführt",
            social_proof_time_default: "Vor 2 Minuten • Flüchtiger RAM-Speicher",

            footer_rights: "© 2026 AuditFlow AI. 24/7 B2B Micro-SaaS Infrastruktur.",
            footer_privacy_link: "Garantie für flüchtigen Speicher",
            footer_report_issue: "Konfigurationsfehler Melden",

            // Configuration Issue Modal (DE)
            issue_modal_title: "Konfigurationsfehler Melden",
            issue_modal_sub: "Autonome KI-Selbstdiagnose",
            issue_email_label: "Ihre E-Mail-Adresse",
            issue_type_label: "Art der Störung",
            issue_opt_1: "Datei-Upload-Fehler / Unleserliche OCR",
            issue_opt_2: "Zahlungsgateway-Problem (Stripe/Lightning)",
            issue_opt_3: "Darstellungsfehler im Bericht oder in den Lösungen",
            issue_opt_4: "Allgemeiner Konfigurationsfehler",
            issue_desc_label: "Beschreibung des Fehlers (Optional)",
            issue_ai_heading: "🤖 Echtzeit-KI-Diagnose:",
            issue_btn_submit: "🛠️ Bericht Senden &amp; mit KI Diagnostizieren",
            ent_multi_lawyer_text: "Multi-User-Jahreslizenz: Kann von mehreren Anwälten Ihrer Kanzlei gemeinsam genutzt werden.",
            legal_disclaimer: "<strong>Rechtlicher Hinweis &amp; Haftungsausschluss:</strong> AuditFlow AI ist ein automatisiertes Analysetool auf Basis Künstlicher Intelligenz. Berichte und taktische Vorschläge stellen keine rechtsverbindliche Rechts- oder Finanzberatung dar. Entwickler und Plattform sind vollständig von jeglicher Haftung freigestellt."
        }
    },

    setLanguage(lang) {
        if (!this.translations[lang]) return;
        this.currentLang = lang;
        if (typeof document !== 'undefined' && document.documentElement) {
            document.documentElement.lang = lang;
        }
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('auditflow_lang', lang);
        }
        this.updateDOM();

        const btnEs = document.getElementById('btn-lang-es');
        const btnEn = document.getElementById('btn-lang-en');
        const btnDe = document.getElementById('btn-lang-de');

        const inactiveClass = "px-2.5 py-1 rounded text-gray-300 hover:text-white transition-all focus:outline-none";
        const activeClass = "px-2.5 py-1 rounded bg-accent-blue text-black font-bold transition-all focus:outline-none";

        if (btnEs) btnEs.className = (lang === 'es' ? activeClass : inactiveClass);
        if (btnEn) btnEn.className = (lang === 'en' ? activeClass : inactiveClass);
        if (btnDe) btnDe.className = (lang === 'de' ? activeClass : inactiveClass);
    },

    t(key) {
        const dict = this.translations[this.currentLang] || this.translations.es;
        return dict[key] || this.translations.es[key] || key;
    },

    updateDOM() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.t(key);
            if (translation) {
                el.innerHTML = translation;
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const translation = this.t(key);
            if (translation) {
                el.placeholder = translation;
            }
        });

        if (typeof window.updateRoiCalculator === 'function') {
            window.updateRoiCalculator();
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.I18n.setLanguage(window.I18n.currentLang);
});
