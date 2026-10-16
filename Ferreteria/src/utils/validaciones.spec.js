// Comprueba las validaciones exportadas por las utilidades actuales de la tienda.
import { validarCheckout, validarContacto, validarProducto } from './index.js';

describe('validarProducto', () => {
  it('acepta un producto con nombre, precio positivo y stock cero', () => {
    expect(validarProducto({ nombre: 'Producto nuevo', precio: '200', stock: '0' })).toEqual({});
  });

  it('rechaza nombre corto, precio ausente o no positivo y stock negativo', () => {
    expect(validarProducto({ nombre: '  ', precio: 0, stock: -1 })).toEqual({
      nombre: 'El nombre debe tener al menos 3 caracteres.',
      precio: 'El precio debe ser un número positivo.',
      stock: 'El stock no puede ser negativo.',
    });
  });

  it('requiere el campo de stock', () => {
    expect(validarProducto({ nombre: 'Producto', precio: '1' }).stock).toBe(
      'El stock no puede ser negativo.',
    );
  });
});

describe('validarContacto', () => {
  const ok = {
    nombre: 'Pedro',
    apellido: 'Pérez',
    email: 'pedro@correo.cl',
    rut: '12345678-9',
    celular: '912345678',
    descripcion: '',
  };

  it('acepta datos correctos', () => {
    expect(validarContacto(ok)).toEqual({});
  });

  it('detecta cada campo inválido', () => {
    const errores = validarContacto({ nombre: 'Pe2', apellido: '', email: 'a@b', rut: '12.345.678-9', celular: 'abc', descripcion: 'x'.repeat(501) });
    expect(Object.keys(errores)).toEqual(['nombre', 'apellido', 'email', 'rut', 'celular', 'descripcion']);
  });

  it('rechaza un RUT sin guion o con puntos', () => {
    expect(validarContacto({ ...ok, rut: '123456789' }).rut).toBeDefined();
    expect(validarContacto({ ...ok, rut: '12.345.678-9' }).rut).toBeDefined();
    expect(validarContacto({ ...ok, rut: '12345678-K' }).rut).toBeDefined();
  });
});

describe('validarCheckout', () => {
  const datos = {
    nombre: 'Pedro Pérez',
    email: 'pedro@correo.cl',
    direccion: 'Calle 123',
    comuna: 'Pudahuel',
    entrega: 'despacho',
  };

  it('acepta los datos completos y omite dirección al retirar en tienda', () => {
    expect(validarCheckout(datos)).toEqual({});
    expect(validarCheckout({ ...datos, direccion: '', comuna: '', entrega: 'retiro' })).toEqual({});
  });

  it('valida nombre, correo y datos de despacho', () => {
    expect(Object.keys(validarCheckout({
      ...datos,
      nombre: 'Pe',
      email: 'incorrecto',
      direccion: '',
      comuna: '',
    }))).toEqual(['nombre', 'email', 'direccion', 'comuna']);
  });
});
