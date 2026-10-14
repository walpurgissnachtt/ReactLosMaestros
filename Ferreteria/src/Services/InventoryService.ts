
interface Product { 
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
}

//mockup para simular la actualización del precio de un producto en el inventario
function updatePrice(id: number, newPrice: number) : boolean{
    if(isNaN(newPrice) || newPrice <=0){
        return false;
    }
    if(isNaN(id) || id <0){
        return false;
    }

    const getProducts = localStorage.getItem('prod');
    if(getProducts){
        const products = JSON.parse(getProducts);
        const productIndex = products.findIndex((p: Product) => p.id === id);
        if(productIndex !== -1){
            products[productIndex].price = newPrice;
            localStorage.setItem('prod', JSON.stringify(products));
            return true;
        }
        return false
    }
}


//mockup para simular la validacion de un producto antes de agregarlo al inventario
function validateProduct(product: Product): boolean {
    if (!product.name || !product.description || product.price <= 0 || product.quantity < 0 || isNaN(product.price) || isNaN(product.quantity)) {
        return false;
    }
}   
//mockup para simular el agregado de un producto al inventario
export default function AddProduct({product} : {product: Product}) {
    if(validateProduct(product)) {          
        const getProducts = localStorage.getItem('prod');
        const products = getProducts ? JSON.parse(getProducts) : [];
        const newProduct = {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: product.quantity
        };
        products.push(newProduct);
        localStorage.setItem('prod', JSON.stringify(products));
    }
}