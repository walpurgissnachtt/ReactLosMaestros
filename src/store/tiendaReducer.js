import { convertirProducto, validarProducto } from '../utils/validaciones.js';
import { precioOferta } from '../utils/ofertas.js';

export const COSTO_ENVIO = 3990;

// Estado de la tienda: catálogo + carrito + último aviso para el usuario.
// El carrito guarda SOLO { codigo, cantidad }; nombre, precio y stock se leen del catálogo,
// así un cambio de precio hecho en Admin se refleja de inmediato en el carrito.
export function crearEstado(productos, carrito = []) {
  return { productos, carrito, aviso: null };
}

export function detalleCarrito(estado) {
  return estado.carrito
    .map((item) => {
      const producto = estado.productos.find((p) => p.codigo === item.codigo);
      return producto ? { ...producto, cantidad: item.cantidad } : null;
    })
    .filter(Boolean);
}

export function resumenCarrito(estado) {
  const detalle = detalleCarrito(estado);
  const subtotal = detalle.reduce(
    (total, p) => total + precioOferta(p) * p.cantidad,
    0,
  );
  const envio = detalle.length ? COSTO_ENVIO : 0;
  const unidades = detalle.reduce((total, p) => total + p.cantidad, 0);
  return { subtotal, envio, unidades, total: subtotal + envio };
}

function conAviso(estado, texto, tipo = 'success') {
  return { ...estado, aviso: { texto, tipo } };
}

// Función pura: calcula el siguiente estado sin tocar DOM ni localStorage.
export function tiendaReducer(estado, accion) {
  switch (accion.type) {
    case 'AGREGAR': {
      const cantidad = accion.cantidad ?? 1;
      const producto = estado.productos.find((p) => p.codigo === accion.codigo);
      const item = estado.carrito.find((i) => i.codigo === accion.codigo);
      if (
        !producto ||
        !Number.isInteger(cantidad) ||
        cantidad < 1 ||
        (item?.cantidad ?? 0) + cantidad > producto.stock
      )
        return conAviso(
          estado,
          'No hay más stock disponible de ese producto.',
          'warning',
        );
      const carrito = item
        ? estado.carrito.map((i) =>
            i.codigo === accion.codigo
              ? { ...i, cantidad: i.cantidad + cantidad }
              : i,
          )
        : [...estado.carrito, { codigo: accion.codigo, cantidad }];
      return conAviso(
        { ...estado, carrito },
        `${producto.nombre} agregado al carrito.`,
      );
    }
    case 'CANTIDAD': {
      const producto = estado.productos.find((p) => p.codigo === accion.codigo);
      if (
        !producto ||
        !Number.isInteger(accion.cantidad) ||
        accion.cantidad < 0 ||
        accion.cantidad > producto.stock
      )
        return conAviso(
          estado,
          'La cantidad debe ser un entero y no superar el stock.',
          'warning',
        );
      const carrito = estado.carrito
        .map((i) =>
          i.codigo === accion.codigo ? { ...i, cantidad: accion.cantidad } : i,
        )
        .filter((i) => i.cantidad > 0);
      return { ...estado, carrito, aviso: null };
    }
    case 'QUITAR':
      return conAviso(
        {
          ...estado,
          carrito: estado.carrito.filter((i) => i.codigo !== accion.codigo),
        },
        'Producto retirado del carrito.',
        'info',
      );
    case 'VACIAR':
      return conAviso(
        { ...estado, carrito: [] },
        'El carrito quedó vacío.',
        'info',
      );
    case 'COMPRAR': {
      if (!estado.carrito.length)
        return conAviso(estado, 'El carrito está vacío.', 'warning');
      const valido = estado.carrito.every((item) => {
        const producto = estado.productos.find((p) => p.codigo === item.codigo);
        return (
          producto &&
          Number.isInteger(item.cantidad) &&
          item.cantidad > 0 &&
          item.cantidad <= producto.stock
        );
      });
      if (!valido)
        return conAviso(
          estado,
          'El stock cambió. Revisa las cantidades antes de comprar.',
          'danger',
        );
      // Aquí se descuenta el stock (lo que antes era "restarStock")
      const productos = estado.productos.map((p) => ({
        ...p,
        stock:
          p.stock -
          (estado.carrito.find((i) => i.codigo === p.codigo)?.cantidad ?? 0),
      }));
      return conAviso(
        { ...estado, productos, carrito: [] },
        'Compra simulada completada. Stock actualizado.',
      );
    }
    case 'GUARDAR_PRODUCTO': {
      // accion.codigo es null al crear y el código del producto al editar
      if (
        Object.keys(
          validarProducto(accion.datos, estado.productos, accion.codigo),
        ).length
      )
        return conAviso(estado, 'Revisa los datos del producto.', 'danger');
      const datos = convertirProducto(accion.datos);
      if (
        accion.codigo !== null &&
        !estado.productos.some((p) => p.codigo === accion.codigo)
      )
        return conAviso(estado, 'El producto ya no existe.', 'warning');
      const productos =
        accion.codigo === null
          ? [...estado.productos, datos]
          : estado.productos.map((p) =>
              p.codigo === accion.codigo
                ? { ...p, ...datos, codigo: p.codigo }
                : p,
            );
      return conAviso(
        { ...estado, productos },
        accion.codigo === null ? 'Producto creado.' : 'Producto actualizado.',
      );
    }
    case 'ELIMINAR_PRODUCTO':
      return conAviso(
        {
          ...estado,
          productos: estado.productos.filter((p) => p.codigo !== accion.codigo),
          carrito: estado.carrito.filter((i) => i.codigo !== accion.codigo),
        },
        'Producto eliminado del catálogo y del carrito.',
        'info',
      );
    case 'CERRAR_AVISO':
      return { ...estado, aviso: null };
    default:
      return estado;
  }
}
