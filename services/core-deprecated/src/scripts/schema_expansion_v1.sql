-- DashDrive Backend Expansion: SQL Migration Script
-- Target: Supabase (PostgreSQL)

-- 1. Marketing Protocol Layer
CREATE TABLE IF NOT EXISTS marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'Ad', 'Offer'
    status TEXT NOT NULL DEFAULT 'Draft', -- 'Live', 'Scheduled', 'Paused', 'Draft'
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

-- Adjust marketing_offers to support analytics
ALTER TABLE marketing_offers 
ADD COLUMN IF NOT EXISTS redemptions INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS avg_order_value NUMERIC(10, 2) DEFAULT 0;

-- 2. Customer Intelligence Layer
CREATE TABLE IF NOT EXISTS customer_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    criteria JSONB NOT NULL, -- e.g. {"min_spent": 500}
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enhance customer_feedback
ALTER TABLE customer_feedback
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES orders(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS customer_engagements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'Email', 'Offer', 'Message'
    content TEXT,
    status TEXT DEFAULT 'Sent',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Financial Command Layer
CREATE TABLE IF NOT EXISTS bank_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    bank_name TEXT NOT NULL,
    account_last4 TEXT NOT NULL,
    routing_number TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tax_identities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID UNIQUE NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    tax_id_encrypted TEXT NOT NULL,
    billing_address TEXT,
    verification_status TEXT DEFAULT 'Unverified',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Row Level Security (RLS) Policies
-- Essential for multi-tenant isolation

ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_engagements ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_identities ENABLE ROW LEVEL SECURITY;

-- Generic Policy for Organization isolation (Assumes JWT contains org_id or handled by service role)
-- Note: In Service Role mode (Backend), these are often bypassed, but good for safety.

CREATE POLICY org_isolation_campaigns ON marketing_campaigns FOR ALL USING (organization_id = (auth.jwt() ->> 'org_id')::uuid);
CREATE POLICY org_isolation_ads ON marketing_ads FOR ALL USING (organization_id = (auth.jwt() ->> 'org_id')::uuid);
CREATE POLICY org_isolation_cust_groups ON customer_groups FOR ALL USING (organization_id = (auth.jwt() ->> 'org_id')::uuid);
CREATE POLICY org_isolation_cust_eng ON customer_engagements FOR ALL USING (organization_id = (auth.jwt() ->> 'org_id')::uuid);
CREATE POLICY org_isolation_bank ON bank_accounts FOR ALL USING (organization_id = (auth.jwt() ->> 'org_id')::uuid);
CREATE POLICY org_isolation_tax ON tax_identities FOR ALL USING (organization_id = (auth.jwt() ->> 'org_id')::uuid);

-- 5. Indexes for Performance
CREATE INDEX idx_marketing_campaigns_org ON marketing_campaigns(organization_id);
CREATE INDEX idx_marketing_ads_campaign ON marketing_ads(campaign_id);
CREATE INDEX idx_customer_groups_org ON customer_groups(organization_id);
CREATE INDEX idx_bank_accounts_org ON bank_accounts(organization_id);
