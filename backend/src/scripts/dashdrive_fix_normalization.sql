-- ========================================================================================
-- DASHDRIVE SCHEMA NORMALIZATION & FIX
-- Use this script to resolve "organization_id" or "tenant_id" conflicts.
-- ========================================================================================

DO $$ 
BEGIN
    -- 1. Resolve Tenants vs Organizations Table Name
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'tenants') AND 
       NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'organizations') THEN
        ALTER TABLE tenants RENAME TO organizations;
    END IF;

    -- 2. Normalize "tenant_id" to "organization_id" in STORES
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'stores' AND column_name = 'tenant_id') THEN
        ALTER TABLE stores RENAME COLUMN tenant_id TO organization_id;
    END IF;

    -- 3. Normalize "tenant_id" to "organization_id" in ORDERS
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'tenant_id') THEN
        ALTER TABLE orders RENAME COLUMN tenant_id TO organization_id;
    END IF;

    -- 4. Normalize "tenant_id" to "organization_id" in USERS
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'tenant_id') THEN
        ALTER TABLE users RENAME COLUMN tenant_id TO organization_id;
    END IF;

    -- 5. Add organization_id to AUDIT_LOGS if missing
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'audit_logs') AND
       NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'audit_logs' AND column_name = 'organization_id') THEN
        ALTER TABLE audit_logs ADD COLUMN organization_id UUID REFERENCES organizations(id);
    END IF;

    -- 6. Ensure UUID Extension exists
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

END $$;

-- 7. Re-apply Indexes (Safe due to Normalization)
CREATE INDEX IF NOT EXISTS idx_users_org ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_stores_org ON stores(organization_id);
CREATE INDEX IF NOT EXISTS idx_orders_org ON orders(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_org ON audit_logs(organization_id);
