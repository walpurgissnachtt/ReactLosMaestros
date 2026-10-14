import AddProduct from "../../../Services/InventoryService";

//panel en cargado de generar el formulario para agregar un nuevo producto
export default function AddProductPanel() {

    return(
        <div className="add-product-panel">
            <h1>Agregar Producto</h1>
            <form id="form-add-product" onSubmit={AddProduct}>
                <label htmlFor="codigo">Código del Producto:</label> <br/>
                <input type="text" id="new-codigo" placeholder="Ej: MC011" required />
                <br/>
                <label>Nombre del Producto:</label><br />
                <input type="text" id="new-nombre" placeholder="Ej: Cemento Especial" required />
                <br />

                <label>Categoría:</label><br/>
                <input type="text" id="new-categoria" placeholder="Ej: Mat. Construcción" required />
                <br/>
                <label>Marca:</label><br/>
                <input type="text" id="new-marca" placeholder="Ej: Marca..." required />
                <br />

                <label>Precio de Venta:</label><br/>
                <input type="number" id="new-precio" placeholder="Ej: 6500" required />
                <br/>

                <label>Stock Inicial:</label><br/>
                <input type="number" id="new-stock" placeholder="Ej: 50" required />
                <br />

                <button type="button" id="save-product-button">Guardar Producto</button>

            </form>
        </div>
    )

}