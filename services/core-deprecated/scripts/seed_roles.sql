-- Seed Merchant Roles & Permissions
-- This script populates the `roles` table with standard merchant roles

-- Ensure uuid-ossp extension is enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create/Ensure Roles Table exists (as defined in schema_dash_manager.sql)
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL, -- Owner, Admin, Manager, Staff, Analyst
    permissions JSONB DEFAULT '{}'
);

-- 2. Seed Roles
INSERT INTO roles (name, permissions)
VALUES 
('Owner', '{"dashboard": true, "orders": true, "inventory": true, "financials": true, "settings": true, "staff": true, "marketing": true, "reports": true}'),
('Admin', '{"dashboard": true, "orders": true, "inventory": true, "financials": true, "settings": true, "staff": true, "marketing": true, "reports": true}'),
('Manager', '{"dashboard": true, "orders": true, "inventory": true, "financials": false, "settings": false, "staff": true, "marketing": true, "reports": true}'),
('Staff', '{"dashboard": true, "orders": true, "inventory": true, "financials": false, "settings": false, "staff": false, "marketing": false, "reports": false}'),
('Analyst', '{"dashboard": true, "orders": false, "inventory": false, "financials": true, "settings": false, "staff": false, "marketing": false, "reports": true}'),
('super_admin', '{"dashboard": true, "orders": true, "inventory": true, "financials": true, "settings": true, "staff": true, "marketing": true, "reports": true, "platform_admin": true}')
ON CONFLICT (name) DO UPDATE 
SET permissions = EXCLUDED.permissions;
