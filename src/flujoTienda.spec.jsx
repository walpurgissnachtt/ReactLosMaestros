import { productosIniciales } from './data/productosIniciales.js';
import { CLAVES } from './services/storage.js';
import { DESCUENTOS, enOferta, precioOferta } from './utils/ofertas.js';
import { precioCLP } from './utils/formatos.js';
import { validarCheckout } from './utils/validaciones.js';
import {
  boton,
  campo,
  clic,
  escribir,
  limpiar,
  q,
  qa,
  renderizarApp,
} from './test/utils.jsx';

const guardado = () => JSON.parse(localStorage.getItem(CLAVES.tienda));
const titulo = () => q('h1')?.textContent;

function agregarPrimerProductoYIrAlPago() {
  renderizarApp('/productos');
  clic(qa('button').find((b) => b.textContent === 'Agregar al carrito'));
  clic(boton('Carrito (1)'));
  clic(boton('Ir al pago'));
}

describe('ofertas (utils)', () => {
  it('calcula el precio con descuento', () => {
    const p = productosIniciales.find((x) => x.codigo === 'MC001');
    expect(enOferta(p)).toBe(true);
    expect(precioOferta(p)).toBe(Math.round(p.precioVenta * (1 - DESCUENTOS.MC001 / 100)));
  });

  it('un producto sin descuento no está en oferta', () => {
    expect(enOferta({ codigo: 'ZZ999' })).toBe(false);
  });
});

describe('validarCheckout', () => {
  const ok = { nombre: 'Pedro Pérez', email: 'p@correo.cl', direccion: 'Calle 123', comuna: 'Pudahuel', entrega: 'despacho' };

  it('acepta datos válidos', () => {
    expect(validarCheckout(ok)).toEqual({});
  });

  it('exige dirección y comuna solo si hay despacho', () => {
    const vacios = { ...ok, direccion: '', comuna: '' };
    expect(Object.keys(validarCheckout(vacios))).toEqual(['direccion', 'comuna']);
    expect(validarCheckout({ ...vacios, entrega: 'retiro' })).toEqual({});
  });

  it('valida nombre y correo', () => {
    expect(Object.keys(validarCheckout({ ...ok, nombre: 'Pe', email: 'x' }))).toEqual(['nombre', 'email']);
  });
});

describe('categorías y ofertas', () => {
  afterEach(limpiar);

  it('lista las categorías y muestra los productos de una', () => {
    renderizarApp('/categorias');
    expect(titulo()).toBe('Categorías');
    clic(boton('Pinturas'));
    expect(titulo()).toBe('Pinturas');
    const cantidad = productosIniciales.filter((p) => p.categoria === 'Pinturas').length;
    expect(qa('article').length).toBe(cantidad);
  });

  it('la página de ofertas muestra solo productos con descuento', () => {
    renderizarApp('/ofertas');
    expect(qa('article').length).toBe(Object.keys(DESCUENTOS).length);
    expect(document.body.textContent).toContain('-20%');
    const producto = productosIniciales.find((p) => p.codigo === 'PT001');
    expect(document.body.textContent).toContain(precioOferta(producto).toLocaleString('es-CL'));
  });
});

describe('checkout y resultado de la compra', () => {
  afterEach(limpiar);

  it('con el carrito vacío no permite pagar', () => {
    renderizarApp('/checkout');
    expect(document.body.textContent).toContain('Tu carrito está vacío.');
  });

  it('muestra errores si faltan los datos de envío', () => {
    agregarPrimerProductoYIrAlPago();
    clic(q('button[type=submit]'));
    expect(document.body.textContent).toContain('Ingresa un correo electrónico válido.');
    expect(titulo()).toBe('Finalizar compra');
  });

  it('pago aprobado: muestra el resumen, descuenta stock y vacía el carrito', () => {
    const stockInicial = productosIniciales[0].stock;
    agregarPrimerProductoYIrAlPago();
    escribir(campo('Nombre completo'), 'Pedro Pérez');
    escribir(campo('Correo electrónico'), 'pedro@correo.cl');
    escribir(campo('Dirección'), 'Calle 123');
    escribir(campo('Comuna'), 'Pudahuel');
    clic(q('button[type=submit]'));
    expect(titulo()).toBe('¡Compra exitosa!');
    expect(document.body.textContent).toContain('pedro@correo.cl');
    expect(document.body.textContent).toContain(precioCLP(precioOferta(productosIniciales[0])));
    expect(guardado().productos[0].stock).toBe(stockInicial - 1);
    expect(guardado().carrito).toEqual([]);
  });

  it('pago rechazado: muestra el error y no descuenta stock', () => {
    const stockInicial = productosIniciales[0].stock;
    agregarPrimerProductoYIrAlPago();
    escribir(campo('Nombre completo'), 'Pedro Pérez');
    escribir(campo('Correo electrónico'), 'pedro@correo.cl');
    escribir(campo('Tipo de entrega'), 'retiro');
    escribir(campo('Resultado del pago (simulación)'), 'rechazado');
    clic(q('button[type=submit]'));
    expect(titulo()).toBe('No se pudo realizar el pago');
    expect(guardado().productos[0].stock).toBe(stockInicial);
    expect(guardado().carrito.length).toBe(1);
  });

  it('entrar directo a la compra exitosa redirige al inicio', () => {
    renderizarApp('/compra-exitosa');
    expect(document.title).not.toBe('');
    expect(document.body.textContent).not.toContain('¡Compra exitosa!');
  });
});
