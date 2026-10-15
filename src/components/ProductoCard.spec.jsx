import { clic, limpiar, q, renderizar } from '../test/utils.jsx';
import { precioCLP } from '../utils/formatos.js';
import ProductoCard from './ProductoCard.jsx';

const producto = {
  codigo: 'HM001',
  categoria: 'Herramientas',
  subcategoria: 'Manuales',
  nombre: 'Martillo carpintero 500g',
  marca: 'Stanley',
  unidad: 'Unidad',
  precioCompra: 4200,
  precioVenta: 7990,
  stock: 20,
  stockMinimo: 5,
};

describe('<ProductoCard />', () => {
  afterEach(limpiar);

  it('renderiza nombre, categoría y precio recibidos por props', () => {
    const el = renderizar(<ProductoCard producto={producto} alAgregar={() => {}} />);
    expect(el.textContent).toContain('Martillo carpintero 500g');
    expect(el.textContent).toContain('Herramientas');
    expect(el.textContent).toContain(precioCLP(7990));
  });

  it('el botón ejecuta alAgregar con el código del producto', () => {
    const alAgregar = jasmine.createSpy('alAgregar');
    const el = renderizar(<ProductoCard producto={producto} alAgregar={alAgregar} />);
    const boton = q('button', el);
    expect(boton.textContent).toBe('Agregar al carrito');
    clic(boton);
    expect(alAgregar).toHaveBeenCalledOnceWith('HM001');
  });

  it('sin stock muestra "Sin stock" y deshabilita el botón', () => {
    const el = renderizar(<ProductoCard producto={{ ...producto, stock: 0 }} alAgregar={() => {}} />);
    expect(q('button', el).textContent).toBe('Sin stock');
    expect(q('button', el).disabled).toBeTrue();
  });

  it('con stock bajo el mínimo marca el producto como crítico', () => {
    const el = renderizar(<ProductoCard producto={{ ...producto, stock: 3 }} alAgregar={() => {}} />);
    expect(el.textContent).toContain('Stock crítico (3)');
  });

  it('enlaza al detalle del producto', () => {
    const el = renderizar(<ProductoCard producto={producto} alAgregar={() => {}} />);
    expect(q('a', el).getAttribute('href')).toBe('/productos/HM001');
  });
});
