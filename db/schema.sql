-- ==============================================================================
-- AUDITFLOW AI - SUPABASE DATABASE SCHEMA (PostgreSQL)
-- INCLUYE TABLAS DE SUSCRIPCIONES $49/MES Y TOKENS RECURRENTES
-- ==============================================================================

-- 1. Habilitar extensión UUID si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabla: AUDIT_LEADS (Prospectos Calificados)
CREATE TABLE IF NOT EXISTS public.audit_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(100) DEFAULT 'CFO / Controller',
    lead_score INT NOT NULL DEFAULT 0 CHECK (lead_score BETWEEN 0 AND 100),
    company_estimate VARCHAR(100) DEFAULT 'Desconocido',
    document_type VARCHAR(100) NOT NULL,
    is_enterprise BOOLEAN DEFAULT FALSE,
    emails_sent INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_leads_email ON public.audit_leads(email);
CREATE INDEX IF NOT EXISTS idx_audit_leads_score ON public.audit_leads(lead_score DESC);

-- 3. Tabla: AUDIT_REPORTS (Metadatos de Reportes de Auditoría)
CREATE TABLE IF NOT EXISTS public.audit_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES public.audit_leads(id) ON DELETE CASCADE,
    document_name VARCHAR(255) NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    total_financial_leakage DECIMAL(12, 2) DEFAULT 0.00,
    summary_json JSONB NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'expired')),
    payment_method VARCHAR(20) DEFAULT NULL CHECK (payment_method IN ('stripe', 'lightning', NULL)),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_reports_lead_id ON public.audit_reports(lead_id);
CREATE INDEX IF NOT EXISTS idx_audit_reports_status ON public.audit_reports(status);

-- 4. Tabla: TRANSACTIONS (Registro de Transacciones Híbridas $19 USD / Sats)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES public.audit_reports(id) ON DELETE CASCADE,
    provider VARCHAR(20) NOT NULL CHECK (provider IN ('stripe', 'lightning')),
    external_id VARCHAR(255) UNIQUE NOT NULL,
    amount_usd DECIMAL(8, 2) DEFAULT 19.00,
    amount_sats BIGINT DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid', 'failed', 'expired')),
    lightning_invoice TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    settled_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_transactions_external_id ON public.transactions(external_id);

-- 5. Tabla: SUBSCRIPTIONS (Embudo de Upsell Corporativo $69/mes o $590/año)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES public.audit_leads(id) ON DELETE CASCADE,
    stripe_subscription_id VARCHAR(255) UNIQUE DEFAULT NULL,
    plan_name VARCHAR(50) DEFAULT 'Enterprise Monthly',
    price_usd DECIMAL(8, 2) DEFAULT 69.00,
    interval VARCHAR(20) DEFAULT 'month' CHECK (interval IN ('month', 'year')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('trialing', 'active', 'canceled', 'past_due')),
    current_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    current_period_end TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 month'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_lead_id ON public.subscriptions(lead_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

-- 6. Tabla: DEMO_BOOKINGS (Sesiones de 10 min en Vivo)
CREATE TABLE IF NOT EXISTS public.demo_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    preferred_datetime TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'completed', 'canceled', 'rescheduled')),
    ics_generated BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_demo_bookings_email ON public.demo_bookings(email);

-- 7. Tabla: WEBHOOKS_LOG (Registro de Webhooks Entrantes y Salientes)
CREATE TABLE IF NOT EXISTS public.webhooks_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL,
    direction VARCHAR(20) NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    payload JSONB NOT NULL,
    status_code INT DEFAULT 200,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhooks_log_event ON public.webhooks_log(event_type);

-- 8. Tabla: CUSTOMER_TOKENS (Tokens para clientes recurrentes)
CREATE TABLE IF NOT EXISTS public.customer_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES public.audit_leads(id) ON DELETE CASCADE,
    stripe_customer_id VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Función de Actualización de Timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_audit_leads_updated_at
BEFORE UPDATE ON public.audit_leads
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 10. POLÍTICAS RLS (Row Level Security)
ALTER TABLE public.audit_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhooks_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_tokens ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura anónima / servicio autenticado
CREATE POLICY "Permitir inserción anónima de leads" ON public.audit_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir inserción anónima de reportes" ON public.audit_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir inserción de reservas de demo" ON public.demo_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Service Role Full Access on Transactions" ON public.transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access on Subscriptions" ON public.subscriptions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access on Tokens" ON public.customer_tokens FOR ALL USING (true) WITH CHECK (true);
