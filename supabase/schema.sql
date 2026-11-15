-- Run this in Supabase SQL Editor
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  config jsonb not null default '{}'::jsonb,
  translations jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);
create table if not exists public.products (
  id text primary key,
  brand text not null check (brand in ('veg_bazaar', 'aai_sparsh')),
  category text not null default 'staple',
  in_stock boolean not null default true,
  featured boolean not null default false,
  image_url text not null default '',
  name jsonb not null default '{"en":"","hi":"","kn":""}'::jsonb,
  subtitle jsonb not null default '{"en":"","hi":"","kn":""}'::jsonb,
  description jsonb not null default '{"en":"","hi":"","kn":""}'::jsonb,
  unit_label jsonb not null default '{"en":"","hi":"","kn":""}'::jsonb,
  packs jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  customer_name text,
  customer_phone text,
  delivery_area text,
  items jsonb not null default '[]'::jsonb,
  notes text,
  status text not null default 'new',
  created_at timestamptz default now()
);
alter table public.site_settings enable row level security;
alter table public.products enable row level security;
alter table public.enquiries enable row level security;
create policy "Public read settings" on public.site_settings for select using (true);
create policy "Public read products" on public.products for select using (true);
create policy "Write settings" on public.site_settings for all using (true) with check (true);
create policy "Write products" on public.products for all using (true) with check (true);
create policy "Insert enquiries" on public.enquiries for insert with check (true);
create policy "Read enquiries" on public.enquiries for select using (true);
insert into storage.buckets (id, name, public) values ('brand-assets', 'brand-assets', true) on conflict (id) do nothing;
create policy "Public read assets" on storage.objects for select using (bucket_id = 'brand-assets');
create policy "Upload assets" on storage.objects for insert with check (bucket_id = 'brand-assets');
