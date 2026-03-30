-- Migration script for configurable SLA thresholds
ALTER TABLE public.stores 
ADD COLUMN IF NOT EXISTS sla_warning_minutes INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS sla_breach_minutes INTEGER DEFAULT 20;
