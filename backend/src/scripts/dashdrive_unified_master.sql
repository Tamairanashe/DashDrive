-- ========================================================================================
-- DASHDRIVE UNIFIED MASTER SCHEMA
-- Target: Supabase (PostgreSQL)
-- Modules: Food Manager, Merchant Portal, Admin Panel, Mobile App (User/Driver)
-- ========================================================================================

-- 0. EXTENSIONS & PREREQUISITES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================================================================
-- 0.1 REGIONAL CONFIGURATION (Countries)
-- ========================================================================================
CREATE TABLE IF NOT EXISTS countries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL, -- e.g. 'ZW', 'KE', 'NG'
    currency TEXT NOT NULL, -- e.g. 'USD', 'KES', 'NGN'
    timezone TEXT NOT NULL, -- e.g. 'Africa/Harare'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed some default countries
INSERT INTO countries (name, code, currency, timezone)
VALUES 
('Zimbabwe', 'ZW', 'USD', 'Africa/Harare'),
('Kenya', 'KE', 'KES', 'Africa/Nairobi'),
('Nigeria', 'NG', 'NGN', 'Africa/Lagos')
ON CONFLICT (code) DO NOTHING;

-- ========================================================================================
-- LEGACY NORMALIZATION (Fixes "tenant_id" vs "organization_id" conflicts)
-- ========================================================================================
-- 0. Drop dependent policies before any type alterations
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'orders') THEN
        DROP POLICY IF EXISTS rider_view_own_orders ON orders;
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'trips') THEN
        DROP POLICY IF EXISTS pilot_view_own_trips ON trips;
        DROP POLICY IF EXISTS pilot_view_available_missions ON trips;
    END IF;

    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'drivers') THEN
        DROP POLICY IF EXISTS pilot_update_telemetry ON drivers;
    END IF;

    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'chat_messages') THEN
        DROP POLICY IF EXISTS chat_participant_isolation ON chat_messages;
    END IF;

    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'trip_ratings') THEN
        DROP POLICY IF EXISTS participant_rate_participant ON trip_ratings;
    END IF;

    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'order_issues') THEN
        DROP POLICY IF EXISTS store_staff_view_issues ON order_issues;
    END IF;
END $$;

-- 1. LEGACY NORMALIZATION (Fixes "tenant_id" vs "organization_id")
DO $$ 
BEGIN
    -- Rename 'tenants' to 'organizations' if it exists
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'tenants') AND 
       NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'organizations') THEN
        ALTER TABLE tenants RENAME TO organizations;
    END IF;

    -- Standardize Columns (tenant_id -> organization_id)
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'organizations' AND column_name = 'country_id') THEN
        ALTER TABLE organizations ADD COLUMN country_id UUID REFERENCES countries(id);
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'type') THEN
        ALTER TABLE orders ADD COLUMN type TEXT DEFAULT 'food';
    END IF;

    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'tenant_id') THEN
        ALTER TABLE orders RENAME COLUMN tenant_id TO organization_id;
    END IF;

    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'tenant_id') THEN
        ALTER TABLE users RENAME COLUMN tenant_id TO organization_id;
    END IF;

    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'stores' AND column_name = 'tenant_id') THEN
        ALTER TABLE stores RENAME COLUMN tenant_id TO organization_id;
    END IF;

    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'menu_categories' AND column_name = 'tenant_id') THEN
        ALTER TABLE menu_categories RENAME COLUMN tenant_id TO organization_id;
    END IF;

    -- Ensure Base Tables for FKs
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'organizations') THEN
        CREATE TABLE organizations (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
    END IF;

    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'regions') THEN
        CREATE TABLE regions (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    END IF;

    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'roles') THEN
        CREATE TABLE roles (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT UNIQUE NOT NULL,
            permissions JSONB DEFAULT '{}',
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    END IF;

    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'stores') THEN
        CREATE TABLE stores (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    END IF;

    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'users') THEN
        CREATE TABLE users (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            email TEXT UNIQUE NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    END IF;

    -- Migration for Stores
    ALTER TABLE stores ADD COLUMN IF NOT EXISTS region_id UUID REFERENCES regions(id);
    ALTER TABLE stores ADD COLUMN IF NOT EXISTS address TEXT;
    ALTER TABLE stores ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC';
    ALTER TABLE stores ADD COLUMN IF NOT EXISTS country_id UUID REFERENCES countries(id);
    ALTER TABLE stores ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'food';
    ALTER TABLE stores ADD COLUMN IF NOT EXISTS acceptance_mode TEXT DEFAULT 'manual' CHECK (acceptance_mode IN ('manual', 'auto'));
    ALTER TABLE stores ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
    ALTER TABLE stores ADD COLUMN IF NOT EXISTS sla_breach_minutes INTEGER DEFAULT 30;
    ALTER TABLE stores ADD COLUMN IF NOT EXISTS escalation_roles text[] DEFAULT ARRAY['manager', 'owner'];
    ALTER TABLE stores ADD COLUMN IF NOT EXISTS escalation_enabled boolean DEFAULT true;

    -- Migration for Users
    ALTER TABLE users ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES stores(id);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS role_id UUID REFERENCES roles(id);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
    ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS push_token TEXT;

    -- Migration for Orders
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'orders') THEN
        CREATE TABLE orders (id UUID PRIMARY KEY DEFAULT uuid_generate_v4());
    END IF;
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES stores(id) ON DELETE CASCADE;
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES users(id);
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name TEXT;
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2) DEFAULT 0;
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new';
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'food';
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

    -- Migration for Menus
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'menu_categories') THEN
        CREATE TABLE menu_categories (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    END IF;
    ALTER TABLE menu_categories ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
    ALTER TABLE menu_categories ADD COLUMN IF NOT EXISTS rank INTEGER DEFAULT 0;
    ALTER TABLE menu_categories ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'menu_items') THEN
        CREATE TABLE menu_items (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            category_id UUID NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    END IF;
    ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS description TEXT;
    ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS image_url TEXT;
    ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT TRUE;
    ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS tags TEXT[];

    -- Migration for Order Items
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'order_items') THEN
        CREATE TABLE order_items (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
            quantity INTEGER NOT NULL DEFAULT 1,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    END IF;
    ALTER TABLE order_items ADD COLUMN IF NOT EXISTS menu_item_id UUID REFERENCES menu_items(id);
    ALTER TABLE order_items ADD COLUMN IF NOT EXISTS name TEXT;
    ALTER TABLE order_items ADD COLUMN IF NOT EXISTS unit_price DECIMAL(10,2);
    ALTER TABLE order_items ADD COLUMN IF NOT EXISTS total_price DECIMAL(10,2);

    -- Migration for Trips
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'trips') THEN
        CREATE TABLE trips (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), external_id TEXT UNIQUE NOT NULL);
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'rider_id') THEN
        ALTER TABLE trips ADD COLUMN rider_id UUID REFERENCES users(id);
    ELSE
        ALTER TABLE trips ALTER COLUMN rider_id TYPE UUID USING rider_id::uuid;
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'driver_id') THEN
        ALTER TABLE trips ADD COLUMN driver_id UUID; -- References drivers(id) added later
    ELSE
        ALTER TABLE trips ALTER COLUMN driver_id TYPE UUID USING driver_id::uuid;
    END IF;
    ALTER TABLE trips ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES orders(id) ON DELETE SET NULL;
    ALTER TABLE trips ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'ride';
    ALTER TABLE trips ADD COLUMN IF NOT EXISTS initial_offer DECIMAL(10,2);
    ALTER TABLE trips ADD COLUMN IF NOT EXISTS current_price DECIMAL(10,2);

    -- Migration for Drivers
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'drivers') THEN
        CREATE TABLE drivers (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), external_id TEXT UNIQUE NOT NULL, name TEXT NOT NULL);
    END IF;
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'drivers' AND column_name = 'user_id') THEN
        ALTER TABLE drivers ADD COLUMN user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE;
    ELSE
        ALTER TABLE drivers ALTER COLUMN user_id TYPE UUID USING user_id::uuid;
    END IF;
    ALTER TABLE drivers ADD COLUMN IF NOT EXISTS last_location_update TIMESTAMPTZ;

    -- Migration for Unfulfilled Orders (Loss Tracking)
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'unfulfilled_orders') THEN
        CREATE TABLE unfulfilled_orders (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
            reason TEXT,
            revenue_loss DECIMAL(10,2),
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
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
    type TEXT DEFAULT 'food', -- 'food', 'mart', 'shopping'
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

-- Product Variants (Sizes, Colors, etc)
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sku TEXT UNIQUE,
    price_override DECIMAL(10,2),
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Modifier Groups (Add-ons, Choices)
CREATE TABLE IF NOT EXISTS modifier_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g. "Choose your crust"
    min_select INTEGER DEFAULT 0,
    max_select INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Modifiers (Individual Options)
CREATE TABLE IF NOT EXISTS modifiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    modifier_group_id UUID NOT NULL REFERENCES modifier_groups(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g. "Thin Crust"
    price DECIMAL(10,2) DEFAULT 0,
    stock INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory Logs (Audit Trail for stock)
CREATE TABLE IF NOT EXISTS inventory_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    change INTEGER NOT NULL,
    reason TEXT NOT NULL, -- 'RESTOCK', 'SALE', 'ADJUSTMENT'
    created_at TIMESTAMPTZ DEFAULT NOW()
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
    type TEXT DEFAULT 'food', -- 'food', 'mart', 'shopping'
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

-- Order Status History (Audit Trail)
CREATE TABLE IF NOT EXISTS order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    note TEXT,
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
    ride_slots INTEGER DEFAULT 0, -- Available rides the driver can accept (Prepaid model)
    rating DECIMAL(3,2) DEFAULT 0.00, -- Cached average rating
    rating_count INTEGER DEFAULT 0, -- Number of ratings received
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trips (Ride Hailing / Delivery Logistics)
CREATE TABLE IF NOT EXISTS trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_id TEXT UNIQUE NOT NULL,
    rider_id UUID REFERENCES users(id),
    driver_id UUID REFERENCES drivers(id),
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    origin JSONB, -- { address: string, lat: number, lng: number }
    destination JSONB, -- { address: string, lat: number, lng: number }
    initial_offer DECIMAL(10,2) NOT NULL,
    current_price DECIMAL(10,2) NOT NULL,
    final_price DECIMAL(10,2),
    status TEXT DEFAULT 'negotiating' CHECK (status IN ('negotiating', 'pending', 'matched', 'assigned', 'picked_up', 'in_transit', 'completed', 'cancelled')),
    type TEXT DEFAULT 'ride', -- 'ride', 'parcel'
    metadata JSONB DEFAULT '{}', -- Service specific details
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

    status TEXT DEFAULT 'Sent',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coupons (Promotions)
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT DEFAULT 'PERCENTAGE' CHECK (discount_type IN ('PERCENTAGE', 'FIXED_AMOUNT')),
    discount_value DECIMAL(10,2) NOT NULL,
    min_order_amount DECIMAL(10,2) DEFAULT 0,
    max_discount_amount DECIMAL(10,2),
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Featured Items (Boosts)
CREATE TABLE IF NOT EXISTS featured_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    boost_level DECIMAL(3,2) DEFAULT 1.5,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
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

-- Reports Cache (Unified from Manager)
CREATE TABLE IF NOT EXISTS reports_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id),
    organization_id UUID REFERENCES organizations(id),
    report_type TEXT NOT NULL, -- 'sales', 'performance', 'customers'
    data JSONB NOT NULL,
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================================
-- 9. OPERATIONS & ANALYTICS (Continued)
-- ========================================================================================

    performed_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Zones (Geographic Surge / Pricing)
CREATE TABLE IF NOT EXISTS zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_code TEXT NOT NULL REFERENCES countries(code),
    name TEXT NOT NULL,
    min_lat DOUBLE PRECISION NOT NULL,
    max_lat DOUBLE PRECISION NOT NULL,
    min_lng DOUBLE PRECISION NOT NULL,
    max_lng DOUBLE PRECISION NOT NULL,
    surge_multiplier DECIMAL(3,2) DEFAULT 1.0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Risk Events (Fraud Detection)
CREATE TABLE IF NOT EXISTS risk_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type TEXT NOT NULL, -- 'ORDER', 'PAYMENT', 'WITHDRAWAL', 'DELIVERY', 'WALLET'
    reference_id UUID NOT NULL,
    actor_id UUID NOT NULL,
    actor_type TEXT NOT NULL, -- 'CUSTOMER', 'MERCHANT', 'RIDER'
    risk_score DECIMAL(5,2) NOT NULL,
    decision TEXT NOT NULL CHECK (decision IN ('APPROVED', 'REVIEW', 'BLOCKED')),
    reasons JSONB DEFAULT '{}',
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
    FOR SELECT USING (customer_id::uuid = auth.uid());

-- Pilot: Can see available missions
DROP POLICY IF EXISTS pilot_view_available_missions ON trips;
CREATE POLICY pilot_view_available_missions ON trips 
    FOR SELECT USING (status = 'pending' AND driver_id IS NULL);

-- Pilot: Can see their assigned trips
DROP POLICY IF EXISTS pilot_view_own_trips ON trips;
CREATE POLICY pilot_view_own_trips ON trips 
    FOR SELECT USING (driver_id::uuid = (SELECT id FROM drivers WHERE user_id::uuid = auth.uid()));

-- Pilot: Can update their own telemetry
DROP POLICY IF EXISTS pilot_update_telemetry ON drivers;
CREATE POLICY pilot_update_telemetry ON drivers 
    FOR UPDATE USING (user_id::uuid = auth.uid());

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

-- ========================================================================================
-- 11. FINTECH PILLARS (Assets & Identities)
-- ========================================================================================

-- Bank Accounts (For Payouts)
CREATE TABLE IF NOT EXISTS bank_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Link to Driver/Owner
    bank_name TEXT NOT NULL,
    account_last4 TEXT NOT NULL,
    routing_number TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tax Identities (For Compliance)
CREATE TABLE IF NOT EXISTS tax_identities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    tax_id_encrypted TEXT NOT NULL,
    billing_address TEXT,
    verification_status TEXT DEFAULT 'Unverified',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id)
);

-- ========================================================================================
-- 12. UNIFIED WALLET & TRANSACTION SYSTEM
-- ========================================================================================

-- Wallets (Unified for Users and Drivers)
CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    balance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    currency TEXT DEFAULT 'USD',
    frozen_balance DECIMAL(15,2) NOT NULL DEFAULT 0.00, -- Amount pending settlement
    pin_hash TEXT, -- Optional security PIN
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'closed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wallet Transactions
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('deposit', 'withdrawal', 'payment', 'earning', 'commission', 'refund', 'adjustment')),
    amount DECIMAL(15,2) NOT NULL,
    fee DECIMAL(15,2) DEFAULT 0.00,
    net_amount DECIMAL(15,2) NOT NULL,
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    reference_type TEXT, -- 'trip', 'order', 'adjustment'
    reference_id UUID, -- Links to trips.id or orders.id
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payouts (Wallet Withdrawals)
CREATE TABLE IF NOT EXISTS payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    bank_account_id UUID REFERENCES bank_accounts(id) ON DELETE SET NULL,
    amount DECIMAL(15,2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    processed_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices for Financial Lookups
CREATE INDEX IF NOT EXISTS idx_wallet_user ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_tx_wallet ON wallet_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_tx_ref ON wallet_transactions(reference_id);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_org ON bank_accounts(organization_id);
CREATE INDEX IF NOT EXISTS idx_cust_eng_org ON customer_engagements(organization_id);
CREATE INDEX IF NOT EXISTS idx_tax_org ON tax_identities(organization_id);

-- RLS for Wallets
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_engagements ENABLE ROW LEVEL SECURITY;

-- Real-time for Financials
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE wallets;
    EXCEPTION WHEN duplicate_object THEN
        RAISE NOTICE 'Table wallets already in publication';
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE wallet_transactions;
    EXCEPTION WHEN duplicate_object THEN
        RAISE NOTICE 'Table wallet_transactions already in publication';
    END;
END $$;

-- ========================================================================================
-- 13. FINTECH STORED PROCEDURES (ATOMICITY)
-- ========================================================================================

-- process_wallet_transaction: Handles balance updates and logging in one transaction.
CREATE OR REPLACE FUNCTION process_wallet_transaction(
    p_wallet_id UUID,
    p_type TEXT,
    p_amount DECIMAL,
    p_ref_type TEXT DEFAULT NULL,
    p_ref_id UUID DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'
) RETURNS VOID AS $$
DECLARE
    v_new_balance DECIMAL;
BEGIN
    -- 1. Update Wallet Balance
    UPDATE wallets 
    SET balance = balance + p_amount,
        updated_at = NOW()
    WHERE id = p_wallet_id
    RETURNING balance INTO v_new_balance;

    -- 2. Check for insufficient funds (if debit)
    IF p_amount < 0 AND v_new_balance < 0 THEN
        RAISE EXCEPTION 'Insufficient wallet balance';
    END IF;

    -- 3. Log Transaction
    INSERT INTO wallet_transactions (
        wallet_id,
        transaction_type,
        amount,
        net_amount,
        reference_type,
        reference_id,
        metadata
    ) VALUES (
        p_wallet_id,
        p_type,
        ABS(p_amount),
        p_amount,
        p_ref_type,
        p_ref_id,
        p_metadata
    );

END;
$$ LANGUAGE plpgsql;

-- ========================================================================================
-- 14. PREPAID RIDE PACKAGES
-- ========================================================================================

CREATE TABLE IF NOT EXISTS prepaid_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL, -- e.g. 'Starter Pack'
    price DECIMAL(10,2) NOT NULL, -- e.g. 10.00
    ride_slots INTEGER NOT NULL, -- e.g. 9
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================================
-- 14.5 REAL-TIME METRICS (RPC FUNCTIONS)
-- ========================================================================================

-- get_store_metrics: Provides instant dashboard stats for a store.
CREATE OR REPLACE FUNCTION get_store_metrics(p_store_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_orders_today INT;
  v_total_revenue NUMERIC;
  v_avg_prep_min INT;
  v_live_issues INT;
BEGIN
  -- Orders Today (New, In Progress, Ready, Completed today)
  SELECT COUNT(*) INTO v_orders_today
  FROM orders
  WHERE store_id = p_store_id
    AND created_at >= CURRENT_DATE;

  -- Net Revenue Today (Completed orders)
  SELECT COALESCE(SUM(total_amount), 0) INTO v_total_revenue
  FROM orders
  WHERE store_id = p_store_id
    AND status = 'completed'
    AND created_at >= CURRENT_DATE;

  -- Avg Prep Time (Minutes) - Real-time Kitchen Velocity (1-day rolling window)
  SELECT COALESCE(AVG(EXTRACT(EPOCH FROM (ready_at - accepted_at))/60), 0)::INT INTO v_avg_prep_min
  FROM orders
  WHERE store_id = p_store_id
    AND ready_at IS NOT NULL
    AND accepted_at IS NOT NULL
    AND created_at >= NOW() - INTERVAL '1 day';

  -- Live Issues (Open or Reviewing)
  SELECT COUNT(*) INTO v_live_issues
  FROM order_issues
  WHERE status IN ('open', 'investigating')
    AND order_id IN (SELECT id FROM orders WHERE store_id = p_store_id);

  RETURN JSONB_BUILD_OBJECT(
    'orders_today', v_orders_today,
    'total_revenue', v_total_revenue,
    'avg_prep_min', v_avg_prep_min,
    'live_issues', v_live_issues,
    'new_count', (SELECT COUNT(*) FROM orders WHERE store_id = p_store_id AND status = 'new' AND created_at >= CURRENT_DATE),
    'in_progress_count', (SELECT COUNT(*) FROM orders WHERE store_id = p_store_id AND status = 'in_progress' AND created_at >= CURRENT_DATE),
    'ready_count', (SELECT COUNT(*) FROM orders WHERE store_id = p_store_id AND status = 'ready' AND ready_at >= NOW() - INTERVAL '2 hours'),
    'avg_ready_wait_min', (SELECT COALESCE(AVG(EXTRACT(EPOCH FROM (NOW() - ready_at))/60), 0)::INT FROM orders WHERE store_id = p_store_id AND status = 'ready' AND ready_at IS NOT NULL)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- cleanup_stale_ready_orders: Prevents orders from being stuck as 'ready' indefinitely.
CREATE OR REPLACE FUNCTION cleanup_stale_ready_orders()
RETURNS void AS $$
BEGIN
  -- Mark orders as 'unfulfilled' with a reason if they've been 'ready' for more than 12 hours
  UPDATE orders
  SET status = 'unfulfilled',
      completed_at = NOW(),
      updated_at = NOW()
  WHERE status = 'ready'
    AND ready_at < NOW() - INTERVAL '12 hours';

  -- Create an entry in unfulfilled_orders for loss tracking
  INSERT INTO unfulfilled_orders (order_id, reason, revenue_loss)
  SELECT id, 'STALE_READY_ORDER_TIMEOUT', total_amount
  FROM orders
  WHERE status = 'ready'
    AND ready_at < NOW() - INTERVAL '12 hours'
    AND id NOT IN (SELECT order_id FROM unfulfilled_orders);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Seed some default packages
INSERT INTO prepaid_packages (name, price, ride_slots) 
VALUES ('Standard Lead Pack', 10.00, 9)
ON CONFLICT DO NOTHING;

-- ========================================================================================
-- 15. SEED INITIAL DATA
-- ========================================================================================

-- Seed initial test drivers
INSERT INTO drivers (external_id, name, latitude, longitude, status, battery, heading, altitude)
VALUES 
('PILOT-342', 'John Smith', 51.5074, -0.1278, 'online', 85, 180, 12),
('PILOT-882', 'Sarah Johnson', 51.5154, -0.1410, 'online', 92, 45, 8)
ON CONFLICT (external_id) DO NOTHING;

-- ========================================================================================
-- 16. REAL-TIME CHAT / MESSAGING (COORDINATION)
-- ========================================================================================

CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices for Chat Performance
CREATE INDEX IF NOT EXISTS idx_chat_trip ON chat_messages(trip_id);
CREATE INDEX IF NOT EXISTS idx_chat_sender ON chat_messages(sender_id);

-- RLS for Chat (Only Trip participants can see messages)
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY chat_participant_isolation ON chat_messages
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM trips t
        WHERE t.id = chat_messages.trip_id
        AND (t.rider_id::uuid = auth.uid() OR t.driver_id::uuid = (SELECT id FROM drivers WHERE user_id::uuid = auth.uid()))
    )
);

-- Real-time for Chat
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
    EXCEPTION WHEN duplicate_object THEN
        RAISE NOTICE 'Table chat_messages already in publication';
    END;
END $$;
-- ========================================================================================
-- 17. TRUST & SAFETY (RATINGS)
-- ========================================================================================

CREATE TABLE IF NOT EXISTS trip_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    rater_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rated_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(trip_id, rater_id) -- One rating per participant per trip
);

-- Indices for Rating Performance
CREATE INDEX IF NOT EXISTS idx_rating_trip ON trip_ratings(trip_id);
CREATE INDEX IF NOT EXISTS idx_rating_rated ON trip_ratings(rated_id);

-- RLS for Ratings
ALTER TABLE trip_ratings ENABLE ROW LEVEL SECURITY;

-- Everyone can see public ratings of a user/driver
DROP POLICY IF EXISTS public_view_ratings ON trip_ratings;
CREATE POLICY public_view_ratings ON trip_ratings
    FOR SELECT USING (true);

-- Only a participant of a trip can rate another participant
DROP POLICY IF EXISTS participant_rate_participant ON trip_ratings;
CREATE POLICY participant_rate_participant ON trip_ratings
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM trips t
            WHERE t.id = trip_id
            AND (t.rider_id::uuid = auth.uid() OR t.driver_id::uuid = (SELECT id FROM drivers WHERE user_id::uuid = auth.uid()))
        )
    );

-- Real-time for Ratings
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE trip_ratings;
    EXCEPTION WHEN duplicate_object THEN
        RAISE NOTICE 'Table trip_ratings already in publication';
    END;
END $$;
