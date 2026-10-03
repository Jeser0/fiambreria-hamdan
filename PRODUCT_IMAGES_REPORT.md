# Gestión de imágenes — informe de entrega

Fecha: 3 de octubre de 2026.

## Estado

**NO PUBLICADO en Production.** Código implementado, rama subida y Preview desplegada; PR sin mergear porque falta la prueba administrativa autenticada y acceso a la Preview protegida. La infraestructura aditiva de Storage sí está aplicada en el Supabase existente.

- Rama: `feat/admin-product-images`.
- PR borrador: https://github.com/Jeser0/fiambreria-hamdan/pull/2.
- Preview: https://fiambreria-hamdan-git-feat-admin-product-images-jeser0.vercel.app.
- Vercel: estado `Ready` / check `success` para el commit de implementación `543d1de`.
- Production existente: https://fiambreriahamdan.com.
- Commits de implementación: `d5c5739 feat: add product image storage`, `d533491 feat: add admin product image uploads`, `543d1de test: cover product image management`.
- Este informe se agrega en un commit documental posterior: `docs: record product image rollout verification`.

## Infraestructura y seguridad

Bucket **`product-images` creado**, público, máximo 5 MB (5.242.880 bytes), MIME `image/webp`, `image/jpeg`, `image/png`. RLS de Storage sigue habilitado. No se usa ninguna clave privada ni `service_role`.

Migraciones aplicadas y versionadas, con versiones locales iguales al historial remoto:

- `20261003141744_product_image_storage.sql`.
- `20261003142028_qualify_product_image_upload_path.sql`.

Políticas creadas:

| Política | Operación | Regla |
| --- | --- | --- |
| Admins can inspect product images | SELECT | Membresía administrativa activa |
| Admins can upload product images | INSERT | Membresía administrativa activa |
| Admins can delete unused product images | DELETE | Membresía administrativa activa |
| Product image upload guard | INSERT, restrictiva | Admin, producto existente y ruta `producto/UUID.ext` |
| Product images are immutable | UPDATE, restrictiva | Impide sobrescribir objetos del bucket |
| Product image deletion guard | DELETE, restrictiva | Admin y ausencia de referencias desde productos |

Se conservan `public.is_admin()`, las políticas de productos y membresía y los roles existentes `owner`, `admin`, `editor`. Se agregan únicamente privilegios de actualización para `image_url`/`image_alt`; no existe autoasignación de roles. Visualizar públicamente no concede permisos de escritura.

## Funcionamiento y pruebas

El editor ofrece imagen actual, selector, vista previa, descripción, guardar, quitar, estados y mensajes. Optimiza con canvas/WebP cuando resulta conveniente, sin dependencias de producción nuevas ni recortes. Las tarjetas conservan su proporción 16:7 y muestran imágenes con `object-contain`, centrado y margen interior. Funciona con todas las categorías del catálogo.

Subir/reemplazar: primero se carga a una ruta UUID nueva; el servidor valida los bytes de Storage y la versión del producto; guarda exclusivamente los campos de imagen y después intenta limpiar el archivo anterior. Quitar: guarda ambos campos en `null` y retorna al placeholder. Una descripción vacía con imagen usa el nombre del producto.

| Verificación | Resultado |
| --- | --- |
| `npm test` | **31/31 aprobados** |
| `npm run lint` | **Aprobado** |
| `npx tsc --noEmit` | **Aprobado** |
| `npm run build` | **Aprobado**, Next.js 16.3.5 |
| Reemplazo seguro y errores de guardado/limpieza | **Tests aprobados**: no se elimina antes del commit, conflictos/fallos conservan la imagen anterior, limpieza fallida no revierte el guardado |
| SQL de catálogo existente | **Aprobado** contra Supabase real, con ROLLBACK |
| SQL de Storage | **Aprobado** contra Supabase real, con ROLLBACK: anon, no admin, roles, miembro inactivo, sesión Auth anónima, rutas y protección de archivos referenciados |
| Carga anónima por API real de Storage | **Rechazada por RLS**, resultado esperado |
| Navegador local con Supabase real | **Aprobado**: catálogo, login protegido, rechazo de login inválido, checkout y manipulación de precios/persistencia |
| Imágenes cuadradas/verticales y placeholder | **Aprobado** en ambas tiendas y móvil, con fixtures generados localmente que no se guardan en la base |
| Preview funcional | **Pendiente**: `/admin`, tiendas y `/api/catalog` redirigen al login de Vercel; `Ready` no constituye verificación funcional |
| Subir/reemplazar/quitar desde admin autenticado | **Pendiente**: no se proporcionaron credenciales administrativas |
| Production existente | **Regresión aprobada** de catálogo, login protegido y checkout; la nueva funcionalidad de imágenes aún no se desplegó en Production |

La prueba autenticada opcional está implementada en `tests/browser-product-images.mjs`: verifica upload, reemplazo, lectura pública, ambas tiendas, limpieza anterior, descripción por defecto y que un borrador de precio no se guarde; finalmente quita la imagen y restaura el producto originalmente sin imagen. Solo puede activarse con credenciales reales de una cuenta autorizada en el entorno de prueba. No se creó una cuenta ni se alteraron credenciales para simular esta comprobación.

Tras las pruebas SQL se verificaron **0 objetos en el bucket y 0 productos con imagen**, igual que antes del trabajo. Los cambios de producto y membresía de las pruebas fueron transaccionales y quedaron revertidos. No hubo cambios permanentes en precios, stock, mínimos, imágenes comerciales o usuarios. No se tocó DNS.

## Archivos modificados

- Panel: `src/app/admin/page.tsx`, `src/app/admin/image-actions.ts`, `src/components/admin/ProductManager.tsx`, `src/components/admin/ProductImageEditor.tsx`, `src/lib/admin-product.ts`.
- Imágenes: `src/components/ProductMedia.tsx`, `src/lib/product-image.ts`, `src/lib/prepare-product-image.ts`, `src/lib/persist-product-image.ts`.
- Migraciones: `supabase/migrations/20261003141744_product_image_storage.sql`, `supabase/migrations/20261003142028_qualify_product_image_upload_path.sql`.
- Tests: `supabase/tests/product_image_security.sql`, `tests/product-image.test.ts`, `tests/browser-product-images.mjs`.
- Documentación: `ADMIN_SETUP.md`, `BACKEND_HANDOFF.md`, `PRODUCT_IMAGES_REPORT.md`.

## Pendientes y riesgos

1. Acceso autorizado a Preview y credenciales reales de admin para completar el circuito funcional, restaurar el producto de prueba y recién entonces evaluar el merge. No se relajó la protección de Vercel ni se crearon accesos artificiales.
2. Una carga interrumpida o un fallo de guardado puede dejar un objeto sin referencia. El editor conserva las cargas pendientes para reintentar e intenta limpiarlas al cambiar de selección; no existe limpieza programada. Un fallo de limpieza posterior se informa sin romper la imagen publicada.
3. Supabase conserva su advertencia preexistente de protección contra contraseñas filtradas desactivada. No se modificó la configuración de Auth.

Git al entregar: rama sincronizada con `origin/feat/admin-product-images`, sin cambios pendientes. PR permanece en borrador y sin mergear.
