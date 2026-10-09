import { useEffect, useState } from "react";
import { prod, TableHeads } from "../Constants";


function Panel() {
    const [render, setRender] = useState(false);
    useEffect(() => {
        if (prod && prod.length > 0) {
            setRender(true);
        } else {
            setRender(false)
        }
    }, [prod])
    if (!render) {
        return <p className="no-data">No hay productos registrados en el inventario.</p>;
    }
    return (
        /* Envolvemos la tabla en el contenedor que controla el scroll */
        <div className="table-scroll-container">
            <table className="inventory-table">
                <thead>
                    <tr>
                        {Object.values(TableHeads).map((columna) => (
                            <th key={columna}>{columna}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {prod.map((p) => (
                        <tr key={p.codigo}>
                            <td><span className="cell-code">{p.codigo}</span></td>
                            <td>{p.categoria || 'N/A'}</td>
                            <td>{p.nombre}</td>
                            <td>{p.marca || 'N/A'}</td>
                            <td className="cell-price">$ {p.precioVenta}</td>
                            <td className="cell-stock">{p.stock}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default function Inventory() {
    return (
        <div className="inventory-module table-container">
            <h1>Inventario Productos</h1>
            <div className="table">
                <Panel />
            </div>
        </div>
    )
}
