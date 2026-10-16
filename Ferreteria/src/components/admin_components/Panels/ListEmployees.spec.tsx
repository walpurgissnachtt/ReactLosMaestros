
import { render, screen } from '@testing-library/react';
import ListEmployees from './ListEmployees';
import { EmployeeTableHeads } from '../Constants';

describe('ListEmployees', () => {
    const empleados = [
        {
            rut: '12.345.678-9',
            nombre: 'Juan Pérez',
            cargo: 'Administrador',
            correo: 'juan@example.com',
            telefono: '912345678',
            estado: 'Activo',
        },
        {
            rut: '98.765.432-1',
            nombre: 'María González',
            cargo: 'Vendedora',
            correo: 'maria@example.com',
            telefono: '987654321',
            estado: 'Inactivo',
        },
    ];

    it('debe renderizar el título', () => {
        render(<ListEmployees data={empleados} />);

        expect(
            screen.getByRole('heading', {
                name: 'Lista de Empleados',
            })
        ).toBeTruthy();
    });

    it('debe mostrar un mensaje cuando data está vacío', () => {
        const { container } = render(<ListEmployees data={[]} />);

        expect(
            screen.getByText(
                'No hay empleados registrados en el sistema.'
            )
        ).toBeTruthy();

        expect(
            container.querySelector('table')
        ).toBeNull();
    });

    it('debe mostrar el mensaje cuando data es null', () => {
        render(
            <ListEmployees data={null as unknown as any[]} />
        );

        expect(
            screen.getByText(
                'No hay empleados registrados en el sistema.'
            )
        ).toBeTruthy();
    });

    it('debe mostrar el mensaje cuando data es undefined', () => {
        render(
            <ListEmployees data={undefined as unknown as any[]} />
        );

        expect(
            screen.getByText(
                'No hay empleados registrados en el sistema.'
            )
        ).toBeTruthy();
    });

    it('debe renderizar la tabla cuando existen empleados', () => {
        render(<ListEmployees data={empleados} />);

        expect(screen.getByRole('table')).toBeTruthy();
        expect(screen.getAllByRole('row').length).toBe(3);
    });

    it('debe mostrar todos los encabezados definidos en EmployeeTableHeads', () => {
        render(<ListEmployees data={empleados} />);

        Object.values(EmployeeTableHeads).forEach((encabezado) => {
            expect(
                screen.getByRole('columnheader', {
                    name: encabezado,
                })
            ).toBeTruthy();
        });
    });

    it('debe mostrar todos los campos del primer empleado', () => {
        render(<ListEmployees data={empleados} />);

        expect(screen.getByText('12.345.678-9')).toBeTruthy();
        expect(screen.getByText('Juan Pérez')).toBeTruthy();
        expect(screen.getByText('Administrador')).toBeTruthy();
        expect(screen.getByText('juan@example.com')).toBeTruthy();
        expect(screen.getByText('912345678')).toBeTruthy();
        expect(screen.getByText('Activo')).toBeTruthy();
    });

    it('debe mostrar todos los campos del segundo empleado', () => {
        render(<ListEmployees data={empleados} />);

        expect(screen.getByText('98.765.432-1')).toBeTruthy();
        expect(screen.getByText('María González')).toBeTruthy();
        expect(screen.getByText('Vendedora')).toBeTruthy();
        expect(screen.getByText('maria@example.com')).toBeTruthy();
        expect(screen.getByText('987654321')).toBeTruthy();
        expect(screen.getByText('Inactivo')).toBeTruthy();
    });

    it('debe renderizar una fila por cada empleado', () => {
        render(<ListEmployees data={empleados} />);

        const filas = screen.getAllByRole('row');

        // Una fila de encabezados y dos filas de empleados.
        expect(filas.length).toBe(3);
        expect(filas[1].textContent).toContain('Juan Pérez');
        expect(filas[2].textContent).toContain('María González');
    });

    it('debe renderizar empleados aunque no tengan RUT', () => {
        const empleadosSinRut = [
            {
                nombre: 'Pedro Soto',
                cargo: 'Bodeguero',
                correo: 'pedro@example.com',
                telefono: '911111111',
                estado: 'Activo',
            },
        ];

        render(<ListEmployees data={empleadosSinRut} />);

        expect(screen.getByText('Pedro Soto')).toBeTruthy();
        expect(screen.getByText('Bodeguero')).toBeTruthy();
        expect(screen.getByText('pedro@example.com')).toBeTruthy();
    });

    it('debe mostrar valores vacíos si los campos del empleado están ausentes', () => {
        const empleadosIncompletos = [{}];

        render(<ListEmployees data={empleadosIncompletos} />);

        expect(screen.getByRole('table')).toBeTruthy();
        expect(screen.getAllByRole('row').length).toBe(2);
    });

    it('debe aplicar las clases CSS esperadas', () => {
        const { container } = render(
            <ListEmployees data={empleados} />
        );

        expect(
            container.querySelector('.inventory-module.table-container')
        ).not.toBeNull();

        expect(
            container.querySelector('.table.table-scroll-container')
        ).not.toBeNull();

        expect(
            container.querySelector('table.inventory-table')
        ).not.toBeNull();
    });
});
