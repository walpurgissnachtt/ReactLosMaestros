import {
  crearEstado,
  detalleCarrito,
  resumenCarrito,
  tiendaReducer,
} from './tiendaReducer.js';

const producto = {
  codigo: 'HM001',
  categoria: 'Herramientas',
  subcategoria: 'Manuales',
  nombre: 'Martillo',
  marca: 'Stanley',
  unidad: 'Unidad',
  precioCompra: 4000,
  precioVenta: 10000,
  stock: 2,
  stockMinimo: 1,
  imagen: '',
};
const iniciar = () => crearEstado([{ ...producto }]);

describe('reglas del carrito', () => {
  it('acumula cantidades sin duplicar productos ni mutar el estado anterior', () => {
    const inicial = iniciar();
    const uno = tiendaReducer(inicial, { type: 'AGREGAR', codigo: 'HM001' });
    const dos = tiendaReducer(uno, { type: 'AGREGAR', codigo: 'HM001' });
    expect(dos.carrito).toEqual([{ codigo: 'HM001', cantidad: 2 }]);
    expect(inicial.carrito).toEqual([]);
    expect(inicial.productos[0].stock).toBe(2);
  });

  it('permite agregar varias unidades de una vez (selector del detalle)', () => {
    const r = tiendaReducer(iniciar(), { type: 'AGREGAR', codigo: 'HM001', cantidad: 2 });
    expect(r.carrito).toEqual([{ codigo: 'HM001', cantidad: 2 }]);
  });

  it('rechaza agregar más unidades que el stock disponible', () => {
    const inicial = crearEstado([producto], [{ codigo: 'HM001', cantidad: 2 }]);
    const siguiente = tiendaReducer(inicial, { type: 'AGREGAR', codigo: 'HM001' });
    expect(siguiente.carrito).toEqual(inicial.carrito);
    expect(siguiente.aviso.tipo).toBe('warning');
  });

  it('impide agregar productos sin stock o que no existen', () => {
    const inicial = crearEstado([{ ...producto, stock: 0 }]);
    expect(tiendaReducer(inicial, { type: 'AGREGAR', codigo: 'HM001' }).carrito).toEqual([]);
    expect(tiendaReducer(inicial, { type: 'AGREGAR', codigo: 'NOEXISTE' }).carrito).toEqual([]);
  });

  [-1, 1.5, 3, NaN].forEach((cantidad) => {
    it(`rechaza la cantidad inválida ${cantidad}`, () => {
      const inicial = crearEstado([producto], [{ codigo: 'HM001', cantidad: 1 }]);
      const r = tiendaReducer(inicial, { type: 'CANTIDAD', codigo: 'HM001', cantidad });
      expect(r.carrito).toEqual(inicial.carrito);
    });
  });

  it('retira un producto si su cantidad llega a cero', () => {
    const inicial = crearEstado([producto], [{ codigo: 'HM001', cantidad: 1 }]);
    const r = tiendaReducer(inicial, { type: 'CANTIDAD', codigo: 'HM001', cantidad: 0 });
    expect(r.carrito).toEqual([]);
  });

  it('calcula subtotal, envío y total usando el precio rebajado de productos en oferta', () => {
    const conItems = crearEstado([producto], [{ codigo: 'HM001', cantidad: 2 }]);
    expect(resumenCarrito(conItems)).toEqual({
      subtotal: 17000,
      envio: 3990,
      total: 20990,
      unidades: 2,
    });
    expect(resumenCarrito(iniciar())).toEqual({ subtotal: 0, envio: 0, total: 0, unidades: 0 });
  });

  it('descuenta stock y vacía el carrito al comprar', () => {
    const inicial = crearEstado([producto], [{ codigo: 'HM001', cantidad: 2 }]);
    const compra = tiendaReducer(inicial, { type: 'COMPRAR' });
    expect(compra.productos[0].stock).toBe(0);
    expect(compra.carrito).toEqual([]);
    expect(inicial.productos[0].stock).toBe(2);
  });

  it('rechaza una compra completa si un producto perdió stock', () => {
    const inicial = crearEstado(
      [producto, { ...producto, codigo: 'HM002', nombre: 'Alicate', stock: 0 }],
      [
        { codigo: 'HM001', cantidad: 1 },
        { codigo: 'HM002', cantidad: 1 },
      ],
    );
    const r = tiendaReducer(inicial, { type: 'COMPRAR' });
    expect(r.productos).toEqual(inicial.productos);
    expect(r.carrito).toEqual(inicial.carrito);
    expect(r.aviso.tipo).toBe('danger');
  });

  it('no compra con el carrito vacío', () => {
    expect(tiendaReducer(iniciar(), { type: 'COMPRAR' }).aviso.tipo).toBe('warning');
  });
});

describe('reglas del CRUD', () => {
  const formulario = {
    codigo: 'ee001',
    nombre: 'Escalera',
    categoria: 'Herramientas',
    subcategoria: 'Escaleras',
    marca: 'Stanley',
    unidad: 'Unidad',
    precioCompra: '20000',
    precioVenta: '35000',
    stock: '4',
    stockMinimo: '1',
    imagen: '',
  };

  it('crea un producto y convierte los números y el código del formulario', () => {
    const r = tiendaReducer(iniciar(), { type: 'GUARDAR_PRODUCTO', codigo: null, datos: formulario });
    expect(r.productos.length).toBe(2);
    expect(r.productos[1].codigo).toBe('EE001');
    expect(r.productos[1].precioVenta).toBe(35000);
    expect(r.productos[1].stock).toBe(4);
  });

  it('actualiza el precio y el carrito consulta el precio nuevo', () => {
    const inicial = crearEstado([producto], [{ codigo: 'HM001', cantidad: 2 }]);
    const r = tiendaReducer(inicial, {
      type: 'GUARDAR_PRODUCTO',
      codigo: 'HM001',
      datos: { ...formulario, codigo: 'HM001', nombre: 'Martillo', precioVenta: '15000' },
    });
    expect(r.productos.length).toBe(1);
    expect(detalleCarrito(r)[0].precioVenta).toBe(15000);
    expect(resumenCarrito(r).subtotal).toBe(25500);
  });

  it('rechaza nombres duplicados, códigos repetidos y precios no válidos', () => {
    const inicial = iniciar();
    const accion = (datos) => tiendaReducer(inicial, { type: 'GUARDAR_PRODUCTO', codigo: null, datos });
    expect(accion({ ...formulario, nombre: '  MÁRTILLO ' }).productos.length).toBe(1);
    expect(accion({ ...formulario, nombre: 'Martillo' }).productos.length).toBe(1);
    expect(accion({ ...formulario, codigo: 'hm001' }).productos.length).toBe(1);
    expect(accion({ ...formulario, precioVenta: '-1' }).productos.length).toBe(1);
  });

  it('elimina el producto tanto del catálogo como del carrito', () => {
    const inicial = crearEstado([producto], [{ codigo: 'HM001', cantidad: 1 }]);
    const r = tiendaReducer(inicial, { type: 'ELIMINAR_PRODUCTO', codigo: 'HM001' });
    expect(r.productos).toEqual([]);
    expect(r.carrito).toEqual([]);
  });

  it('cierra el aviso', () => {
    const con = tiendaReducer(iniciar(), { type: 'VACIAR' });
    expect(con.aviso).not.toBeNull();
    expect(tiendaReducer(con, { type: 'CERRAR_AVISO' }).aviso).toBeNull();
  });
});
