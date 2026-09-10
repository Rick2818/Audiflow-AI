-- ==============================================================================
-- AUDITFLOW AI - MIGRACIÓN: AGREGAR COLUMNAS DE TRACKING Y RECUPERACIÓN A AUDIT_LEADS
-- ==============================================================================

ALTER TABLE public.audit_leads 
ADD COLUMN IF NOT EXISTS email_opened BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS opens_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS opened_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS recovery_sent_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_audit_leads_opened ON public.audit_leads(email_opened);
CREATE INDEX IF NOT EXISTS idx_audit_leads_recovery ON public.audit_leads(recovery_sent_at);
