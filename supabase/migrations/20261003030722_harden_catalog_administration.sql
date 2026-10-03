-- Harden the existing Hamdan tables. No product, price, stock or user data is changed.
-- Apply to the existing schema; this is not a schema bootstrap or a catalog seed.

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.admin_users enable row level security;
alter table public.site_settings enable row level security;

-- RLS does not protect TRUNCATE. Restrict table privileges as well as row policies.
revoke all on public.categories, public.products, public.admin_users from public, anon, authenticated;
revoke truncate, references, trigger on public.site_settings from public, anon, authenticated;
grant select on public.categories, public.products to anon, authenticated;
grant update (retail_price, wholesale_price, wholesale_same_price, active, in_stock)
  on public.products to authenticated;

drop policy if exists "Admins can read admin users" on public.admin_users;
drop policy if exists "Admins can insert admin users" on public.admin_users;
drop policy if exists "Admins can update admin users" on public.admin_users;
drop policy if exists "Admins can delete admin users" on public.admin_users;

-- Membership is provisioned only through trusted database administration.
-- Anonymous SELECT privileges allow the invoker helper to evaluate false; no anon policy exposes rows.
grant select (user_id, role, active) on public.admin_users to anon, authenticated;
create policy "Users can read their own active membership" on public.admin_users
  for select to authenticated
  using (
    user_id = (select auth.uid()) and active
    and not coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false)
  );

-- SECURITY INVOKER honors the nonrecursive membership policy above.
-- Preserve the existing approved roles, including the existing owner's membership.
create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = (select auth.uid()) and active
      and role in ('owner', 'admin', 'editor')
      and not coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false)
  );
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

drop policy if exists "Public can read active products" on public.products;
drop policy if exists "Admins can insert products" on public.products;
drop policy if exists "Admins can update products" on public.products;
drop policy if exists "Admins can delete products" on public.products;
create policy "Public can read available products" on public.products
  for select to anon, authenticated
  using (
    (select public.is_admin()) or (
      active and in_stock and exists (
        select 1 from public.categories c where c.id = products.category_id and c.active
      )
    )
  );
create policy "Authorized members can update products" on public.products
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- Bounds also reject PostgreSQL numeric NaN/Infinity, which a simple >= 0 check permits.
alter table public.products add constraint products_retail_price_finite
  check (retail_price is null or retail_price between 0 and 999999999.99);
alter table public.products add constraint products_wholesale_price_finite
  check (wholesale_price is null or wholesale_price between 0 and 999999999.99);
