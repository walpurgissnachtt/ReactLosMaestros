// Valida, carga y guarda en localStorage los datos de tienda y la sesión.
import { productosIniciales } from '../data/productosIniciales.js';
import { crearEstado } from '../context/TiendaContext.jsx';

export const CLAVES = {
  tienda: 'ferreteria-tienda-v1',
  sesion: 'ferreteria-sesion',
  carritoHtml: 'carrito_ferreteria', // clave que usaba la versión HTML del proyecto
};

// Lee JSON de localStorage sin romper la app si el dato falta o está corrupto
export function leerJSON(clave, alternativa) {
  try {
    const valor = localStorage.getItem(clave);
    return valor === null ? alternativa : JSON.parse(valor);
  } catch {
    return alternativa;
  }
}

const esTexto = (valor, minimo = 1) =>
  typeof valor === 'string' && valor.trim().length >= minimo;

// Comprueba que los datos de un producto tengan formatos y valores válidos.
function productoValido(p) {
  return (
    p &&
    esTexto(p.codigo) &&
    esTexto(p.nombre) &&
    esTexto(p.categoria) &&
    esTexto(p.subcategoria) &&
    esTexto(p.marca) &&
    esTexto(p.unidad) &&
    Number.isFinite(p.precioCompra) &&
    p.precioCompra >= 0 &&
    Number.isFinite(p.precioVenta) &&
    p.precioVenta > 0 &&
    Number.isInteger(p.stock) &&
    p.stock >= 0 &&
    Number.isInteger(p.stockMinimo) &&
    p.stockMinimo >= 0 &&
    (p.imagen === undefined || typeof p.imagen === 'string')
  );
}

// Carga el estado inicial: lo guardado si es válido; si no, los datos iniciales.
export function cargarTienda() {
  const guardado = leerJSON(CLAVES.tienda, null);
  const candidatos = guardado?.productos ?? productosIniciales;
  const productos =
    Array.isArray(candidatos) &&
    candidatos.every(productoValido) &&
    new Set(candidatos.map((p) => p.codigo)).size === candidatos.length
      ? candidatos
      : productosIniciales.map((p) => ({ ...p }));

  // Si el usuario ya tenía un carrito de la versión HTML, se recupera una sola vez
  const candidatosCarrito =
    guardado?.carrito ?? leerJSON(CLAVES.carritoHtml, []);
  const codigos = new Set();
  const carrito = (Array.isArray(candidatosCarrito) ? candidatosCarrito : [])
    .filter((item) => {
      const valido =
        item &&
        typeof item.codigo === 'string' &&
        !codigos.has(item.codigo) &&
        Number.isInteger(item.cantidad) &&
        item.cantidad > 0 &&
        productos.some((p) => p.codigo === item.codigo);
      if (valido) codigos.add(item.codigo);
      return valido;
    })
    .map((item) => ({ codigo: item.codigo, cantidad: item.cantidad }));
  return crearEstado(productos, carrito);
}

// Devuelve false si el navegador no permite guardar (modo privado, almacenamiento lleno)
export function guardarTienda(estado) {
  try {
    localStorage.setItem(
      CLAVES.tienda,
      JSON.stringify({ productos: estado.productos, carrito: estado.carrito }),
    );
    return true;
  } catch {
    return false;
  }
}

// Recupera solo sesiones válidas del administrador.
export function cargarSesion() {
  const valor = leerJSON(CLAVES.sesion, null);
  return valor?.usuario === 'admin' && valor?.rol === 'admin' ? valor : null;
}

// Guarda la sesión o la elimina cuando el usuario cierra sesión.
export function guardarSesion(sesion) {
  try {
    if (sesion) localStorage.setItem(CLAVES.sesion, JSON.stringify(sesion));
    else localStorage.removeItem(CLAVES.sesion);
    return true;
  } catch {
    return false;
  }
}
