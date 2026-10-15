import AddEmployee from './AddEmployees';
import { render, screen, fireEvent, within } from '@testing-library/react';

describe('AddEmployee', () => {
  let onGuardar: jasmine.Spy;
  let empleados: any[];
  let view: ReturnType<typeof render>;

  const completarFormulario = (
    overrides: Record<string, string> = {}
  ) => {
    const datos = {
      rut: '12345678-9',
      nombre: 'Juan Pérez',
      cargo: 'Vendedor',
      telefono: '987654321',
      correo: 'juan@empresa.cl',
      estado: 'Activo',
      ...overrides
    };

    fireEvent.change(screen.getByLabelText('RUT'), {
      target: { value: datos.rut }
    });
    fireEvent.change(screen.getByLabelText('Nombre Completo'), {
      target: { value: datos.nombre }
    });
    fireEvent.change(screen.getByLabelText('Cargo'), {
      target: { value: datos.cargo }
    });
    fireEvent.change(screen.getByLabelText('Teléfono'), {
      target: { value: datos.telefono }
    });
    fireEvent.change(screen.getByLabelText('Correo Electrónico'), {
      target: { value: datos.correo }
    });
    fireEvent.change(screen.getByLabelText('Estado'), {
      target: { value: datos.estado }
    });

    return datos;
  };

  const enviarFormulario = () => {
    fireEvent.click(
      screen.getByRole('button', { name: 'Guardar Empleado' })
    );
  };
  beforeEach(() => {
      onGuardar = jasmine.createSpy('onGuardar');
      empleados = [];

      spyOn(window, 'alert');
      spyOn(console, 'log');

      view = render(
          <AddEmployee
              onGuardar={onGuardar}
              empleados={empleados}
          />
      );
  });

  it('renderiza el formulario y sus campos', () => {
    expect(screen.getByText('Agregar Nuevo Empleado')).toBeTruthy();
    expect(screen.getByLabelText('RUT')).toBeTruthy();
    expect(screen.getByLabelText('Nombre Completo')).toBeTruthy();
    expect(screen.getByLabelText('Cargo')).toBeTruthy();
    expect(screen.getByLabelText('Teléfono')).toBeTruthy();
    expect(screen.getByLabelText('Correo Electrónico')).toBeTruthy();
    expect(screen.getByLabelText('Estado')).toBeTruthy();

    expect(
      screen.getByRole('button', { name: 'Guardar Empleado' })
    ).toBeTruthy();
  });

  it('muestra un error cuando el RUT está vacío o tiene formato inválido', () => {
    completarFormulario({ rut: '123-4' });
    enviarFormulario();

    expect(window.alert).toHaveBeenCalledWith('Error: RUT inválido.');
    expect(onGuardar).not.toHaveBeenCalled();
    expect(screen.queryByText('Confirmación')).toBeNull();
  });

  it('acepta un RUT terminado en K', () => {
    completarFormulario({ rut: '12345678-K' });
    enviarFormulario();

    expect(screen.getByText('Confirmación')).toBeTruthy();
    expect(window.alert).not.toHaveBeenCalled();
  });

  it('acepta un RUT terminado en k minúscula', () => {
    completarFormulario({ rut: '12345678-k' });
    enviarFormulario();

    expect(screen.getByText('Confirmación')).toBeTruthy();
  });

  it('rechaza un nombre con números', () => {
    completarFormulario({ nombre: 'Juan123' });
    enviarFormulario();

    expect(window.alert).toHaveBeenCalledWith(
      'Error: Nombre inválido.'
    );
  });

  it('rechaza un nombre con caracteres especiales no permitidos', () => {
    completarFormulario({ nombre: 'Juan-Pérez' });
    enviarFormulario();

    expect(window.alert).toHaveBeenCalledWith(
      'Error: Nombre inválido.'
    );
  });

  it('rechaza un teléfono que no tiene nueve dígitos', () => {
    completarFormulario({ telefono: '12345' });
    enviarFormulario();

    expect(window.alert).toHaveBeenCalledWith(
      'Error: Teléfono inválido.'
    );
  });

  it('rechaza un teléfono que contiene letras', () => {
    completarFormulario({ telefono: '12345678a' });
    enviarFormulario();

    expect(window.alert).toHaveBeenCalledWith(
      'Error: Teléfono inválido.'
    );
  });

  it('rechaza un correo sin formato válido', () => {
    completarFormulario({ correo: 'correo-invalido' });
    enviarFormulario();

    expect(window.alert).toHaveBeenCalledWith(
      'Error: Correo inválido.'
    );
  });

  it('rechaza un correo sin dominio completo', () => {
    completarFormulario({ correo: 'juan@empresa' });
    enviarFormulario();

    expect(window.alert).toHaveBeenCalledWith(
      'Error: Correo inválido.'
    );
  });


it('rechaza un RUT que ya está registrado', () => {
    view.rerender(
        <AddEmployee
            onGuardar={onGuardar}
            empleados={[
                {
                    rut: '12345678-9',
                    nombre: 'Juan Pérez',
                    cargo: 'Administrador',
                    correo: 'juan@example.com',
                    telefono: '912345678',
                    estado: 'Activo',
                },
            ]}
        />
    );

    completarFormulario({ rut: '12345678-9' });
    enviarFormulario();

    expect(window.alert).toHaveBeenCalledWith(
        'Error: El RUT 12345678-9 ya se encuentra registrado en el sistema.'
    );

    expect(onGuardar).not.toHaveBeenCalled();
    expect(screen.queryByText('Confirmación')).toBeNull();
});


it('abre el modal con datos válidos', () => {
    completarFormulario();
    enviarFormulario();

    expect(screen.getByText('Confirmación')).toBeTruthy();

    expect(
        screen.getByRole('button', { name: 'Aceptar' })
    ).toBeTruthy();

    expect(
        screen.getByRole('button', { name: 'Cancelar' })
    ).toBeTruthy();

    expect(onGuardar).not.toHaveBeenCalled();
});


  it('guarda al empleado al confirmar y limpia el formulario', () => {
    const datos = completarFormulario();
    enviarFormulario();

    fireEvent.click(screen.getByRole('button', { name: 'Aceptar' }));

    expect(onGuardar).toHaveBeenCalledWith(datos);
    expect(console.log).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith(
      '¡El empleado Juan Pérez ha sido registrado con éxito!'
    );

    expect(screen.queryByText('Confirmación')).toBeNull();
    expect((screen.getByLabelText('RUT') as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText('Nombre Completo') as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText('Cargo') as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText('Teléfono') as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText('Correo Electrónico') as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText('Estado') as HTMLSelectElement).value).toBe('');
  });

  it('cierra el modal al cancelar sin guardar', () => {
    completarFormulario();
    enviarFormulario();

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(screen.queryByText('Confirmación')).toBeNull();
    expect(onGuardar).not.toHaveBeenCalled();
    expect(window.alert).not.toHaveBeenCalled();
  });

  it('permite guardar un empleado con estado Inactivo', () => {
    const datos = completarFormulario({ estado: 'Inactivo' });
    enviarFormulario();

    fireEvent.click(screen.getByRole('button', { name: 'Aceptar' }));

    expect(onGuardar).toHaveBeenCalledWith(datos);
  });
});
