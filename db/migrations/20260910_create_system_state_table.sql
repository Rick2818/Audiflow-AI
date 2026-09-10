-- ==============================================================================
-- AUDITFLOW AI — TABLA DE ESTADO DEL SISTEMA Y AGENTES AUTÓNOMOS EN SUPABASE
-- Permite que los Vercel Serverless Crons sincronicen su estado en la nube
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.system_state (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_system_state_key ON public.system_state(key);

-- Politica de lectura/escritura para service_role y anon
ALTER TABLE public.system_state ENABLE ROW LEVEL SECURITY;

DO \$\$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'system_state' AND policyname = 'Permitir acceso completo system_state') THEN
        CREATE POLICY " Permitir acceso completo system_state\ ON public.system_state FOR ALL USING (true) WITH CHECK (true);
 END IF;
END
\$\$;
