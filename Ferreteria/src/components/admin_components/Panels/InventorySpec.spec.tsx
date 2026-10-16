
import { render, screen } from '@testing-library/react';
import Inventory from './Inventory';
import { TableHeads } from '../Constants';

describe('Inventory', () => {
  beforeEach(() => {
    localStorage.clear();
    spyOn(console, 'log');
  });

  it('renderiza el título del inventario', () => {
    render(<Inventory />);

    expect(screen.getByText('Inventario Productos')).toBeTruthy();
  });

  it('muestra un mensaje cuando no hay productos registrados', () => {
    render(<Inventory />);

    expect(
      screen.getByText('No hay productos registrados en el inventario.')
    ).toBeTruthy();

    expect(screen.queryByRole('table')).toBeNull();
  });

  it('muestra el mensaje cuando localStorage contiene un array vacío', () => {
    localStorage.setItem('prod', JSON.stringify([]));

    render(<Inventory />);

    expect(
      screen.getByText('No hay productos registrados en el inventario.')
    ).toBeTruthy();

    expect(screen.queryByRole('table')).toBeNull();
  });

  it('muestra la tabla cuando existe un producto', () => {
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

    render(<Inventory />);

    expect(screen.getByRole('table')).toBeTruthy();
    expect(screen.getByText('P001')).toBeTruthy();
    expect(screen.getByText('Martillo')).toBeTruthy();
    expect(screen.getByText('Herramientas')).toBeTruthy();
    expect(screen.getByText('Acme')).toBeTruthy();
    expect(screen.getByText('$ 5000')).toBeTruthy();
    expect(screen.getByText('10')).toBeTruthy();
  });

  it('renderiza todos los encabezados definidos en TableHeads', () => {
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

    render(<Inventory />);

    const encabezados = screen.getAllByRole('columnheader');
    const esperados = Object.values(TableHeads);

    expect(encabezados.length).toBe(esperados.length);

    esperados.forEach((encabezado) => {
      expect(screen.getByRole('columnheader', {
        name: encabezado
      })).toBeTruthy();
    });
  });

  it('muestra N/A cuando el producto no tiene categoría ni marca', () => {
    localStorage.setItem('prod', JSON.stringify([
      {
        codigo: 'P002',
        nombre: 'Producto sin categoría',
        precioVenta: 2500,
        stock: 5
      }
    ]));

    render(<Inventory />);

    expect(screen.getByText('Producto sin categoría')).toBeTruthy();
    expect(screen.getAllByText('N/A').length).toBe(2);
  });

  it('renderiza varios productos en filas independientes', () => {
    localStorage.setItem('prod', JSON.stringify([
      {
        codigo: 'P001',
        categoria: 'Herramientas',
        nombre: 'Martillo',
        marca: 'Acme',
        precioVenta: 5000,
        stock: 10
      },
      {
        codigo: 'P002',
        categoria: 'Construcción',
        nombre: 'Cemento',
        marca: 'OtraMarca',
        precioVenta: 8000,
        stock: 20
      }
    ]));

    render(<Inventory />);

    expect(screen.getByText('Martillo')).toBeTruthy();
    expect(screen.getByText('Cemento')).toBeTruthy();
    expect(screen.getByText('P001')).toBeTruthy();
    expect(screen.getByText('P002')).toBeTruthy();

    expect(screen.getAllByRole('row').length).toBe(3);
  });

  it('ejecuta el efecto con un inventario que contiene productos', () => {
    localStorage.setItem('prod', JSON.stringify([
      {
        codigo: 'P003',
        nombre: 'Taladro',
        categoria: 'Herramientas',
        marca: 'Acme',
        precioVenta: 15000,
        stock: 3
      }
    ]));

    render(<Inventory />);

    expect(screen.getByRole('table')).toBeTruthy();
    expect(console.log).toHaveBeenCalled();
  });
});
