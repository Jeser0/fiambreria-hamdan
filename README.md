# Fiambrería Hamdan

Sitio web para **Fiambrería Hamdan**, comercio familiar de San Miguel de Tucumán con trayectoria desde 1992.

La versión actual está enfocada en una experiencia mayorista clara y utilizable: catálogo, armado de pedido y envío de la consulta al WhatsApp comercial.

## Estado actual

- Home responsive con identidad visual Hamdan y Hamdini.
- Hamdini integrado con una secuencia real de 7 frames: varita, guiño y magia al entrar y al tocar el personaje.
- Header fijo con navegación, buscador mayorista, WhatsApp y pedido persistente.
- Hero con historia de la marca y fachada del local.
- Accesos directos a Fiambres, Lácteos, Alimentos y Mayorista.
- Página `/mayorista` con catálogo filtrable y buscador.
- Catálogo mayorista ampliado con productos verificados del negocio.
- Selección persistente de productos mediante `localStorage`, con feedback visual al agregar y contador animado.
- Cantidad/presentación editable por producto.
- Nombre del comercio y observaciones persistentes.
- Página `/pedido` para revisar, editar, vaciar y copiar el pedido.
- Generación automática del resumen y envío directo al WhatsApp mayorista.
- Footer simplificado con teléfono, WhatsApp, dirección y horarios.
- SEO local inicial con metadata, JSON-LD, `sitemap.xml` y `robots.txt`.
- Acceso flotante a WhatsApp.


## Modelo de pedidos y cuentas

La compra no exige iniciar sesión. El criterio actual es mantener la menor fricción posible:

- **Mayorista:** catálogo + pedido persistente en el dispositivo + cantidades + observaciones + envío por WhatsApp. No requiere cuenta.
- **Minorista:** se agregará como experiencia separada cuando exista un catálogo/precios minoristas verificados. También podrá funcionar como compra invitada.
- **Cuenta opcional:** Google podrá habilitarse después para historial, datos guardados y repetir pedidos; no será un requisito para comprar.
- **Administración:** el acceso de Romi/familia al futuro panel sí tendrá autenticación y roles, porque permitirá modificar precios, productos y disponibilidad.

Cuando se conecte una base de datos, los pedidos podrán persistirse en servidor sin eliminar la opción de compra como invitado.

## Integraciones externas pendientes

Estas funciones requieren credenciales o cuentas de terceros y no se muestran como operativas en la interfaz pública:

- Inicio de sesión con Google.
- Cuenta e historial de pedidos en servidor.
- Checkout minorista.
- Mercado Pago.
- Registro automático de transferencias.
- Panel de administración con base de datos para precios y stock.

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
/mayorista   Catálogo, filtros y armado rápido de consulta
/pedido      Revisión completa del pedido mayorista
```

## Próxima etapa de producción

1. Cargar fotografías reales de productos cuando estén disponibles.
2. Conectar el dominio y desplegar la versión validada.
3. Crear credenciales de Google OAuth si se decide habilitar cuentas.
4. Elegir base de datos para clientes/pedidos y panel de administración.
5. Integrar Mercado Pago únicamente cuando estén disponibles las credenciales comerciales.
6. Agregar el catálogo minorista como experiencia separada del mayorista.

## Agentes de programación

Las reglas de trabajo para ChatGPT/Codex y otros agentes compatibles están documentadas en [`AGENTS.md`](./AGENTS.md).

---

Proyecto desarrollado para acompañar la digitalización de Fiambrería Hamdan.
