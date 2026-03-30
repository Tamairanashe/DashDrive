-- Add push_token column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS push_token TEXT;

-- Index for fast token lookups
CREATE INDEX IF NOT EXISTS idx_users_push_token ON users(push_token);

-- Index for store-based broadcasts
CREATE INDEX IF NOT EXISTS idx_users_store_id ON users(store_id);
