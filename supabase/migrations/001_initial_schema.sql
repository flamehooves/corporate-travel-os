-- Travelio Corporate Travel OS — Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Agencies
create table if not exists agencies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  logo_url text,
  created_at timestamptz default now()
);

-- Corporate clients
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid references agencies(id) on delete cascade,
  company_name text not null,
  contact_name text,
  contact_email text,
  contact_phone text,
  credit_limit numeric(12,2) default 0,
  credit_days integer default 30,
  portal_token text unique default substr(md5(random()::text), 1, 12),
  created_at timestamptz default now()
);

-- Agency users (staff)
create table if not exists agency_users (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid references agencies(id) on delete cascade,
  name text not null,
  email text unique not null,
  role text check (role in ('owner', 'consultant', 'accountant')) default 'consultant',
  created_at timestamptz default now()
);

-- Travel requests
create table if not exists travel_requests (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid references agencies(id) on delete cascade,
  client_id uuid references clients(id) on delete set null,
  request_number text unique,
  status text default 'pending' check (status in ('pending', 'in_review', 'options_shared', 'approved', 'booked', 'completed', 'cancelled')),
  traveler_name text,
  traveler_email text,
  traveler_phone text,
  employee_id text,
  trip_type text check (trip_type in ('flight', 'train', 'hotel', 'combined', 'visa', 'other')) default 'flight',
  origin text,
  destination text,
  departure_date date,
  return_date date,
  purpose text,
  budget numeric(12,2),
  preferred_class text,
  special_instructions text,
  assigned_to uuid references agency_users(id) on delete set null,
  submitted_at timestamptz default now(),
  due_at timestamptz,
  approved_at timestamptz,
  booked_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-generate request numbers
create or replace function generate_request_number()
returns trigger as $$
begin
  new.request_number := 'REQ-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('request_seq')::text, 4, '0');
  return new;
end;
$$ language plpgsql;

create sequence if not exists request_seq start 1000;

create trigger set_request_number
  before insert on travel_requests
  for each row
  when (new.request_number is null)
  execute function generate_request_number();

-- Request options (consultant recommendations)
create table if not exists request_options (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references travel_requests(id) on delete cascade,
  option_number integer,
  type text,
  provider text,
  supplier_system text,
  description text,
  details jsonb default '{}',
  supplier_cost numeric(12,2),
  client_price numeric(12,2),
  margin numeric(12,2) generated always as (client_price - supplier_cost) stored,
  status text default 'proposed' check (status in ('proposed', 'approved', 'rejected', 'booked')),
  is_recommended boolean default false,
  created_at timestamptz default now()
);

-- Request messages (consultation thread)
create table if not exists request_messages (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references travel_requests(id) on delete cascade,
  sender_type text check (sender_type in ('agency', 'client')),
  sender_name text,
  message text not null,
  attachments jsonb default '[]',
  created_at timestamptz default now()
);

-- Confirmed bookings
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid references agencies(id) on delete cascade,
  request_id uuid references travel_requests(id) on delete set null,
  option_id uuid references request_options(id) on delete set null,
  booking_number text,
  supplier_system text,
  supplier_ref text,
  supplier_cost numeric(12,2),
  client_price numeric(12,2),
  margin numeric(12,2) generated always as (client_price - supplier_cost) stored,
  status text default 'confirmed' check (status in ('confirmed', 'issued', 'cancelled', 'completed')),
  supplier_paid boolean default false,
  supplier_paid_at timestamptz,
  supplier_paid_amount numeric(12,2),
  client_invoiced boolean default false,
  client_paid boolean default false,
  client_paid_at timestamptz,
  created_at timestamptz default now()
);

-- Invoices to clients
create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid references agencies(id) on delete cascade,
  client_id uuid references clients(id) on delete set null,
  invoice_number text unique,
  amount numeric(12,2),
  tax_amount numeric(12,2) default 0,
  total_amount numeric(12,2) generated always as (amount + tax_amount) stored,
  status text default 'draft' check (status in ('draft', 'sent', 'partial', 'paid', 'overdue')),
  issued_date date,
  due_date date,
  paid_amount numeric(12,2) default 0,
  notes text,
  created_at timestamptz default now()
);

-- Suppliers
create table if not exists suppliers (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid references agencies(id) on delete cascade,
  name text not null,
  type text,
  contact_name text,
  contact_email text,
  contact_phone text,
  portal_url text,
  account_details jsonb default '{}',
  credit_balance numeric(12,2) default 0,
  created_at timestamptz default now()
);

-- Sample data for demo
insert into agencies (id, name, email, phone) values
  ('ag1-0000-0000-0000-000000000001', 'Travelio', 'hello@travelio.in', '+91 98765 00000');

insert into agency_users (id, agency_id, name, email, role) values
  ('u1-00000-0000-0000-000000000001', 'ag1-0000-0000-0000-000000000001', 'Priya Sharma', 'priya@travelio.in', 'owner'),
  ('u2-00000-0000-0000-000000000001', 'ag1-0000-0000-0000-000000000001', 'Arjun Mehta', 'arjun@travelio.in', 'consultant'),
  ('u3-00000-0000-0000-000000000001', 'ag1-0000-0000-0000-000000000001', 'Sneha Kapoor', 'sneha@travelio.in', 'consultant');

insert into clients (id, agency_id, company_name, contact_name, contact_email, credit_limit, credit_days, portal_token) values
  ('c1-00000-0000-0000-000000000001', 'ag1-0000-0000-0000-000000000001', 'Infosys Limited', 'Kavitha Reddy', 'kavitha@infosys.com', 2000000, 30, 'infosys-a8x2k'),
  ('c2-00000-0000-0000-000000000001', 'ag1-0000-0000-0000-000000000001', 'Wipro Technologies', 'Sanjay Desai', 'sanjay@wipro.com', 1500000, 45, 'wipro-b7y3l'),
  ('c3-00000-0000-0000-000000000001', 'ag1-0000-0000-0000-000000000001', 'TCS', 'Meena Iyer', 'meena@tcs.com', 3000000, 30, 'tcs-c4z1m');
