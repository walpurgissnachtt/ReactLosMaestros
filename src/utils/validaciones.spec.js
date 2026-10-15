import { convertirProducto, validarContacto, validarProducto } from './validaciones.js';

const valido = {
  codigo: 'zz001',
  nombre: 'Producto nuevo',
  categoria: 'Pruebas',
  subcategoria: 'Unitarias',
  marca: 'Test',
  unidad: 'Unidad',
  precioCompra: '100',
  precioVenta: '200',
  stock: '0',
  stockMinimo: '0',
  imagen: '',
};

describe('validarProducto', () => {
  it('acepta un producto válido, incluso con stock cero', () => {
    expect(validarProducto(valido, [])).toEqual({});
  });

  it('informa todos los campos incorrectos en una misma validación', () => {
    const errores = validarProducto(
      { ...valido, codigo: '1', nombre: ' ', categoria: '', precioVenta: '0', stock: '1.5', imagen: 'ftp://x' },
      [],
    );
    expect(Object.keys(errores)).toEqual(['codigo', 'nombre', 'categoria', 'precioVenta', 'stock', 'imagen']);
  });

  it('rechaza código y nombre repetidos al crear, pero permite conservar los propios al editar', () => {
    const existentes = [{ codigo: 'ZZ001', nombre: 'Producto nuevo' }];
    expect(validarProducto(valido, existentes).codigo).toBeDefined();
    expect(validarProducto({ ...valido, codigo: 'ZZ002' }, existentes).nombre).toBeDefined();
    expect(validarProducto(valido, existentes, 'ZZ001')).toEqual({});
  });
});

describe('convertirProducto', () => {
  it('convierte texto en números y limpia espacios y mayúsculas', () => {
    const p = convertirProducto({ ...valido, nombre: '  Nuevo  ', precioVenta: '1500' });
    expect(p.codigo).toBe('ZZ001');
    expect(p.nombre).toBe('Nuevo');
    expect(p.precioVenta).toBe(1500);
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
    expect(validarContacto({ ...ok, rut: '12345678-K' }).rut).toBeUndefined();
  });
});
