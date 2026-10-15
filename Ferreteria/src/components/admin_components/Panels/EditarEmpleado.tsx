import React, { useState } from 'react';

interface EditEmployeeProps {
    empleados: any[];
    onActualizar: (empleado: any) => void;
}

export default function EditEmployee({ empleados, onActualizar }: EditEmployeeProps) {
    const [rutSeleccionado, setRutSeleccionado] = useState('');
    const [empleado, setEmpleado] = useState({
        rut: '', nombre: '', cargo: '', telefono: '', correo: '', estado: ''
    });
    const [mostrarModal, setMostrarModal] = useState(false);


    const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rutBuscado = e.target.value;
        setRutSeleccionado(rutBuscado);


        const empleadoEncontrado = empleados.find(emp => emp.rut === rutBuscado);

        if (empleadoEncontrado) {
            setEmpleado(empleadoEncontrado);
        } else {

            setEmpleado({ rut: '', nombre: '', cargo: '', telefono: '', correo: '', estado: '' });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEmpleado({ ...empleado, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        const regexTelefono = /^\d{9}$/;
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regexNombre.test(empleado.nombre)) return alert("Error: Nombre inválido.");
        if (!regexTelefono.test(empleado.telefono)) return alert("Error: Teléfono inválido.");
        if (!regexCorreo.test(empleado.correo)) return alert("Error: Correo inválido.");

        setMostrarModal(true);
    };

    const confirmarGuardado = () => {
        onActualizar(empleado);
        alert(`¡El empleado ${empleado.nombre} ha sido actualizado con éxito!`);
        setRutSeleccionado('');
        setEmpleado({ rut: '', nombre: '', cargo: '', telefono: '', correo: '', estado: '' });
        setMostrarModal(false);
    };

    return (
        <div className="inventory-module">
            <h1>Editar Empleado</h1>

            {/* 2. NUEVO BUSCADOR CON DATALIST (AUTOCOMPLETADO) */}
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
                <label htmlFor="buscador"><strong>Buscar empleado por RUT:</strong></label>


                <input
                    type="text"
                    id="buscador"
                    list="lista-ruts"
                    value={rutSeleccionado}
                    onChange={handleSelectChange}
                    placeholder="Escriba o seleccione un RUT..."
                    style={{ width: '100%', padding: '10px', marginTop: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />


                <datalist id="lista-ruts">
                    {empleados.map(emp => (
                        <option key={emp.rut} value={emp.rut}>
                            {emp.nombre} - {emp.cargo}
                        </option>
                    ))}
                </datalist>
            </div>


            {empleado.rut && (
                <form onSubmit={handleSubmit} noValidate>
                    <label htmlFor="rut">RUT (No modificable)</label>
                    <input type="text" id="rut" name="rut" value={empleado.rut} disabled />

                    <label htmlFor="nombre">Nombre Completo</label>
                    <input type="text" id="nombre" name="nombre" value={empleado.nombre} onChange={handleChange} required />

                    <label htmlFor="cargo">Cargo</label>
                    <input type="text" id="cargo" name="cargo" value={empleado.cargo} onChange={handleChange} required />

                    <label htmlFor="telefono">Teléfono</label>
                    <input type="text" id="telefono" name="telefono" value={empleado.telefono} onChange={handleChange} required />

                    <label htmlFor="correo">Correo Electrónico</label>
                    <input type="email" id="correo" name="correo" value={empleado.correo} onChange={handleChange} required />

                    <label htmlFor="estado">Estado</label>
                    <select id="estado" name="estado" value={empleado.estado} onChange={handleChange} required>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>

                    <button type="submit" id="btn-guardar-empleado">Guardar Cambios</button>
                </form>
            )}


            {mostrarModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Confirmación</h3>
                        <p>¿Estás seguro de que deseas guardar los cambios de <strong>{empleado.nombre}</strong>?</p>
                        <div className="modal-botones">
                            <button type="button" onClick={confirmarGuardado} className="btn-aceptar">Aceptar</button>
                            <button type="button" onClick={() => setMostrarModal(false)} className="btn-cancelar">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}