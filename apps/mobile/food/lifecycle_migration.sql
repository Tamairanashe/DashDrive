-- Migration for Order Lifecycle Timestamps
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS ready_at timestamp,
ADD COLUMN IF NOT EXISTS completed_at timestamp;

-- Update any existing data if needed (optional)
-- COMMENTED OUT: UPDATE orders SET completed_at = created_at WHERE status = 'completed' AND completed_at IS NULL;
