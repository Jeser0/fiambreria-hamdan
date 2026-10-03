-- Qualify the object name: products also has a name column in this correlated subquery.
alter policy "Product image upload guard" on storage.objects with check (
  bucket_id <> 'product-images' or (
    (select public.is_admin())
    and name ~ '^[a-z0-9][a-z0-9-]{0,159}/[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}\.(webp|jpg|png)$'
    and exists (select 1 from public.products p where p.id = split_part(storage.objects.name, '/', 1))
  )
);
