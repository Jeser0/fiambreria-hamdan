# Administración y despliegue — Fiambrería Hamdan

## Circuito comercial

```mermaid
flowchart TD
  DB[Supabase: categories y products] --> Snapshot[getCatalogSnapshot]
  Snapshot --> Stores[Mayorista y Minorista]
  Stores --> Cart[IDs y cantidades por tienda]
  Snapshot --> Checkout[Checkout y resumen]
  Cart --> Checkout
  Checkout --> Action[prepareWhatsAppOrder en el servidor]
  DB --> Action
  Action --> Validation[Recalcular precios, totales y mínimos]
  Validation --> Review[Revisar cambios si el pedido varió]
  Validation --> WA[Mensaje preparado para WhatsApp]
  Login[Supabase Auth] --> Membership[admin_users activo]
  Membership --> Admin[Panel admin]
  Admin --> Save[Server Action y RLS]
  Save --> DB
```

Las tiendas y `/pedido/[mode]` consultan Supabase en cada carga. Las consultas y `/api/catalog` usan `no-store`. Las pestañas visibles actualizan el catálogo cada 30 segundos y al recuperar foco o conexión. El servidor vuelve a consultarlo en cada intento de envío, incluidas las reaperturas de WhatsApp. Si cambió un precio, una regla o un producto del pedido, se actualiza el resumen y se solicita revisión antes de continuar.

`localStorage` guarda únicamente IDs y cantidades; los datos del cliente quedan en `sessionStorage`. Nunca se acepta un precio o subtotal del navegador. Se ignoran o eliminan IDs desconocidos, sin precio para la tienda, inactivos, sin disponibilidad o con categoría inactiva. Ante una caída de Supabase se ofrece reintentar; la lista histórica de `src/data/catalog.ts` queda para pruebas y valores predeterminados de utilidades, y no sustituye el catálogo comercial.

WhatsApp continúa siendo una solicitud de pedido: el cliente envía el mensaje y el negocio confirma disponibilidad, total final y envío. El mensaje puede editarse en WhatsApp y no equivale a una orden persistida ni a un pago.

## Variables de Vercel

Agregar estas dos variables con los valores del proyecto Supabase, en el entorno **Production** y en **Preview** si se usa la misma base:

| Variable | Valor que corresponde |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key del proyecto |

No agregar `service_role`, una secret key ni contraseña de base. No se necesitan variables privadas adicionales para el panel. Las variables `NEXT_PUBLIC_*` se incorporan durante el build: después de configurarlas hay que desplegar esta rama una vez. Los siguientes cambios de precios o disponibilidad no requieren commit ni redeploy.

El login utiliza correo y contraseña; no necesita Google, un callback OAuth ni Mercado Pago. Para futuros correos de recuperación, configurar el Site URL de Supabase Auth con `https://fiambreriahamdan.com` y revisar los redirects permitidos. Este cambio no modifica DNS ni el dominio.

## SQL y seguridad

La migración [`20261003030722_harden_catalog_administration.sql`](./supabase/migrations/20261003030722_harden_catalog_administration.sql) **ya fue aplicada al proyecto existente**. Su versión local coincide con el historial remoto. No volver a ejecutarla ni usar `supabase db reset`: el repositorio no contiene una migración inicial de las tablas existentes.

La migración:

- conserva RLS habilitado;
- retira permisos de `TRUNCATE` que RLS no protege;
- limita las escrituras del panel a precios, `wholesale_same_price`, `active` e `in_stock`;
- impide que un usuario cree o cambie su propia membresía administrativa;
- cambia `public.is_admin()` a `SECURITY INVOKER`, con lectura de la membresía propia y sin recursión;
- permite editar a los roles existentes `owner`, `admin` y `editor`, siempre activos, y bloquea sesiones Auth anónimas;
- exige autorización en `USING` y `WITH CHECK` para las actualizaciones;
- excluye productos y categorías inactivos y productos no disponibles de las lecturas públicas;
- agrega límites de precio que también rechazan `NaN` e infinito en PostgreSQL.

No cambia precios, stock, imágenes, mínimos ni usuarios. El `updated_at` existente se utiliza para detectar ediciones concurrentes y evitar sobrescribir cambios realizados desde otra sesión. Cuando sucede, el panel pide actualizar antes de guardar.

[`supabase/tests/catalog_security.sql`](./supabase/tests/catalog_security.sql) verifica lectura pública, rechazo a no administradores, ausencia de autoasignación de roles, permisos del owner, columnas permitidas y ocultación pública de productos. Todas sus escrituras se revierten con `ROLLBACK`. Se ejecutó contra la base real después de la migración.

La revisión de seguridad de Supabase ya no informa funciones `SECURITY DEFINER` expuestas. Queda la configuración de protección contra contraseñas filtradas: [guía oficial de Supabase](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection). Activarla desde Auth cuando esté disponible en el plan. La renovación de sesión sigue el [patrón SSR oficial](https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs) con Proxy de Next.js 16.

## Cuenta administradora

La base actual ya tiene una cuenta `owner` activa. Si se conocen sus credenciales, no hace falta crear otra: ingresar en `/admin/login`.

Para dar acceso a una cuenta nueva, una persona con acceso al Dashboard realiza una única configuración:

1. En **Authentication → Users → Add user → Create new user**, crear el correo y la contraseña y confirmar el correo.
2. En **SQL Editor**, reemplazar únicamente el correo del siguiente bloque por el correo recién creado y ejecutarlo:

```sql
do $$
declare administrator_id uuid;
begin
  select id into strict administrator_id
  from auth.users
  where lower(email) = lower('CORREO_DE_LA_ADMINISTRADORA');

  insert into public.admin_users (user_id, role, active)
  values (administrator_id, 'owner', true)
  on conflict (user_id) do update
    set role = excluded.role, active = excluded.active;
end $$;
```

3. Probar `/admin/login` con esa cuenta. No compartir contraseñas por chat ni incorporarlas al repositorio.

Un usuario de Supabase Auth sin membresía activa no puede entrar ni modificar productos. Para retirar acceso, cambiar `admin_users.active` a `false` desde la administración confiable de la base; las siguientes acciones y consultas volverán a comprobarlo.

## Uso del panel por la dueña

1. Abrir `https://fiambreriahamdan.com/admin/login` e ingresar.
2. Buscar el producto o filtrar por categoría.
3. Modificar el precio minorista y/o mayorista en pesos; se admiten coma o punto y hasta dos decimales.
4. Ajustar **Activo** y **Disponible** según la disponibilidad real.
5. Presionar **Guardar cambios** y esperar el mensaje de confirmación.
6. Cerrar sesión al terminar en un dispositivo compartido.

Un precio vacío retira el producto de esa tienda; la base requiere al menos un precio por producto. Para retirarlo de ambas tiendas, desmarcar **Activo**. Un precio cero es válido y no se interpreta como un campo vacío. **Actualizar panel** vuelve a cargar los datos y descarta ediciones locales cuando el registro cambió en otra sesión.

El panel no permite modificar mínimos, membresías, nombres ni imágenes. Las fotos existentes se conservan. `image_url` e `image_alt` están conectados a `ProductMedia`, con el fallback por categoría, y Next Image acepta imágenes públicas del Storage de este proyecto. No se creó un bucket ni se cambiaron políticas de Storage.

## Verificación y límites

Archivos de la entrega, agrupados por responsabilidad:

```text
Catálogo y pedido:
  next.config.ts
  src/data/catalog.ts
  src/lib/catalog.ts
  src/lib/catalog-db.ts
  src/lib/order.ts (contrato dinámico existente, sin cambios)
  src/lib/checkout.ts
  src/lib/prepare-order.ts
  src/lib/storeCart.ts
  src/lib/useStoreCart.ts
  src/lib/useCurrentCatalog.ts
  src/lib/supabase/client.ts
  src/lib/supabase/server.ts
  src/components/StoreCatalog.tsx
  src/components/LiveStoreCatalog.tsx
  src/components/CatalogError.tsx
  src/components/checkout/CartSummary.tsx
  src/components/checkout/Checkout.tsx
  src/app/api/catalog/route.ts
  src/app/mayorista/page.tsx
  src/app/mayorista/error.tsx
  src/app/minorista/page.tsx
  src/app/minorista/error.tsx
  src/app/pedido/[mode]/page.tsx
  src/app/pedido/actions.ts
  src/app/pedido/error.tsx

Administración y seguridad:
  .gitignore
  src/proxy.ts
  src/lib/admin-auth.ts
  src/lib/admin-product.ts
  src/app/admin/layout.tsx
  src/app/admin/page.tsx
  src/app/admin/login/page.tsx
  src/app/admin/actions.ts
  src/app/admin/error.tsx
  src/app/robots.ts
  src/components/admin/AdminLoginForm.tsx
  src/components/admin/ProductManager.tsx
  supabase/migrations/20261003030722_harden_catalog_administration.sql
  supabase/tests/catalog_security.sql

Pruebas y documentación:
  tests/dynamic-catalog.test.ts
  tests/admin-product.test.ts
  tests/browser-checkout.mjs
  tests/browser-backend.mjs
  ADMIN_SETUP.md
  README.md
  BACKEND_HANDOFF.md
  CHECKOUT_QA.md
```

- 21 pruebas unitarias aprobadas, incluidas las 12 originales.
- `npm run lint`, `npx tsc --noEmit` y `npm run build`: aprobados.
- Rutas comerciales, redirección de `/pedido`, 404 de modo inválido y protección de `/admin`: comprobados con el servidor de producción local y la base real.
- Navegador Chromium: checkout mayorista/minorista, cantidades, mínimos, formularios, WhatsApp, persistencia y sincronización entre pestañas; Pixel 7 e iPhone 13 emulados sin desbordamiento.
- `tests/browser-backend.mjs`: catálogo real, login inválido rechazado por Auth, precio manipulado corregido por el servidor, precios falsos en almacenamiento ignorados y eliminación de IDs no disponibles.
- El login exitoso de la cuenta owner, el guardado desde su sesión de navegador y el cierre de sesión requieren las credenciales de esa persona. El script permite comprobarlos mediante `HAMDAN_ADMIN_EMAIL` y `HAMDAN_ADMIN_PASSWORD` en el entorno del proceso; no imprime valores ni los guarda.
- Safari/WebKit y dispositivos físicos quedan pendientes. No se envían mensajes reales durante las pruebas.
- Producción requiere desplegar la rama con las variables correctas; no se hizo push, merge ni despliegue.

Para repetir navegador en Windows, usando Edge instalado y Playwright fuera de las dependencias de la aplicación:

```powershell
npm.cmd install --prefix .qa-output/browser-runtime --no-save --package-lock=false playwright
$env:HAMDAN_PLAYWRIGHT_MODULE = Join-Path (Get-Location) '.qa-output/browser-runtime/node_modules/playwright'
$env:HAMDAN_BROWSER_CHANNEL = 'msedge'
node tests/browser-checkout.mjs
node tests/browser-backend.mjs
```

Antes, ejecutar `npm run build` y `npm run start` en otra terminal. En PowerShell con ejecución de scripts restringida, usar `npm.cmd` y `npx.cmd`; no es necesario cambiar la política del sistema.
