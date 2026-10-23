-- Explicit staff-role access for the private inquiry inbox.
-- Customer accounts are intentionally not part of the product.
create table if not exists public.staff_access (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null check (role in ('admin', 'coordinator', 'read_only')),
  created_at timestamptz not null default now()
);

alter table public.staff_access enable row level security;

revoke all on table public.staff_access from anon, authenticated;
grant select on table public.staff_access to authenticated;

drop policy if exists "Staff may read their own access" on public.staff_access;
create policy "Staff may read their own access"
  on public.staff_access
  for select
  to authenticated
  using (user_id = (select auth.uid()));

create or replace function public.current_staff_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select staff.role
  from public.staff_access as staff
  where staff.user_id = (select auth.uid())
  limit 1;
$$;

revoke all on function public.current_staff_role() from public, anon;
grant execute on function public.current_staff_role() to authenticated;

alter table public.customer_inquiries
  drop constraint if exists customer_inquiries_status_check;
alter table public.customer_inquiries
  add constraint customer_inquiries_status_check
  check (status in ('new', 'contacted', 'reviewing', 'waiting_on_customer', 'quote_preparation', 'quote_sent', 'closed'));

revoke select, update, delete on table public.customer_inquiries from anon, authenticated;
revoke insert on table public.customer_inquiries from authenticated;
grant insert on table public.customer_inquiries to anon;
grant select on table public.customer_inquiries to authenticated;
grant update (status) on table public.customer_inquiries to authenticated;

drop policy if exists "Authorized staff may read inquiries" on public.customer_inquiries;
create policy "Authorized staff may read inquiries"
  on public.customer_inquiries
  for select
  to authenticated
  using (public.current_staff_role() in ('admin', 'coordinator', 'read_only'));

drop policy if exists "Authorized staff may update inquiry status" on public.customer_inquiries;
create policy "Authorized staff may update inquiry status"
  on public.customer_inquiries
  for update
  to authenticated
  using (public.current_staff_role() in ('admin', 'coordinator'))
  with check (public.current_staff_role() in ('admin', 'coordinator'));

notify pgrst, 'reload schema';
