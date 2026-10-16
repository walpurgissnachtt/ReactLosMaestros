import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { validarProducto } from '../utils/validaciones.js';

// Valores iniciales del formulario y definición de los campos del producto.
const vacio = {
  codigo: '',
  nombre: '',
  categoria: '',
  subcategoria: '',
  marca: '',
  unidad: '',
  precioCompra: '',
  precioVenta: '',
  stock: '',
  stockMinimo: '',
  imagen: '',
};
const campos = [
  { clave: 'codigo', etiqueta: 'Código', tipo: 'text' },
  { clave: 'nombre', etiqueta: 'Nombre del producto', tipo: 'text' },
  { clave: 'categoria', etiqueta: 'Categoría', tipo: 'text' },
  { clave: 'subcategoria', etiqueta: 'Subcategoría', tipo: 'text' },
  { clave: 'marca', etiqueta: 'Marca', tipo: 'text' },
  { clave: 'unidad', etiqueta: 'Unidad', tipo: 'text' },
  { clave: 'precioCompra', etiqueta: 'Precio de compra', tipo: 'number' },
  { clave: 'precioVenta', etiqueta: 'Precio de venta', tipo: 'number' },
  { clave: 'stock', etiqueta: 'Stock', tipo: 'number' },
  { clave: 'stockMinimo', etiqueta: 'Stock mínimo', tipo: 'number' },
  { clave: 'imagen', etiqueta: 'URL de imagen (opcional)', tipo: 'url' },
];

// producto = null crea; producto = {...} edita (el código no se puede cambiar)
export default function ProductoModal({
  producto,
  productos,
  guardar,
  cerrar,
}) {
  const [form, setForm] = useState(
    producto
      ? Object.fromEntries(
          Object.keys(vacio).map((k) => [k, String(producto[k] ?? '')]),
        )
      : vacio,
  );
  const [errores, setErrores] = useState({});

  // Valida el formulario y lo envía solo si todos sus campos son correctos.
  function enviar(evento) {
    evento.preventDefault();
    const nuevos = validarProducto(form, productos, producto?.codigo ?? null);
    setErrores(nuevos);
    if (!Object.keys(nuevos).length) guardar(form, producto?.codigo ?? null);
  }

  // Muestra el formulario modal para crear o editar un producto.
  return (
    <Modal show onHide={cerrar} centered aria-labelledby="titulo-producto">
      <Modal.Header closeButton>
        <Modal.Title id="titulo-producto">
          {producto ? 'Editar producto' : 'Nuevo producto'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={enviar} noValidate>
        <Modal.Body>
          {campos.map(({ clave, etiqueta, tipo }) => (
            <Form.Group
              controlId={`producto-${clave}`}
              className="mb-3"
              key={clave}
            >
              <Form.Label>{etiqueta}</Form.Label>
              <Form.Control
                type={tipo}
                value={form[clave]}
                disabled={clave === 'codigo' && producto !== null}
                min={tipo === 'number' ? 0 : undefined}
                onChange={(e) => {
                  setForm((actual) => ({ ...actual, [clave]: e.target.value }));
                  setErrores((actual) => ({ ...actual, [clave]: undefined }));
                }}
                isInvalid={Boolean(errores[clave])}
                aria-describedby={
                  errores[clave] ? `error-producto-${clave}` : undefined
                }
              />
              <Form.Control.Feedback
                type="invalid"
                id={`error-producto-${clave}`}
              >
                {errores[clave]}
              </Form.Control.Feedback>
            </Form.Group>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" type="button" onClick={cerrar}>
            Cancelar
          </Button>
          <Button type="submit">Guardar producto</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
