-- Run against the existing Hamdan schema after the administration migration.
-- Every write is rolled back. No Auth accounts or permanent prices are created.
begin;

select set_config('hamdan.test_product', (select id from public.products where retail_price is not null and wholesale_price is not null order by id limit 1), true);
select set_config('hamdan.owner', (select user_id::text from public.admin_users where active and role = 'owner' limit 1), true);

set local role anon;
do $$
begin
  if public.is_admin() then raise exception 'Anonymous role became admin'; end if;
  if not exists (select 1 from public.products) then raise exception 'Public catalog is inaccessible'; end if;
  if exists (select 1 from public.admin_users) then raise exception 'Membership leaked to anonymous caller'; end if;
  if has_table_privilege('anon', 'public.products', 'TRUNCATE')
     or has_column_privilege('anon', 'public.products', 'retail_price', 'UPDATE') then
    raise exception 'Anonymous role has write privileges';
  end if;
end $$;
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000001","role":"authenticated","is_anonymous":false}', true);
set local role authenticated;
do $$
declare affected integer;
begin
  if public.is_admin() then raise exception 'Nonmember became admin'; end if;
  update public.products set retail_price = 1 where id = current_setting('hamdan.test_product');
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'Nonmember modified a product'; end if;
  begin
    insert into public.admin_users(user_id, role, active) values (auth.uid(), 'owner', true);
    raise exception 'Nonmember granted themselves membership';
  exception when insufficient_privilege then null;
  end;
  if has_table_privilege('authenticated', 'public.products', 'TRUNCATE') then raise exception 'Authenticated role can truncate'; end if;
end $$;
reset role;

select set_config('request.jwt.claims', json_build_object('sub', current_setting('hamdan.owner'), 'role', 'authenticated', 'is_anonymous', false)::text, true);
set local role authenticated;
do $$
declare original public.products%rowtype; changed public.products%rowtype;
begin
  if not public.is_admin() then raise exception 'Existing owner lost administration'; end if;
  select * into strict original from public.products where id = current_setting('hamdan.test_product');
  update public.products set retail_price = original.retail_price + 1, wholesale_price = original.wholesale_price + 1, active = false, in_stock = false
    where id = original.id returning * into strict changed;
  if changed.retail_price <> original.retail_price + 1 or changed.wholesale_price <> original.wholesale_price + 1 or changed.active or changed.in_stock then
    raise exception 'Owner product edits did not persist';
  end if;
  if changed.updated_at = original.updated_at then raise exception 'Product update did not advance timestamp'; end if;
  begin
    update public.products set retail_price = -1 where id = original.id;
    raise exception 'Negative price was accepted';
  exception when check_violation then null;
  end;
  begin
    update public.products set retail_price = 'NaN'::numeric where id = original.id;
    raise exception 'Nonfinite price was accepted';
  exception when check_violation then null;
  end;
  begin
    update public.products set name = 'Unauthorized field edit' where id = original.id;
    raise exception 'Owner edited a column outside the panel scope';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

-- The product just disabled by the owner must disappear from public reads immediately.
set local role anon;
do $$
begin
  if exists (select 1 from public.products where id = current_setting('hamdan.test_product')) then
    raise exception 'Inactive or unavailable product leaked to the public';
  end if;
end $$;
reset role;

-- Even an owner-shaped subject is not authorized through an anonymous Auth session.
select set_config('request.jwt.claims', json_build_object('sub', current_setting('hamdan.owner'), 'role', 'authenticated', 'is_anonymous', true)::text, true);
set local role authenticated;
do $$ begin if public.is_admin() then raise exception 'Anonymous Auth session became admin'; end if; end $$;
reset role;

rollback;
