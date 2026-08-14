// ==============================================================================
// AUDITFLOW AI - I18N BILINGUAL TRANSLATION SYSTEM (ENGLISH / SPANISH)
// INCLUYE ELEMENTOS DE ALTA CONFIANZA: BOTÓN SAMPLE, METRICAS Y SOC-2
// ==============================================================================

window.I18n = {
    currentLang: (typeof localStorage !== 'undefined' ? localStorage.getItem('auditflow_lang') : null) || 'es',

    translations: {
        es: {
            // Header
            nav_privacy_badge: "Memoria Volátil Activa (0 Disco)",
            nav_speed_badge: "Auditoría <10s",
            
            // Hero
            hero_free_badge: "🎁 Escaneo Inicial 100% Gratuito • Sin tarjeta para analizar",
            hero_engine_badge: "⚡ Motor Gemini 2.5 Flash • Procesamiento ultra-rápido",
            hero_title_1: "Audita tus Contratos y Facturas en ",
            hero_title_2: "<10 Segundos",
            hero_sub: "Detecta automáticamente fugas financieras, sobrecargos y cláusulas de riesgo sin subir tus archivos a ningún servidor. Mira el resumen de hallazgos GRATIS antes de pagar.",
            
            // Live Stats Ticker (Confianza Social)
            stat_audits: "Contratos Auditados",
            stat_leakage: "Fugas Detectadas",
            stat_retention: "Archivos en Disco",
            stat_encryption: "Cifrado Volátil",

            // Dropzone & Sample Demo Button
            drag_title: "Arrastra tu archivo aquí o ",
            drag_browse: "explora tus archivos",
            drag_sub_free: "Análisis inicial 100% Gratis • Revisa los hallazgos antes de pagar $7",
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

            // Step-by-Step Security Pipeline (Transparencia de Proceso)
            how_title: "🔒 ¿Cómo garantizamos la seguridad de tu información?",
            step_1_title: "1. Buffer RAM Volátil",
            step_1_desc: "El documento entra directamente a memoria RAM sin pasar por discos físicos ni servidores de almacenamiento.",
            step_2_title: "2. Purga Inmediata",
            step_2_desc: "Gemini 2.5 Flash analiza el texto y el buffer de memoria se destruye automáticamente en < 5 segundos.",
            step_3_title: "3. Vista Previa Gratis",
            step_3_desc: "Ves el diagnóstico en pantalla de forma gratuita. Decides pagar $7 solo si deseas descargar las soluciones en PDF.",

            // Pre-flight Check Error Box
            ocr_error_title: "Documento Ilegible o Resolución Insuficiente",
            ocr_error_msg: "El filtro de calidad detectó menos de 50 palabras legibles o caracteres corruptos. Por favor, sube una versión más clara para garantizar una auditoría precisa.",
            ocr_error_retry: "Subir Otro Archivo",
            
            // Feature cards
            feat_1_tag: "01. Privacidad Total",
            feat_1_title: "Cero Guardado en Disco",
            feat_1_desc: "El documento se convierte a memoria RAM volátil, se audita por Gemini y se destruye inmediatamente.",
            feat_2_tag: "02. Detección Táctica",
            feat_2_title: "3 Fallas Críticas",
            feat_2_desc: "Detecta penalizaciones ocultas, indexaciones dobles y sobrecargos en minutos de lectura.",
            feat_3_tag: "03. Pagos Híbridos",
            feat_3_title: "$7 USD o Satoshis",
            feat_3_desc: "Mira los hallazgos gratis. Paga $7 sólo para desbloquear el texto de renegociación + PDF.",

            // Scanner
            scan_init: "Iniciando escáner en memoria volátil...",
            scan_sub: "Analizando cláusulas financieras con Gemini 2.5 Flash",
            step_ram: "RAM Buffer",
            step_gemini: "Gemini AI",
            step_scoring: "Lead Scoring",
            step_ready: "Reporte Listo",

            // Lead Modal
            lead_modal_title: "Auditoría Completada (Resumen Gratuito)",
            lead_modal_sub: "Se han detectado fugas financieras en tu documento. Ingresa tu nombre y correo para ver la vista previa de hallazgos.",
            lead_label_name: "Nombre Completo",
            lead_placeholder_name: "Ej. Carlos Mendoza",
            lead_label_email: "Correo Electrónico Corporativo",
            lead_placeholder_email: "carlos@empresa.com",
            lead_btn_submit: "Ver Vista Previa Gratuita",

            // Report Dashboard
            rep_doc_default: "Contrato Comercial",
            rep_risk_high: "RIESGO ALTO",
            rep_leakage_label: "Fuga Financiera Total",
            rep_lead_score_label: "Lead Score",
            rep_findings_title: "3 Fallas Financieras & Cláusulas de Riesgo Detectadas",
            rep_impact_label: "Impacto Financiero Estimado:",
            rep_teaser_label: "🔍 Resumen de la Anomalía (Gratis):",
            rep_solution_label: "💡 Solución Táctica & Texto Sustitutivo de Renegociación:",
            rep_unlock_btn: "🔒 Desbloquear Solución Táctica ($7 USD)",
            
            // Unlock Banner
            banner_title: "Desbloquea las 3 Soluciones Tácticas + Reporte PDF",
            banner_sub: "Ya viste los hallazgos en pantalla. Obtén el texto exacto para renegociar contratos, objeción de cargos indebidos y el PDF firmado por solo $7.00 USD o Satoshis.",
            banner_btn: "Desbloquear Soluciones por $7.00 USD / Sats",

            // Payment Modal
            pay_title: "Selecciona Método de Pago",
            pay_sub: "Tarifa plana de $7.00 USD • Liquidación inmediata",
            pay_tab_stripe: "💳 Stripe ($7.00 USD)",
            pay_tab_ln: "⚡ Lightning (Satoshis)",
            pay_total_label: "Total a Pagar",
            pay_stripe_desc: "Liquidación segura a través de tarjeta de crédito/débito. Recibes el reporte desenfocado al instante + copia PDF en tu correo.",
            pay_btn_stripe: "Pagar con Tarjeta ($7 USD)",
            pay_ln_expiry: "Expiración Factura",
            pay_ln_sats_label: "Monto en Satoshis:",
            pay_ln_input_label: "Factura Lightning BOLT11",
            pay_btn_copy: "Copiar",
            pay_btn_copied: "¡Copiado!",
            pay_ln_node_label: "Directo a nodo Lightning:",

            // Upsell Banner
            upsell_title: "🚀 ¿Necesitas Auditorías Ilimitadas para tu Empresa?",
            upsell_sub: "Actualiza a la suscripción Corporativa por $49/mes. Auditorías ilimitadas, equipo multi-usuario y soporte legal prioritaria.",
            upsell_btn: "Suscribirme por $49/mes",

            // Footer
            footer_rights: "© 2026 AuditFlow AI. Infraestructura Micro-SaaS B2B Operando 24/7.",
            footer_privacy_link: "Garantía Memoria Volátil"
        },
        en: {
            // Header
            nav_privacy_badge: "Volatile RAM Memory (0 Disk)",
            nav_speed_badge: "Audit <10s",
            
            // Hero
            hero_free_badge: "🎁 100% Free Initial Scan • No credit card required to analyze",
            hero_engine_badge: "⚡ Gemini 2.5 Flash Engine • Ultra-fast processing",
            hero_title_1: "Audit Contracts & Invoices in ",
            hero_title_2: "<10 Seconds",
            hero_sub: "Automatically detect financial leaks, overcharges, and risk clauses without uploading files to any server. Preview finding summary for FREE before paying.",
            
            // Live Stats Ticker
            stat_audits: "Audited Contracts",
            stat_leakage: "Detected Leakages",
            stat_retention: "Disk Files",
            stat_encryption: "Volatile Encryption",

            // Dropzone & Sample Demo Button
            drag_title: "Drag & drop your file here or ",
            drag_browse: "browse files",
            drag_sub_free: "100% Free initial analysis • Review findings before paying $7",
            drag_formats: "Supports PDF, PNG, JPG or WebP (Up to 15MB)",
            btn_sample_demo: "⚡ Try with Sample Contract (No file upload needed)",
            file_ready_ram: "MB • RAM memory ready",
            btn_start_scan: "Start Free AI Audit",

            // Trust Micro-Copys & Compliance Badges
            trust_title_1: "🔒 Ephemeral processing:",
            trust_sub_1: "Your document is analyzed strictly in volatile RAM and destroyed in < 5 seconds.",
            trust_title_2: "🛡️ Strict privacy:",
            trust_sub_2: "Zero physical disk storage. Bank-grade AES-256 in-transit encryption.",
            badge_soc2: "SOC-2 & GDPR Compliant",
            badge_iso: "ISO 27001 RAM Standard",
            badge_stripe: "Stripe Verified Merchant",
            badge_guarantee: "100% Satisfaction Guarantee",

            // Step-by-Step Security Pipeline
            how_title: "🔒 How do we guarantee the security of your data?",
            step_1_title: "1. Volatile RAM Buffer",
            step_1_desc: "The document enters volatile RAM directly without ever touching physical storage disks.",
            step_2_title: "2. Immediate Purge",
            step_2_desc: "Gemini 2.5 Flash analyzes the text and the RAM buffer is wiped in < 5 seconds.",
            step_3_title: "3. Free Preview",
            step_3_desc: "You review findings on screen for free. You pay $7 only if you decide to unlock full PDF solutions.",

            // Pre-flight Check Error Box
            ocr_error_title: "Illegible Document or Low Resolution",
            ocr_error_msg: "Quality check detected fewer than 50 readable words or corrupt characters. Please upload a clearer copy to ensure an accurate audit.",
            ocr_error_retry: "Upload Another File",
            
            // Feature cards
            feat_1_tag: "01. Total Privacy",
            feat_1_title: "Zero Disk Storage",
            feat_1_desc: "Documents are converted to volatile RAM, audited by Gemini, and immediately destroyed.",
            feat_2_tag: "02. Tactical Detection",
            feat_2_title: "3 Critical Flaws",
            feat_2_desc: "Detect hidden penalties, double indexations, and overcharges in minutes of reading.",
            feat_3_tag: "03. Hybrid Payments",
            feat_3_title: "$7 USD or Sats",
            feat_3_desc: "Preview findings for free. Pay $7 only to unlock full negotiation text + PDF.",

            // Scanner
            scan_init: "Starting volatile memory scanner...",
            scan_sub: "Analyzing financial clauses with Gemini 2.5 Flash",
            step_ram: "RAM Buffer",
            step_gemini: "Gemini AI",
            step_scoring: "Lead Scoring",
            step_ready: "Report Ready",

            // Lead Modal
            lead_modal_title: "Audit Completed (Free Preview)",
            lead_modal_sub: "Financial leaks detected in your document. Enter your name and email to view the findings preview.",
            lead_label_name: "Full Name",
            lead_placeholder_name: "e.g. John Doe",
            lead_label_email: "Corporate Email",
            lead_placeholder_email: "john@company.com",
            lead_btn_submit: "View Free Audit Preview",

            // Report Dashboard
            rep_doc_default: "Commercial Contract",
            rep_risk_high: "HIGH RISK",
            rep_leakage_label: "Total Financial Leakage",
            rep_lead_score_label: "Lead Score",
            rep_findings_title: "3 Financial Flaws & Risk Clauses Detected",
            rep_impact_label: "Estimated Financial Impact:",
            rep_teaser_label: "🔍 Anomaly Summary (Free Preview):",
            rep_solution_label: "💡 Tactical Solution & Negotiation Text:",
            rep_unlock_btn: "🔒 Unlock Tactical Solution ($7 USD)",
            
            // Unlock Banner
            banner_title: "Unlock 3 Tactical Solutions + PDF Report",
            banner_sub: "You've seen the findings on screen. Get the exact negotiation text, fee objections, and signed PDF report for just $7.00 USD or Satoshis.",
            banner_btn: "Unlock Solutions for $7.00 USD / Sats",

            // Payment Modal
            pay_title: "Select Payment Method",
            pay_sub: "Flat fee $7.00 USD • Instant settlement",
            pay_tab_stripe: "💳 Stripe ($7.00 USD)",
            pay_tab_ln: "⚡ Lightning (Satoshis)",
            pay_total_label: "Total Amount",
            pay_stripe_desc: "Secure settlement via credit/debit card. Receive instant unblurred report + email PDF copy.",
            pay_btn_stripe: "Pay with Card ($7 USD)",
            pay_ln_expiry: "Invoice Expiry",
            pay_ln_sats_label: "Amount in Satoshis:",
            pay_ln_input_label: "Lightning BOLT11 Invoice",
            pay_btn_copy: "Copy",
            pay_btn_copied: "Copied!",
            pay_ln_node_label: "Direct to Lightning node:",

            // Upsell Banner
            upsell_title: "🚀 Need Unlimited Audits for Your Enterprise?",
            upsell_sub: "Upgrade to Enterprise Subscription for $49/mo. Unlimited audits, multi-user team, and priority legal support.",
            upsell_btn: "Subscribe for $49/mo",

            // Footer
            footer_rights: "© 2026 AuditFlow AI. B2B Micro-SaaS Infrastructure Operating 24/7.",
            footer_privacy_link: "Volatile Memory Guarantee"
        }
    },

    setLanguage(lang) {
        if (lang !== 'es' && lang !== 'en') return;
        this.currentLang = lang;
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('auditflow_lang', lang);
        }
        this.applyTranslations();

        const btnEn = document.getElementById('btn-lang-en');
        const btnEs = document.getElementById('btn-lang-es');

        if (btnEn && btnEs) {
            if (lang === 'en') {
                btnEn.classList.add('bg-accent-blue', 'text-black', 'font-bold');
                btnEn.classList.remove('text-gray-400');
                btnEs.classList.remove('bg-accent-blue', 'text-black', 'font-bold');
                btnEs.classList.add('text-gray-400');
            } else {
                btnEs.classList.add('bg-accent-blue', 'text-black', 'font-bold');
                btnEs.classList.remove('text-gray-400');
                btnEn.classList.remove('bg-accent-blue', 'text-black', 'font-bold');
                btnEn.classList.add('text-gray-400');
            }
        }
    },

    t(key) {
        const langDict = this.translations[this.currentLang] || this.translations['es'];
        return langDict[key] || this.translations['es'][key] || key;
    },

    applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (key) {
                el.innerText = this.t(key);
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (key) {
                el.placeholder = this.t(key);
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (window.I18n) {
        window.I18n.applyTranslations();
    }
});
