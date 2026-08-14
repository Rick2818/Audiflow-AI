// ==============================================================================
// AUDITFLOW AI - CLIENT-SIDE PAYMENT HANDLER (payment.js)
// GESTIÓN DE STRIPE Y LIGHTNING NETWORK CON EXPIRACIÓN DE 10 MINUTOS
// ==============================================================================

window.PaymentHandler = {
    currentReportId: null,
    currentLeadEmail: null,
    currentDocName: null,
    lnTimerInterval: null,
    pollInterval: null,
    listenersBound: false,

    init(reportId, leadEmail, docName) {
        this.currentReportId = reportId;
        this.currentLeadEmail = leadEmail;
        this.currentDocName = docName;
        if (!this.listenersBound) {
            this.setupEventListeners();
            this.listenersBound = true;
        }
    },

    setupEventListeners() {
        const tabStripe = document.getElementById('tab-stripe');
        const tabLightning = document.getElementById('tab-lightning');
        const contentStripe = document.getElementById('payment-content-stripe');
        const contentLightning = document.getElementById('payment-content-lightning');
        const btnPayStripe = document.getElementById('btn-pay-stripe');
        const btnCopyLn = document.getElementById('btn-copy-ln');

        // Toggle entre Pestañas Stripe vs Lightning
        if (tabStripe && tabLightning && contentStripe && contentLightning) {
            tabStripe.addEventListener('click', () => {
                tabStripe.classList.add('bg-dark-card', 'border', 'border-accent-blue', 'text-white');
                tabStripe.classList.remove('text-gray-400');
                tabLightning.classList.remove('bg-dark-card', 'border', 'border-accent-blue', 'text-white');
                tabLightning.classList.add('text-gray-400');

                contentStripe.classList.remove('hidden');
                contentLightning.classList.add('hidden');

                this.clearPollingAndTimers();
            });

            tabLightning.addEventListener('click', () => {
                tabLightning.classList.add('bg-dark-card', 'border', 'border-accent-blue', 'text-white');
                tabLightning.classList.remove('text-gray-400');
                tabStripe.classList.remove('bg-dark-card', 'border', 'border-accent-blue', 'text-white');
                tabStripe.classList.add('text-gray-400');

                contentStripe.classList.add('hidden');
                contentLightning.classList.remove('hidden');

                this.generateLightningInvoice();
            });
        }

        // Botón Pagar con Stripe
        if (btnPayStripe) {
            btnPayStripe.addEventListener('click', async () => {
                await this.processStripeCheckout();
            });
        }

        // Botón Copiar Factura Lightning
        if (btnCopyLn) {
            btnCopyLn.addEventListener('click', () => {
                const input = document.getElementById('ln-invoice-input');
                if (input) {
                    input.select();
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(input.value);
                    }
                    btnCopyLn.innerText = '¡Copiado!';
                    setTimeout(() => { btnCopyLn.innerText = 'Copiar'; }, 2000);
                }
            });
        }
    },

    clearPollingAndTimers() {
        if (this.lnTimerInterval) {
            clearInterval(this.lnTimerInterval);
            this.lnTimerInterval = null;
        }
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
    },

    /**
     * Inicia Checkout en Stripe para $7.00 USD
     */
    async processStripeCheckout() {
        try {
            const res = await fetch('/api/payment/stripe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    report_id: this.currentReportId,
                    email: this.currentLeadEmail,
                    document_name: this.currentDocName
                })
            });

            const data = await res.json();
            if (data && data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            }
        } catch (error) {
            console.error('Error al iniciar Stripe Checkout:', error);
            alert('No se pudo conectar con Stripe. Revisa la configuración del servidor.');
        }
    },

    /**
     * Genera la Factura Lightning Network BOLT11 con QR y Timer de 10 Minutos
     */
    async generateLightningInvoice() {
        this.clearPollingAndTimers();

        const qrContainer = document.getElementById('qrcode-container');
        if (qrContainer) {
            qrContainer.innerHTML = '<div class="text-xs font-mono py-4 text-gray-600">Generando Factura Lightning...</div>';
        }

        try {
            const res = await fetch('/api/payment/lightning', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    report_id: this.currentReportId,
                    document_name: this.currentDocName
                })
            });

            const data = await res.json();
            if (!data || !data.lightningInvoice) {
                if (qrContainer) qrContainer.innerHTML = '<div class="text-xs text-red-500 py-4">Error al generar factura</div>';
                return;
            }

            const satsAmount = typeof data.amountSats === 'number' && !isNaN(data.amountSats) ? data.amountSats : 10769;

            const inputEl = document.getElementById('ln-invoice-input');
            const satsEl = document.getElementById('ln-sats-amount');
            const addrEl = document.getElementById('ln-address-display');

            if (inputEl) inputEl.value = data.lightningInvoice;
            if (satsEl) satsEl.innerText = `${satsAmount.toLocaleString()} Sats`;
            if (addrEl) addrEl.innerText = data.lightningAddress || 'audits@stacker.news';

            // Renderizar Código QR
            if (qrContainer) {
                qrContainer.innerHTML = '';
                if (typeof QRCode !== 'undefined') {
                    new QRCode(qrContainer, {
                        text: data.lightningInvoice,
                        width: 140,
                        height: 140,
                        colorDark: '#09090b',
                        colorLight: '#ffffff',
                        correctLevel: QRCode.CorrectLevel.M
                    });
                } else {
                    qrContainer.innerHTML = '<div class="text-xs text-gray-500 font-mono py-2">Factura generada. Copia el texto abajo.</div>';
                }
            }

            // Iniciar Contador Cuenta Regresiva de 10 minutos
            this.startCountdownTimer(10 * 60);

            // Iniciar Polling de verificación de pago cada 3 segundos
            this.startPaymentPolling();

        } catch (error) {
            console.error('Error generando factura Lightning:', error);
            if (qrContainer) {
                qrContainer.innerHTML = '<div class="text-xs text-red-500 py-4">Error al generar QR Lightning</div>';
            }
        }
    },

    startCountdownTimer(durationSeconds) {
        if (this.lnTimerInterval) clearInterval(this.lnTimerInterval);
        
        let timer = durationSeconds;
        const timerDisplay = document.getElementById('ln-timer');

        this.lnTimerInterval = setInterval(() => {
            if (!timerDisplay) return;

            const minutes = Math.floor(timer / 60);
            const seconds = timer % 60;

            timerDisplay.innerText = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

            if (--timer < 0) {
                this.clearPollingAndTimers();
                timerDisplay.innerText = "EXPIRADA";
                alert("La factura Lightning ha expirado (10 min). Por favor genera una nueva.");
            }
        }, 1000);
    },

    startPaymentPolling() {
        if (this.pollInterval) clearInterval(this.pollInterval);

        this.pollInterval = setInterval(async () => {
            if (!this.currentReportId) return;
            try {
                const res = await fetch(`/api/report/${this.currentReportId}`);
                if (res.ok) {
                    const report = await res.json();
                    if (report && report.status === 'paid') {
                        this.clearPollingAndTimers();
                        
                        // Cerrar modal y desbloquear reporte en pantalla
                        const modal = document.getElementById('payment-modal');
                        if (modal) modal.classList.add('hidden');
                        if (window.AppHandler && window.AppHandler.unlockReportUI) {
                            window.AppHandler.unlockReportUI();
                        }
                    }
                }
            } catch (e) {}
        }, 3000);
    }
};
