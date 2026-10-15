import { useState } from 'react';
import { Link } from 'react-router';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import ConfirmarModal from '../components/ConfirmarModal.jsx';
import ImagenProducto from '../components/ImagenProducto.jsx';
import PrecioProducto from '../components/PrecioProducto.jsx';
import { precioCLP } from '../utils/formatos.js';
import { precioOferta } from '../utils/ofertas.js';
import { useTienda } from '../context/TiendaContext.jsx';
import { detalleCarrito, resumenCarrito } from '../store/tiendaReducer.js';

export default function Carrito() {
  const { estado, dispatch } = useTienda();
  const [confirmacion, setConfirmacion] = useState(false); // modal de vaciar carrito
  const detalle = detalleCarrito(estado);
  const resumen = resumenCarrito(estado);
  const stockCambio = detalle.some((p) => p.cantidad > p.stock);

  function confirmar() {
    dispatch({ type: 'VACIAR' });
    setConfirmacion(false);
  }

  return (
    <Container as="section" className="py-4 pagina-carrito">
      <h1>Mi carrito</h1>
      {stockCambio && (
        <Alert variant="warning">
          El stock cambió. Reduce las cantidades o elimina los productos
          agotados.
        </Alert>
      )}
      {!detalle.length ? (
        <Alert variant="info">Tu carrito está vacío.</Alert>
      ) : (
        <>
          {detalle.map((p) => (
            <Card as="article" className="mb-3" key={p.codigo}>
              <Card.Body className="d-flex align-items-center gap-3 flex-wrap">
                <ImagenProducto
                  className="cart-image rounded"
                  codigo={p.codigo}
                  imagen={p.imagen}
                  alt=""
                />
                <div className="me-auto">
                  <h2 className="h6">{p.nombre}</h2>
                  <div className="mb-1">
                    <PrecioProducto producto={p} className="d-inline-block me-2" />
                    · {p.categoria}
                  </div>
                  <small>Stock: {p.stock}</small>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Button
                    variant="outline-secondary"
                    aria-label={`Quitar una unidad de ${p.nombre}`}
                    onClick={() =>
                      dispatch({
                        type: 'CANTIDAD',
                        codigo: p.codigo,
                        cantidad: Math.min(p.stock, p.cantidad - 1),
                      })
                    }
                  >
                    −
                  </Button>
                  <span aria-label={`Cantidad de ${p.nombre}`}>
                    {p.cantidad}
                  </span>
                  <Button
                    variant="outline-secondary"
                    aria-label={`Agregar una unidad de ${p.nombre}`}
                    disabled={p.cantidad >= p.stock}
                    onClick={() =>
                      dispatch({
                        type: 'CANTIDAD',
                        codigo: p.codigo,
                        cantidad: p.cantidad + 1,
                      })
                    }
                  >
                    +
                  </Button>
                </div>
                <strong>{precioCLP(precioOferta(p) * p.cantidad)}</strong>
                <Button
                  variant="outline-danger"
                  onClick={() => dispatch({ type: 'QUITAR', codigo: p.codigo })}
                >
                  Eliminar {p.nombre}
                </Button>
              </Card.Body>
            </Card>
          ))}
          <Card className="mb-3">
            <Card.Body>
              <p>Unidades: {resumen.unidades}</p>
              <p>Subtotal: {precioCLP(resumen.subtotal)}</p>
              <p>Envío estimado: {precioCLP(resumen.envio)}</p>
              <h2 className="h4">Total: {precioCLP(resumen.total)}</h2>
              <Button as={Link} to="/checkout" disabled={stockCambio}>
                Ir al pago
              </Button>{' '}
              <Button
                variant="outline-danger"
                onClick={() => setConfirmacion(true)}
              >
                Vaciar carrito
              </Button>
            </Card.Body>
          </Card>
        </>
      )}
      <Button as={Link} to="/productos" variant="outline-primary">
        Continuar comprando
      </Button>
      <ConfirmarModal
        abierto={confirmacion}
        titulo="Vaciar carrito"
        confirmar={confirmar}
        cancelar={() => setConfirmacion(false)}
      >
        ¿Deseas retirar todos los productos del carrito?
      </ConfirmarModal>
    </Container>
  );
}
