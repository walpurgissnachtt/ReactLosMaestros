import AddProduct from "../../../Services/InventoryService";
//panel en cargado de generar el formulario para agregar un nuevo producto
interface Product {
    codigo: string;
    categoria?: string;
    nombre: string;
    marca?: string;
    precioVenta: number;
    stock: number;
}

function AddProductPanel() {
    const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) =>{
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());
        alert("entrando a funcion add producto")
        alert("Producto siendo ingresado a crud: "+ data);
        console.log(data);
        AddProduct({
            product: {
                codigo: String(data.codigo ?? ""),
                categoria: String(data.categoria ?? ""),
                nombre: String(data.nombre ?? ""),
                marca: String(data.marca ?? ""),
                precioVenta: Number(data.precioVenta),
                stock: Number(data.stock)

                
            },
        });
        alert("saliendo funcion add producto")
    }
    return(
        <div className="add-product-panel">
            <h1>Agregar Producto</h1>
            <form id="form-add-product" onSubmit={handleSubmit}>
                <label htmlFor="codigo">Código del Producto:</label> <br/>
                <input type="text" id="new-codigo" name="codigo" placeholder="Ej: MC011" required />
                <br/>
                <label>Nombre del Producto:</label><br />
                <input type="text" id="new-nombre" name="nombre" placeholder="Ej: Cemento Especial" required />
                <br />

                <label>Categoría:</label><br/>
                <input type="text" id="new-categoria" name="categoria" placeholder="Ej: Mat. Construcción" required />
                <br/>
                <label>Marca:</label><br/>
                <input type="text" id="new-marca" name="marca" placeholder="Ej: Marca..." required />
                <br />

                <label>Precio de Venta:</label><br/>
                <input type="number" id="new-precio" name="precioVenta" placeholder="Ej: 6500" required />
                <br/>

                <label>Stock Inicial:</label><br/>
                <input type="number" id="new-stock" name="stock" placeholder="Ej: 50" required />
                <br />

                <button type="submit" id="save-product-button">Guardar Producto</button>

            </form>
        </div>
    )

}

export default function LoadAddProductPanel(){
    return(
        <AddProductPanel/>
    )
}