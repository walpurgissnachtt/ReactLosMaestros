import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import AvisoTienda from '../components/AvisoTienda.jsx';
import ConfirmarModal from '../components/ConfirmarModal.jsx';
import ProductoModal from '../components/ProductoModal.jsx';
import { useTienda } from '../context/TiendaContext.jsx';
import { precioCLP } from '../utils/formatos.js';

export default function Admin() {
  const { estado, dispatch } = useTienda();
  const [productoEditando, setProductoEditando] = useState(undefined);
  const [productoEliminando, setProductoEliminando] = useState(null);

  function guardarProducto(datos, codigo) {
    dispatch({ type: 'GUARDAR_PRODUCTO', datos, codigo });
    setProductoEditando(undefined);
  }

  function eliminarProducto() {
    if (!productoEliminando) return;
    dispatch({
      type: 'ELIMINAR_PRODUCTO',
      codigo: productoEliminando.codigo,
    });
    setProductoEliminando(null);
  }

  return (
    <Container as="main" className="py-4">
      <AvisoTienda />
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <h1>Administración de productos</h1>
        <Button type="button" onClick={() => setProductoEditando(null)}>
          Nuevo producto
        </Button>
      </div>
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th scope="col">Código</th>
            <th scope="col">Producto</th>
            <th scope="col">Categoría</th>
            <th scope="col">Precio de venta</th>
            <th scope="col">Stock</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {estado.productos.map((producto) => (
            <tr key={producto.codigo}>
              <td>{producto.codigo}</td>
              <td>{producto.nombre}</td>
              <td>{producto.categoria}</td>
              <td>{precioCLP(producto.precioVenta)}</td>
              <td>{producto.stock}</td>
              <td>
                <div className="d-flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline-primary"
                    aria-label={`Editar ${producto.nombre}`}
                    onClick={() => setProductoEditando(producto)}
                  >
                    Editar {producto.nombre}
                  </Button>
                  <Button
                    type="button"
                    variant="outline-danger"
                    aria-label={`Eliminar ${producto.nombre}`}
                    onClick={() => setProductoEliminando(producto)}
                  >
                    Eliminar {producto.nombre}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {productoEditando !== undefined && (
        <ProductoModal
          producto={productoEditando}
          productos={estado.productos}
          guardar={guardarProducto}
          cerrar={() => setProductoEditando(undefined)}
        />
      )}
      <ConfirmarModal
        abierto={productoEliminando !== null}
        titulo="Confirmar eliminación"
        confirmar={eliminarProducto}
        cancelar={() => setProductoEliminando(null)}
      >
        ¿Eliminar {productoEliminando?.nombre}? Esta acción no se puede
        deshacer.
      </ConfirmarModal>
    </Container>
  );
}
