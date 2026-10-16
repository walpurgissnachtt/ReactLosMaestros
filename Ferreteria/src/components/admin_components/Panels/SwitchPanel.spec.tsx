
import { render, screen } from '@testing-library/react';
import { SwitchPanel } from './SwtichPanel';
import { Tabs } from '../Constants';

import Inventory from './Inventory';
import ListEmployees from './ListEmployees';
import AddEmployees from './AddEmployees';
import EditEmployee from './EditarEmpleado';
import DeleteEmployee from './DeleteEmployee';
import LoadAddProductPanel from './AddProduct';
import LoadEditPanel from './EditProduct';

describe('SwitchPanel', () => {
    const empleados = [
        {
            rut: '12.345.678-9',
            nombre: 'Juan Pérez',
            cargo: 'Administrador',
            correo: 'juan@example.com',
            telefono: '912345678',
            estado: 'Activo',
        },
    ];

    const onAgregarEmpleado = jasmine.createSpy('onAgregarEmpleado');
    const onEditarEmpleado = jasmine.createSpy('onEditarEmpleado');
    const onEliminarEmpleado = jasmine.createSpy('onEliminarEmpleado');

    const props = {
        id: '',
        empleados,
        onAgregarEmpleado,
        onEditarEmpleado,
        onEliminarEmpleado,
    };

    beforeEach(() => {
        onAgregarEmpleado.calls.reset();
        onEditarEmpleado.calls.reset();
        onEliminarEmpleado.calls.reset();
    });

    it('debe renderizar Inventory para listarProductos', () => {
        const { container } = render(
            <SwitchPanel {...props} id={Tabs.listarProductos} />
        );

        expect(container.querySelector('.inventory-module')).not.toBeNull();
        expect(
            screen.getByRole('heading', { name: 'Inventario Productos' })
        ).toBeTruthy();
    });

    it('debe renderizar ListEmployees para listarEmpleados', () => {
        render(
            <SwitchPanel {...props} id={Tabs.listarEmpleados} />
        );

        expect(
            screen.getByRole('heading', { name: 'Lista de Empleados' })
        ).toBeTruthy();

        expect(screen.getByText('Juan Pérez')).toBeTruthy();
    });

    it('debe renderizar AddEmployees para empleados', () => {
        render(
            <SwitchPanel {...props} id={Tabs.empleados} />
        );

        // Verifica que se muestre el formulario de agregar empleados.
        expect(
            screen.getByRole('button', { name: /guardar/i })
        ).toBeTruthy();
    });

    it('debe renderizar EditEmployee para editarEmpleados', () => {
        render(
            <SwitchPanel {...props} id={Tabs.editarEmpleados} />
        );

        // EditEmployee permite buscar un empleado por su RUT.
        expect(
            screen.getByText(/buscar empleado/i)
        ).toBeTruthy();
    });

    it('debe renderizar DeleteEmployee para eliminarEmpleados', () => {
        render(
            <SwitchPanel {...props} id={Tabs.eliminarEmpleados} />
        );

        // DeleteEmployee permite buscar un empleado por su RUT.
        expect(
            screen.getByText(/buscar empleado/i)
        ).toBeTruthy();
    });

    it('debe renderizar LoadAddProductPanel para addProductos', () => {
        render(
            <SwitchPanel {...props} id={Tabs.addProductos} />
        );

        expect(
            screen.getByRole('button', { name: 'Guardar Producto' })
        ).toBeTruthy();
    });

    it('debe renderizar LoadEditPanel para editarProductos', () => {
        render(
            <SwitchPanel {...props} id={Tabs.editarProductos} />
        );

        expect(
            screen.getByRole('button', { name: 'Confirmar Edicion' })
        ).toBeTruthy();
    });

    it('debe retornar null cuando el id no coincide con ningún panel', () => {
        const { container } = render(
            <SwitchPanel {...props} id="panel-inexistente" />
        );

        expect(container.innerHTML).toBe('');
    });

    it('debe transmitir los empleados al panel de listado', () => {
        render(
            <SwitchPanel {...props} id={Tabs.listarEmpleados} />
        );

        expect(screen.getByText('Juan Pérez')).toBeTruthy();
        expect(screen.getByText('juan@example.com')).toBeTruthy();
    });

    it('debe permitir mostrar el panel de listado sin empleados', () => {
        render(
            <SwitchPanel
                {...props}
                id={Tabs.listarEmpleados}
                empleados={[]}
            />
        );

        expect(
            screen.getByText(
                'No hay empleados registrados en el sistema.'
            )
        ).toBeTruthy();
    });
});
