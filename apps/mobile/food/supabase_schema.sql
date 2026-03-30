-- Enable extensions
create extension if not exists "uuid-ossp";

-- ======================
-- TENANTS (SaaS ROOT)
-- ======================
create table if not exists tenants (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  plan text default 'starter',
  created_at timestamp default now()
);

-- ======================
-- USERS (RBAC)
-- ======================
create table if not exists users (
  id uuid primary key,
  tenant_id uuid references tenants(id) on delete cascade,
  email text unique not null,
  role text check (role in ('owner','manager','staff')) default 'staff',
  store_id uuid,
  created_at timestamp default now()
);

-- ======================
-- STORES (MULTI-LOCATION)
-- ======================
create table if not exists stores (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid references tenants(id) on delete cascade,
  name text not null,
  location text,
  status text check (status in ('open','closed','busy')) default 'open',
  acceptance_mode text check (acceptance_mode in ('manual', 'auto')) default 'manual',
  sla_warning_minutes integer default 10,
  sla_breach_minutes integer default 20,
  escalation_roles text[] default array['manager', 'owner'],
  escalation_enabled boolean default true,
  created_at timestamp default now()
);

-- ======================
-- ORDERS (CORE REALTIME TABLE)
-- ======================
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  external_order_id text unique,
  tenant_id uuid references tenants(id),
  store_id uuid references stores(id),
  customer_name text,
  status text check (
    status in ('new','in_progress','ready','completed','unfulfilled')
  ) default 'new',
  total_amount numeric,
  source text default 'node_backend',
  created_at timestamp default now(),
  accepted_at timestamp,
  ready_at timestamp,
  completed_at timestamp
);

-- Index for performance
create index if not exists idx_orders_store on orders(store_id);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_created_at on orders(created_at desc);

-- ======================
-- ORDER ITEMS
-- ======================
create table if not exists order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  name text,
  quantity int,
  notes text
);

-- ======================
-- UNFULFILLED ORDERS (LOSS TRACKING)
-- ======================
create table if not exists unfulfilled_orders (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id),
  reason text,
  revenue_loss numeric,
  created_at timestamp default now()
);

-- ======================
-- ISSUES & DISPUTES
-- ======================
create table if not exists issues (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id),
  type text check (type in ('missing_item','late','wrong_order','refund','complaint')),
  severity text check (severity in ('low','medium','high','critical')),
  status text check (status in ('open','reviewing','resolved','escalated')) default 'open',
  assigned_to uuid,
  resolution_notes text,
  created_at timestamp default now()
);

-- ======================
-- AUDIT LOGS (ENTERPRISE)
-- ======================
create table if not exists audit_logs (
  id uuid primary key default uuid_generate_v4(),
  entity_type text,
  entity_id uuid,
  action text,
  performed_by uuid,
  created_at timestamp default now()
);

-- ======================
-- RLS (ROW LEVEL SECURITY)
-- ======================
alter table users enable row level security;
alter table stores enable row level security;
alter table orders enable row level security;
alter table issues enable row level security;

drop policy if exists "Users can access own tenant data" on orders;
create policy "Users can access own tenant data"
on orders
for all
using (
  tenant_id = (
    select tenant_id from users where id = auth.uid()
  )
);
