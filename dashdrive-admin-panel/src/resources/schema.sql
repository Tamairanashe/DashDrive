-- DashDrive Financial Marketplace - Production Schema (PostgreSQL/Supabase Compatible)

-- 0. Cleanup (Optional: uncomment if you want to reset types on every run)
-- DROP TYPE IF EXISTS product_category CASCADE;
-- DROP TYPE IF EXISTS product_status CASCADE;
-- DROP TYPE IF EXISTS lead_source CASCADE;
-- DROP TYPE IF EXISTS credit_tier CASCADE;
-- DROP TYPE IF EXISTS lead_status CASCADE;
-- DROP TYPE IF EXISTS app_status CASCADE;
-- DROP TYPE IF EXISTS app_decision CASCADE;
-- DROP TYPE IF EXISTS policy_status CASCADE;
-- DROP TYPE IF EXISTS claim_status CASCADE;
-- DROP TYPE IF EXISTS tx_type CASCADE;
-- DROP TYPE IF EXISTS tx_status CASCADE;

-- 0. Create Custom Types (PostgreSQL requires pre-defined types for Enums)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_category') THEN
        CREATE TYPE product_category AS ENUM ('loan', 'insurance');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_status') THEN
        CREATE TYPE product_status AS ENUM ('active', 'paused', 'deprecated');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_source') THEN
        CREATE TYPE lead_source AS ENUM ('CustomerApp', 'DriverApp');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'credit_tier') THEN
        CREATE TYPE credit_tier AS ENUM ('Platinum', 'Gold', 'Silver', 'Bronze');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_status') THEN
        CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'converted', 'lost');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_status') THEN
        CREATE TYPE app_status AS ENUM ('submitted', 'underwriting', 'approved', 'declined', 'funded');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_decision') THEN
        CREATE TYPE app_decision AS ENUM ('approved', 'rejected', 'counter');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'policy_status') THEN
        CREATE TYPE policy_status AS ENUM ('active', 'pending', 'expired', 'cancelled');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'claim_status') THEN
        CREATE TYPE claim_status AS ENUM ('submitted', 'review', 'approved', 'paid', 'denied');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tx_type') THEN
        CREATE TYPE tx_type AS ENUM ('commission', 'payout', 'refund', 'premium_collection');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tx_status') THEN
        CREATE TYPE tx_status AS ENUM ('pending', 'completed', 'failed');
    END IF;
END $$;

-- 1. Identity & Borrowers
CREATE TABLE IF NOT EXISTS borrowers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    ssn_last4 CHAR(4),
    address_line1 TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Zimbabwe',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Loan & Insurance Products
CREATE TABLE IF NOT EXISTS marketplace_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category product_category NOT NULL,
    type VARCHAR(50) NOT NULL, -- e.g., 'Hybrid Finance', 'Comprehensive'
    min_amount DECIMAL(15, 2),
    max_amount DECIMAL(15, 2),
    min_term_months INT,
    max_term_months INT,
    interest_rate_apr DECIMAL(5, 2),
    status product_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Leads (Marketplace Entry Points)
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id VARCHAR(50) UNIQUE, -- ID from Customer/Driver app
    source lead_source NOT NULL,
    borrower_id UUID REFERENCES borrowers(id),
    loan_amount DECIMAL(15, 2) NOT NULL,
    purpose TEXT,
    credit_tier credit_tier,
    status lead_status DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Loan Applications
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id),
    borrower_id UUID REFERENCES borrowers(id),
    product_id UUID REFERENCES marketplace_products(id),
    requested_amount DECIMAL(15, 2) NOT NULL,
    status app_status DEFAULT 'submitted',
    underwriter_id VARCHAR(100), -- Internal or System ID
    decision app_decision,
    approved_amount DECIMAL(15, 2),
    approved_apr DECIMAL(5, 2),
    approved_term_months INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Insurance Policies
CREATE TABLE IF NOT EXISTS policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id),
    borrower_id UUID REFERENCES borrowers(id),
    product_id UUID REFERENCES marketplace_products(id),
    premium_amount DECIMAL(15, 2) NOT NULL,
    coverage_limit DECIMAL(15, 2) NOT NULL,
    status policy_status DEFAULT 'pending',
    inception_date TIMESTAMP WITH TIME ZONE,
    expiry_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Insurance Claims
CREATE TABLE IF NOT EXISTS claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id UUID REFERENCES policies(id),
    claim_type VARCHAR(100) NOT NULL,
    description TEXT,
    incident_date DATE NOT NULL,
    estimated_payout DECIMAL(15, 2),
    status claim_status DEFAULT 'submitted',
    filed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Marketplace Transactions (Ledger)
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type tx_type NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    currency CHAR(3) DEFAULT 'USD',
    reference_id UUID NOT NULL, -- Can be application_id or policy_id
    status tx_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_apps_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_policies_borrower ON policies(borrower_id);
CREATE INDEX IF NOT EXISTS idx_transactions_ref ON transactions(reference_id);
