
interface Product {
    codigo: string;
    categoria?: string;
    nombre: string;
    marca?: string;
    precioVenta: number;
    stock: number;
}

//mockup para simular la actualización del precio de un producto en el inventario
export function updatePrice(id: string, newPrice: number) : boolean{
    alert("entrando en update price!")
    if(isNaN(newPrice) || newPrice <=0){
        return false;
    }
    if(!id){
        return false;
    }
    alert("validaciones pasadas!")
    const getProducts = localStorage.getItem('prod');
    if(getProducts){
        alert("entrando en if(getProducts)")
        const products: Product[] = JSON.parse(getProducts);
        const productIndex = products.findIndex((p: Product) => p.codigo === id);
        if(productIndex !== -1){
            products[productIndex].precioVenta = newPrice;
            localStorage.setItem('prod', JSON.stringify(products));
            alert("saliendo de update. todo completado!")
            return true;
        }else{
            alert("saliendo de update. todo fallido!")
            return false;
        }

    }else{
        alert("saliendo de update. todo fallido 2!")
        return false;
    }
}


//mockup para simular la validacion de un producto antes de agregarlo al inventario
function validateProductData(p:Product):boolean{
    if(!p.nombre || !p.categoria || !p.marca || !p.codigo){
        return false;
    }
    if(isNaN(p.precioVenta) || p.precioVenta < 0){
        return false
    }
    if(isNaN(p.stock) || p.stock < -1 ){
        return false;
    }
    return true;
}
//mockup para simular el agregado de un producto al inventario
export default function AddProduct({product} : {product: Product}) {
    try {
        if(validateProductData(product)){
            const getProducts = localStorage.getItem('prod');
            const products = getProducts ? JSON.parse(getProducts) : [];
            products.push(product);
            localStorage.setItem('prod', JSON.stringify(products));
            console.log(products) 
        }
    } catch (error) {
        alert(error)
    }
}
