import React, { useState } from 'react';


interface AddEmployeeProps {
    onGuardar: (empleado: any) => void;
    empleados: any[];
}


export default function AddEmployee({ onGuardar , empleados }: AddEmployeeProps) {

    const [empleado, setEmpleado] = useState({
        rut: '', nombre: '', cargo: '', telefono: '', correo: '', estado: ''
    });

    const [mostrarModal, setMostrarModal] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> ) => {
        const { name, value } = e.target;
        setEmpleado({ ...empleado, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const regexRut = /^\d{7,8}-[0-9Kk]$/;
        const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        const regexTelefono = /^\d{9}$/;
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regexRut.test(empleado.rut)) return alert("Error: RUT inválido.");
        if (!regexNombre.test(empleado.nombre)) return alert("Error: Nombre inválido.");
        if (!regexTelefono.test(empleado.telefono)) return alert("Error: Teléfono inválido.");
        if (!regexCorreo.test(empleado.correo)) return alert("Error: Correo inválido.");

        const rutDuplicado = empleados.some(emp => emp.rut === empleado.rut);

        if (rutDuplicado) {
            return alert(`Error: El RUT ${empleado.rut} ya se encuentra registrado en el sistema.`);
        }
        setMostrarModal(true);
    };

    const confirmarGuardado = () => {

        onGuardar(empleado);

        console.log("Nuevo empleado guardado:", empleado);
        alert(`¡El empleado ${empleado.nombre} ha sido registrado con éxito!`);
        setEmpleado({ rut: '', nombre: '', cargo: '', telefono: '', correo: '', estado: '' });

        setMostrarModal(false);
    };

    const cancelarGuardado = () => {
        setMostrarModal(false);
    };

    return (
        <div className="inventory-module">
            <h1>Agregar Nuevo Empleado</h1>

            <form onSubmit={handleSubmit} noValidate>
                <label htmlFor="rut">RUT</label>
                <input type="text" id="rut" name="rut" value={empleado.rut} onChange={handleChange} required />

                <label htmlFor="nombre">Nombre Completo</label>
                <input type="text" id="nombre" name="nombre" value={empleado.nombre} onChange={handleChange} required />

                <label htmlFor="cargo">Cargo</label>
                <input
                    type="text"
                    id="cargo"
                    name="cargo"
                    value={empleado.cargo}
                    onChange={handleChange}
                    placeholder="Ej: Vendedor, Supervisor..."
                    required
                />

                <label htmlFor="telefono">Teléfono</label>
                <input
                    type="text"
                    id="telefono"
                    name="telefono"
                    value={empleado.telefono}
                    onChange={handleChange}
                    placeholder="Ej: 987654321"
                    required
                />

                <label htmlFor="correo">Correo Electrónico</label>
                <input
                    type="email"
                    id="correo"
                    name="correo"
                    value={empleado.correo}
                    onChange={handleChange}
                    placeholder="Ej: correo@empresa.com"
                    required
                />

                <label htmlFor="estado">Estado</label>
                <select
                    id="estado"
                    name="estado"
                    value={empleado.estado}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Seleccione un estado...</option>
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                </select>

                <button type="submit" id="btn-guardar-empleado">
                    Guardar Empleado
                </button>
            </form>

            {mostrarModal && (
                <div className="modal-overlay" >
                    <div className="modal-content" >
                        <h3>Confirmación</h3>
                        <p>¿Estás seguro de que deseas guardar al empleado <strong>{empleado.nombre}</strong>?</p>

                        <div className="modal-botones">
                            <button type="button" onClick={confirmarGuardado} className="btn-aceptar">Aceptar</button>
                            <button type="button" onClick={cancelarGuardado} className="btn-cancelar">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

