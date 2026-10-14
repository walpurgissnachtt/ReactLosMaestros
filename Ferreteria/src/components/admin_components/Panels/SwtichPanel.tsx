import Inventory from "./Inventory";
import ListEmployees from "./ListEmployees";
import AddEmployees from "./AddEmployees";
import { Tabs } from "../Constants";
import EditEmployee from "./EditarEmpleado";
import DeleteEmployee from "./DeleteEmployee";

interface SwitchPanelProps {
    id: string;
    empleados: any[];
    onAgregarEmpleado: (nuevoEmpleado: any) => void;
    onEditarEmpleado: (empleadoEditado: any) => void;
    onEliminarEmpleado: (rut: string) => void;
}

export const SwitchPanel = ({ id, empleados, onAgregarEmpleado, onEditarEmpleado,onEliminarEmpleado}: SwitchPanelProps) => {
    switch (id) {
        case Tabs.listarProductos:
            return <Inventory />;

        case Tabs.listarEmpleados:
            return <ListEmployees data={empleados} />;

        case Tabs.empleados:
            return <AddEmployees onGuardar={onAgregarEmpleado} empleados={empleados} />;

        case Tabs.editarEmpleados:
            return <EditEmployee empleados={empleados} onActualizar={onEditarEmpleado} />;

        case Tabs.eliminarEmpleados:
            return <DeleteEmployee empleados={empleados} onEliminar={onEliminarEmpleado} />;

        default:
            return null;
    }
};