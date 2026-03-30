-- Migration script to add acceptance_mode to stores table
ALTER TABLE stores 
ADD COLUMN IF NOT EXISTS acceptance_mode text 
CHECK (acceptance_mode IN ('manual', 'auto')) 
DEFAULT 'manual';
