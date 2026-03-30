-- Migration to support Enterprise Alert Types in Issues table
-- Adds 'late' (SLA Breach) and 'pickup_delay' to the allowed issue types

DO $$ 
BEGIN
    -- Check if the constraint exists and drop it to recreate with new types
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'issues_type_check') THEN
        ALTER TABLE public.issues DROP CONSTRAINT issues_type_check;
    END IF;

    ALTER TABLE public.issues 
    ADD CONSTRAINT issues_type_check 
    CHECK (type IN ('missing_item', 'late', 'wrong_order', 'refund', 'complaint', 'pickup_delay'));
END $$;

-- Ensure severity also supports high-priority for these automated alerts
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'issues_severity_check') THEN
        ALTER TABLE public.issues DROP CONSTRAINT issues_severity_check;
    END IF;

    ALTER TABLE public.issues 
    ADD CONSTRAINT issues_severity_check 
    CHECK (severity IN ('low', 'medium', 'high', 'critical'));
END $$;

COMMENT ON COLUMN public.issues.type IS 'Type of issue, including automated SLA (late) and logistics alerts (pickup_delay)';
