-- Tests run against the actual policies but ALL object/product/membership writes roll back.
-- Metadata is used only inside this transaction; real files must use the Storage API.
begin;
-- Match the Storage API's session flag for this rollback-only metadata test.
-- RLS stays enabled; no real file is deleted and this flag expires at ROLLBACK.
select set_config('storage.allow_delete_query', 'true', true);
select set_config('hamdan.product', (select id from public.products order by id limit 1), true);
select set_config('hamdan.owner', (select user_id::text from public.admin_users where active and role = 'owner' limit 1), true);
select set_config('hamdan.path', current_setting('hamdan.product') || '/12345678-1234-4321-9876-123456789abc.webp', true);

do $$ begin
  if not exists (select 1 from storage.buckets where id = 'product-images' and public and file_size_limit = 5242880 and allowed_mime_types = array['image/webp','image/jpeg','image/png']) then
    raise exception 'Bucket configuration is incorrect';
  end if;
  if not (select relrowsecurity from pg_class where oid = 'storage.objects'::regclass) then raise exception 'Storage RLS is disabled'; end if;
  if current_setting('hamdan.owner') = '' then raise exception 'No existing owner available for authorization tests'; end if;
end $$;

set local role anon;
do $$ begin
  begin
    insert into storage.objects(bucket_id, name) values ('product-images', current_setting('hamdan.path'));
    raise exception 'Anonymous upload was accepted';
  exception when insufficient_privilege then null; end;
end $$;
reset role;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000001","role":"authenticated","is_anonymous":false,"user_metadata":{"role":"owner"}}', true);
set local role authenticated;
do $$ declare affected integer; begin
  if public.is_admin() then raise exception 'User metadata granted admin'; end if;
  begin
    insert into storage.objects(bucket_id, name) values ('product-images', current_setting('hamdan.path'));
    raise exception 'Non-admin upload was accepted';
  exception when insufficient_privilege then null; end;
  update public.products set image_url = 'https://invalid.test/forged.png' where id = current_setting('hamdan.product');
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'Non-admin edited product image'; end if;
  begin
    insert into public.admin_users(user_id, role, active) values (auth.uid(), 'owner', true);
    raise exception 'Non-admin assigned themselves admin';
  exception when insufficient_privilege then null; end;
end $$;
reset role;

select set_config('request.jwt.claims', json_build_object('sub', current_setting('hamdan.owner'), 'role', 'authenticated', 'is_anonymous', false)::text, true);
set local role authenticated;
do $$ declare original public.products%rowtype; changed public.products%rowtype; affected integer; begin
  if not public.is_admin() then raise exception 'Existing owner cannot manage images'; end if;
  select * into strict original from public.products where id = current_setting('hamdan.product');
  insert into storage.objects(bucket_id, name) values ('product-images', current_setting('hamdan.path'));
  if not exists (select 1 from storage.objects where bucket_id = 'product-images' and name = current_setting('hamdan.path')) then raise exception 'Owner cannot inspect upload'; end if;
  begin
    insert into storage.objects(bucket_id, name) values ('product-images', '../escape.png');
    raise exception 'Unsafe upload path was accepted';
  exception when insufficient_privilege then null; end;
  begin
    insert into storage.objects(bucket_id, name) values ('product-images', 'nonexistent-product/12345678-1234-4321-9876-123456789abc.webp');
    raise exception 'Upload for nonexistent product was accepted';
  exception when insufficient_privilege then null; end;
  update public.products set image_url = 'https://hamdan.supabase.co/storage/v1/object/public/product-images/' || current_setting('hamdan.path'), image_alt = original.name
    where id = original.id returning * into strict changed;
  if changed.image_alt <> original.name or changed.retail_price is distinct from original.retail_price or changed.wholesale_price is distinct from original.wholesale_price
     or changed.active <> original.active or changed.in_stock <> original.in_stock then raise exception 'Image update changed business data'; end if;
  update storage.objects set name = name where bucket_id = 'product-images' and name = current_setting('hamdan.path');
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'Immutable image was overwritten'; end if;
  delete from storage.objects where bucket_id = 'product-images' and name = current_setting('hamdan.path');
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'Referenced image was deleted'; end if;
end $$;
reset role;

-- A normal user cannot replace or delete the existing owner's image.
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000001","role":"authenticated","is_anonymous":false}', true);
set local role authenticated;
do $$ declare affected integer; begin
  update storage.objects set name = name where bucket_id = 'product-images' and name = current_setting('hamdan.path');
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'Non-admin replaced object'; end if;
  delete from storage.objects where bucket_id = 'product-images' and name = current_setting('hamdan.path');
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'Non-admin deleted object'; end if;
end $$;
reset role;

-- Existing editor role is permitted; inactive members and anonymous Auth sessions are not.
update public.admin_users set role = 'editor' where user_id = current_setting('hamdan.owner')::uuid;
select set_config('request.jwt.claims', json_build_object('sub', current_setting('hamdan.owner'), 'role', 'authenticated', 'is_anonymous', false)::text, true);
set local role authenticated;
do $$ declare affected integer; begin
  if not public.is_admin() then raise exception 'Editor lost image administration'; end if;
  update public.products set image_url = null, image_alt = null where id = current_setting('hamdan.product');
  delete from storage.objects where bucket_id = 'product-images' and name = current_setting('hamdan.path');
  get diagnostics affected = row_count;
  if affected <> 1 then raise exception 'Unreferenced image could not be deleted'; end if;
end $$;
reset role;
update public.admin_users set active = false where user_id = current_setting('hamdan.owner')::uuid;
set local role authenticated;
do $$ begin
  if public.is_admin() then raise exception 'Inactive member still has admin access'; end if;
  begin
    insert into storage.objects(bucket_id, name) values ('product-images', current_setting('hamdan.path'));
    raise exception 'Inactive member uploaded image';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
update public.admin_users set active = true where user_id = current_setting('hamdan.owner')::uuid;
select set_config('request.jwt.claims', json_build_object('sub', current_setting('hamdan.owner'), 'role', 'authenticated', 'is_anonymous', true)::text, true);
set local role authenticated;
do $$ begin
  if public.is_admin() then raise exception 'Anonymous Auth session became admin'; end if;
  begin
    insert into storage.objects(bucket_id, name) values ('product-images', current_setting('hamdan.path'));
    raise exception 'Anonymous Auth upload was accepted';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
rollback;
