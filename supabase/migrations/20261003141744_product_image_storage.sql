-- Additive: no products, memberships, prices, stock, or existing assets are changed.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880, array['image/webp', 'image/jpeg', 'image/png']);

-- Reuse the existing invoker-based admin authorization. Membership remains read-only.
grant update (image_url, image_alt) on public.products to authenticated;

create policy "Admins can inspect product images" on storage.objects
for select to authenticated using (bucket_id = 'product-images' and (select public.is_admin()));

create policy "Admins can upload product images" on storage.objects
for insert to authenticated with check (bucket_id = 'product-images' and (select public.is_admin()));

create policy "Admins can delete unused product images" on storage.objects
for delete to authenticated using (bucket_id = 'product-images' and (select public.is_admin()));

-- Restrictive guards also protect this bucket if other permissive policies are added later.
-- Random immutable names avoid cache collisions. Replacement is INSERT, then a product update.
create policy "Product image upload guard" on storage.objects as restrictive
for insert to public with check (
  bucket_id <> 'product-images' or (
    (select public.is_admin())
    and name ~ '^[a-z0-9][a-z0-9-]{0,159}/[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}\.(webp|jpg|png)$'
    and exists (select 1 from public.products p where p.id = split_part(name, '/', 1))
  )
);

-- No in-place overwrites: a published object must keep its bytes until it is detached.
create policy "Product images are immutable" on storage.objects as restrictive
for update to public using (bucket_id <> 'product-images') with check (bucket_id <> 'product-images');

create policy "Product image deletion guard" on storage.objects as restrictive
for delete to public using (
  bucket_id <> 'product-images' or (
    (select public.is_admin())
    and not exists (
      select 1 from public.products p
      where right(p.image_url, length('/storage/v1/object/public/product-images/' || storage.objects.name))
        = '/storage/v1/object/public/product-images/' || storage.objects.name
    )
  )
);
