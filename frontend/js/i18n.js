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
            nav_speed_badge: "Auditoría <10s",
            
            // Actions Toolbar
            btn_back_home: "← Regresar al Inicio / Auditar Otro",
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
            hero_title_1: "Audita tus Contratos y Facturas en ",
            hero_title_2: "<10 Segundos",
            hero_sub: "Detecta automáticamente fugas financieras, sobrecargos y cláusulas de riesgo sin subir tus archivos a ningún servidor. Mira el resumen de hallazgos GRATIS antes de pagar.",
            hero_privacy_guarantee: "<strong>Privacidad Total Garantizada:</strong> Tu documento se destruye automáticamente de la memoria RAM efímera tras la auditoría (0 Almacenamiento en Disco).",
            
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

            // Step-by-Step Security Pipeline
            how_title: "🔒 ¿Cómo garantizamos la seguridad de tu información?",
            step_1_title: "1. Buffer RAM Volátil",
            step_1_desc: "El documento entra directamente a memoria RAM sin pasar por discos físicos ni servidores de almacenamiento.",
            step_2_title: "2. Purga Inmediata",
            step_2_desc: "Gemini 2.5 Flash analiza el texto y el buffer de memoria se destruye automáticamente en < 5 segundos.",
            step_3_title: "3. Vista Previa Gratis",
            step_3_desc: "Ves el diagnóstico en pantalla de forma gratuita. Decides pagar $7 solo si deseas descargar las soluciones en PDF.",

            // FAQ SEO Section (Preguntas Frecuentes de Alta Búsqueda)
            faq_title: "❓ Preguntas Frecuentes (SEO & Seguridad B2B)",
            faq_q1: "¿Cómo auditar un contrato o factura con Inteligencia Artificial?",
            faq_a1: "Solo debes arrastrar tu documento PDF o imagen. El motor Gemini 2.5 Flash escanea el texto en <10 segundos, detecta sobrecargos, penalizaciones ocultas y te muestra un resumen de hallazgos gratis en pantalla.",
            faq_q2: "¿Mis contratos o documentos se guardan en algún servidor?",
            faq_a2: "No. AuditFlow AI opera con una arquitectura de memoria RAM volátil estricta (0 Disk Retention). El archivo se analiza en memoria y se destruye en menos de 5 segundos.",
            faq_q3: "¿Qué incluye la auditoría por $7.00 USD / Satoshis?",
            faq_a3: "La vista previa es 100% gratuita. Al abonar $7.00 USD (vía Stripe o Bitcoin Lightning), desbloqueas las soluciones tácticas de renegociación, la objeción legal de cargos y el informe PDF firmado.",
            faq_q4: "¿Tienen plan corporativo para auditorías ilimitadas?",
            faq_a4: "Sí. Para empresas con alto volumen de facturación o contratos mensuales, ofrecemos la suscripción Corporativa por $49/mes con auditorías ilimitadas y soporte legal prioritario.",

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
            ocr_error_title: "Documento Ilegible o Resolución Insuficiente",
            ocr_error_msg: "El filtro de calidad detectó menos de 50 palabras legibles o caracteres corruptos. Por favor, sube una versión más clara para garantizar una auditoría precisa.",
            ocr_error_retry: "Subir Otro Archivo",

            // Report Dashboard
            rep_doc_default: "Contrato Comercial",
            rep_risk_high: "RIESGO ALTO",
            rep_leakage_label: "Fuga Financiera Total",
            rep_lead_score_label: "Lead Score",
            rep_findings_title: "3 Fallas Financieras & Cláusulas de Riesgo Detectadas",
            rep_teaser_label: "🔍 Resumen de la Anomalía (Gratis):",
            rep_solution_label: "💡 Solución Táctica & Texto Sustitutivo de Renegociación:",
            rep_unlock_btn: "🔒 Desbloquear Solución Táctica ($7 USD)",
            banner_title: "Desbloquea las 3 Soluciones Tácticas + Reporte PDF",
            banner_sub: "Ya viste los hallazgos en pantalla. Obtén el texto exacto para renegociar contratos, objeción de cargos indebidos y el PDF firmado por solo $7.00 USD o Satoshis.",
            banner_btn: "Desbloquear Soluciones por $7.00 USD / Sats",
            
            // Upsell Corporate Banner ($49/mo)
            upsell_title: "🚀 ¿Necesitas Auditorías Ilimitadas para tu Empresa?",
            upsell_sub: "Actualiza a la suscripción Corporativa por $49/mes. Auditorías ilimitadas, equipo multi-usuario y soporte legal prioritario.",
            upsell_btn: "Suscribirme por $49/mes",

            // Payment Modal (Hybrid Stripe & Lightning)
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
            pay_ln_node_label: "Directo a nodo Lightning:",
            btn_preview_sample_pdf: "Ver Ejemplo de Reporte PDF Oficial Modelo",

            // Features & Footer
            feat_1_tag: "01. Privacidad Total",
            feat_1_title: "Cero Guardado en Disco",
            feat_1_desc: "El documento se convierte a memoria RAM volátil, se audita por Gemini y se destruye inmediatamente.",
            feat_2_tag: "02. Detección Táctica",
            feat_2_title: "3 Fallas Críticas",
            feat_2_desc: "Detecta penalizaciones ocultas, indexaciones dobles y sobrecargos en minutos de lectura.",
            feat_3_tag: "03. Pagos Híbridos",
            feat_3_title: "$7 USD o Satoshis",
            feat_3_desc: "Mira los hallazgos gratis. Paga $7 sólo para desbloquear el texto de renegociación + PDF.",
            footer_rights: "© 2026 AuditFlow AI. Infraestructura Micro-SaaS B2B Operando 24/7.",
            footer_privacy_link: "Garantía Memoria Volátil"
        },
        en: {
            // Header
            nav_privacy_badge: "Volatile RAM Active (0 Disk)",
            nav_speed_badge: "Audit <10s",

            // Actions Toolbar
            btn_back_home: "← Back to Home / Audit Another",
            btn_print_report: "🖨️ Print / Save as PDF",
            btn_ai_support: "🤖 24/7 AI Support (AI Fix)",

            // AI Support Modal
            support_title: "Autonomous AI Support Agent",
            support_sub: "Found an issue or want the AI to re-analyze a specific clause? Type your note and the AI Agent will fix your report in < 10s.",
            support_label: "Describe your issue or request",
            support_placeholder: "e.g. Please re-evaluate clause 7.3 regarding the termination penalty...",
            support_btn_submit: "🤖 Re-Analyze & Fix with AI",
            
            // Hero
            hero_free_badge: "🎁 100% Free Initial Scan • No card required to analyze",
            hero_engine_badge: "⚡ Gemini 2.5 Flash Engine • Ultra-fast processing",
            hero_title_1: "Audit Contracts & Invoices in ",
            hero_title_2: "<10 Seconds",
            hero_sub: "Automatically detect financial leakage, overcharges, and risk clauses without uploading files to any server. View findings summary FREE before paying.",
            hero_privacy_guarantee: "<strong>Total Privacy Guaranteed:</strong> Your document is automatically purged from volatile RAM memory immediately after auditing (0 Disk Storage).",
            
            // Live Stats Ticker
            stat_audits: "Audited Contracts",
            stat_leakage: "Leakage Detected",
            stat_retention: "Files on Disk",
            stat_encryption: "RAM Encryption",

            // Dropzone & Sample Demo Button
            drag_title: "Drag & drop your file here or ",
            drag_browse: "browse your files",
            drag_sub_free: "100% Free initial analysis • Review findings before paying $7",
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
            how_title: "🔒 How do we guarantee your document privacy?",
            step_1_title: "1. Volatile RAM Buffer",
            step_1_desc: "Document enters RAM buffer directly without ever passing through physical disk storage.",
            step_2_title: "2. Immediate Purge",
            step_2_desc: "Gemini 2.5 Flash analyzes text and RAM buffer is automatically destroyed in < 5 seconds.",
            step_3_title: "3. Free Preview",
            step_3_desc: "View findings summary on-screen for free. Pay $7 only if you wish to download tactical solutions PDF.",

            // FAQ SEO Section
            faq_title: "❓ Frequently Asked Questions (SEO & B2B Security)",
            faq_q1: "How to audit a contract or invoice with Artificial Intelligence?",
            faq_a1: "Simply drag and drop your PDF or image. Gemini 2.5 Flash engine scans the text in <10 seconds, detects overcharges and risk clauses, showing a free preview on-screen.",
            faq_q2: "Are my contracts or files saved on any server?",
            faq_a2: "No. AuditFlow AI operates on strict zero-disk retention architecture. Files are processed in RAM and purged in under 5 seconds.",
            faq_q3: "What does the $7.00 USD / Satoshis audit unlock?",
            faq_a3: "The preview is 100% free. Paying $7.00 USD unlocks full tactical negotiation text, legal fee objection wording, and signed PDF report.",
            faq_q4: "Do you have an enterprise unlimited plan?",
            faq_a4: "Yes. For businesses with high contract volume, we offer Enterprise Subscription for $49/mo with unlimited audits and priority legal support.",

            // Scanner Section
            scan_init: "Starting volatile memory scanner...",
            scan_sub: "Analyzing financial clauses with Gemini 2.5 Flash",
            step_ram: "RAM Buffer",
            step_gemini: "Gemini AI",
            step_scoring: "Lead Scoring",
            step_ready: "Report Ready",

            // Lead Capture Modal
            lead_modal_title: "Audit Completed (Free Summary)",
            lead_modal_sub: "Financial leakage has been detected in your document. Enter your name and email to view findings preview.",
            lead_label_name: "Full Name",
            lead_placeholder_name: "e.g. John Doe",
            lead_label_email: "Corporate Email Address",
            lead_placeholder_email: "john@company.com",
            lead_btn_submit: "View Free Preview",

            // OCR Pre-flight Error Box
            ocr_error_title: "Illegible Document or Insufficient Resolution",
            ocr_error_msg: "Pre-flight quality check detected under 50 legible words or corrupted OCR. Please upload a clearer version for accurate audit.",
            ocr_error_retry: "Upload Another File",

            // Report Dashboard
            rep_doc_default: "Commercial Contract",
            rep_risk_high: "HIGH RISK",
            rep_leakage_label: "Total Financial Leakage",
            rep_lead_score_label: "Lead Score",
            rep_findings_title: "3 Financial Anomalies & Risk Clauses Detected",
            rep_teaser_label: "🔍 Anomaly Summary (Free):",
            rep_solution_label: "💡 Tactical Solution & Negotiation Wording:",
            rep_unlock_btn: "🔒 Unlock Tactical Solution ($7 USD)",
            banner_title: "Unlock All 3 Tactical Solutions + PDF Report",
            banner_sub: "You've seen the findings. Get exact renegotiation text, fee objection wording, and signed PDF for just $7.00 USD or Satoshis.",
            banner_btn: "Unlock Solutions for $7.00 USD / Sats",

            // Upsell Corporate Banner
            upsell_title: "🚀 Need Unlimited Audits for Your Business?",
            upsell_sub: "Upgrade to Enterprise Subscription for $49/mo. Unlimited audits, multi-user team access, and priority support.",
            upsell_btn: "Subscribe for $49/mo",

            // Payment Modal
            pay_title: "Select Payment Method",
            pay_sub: "$7.00 USD Flat Rate • Immediate Unblur",
            pay_tab_stripe: "💳 Stripe ($7.00 USD)",
            pay_tab_ln: "⚡ Lightning (Satoshis)",
            pay_total_label: "Total Amount",
            pay_stripe_desc: "Secure credit/debit card checkout. Immediate report unblur + PDF copy sent to your email.",
            pay_btn_stripe: "Pay with Card ($7 USD)",
            pay_ln_expiry: "Invoice Expiry",
            pay_ln_sats_label: "Amount in Satoshis:",
            pay_ln_input_label: "BOLT11 Lightning Invoice",
            pay_btn_copy: "Copy",
            pay_ln_node_label: "Direct to Lightning node:",

            // Features & Footer
            feat_1_tag: "01. Total Privacy",
            feat_1_title: "Zero Disk Storage",
            feat_1_desc: "Document converted to volatile RAM, audited by Gemini, and destroyed immediately.",
            feat_2_tag: "02. Tactical Detection",
            feat_2_title: "3 Critical Anomalies",
            feat_2_desc: "Detect hidden penalties, double indexation, and overcharges in minutes.",
            feat_3_tag: "03. Hybrid Payments",
            feat_3_title: "$7 USD or Satoshis",
            feat_3_desc: "See findings free. Pay $7 only to unlock renegotiation text + PDF.",
            footer_rights: "© 2026 AuditFlow AI. B2B Micro-SaaS Infrastructure Operating 24/7.",
            footer_privacy_link: "Volatile Memory Guarantee"
        }
    },

    setLanguage(lang) {
        if (!this.translations[lang]) return;
        this.currentLang = lang;
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('auditflow_lang', lang);
        }
        this.updateDOM();

        const btnEs = document.getElementById('btn-lang-es');
        const btnEn = document.getElementById('btn-lang-en');

        if (btnEs && btnEn) {
            if (lang === 'es') {
                btnEs.className = "px-2.5 py-1 rounded bg-accent-blue text-black font-bold transition-all focus:outline-none";
                btnEn.className = "px-2.5 py-1 rounded text-gray-300 hover:text-white transition-all focus:outline-none";
            } else {
                btnEn.className = "px-2.5 py-1 rounded bg-accent-blue text-black font-bold transition-all focus:outline-none";
                btnEs.className = "px-2.5 py-1 rounded text-gray-300 hover:text-white transition-all focus:outline-none";
            }
        }
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
                el.innerText = translation;
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const translation = this.t(key);
            if (translation) {
                el.placeholder = translation;
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.I18n.setLanguage(window.I18n.currentLang);
});
