import { normalizar } from './formatos.js';

const esEntero = (valor) =>
  String(valor).trim() !== '' && Number.isInteger(Number(valor));
const esNumero = (valor) =>
  String(valor).trim() !== '' && Number.isFinite(Number(valor));

// Devuelve un objeto { campo: 'mensaje' }. Si está vacío, el producto es válido.
// codigoActual es null al crear y el código del producto al editarlo.
export function validarProducto(datos, productos, codigoActual = null) {
  const errores = {};
  const codigo = datos.codigo.trim().toUpperCase();

  if (codigoActual === null) {
    if (!/^[A-Z]{2}\d{3}$/.test(codigo))
      errores.codigo = 'Usa 2 letras y 3 números. Ej: MC001.';
    else if (productos.some((p) => p.codigo === codigo))
      errores.codigo = 'Ya existe un producto con ese código.';
  }
  if (datos.nombre.trim().length < 3)
    errores.nombre = 'Ingresa al menos 3 caracteres.';
  else if (
    productos.some(
      (p) =>
        p.codigo !== codigoActual &&
        normalizar(p.nombre) === normalizar(datos.nombre),
    )
  )
    errores.nombre = 'Ya existe un producto con ese nombre.';
  if (datos.categoria.trim().length < 3)
    errores.categoria = 'Ingresa al menos 3 caracteres.';
  if (datos.subcategoria.trim().length < 3)
    errores.subcategoria = 'Ingresa al menos 3 caracteres.';
  if (datos.marca.trim().length < 2)
    errores.marca = 'Ingresa al menos 2 caracteres.';
  if (datos.unidad.trim().length < 2)
    errores.unidad = 'Ingresa al menos 2 caracteres.';
  if (!esNumero(datos.precioCompra) || Number(datos.precioCompra) < 0)
    errores.precioCompra = 'El precio de compra no puede ser negativo.';
  if (!esNumero(datos.precioVenta) || Number(datos.precioVenta) <= 0)
    errores.precioVenta = 'El precio de venta debe ser mayor que cero.';
  if (!esEntero(datos.stock) || Number(datos.stock) < 0)
    errores.stock = 'El stock debe ser un entero mayor o igual a cero.';
  if (!esEntero(datos.stockMinimo) || Number(datos.stockMinimo) < 0)
    errores.stockMinimo = 'El stock mínimo debe ser un entero mayor o igual a cero.';
  if (datos.imagen.trim() !== '') {
    try {
      if (!['http:', 'https:'].includes(new URL(datos.imagen.trim()).protocol))
        throw new Error();
    } catch {
      errores.imagen = 'Ingresa una URL http o https, o deja el campo vacío.';
    }
  }
  return errores;
}

// Convierte el texto del formulario en los tipos correctos (números, mayúsculas, sin espacios)
export function convertirProducto(datos) {
  return {
    codigo: datos.codigo.trim().toUpperCase(),
    nombre: datos.nombre.trim(),
    categoria: datos.categoria.trim(),
    subcategoria: datos.subcategoria.trim(),
    marca: datos.marca.trim(),
    unidad: datos.unidad.trim(),
    precioCompra: Number(datos.precioCompra),
    precioVenta: Number(datos.precioVenta),
    stock: Number(datos.stock),
    stockMinimo: Number(datos.stockMinimo),
    imagen: datos.imagen.trim(),
  };
}

// Formulario de contacto: nombre, apellido, correo, RUT, celular y descripción (opcional)
export function validarContacto(campos) {
  const errores = {};
  const soloLetras = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s'-]{2,40}$/;
  if (!soloLetras.test(campos.nombre.trim()))
    errores.nombre = 'Ingresa tu nombre (2 a 40 letras, sin números).';
  if (!soloLetras.test(campos.apellido.trim()))
    errores.apellido = 'Ingresa tu apellido (2 a 40 letras, sin números).';
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(campos.email.trim()))
    errores.email = 'Ingresa un correo electrónico válido.';
  if (!/^\d{7,8}-[0-9kK]$/.test(campos.rut.trim()))
    errores.rut = 'Ingresa el RUT sin puntos y con guion. Ej: 12345678-9.';
  if (!/^\+?\d{8,11}$/.test(campos.celular.replace(/\s/g, '')))
    errores.celular = 'Ingresa un celular de 8 a 11 dígitos.';
  if (campos.descripcion.trim().length > 500)
    errores.descripcion = 'La descripción no puede superar los 500 caracteres.';
  return errores;
}

// Valida los datos de envío del checkout. Devuelve { campo: mensaje } solo con los campos inválidos.
export function validarCheckout(campos) {
  const errores = {};
  if (campos.nombre.trim().length < 3)
    errores.nombre = 'Ingresa tu nombre completo (mínimo 3 letras).';
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(campos.email.trim()))
    errores.email = 'Ingresa un correo electrónico válido.';
  if (campos.entrega === 'despacho') {
    if (campos.direccion.trim().length < 5)
      errores.direccion = 'Ingresa la dirección de despacho (calle y número).';
    if (campos.comuna.trim().length < 3)
      errores.comuna = 'Ingresa tu comuna.';
  }
  return errores;
}
