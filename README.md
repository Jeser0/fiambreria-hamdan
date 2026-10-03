# Fiambrería Hamdan

Sitio web para **Fiambrería Hamdan**, comercio familiar de San Miguel de Tucumán con trayectoria desde 1992.

Sitio comercial con catálogo desde Supabase, checkout por WhatsApp y panel de administración. Las tiendas **Mayorista** y **Minorista** mantienen sus carritos, precios y reglas independientes.

Configuración de producción, SQL aplicado, acceso administrativo y pruebas: [`ADMIN_SETUP.md`](./ADMIN_SETUP.md).

## Estado actual

- Home responsive con foto de la fachada, Hamdini ubicado en la entrada y logo del negocio en encabezado, pie y favicon.
- Galería de presentación en `src/data/showcase.ts`, independiente de las fotos de artículos (`CatalogProduct.image`).
- Hamdini con secuencia real de 7 frames: movimiento de varita, guiño y magia al entrar y al tocar el personaje.
- Header fijo con navegación, búsqueda contextual, WhatsApp y carrito.
- Dos tiendas independientes: `/mayorista` y `/minorista`.
- Precios minoristas y mayoristas consultados desde Supabase, inicialmente cargados desde las listas provistas por Hamdan.
- Mínimos mayoristas desde `categories.wholesale_minimum` y disponibilidad desde `products.active` e `in_stock`.
- `/admin/login` y `/admin`: Supabase Auth, membresías administrativas, RLS y edición de precios/estados.
- Categorías separadas: Quesos y lácteos, Fiambres, Sándwich x4, Sándwich x8 y Pizzas.
- Carrito persistente por tienda mediante `localStorage`, con validación de cantidades, mínimos mayoristas y acceso rápido en móvil.
- El producto se agrega al carrito sin sacar al cliente del catálogo.
- Feedback visual al agregar productos y contador animado.
- Revisión en `/pedido/mayorista` o `/pedido/minorista`: datos del cliente, campos según tipo de pedido, envío/retiro y observaciones.
- Resumen editable, precio unitario, subtotales y total estimado actualizados al instante.
- Mensaje completo preparado en `wa.me`, con `encodeURIComponent` y el número de `src/data/business.ts`. El cliente debe enviarlo en WhatsApp; abrirlo no confirma el pedido.
- DNI/CUIT/CUIL y correo opcionales; sin registro ni pagos online.
- Borrador del formulario en `sessionStorage` por tienda; selección y cantidades conservan las claves originales de `localStorage`.
- Tarjetas preparadas para imágenes administrables; si un producto no tiene foto, se usa un fallback visual por categoría.
- Navegación y carrito conscientes de Mayorista/Minorista para no mezclar pedidos.
- Footer con teléfono, WhatsApp, dirección y horarios.
- SEO local inicial con metadata, JSON-LD, sitemap y robots.

## Reglas mayoristas vigentes

Los mínimos se calculan por categoría y permiten surtir variedades dentro del mismo grupo:

- **Sándwich x4:** mínimo total de 20 paquetes.
- **Sándwich x8:** mínimo total de 40 paquetes.
- **Pizzas:** mínimo total de 20 unidades.

Mientras una categoría seleccionada no alcance su mínimo, el botón para enviar el pedido mayorista permanece deshabilitado y muestra cuánto falta.

Quesos y fiambres no tienen un mínimo automático configurado en esta etapa.

## Stock

El catálogo usa `active` e `in_stock` desde Supabase. Ambos deben estar habilitados para vender; también debe estar activa la categoría y existir un precio válido para esa tienda. El panel permite administrarlos sin modificar código.

La próxima lista de stock de fiambres debe respetarse exactamente. No se deben inventar productos disponibles.

## Modelo de pedidos y cuentas

La compra no exige iniciar sesión:

- **Mayorista:** carrito propio, precios mayoristas, mínimos automáticos y WhatsApp.
- **Minorista:** carrito independiente, precios minoristas y sin mínimos mayoristas.
- **Cuenta opcional:** más adelante se puede agregar Google para historial y repetición de pedidos.
- **Administración:** el panel para modificar precios y disponibilidad exige autenticación y membresía administrativa activa, comprobadas en servidor y RLS.

## Estado del frontend

El frontend queda considerado **versión final para iniciar backend**, salvo correcciones puntuales de contenido, la lista definitiva de stock y la incorporación progresiva de fotos reales. No hace falta rediseñar las tiendas para conectar una base de datos.

Contrato para la siguiente etapa: [`BACKEND_HANDOFF.md`](./BACKEND_HANDOFF.md).

## Próximas integraciones

- Administración de imágenes reales desde Storage.
- Google Auth opcional para clientes, si se decide implementarlo. La administración actual utiliza correo y contraseña.
- Persistencia de pedidos en servidor.
- Mercado Pago si se decide habilitar pago online.
- Analytics/Search Console y despliegue final.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- ESLint

## Desarrollo local

```bash
npm ci
npm run dev
```

Abrir `http://localhost:3000`.

Validaciones:

```bash
npm run lint
npx next typegen
npx tsc --noEmit
npm test
npm run build
```

## Rutas actuales

```text
/            Home institucional y accesos principales
/mayorista   Tienda mayorista con reglas de mínimos
/minorista   Tienda minorista independiente
/pedido      Redirección de compatibilidad a /pedido/mayorista
/pedido/mayorista  Checkout mayorista
/pedido/minorista  Checkout minorista
/admin/login  Acceso administrativo con correo y contraseña
/admin        Edición de precios y disponibilidad para cuentas autorizadas
```

## Agentes de programación

Las reglas de trabajo para ChatGPT/Codex y otros agentes compatibles están documentadas en [`AGENTS.md`](./AGENTS.md).

## Implementación del checkout

- `src/lib/storeCart.ts` y `useStoreCart.ts`: única fuente compartida para catálogo, contador y revisión; sincronización entre pestañas y conservación de claves anteriores.
- `src/lib/order.ts`: conversión y validación numérica, `calculateOrderTotal()`, `formatARS()` y mínimos mayoristas. No se usa el precio de otra tienda como alternativa.
- `src/lib/checkout.ts`: `validateCheckout()` y `buildWhatsAppMessage()`. Omite campos opcionales vacíos y datos de envío cuando corresponde retiro.
- `src/lib/catalog-db.ts`: consulta actual de Supabase; `catalog.ts` adapta los datos al contrato del frontend.
- `src/app/pedido/actions.ts` y `prepare-order.ts`: reconstrucción y validación del pedido en servidor con precios actuales; ignoran precios enviados por el navegador.
- `src/components/checkout/`: campos del cliente, entrega, resumen y coordinación del envío.
- Los sándwiches y pizzas se piden en cantidades enteras. Las categorías que ya admitían cantidades decimales conservan esa posibilidad, hasta tres decimales.
- Se permite pasar a la revisión con un mínimo pendiente para corregirlo allí. El botón de WhatsApp queda deshabilitado hasta cumplir todos los requisitos.
- El carrito no se vacía al abrir WhatsApp: todavía no hay confirmación comercial ni pedido guardado en un servidor.

La validación y las pruebas de navegador están documentadas en `CHECKOUT_QA.md`.
