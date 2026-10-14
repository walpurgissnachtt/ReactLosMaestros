import React, { useState } from "react";
import { SwitchPanel } from "./Panels/SwtichPanel";
import SideBar from "./SideBar";
import './dashboard.css';
import martilloIcon from './assets/martillo.jpg';
import {employees} from "./Constants.ts";

export default function Dashboard() {
    const [currentTab, setActiveTab] = useState('');

    const [listaEmpleados, setListaEmpleados] = useState<any[]>(employees);

    const manejarNuevoEmpleado = (nuevoEmpleado: any) => {

        setListaEmpleados((prevLista) => [...prevLista, nuevoEmpleado]);
    };

    const manejarEditarEmpleado = (empleadoEditado: any) => {
        setListaEmpleados((prevLista) =>

            prevLista.map((emp) => emp.rut === empleadoEditado.rut ? empleadoEditado : emp)
        );
    };
    const manejarEliminarEmpleado = (rutAEliminar: string) => {
        setListaEmpleados((prevLista) =>

            prevLista.filter((emp) => emp.rut !== rutAEliminar)
        );
    };

    return (
        <div className="app-container">
            <SideBar
                title={"Panel admin"}
                logo={martilloIcon}
                onSelectOption={(tab) => setActiveTab(tab)}
            />
            <div id="option-selected-container">

                <SwitchPanel
                    id={currentTab}
                    empleados={listaEmpleados}
                    onAgregarEmpleado={manejarNuevoEmpleado}
                    onEditarEmpleado={manejarEditarEmpleado}
                    onEliminarEmpleado={manejarEliminarEmpleado}
                />
            </div>
        </div>
    );
}
