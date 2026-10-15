export const precioCLP = (valor) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(valor);

// Quita tildes y mayúsculas para comparar textos ("Cañería" == "caneria")
export const normalizar = (texto) =>
  String(texto)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();

// Estado visual del stock: se usa en tarjetas y en la tabla de administración
export function estadoStock(stock, stockMinimo = 3) {
  if (stock <= 0) return { texto: 'Sin stock', variante: 'danger' };
  if (stock <= stockMinimo)
    return { texto: `Stock crítico (${stock})`, variante: 'warning' };
  return { texto: 'Disponible', variante: 'success' };
}
