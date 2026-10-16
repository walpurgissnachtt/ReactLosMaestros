
import { render, screen, fireEvent } from '@testing-library/react';
import DeleteEmployee from './DeleteEmployee';

describe('DeleteEmployee', () => {
  let onEliminar: jasmine.Spy;
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

  beforeEach(() => {
    onEliminar = jasmine.createSpy('onEliminar');
    empleados = [{ ...empleadoBase }];

    spyOn(window, 'alert');

    render(
      <DeleteEmployee
        empleados={empleados}
        onEliminar={onEliminar}
      />
    );
  });

  it('renderiza el título y el campo de búsqueda', () => {
    expect(screen.getByText('Eliminar Empleado')).toBeTruthy();
    expect(
      screen.getByLabelText('Buscar empleado a eliminar por RUT:')
    ).toBeTruthy();
  });

  it('muestra los RUT disponibles en el datalist', () => {
    const datalist = document.getElementById('lista-ruts-eliminar');

    expect(datalist).toBeTruthy();
    expect(datalist!.querySelector('option')?.value).toBe('12345678-9');
  });

  it('muestra los datos del empleado cuando encuentra el RUT', () => {
    buscarRut('12345678-9');

    expect(screen.getByText('Nombre:').parentElement?.textContent)
      .toContain('Juan Pérez');
    expect(screen.getByText('RUT:').parentElement?.textContent)
      .toContain('12345678-9');
    expect(screen.getByText('Cargo:').parentElement?.textContent)
      .toContain('Vendedor');
    expect(screen.getByText('Correo:').parentElement?.textContent)
      .toContain('juan@empresa.cl');

    expect(
      screen.getByRole('button', { name: 'Eliminar Definitivamente' })
    ).toBeTruthy();
  });

  it('no muestra los datos cuando el RUT no existe', () => {
    buscarRut('11111111-1');

    expect(
      screen.queryByRole('button', { name: 'Eliminar Definitivamente' })
    ).toBeNull();

    expect(screen.queryByText('Confirmación de Eliminación')).toBeNull();
  });

  it('limpia los datos encontrados al buscar otro RUT inexistente', () => {
    buscarRut('12345678-9');
    expect(screen.getByText('Juan Pérez')).toBeTruthy();

    buscarRut('11111111-1');

    expect(screen.queryByText('Juan Pérez')).toBeNull();
    expect(
      screen.queryByRole('button', { name: 'Eliminar Definitivamente' })
    ).toBeNull();
  });

  it('permite buscar cuando la lista de empleados está vacía', () => {
    // Esta instancia se monta sin empleados para cubrir la rama sin coincidencias.
    const { container } = render(
      <DeleteEmployee empleados={[]} onEliminar={onEliminar} />
    );

    fireEvent.change(
      container.querySelector('#buscador') as HTMLInputElement,
      { target: { value: '12345678-9' } }
    );

    expect(
      container.querySelector('.modal-overlay')
    ).toBeNull();
    expect(onEliminar).not.toHaveBeenCalled();
  });

it('abre el modal al pulsar Eliminar Definitivamente', () => {
    const onEliminar = jasmine.createSpy('onEliminar');

    const { container } = render(
        <DeleteEmployee
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
            onEliminar={onEliminar}
        />
    );

    const input = container.querySelector('input');

    expect(input).not.toBeNull();

    fireEvent.change(input!, {
        target: { value: '12345678-9' },
    });

    fireEvent.click(
        screen.getByRole('button', {
            name: /eliminar definitivamente/i,
        })
    );

    expect(
        screen.getByRole('button', { name: /sí, eliminar/i })
    ).toBeTruthy();

    expect(
        screen.getByRole('button', { name: /cancelar/i })
    ).toBeTruthy();

    expect(onEliminar).not.toHaveBeenCalled();
});

  it('elimina al empleado cuando se confirma', () => {
    buscarRut('12345678-9');

    fireEvent.click(
      screen.getByRole('button', { name: 'Eliminar Definitivamente' })
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Sí, Eliminar' })
    );

    expect(onEliminar).toHaveBeenCalledWith('12345678-9');
    expect(window.alert).toHaveBeenCalledWith(
      '¡El empleado Juan Pérez ha sido eliminado del sistema!'
    );

    expect(screen.queryByText('Confirmación de Eliminación')).toBeNull();
    expect(
      screen.queryByRole('button', { name: 'Eliminar Definitivamente' })
    ).toBeNull();

    expect(
      (screen.getByPlaceholderText(
        'Escriba o seleccione un RUT...'
      ) as HTMLInputElement).value
    ).toBe('');
  });

  it('cierra el modal al cancelar sin eliminar', () => {
    buscarRut('12345678-9');

    fireEvent.click(
      screen.getByRole('button', { name: 'Eliminar Definitivamente' })
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Cancelar' })
    );

    expect(screen.queryByText('Confirmación de Eliminación')).toBeNull();
    expect(onEliminar).not.toHaveBeenCalled();
    expect(window.alert).not.toHaveBeenCalled();

    // El empleado continúa seleccionado y sus datos siguen visibles.
    expect(screen.getByText('Juan Pérez')).toBeTruthy();
  });

  it('limpia el estado al confirmar sin un empleado seleccionado', () => {
    // Cubre la rama en que empleado.rut es falsy.
    // Se simula una entrada en el estado de búsqueda que no coincide.
    buscarRut('11111111-1');

    expect(
      screen.queryByRole('button', { name: 'Eliminar Definitivamente' })
    ).toBeNull();

    expect(onEliminar).not.toHaveBeenCalled();
  });

  it('actualiza la búsqueda al seleccionar un RUT diferente', () => {
    empleados.push({
      rut: '87654321-K',
      nombre: 'María Soto',
      cargo: 'Supervisora',
      telefono: '912345678',
      correo: 'maria@empresa.cl',
      estado: 'Activo'
    });

    // Renderiza una instancia con ambos empleados.
    const { container } = render(
      <DeleteEmployee empleados={empleados} onEliminar={onEliminar} />
    );

    fireEvent.change(container.querySelector('#buscador') as HTMLInputElement, {
      target: { value: '87654321-K' }
    });

    expect(container.textContent).toContain('María Soto');
    expect(container.textContent).toContain('Supervisora');
    expect(onEliminar).not.toHaveBeenCalled();
  });
});
