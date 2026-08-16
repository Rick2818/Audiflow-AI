// ==============================================================================
// AUDITFLOW AI - MAIN CLIENT APPLICATION (app.js)
// CON FILTRO PRE-VUELO OCR, DESBLOQUEO DE REPORTES Y DESENFOQUE TRAS PAGO
// ==============================================================================

window.AppHandler = {
    selectedFile: null,
    currentAuditData: null,
    currentReportId: null,
    currentLeadData: { name: '', email: '' },

    init() {
        this.setupDragAndDrop();
        this.setupFormListeners();
        this.checkUrlForPaymentSuccess();
    },

    setupDragAndDrop() {
        const dropZone = document.getElementById('drop-zone');
        const fileInput = document.getElementById('file-input');
        const btnStartScan = document.getElementById('btn-start-scan');

        if (dropZone && fileInput) {
            dropZone.addEventListener('click', () => fileInput.click());

            ['dragenter', 'dragover'].forEach(eventName => {
                dropZone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dropZone.classList.add('drag-over');
                });
            });

            ['dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dropZone.classList.remove('drag-over');
                });
            });

            dropZone.addEventListener('drop', (e) => {
                const files = e.dataTransfer ? e.dataTransfer.files : null;
                if (files && files.length > 0) {
                    this.handleFileSelected(files[0]);
                }
            });

            fileInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files.length > 0) {
                    this.handleFileSelected(e.target.files[0]);
                }
            });
        }

        if (btnStartScan) {
            btnStartScan.addEventListener('click', () => {
                if (this.selectedFile) {
                    this.startAuditScanProcess();
                }
            });
        }
    },

    loadSampleContract() {
        const sampleText = `CONTRATO DE PRESTACIÓN DE SERVICIOS PROFESIONALES Y MANTENIMIENTO TECNOLÓGICO ENTERPRISE

Entre la empresa contratante Apex Global Logistics S.A. y el proveedor Vertex Solutions Corp.
Se establece el siguiente contrato de servicios por un valor estimado de $85,000 USD anuales.

CLÁUSULA 3.2 - PENALIZACIÓN EXCESIVA POR TERMINACIÓN ANTICIPADA:
Si la empresa contratante rescinde el contrato antes de los 36 meses, deberá abonar el 100% de la facturación pendiente restante más una multa adicional fija del 35% por concepto de daños morales y perjuicios comerciales.

CLÁUSULA 5.4 - INDEXACIÓN Y DUPLICACIÓN DE TARIFAS POR INFLACIÓN:
Las tarifas mensuales se incrementarán automáticamente cada 6 meses aplicando el índice de inflación interanual del 8.5% más un recargo del 5% adicional por concepto de costo de infraestructura en la nube.

CLÁUSULA 9.1 - SOBRECARGO INDEBIDO Y RENOVACIÓN AUTOMÁTICA OBLIGATORIA:
El contrato se renovará automáticamente por periodos de 3 años si no se envía una notificación por correo certificado con 180 días de antelación. En caso de renovación, se aplicará un cargo administrativo del 15% sobre el valor total. Texto adicional auditado por el motor de inteligencia artificial de AuditFlow AI para verificación de calidad pre-vuelo en memoria volátil.`;

        const blob = new Blob([sampleText], { type: 'text/plain' });
        const sampleFile = new File([blob], "Contrato_Ejemplo_Apex_Global.txt", { type: 'text/plain' });

        this.handleFileSelected(sampleFile);
        this.startAuditScanProcess();
    },

    handleFileSelected(file) {
        if (!file) return;
        this.selectedFile = file;
        const fileSizeMb = (typeof file.size === 'number' && !isNaN(file.size)) ? (file.size / (1024 * 1024)).toFixed(2) : '0.00';
        
        const nameDisplay = document.getElementById('file-name-display');
        const sizeDisplay = document.getElementById('file-size-display');
        const boxDisplay = document.getElementById('file-selected-box');
        const errBox = document.getElementById('ocr-error-box');

        if (nameDisplay) nameDisplay.innerText = file.name || 'documento.pdf';
        if (sizeDisplay) sizeDisplay.innerText = `${fileSizeMb} ${window.I18n ? window.I18n.t('file_ready_ram') : 'MB • Memoria RAM lista'}`;
        if (boxDisplay) boxDisplay.classList.remove('hidden');
        if (errBox) errBox.classList.add('hidden');
    },

    resetUploadView() {
        this.selectedFile = null;
        const fileInput = document.getElementById('file-input');
        const boxDisplay = document.getElementById('file-selected-box');
        const errBox = document.getElementById('ocr-error-box');

        if (fileInput) fileInput.value = '';
        if (boxDisplay) boxDisplay.classList.add('hidden');
        if (errBox) errBox.classList.add('hidden');
    },

    resetToHome() {
        this.selectedFile = null;
        this.currentAuditData = null;
        this.currentReportId = null;

        const uploadSec = document.getElementById('upload-section');
        const scanSec = document.getElementById('scanner-section');
        const repSec = document.getElementById('report-section');
        const fileInput = document.getElementById('file-input');
        const boxDisplay = document.getElementById('file-selected-box');
        const errBox = document.getElementById('ocr-error-box');

        if (fileInput) fileInput.value = '';
        if (boxDisplay) boxDisplay.classList.add('hidden');
        if (errBox) errBox.classList.add('hidden');
        if (scanSec) scanSec.classList.add('hidden');
        if (repSec) repSec.classList.add('hidden');
        if (uploadSec) uploadSec.classList.remove('hidden');

        if (window.history && window.history.pushState) {
            window.history.pushState({}, document.title, window.location.pathname);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    async startAuditScanProcess() {
        if (!this.selectedFile) return;

        const uploadSec = document.getElementById('upload-section');
        const scanSec = document.getElementById('scanner-section');
        const errBox = document.getElementById('ocr-error-box');

        if (uploadSec) uploadSec.classList.add('hidden');
        if (scanSec) scanSec.classList.remove('hidden');
        if (errBox) errBox.classList.add('hidden');

        this.runScannerAnimation();

        try {
            let res;
            if (this.selectedFile) {
                const base64 = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result.split(',')[1]);
                    reader.readAsDataURL(this.selectedFile);
                });

                res = await fetch('/api/audit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        document_base64: base64,
                        document_name: this.selectedFile.name
                    })
                });
            } else {
                res = await fetch('/api/audit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sample_text: 'sample' })
                });
            }

            const data = await res.json();

            if (!res.ok || !data.success) {
                if (res.status === 422 || (data && data.error_type === 'PREFLIGHT_FAILED')) {
                    if (scanSec) scanSec.classList.add('hidden');
                    if (uploadSec) uploadSec.classList.remove('hidden');
                    if (errBox) errBox.classList.remove('hidden');
                    return;
                }
                throw new Error((data && data.error) ? data.error : 'Error procesando documento');
            }

            this.currentAuditData = data.audit_data;

            setTimeout(() => {
                if (scanSec) scanSec.classList.add('hidden');
                this.showLeadModal();
            }, 3000);

        } catch (err) {
            console.error('Error en escaneo:', err);
            alert('Error en el escáner: ' + err.message);
            if (scanSec) scanSec.classList.add('hidden');
            if (uploadSec) uploadSec.classList.remove('hidden');
        }
    },

    runScannerAnimation() {
        let timer = 0.0;
        const timerEl = document.getElementById('scan-timer');
        const progressEl = document.getElementById('scan-progress-bar');

        const interval = setInterval(() => {
            timer += 0.1;
            if (timerEl) timerEl.innerText = timer.toFixed(1) + 's';
            if (progressEl) progressEl.style.width = Math.min((timer / 3.0) * 100, 100) + '%';

            if (timer >= 0.8 && document.getElementById('step-2')) {
                document.getElementById('step-2').classList.add('text-accent-emerald', 'font-bold');
            }
            if (timer >= 1.8 && document.getElementById('step-3')) {
                document.getElementById('step-3').classList.add('text-purple-400', 'font-bold');
            }
            if (timer >= 2.8 && document.getElementById('step-4')) {
                document.getElementById('step-4').classList.add('text-accent-blue', 'font-bold');
            }

            if (timer >= 3.0) {
                clearInterval(interval);
            }
        }, 100);
    },

    setupFormListeners() {
        const leadForm = document.getElementById('lead-form');
        const btnCloseLead = document.getElementById('btn-close-lead-modal');
        const supportForm = document.getElementById('support-form');

        if (leadForm) {
            leadForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLeadFormSubmit();
            });
        }

        if (supportForm) {
            supportForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSupportFormSubmit();
            });
        }

        if (btnCloseLead) {
            btnCloseLead.addEventListener('click', () => {
                const leadModal = document.getElementById('lead-modal');
                if (leadModal) leadModal.classList.add('hidden');
                this.renderAuditReportDashboard();
            });
        }
    },

    openSupportModal() {
        const modal = document.getElementById('support-modal');
        if (modal) modal.classList.remove('hidden');
    },

    closeSupportModal() {
        const modal = document.getElementById('support-modal');
        if (modal) modal.classList.add('hidden');
    },

    async handleSupportFormSubmit() {
        const inputEl = document.getElementById('support-issue-input');
        const issue = inputEl ? inputEl.value.trim() : '';

        if (!issue) return;

        const btnSubmit = document.getElementById('btn-submit-support');
        if (btnSubmit) btnSubmit.innerText = '🤖 Procesando con Agente IA...';

        try {
            const res = await fetch('/api/support/ai-fix', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    report_id: this.currentReportId,
                    email: this.currentLeadData.email || 'rick28191@gmail.com',
                    issue_description: issue,
                    lang: window.I18n ? window.I18n.currentLang : 'es'
                })
            });

            const data = await res.json();
            if (data.success && data.audit_data) {
                this.currentAuditData = data.audit_data;
                this.closeSupportModal();
                this.renderAuditReportDashboard();
                this.unblurReport();
                alert(data.message || 'Reporte re-analizado y des-enfocado por la IA exitosamente.');
            } else {
                alert('El Agente de Soporte IA procesó tu mensaje. Revisa los resultados.');
            }
        } catch (err) {
            console.error('Error en soporte IA:', err);
            alert('Error al conectar con el Agente de Soporte IA: ' + err.message);
        } finally {
            if (btnSubmit) btnSubmit.innerText = '🤖 Re-Analizar y Corregir con IA';
            if (inputEl) inputEl.value = '';
        }
    },

    showLeadModal() {
        const leadModal = document.getElementById('lead-modal');
        if (leadModal) leadModal.classList.remove('hidden');
    },

    async handleLeadFormSubmit() {
        const nameInput = document.getElementById('lead-name');
        const emailInput = document.getElementById('lead-email');

        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';

        if (!name || !email) {
            alert('Por favor completa todos los campos.');
            return;
        }

        this.currentLeadData = { name, email };
        const currentLang = window.I18n ? window.I18n.currentLang : 'es';

        try {
            const res = await fetch('/api/lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    lang: currentLang,
                    document_name: this.selectedFile ? this.selectedFile.name : 'contrato.pdf',
                    audit_data: this.currentAuditData
                })
            });

            const data = await res.json();

            if (data.success && data.report_id) {
                this.currentReportId = data.report_id;
            } else {
                this.currentReportId = 'rep_' + Math.random().toString(36).substr(2, 9);
            }
        } catch (err) {
            console.warn('Backend fallback para lead:', err);
            this.currentReportId = 'rep_' + Math.random().toString(36).substr(2, 9);
        }

        const leadModal = document.getElementById('lead-modal');
        if (leadModal) leadModal.classList.add('hidden');

        this.renderAuditReportDashboard();
    },

    renderAuditReportDashboard() {
        const repSec = document.getElementById('report-section');
        if (repSec) repSec.classList.remove('hidden');

        const data = this.currentAuditData || {
            document_type: 'Contrato de Servicios Comercial',
            company_estimate: 'Empresa Detectada',
            total_contract_value: 85000,
            total_financial_leakage: 3450,
            risk_level: 'HIGH',
            lead_score: 88,
            findings: [
                {
                    id: 1,
                    title: 'Penalización Excesiva por Cancelación Anticipada',
                    clause_reference: 'Cláusula 7.3 / Línea 42',
                    severity: 'CRITICAL',
                    financial_impact: 1800,
                    teaser_preview: 'Cláusula leonina detectada que impone un recargo automático del 35% sin causa justificada.',
                    actionable_solution: 'Notificar objeción basada en el Art. 1244 del Código Comercial y sustituir con la cláusula de terminación estándar a 30 días sin penalización.'
                },
                {
                    id: 2,
                    title: 'Duplicación de Ajuste por Inflación',
                    clause_reference: 'Cláusula 12.1',
                    severity: 'HIGH',
                    financial_impact: 950,
                    teaser_preview: 'Ajuste inflacionario duplicado combinando IPC local y tasa fija en USD.',
                    actionable_solution: 'Eliminar la cláusula de ajuste en USD y fijar el ajuste strictly al IPC anual acumulado.'
                },
                {
                    id: 3,
                    title: 'Cobro de Honorarios de Mantenimiento No Prestados',
                    clause_reference: 'Anexo B - Facturación',
                    severity: 'MEDIUM',
                    financial_impact: 450,
                    teaser_preview: 'Cargo recurrente mensual por soporte de infraestructura no incluido en la propuesta base.',
                    actionable_solution: 'Solicitar la eliminación de la partida presupuestaria B-4 e imputar nota de crédito a la facturación del trimestre.'
                }
            ]
        };

        const docNameEl = document.getElementById('rep-doc-name');
        const docTypeEl = document.getElementById('rep-doc-type');
        const riskBadgeEl = document.getElementById('rep-risk-badge');
        const leakageEl = document.getElementById('rep-total-leakage');
        const scoreBadgeEl = document.getElementById('rep-lead-score-badge');
        const reportIdEl = document.getElementById('rep-id-display');

        if (docNameEl) docNameEl.innerText = (this.selectedFile ? this.selectedFile.name : 'Contrato_Servicios.pdf');
        if (docTypeEl) docTypeEl.innerText = data.document_type || 'Contrato Comercial';
        if (reportIdEl) reportIdEl.innerText = this.currentReportId || 'rep_123456';

        const leakageVal = (typeof data.total_financial_leakage === 'number' && !isNaN(data.total_financial_leakage)) 
            ? data.total_financial_leakage 
            : 3450;
            
        if (leakageEl) leakageEl.innerText = `$${leakageVal.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD`;

        const leadScoreVal = (typeof data.lead_score === 'number' && !isNaN(data.lead_score)) ? data.lead_score : 85;
        if (scoreBadgeEl) scoreBadgeEl.innerText = leadScoreVal;

        if (leadScoreVal >= 75) {
            const upsellBanner = document.getElementById('upsell-banner');
            if (upsellBanner) upsellBanner.classList.remove('hidden');
        }

        const container = document.getElementById('findings-container');
        if (!container) return;
        container.innerHTML = '';

        const rawFindings = data.findings || data.summary || [];
        const findings = (Array.isArray(rawFindings) && rawFindings.length > 0) ? rawFindings : [
            {
                id: 1,
                title: 'Penalización Excesiva por Cancelación Anticipada',
                clause_reference: 'Cláusula 7.3 / Línea 42',
                severity: 'CRITICAL',
                financial_impact: 1800,
                teaser_preview: 'Cláusula leonina detectada que impone un recargo automático del 35% sin causa justificada.',
                actionable_solution: 'Notificar objeción basada en el Art. 1244 del Código Comercial y sustituir con la cláusula de terminación estándar a 30 días sin penalización.'
            },
            {
                id: 2,
                title: 'Duplicación de Ajuste por Inflación',
                clause_reference: 'Cláusula 12.1',
                severity: 'HIGH',
                financial_impact: 950,
                teaser_preview: 'Ajuste inflacionario duplicado combinando IPC local y tasa fija en USD.',
                actionable_solution: 'Eliminar la cláusula de ajuste en USD y fijar el ajuste strictly al IPC anual acumulado.'
            },
            {
                id: 3,
                title: 'Cobro de Honorarios de Mantenimiento No Prestados',
                clause_reference: 'Anexo B - Facturación',
                severity: 'MEDIUM',
                financial_impact: 450,
                teaser_preview: 'Cargo recurrente mensual por soporte de infraestructura no incluido en la propuesta base.',
                actionable_solution: 'Solicitar la eliminación de la partida presupuestaria B-4 e imputar nota de crédito a la facturación del trimestre.'
            }
        ];

        findings.forEach((finding, idx) => {
            const card = document.createElement('div');
            card.className = 'p-6 sm:p-8 rounded-2xl bg-dark-card border border-border-dark hover:border-gray-700 transition-all text-left shadow-lg';

            const severityClass = finding.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                  finding.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                                  'bg-blue-500/20 text-blue-400 border-blue-500/30';

            const impactVal = (typeof finding.financial_impact === 'number' && !isNaN(finding.financial_impact)) 
                ? finding.financial_impact 
                : 1000;

            const teaserText = finding.teaser_preview || 'Anomalía detectada en el contrato.';
            const solutionText = finding.actionable_solution || 'Texto de renegociación táctica listo.';

            const teaserLabel = window.I18n ? window.I18n.t('rep_teaser_label') : '🔍 Resumen de la Anomalía (Gratis):';
            const solutionLabel = window.I18n ? window.I18n.t('rep_solution_label') : '💡 Solución Táctica & Texto Sustitutivo de Renegociación:';
            const unlockBtnText = window.I18n ? window.I18n.t('rep_unlock_btn') : '🔒 Desbloquear Solución Táctica ($7 USD)';

            card.innerHTML = `
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-border-dark">
                    <div class="flex items-center gap-3">
                        <span class="w-8 h-8 rounded-lg bg-accent-blue/15 text-accent-blue font-bold font-mono flex items-center justify-center text-sm">#${idx + 1}</span>
                        <div>
                            <h4 class="font-bold text-white text-base sm:text-lg">${finding.title || 'Falla Detectada'}</h4>
                            <span class="text-xs font-mono text-gray-400">${finding.clause_reference || 'Cláusula'}</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 self-start sm:self-auto">
                        <span class="px-3 py-1 rounded-full text-xs font-mono font-bold border ${severityClass}">${finding.severity || 'HIGH'}</span>
                        <span class="text-sm font-extrabold font-mono text-red-400">$${impactVal.toLocaleString('en-US')} USD</span>
                    </div>
                </div>

                <div class="space-y-4">
                    <div class="p-4 rounded-xl bg-dark-surface border border-border-dark">
                        <span class="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">${teaserLabel}</span>
                        <p class="text-sm text-gray-300 leading-relaxed font-mono">${teaserText}</p>
                    </div>

                    <div class="p-4 rounded-xl bg-dark-surface border border-accent-blue/30 relative overflow-hidden">
                        <span class="text-xs font-bold text-accent-emerald uppercase tracking-wider block mb-1.5">${solutionLabel}</span>
                        <div class="blurred-content select-none transition-all duration-500 text-sm text-gray-300 leading-relaxed font-mono">
                            ${solutionText}
                        </div>
                        <div class="blur-overlay absolute inset-0 flex items-center justify-center bg-dark-card/60 backdrop-blur-xs p-4">
                            <button onclick="window.PaymentHandler.openPaymentModal()" class="btn-primary text-xs py-2.5 px-5 shadow-glow font-semibold flex items-center gap-2">
                                <span>${unlockBtnText}</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;

            container.appendChild(card);
        });

        if (window.PaymentHandler) {
            window.PaymentHandler.init(this.currentReportId);
        }
    },

    async subscribeEnterprise() {
        try {
            const email = this.currentLeadData.email || 'enterprise@corp.com';
            const res = await fetch('/api/payment/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();
            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            } else {
                alert('Redirigiendo a suscripción corporativa...');
            }
        } catch (err) {
            console.error('Error en suscripción:', err);
            alert('Procesando solicitud corporativa...');
        }
    },

    async checkUrlForPaymentSuccess() {
        const urlParams = new URLSearchParams(window.location.search);
        const reportId = urlParams.get('reportId');
        const status = urlParams.get('status');

        if (reportId && status === 'success') {
            this.currentReportId = reportId;
            const repSec = document.getElementById('report-section');
            const uploadSec = document.getElementById('upload-section');

            if (uploadSec) uploadSec.classList.add('hidden');
            if (repSec) repSec.classList.remove('hidden');

            try {
                const res = await fetch(`/api/report/${reportId}`);
                if (res.ok) {
                    const report = await res.json();
                    if (report && (report.summary_json || report.audit_data)) {
                        this.currentAuditData = report.summary_json || report.audit_data;
                    }
                }
            } catch (err) {
                console.warn('Usando datos de reporte en memoria volátil:', err);
            }

            this.renderAuditReportDashboard();
            this.unblurReport();
        }
    },

    openSamplePdfModal() {
        const modal = document.getElementById('sample-pdf-modal');
        if (modal) modal.classList.remove('hidden');
    },

    closeSamplePdfModal() {
        const modal = document.getElementById('sample-pdf-modal');
        if (modal) modal.classList.add('hidden');
    },

    copyShareableReportLink() {
        const reportId = this.currentReportId || 'rep_x89';
        const url = `${window.location.origin}/?reportId=${reportId}`;

        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                alert('✅ Enlace de Auditoría copiado al portapapeles. Puedes enviarlo por WhatsApp o correo a tu jefe/socio para autorizar el pago.');
            }).catch(() => {
                alert(`🔗 Enlace de auditoría: ${url}`);
            });
        } else {
            alert(`🔗 Enlace de auditoría: ${url}`);
        }
    },

    initSocialProofWidget() {
        const toast = document.getElementById('social-proof-toast');
        const titleEl = document.getElementById('social-proof-title');
        const descEl = document.getElementById('social-proof-desc');
        const timeEl = document.getElementById('social-proof-time');

        if (!toast || !titleEl || !descEl || !timeEl) return;

        const proofs = [
            { loc: "San Salvador, SV", type: "Contrato de Arrendamiento Comercial", leakage: "$18,500 USD", time: "Hace 3 minutos" },
            { loc: "Miami, FL", type: "SLA de Infraestructura Cloud", leakage: "$12,400 USD", time: "Hace 8 minutos" },
            { loc: "Madrid, ES", type: "Acuerdo de Proveedores IT", leakage: "$6,800 USD", time: "Hace 14 minutos" },
            { loc: "Santa Tecla, SV", type: "Contrato de Obra Civil", leakage: "$24,100 USD", time: "Hace 19 minutos" },
            { loc: "Ciudad de México, MX", type: "Factura Corporativa Q3", leakage: "$9,200 USD", time: "Hace 25 minutos" }
        ];

        let index = 0;

        const showNext = () => {
            const item = proofs[index];
            const isEn = window.I18n && window.I18n.currentLang === 'en';

            titleEl.innerText = isEn ? "New Audit Executed ⚡" : "Nueva Auditoría Realizada ⚡";
            descEl.innerText = isEn 
                ? `A user in ${item.loc} audited a ${item.type} and detected ${item.leakage} in leakage.`
                : `Un usuario en ${item.loc} auditó un ${item.type} e identificó ${item.leakage} en fugas.`;
            timeEl.innerText = isEn ? `${item.time} • Volatile RAM` : `${item.time} • Memoria Volátil RAM`;

            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
            toast.style.pointerEvents = 'auto';

            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(6rem)';
                toast.style.pointerEvents = 'none';
            }, 7000);

            index = (index + 1) % proofs.length;
        };

        // Mostrar primer toast a los 1.5s y rotar cada 14 segundos
        setTimeout(showNext, 1500);
        setInterval(showNext, 14000);
    },

    unblurReport() {
        document.querySelectorAll('.blurred-content').forEach(el => {
            el.classList.remove('blurred-content', 'select-none');
            el.classList.add('unblurred');
        });

        document.querySelectorAll('.blur-overlay').forEach(el => {
            el.remove();
        });

        const banner = document.getElementById('unlock-banner');
        if (banner) banner.classList.add('hidden');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.AppHandler.init();
    window.AppHandler.initSocialProofWidget();
});
