// Reúne funciones reutilizables para precios, imágenes, ofertas y formularios.
// 1. Formateador de moneda (CLP)
export function precioCLP(valor) {
  if (typeof valor !== 'number' || isNaN(valor)) return '$0';
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(valor);
}

// Normaliza texto para facilitar búsquedas sin distinguir tildes o mayúsculas.
export function normalizar(valor) {
  return String(valor ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

// Aplica el descuento vigente al precio de venta del producto.
export function precioOferta(producto) {
  if (!producto) return 0;
  const precio = producto.precioVenta ?? producto.precio ?? 0;
  const descuento = porcentajeOferta(producto);
  return Math.round(precio * (1 - descuento / 100));
}

const imagenesProducto = Object.fromEntries(
  Object.entries(
    import.meta.glob('../components/admin_components/assets/Productos/*', {
      eager: true,
      import: 'default',
      query: '?url',
    }),
  ).map(([ruta, url]) => [ruta.split('/').pop(), url]),
);
const imagenPredeterminada = imagenesProducto['default.svg'];

// Resuelve las imágenes desde los assets del proyecto y conserva URLs externas.
export function obtenerRutaImagen(imagen, codigo) {
  if (imagen && /^(https?:|data:|blob:)/i.test(imagen)) {
    return imagen;
  }

  const nombreImagen = imagen?.split(/[\\/]/).pop();
  if (nombreImagen && imagenesProducto[nombreImagen]) {
    return imagenesProducto[nombreImagen];
  }

  const imagenPorCodigo = Object.entries(imagenesProducto).find(([nombre]) =>
    nombre.startsWith(`${codigo}.`),
  )?.[1];
  return imagenPorCodigo ?? imagenPredeterminada;
}

// Sustituye una imagen que no cargó por la imagen genérica del catálogo.
export function imagenNoDisponible(evento) {
  const imagen = evento.currentTarget;
  if (imagen.getAttribute('src') !== imagenPredeterminada) {
    imagen.src = imagenPredeterminada;
  }
}

// Verifica los datos obligatorios para completar una compra.
export function validarCheckout(datos) {
  const errores = {};
  if (!datos.nombre?.trim() || datos.nombre.trim().length < 3) {
    errores.nombre = 'Ingresa tu nombre completo.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email ?? '')) {
    errores.email = 'Ingresa un correo electrónico válido.';
  }
  if (datos.entrega !== 'retiro' && !datos.direccion?.trim()) {
    errores.direccion = 'Ingresa una dirección.';
  }
  if (datos.entrega !== 'retiro' && !datos.comuna?.trim()) {
    errores.comuna = 'Ingresa una comuna.';
  }
  return errores;
}

// Revisa el formato de los datos entregados en el formulario de contacto.
export function validarContacto(datos) {
  const errores = {};
  if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]{2,}$/.test(datos.nombre?.trim() ?? '')) {
    errores.nombre = 'Ingresa un nombre válido.';
  }
  if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]{2,}$/.test(datos.apellido?.trim() ?? '')) {
    errores.apellido = 'Ingresa un apellido válido.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email ?? '')) {
    errores.email = 'Ingresa un correo electrónico válido.';
  }
  if (!/^\d{7,8}-\d$/.test(datos.rut ?? '')) {
    errores.rut = 'Ingresa un RUT sin puntos y con guion.';
  }
  if (!/^\d{9}$/.test(datos.celular ?? '')) {
    errores.celular = 'Ingresa un celular de 9 dígitos.';
  }
  if ((datos.descripcion ?? '').length > 500) {
    errores.descripcion = 'La descripción no puede superar 500 caracteres.';
  }
  return errores;
}

export const DESCUENTOS = {
  MC001: 15,
  MC005: 10,
  PT001: 20,
  PT007: 25,
  HM001: 15,
};

// Indica si el producto tiene un descuento vigente.
export function enOferta(producto) {
  return Boolean(
    producto &&
    (producto.oferta || producto.enOferta || DESCUENTOS[producto.codigo] > 0) &&
    (producto.descuento > 0 || DESCUENTOS[producto.codigo] > 0),
  );
}

// Devuelve el porcentaje de descuento del producto o cero si no está en oferta.
export function porcentajeOferta(producto) {
  if (!enOferta(producto)) return 0;
  return producto.descuento > 0
    ? producto.descuento
    : DESCUENTOS[producto.codigo] ?? 0;
}

// Valida los campos y reglas del formulario de productos.
export function validarProducto(datos) {
  const errores = {};
  if (!datos.nombre?.trim() || datos.nombre.trim().length < 3) {
    errores.nombre = 'El nombre debe tener al menos 3 caracteres.';
  }
  if (!datos.precio || Number(datos.precio) <= 0) {
    errores.precio = 'El precio debe ser un número positivo.';
  }
  if (datos.stock === undefined || Number(datos.stock) < 0) {
    errores.stock = 'El stock no puede ser negativo.';
  }
  return errores;
}