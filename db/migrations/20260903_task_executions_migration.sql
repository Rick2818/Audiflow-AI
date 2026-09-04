-- ==============================================================================
-- AUDITFLOW AI - MIGRACIÓN MULTIAGENTE DESACOPLADO (Supabase / PostgreSQL)
-- Tabla de Checkpoints de Tareas, Idempotencia y Dead-Letter Queue
-- ==============================================================================

-- 1. Habilitar extensión UUID si no está activa
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Crear tipo ENUM para los estados de ejecución de tareas de agentes
DO $$ BEGIN
    CREATE TYPE task_execution_status AS ENUM (
      'PENDING', 
      'RUNNING', 
      'COMPLETED', 
      'FAILED', 
      'DLQ_REVISE'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Crear tabla: TASK_EXECUTIONS
CREATE TABLE IF NOT EXISTS public.task_executions (
    task_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audit_id UUID NOT NULL,
    execution_id VARCHAR(128) NOT NULL,
    agent_type VARCHAR(64) NOT NULL,
    idempotency_key VARCHAR(256) UNIQUE NOT NULL,
    status task_execution_status NOT NULL DEFAULT 'PENDING',
    attempt_count INT NOT NULL DEFAULT 1,
    max_retries INT NOT NULL DEFAULT 3,
    input_payload JSONB NOT NULL,
    output_payload JSONB DEFAULT NULL,
    error_details JSONB DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Índices para optimización de búsqueda, reintentos y auditoría
CREATE INDEX IF NOT EXISTS idx_task_executions_audit_id ON public.task_executions(audit_id);
CREATE INDEX IF NOT EXISTS idx_task_executions_status ON public.task_executions(status);
CREATE INDEX IF NOT EXISTS idx_task_executions_agent ON public.task_executions(agent_type);
CREATE INDEX IF NOT EXISTS idx_task_executions_idempotency ON public.task_executions(idempotency_key);

-- 5. Función de Checkpoint Idempotente
CREATE OR REPLACE FUNCTION public.record_task_checkpoint(
    p_audit_id UUID,
    p_execution_id VARCHAR,
    p_agent_type VARCHAR,
    p_idempotency_key VARCHAR,
    p_input JSONB
) RETURNS UUID AS $$
DECLARE
    v_task_id UUID;
BEGIN
    INSERT INTO public.task_executions (
        audit_id,
        execution_id,
        agent_type,
        idempotency_key,
        input_payload,
        status,
        updated_at
    ) VALUES (
        p_audit_id,
        p_execution_id,
        p_agent_type,
        p_idempotency_key,
        p_input,
        'RUNNING',
        NOW()
    )
    ON CONFLICT (idempotency_key) DO UPDATE
        SET attempt_count = public.task_executions.attempt_count + 1,
            status = 'RUNNING',
            execution_id = p_execution_id,
            updated_at = NOW()
    RETURNING task_id INTO v_task_id;
    
    RETURN v_task_id;
END;
$$ LANGUAGE plpgsql;

-- 6. Función para actualizar el resultado de la tarea (Éxito o Fallo)
CREATE OR REPLACE FUNCTION public.complete_task_checkpoint(
    p_task_id UUID,
    p_status task_execution_status,
    p_output JSONB DEFAULT NULL,
    p_error JSONB DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    UPDATE public.task_executions
    SET status = p_status,
        output_payload = COALESCE(p_output, output_payload),
        error_details = COALESCE(p_error, error_details),
        updated_at = NOW()
    WHERE task_id = p_task_id;
END;
$$ LANGUAGE plpgsql;
