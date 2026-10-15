
import { render, screen, fireEvent } from '@testing-library/react';
import EditEmployee from './EditarEmpleado';

describe('EditEmployee', () => {
  let onActualizar: jasmine.Spy;
  let empleados: any[];

  const empleadoBase = {
    rut: '12345678-9',
    nombre: 'Juan Pérez',
    cargo: 'Vendedor',
    telefono: '987654321',
    correo: 'juan@empresa.cl',
    estado: 'Activo'
  };

  const buscarRut = (rut: string) => {
    fireEvent.change(
      screen.getByPlaceholderText('Escriba o seleccione un RUT...'),
      { target: { value: rut } }
    );
  };

  const editarCampo = (label: string, value: string) => {
    fireEvent.change(screen.getByLabelText(label), {
      target: { value }
    });
  };

  const enviarFormulario = () => {
    fireEvent.submit(
      screen.getByRole('button', { name: 'Guardar Cambios' }).closest('form')!
    );
  };

  beforeEach(() => {
    onActualizar = jasmine.createSpy('onActualizar');
    empleados = [{ ...empleadoBase }];

    spyOn(window, 'alert');

    render(
      <EditEmployee
        empleados={empleados}
        onActualizar={onActualizar}
      />
    );
  });

  it('renderiza el título y el buscador', () => {
    expect(screen.getByText('Editar Empleado')).toBeTruthy();
    expect(screen.getByLabelText('Buscar empleado por RUT:')).toBeTruthy();
    expect(
      screen.getByPlaceholderText('Escriba o seleccione un RUT...')
    ).toBeTruthy();
  });

  it('muestra los RUT disponibles en el datalist', () => {
    const datalist = document.getElementById('lista-ruts');

    expect(datalist).toBeTruthy();
    expect(datalist!.querySelector('option')?.value).toBe('12345678-9');
  });

  it('muestra el formulario al encontrar un empleado', () => {
    buscarRut('12345678-9');

    expect(screen.getByLabelText('RUT (No modificable)')).toBeTruthy();
    expect((screen.getByLabelText('RUT (No modificable)') as HTMLInputElement).value)
      .toBe('12345678-9');
    expect((screen.getByLabelText('Nombre Completo') as HTMLInputElement).value)
      .toBe('Juan Pérez');
    expect((screen.getByLabelText('Cargo') as HTMLInputElement).value)
      .toBe('Vendedor');
  });

  it('mantiene el RUT deshabilitado para edición', () => {
    buscarRut('12345678-9');

    expect(
      (screen.getByLabelText('RUT (No modificable)') as HTMLInputElement).disabled
    ).toBe(true);
  });

  it('oculta el formulario cuando el RUT no existe', () => {
    buscarRut('11111111-1');

    expect(screen.queryByLabelText('Nombre Completo')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Guardar Cambios' })).toBeNull();
  });

  it('limpia los campos al pasar de un RUT válido a uno inexistente', () => {
    buscarRut('12345678-9');
    expect(screen.getByLabelText('Nombre Completo')).toBeTruthy();

    buscarRut('11111111-1');

    expect(screen.queryByLabelText('Nombre Completo')).toBeNull();
  });

  it('permite modificar los campos del empleado', () => {
    buscarRut('12345678-9');

    editarCampo('Nombre Completo', 'María Soto');
    editarCampo('Cargo', 'Supervisora');
    editarCampo('Teléfono', '912345678');
    editarCampo('Correo Electrónico', 'maria@empresa.cl');
    editarCampo('Estado', 'Inactivo');

    expect((screen.getByLabelText('Nombre Completo') as HTMLInputElement).value)
      .toBe('María Soto');
    expect((screen.getByLabelText('Cargo') as HTMLInputElement).value)
      .toBe('Supervisora');
    expect((screen.getByLabelText('Teléfono') as HTMLInputElement).value)
      .toBe('912345678');
    expect((screen.getByLabelText('Correo Electrónico') as HTMLInputElement).value)
      .toBe('maria@empresa.cl');
    expect((screen.getByLabelText('Estado') as HTMLSelectElement).value)
      .toBe('Inactivo');
  });

  it('rechaza un nombre vacío', () => {
    buscarRut('12345678-9');
    editarCampo('Nombre Completo', '');

    enviarFormulario();

    expect(window.alert).toHaveBeenCalledWith('Error: Nombre inválido.');
    expect(screen.queryByText('Confirmación')).toBeNull();
  });

  it('rechaza un nombre con números', () => {
    buscarRut('12345678-9');
    editarCampo('Nombre Completo', 'Juan123');

    enviarFormulario();

    expect(window.alert).toHaveBeenCalledWith('Error: Nombre inválido.');
  });

  it('rechaza un nombre con caracteres especiales no permitidos', () => {
    buscarRut('12345678-9');
    editarCampo('Nombre Completo', 'Juan-Pérez');

    enviarFormulario();

    expect(window.alert).toHaveBeenCalledWith('Error: Nombre inválido.');
  });

  it('rechaza un teléfono con menos de nueve dígitos', () => {
    buscarRut('12345678-9');
    editarCampo('Teléfono', '12345');

    enviarFormulario();

    expect(window.alert).toHaveBeenCalledWith('Error: Teléfono inválido.');
  });

  it('rechaza un teléfono con letras', () => {
    buscarRut('12345678-9');
    editarCampo('Teléfono', '12345678a');

    enviarFormulario();

    expect(window.alert).toHaveBeenCalledWith('Error: Teléfono inválido.');
  });

  it('rechaza un correo inválido', () => {
    buscarRut('12345678-9');
    editarCampo('Correo Electrónico', 'correo-invalido');

    enviarFormulario();

    expect(window.alert).toHaveBeenCalledWith('Error: Correo inválido.');
  });

  it('abre el modal con datos válidos', () => {
    buscarRut('12345678-9');
    editarCampo('Nombre Completo', 'María Soto');

    enviarFormulario();

    expect(screen.getByText('Confirmación')).toBeTruthy();
    expect(screen.getByText(/María Soto/)).toBeTruthy();
    expect(onActualizar).not.toHaveBeenCalled();
  });

  it('actualiza el empleado al confirmar', () => {
    buscarRut('12345678-9');

    editarCampo('Nombre Completo', 'María Soto');
    editarCampo('Cargo', 'Supervisora');
    editarCampo('Teléfono', '912345678');
    editarCampo('Correo Electrónico', 'maria@empresa.cl');
    editarCampo('Estado', 'Inactivo');

    enviarFormulario();

    fireEvent.click(screen.getByRole('button', { name: 'Aceptar' }));

    expect(onActualizar).toHaveBeenCalledWith({
      rut: '12345678-9',
      nombre: 'María Soto',
      cargo: 'Supervisora',
      telefono: '912345678',
      correo: 'maria@empresa.cl',
      estado: 'Inactivo'
    });

    expect(window.alert).toHaveBeenCalledWith(
      '¡El empleado María Soto ha sido actualizado con éxito!'
    );

    expect(screen.queryByText('Confirmación')).toBeNull();
    expect(screen.queryByLabelText('Nombre Completo')).toBeNull();

    expect(
      (screen.getByPlaceholderText(
        'Escriba o seleccione un RUT...'
      ) as HTMLInputElement).value
    ).toBe('');
  });

  it('cierra el modal al cancelar sin actualizar', () => {
    buscarRut('12345678-9');
    enviarFormulario();

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(screen.queryByText('Confirmación')).toBeNull();
    expect(onActualizar).not.toHaveBeenCalled();
    expect(window.alert).not.toHaveBeenCalled();

    // Cancelar no descarta los datos editados.
    expect(screen.getByLabelText('Nombre Completo')).toBeTruthy();
  });

  it('permite confirmar una actualización sin cambiar los datos originales', () => {
    buscarRut('12345678-9');
    enviarFormulario();

    fireEvent.click(screen.getByRole('button', { name: 'Aceptar' }));

    expect(onActualizar).toHaveBeenCalledWith(empleadoBase);
  });
});
