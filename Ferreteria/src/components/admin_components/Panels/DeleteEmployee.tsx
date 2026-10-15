import React, { useState } from 'react';

interface DeleteEmployeeProps {
    empleados: any[];
    onEliminar: (rut: string) => void;
}

export default function DeleteEmployee({ empleados, onEliminar }: DeleteEmployeeProps) {
    const [rutSeleccionado, setRutSeleccionado] = useState('');
    const [empleado, setEmpleado] = useState({
        rut: '', nombre: '', cargo: '', telefono: '', correo: '', estado: ''
    });

    const [empleadoEncontrado, setEmpleadoEncontrado] = useState(false);
    const [mostrarModal, setMostrarModal] = useState(false);

    const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rutBuscado = e.target.value;
        setRutSeleccionado(rutBuscado);


        const match = empleados?.find(emp => emp.rut === rutBuscado);
        if (match) {
            setEmpleado(match);
            setEmpleadoEncontrado(true);
        } else {
            setEmpleado({ rut: '', nombre: '', cargo: '', telefono: '', correo: '', estado: '' });
            setEmpleadoEncontrado(false);
        }
    };

    const confirmarEliminacion = () => {
        if (empleado.rut) {
            onEliminar(empleado.rut);
            alert(`¡El empleado ${empleado.nombre} ha sido eliminado del sistema!`);
        }
        setRutSeleccionado('');
        setEmpleado({ rut: '', nombre: '', cargo: '', telefono: '', correo: '', estado: '' });
        setEmpleadoEncontrado(false);
        setMostrarModal(false);
    };

    return (
        <div className="inventory-module">
            <h1>Eliminar Empleado</h1>

            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
                <label htmlFor="buscador"><strong>Buscar empleado a eliminar por RUT:</strong></label>
                <input
                    type="text"
                    id="buscador"
                    list="lista-ruts-eliminar"
                    value={rutSeleccionado}
                    onChange={handleSelectChange}
                    placeholder="Escriba o seleccione un RUT..."
                    style={{ width: '100%', padding: '10px', marginTop: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />

                <datalist id="lista-ruts-eliminar">

                    {empleados?.map((emp: any) => (
                        <option key={emp.rut} value={emp.rut}>
                            {emp.nombre} - {emp.cargo}
                        </option>
                    ))}
                </datalist>
            </div>

            {empleadoEncontrado && (
                <div style={{ padding: '20px', border: '1px solid #ffcdd2', backgroundColor: '#ffebee', borderRadius: '5px' }}>
                    <h3 style={{ color: '#d32f2f', marginTop: 0 }}>⚠️ Precaución: Está a punto de eliminar a este empleado</h3>
                    <p><strong>Nombre:</strong> {empleado.nombre}</p>
                    <p><strong>RUT:</strong> {empleado.rut}</p>
                    <p><strong>Cargo:</strong> {empleado.cargo}</p>
                    <p><strong>Correo:</strong> {empleado.correo}</p>

                    <button
                        type="button"
                        onClick={() => setMostrarModal(true)}
                        className="btn-cancelar"
                        style={{ marginTop: '15px', width: '100%' }}
                    >
                        Eliminar Definitivamente
                    </button>
                </div>
            )}

            {mostrarModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 style={{ color: '#d32f2f' }}>Confirmación de Eliminación</h3>
                        <p>¿Estás ABSOLUTAMENTE seguro de que deseas eliminar a <strong>{empleado.nombre}</strong>?</p>
                        <p style={{ fontSize: '12px', color: '#666' }}>Esta acción no se puede deshacer.</p>
                        <div className="modal-botones">
                            <button type="button" onClick={confirmarEliminacion} className="btn-cancelar">Sí, Eliminar</button>
                            <button type="button" onClick={() => setMostrarModal(false)} className="btn-aceptar" style={{ backgroundColor: '#777' }}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}