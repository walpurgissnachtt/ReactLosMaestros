import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { cargarTienda, guardarTienda } from '../Services/storage.js';
import { precioOferta } from '../utils/index.js';

// Agrega un mensaje temporal al estado después de una acción.
function conAviso(estado, texto, tipo = 'success') {
  return { ...estado, aviso: { texto, tipo } };
}

// Actualiza productos, carrito y avisos según la acción solicitada.
export function tiendaReducer(estado, accion) {
  switch (accion.type) {
    case 'AGREGAR': {
      const codigo = accion.codigo ?? accion.producto?.codigo;
      const cantidad = accion.cantidad ?? 1;
      const producto = estado.productos.find((p) => p.codigo === codigo);
      const item = estado.carrito.find((p) => p.codigo === codigo);
      if (
        !producto ||
        !Number.isInteger(cantidad) ||
        cantidad < 1 ||
        (item?.cantidad ?? 0) + cantidad > producto.stock
      ) {
        return conAviso(
          estado,
          'No hay stock suficiente para agregar ese producto.',
          'warning',
        );
      }
      return conAviso(
        {
          ...estado,
          carrito: item
            ? estado.carrito.map((p) =>
                p.codigo === codigo
                  ? { ...p, cantidad: p.cantidad + cantidad }
                  : p,
              )
            : [...estado.carrito, { codigo, cantidad }],
        },
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
      ) {
        return conAviso(
          estado,
          'La cantidad debe ser válida y no superar el stock disponible.',
          'warning',
        );
      }
      return {
        ...estado,
        carrito: estado.carrito.map((p) =>
          p.codigo === accion.codigo ? { ...p, cantidad: accion.cantidad } : p
        ).filter((p) => p.cantidad > 0),
        aviso: null,
      };
    }
    case 'QUITAR': {
      return conAviso(
        {
          ...estado,
          carrito: estado.carrito.filter((p) => p.codigo !== accion.codigo),
        },
        'Producto eliminado del carrito.',
        'info',
      );
    }
    case 'VACIAR': {
      return conAviso(
        { ...estado, carrito: [] },
        'El carrito quedó vacío.',
        'info',
      );
    }
    case 'COMPRAR': {
      const valida = estado.carrito.length > 0 && estado.carrito.every((item) => {
        const producto = estado.productos.find((p) => p.codigo === item.codigo);
        return producto && Number.isInteger(item.cantidad) &&
          item.cantidad > 0 && item.cantidad <= producto.stock;
      });
      if (!valida) {
        return conAviso(
          estado,
          'El stock cambió. Revisa las cantidades antes de comprar.',
          'warning',
        );
      }
      return conAviso(
        {
          ...estado,
          productos: estado.productos.map((producto) => ({
            ...producto,
            stock: producto.stock - (
              estado.carrito.find((item) => item.codigo === producto.codigo)?.cantidad ?? 0
            ),
          })),
          carrito: [],
        },
        'Compra completada. El stock fue actualizado.',
      );
    }
    case 'CARGAR_ESTADO': {
      return { ...estado, ...accion.payload };
    }
    case 'CERRAR_AVISO':
      return { ...estado, aviso: null };
    default:
      return estado;
  }
}

// Completa los artículos del carrito con la información del catálogo.
export function detalleCarrito(estado) {
  return (estado.carrito || [])
    .map((item) => {
      const producto = estado.productos.find((p) => p.codigo === item.codigo);
      return producto ? { ...producto, cantidad: item.cantidad } : null;
    })
    .filter(Boolean);
}

// Calcula unidades, subtotal, costo de envío y total del carrito.
export function resumenCarrito(estado) {
  const carrito = detalleCarrito(estado);
  const unidades = carrito.reduce((total, producto) => total + producto.cantidad, 0);
  const subtotal = carrito.reduce(
    (total, producto) => total + precioOferta(producto) * producto.cantidad,
    0,
  );
  const envio = subtotal > 50000 || unidades === 0 ? 0 : 5000;
  const total = subtotal + envio;
  return { unidades, subtotal, envio, total };
}

// Crea el estado inicial de la tienda con catálogo, carrito y avisos.
export function crearEstado(productos = [], carrito = []) {
  return { productos, carrito, aviso: null };
}

export const TiendaContext = createContext();

// Permite acceder al contexto y avisa si se usa fuera de su proveedor.
export function useTienda() {
  const contexto = useContext(TiendaContext);
  if (!contexto) throw new Error('useTienda debe usarse dentro de TiendaProvider.');
  return contexto;
}

// Comparte el estado de la tienda y persiste los cambios en el navegador.
export function TiendaProvider({ children, productosIniciales = [] }) {
  const estadoInicial = cargarTienda() || {
    carrito: [],
    productos: productosIniciales,
  };

  const [estado, dispatch] = useReducer(tiendaReducer, estadoInicial);
  const [errorGuardado, setErrorGuardado] = useState(false);

  useEffect(() => {
    setErrorGuardado(!guardarTienda(estado));
  }, [estado]);

  return (
    <TiendaContext.Provider value={{ estado, dispatch, errorGuardado }}>
      {children}
    </TiendaContext.Provider>
  );
}