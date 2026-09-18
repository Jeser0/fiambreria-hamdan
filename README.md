# Fiambrería Hamdan

Sitio web para **Fiambrería Hamdan**, comercio familiar de San Miguel de Tucumán con trayectoria desde 1992.

La versión actual ya separa la experiencia comercial en dos tiendas dentro del mismo sitio: **Mayorista** y **Minorista**.

## Estado actual

- Home responsive con identidad visual Hamdan y Hamdini.
- Hamdini con secuencia real de 7 frames: movimiento de varita, guiño y magia al entrar y al tocar el personaje.
- Header fijo con navegación, búsqueda contextual, WhatsApp y carrito.
- Dos tiendas independientes: `/mayorista` y `/minorista`.
- Precios minoristas y mayoristas cargados desde las listas provistas por Hamdan.
- Categorías separadas: Quesos y lácteos, Fiambres, Sándwich x4, Sándwich x8 y Pizzas.
- Carrito persistente por tienda mediante `localStorage`.
- El producto se agrega al carrito sin sacar al cliente del catálogo.
- Feedback visual al agregar productos y contador animado.
- Pedido enviado por WhatsApp sin registro obligatorio.
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

El catálogo usa un campo `active` por producto para permitir que el stock/venta se habilite o deshabilite sin cambiar los componentes visuales.

La próxima lista de stock de fiambres debe respetarse exactamente. No se deben inventar productos disponibles.

## Modelo de pedidos y cuentas

La compra no exige iniciar sesión:

- **Mayorista:** carrito propio, precios mayoristas, mínimos automáticos y WhatsApp.
- **Minorista:** carrito independiente, precios minoristas y sin mínimos mayoristas.
- **Cuenta opcional:** más adelante se puede agregar Google para historial y repetición de pedidos.
- **Administración:** el futuro panel para modificar precios, stock y productos sí requerirá autenticación y roles.

## Próximas integraciones

- Base de datos para productos, precios y stock.
- Panel administrativo para Romi/familia.
- Google Auth opcional para clientes y obligatorio para administración.
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
npm install
npm run dev
```

Abrir `http://localhost:3000`.

Validaciones:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Rutas actuales

```text
/            Home institucional y accesos principales
/mayorista   Tienda mayorista con reglas de mínimos
/minorista   Tienda minorista independiente
/pedido      Redirección de compatibilidad al carrito mayorista
```

## Agentes de programación

Las reglas de trabajo para ChatGPT/Codex y otros agentes compatibles están documentadas en [`AGENTS.md`](./AGENTS.md).
