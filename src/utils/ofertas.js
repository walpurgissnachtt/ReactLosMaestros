// Descuentos vigentes: código del producto -> porcentaje de descuento.
// Es una tabla aparte para no modificar el modelo de productos ni el panel de administración.
export const DESCUENTOS = {
  MC001: 15,
  MC005: 10,
  PT001: 20,
  PT007: 25,
  HM001: 15,
};

export const enOferta = (producto) => producto.codigo in DESCUENTOS;

export const porcentajeOferta = (producto) => DESCUENTOS[producto.codigo] ?? 0;

// Precio final con descuento, redondeado a pesos enteros
export const precioOferta = (producto) =>
  Math.round(producto.precioVenta * (1 - porcentajeOferta(producto) / 100));
