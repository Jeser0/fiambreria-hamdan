# Validación de la entrega — Hamdan

## Comprobaciones realizadas

- `npm run lint`: sin errores.
- `npx tsc --noEmit`: sin errores, TypeScript estricto.
- `npm test`: 21 pruebas aprobadas, incluidas las 12 originales.
- `npm run build`: compilación de producción aprobada con Next.js 16.3.5.
- Recorridos de navegador en Chromium: Mayorista y Minorista completos, sin errores de ejecución.
- Vista adaptable y pedido minorista comprobados con dimensiones y controles táctiles emulados de Pixel 7 y iPhone 13, sin desbordamiento horizontal.
- Safari/WebKit y dispositivos físicos: pendientes de comprobación. El entorno disponible no tiene todas las bibliotecas necesarias para ejecutar WebKit. La emulación de iPhone realizada usa Chromium.

Las pruebas interceptan `window.open` y esperan la validación del servidor antes de verificar el enlace y mensaje. No envían mensajes reales al negocio. `tests/browser-backend.mjs` agrega verificación del catálogo real, protección de `/admin`, rechazo de login inválido y manipulación de precios/almacenamiento. El SQL de `supabase/tests/catalog_security.sql` comprueba RLS con rollback.

## Casos cubiertos

1. Agregar productos desde el catálogo, pasar a revisión y volver a comprar sin perder carrito ni datos del formulario.
2. Modificar cantidades, quitar productos y vaciar el carrito: actualización inmediata de subtotales, total y validaciones.
3. Mayorista x4: 10 + 5 + 5 paquetes surtidos cumplen el mínimo de 20. Si se quita una variedad y queda en 15, se deshabilita WhatsApp.
4. Mayorista x8: mínimo de 40 paquetes; pizzas: mínimo de 20 unidades. Cada categoría seleccionada se controla por separado.
5. Minorista: una sola unidad se puede pedir, con `retailPrice` y sin mínimos mayoristas.
6. Los productos sin precio mayorista no entran al pedido mayorista. Un mensaje no puede combinar líneas de ambas tiendas.
7. Ejemplo de referencia: 100 x4 jamón y queso + 50 x4 salame y queso + 20 pizzas muzzarella = **$ 437.500** mayorista.
8. Cantidades vacías, cero, negativas, notación exponencial y fracciones de paquetes/pizzas: rechazadas con mensajes en pantalla.
9. Nombre completo, teléfono, tipo de pedido y nombre del comercio/evento: validaciones condicionales. DNI/CUIT/CUIL y correo vacíos no bloquean; un correo informado con formato inválido sí se señala.
10. Envío: dirección obligatoria; retiro: dirección del local, sin incluir datos viejos de envío.
11. Mensaje con precios unitarios, subtotales, total, cliente, entrega y observaciones. Campos opcionales vacíos omitidos; tildes, saltos, `&` y emoji correctamente codificados.
12. Recarga y dos pestañas: conservación y sincronización del carrito. Vaciar Minorista no vacía Mayorista.
13. Las fotos de presentación aparecen en Inicio. El catálogo y el checkout no reciben esas fotos como imágenes de artículos.
14. El carrito permanece al abrir WhatsApp. La confirmación final depende de enviar el mensaje y de la respuesta del negocio.

## Repetir la validación

```bash
npm ci
npm run lint
npx next typegen
npx tsc --noEmit
npm test
npm run build
```

Para ejecutar el recorrido de navegador en un equipo con Playwright instalado:

```bash
npm install --no-save --package-lock=false playwright
npx playwright install chromium
npm run dev
```

En otra terminal:

```bash
node tests/browser-checkout.mjs
```

El script usa `http://localhost:3000` y deja capturas en `.qa-output/` (ignorado por Git). Se puede ajustar `HAMDAN_TEST_URL`. Si WebKit está instalado y disponible, `HAMDAN_TEST_WEBKIT=1` agrega un recorrido con ese motor.

## Alcance de esta versión

Los precios y mínimos comerciales provienen de Supabase; las pruebas no alteran sus valores permanentes. Los totales son estimados. La disponibilidad y el costo de envío se confirman por WhatsApp. Esta rama `feat/supabase-backend` incluye catálogo dinámico, validación final en servidor y administración con Supabase Auth/RLS. No implementa pagos, PDF, pedidos persistidos ni WhatsApp API. Configuración y límites de verificación en [`ADMIN_SETUP.md`](./ADMIN_SETUP.md).
