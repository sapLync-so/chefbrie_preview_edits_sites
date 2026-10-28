-- Chef Brie contact / booking submissions (server-side only via service role)

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  form_type text not null,
  name text,
  email_phone text,
  allergies_dietary text,
  acknowledgment_name text,
  signature_date date,
  weeks_picked jsonb,
  subtotal numeric(10, 2),
  payment_note text,
  signature_storage_path text,
  message text,
  raw_json jsonb not null default '{}'::jsonb
);

alter table public.submissions enable row level security;

comment on table public.submissions is 'Private intake and inquiry log; RLS enabled with no public policies — service role only.';

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'signatures',
  'signatures',
  false,
  5242880,
  array['image/png']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
