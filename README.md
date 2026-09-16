# Fiambrería Hamdan

Sitio web en desarrollo para **Fiambrería Hamdan**, comercio familiar de San Miguel de Tucumán con trayectoria desde 1992.

La primera etapa está enfocada en presentar la marca y convertir la web en una herramienta real para **consultas y pedidos mayoristas**, manteniendo separada la futura experiencia minorista.

## Estado actual

- Home responsive con identidad visual Hamdan y Hamdini.
- Header fijo con navegación, buscador mayorista, WhatsApp y pedido persistente.
- Hero con historia de la marca y fachada del local.
- Accesos directos a Fiambres, Lácteos, Alimentos y Mayorista.
- Página `/mayorista` con catálogo filtrable.
- Búsqueda del catálogo desde el header.
- Selección persistente de productos mediante `localStorage`.
- Armado de consulta con nombre del comercio y detalle de cantidades.
- Generación automática del mensaje y envío al WhatsApp mayorista.
- Footer simplificado con teléfono, WhatsApp, dirección y horarios.
- SEO local inicial con metadata, JSON-LD, `sitemap.xml` y `robots.txt`.
- Acceso flotante a WhatsApp.

## Funcionalidad todavía no habilitada

Las siguientes funciones se muestran únicamente como próxima etapa y **no deben presentarse como operativas** hasta completar sus integraciones reales:

- Registro e inicio de sesión.
- Inicio de sesión con Google.
- Cuenta e historial de pedidos.
- Checkout minorista.
- Mercado Pago.
- Transferencias registradas desde la web.
- Panel de administración de precios y stock.

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
/            Home institucional y acceso a compra
/mayorista   Catálogo, filtros y armado de consulta mayorista
```

## Próximas etapas

1. Reemplazar/expandir catálogo con datos administrables y fotos reales.
2. Integrar autenticación real con Google.
3. Agregar base de datos de clientes y pedidos.
4. Implementar carrito/checkout minorista separado del mayorista.
5. Integrar Mercado Pago y comprobación de transferencias.
6. Crear panel de administración para productos, precios, stock y pedidos.
7. Desplegar en producción y conectar `fiambreriahamdan.com`.

## Agentes de programación

Las reglas de trabajo para ChatGPT/Codex y otros agentes compatibles están documentadas en [`AGENTS.md`](./AGENTS.md).

---

Proyecto desarrollado para acompañar la digitalización de Fiambrería Hamdan.
