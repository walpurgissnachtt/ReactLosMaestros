
import AddProduct, { updatePrice } from './InventoryService';

type TestProduct = {
  codigo: string;
  categoria?: string;
  nombre: string;
  marca?: string;
  precioVenta: number;
  stock: number;
};

describe('InventoryService', () => {
  const crearProducto = (
    overrides: Partial<TestProduct> = {}
  ): TestProduct => ({
    codigo: 'P001',
    categoria: 'Herramientas',
    nombre: 'Martillo',
    marca: 'Acme',
    precioVenta: 5000,
    stock: 10,
    ...overrides
  });

  beforeEach(() => {
    localStorage.clear();
    spyOn(window, 'alert');
    spyOn(console, 'log');
  });

  // ==========================================
  // TESTS DE updatePrice()
  // ==========================================

  describe('updatePrice()', () => {
    it('rechaza un precio NaN', () => {
      expect(updatePrice('P001', NaN)).toBeFalsy();
    });

    it('rechaza un precio igual a cero', () => {
      expect(updatePrice('P001', 0)).toBeFalsy();
    });

    it('rechaza un precio negativo', () => {
      expect(updatePrice('P001', -100)).toBeFalsy();
    });

    it('rechaza un identificador vacío', () => {
      expect(updatePrice('', 1000)).toBeFalsy();
    });

    it('retorna false si no existe la clave prod en localStorage', () => {
      expect(updatePrice('P001', 1000)).toBeFalsy();
      expect(window.alert).toHaveBeenCalledWith(
        'saliendo de update. todo fallido 2!'
      );
    });

    it('retorna false si el producto no existe', () => {
      localStorage.setItem('prod', JSON.stringify([
        crearProducto({ codigo: 'P002' })
      ]));

      expect(updatePrice('P001', 1000)).toBeFalsy();
      expect(window.alert).toHaveBeenCalledWith(
        'saliendo de update. todo fallido!'
      );
    });

    it('actualiza el precio del producto correcto', () => {
      const productos = [
        crearProducto({ codigo: 'P001', precioVenta: 5000 }),
        crearProducto({ codigo: 'P002', precioVenta: 8000 })
      ];

      localStorage.setItem('prod', JSON.stringify(productos));

      expect(updatePrice('P001', 6500)).toBe(true);

      const resultado = JSON.parse(
        localStorage.getItem('prod')!
      );

      expect(resultado[0].precioVenta).toBe(6500);
      expect(resultado[1].precioVenta).toBe(8000);
      expect(window.alert).toHaveBeenCalledWith(
        'saliendo de update. todo completado!'
      );
    });

    it('permite actualizar el precio de un producto con precio positivo', () => {
      localStorage.setItem('prod', JSON.stringify([
        crearProducto({ precioVenta: 100 })
      ]));

      expect(updatePrice('P001', 1)).toBe(true);
    });
  });

  describe('AddProduct()', () => {
    it('agrega un producto válido cuando el inventario está vacío', () => {
      const producto = crearProducto();

      AddProduct({ product: producto });

      const resultado = JSON.parse(
        localStorage.getItem('prod')!
      );

      expect(resultado.length).toBe(1);
      expect(resultado[0]).toEqual(producto);
      expect(console.log).toHaveBeenCalled();
    });

    it('agrega un producto sin eliminar los existentes', () => {
      const existente = crearProducto({ codigo: 'P001' });
      const nuevo = crearProducto({ codigo: 'P002' });

      localStorage.setItem('prod', JSON.stringify([existente]));

      AddProduct({ product: nuevo });

      const resultado = JSON.parse(
        localStorage.getItem('prod')!
      );

      expect(resultado.length).toBe(2);
      expect(resultado[0]).toEqual(existente);
      expect(resultado[1]).toEqual(nuevo);
    });

    it('rechaza un nombre vacío', () => {
      AddProduct({
        product: crearProducto({ nombre: '' })
      });

      expect(localStorage.getItem('prod')).toBeNull();
    });

    it('rechaza una categoría vacía', () => {
      AddProduct({
        product: crearProducto({ categoria: '' })
      });

      expect(localStorage.getItem('prod')).toBeNull();
    });

    it('rechaza una marca vacía', () => {
      AddProduct({
        product: crearProducto({ marca: '' })
      });

      expect(localStorage.getItem('prod')).toBeNull();
    });

    it('rechaza un código vacío', () => {
      AddProduct({
        product: crearProducto({ codigo: '' })
      });

      expect(localStorage.getItem('prod')).toBeNull();
    });

    it('rechaza un precio NaN', () => {
      AddProduct({
        product: crearProducto({ precioVenta: NaN })
      });

      expect(localStorage.getItem('prod')).toBeNull();
    });

    it('rechaza un precio negativo', () => {
      AddProduct({
        product: crearProducto({ precioVenta: -1 })
      });

      expect(localStorage.getItem('prod')).toBeNull();
    });

    it('rechaza un stock NaN', () => {
      AddProduct({
        product: crearProducto({ stock: NaN })
      });

      expect(localStorage.getItem('prod')).toBeNull();
    });

    it('rechaza un stock inferior a -1', () => {
      AddProduct({
        product: crearProducto({ stock: -2 })
      });

      expect(localStorage.getItem('prod')).toBeNull();
    });

    it('acepta precio cero y stock -1 como valores límite', () => {
      const producto = crearProducto({
        precioVenta: 0,
        stock: -1
      });

      AddProduct({ product: producto });

      const resultado = JSON.parse(
        localStorage.getItem('prod')!
      );

      expect(resultado).toEqual([producto]);
    });

    it('inicializa un inventario vacío si prod contiene un array vacío', () => {
      localStorage.setItem('prod', JSON.stringify([]));

      const producto = crearProducto();
      AddProduct({ product: producto });

      expect(
        JSON.parse(localStorage.getItem('prod')!)
      ).toEqual([producto]);
    });

    it('maneja un JSON inválido en localStorage', () => {
      localStorage.setItem('prod', '{json inválido');

      AddProduct({ product: crearProducto() });

      expect(window.alert).toHaveBeenCalled();
    });

    it('maneja un error al guardar en localStorage', () => {
      spyOn(Storage.prototype, 'setItem').and.throwError(
        'Error de almacenamiento'
      );

      AddProduct({ product: crearProducto() });

      expect(window.alert).toHaveBeenCalled();
    });
  });
});