import { estadoStock, normalizar, precioCLP } from './formatos.js';
import { IMAGEN_RESPALDO, rutaImagen } from './imagenes.js';

describe('formatos', () => {
  it('da formato de pesos chilenos sin decimales', () => {
    expect(precioCLP(5990)).toContain('5.990');
    expect(precioCLP(5990)).toContain('$');
  });

  it('normaliza tildes y mayúsculas', () => {
    expect(normalizar('  CAÑERÍA ')).toBe('caneria');
  });

  it('clasifica el stock: sin stock, crítico y disponible', () => {
    expect(estadoStock(0).variante).toBe('danger');
    expect(estadoStock(2, 3).variante).toBe('warning');
    expect(estadoStock(10, 3).variante).toBe('success');
  });
});

describe('rutaImagen', () => {
  it('prueba las extensiones en orden y termina en la imagen de respaldo', () => {
    expect(rutaImagen('HE006', 0)).toBe('/assets/Productos/HE006.jpg');
    expect(rutaImagen('HE006', 1)).toBe('/assets/Productos/HE006.webp');
    expect(rutaImagen('HE006', 4)).toBe(IMAGEN_RESPALDO);
  });

  it('usa la URL propia del producto y luego el respaldo', () => {
    expect(rutaImagen('X', 0, 'https://x.cl/a.jpg')).toBe('https://x.cl/a.jpg');
    expect(rutaImagen('X', 1, 'https://x.cl/a.jpg')).toBe(IMAGEN_RESPALDO);
  });
});
