-- Harmless RPC called by the Vercel Cron job to register database activity.
-- It returns no customer data and does not modify any rows.
create or replace function public.keepalive()
returns integer
language sql
stable
as $$
  select 1;
$$;

revoke all on function public.keepalive() from public;
grant execute on function public.keepalive() to anon, authenticated;

notify pgrst, 'reload schema';
