
import { render, screen, fireEvent } from '@testing-library/react';
import LoadAddProductPanel from './AddProduct';

describe('AddProductPanel', () => {
  beforeEach(() => {
    localStorage.clear();
    spyOn(window, 'alert');
    spyOn(console, 'log');
  });

  const completarFormulario = (overrides: Record<string, string> = {}) => {
    const datos = {
      codigo: 'MC011',
      nombre: 'Cemento Especial',
      categoria: 'Construcción',
      marca: 'Acme',
      precioVenta: '6500',
      stock: '50',
      ...overrides
    };

    fireEvent.change(screen.getByPlaceholderText('Ej: MC011'), {
      target: { value: datos.codigo }
    });
    fireEvent.change(screen.getByPlaceholderText('Ej: Cemento Especial'), {
      target: { value: datos.nombre }
    });
    fireEvent.change(screen.getByPlaceholderText('Ej: Mat. Construcción'), {
      target: { value: datos.categoria }
    });
    fireEvent.change(screen.getByPlaceholderText('Ej: Marca...'), {
      target: { value: datos.marca }
    });
    fireEvent.change(screen.getByPlaceholderText('Ej: 6500'), {
      target: { value: datos.precioVenta }
    });
    fireEvent.change(screen.getByPlaceholderText('Ej: 50'), {
      target: { value: datos.stock }
    });

    return datos;
  };

  const enviarFormulario = () => {
    fireEvent.submit(
      document.getElementById('form-add-product') as HTMLFormElement
    );
  };

  it('renderiza el título, los campos y el botón', () => {
    render(<LoadAddProductPanel />);

    expect(screen.getByText('Agregar Producto')).toBeTruthy();
    expect(screen.getByPlaceholderText('Ej: MC011')).toBeTruthy();
    expect(screen.getByPlaceholderText('Ej: Cemento Especial')).toBeTruthy();
    expect(screen.getByPlaceholderText('Ej: Mat. Construcción')).toBeTruthy();
    expect(screen.getByPlaceholderText('Ej: Marca...')).toBeTruthy();
    expect(screen.getByPlaceholderText('Ej: 6500')).toBeTruthy();
    expect(screen.getByPlaceholderText('Ej: 50')).toBeTruthy();

    expect(
      screen.getByRole('button', { name: 'Guardar Producto' })
    ).toBeTruthy();
  });

  it('agrega un producto válido al inventario', () => {
    render(<LoadAddProductPanel />);
    const datos = completarFormulario();

    enviarFormulario();

    const productos = JSON.parse(localStorage.getItem('prod')!);

    expect(productos.length).toBe(1);
    expect(productos[0]).toEqual({
      codigo: datos.codigo,
      nombre: datos.nombre,
      categoria: datos.categoria,
      marca: datos.marca,
      precioVenta: 6500,
      stock: 50
    });

    expect(window.alert).toHaveBeenCalledWith(
      'entrando a funcion add producto'
    );
    expect(window.alert).toHaveBeenCalledWith(
      'saliendo funcion add producto'
    );
    expect(console.log).toHaveBeenCalled();
  });

  it('convierte precio y stock a números', () => {
    render(<LoadAddProductPanel />);
    completarFormulario({
      precioVenta: '1234',
      stock: '7'
    });

    enviarFormulario();

    const productos = JSON.parse(localStorage.getItem('prod')!);

    expect(typeof productos[0].precioVenta).toBe('number');
    expect(typeof productos[0].stock).toBe('number');
    expect(productos[0].precioVenta).toBe(1234);
    expect(productos[0].stock).toBe(7);
  });

  it('conserva los productos existentes', () => {
    localStorage.setItem('prod', JSON.stringify([
      {
        codigo: 'P001',
        categoria: 'Herramientas',
        nombre: 'Martillo',
        marca: 'Acme',
        precioVenta: 5000,
        stock: 10
      }
    ]));

    render(<LoadAddProductPanel />);
    completarFormulario({ codigo: 'P002' });

    enviarFormulario();

    const productos = JSON.parse(localStorage.getItem('prod')!);

    expect(productos.length).toBe(2);
    expect(productos[0].codigo).toBe('P001');
    expect(productos[1].codigo).toBe('P002');
  });

  it('muestra las alertas de inicio y fin al enviar el formulario', () => {
    render(<LoadAddProductPanel />);
    completarFormulario();

    enviarFormulario();

    expect(window.alert).toHaveBeenCalledWith(
      'entrando a funcion add producto'
    );
    expect(window.alert).toHaveBeenCalledWith(
      'saliendo funcion add producto'
    );
  });

  it('permite enviar un producto con precio cero', () => {
    render(<LoadAddProductPanel />);
    completarFormulario({ precioVenta: '0' });

    enviarFormulario();

    const productos = JSON.parse(localStorage.getItem('prod')!);
    expect(productos[0].precioVenta).toBe(0);
  });

  it('permite enviar un producto con stock -1', () => {
    render(<LoadAddProductPanel />);
    completarFormulario({ stock: '-1' });

    enviarFormulario();

    const productos = JSON.parse(localStorage.getItem('prod')!);
    expect(productos[0].stock).toBe(-1);
  });
});
