import React from "react";
import { EmployeeTableHeads } from "../Constants";


interface ListEmployeesProps {
    data: any[];
}


export default function ListEmployees({ data }: ListEmployeesProps) {


    if (!data || data.length === 0) {
        return (
            <div className="inventory-module table-container">
                <h1>Lista de Empleados</h1>
                <p className="no-data">No hay empleados registrados en el sistema.</p>
            </div>
        );
    }


    return (
        <div className="inventory-module table-container">
            <h1>Lista de Empleados</h1>
            <div className="table table-scroll-container">
                <table className="inventory-table">
                    <thead>
                    <tr>

                        {Object.values(EmployeeTableHeads).map((columna) => (
                            <th key={columna}>{columna}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>

                    {data.map((emp, index) => (
                        <tr key={emp.rut || index}>
                            <td><span className="cell-code">{emp.rut}</span></td>
                            <td>{emp.nombre}</td>
                            <td>{emp.cargo}</td>
                            <td>{emp.correo}</td> {/* Agregamos la columna que faltaba */}
                            <td>{emp.telefono}</td>
                            <td>{emp.estado}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}