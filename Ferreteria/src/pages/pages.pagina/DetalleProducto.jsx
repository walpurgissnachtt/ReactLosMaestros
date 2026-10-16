import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import { useTienda } from '../../context/TiendaContext.jsx';
import {
  enOferta as productoEnOferta,
  imagenNoDisponible,
  obtenerRutaImagen,
  precioCLP,
  precioOferta,
} from "../../utils/index.js";

// Busca un producto por su código y permite seleccionar unidades para el carrito.
export default function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { estado, dispatch } = useTienda();
  const [cantidad, setCantidad] = useState(1);

  const producto = estado.productos.find((p) => p.codigo === id);

  if (!producto) {
    return (
      <Container className="py-5 text-center">
        <h2>Producto no encontrado</h2>
        <Button as={Link} to="/productos" variant="primary" className="mt-3">
          Volver al catálogo
        </Button>
      </Container>
    );
  }

  const enOferta = productoEnOferta(producto);
  const precioActual = precioOferta(producto);
  const precioOriginal = producto.precioVenta ?? producto.precio ?? 0;

  // Agrega al carrito el producto y la cantidad seleccionados.
  function agregar() {
    dispatch({
      type: 'AGREGAR',
      producto,
      cantidad,
    });
  }

  // Si el código no existe, ofrece regresar al catálogo.
  return (
    <Container as="section" className="py-4 pagina-detalle">
      <Button
        variant="outline-secondary"
        className="mb-3"
        onClick={() => navigate(-1)}
      >
        &larr; Volver
      </Button>

      <Row className="g-4">
        <Col md={6}>
          <Card className="p-3 text-center border-0 shadow-sm">
            {/* Imagen directa sin componente auxiliar */}
            <img
              src={obtenerRutaImagen(producto.imagen, producto.codigo)}
              alt={producto.nombre}
              className="img-fluid rounded"
              style={{ maxHeight: '400px', objectFit: 'contain' }}
              onError={imagenNoDisponible}
            />
          </Card>
        </Col>

        <Col md={6}>
          <div className="d-flex align-items-center gap-2 mb-2">
            <Badge bg="secondary">{producto.categoria}</Badge>
            {enOferta && <Badge bg="danger">En Oferta</Badge>}
          </div>

          <h1 className="h2 mb-3">{producto.nombre}</h1>

          {/* Renderizado de precio directo */}
          <div className="mb-3 fs-3 fw-bold">
            {enOferta ? (
              <>
                <span className="text-danger me-2">{precioCLP(precioActual)}</span>
                <span className="text-muted text-decoration-line-through fs-5">
                  {precioCLP(precioOriginal)}
                </span>
              </>
            ) : (
              <span>{precioCLP(precioOriginal)}</span>
            )}
          </div>

          <p className="text-muted mb-4">{producto.descripcion}</p>

          <div className="mb-3">
            <small className="d-block text-muted">Stock disponible: {producto.stock}</small>
          </div>

          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="d-flex align-items-center gap-2">
              <Button
                variant="outline-secondary"
                disabled={cantidad <= 1}
                onClick={() => setCantidad((prev) => Math.max(1, prev - 1))}
              >
                −
              </Button>
              <span className="px-2 fw-bold">{cantidad}</span>
              <Button
                variant="outline-secondary"
                disabled={cantidad >= producto.stock}
                onClick={() => setCantidad((prev) => Math.min(producto.stock, prev + 1))}
              >
                +
              </Button>
            </div>

            <Button
              variant="primary"
              size="lg"
              disabled={producto.stock === 0}
              onClick={agregar}
            >
              {producto.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}