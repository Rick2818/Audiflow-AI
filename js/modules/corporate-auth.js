/**
 * AuditFlow AI - Módulo de Autenticación Corporativa y Sesiones Seguras
 * Administra tokens de sesión de 30 días en localStorage, sessionStorage y cookies.
 */

export const CorporateAuth = {
    TOKEN_KEY: 'auditflow_session_token',
    ACTIVE_KEY: 'auditflow_corporate_active',
    EMAIL_KEY: 'auditflow_corporate_email',
    PLAN_KEY: 'auditflow_corporate_plan',

    saveSession(token, email, plan) {
        if (!token) return;
        localStorage.setItem(this.TOKEN_KEY, token);
        sessionStorage.setItem(this.TOKEN_KEY, token);
        localStorage.setItem(this.ACTIVE_KEY, 'true');
        if (email) localStorage.setItem(this.EMAIL_KEY, email);
        if (plan) localStorage.setItem(this.PLAN_KEY, plan);

        // Cookie de respaldo por 30 días
        document.cookie = `${this.TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=2592000; SameSite=Lax`;
    },

    getToken() {
        const local = localStorage.getItem(this.TOKEN_KEY);
        if (local) return local;
        const session = sessionStorage.getItem(this.TOKEN_KEY);
        if (session) return session;
        const match = document.cookie.match(new RegExp('(^| )' + this.TOKEN_KEY + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : null;
    },

    clearSession() {
        localStorage.removeItem(this.TOKEN_KEY);
        sessionStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.ACTIVE_KEY);
        localStorage.removeItem(this.EMAIL_KEY);
        localStorage.removeItem(this.PLAN_KEY);
        document.cookie = `${this.TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    },

    isLocallyActive() {
        return localStorage.getItem(this.ACTIVE_KEY) === 'true';
    }
};

if (typeof window !== 'undefined') {
    window.CorporateAuth = CorporateAuth;
}
