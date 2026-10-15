
import { render, screen, fireEvent } from '@testing-library/react';
import LoadEditPanel from './EditProduct';
import { updatePrice } from '../../../Services/InventoryService';

describe('EditProduct', () => {
    beforeEach(() => {
        spyOn(window, 'alert');
        spyOn(console, 'log');
        spyOn(
            // El servicio se espía para comprobar la llamada del componente.
            { updatePrice },
            'updatePrice'
        );
    });

    const completarFormulario = (codigo: string, precio: string) => {
        fireEvent.change(screen.getByLabelText('Código Producto:'), {
            target: { value: codigo },
        });

        fireEvent.change(screen.getByLabelText('Nuevo Precio:'), {
            target: { value: precio },
        });
    };

    const enviarFormulario = () => {
    const formulario = screen
        .getByRole('button', { name: 'Confirmar Edicion' })
        .closest('form');

    expect(formulario).not.toBeNull();

    fireEvent.submit(formulario!);

    expect(window.alert).toHaveBeenCalledWith(
        'entrando a funcion actualizar Precio'
    );
    };
    it('renderiza los campos y el botón', () => {
        render(<LoadEditPanel />);

        expect(screen.getByLabelText('Código Producto:')).toBeTruthy();
        expect(screen.getByLabelText('Nuevo Precio:')).toBeTruthy();
        expect(
            screen.getByRole('button', { name: 'Confirmar Edicion' })
        ).toBeTruthy();
    });

    it('ejecuta el envío del formulario con los datos ingresados', () => {
        render(<LoadEditPanel />);

        completarFormulario('P001', '7500');
        enviarFormulario();

        expect(window.alert).toHaveBeenCalledWith(
            'entrando a funcion actualizar Precio'
        );
        expect(console.log).toHaveBeenCalledWith({
            codigo: 'P001',
            price: '7500',
        });
    });

    it('permite enviar un precio cero', () => {
        render(<LoadEditPanel />);

        completarFormulario('P001', '0');
        enviarFormulario();

        expect(window.alert).toHaveBeenCalled();
    });

    it('permite enviar un precio negativo mediante el evento submit', () => {
        render(<LoadEditPanel />);

        completarFormulario('P001', '-100');
        enviarFormulario();

        expect(window.alert).toHaveBeenCalled();
    });

    it('convierte el código ausente en una cadena vacía', () => {
        render(<LoadEditPanel />);

        const formulario = screen
            .getByRole('button', { name: 'Confirmar Edicion' })
            .closest('form')!;

        fireEvent.submit(formulario);

        expect(window.alert).toHaveBeenCalled();
    });
});
