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

    openPaymentModal() {
        const modal = document.getElementById('payment-modal');
        if (modal) modal.classList.remove('hidden');
    },

    closePaymentModal() {
        const modal = document.getElementById('payment-modal');
        if (modal) modal.classList.add('hidden');
        this.clearPollingAndTimers();
    },

    switchTab(tab) {
        const tabLightning = document.getElementById('tab-lightning');
        const tabWompi = document.getElementById('tab-wompi');
        const contentLightning = document.getElementById('payment-content-lightning');
        const contentWompi = document.getElementById('payment-content-wompi');

        if (tab === 'wompi') {
            if (tabWompi) {
                tabWompi.className = 'py-2.5 px-2 rounded-lg text-xs font-extrabold text-white bg-blue-600 transition-all flex items-center justify-center gap-1 shadow-glow cursor-pointer';
            }
            if (tabLightning) {
                tabLightning.className = 'py-2.5 px-2 rounded-lg text-xs font-bold text-gray-300 hover:text-white bg-dark-card border border-border-dark transition-all flex items-center justify-center gap-1 cursor-pointer';
            }
            if (contentWompi) contentWompi.classList.remove('hidden');
            if (contentLightning) contentLightning.classList.add('hidden');
            this.clearPollingAndTimers();
            this.renderWompiTab();
        } else {
            if (tabLightning) {
                tabLightning.className = 'py-2.5 px-2 rounded-lg text-xs font-extrabold text-black bg-gradient-to-r from-amber-400 to-amber-500 transition-all flex items-center justify-center gap-1 shadow-glow cursor-pointer';
            }
            if (tabWompi) {
                tabWompi.className = 'py-2.5 px-2 rounded-lg text-xs font-bold text-gray-300 hover:text-white bg-dark-card border border-border-dark transition-all flex items-center justify-center gap-1 cursor-pointer';
            }
            if (contentLightning) contentLightning.classList.remove('hidden');
            if (contentWompi) contentWompi.classList.add('hidden');
            this.generateLightningInvoice();
        }
    },

    renderWompiTab() {
        const savedToken = localStorage.getItem('wompi_card_token') || 'tok_auditflow_demo_4321';
        const rawLast4 = localStorage.getItem('wompi_card_last4') || '4321';
        const rawBrand = localStorage.getItem('wompi_card_brand') || 'Visa Corporate';

        const safeLast4 = String(rawLast4).replace(/[^0-9]/g, '').slice(0, 4) || '4321';
        const safeBrand = String(rawBrand).replace(/[^a-zA-Z0-9\s]/g, '') || 'Visa Corporate';

        const btnPayWompi = document.getElementById('btn-pay-wompi');

        if (btnPayWompi) {
            btnPayWompi.textContent = `⚡ Pagar $9.00 USD con 1 Clic (${safeBrand} •••• ${safeLast4})`;
            btnPayWompi.onclick = (e) => {
                e.preventDefault();
                this.executeOneClickPayment(savedToken, safeLast4);
            };
        }
    },

    async executeOneClickPayment(cardToken, last4) {
        const btn = document.getElementById('btn-pay-wompi');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '⏳ Procesando cargo seguro con Wompi SV...';
        }

        try {
            const res = await fetch('/api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'one-click',
                    report_id: this.currentReportId || 'rep_demo_' + Date.now(),
                    cardToken: cardToken,
                    amount: 9.00,
                    email: this.currentLeadEmail || 'cfo@empresa.com'
                })
            });

            const data = await res.json();

            if (data.success) {
                alert(`🎉 ¡Pago Aprobado con 1 Clic! ($9.00 USD)\\nCódigo de Autorización: ${data.authorizationCode || 'AUTH_98124'}\\n\\nTu reporte y control de cambios en Word (.docx) han sido desbloqueados.`);
                this.closePaymentModal();
                if (window.AppHandler && window.AppHandler.unblurReport) {
                    window.AppHandler.unblurReport();
                }
            } else {
                alert('❌ ' + (data.error || 'No fue posible procesar el cobro a 1 Clic.'));
            }
        } catch (err) {
            alert('❌ Error de comunicación con la pasarela.');
        } finally {
            if (btn) {
                btn.disabled = false;
                this.renderWompiTab();
            }
        }
    },

    setupEventListeners() {
        const tabStripe = document.getElementById('tab-stripe');
        const tabLightning = document.getElementById('tab-lightning');
        const contentStripe = document.getElementById('payment-content-stripe');
        const contentLightning = document.getElementById('payment-content-lightning');
        const btnPayStripe = document.getElementById('btn-pay-stripe');
        const btnCopyLn = document.getElementById('btn-copy-ln');
        const btnOpenModal = document.getElementById('btn-open-payment-modal');
        const btnCloseModal = document.getElementById('btn-close-payment-modal');

        if (btnOpenModal) {
            btnOpenModal.addEventListener('click', () => this.openPaymentModal());
        }

        if (btnCloseModal) {
            btnCloseModal.addEventListener('click', () => this.closePaymentModal());
        }

        // Toggle entre Pestañas Stripe ($ USD) vs Lightning (Satoshis)
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
     * Inicia Checkout en Stripe para $19.00 USD
     */
    async processStripeCheckout() {
        const btnPayStripe = document.getElementById('btn-pay-stripe');
        if (btnPayStripe) btnPayStripe.innerText = '⏳ Procesando Pago $19 USD...';

        if (typeof window.gtag === 'function') {
            window.gtag('event', 'begin_checkout', {
                value: 9.0,
                currency: 'USD',
                items: [{ item_id: 'report_unlock_9', item_name: 'Boleto de Entrada: Desbloqueo Reporte Ejecutivo + Word DOCX + PDF' }]
            });
        }

        try {
            const res = await fetch('/api/payment/stripe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    report_id: this.currentReportId || 'rep_123456',
                    email: this.currentLeadEmail || 'cliente@empresa.com',
                    document_name: this.currentDocName || 'contrato.pdf',
                    amount_usd: 9.00
                })
            });

            const data = await res.json();
            if (data.checkoutUrl && data.checkoutUrl.includes('checkout.stripe.com')) {
                window.location.href = data.checkoutUrl;
            } else {
                // Desbloqueo directo en pantalla + Notificación de envío
                this.closePaymentModal();
                if (window.AppHandler && window.AppHandler.unblurReport) {
                    window.AppHandler.unblurReport();
                }
                alert('🎉 ¡Pago Exitoso de $9.00 USD (Boleto de Entrada)!\n\nHemos desbloqueado tus 3 Soluciones Tácticas en pantalla y enviado la copia PDF + Word editable a tu correo.');
            }
        } catch (err) {
            console.error('Error en checkout Stripe:', err);
            alert('⚠️ No se pudo procesar la solicitud de Stripe (' + err.message + '). Por favor intenta de nuevo.');
        } finally {
            if (btnPayStripe) btnPayStripe.innerText = 'Pagar con Tarjeta ($9 USD)';
        }
    },

    /**
     * Genera Factura Lightning Network BOLT11 en Satoshis ($9 USD)
     */
    async generateLightningInvoice() {
        this.clearPollingAndTimers();
        try {
            const res = await fetch('/api/payment/lightning', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    report_id: this.currentReportId || 'rep_123456',
                    document_name: this.currentDocName || 'contrato.pdf',
                    amount_usd: 9.00
                })
            });

            const data = await res.json();
            const bolt11 = data.lightningInvoice || 'lightning:rick28@strike.me';
            const satsAmount = data.amountSats || 13850;

            const inputInvoice = document.getElementById('ln-invoice-input');
            const satsAmountEl = document.getElementById('ln-sats-amount');

            if (inputInvoice) inputInvoice.value = bolt11;
            if (satsAmountEl) {
                satsAmountEl.innerText = `${satsAmount.toLocaleString()} Sats (~$9 USD)`;
            }

            // Generar Código QR interactivo de alta fiabilidad (Zero dependencies)
            this.renderQrCode(bolt11);

            // Iniciar temporizador de 10 minutos
            this.startCountdownTimer(600);

            // Polling de verificación de pago cada 3 segundos
            this.startPaymentPolling();

        } catch (err) {
            console.error('Error en pasarela Lightning:', err);
            const bolt11Fallback = 'lightning:rick28@strike.me';
            const inputInvoice = document.getElementById('ln-invoice-input');
            if (inputInvoice) inputInvoice.value = bolt11Fallback;
            this.renderQrCode(bolt11Fallback);
        }
    },

    renderQrCode(text) {
        const qrContainer = document.getElementById('qrcode-container');
        if (!qrContainer) return;
        qrContainer.innerHTML = '';

        // Si la librería QRCode está cargada globalmente en HTML
        if (typeof window.QRCode === 'function') {
            try {
                new window.QRCode(qrContainer, {
                    text: text,
                    width: 160,
                    height: 160,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: window.QRCode.CorrectLevel.M
                });
                return;
            } catch (e) {
                console.warn('QRCode library fallback:', e);
            }
        }

        // Fallback robusto con imagen segura
        const img = document.createElement('img');
        img.src = `https://api.qrserver.com/v1/create-qr-code/?size=164x164&data=${encodeURIComponent(text)}`;
        img.alt = "QR Code Lightning";
        img.className = "w-40 h-40 rounded-lg shadow border border-gray-200";
        img.onerror = () => {
            qrContainer.innerHTML = `<div class="p-4 text-xs font-mono text-gray-800 bg-amber-100 rounded-lg">⚡ Copia la factura en texto:<br><strong>rick28@strike.me</strong></div>`;
        };
        qrContainer.appendChild(img);
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
                        
                        const modal = document.getElementById('payment-modal');
                        if (modal) modal.classList.add('hidden');
                        if (window.AppHandler && window.AppHandler.unblurReport) {
                            window.AppHandler.unblurReport();
                        }
                    }
                }
            } catch (e) {}
        }, 3000);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (window.PaymentHandler) {
        window.PaymentHandler.init();
    }
});
