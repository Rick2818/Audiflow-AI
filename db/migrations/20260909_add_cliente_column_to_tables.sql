-- ==============================================================================
-- MIGRACIÓN: AGREGAR LÍNEA/COLUMNA 'CLIENTE' EN TABLAS PARA IDENTIFICAR SI EL CORREO EXISTE
-- FECHA: Septiembre 2026
-- ==============================================================================

-- 1. Agregar columna 'cliente' en public.audit_leads
ALTER TABLE public.audit_leads 
ADD COLUMN IF NOT EXISTS cliente VARCHAR(10) NOT NULL DEFAULT 'NO';

-- Actualizar leads corporativos existentes a cliente = 'SI'
UPDATE public.audit_leads 
SET cliente = 'SI' 
WHERE is_enterprise = TRUE;

-- 2. Agregar columna 'cliente' en public.subscriptions
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS cliente VARCHAR(10) NOT NULL DEFAULT 'SI';

-- 3. Crear índices para búsquedas fiduciarias ultrarrápidas por correo y cliente
CREATE INDEX IF NOT EXISTS idx_audit_leads_cliente ON public.audit_leads(cliente);
CREATE INDEX IF NOT EXISTS idx_subscriptions_cliente ON public.subscriptions(cliente);
