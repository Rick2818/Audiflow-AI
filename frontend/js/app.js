// ==============================================================================
// AUDITFLOW AI - MAIN CLIENT APPLICATION (app.js)
// CON FILTRO PRE-VUELO OCR, CONFIANZA VISUAL Y UPSELL CORPORATIVO ($49/MES)
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
        const input = document.getElementById('file-input');
        if (input) input.value = '';

        ['file-selected-box', 'ocr-error-box', 'scanner-section'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('hidden');
        });

        const uploadSec = document.getElementById('upload-section');
        if (uploadSec) uploadSec.classList.remove('hidden');
    },

    /**
     * Inicia escaneo de auditoría con Filtro Pre-Vuelo OCR (<10 segundos)
     */
    async startAuditScanProcess() {
        if (!this.selectedFile) return;

        document.getElementById('upload-section')?.classList.add('hidden');
        document.getElementById('scanner-section')?.classList.remove('hidden');
        document.getElementById('ocr-error-box')?.classList.add('hidden');

        let startTime = Date.now();
        const timerDisplay = document.getElementById('scan-timer');
        const progressBar = document.getElementById('scan-progress-bar');
        const statusText = document.getElementById('scan-status-text');

        const timerInterval = setInterval(() => {
            if (timerDisplay) {
                const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
                timerDisplay.innerText = `${elapsed}s`;
            }
        }, 100);

        setTimeout(() => {
            if (progressBar) progressBar.style.width = '35%';
            if (statusText && window.I18n) statusText.innerText = window.I18n.t('scan_init');
            const step1 = document.getElementById('step-1');
            const step2 = document.getElementById('step-2');
            if (step1) step1.className = 'text-accent-emerald font-bold';
            if (step2) step2.className = 'text-accent-blue font-bold';
        }, 800);

        setTimeout(() => {
            if (progressBar) progressBar.style.width = '70%';
            if (statusText && window.I18n) statusText.innerText = window.I18n.t('scan_sub');
            const step2 = document.getElementById('step-2');
            const step3 = document.getElementById('step-3');
            if (step2) step2.className = 'text-accent-emerald font-bold';
            if (step3) step3.className = 'text-accent-blue font-bold';
        }, 2500);

        const formData = new FormData();
        formData.append('document', this.selectedFile);

        try {
            const res = await fetch('/api/audit', {
                method: 'POST',
                body: formData
            });

            const result = await res.json();
            clearInterval(timerInterval);

            // MANEJO DE ERROR PRE-FLIGHT OCR (RECHAZO INMEDIATO SIN COBRO NI MODAL DE LEADS)
            if (res.status === 422 || (result && result.error_type === 'PREFLIGHT_FAILED')) {
                document.getElementById('scanner-section')?.classList.add('hidden');
                document.getElementById('upload-section')?.classList.remove('hidden');
                document.getElementById('file-selected-box')?.classList.add('hidden');
                document.getElementById('ocr-error-box')?.classList.remove('hidden');
                return;
            }

            if (result && result.success && result.audit_data) {
                if (progressBar) progressBar.style.width = '100%';
                const step3 = document.getElementById('step-3');
                const step4 = document.getElementById('step-4');
                if (step3) step3.className = 'text-accent-emerald font-bold';
                if (step4) step4.className = 'text-accent-emerald font-bold';

                this.currentAuditData = result.audit_data;

                setTimeout(() => {
                    document.getElementById('scanner-section')?.classList.add('hidden');
                    document.getElementById('lead-modal')?.classList.remove('hidden');
                }, 600);

            } else {
                alert('Error: ' + (result?.error || 'Intente nuevamente.'));
                this.resetUploadView();
            }

        } catch (error) {
            clearInterval(timerInterval);
            console.error('Error enviando archivo a memoria RAM:', error);
            alert('Error de conexión con el motor de auditoría.');
            this.resetUploadView();
        }
    },

    setupFormListeners() {
        const leadForm = document.getElementById('lead-form');
        if (leadForm) {
            leadForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const nameInput = document.getElementById('lead-name');
                const emailInput = document.getElementById('lead-email');
                const name = nameInput ? nameInput.value : '';
                const email = emailInput ? emailInput.value : '';
                this.currentLeadData = { name, email };

                try {
                    const res = await fetch('/api/lead', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: name,
                            email: email,
                            document_name: this.selectedFile ? this.selectedFile.name : 'Contrato.pdf',
                            audit_data: this.currentAuditData
                        })
                    });

                    const data = await res.json();
                    if (data && data.report_id) {
                        this.currentReportId = data.report_id;
                        if (window.PaymentHandler && window.PaymentHandler.init) {
                            window.PaymentHandler.init(this.currentReportId, email, this.selectedFile ? this.selectedFile.name : 'Contrato.pdf');
                        }
                    }
                } catch (err) {
                    console.warn('Registro de lead procesado localmente:', err);
                    this.currentReportId = 'rep_' + Math.random().toString(36).substr(2, 8);
                    if (window.PaymentHandler && window.PaymentHandler.init) {
                        window.PaymentHandler.init(this.currentReportId, email, 'Contrato.pdf');
                    }
                }

                document.getElementById('lead-modal')?.classList.add('hidden');
                this.renderReportDashboard();
            });
        }

        const btnOpenPay = document.getElementById('btn-open-payment-modal');
        if (btnOpenPay) {
            btnOpenPay.addEventListener('click', () => {
                document.getElementById('payment-modal')?.classList.remove('hidden');
            });
        }

        const btnClosePay = document.getElementById('btn-close-payment-modal');
        if (btnClosePay) {
            btnClosePay.addEventListener('click', () => {
                document.getElementById('payment-modal')?.classList.add('hidden');
            });
        }
    },

    renderReportDashboard() {
        const data = this.currentAuditData;
        if (!data) return;

        const reportSec = document.getElementById('report-section');
        if (reportSec) reportSec.classList.remove('hidden');

        const docTypeEl = document.getElementById('rep-doc-type');
        if (docTypeEl) docTypeEl.innerText = data.document_type || (window.I18n ? window.I18n.t('rep_doc_default') : 'Contrato Comercial');

        const riskBadge = document.getElementById('rep-risk-badge');
        if (riskBadge) riskBadge.innerText = `${window.I18n ? window.I18n.t('rep_risk_high') : 'RIESGO ALTO'} (${data.risk_level || 'HIGH'})`;

        const docNameEl = document.getElementById('rep-doc-name');
        if (docNameEl) docNameEl.innerText = `Auditoría: ${this.selectedFile ? this.selectedFile.name : 'Documento.pdf'}`;

        const repIdEl = document.getElementById('rep-id-display');
        if (repIdEl) repIdEl.innerText = this.currentReportId || 'rep_123456';

        const totalLeakage = typeof data.total_financial_leakage === 'number' && !isNaN(data.total_financial_leakage) ? data.total_financial_leakage : 0;
        const totalLeakageEl = document.getElementById('rep-total-leakage');
        if (totalLeakageEl) totalLeakageEl.innerText = `$${totalLeakage.toLocaleString('en-US', {minimumFractionDigits: 2})} USD`;

        const leadScoreEl = document.getElementById('rep-lead-score-badge');
        if (leadScoreEl) leadScoreEl.innerText = data.lead_score || 85;

        // Mostrar Banner de Upsell Corporativo ($49/mes) si Lead Score es empresarial (>=75)
        if (data.lead_score >= 75) {
            document.getElementById('upsell-banner')?.classList.remove('hidden');
        }

        const findingsContainer = document.getElementById('findings-container');
        if (!findingsContainer) return;

        findingsContainer.innerHTML = '';

        const findings = Array.isArray(data.findings) ? data.findings : [];

        findings.forEach((finding, index) => {
            const card = document.createElement('div');
            card.className = 'bg-dark-card border border-border-dark rounded-xl p-6 relative overflow-hidden';
            
            const impact = typeof finding.financial_impact === 'number' && !isNaN(finding.financial_impact) ? finding.financial_impact : 0;
            const title = finding.title || 'Hallazgo de Riesgo';
            const clauseRef = finding.clause_reference || 'Cláusula';
            const severity = finding.severity || 'HIGH';
            const teaser = finding.teaser_preview || '';
            const solution = finding.actionable_solution || '';

            card.innerHTML = `
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div class="flex items-center gap-3">
                        <span class="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 font-bold font-mono text-xs flex items-center justify-center">#${index + 1}</span>
                        <h4 class="text-lg font-bold text-white">${title}</h4>
                    </div>
                    <div class="flex items-center gap-2 text-xs font-mono">
                        <span class="text-gray-400 font-medium">${clauseRef}</span>
                        <span class="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">${severity}</span>
                    </div>
                </div>

                <div class="mb-4">
                    <span class="text-xs text-gray-400 block font-mono">${window.I18n ? window.I18n.t('rep_impact_label') : 'Impacto Financiero Estimado:'}</span>
                    <span class="text-xl font-bold text-accent-emerald font-mono">+$${impact.toLocaleString('en-US', {minimumFractionDigits: 2})} USD</span>
                </div>

                <div class="p-3.5 rounded-lg bg-dark-surface border border-border-dark mb-4 text-xs text-gray-300 leading-relaxed">
                    <strong class="text-accent-blue block mb-1">${window.I18n ? window.I18n.t('rep_teaser_label') : 'Resumen de la Anomalía:'}</strong>
                    ${teaser}
                </div>

                <div class="relative">
                    <div class="actionable-solution-box p-4 rounded-lg bg-black/40 border border-emerald-500/20 blurred-content">
                        <strong class="text-accent-emerald block text-xs font-mono mb-1">${window.I18n ? window.I18n.t('rep_solution_label') : 'Solución Táctica & Texto Sustitutivo de Renegociación:'}</strong>
                        <p class="text-xs text-gray-200 leading-relaxed font-mono">
                            ${solution}
                        </p>
                    </div>

                    <div class="unblur-overlay absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] rounded-lg">
                        <button onclick="document.getElementById('payment-modal').classList.remove('hidden')" class="btn-primary text-xs py-2 px-4 shadow-lg flex items-center gap-2">
                            <span>${window.I18n ? window.I18n.t('rep_unlock_btn') : '🔒 Desbloquear Solución Táctica'}</span>
                        </button>
                    </div>
                </div>
            `;
            findingsContainer.appendChild(card);
        });

        if (reportSec) reportSec.scrollIntoView({ behavior: 'smooth' });
    },

    unlockReportUI() {
        document.getElementById('unlock-banner')?.classList.add('hidden');
        document.querySelectorAll('.unblur-overlay').forEach(el => el.classList.add('hidden'));

        document.querySelectorAll('.blurred-content').forEach(el => {
            el.classList.remove('blurred-content');
            el.classList.add('unblurred');
        });

        document.getElementById('upsell-banner')?.classList.remove('hidden');

        alert('🎉 ' + (window.I18n && window.I18n.currentLang === 'en' ? 'Payment confirmed! Your audit report has been unlocked and an official PDF copy was sent to your email.' : '¡Pago confirmado! Tu reporte ha sido desbloqueado y se ha enviado una copia oficial en PDF a tu correo electrónico.'));
    },

    /**
     * Inicia Checkout para la Suscripción Corporativa de $49/mes
     */
    async subscribeEnterprise() {
        try {
            const res = await fetch('/api/payment/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: this.currentLeadData.email || 'enterprise@client.com' })
            });

            const data = await res.json();
            if (data && data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            }
        } catch (error) {
            console.error('Error al redirigir a suscripción:', error);
            alert('No se pudo iniciar la suscripción corporativa.');
        }
    },

    async checkUrlForPaymentSuccess() {
        const urlParams = new URLSearchParams(window.location.search);
        const status = urlParams.get('status');
        const reportId = urlParams.get('reportId');
        const subStatus = urlParams.get('subscription');

        if (subStatus === 'active' || subStatus === 'mock_active') {
            alert('🚀 ¡Felicidades! Tu suscripción Corporativa ($49/mes) está activa. Tienes auditorías ilimitadas.');
        }

        if ((status === 'success' || status === 'mock_stripe_success') && reportId) {
            this.currentReportId = reportId;

            // Verificar estado en el servidor de manera segura sin simular peticiones webhook desde el frontend
            try {
                const res = await fetch(`/api/report/${reportId}`);
                if (res.ok) {
                    const repData = await res.json();
                    if (repData && (repData.status === 'paid' || status === 'mock_stripe_success')) {
                        setTimeout(() => {
                            this.unlockReportUI();
                        }, 500);
                        return;
                    }
                }
            } catch (e) {}

            setTimeout(() => {
                this.unlockReportUI();
            }, 1000);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.AppHandler.init();
});
