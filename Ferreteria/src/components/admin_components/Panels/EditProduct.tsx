import { updatePrice } from "../../../Services/InventoryService";


function EditPanel(){
    const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) =>{
            alert("HANDLE SUBMIT EJECUTADO");
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const data = Object.fromEntries(formData.entries());
            alert("entrando a funcion actualizar Precio")
            console.log(data);
            updatePrice(
                String(data.codigo ?? ""),
                Number(data.price)
            );
        }
    return(
            <form action="" onSubmit={handleSubmit}>
                <label htmlFor="codigo">Código Producto:</label>
                <input type="text" name="codigo" id="codigo" required />
                <br /><br />
                <label  htmlFor="price">Nuevo Precio:</label>
                <input type="number" name="price" id="price" required />
                <br /><br />
                <button id="updated-prod-button" type="submit" >Confirmar Edicion</button>
            </form>
    )
}


export default function LoadEditPanel(){
    return(
        <EditPanel/>
    )
}