-- ========================================================================================
-- DASHDRIVE UNIFIED MASTER SCHEMA
-- Target: Supabase (PostgreSQL)
-- Modules: Food Manager, Merchant Portal, Admin Panel, Mobile App (User/Driver)
-- ========================================================================================

-- 0. EXTENSIONS & PREREQUISITES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================================================================
-- LEGACY NORMALIZATION (Fixes "tenant_id" vs "organization_id" conflicts)
-- ========================================================================================
DO $$ 
BEGIN
    -- Rename 'tenants' to 'organizations' if it exists from older mobile setups
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'tenants') AND 
       NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'organizations') THEN
        ALTER TABLE tenants RENAME TO organizations;
    END IF;

    -- 1. Ensure 'organization_id' is used instead of 'tenant_id'
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'tenant_id') THEN
        ALTER TABLE orders RENAME COLUMN tenant_id TO organization_id;
    END IF;

    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'tenant_id') THEN
        ALTER TABLE users RENAME COLUMN tenant_id TO organization_id;
    END IF;

    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'stores' AND column_name = 'tenant_id') THEN
        ALTER TABLE stores RENAME COLUMN tenant_id TO organization_id;
    END IF;

    -- 2. Migration for Unified Features (Add missing columns to existing tables)
    -- Users
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'status') THEN
        ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active';
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'avatar_url') THEN
        ALTER TABLE users ADD COLUMN avatar_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'push_token') THEN
        ALTER TABLE users ADD COLUMN push_token TEXT;
    END IF;

    -- Orders
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_id') THEN
        ALTER TABLE orders ADD COLUMN customer_id UUID REFERENCES users(id);
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'total_amount') THEN
        -- Fallback if missing
        ALTER TABLE orders ADD COLUMN total_amount DECIMAL(10,2) DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'metadata') THEN
        ALTER TABLE orders ADD COLUMN metadata JSONB DEFAULT '{}';
    END IF;

    -- Menus & Categories
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'menu_categories') THEN
        CREATE TABLE menu_categories (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            UNIQUE(store_id, name)
        );
    END IF;

    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'menu_items') THEN
        CREATE TABLE menu_items (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            category_id UUID NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            UNIQUE(category_id, name)
        );
    END IF;

    -- Ensure Menu Constraints
    IF NOT EXISTS (SELECT FROM pg_constraint WHERE conname = 'menu_categories_store_id_name_key') THEN
        ALTER TABLE menu_categories ADD CONSTRAINT menu_categories_store_id_name_key UNIQUE (store_id, name);
    END IF;

    IF NOT EXISTS (SELECT FROM pg_constraint WHERE conname = 'menu_items_category_id_name_key') THEN
        ALTER TABLE menu_items ADD CONSTRAINT menu_items_category_id_name_key UNIQUE (category_id, name);
    END IF;

    -- Ensure missing columns for Menus
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'menu_categories' AND column_name = 'is_active') THEN
        ALTER TABLE menu_categories ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'menu_items' AND column_name = 'is_active') THEN
        ALTER TABLE menu_items ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
    END IF;

    -- Order Items
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'order_items') THEN
        CREATE TABLE order_items (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
            menu_item_id UUID REFERENCES menu_items(id),
            name TEXT,
            quantity INTEGER NOT NULL DEFAULT 1,
            unit_price DECIMAL(10,2),
            total_price DECIMAL(10,2),
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    ELSE
        -- Ensure missing columns are added
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'unit_price') THEN
            ALTER TABLE order_items ADD COLUMN unit_price DECIMAL(10,2);
        END IF;
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'total_price') THEN
            ALTER TABLE order_items ADD COLUMN total_price DECIMAL(10,2);
        END IF;
        
        -- Drop NOT NULL from all potential legacy columns
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'name') THEN
            ALTER TABLE order_items ADD COLUMN name TEXT;
        ELSE
            ALTER TABLE order_items ALTER COLUMN name DROP NOT NULL;
        END IF;
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'price') THEN
            ALTER TABLE order_items ALTER COLUMN price DROP NOT NULL;
        END IF;
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'unit_price') THEN
            ALTER TABLE order_items ALTER COLUMN unit_price DROP NOT NULL;
        END IF;
    END IF;

    -- Trips
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'rider_id') THEN
        ALTER TABLE trips ADD COLUMN rider_id UUID REFERENCES users(id);
    ELSE
        ALTER TABLE trips ALTER COLUMN rider_id DROP NOT NULL;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'driver_id') THEN
        ALTER TABLE trips ADD COLUMN driver_id UUID REFERENCES drivers(id);
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'order_id') THEN
        ALTER TABLE trips ADD COLUMN order_id UUID REFERENCES orders(id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'initial_offer') THEN
        ALTER TABLE trips ADD COLUMN initial_offer DECIMAL(10,2);
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'current_price') THEN
        ALTER TABLE trips ADD COLUMN current_price DECIMAL(10,2);
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'accepted_at') THEN
        ALTER TABLE trips ADD COLUMN accepted_at TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'picked_up_at') THEN
        ALTER TABLE trips ADD COLUMN picked_up_at TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'delivered_at') THEN
        ALTER TABLE trips ADD COLUMN delivered_at TIMESTAMPTZ;
    END IF;

    -- Drivers
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'drivers' AND column_name = 'user_id') THEN
        ALTER TABLE drivers ADD COLUMN user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'drivers' AND column_name = 'last_location_update') THEN
        ALTER TABLE drivers ADD COLUMN last_location_update TIMESTAMPTZ;
    END IF;
END $$;

-- ========================================================================================
-- 1. CORE HIERARCHY (MULTI-TENANT)
-- ========================================================================================

-- Organizations (The "Tenants" or "Brands")
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    plan TEXT DEFAULT 'Starter', -- 'Starter', 'Enterprise', 'Sovereign'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Regions (Geographic Clusters within an Org)
CREATE TABLE IF NOT EXISTS regions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stores (Physical Locations / Outlets)
CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    region_id UUID REFERENCES regions(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    address TEXT,
    location_lat DOUBLE PRECISION,
    location_lng DOUBLE PRECISION,
    timezone TEXT DEFAULT 'UTC',
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'busy')),
    acceptance_mode TEXT DEFAULT 'manual' CHECK (acceptance_mode IN ('manual', 'auto')),
    is_active BOOLEAN DEFAULT TRUE,
    sla_warning_minutes INTEGER DEFAULT 10,
    sla_breach_minutes INTEGER DEFAULT 30,
    escalation_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(name, organization_id)
);

-- ========================================================================================
-- 2. UNIFIED IDENTITY & RBAC
-- ========================================================================================

-- RBAC Roles
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL, -- 'SuperAdmin', 'Owner', 'Admin', 'Manager', 'Staff', 'Driver', 'Customer'
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (Unified table for Staff, Customers, and potentially Drivers)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Often maps to auth.users.id
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
    role_id UUID REFERENCES roles(id),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone_number TEXT,
    push_token TEXT,
    avatar_url TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================================
-- 3. PRODUCT & MENU MANAGEMENT (CMS)
-- ========================================================================================

CREATE TABLE IF NOT EXISTS menu_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    rank INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES menu_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    tags TEXT[], -- ['vegan', 'popular', 'promo']
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================================
-- 4. ORDER FULFILLMENT & LOGISTICS
-- ========================================================================================

-- Core Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_order_id TEXT UNIQUE,
    organization_id UUID NOT NULL REFERENCES organizations(id),
    store_id UUID NOT NULL REFERENCES stores(id),
    customer_id UUID REFERENCES users(id), -- Essential for mobile tracking
    customer_name TEXT, -- Fallback/Guest
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'preparing', 'ready', 'in_transit', 'completed', 'cancelled', 'unfulfilled')),
    source TEXT DEFAULT 'mobile_app', -- 'mobile_app', 'web_portal', 'admin'
    metadata JSONB DEFAULT '{}',
    accepted_at TIMESTAMPTZ,
    ready_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items (Line Items)
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id),
    name TEXT,
    unit_price DECIMAL(10,2),
    total_price DECIMAL(10,2),
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================================
-- 5. REAL-TIME MARKETPLACE (DRIVERS & TRIPS)
-- ========================================================================================

-- Drivers (Mobile Telemetry)
CREATE TABLE IF NOT EXISTS drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    external_id TEXT UNIQUE NOT NULL, -- e.g. 'PILOT-342'
    name TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'busy')),
    speed DOUBLE PRECISION DEFAULT 0,
    battery INTEGER DEFAULT 100,
    heading INTEGER DEFAULT 0,
    altitude DOUBLE PRECISION DEFAULT 0,
    last_location_update TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trips (Ride Hailing / Delivery Logistics)
CREATE TABLE IF NOT EXISTS trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_id TEXT UNIQUE NOT NULL,
    rider_id UUID REFERENCES users(id),
    driver_id UUID REFERENCES drivers(id),
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    initial_offer DECIMAL(10,2) NOT NULL,
    current_price DECIMAL(10,2) NOT NULL,
    final_price DECIMAL(10,2),
    status TEXT DEFAULT 'negotiating' CHECK (status IN ('negotiating', 'pending', 'matched', 'assigned', 'picked_up', 'in_transit', 'completed', 'cancelled')),
    negotiation_history JSONB DEFAULT '[]',
    accepted_at TIMESTAMPTZ,
    picked_up_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================================
-- 6. MARKETING & CUSTOMER INTELLIGENCE
-- ========================================================================================

CREATE TABLE IF NOT EXISTS marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'Ad', 'Offer'
    status TEXT DEFAULT 'Draft' CHECK (status IN ('Live', 'Scheduled', 'Paused', 'Draft')),
    budget NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS marketing_ads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    orders INTEGER DEFAULT 0,
    spent NUMERIC(10, 2) DEFAULT 0,
    schedule JSONB,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customer_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    criteria JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customer_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    tags TEXT[],
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'ignored')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================================
-- 7. FINTECH & SETTLEMENTS
-- ========================================================================================

CREATE TABLE IF NOT EXISTS bank_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    bank_name TEXT NOT NULL,
    account_last4 TEXT NOT NULL,
    routing_number TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Verified', 'Rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tax_identities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID UNIQUE NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    tax_id_encrypted TEXT NOT NULL,
    billing_address TEXT,
    verification_status TEXT DEFAULT 'Unverified' CHECK (verification_status IN ('Unverified', 'Verifying', 'Verified')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================================
-- 8. OPERATIONS & ANALYTICS
-- ========================================================================================

CREATE TABLE IF NOT EXISTS order_issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'missing_item', 'late', 'refund'
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'escalated')),
    resolution_notes TEXT,
    assigned_to UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    entity_type TEXT NOT NULL, -- 'order', 'menu', 'user'
    entity_id UUID NOT NULL,
    action TEXT NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE'
    performed_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================================
-- 9. PERFORMANCE OPTIMIZATION (INDEXES)
-- ========================================================================================

CREATE INDEX IF NOT EXISTS idx_users_org ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_stores_org ON stores(organization_id);
CREATE INDEX IF NOT EXISTS idx_orders_store ON orders(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_org ON orders(organization_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_menu_items_cat ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_audit_org ON audit_logs(organization_id);

-- ========================================================================================
-- 10. SECURITY (RLS)
-- ========================================================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;

-- Note: Policies usually check auth.jwt() claims for multi-tenancy.
-- Example: Allow users to see data from their own organization
-- CREATE POLICY org_isolation ON orders USING (organization_id = (auth.jwt() ->> 'org_id')::uuid);

-- Rider: Can see their own active orders
DROP POLICY IF EXISTS rider_view_own_orders ON orders;
CREATE POLICY rider_view_own_orders ON orders 
    FOR SELECT USING (customer_id = auth.uid());

-- Pilot: Can see available missions
DROP POLICY IF EXISTS pilot_view_available_missions ON trips;
CREATE POLICY pilot_view_available_missions ON trips 
    FOR SELECT USING (status = 'pending' AND driver_id IS NULL);

-- Pilot: Can see their assigned trips
DROP POLICY IF EXISTS pilot_view_own_trips ON trips;
CREATE POLICY pilot_view_own_trips ON trips 
    FOR SELECT USING (driver_id = (SELECT id FROM drivers WHERE user_id = auth.uid()));

-- Pilot: Can update their own telemetry
DROP POLICY IF EXISTS pilot_update_telemetry ON drivers;
CREATE POLICY pilot_update_telemetry ON drivers 
    FOR UPDATE USING (user_id = auth.uid());

-- ========================================================================================
-- 11. REAL-TIME CHANNEL (Resilient)
-- ========================================================================================
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE orders;
    EXCEPTION WHEN duplicate_object THEN
        RAISE NOTICE 'Table orders already in publication';
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE drivers;
    EXCEPTION WHEN duplicate_object THEN
        RAISE NOTICE 'Table drivers already in publication';
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE trips;
    EXCEPTION WHEN duplicate_object THEN
        RAISE NOTICE 'Table trips already in publication';
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE order_issues;
    EXCEPTION WHEN duplicate_object THEN
        RAISE NOTICE 'Table order_issues already in publication';
    END;
END $$;
