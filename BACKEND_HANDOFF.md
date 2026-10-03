# Backend handoff — Fiambrería Hamdan

El catálogo comercial y el panel administrativo ya utilizan Supabase. Este archivo conserva el contrato original y las posibles ampliaciones. Consultar [`ADMIN_SETUP.md`](./ADMIN_SETUP.md) para el estado actual, la migración aplicada y la configuración de producción.

## 1. Productos

La interfaz consume actualmente el contrato definido en `src/data/catalog.ts`.

Campos que el backend debe poder entregar:

```ts
type CatalogProduct = {
  id: string;
  name: string;
  category: "quesos" | "fiambres" | "sandwich-x4" | "sandwich-x8" | "pizzas";
  retailPrice?: number;
  wholesalePrice?: number;
  wholesaleSamePrice?: boolean;
  image?: string;
  imageAlt?: string;
  active: boolean;
};
```

Reglas:

- `active=false` debe retirar el producto del catálogo y de carritos persistidos.
- No inventar stock ni precios cuando falten datos.
- La imagen es opcional. El frontend ya tiene un fallback visual por categoría.
- Las tiendas Mayorista y Minorista deben seguir usando precios y carritos separados.

## 2. Reglas mayoristas

Actualmente provienen de `categories.wholesale_minimum` en Supabase, con estos valores verificados:

- Sándwich x4: mínimo total de 20 paquetes surtidos.
- Sándwich x8: mínimo total de 40 paquetes surtidos.
- Pizzas: mínimo total de 20 unidades surtidas.

Las tiendas, el carrito y la validación del servidor comparten esos valores; el panel actual no los modifica.

## 3. Datos comerciales

Los datos públicos actuales están centralizados en `src/data/business.ts`.

El futuro panel puede administrar, si se desea:

- teléfonos;
- WhatsApp;
- dirección;
- horarios;
- enlaces de redes sociales.

## 4. Carritos y pedidos

Hoy cada tienda conserva selección y cantidades en las claves originales de `localStorage`. Catálogo, contador y checkout usan el mismo almacenamiento a través de `useStoreCart`. Los borradores de datos del cliente se conservan por pestaña y tienda en `sessionStorage`; se recuperan nombre y observaciones del formato anterior cuando no hay borrador nuevo.

`src/lib/order.ts` calcula importes y mínimos desde los precios del catálogo. `src/lib/checkout.ts` valida los datos y prepara el mensaje de WhatsApp. Los totales son estimados; abrir WhatsApp no crea ni confirma un pedido.

`prepareWhatsAppOrder()` ya vuelve a consultar el catálogo y valida precios, cantidades, mínimos, disponibilidad y formulario en el servidor. Si el pedido cambió, actualiza el resumen antes de permitir otro intento. La validación del navegador mejora la experiencia; el texto sigue siendo editable en WhatsApp y la confirmación corresponde al negocio.

Las fotos institucionales de `src/data/showcase.ts` y `public/showcase/` están separadas de las imágenes individuales de los productos.

Siguiente etapa recomendada:

1. mantener carrito invitado local;
2. crear pedido en servidor al confirmar;
3. registrar fecha, canal, tienda, líneas del pedido y estado;
4. permitir historial solo a clientes autenticados opcionales;
5. mantener compra invitada sin login obligatorio.

## 5. Administración

El panel actual exige Supabase Auth y una membresía activa con rol `owner`, `admin` o `editor`, además de RLS y privilegios limitados de columna.

Implementado: búsqueda, filtro por categoría, edición de precios minoristas/mayoristas, activación, disponibilidad y gestión de imágenes (vista previa, carga, reemplazo, eliminación y descripción), con Storage y autorización administrativa. Consultar `ADMIN_SETUP.md` para las pruebas pendientes de sesión real. Ampliaciones posibles:

- revisar pedidos;
- modificar mínimos mayoristas si el negocio los cambia;
- historial de cambios de precio/stock.

## 6. Autenticación

- Clientes: Google opcional.
- Compra invitada: mantener habilitada.
- Administradores: autenticación obligatoria.
- Nunca exponer claves de servicio en el cliente.

## 7. Pagos

Mercado Pago queda fuera del frontend actual hasta implementar una integración real del lado servidor y verificar estados de pago.
