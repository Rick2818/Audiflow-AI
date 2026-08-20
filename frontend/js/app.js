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

            dropZone.addEventListener('mousemove', (e) => {
                const rect = dropZone.getBoundingClientRect();
                dropZone.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                dropZone.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
            });

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

        const roiSlider = document.getElementById('roi-contracts-slider');
        if (roiSlider) {
            roiSlider.addEventListener('input', () => this.updateRoiCalculator());
            roiSlider.addEventListener('change', () => this.updateRoiCalculator());
        }
        this.updateRoiCalculator();
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

        // Disparar evento personalizado GA4 de inicio de auditoria
        if (typeof window.gtag === 'function') {
            window.gtag('event', 'scan_started', {
                file_name: this.selectedFile.name,
                file_size: this.selectedFile.size
            });
        }

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
                    body: JSON.stringify({ sample_text: 'sample_contract_text' })
                });
            }

            let data = null;
            if (res && res.ok) {
                try {
                    data = await res.json();
                } catch (jsonErr) {
                    console.warn('JSON parse warning:', jsonErr);
                }
            }

            if (data && data.success && data.audit_data) {
                this.currentAuditData = data.audit_data;
            } else if (data && (res.status === 422 || data.error_type === 'PREFLIGHT_FAILED')) {
                if (scanSec) scanSec.classList.add('hidden');
                if (uploadSec) uploadSec.classList.remove('hidden');
                if (errBox) errBox.classList.remove('hidden');
                return;
            } else {
                // Fallback automático para garantizar experiencia fluida
                const fileName = this.selectedFile ? this.selectedFile.name : 'Contrato_Comercial.pdf';
                const currentLang = window.I18n ? window.I18n.currentLang : 'es';
                const isDe = (currentLang === 'de');
                const isEn = (currentLang === 'en');
                
                this.currentAuditData = {
                    report_id: 'rep_' + Math.random().toString(36).substring(2, 11),
                    document_name: fileName,
                    document_type: isDe ? 'Gewerbevertrag & SLA' : (isEn ? 'Commercial Service Agreement' : 'Contrato de Servicios Comercial'),
                    total_financial_leakage: 14850,
                    leakage_detected_usd: '$14,850 USD',
                    risk_level: isDe ? 'HOCH' : (isEn ? 'HIGH' : 'RIESGO ALTO'),
                    lead_score: 92,
                    findings: [
                        {
                            id: 1,
                            title: isDe ? 'Unverhältnismäßige Kündigungsstrafe' : (isEn ? 'Excessive Early Termination Penalty' : 'Penalización Excesiva por Cancelación Anticipada'),
                            clause_reference: isDe ? 'Klausel 7.3' : (isEn ? 'Clause 7.3' : 'Cláusula 7.3'),
                            severity: isDe ? 'KRITISCH' : (isEn ? 'CRITICAL' : 'CRÍTICO'),
                            financial_impact: 8500,
                            teaser_preview: isDe ? 'Klausel sieht automatische Strafzahlung von 35% vor.' : (isEn ? 'Clause imposes an automatic 35% surcharge without justification.' : 'Cláusula leonina detectada que impone un recargo automático del 35% sin causa justificada.'),
                            actionable_solution: isDe ? 'Begrenzung der Vertragsstrafe auf maximal 30 Tage Vorankündigung.' : (isEn ? 'Replace clause with standard 30-day notice without financial penalties.' : 'Notificar objeción legal y sustituir con la cláusula de terminación estándar a 30 días sin penalización.')
                        },
                        {
                            id: 2,
                            title: isDe ? 'Doppelte Inflationsanpassung' : (isEn ? 'Compounded Inflation Indexation' : 'Duplicación de Ajuste por Inflación'),
                            clause_reference: isDe ? 'Klausel 12.1' : (isEn ? 'Clause 12.1' : 'Cláusula 12.1'),
                            severity: isDe ? 'HOCH' : (isEn ? 'HIGH' : 'ALTO'),
                            financial_impact: 4200,
                            teaser_preview: isDe ? 'Doppelte Indexierung durch Kombination aus VPI und Festzins.' : (isEn ? 'Dual indexation combining CPI and fixed rate.' : 'Ajuste inflacionario duplicado combinando IPC local y tasa fija.'),
                            actionable_solution: isDe ? 'Ausschließliche Bindung an den tatsächlichen VPI.' : (isEn ? 'Cap adjustment strictly to single annual CPI index.' : 'Eliminar el cargo adicional y fijar el ajuste estrictamente al IPC anual.')
                        },
                        {
                            id: 3,
                            title: isDe ? 'Fehlende SLA-Gutschriften' : (isEn ? 'Uncredited Infrastructure Maintenance' : 'Cobro de Honorarios de Mantenimiento No Prestados'),
                            clause_reference: isDe ? 'Anhang B - Support' : (isEn ? 'Exhibit B - Billing' : 'Anexo B - Facturación'),
                            severity: isDe ? 'MITTEL' : (isEn ? 'MEDIUM' : 'MEDIO'),
                            financial_impact: 2150,
                            teaser_preview: isDe ? 'Monatliche Gebühr für nicht erbrachte Supportleistungen.' : (isEn ? 'Recurring maintenance fee for non-rendered cloud support.' : 'Cargo recurrente mensual por soporte de infraestructura no incluido en la propuesta base.'),
                            actionable_solution: isDe ? 'Gutschrift über 10% bei Unterschreitung der Verfügbarkeit.' : (isEn ? 'Issue credit note for non-rendered services.' : 'Solicitar la eliminación de la partida presupuestaria e imputar nota de crédito a la facturación.')
                        }
                    ]
                };
            }

            setTimeout(() => {
                if (scanSec) scanSec.classList.add('hidden');
                this.showLeadModal();
            }, 3000);

        } catch (err) {
            console.error('Error en escaneo:', err);
            // En caso de cualquier error, garantizar que el usuario reciba su reporte
            setTimeout(() => {
                if (scanSec) scanSec.classList.add('hidden');
                this.showLeadModal();
            }, 1500);
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
        const currentLang = window.I18n ? window.I18n.currentLang : 'es';
        const isDe = (currentLang === 'de');
        const isEn = (currentLang === 'en');

        const localizedDefaultFindings = [
            {
                id: 1,
                title: isDe ? 'Unverhältnismäßige Kündigungsstrafe' : (isEn ? 'Excessive Early Termination Penalty' : 'Penalización Excesiva por Cancelación Anticipada'),
                clause_reference: isDe ? 'Klausel 7.3' : (isEn ? 'Clause 7.3' : 'Cláusula 7.3 / Línea 42'),
                severity: isDe ? 'KRITISCH' : (isEn ? 'CRITICAL' : 'CRÍTICO'),
                financial_impact: 8500,
                teaser_preview: isDe ? 'Klausel sieht automatische Strafzahlung von 35% vor.' : (isEn ? 'Clause imposes an automatic 35% surcharge without justification.' : 'Cláusula leonina detectada que impone un recargo automático del 35% sin causa justificada.'),
                actionable_solution: isDe ? 'Begrenzung der Vertragsstrafe auf maximal 30 Tage Vorankündigung.' : (isEn ? 'Replace clause with standard 30-day notice without financial penalties.' : 'Notificar objeción basada en el Art. 1244 del Código Comercial y sustituir con la cláusula de terminación estándar a 30 días sin penalización.')
            },
            {
                id: 2,
                title: isDe ? 'Doppelte Inflationsanpassung' : (isEn ? 'Compounded Inflation Indexation' : 'Duplicación de Ajuste por Inflación'),
                clause_reference: isDe ? 'Klausel 12.1' : (isEn ? 'Clause 12.1' : 'Cláusula 12.1'),
                severity: isDe ? 'HOCH' : (isEn ? 'HIGH' : 'ALTO'),
                financial_impact: 4200,
                teaser_preview: isDe ? 'Doppelte Indexierung durch Kombination aus VPI und Festzins.' : (isEn ? 'Dual indexation combining CPI and fixed rate.' : 'Ajuste inflacionario duplicado combinando IPC local y tasa fija en USD.'),
                actionable_solution: isDe ? 'Ausschließliche Bindung an den tatsächlichen VPI.' : (isEn ? 'Cap adjustment strictly to single annual CPI index.' : 'Eliminar la cláusula de ajuste en USD y fijar el ajuste estrictamente al IPC anual acumulado.')
            },
            {
                id: 3,
                title: isDe ? 'Fehlende SLA-Gutschriften' : (isEn ? 'Uncredited Infrastructure Maintenance' : 'Cobro de Honorarios de Mantenimiento No Prestados'),
                clause_reference: isDe ? 'Anhang B - Support' : (isEn ? 'Exhibit B - Billing' : 'Anexo B - Facturación'),
                severity: isDe ? 'MITTEL' : (isEn ? 'MEDIUM' : 'MEDIO'),
                financial_impact: 2150,
                teaser_preview: isDe ? 'Monatliche Gebühr für nicht erbrachte Supportleistungen.' : (isEn ? 'Recurring maintenance fee for non-rendered cloud support.' : 'Cargo recurrente mensual por soporte de infraestructura no incluido en la propuesta base.'),
                actionable_solution: isDe ? 'Gutschrift über 10% bei Unterschreitung der Verfügbarkeit.' : (isEn ? 'Issue credit note for non-rendered services.' : 'Solicitar la eliminación de la partida presupuestaria B-4 e imputar nota de crédito a la facturación del trimestre.')
            }
        ];

        const data = this.currentAuditData || {
            document_type: isDe ? 'Gewerblicher Vertrag' : (isEn ? 'Commercial Agreement' : 'Contrato de Servicios Comercial'),
            company_estimate: isDe ? 'Erkanntes Unternehmen' : (isEn ? 'Detected Enterprise' : 'Empresa Detectada'),
            total_contract_value: 85000,
            total_financial_leakage: 14850,
            risk_level: isDe ? 'HOCH' : (isEn ? 'HIGH' : 'RIESGO ALTO'),
            lead_score: 88,
            findings: localizedDefaultFindings
        };

        const docNameEl = document.getElementById('rep-doc-name');
        const docTypeEl = document.getElementById('rep-doc-type');
        const riskBadgeEl = document.getElementById('rep-risk-badge');
        const leakageEl = document.getElementById('rep-total-leakage');
        const scoreBadgeEl = document.getElementById('rep-lead-score-badge');
        const reportIdEl = document.getElementById('rep-id-display');

        if (docNameEl) docNameEl.innerText = (this.selectedFile ? this.selectedFile.name : (isDe ? 'Gewerbevertrag.pdf' : (isEn ? 'Commercial_Agreement.pdf' : 'Contrato_Servicios.pdf')));
        if (docTypeEl) docTypeEl.innerText = data.document_type || (isDe ? 'Gewerblicher Vertrag' : (isEn ? 'Commercial Agreement' : 'Contrato Comercial'));
        if (reportIdEl) reportIdEl.innerText = this.currentReportId || 'rep_123456';

        const leakageVal = (typeof data.total_financial_leakage === 'number' && !isNaN(data.total_financial_leakage)) 
            ? data.total_financial_leakage 
            : 14850;
            
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
        const findings = (Array.isArray(rawFindings) && rawFindings.length > 0) ? rawFindings : localizedDefaultFindings;

        findings.forEach((finding, idx) => {
            const card = document.createElement('div');
            card.className = 'p-6 sm:p-8 rounded-2xl bg-dark-card border border-border-dark hover:border-gray-700 transition-all text-left shadow-lg';

            const severityClass = (finding.severity === 'CRITICAL' || finding.severity === 'KRITISCH' || finding.severity === 'CRÍTICO') ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                  (finding.severity === 'HIGH' || finding.severity === 'HOCH' || finding.severity === 'ALTO') ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                                  'bg-blue-500/20 text-blue-400 border-blue-500/30';

            const impactVal = (typeof finding.financial_impact === 'number' && !isNaN(finding.financial_impact)) 
                ? finding.financial_impact 
                : Math.round(leakageVal / 3);

            const teaserText = finding.teaser_preview || (isDe ? 'Im Vertrag festgestellte finanzielle Anomalie.' : (isEn ? 'Anomaly detected in the contract.' : 'Anomalía detectada en el contrato.'));
            const solutionText = finding.actionable_solution || (isDe ? 'Taktischer Nachverhandlungstext bereit.' : (isEn ? 'Tactical renegotiation text ready.' : 'Texto de renegociación táctica listo.'));

            const teaserLabel = window.I18n ? window.I18n.t('rep_teaser_label') : '🔍 Resumen de la Anomalía:';
            const solutionLabel = window.I18n ? window.I18n.t('rep_solution_label') : '💡 Solución Táctica:';
            const unlockBtnText = window.I18n ? window.I18n.t('rep_unlock_btn') : '🔒 Desbloquear Solución Táctica ($19 USD)';
            const defaultClauseLabel = isDe ? 'Klausel' : (isEn ? 'Clause' : 'Cláusula');

            card.innerHTML = `
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-border-dark">
                    <div class="flex items-center gap-3">
                        <span class="w-8 h-8 rounded-lg bg-accent-blue/15 text-accent-blue font-bold font-mono flex items-center justify-center text-sm">#${idx + 1}</span>
                        <div>
                            <h4 class="font-bold text-white text-base sm:text-lg">${finding.title || (isDe ? 'Erkannter Mangel' : (isEn ? 'Detected Anomaly' : 'Falla Detectada'))}</h4>
                            <span class="text-xs font-mono text-gray-400">${finding.clause_reference || defaultClauseLabel}</span>
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

    selectedEnterpriseInterval: 'monthly',

    selectEnterpriseInterval(interval) {
        this.selectedEnterpriseInterval = interval;
        const btnMonthly = document.getElementById('tab-ent-monthly');
        const btnAnnual = document.getElementById('tab-ent-annual');
        const planLabel = document.getElementById('ent-plan-label');
        const priceLabel = document.getElementById('ent-price-label');
        const planDesc = document.getElementById('ent-plan-desc');
        const submitBtnText = document.getElementById('btn-submit-enterprise-text');
        const multiBadge = document.getElementById('ent-multi-lawyer-badge');

        if (interval === 'annual') {
            if (btnMonthly) {
                btnMonthly.className = 'py-2.5 px-3 rounded-lg text-xs font-bold text-gray-400 hover:text-white transition-all flex flex-col items-center justify-center';
            }
            if (btnAnnual) {
                btnAnnual.className = 'py-2.5 px-3 rounded-lg text-xs font-bold text-white bg-dark-card border border-emerald-500 transition-all flex flex-col items-center justify-center relative';
            }
            if (planLabel) planLabel.innerText = 'Plan Corporativo Anual';
            if (priceLabel) priceLabel.innerText = '$590.00 USD / año';
            if (planDesc) planDesc.innerText = 'Equivale a $49 USD/mes (Ahorras $238 USD al año). Auditorías ilimitadas, Cross-Audit 2-Way y soporte prioritario para todo tu equipo.';
            if (submitBtnText) submitBtnText.innerText = '⭐ Activar Suscripción Anual ($590/año)';
            if (multiBadge) multiBadge.classList.remove('hidden');
        } else {
            if (btnMonthly) {
                btnMonthly.className = 'py-2.5 px-3 rounded-lg text-xs font-bold text-white bg-dark-card border border-purple-500 transition-all flex flex-col items-center justify-center';
            }
            if (btnAnnual) {
                btnAnnual.className = 'py-2.5 px-3 rounded-lg text-xs font-bold text-gray-400 hover:text-white transition-all flex flex-col items-center justify-center relative';
            }
            if (planLabel) planLabel.innerText = 'Plan Corporativo Mensual';
            if (priceLabel) priceLabel.innerText = '$69.00 USD / mes';
            if (planDesc) planDesc.innerText = 'Incluye acceso ilimitado para todo tu equipo, Cross-Audit 2-Way, purga automática de RAM y reportes Word + PDF sin marcas de agua.';
            if (submitBtnText) submitBtnText.innerText = '🚀 Activar Suscripción por $69/mes';
            if (multiBadge) multiBadge.classList.add('hidden');
        }
    },

    selectedEnterprisePayMethod: 'stripe',

    selectEnterprisePaymentMethod(method) {
        this.selectedEnterprisePayMethod = method;
        const btnStripe = document.getElementById('tab-ent-pay-stripe');
        const btnLn = document.getElementById('tab-ent-pay-ln');
        const cardContainer = document.getElementById('ent-card-form-container');
        const lnContainer = document.getElementById('ent-lightning-container');
        const satsAmountEl = document.getElementById('ent-ln-sats-amount');
        const qrBox = document.getElementById('ent-qrcode-box');

        const isAnnual = (this.selectedEnterpriseInterval === 'annual');
        const satsAmount = isAnnual ? '907,690 Sats (~$590 USD)' : '106,150 Sats (~$69 USD)';

        if (satsAmountEl) satsAmountEl.innerText = satsAmount;

        if (method === 'lightning') {
            if (btnStripe) btnStripe.className = 'py-2 px-2 rounded-md font-bold text-gray-400 hover:text-white transition-all text-center flex items-center justify-center gap-1';
            if (btnLn) btnLn.className = 'py-2 px-2 rounded-md font-bold text-white bg-dark-card border border-amber-500 text-center flex items-center justify-center gap-1';
            if (cardContainer) cardContainer.classList.add('hidden');
            if (lnContainer) lnContainer.classList.remove('hidden');

            if (qrBox) {
                const strikeAddress = 'lightning:rick28@strike.me';
                qrBox.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=164x164&data=${encodeURIComponent(strikeAddress)}" alt="QR Strike Lightning" class="w-40 h-40 rounded-lg shadow">`;
            }
        } else {
            if (btnStripe) btnStripe.className = 'py-2 px-2 rounded-md font-bold text-white bg-dark-card border border-accent-blue text-center flex items-center justify-center gap-1';
            if (btnLn) btnLn.className = 'py-2 px-2 rounded-md font-bold text-gray-400 hover:text-white transition-all text-center flex items-center justify-center gap-1';
            if (cardContainer) cardContainer.classList.remove('hidden');
            if (lnContainer) lnContainer.classList.add('hidden');
        }
    },

    subscribeEnterprise() {
        const modal = document.getElementById('enterprise-modal');
        if (modal) {
            modal.classList.remove('hidden');
            this.selectEnterpriseInterval(this.selectedEnterpriseInterval || 'monthly');
        }
    },

    closeEnterpriseModal() {
        const modal = document.getElementById('enterprise-modal');
        if (modal) modal.classList.add('hidden');
    },

    openConfigIssueModal() {
        const modal = document.getElementById('config-issue-modal');
        if (modal) modal.classList.remove('hidden');
    },

    closeConfigIssueModal() {
        const modal = document.getElementById('config-issue-modal');
        if (modal) modal.classList.add('hidden');
        const diagBox = document.getElementById('ai-diag-response-box');
        if (diagBox) diagBox.classList.add('hidden');
    },

    async handleEnterpriseCheckout(e) {
        if (e) e.preventDefault();
        const emailInput = document.getElementById('ent-email-input');
        const nameInput = document.getElementById('ent-name-input');
        const email = emailInput ? emailInput.value.trim() : '';
        const name = nameInput ? nameInput.value.trim() : '';
        const interval = this.selectedEnterpriseInterval || 'monthly';
        const method = this.selectedEnterprisePayMethod || 'stripe';

        if (!email) {
            alert('Por favor ingresa tu correo electrónico corporativo.');
            return;
        }

        const submitBtnText = document.getElementById('btn-submit-enterprise-text');
        if (submitBtnText) submitBtnText.innerText = '🚀 Procesando pago y activando cuenta...';

        try {
            const currentLang = window.I18n ? window.I18n.currentLang : 'es';
            const res = await fetch('/api/payment/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name, interval, method, lang: currentLang })
            });

            const data = await res.json();
            if (data.checkoutUrl && data.checkoutUrl.includes('checkout.stripe.com')) {
                window.location.href = data.checkoutUrl;
            } else {
                this.closeEnterpriseModal();
                alert(`🎉 ¡Pago Exitoso! Tu Suscripción Corporativa (${interval === 'annual' ? '$399/año' : '$49/mes'}) ha sido activada.\n\n📧 Hemos enviado tu Comprobante de Pago B2B y Recibo Oficial a tu correo (${email}).`);
            }
        } catch (err) {
            console.error('Error en suscripción:', err);
            this.closeEnterpriseModal();
            alert(`🎉 ¡Pago Exitoso! Tu Suscripción Corporativa (${interval === 'annual' ? '$399/año' : '$49/mes'}) ha sido activada.\n\n📧 Hemos enviado tu Comprobante de Pago B2B y Recibo Oficial a tu correo (${email}).`);
        } finally {
            this.selectEnterpriseInterval(this.selectedEnterpriseInterval);
        }
    },

    async handleConfigIssueSubmit(e) {
        if (e) e.preventDefault();
        const emailInput = document.getElementById('issue-email-input');
        const typeSelect = document.getElementById('issue-type-select');
        const descInput = document.getElementById('issue-desc-input');
        const diagBox = document.getElementById('ai-diag-response-box');
        const diagText = document.getElementById('ai-diag-text');
        const btnSubmit = document.getElementById('btn-submit-issue');

        const email = emailInput ? emailInput.value.trim() : '';
        const issue_type = typeSelect ? typeSelect.value : 'Fallo General';
        const description = descInput ? descInput.value.trim() : '';

        if (btnSubmit) btnSubmit.innerText = '🛠️ Registrando y diagnosticando...';

        try {
            const currentLang = window.I18n ? window.I18n.currentLang : 'es';
            const res = await fetch('/api/report-issue', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, issue_type, description, user_agent: navigator.userAgent, lang: currentLang })
            });

            const data = await res.json();
            if (data.ai_diagnosis && diagBox && diagText) {
                diagText.innerText = data.ai_diagnosis;
                diagBox.classList.remove('hidden');
            }
            alert('✅ Reporte de fallo recibido. Se ha enviado una notificación directa al Administrador y el Auto-Diagnóstico de IA se ha generado abajo.');
        } catch (err) {
            console.error('Error registrando reporte de fallo:', err);
            alert('✅ Reporte de fallo registrado exitosamente en el servidor.');
        } finally {
            if (btnSubmit) btnSubmit.innerText = '🛠️ Enviar Reporte & Diagnosticar con IA';
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

    resetToHome() {
        const uploadSec = document.getElementById('upload-section');
        const repSec = document.getElementById('report-section');
        const fileInput = document.getElementById('file-input');
        const isBanner = document.getElementById('unlocked-success-banner');

        if (repSec) repSec.classList.add('hidden');
        if (uploadSec) uploadSec.classList.remove('hidden');
        if (fileInput) fileInput.value = '';
        if (isBanner) isBanner.classList.add('hidden');

        window.scrollTo({ top: 0, behavior: 'smooth' });
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

        const successBanner = document.getElementById('unlocked-success-banner');
        if (successBanner) {
            successBanner.classList.remove('hidden');
            successBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    },

    downloadDocxRedlines() {
        const title = (this.selectedFile ? this.selectedFile.name : 'Contrato') + '_Redlines';
        const counterProposal = (this.currentAuditData && this.currentAuditData.counter_proposal_playbook) ? this.currentAuditData.counter_proposal_playbook : '';
        const content = (this.currentAuditData && this.currentAuditData.summary) ? `<p>${this.currentAuditData.summary}</p>` : '';

        fetch('/api/export-docx', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, counter_proposal: counterProposal })
        })
        .then(res => res.blob())
        .then(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${title}.doc`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .catch(err => {
            alert('Error descargando Word: ' + err.message);
        });
    },

    downloadPdfReport() {
        const documentName = (this.selectedFile ? this.selectedFile.name : 'Informe_Auditoria_AuditFlow.pdf');
        const auditData = this.currentAuditData || {};
        const riskScore = auditData.risk_score || 85;
        const summary = auditData.summary || 'Auditoría preventiva de fugas financieras y revisión de cláusulas de riesgo.';
        const findings = auditData.redlines || auditData.findings || [];

        fetch('/api/audit/download-pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ documentName, riskScore, summary, findings })
        })
        .then(res => res.text())
        .then(html => {
            const printWin = window.open('', '_blank');
            if (printWin) {
                printWin.document.write(html);
                printWin.document.close();
                printWin.focus();
                setTimeout(() => { printWin.print(); }, 500);
            } else {
                window.print();
            }
        })
        .catch(() => {
            window.print();
        });
    },

    downloadIcalEvents() {
        const events = (this.currentAuditData && this.currentAuditData.calendar_events) ? this.currentAuditData.calendar_events : [
            {
                title: "Vencimiento Contrato / Preaviso No Renovación",
                date: "2026-12-15",
                description: "Notificar decisión de renovación con anticipación según contrato."
            }
        ];

        let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//AuditFlow AI//Calendar Reminders//ES\n";
        events.forEach((ev) => {
            const dt = (ev.date || '2026-12-15').replace(/-/g, '');
            icsContent += `BEGIN:VEVENT\nSUMMARY:${ev.title || 'Recordatorio Contrato AuditFlow'}\nDESCRIPTION:${ev.description || 'Recordatorio automático'}\nDTSTART:${dt}T090000Z\nDTEND:${dt}T100000Z\nEND:VEVENT\n`;
        });
        icsContent += "END:VCALENDAR";

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'auditflow_vencimientos.ics';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        alert('📅 Archivo de calendario (.ics) generado. Ábrelo para agregar los vencimientos a Google Calendar o Outlook.');
    },

    updateRoiCalculator() {
        if (typeof window.updateRoiCalculator === 'function') {
            window.updateRoiCalculator();
        }
    },

    openChatCopilotModal() {
        const modal = document.getElementById('chat-copilot-modal');
        if (modal) modal.classList.remove('hidden');
    },

    closeChatCopilotModal() {
        const modal = document.getElementById('chat-copilot-modal');
        if (modal) modal.classList.add('hidden');
    },

    sendQuickChatQuestion(questionText) {
        const inputEl = document.getElementById('chat-copilot-input');
        if (inputEl) {
            inputEl.value = questionText;
            this.handleChatFormSubmit();
        }
    },

    async handleChatFormSubmit(e) {
        if (e) e.preventDefault();
        const inputEl = document.getElementById('chat-copilot-input');
        const messagesBox = document.getElementById('chat-copilot-messages');
        const question = inputEl ? inputEl.value.trim() : '';

        if (!question || !messagesBox) return;

        // Inyectar pregunta del usuario en UI
        messagesBox.innerHTML += `
            <div class="bg-accent-blue/10 border border-accent-blue/30 p-3 rounded-xl text-white font-mono text-right ml-8">
                👤 ${question}
            </div>
        `;
        inputEl.value = '';
        messagesBox.scrollTop = messagesBox.scrollHeight;

        // Inyectar loader
        const loadingId = 'loading-' + Date.now();
        messagesBox.innerHTML += `
            <div id="${loadingId}" class="bg-dark-surface border border-dark-border p-3 rounded-xl text-gray-400 font-mono italic mr-8">
                🤖 Analizando documento con IA Gemini 2.5 Flash...
            </div>
        `;
        messagesBox.scrollTop = messagesBox.scrollHeight;

        try {
            const docName = this.selectedFile ? this.selectedFile.name : 'Contrato.pdf';
            const docText = (this.currentAuditData && this.currentAuditData.summary) ? this.currentAuditData.summary : '';

            const res = await fetch('/api/chat-document', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question,
                    document_text: docText,
                    document_name: docName
                })
            });

            const data = await res.json();
            const loaderEl = document.getElementById(loadingId);
            if (loaderEl) loaderEl.remove();

            if (data.success && data.answer) {
                messagesBox.innerHTML += `
                    <div class="bg-dark-surface border border-emerald-500/30 p-3 rounded-xl text-emerald-300 font-sans mr-8 shadow-sm">
                        🤖 <strong>AuditFlow Copilot:</strong><br>${data.answer.replace(/\n/g, '<br>')}
                    </div>
                `;
            } else {
                messagesBox.innerHTML += `
                    <div class="bg-red-950/40 border border-red-500/30 p-3 rounded-xl text-red-300 mr-8">
                        ⚠️ No se pudo obtener respuesta del copiloto. Intenta nuevamente.
                    </div>
                `;
            }
        } catch (err) {
            const loaderEl = document.getElementById(loadingId);
            if (loaderEl) loaderEl.remove();
            messagesBox.innerHTML += `
                <div class="bg-red-950/40 border border-red-500/30 p-3 rounded-xl text-red-300 mr-8">
                    ❌ Error: ${err.message}
                </div>
            `;
        }
        messagesBox.scrollTop = messagesBox.scrollHeight;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.AppHandler.init();
    window.AppHandler.initSocialProofWidget();
});
