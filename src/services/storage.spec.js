import { productosIniciales } from '../data/productosIniciales.js';
import {
  CLAVES,
  cargarSesion,
  cargarTienda,
  guardarSesion,
  guardarTienda,
} from './storage.js';

describe('storage', () => {
  beforeEach(() => localStorage.clear());
  afterAll(() => localStorage.clear());

  it('sin datos guardados parte del catálogo inicial y un carrito vacío', () => {
    const estado = cargarTienda();
    expect(estado.productos.length).toBe(productosIniciales.length);
    expect(estado.carrito).toEqual([]);
  });

  it('guarda y vuelve a cargar productos y carrito', () => {
    const estado = cargarTienda();
    guardarTienda({ ...estado, carrito: [{ codigo: 'MC001', cantidad: 2 }] });
    expect(cargarTienda().carrito).toEqual([{ codigo: 'MC001', cantidad: 2 }]);
  });

  it('ignora datos corruptos y vuelve al catálogo inicial', () => {
    localStorage.setItem(CLAVES.tienda, '{esto no es json');
    expect(cargarTienda().productos.length).toBe(productosIniciales.length);
    localStorage.setItem(CLAVES.tienda, JSON.stringify({ productos: [{ codigo: 'X' }], carrito: [] }));
    expect(cargarTienda().productos.length).toBe(productosIniciales.length);
  });

  it('descarta ítems de carrito repetidos, inválidos o de productos inexistentes', () => {
    localStorage.setItem(
      CLAVES.tienda,
      JSON.stringify({
        productos: productosIniciales,
        carrito: [
          { codigo: 'MC001', cantidad: 1 },
          { codigo: 'MC001', cantidad: 5 },
          { codigo: 'MC002', cantidad: 0 },
          { codigo: 'NOEXISTE', cantidad: 1 },
        ],
      }),
    );
    expect(cargarTienda().carrito).toEqual([{ codigo: 'MC001', cantidad: 1 }]);
  });

  it('recupera una sola vez el carrito que dejó la versión HTML', () => {
    localStorage.setItem(
      CLAVES.carritoHtml,
      JSON.stringify([{ codigo: 'HE006', nombre: 'Caladora', precio: 42990, cantidad: 2 }]),
    );
    expect(cargarTienda().carrito).toEqual([{ codigo: 'HE006', cantidad: 2 }]);
  });

  it('solo reconoce la sesión del administrador', () => {
    expect(cargarSesion()).toBeNull();
    guardarSesion({ usuario: 'admin', rol: 'admin' });
    expect(cargarSesion().rol).toBe('admin');
    localStorage.setItem(CLAVES.sesion, JSON.stringify({ usuario: 'otro', rol: 'admin' }));
    expect(cargarSesion()).toBeNull();
    guardarSesion(null);
    expect(localStorage.getItem(CLAVES.sesion)).toBeNull();
  });
});
