import { useState } from 'react';
import { Link, useParams } from 'react-router';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import ImagenProducto from '../components/ImagenProducto.jsx';
import PrecioProducto from '../components/PrecioProducto.jsx';
import { useTienda } from '../context/TiendaContext.jsx';
import { estadoStock } from '../utils/formatos.js';

export default function DetalleProducto() {
  const { codigo } = useParams(); // viene de la ruta /productos/:codigo
  const { estado } = useTienda();
  const producto = estado.productos.find((p) => p.codigo === codigo);

  if (!producto)
    return (
      <Container as="section" className="py-5">
        <h1>Producto no encontrado</h1>
        <Link to="/productos">Volver al catálogo</Link>
      </Container>
    );
  // key = al pasar a otro producto, la cantidad elegida vuelve a 1
  return <DetalleContenido key={producto.codigo} producto={producto} />;
}

function DetalleContenido({ producto }) {
  const { estado, dispatch } = useTienda();
  const [cantidad, setCantidad] = useState(1);
  const stock = estadoStock(producto.stock, producto.stockMinimo);
  const opciones = Array.from(
    { length: Math.min(producto.stock, 10) },
    (_, i) => i + 1,
  );
  const relacionados = estado.productos
    .filter(
      (p) => p.categoria === producto.categoria && p.codigo !== producto.codigo,
    )
    .slice(0, 4);

  return (
    <Container as="section" className="py-4 pagina-detalle">
      <nav aria-label="Ruta de navegación" className="mb-3">
        <Link to="/">Inicio</Link> &gt; <Link to="/productos">Productos</Link>{' '}
        &gt; <span>{producto.nombre}</span>
      </nav>
      <Row className="g-4">
        <Col md={6}>
          <div className="detalle-imagen rounded bg-white p-3 text-center">
            <ImagenProducto
              codigo={producto.codigo}
              imagen={producto.imagen}
              alt={producto.nombre}
              className="img-fluid"
            />
          </div>
        </Col>
        <Col md={6}>
          <h1>{producto.nombre}</h1>
          <PrecioProducto producto={producto} className="fs-3 mb-3" />
          <p>
            Marca {producto.marca} · Presentación: {producto.unidad} ·{' '}
            {producto.categoria} / {producto.subcategoria}
          </p>
          <p>
            <Badge
              bg={stock.variante}
              text={stock.variante === 'warning' ? 'dark' : undefined}
            >
              {stock.texto}
            </Badge>{' '}
            Stock disponible: {producto.stock}
          </p>
          <Form.Group controlId="cantidad" className="mb-3 detalle-cantidad">
            <Form.Label>Cantidad</Form.Label>
            <Form.Select
              value={cantidad}
              disabled={producto.stock === 0}
              onChange={(e) => setCantidad(Number(e.target.value))}
            >
              {opciones.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Button
            disabled={producto.stock === 0}
            onClick={() =>
              dispatch({ type: 'AGREGAR', codigo: producto.codigo, cantidad })
            }
          >
            Añadir al carrito
          </Button>
        </Col>
      </Row>
      {relacionados.length > 0 && (
        <section className="mt-5">
          <h2 className="h4">Productos sugeridos</h2>
          <Row className="g-3">
            {relacionados.map((p) => (
              <Col xs={6} md={3} key={p.codigo}>
                <Card as="article" className="h-100 producto-card">
                  <Link to={`/productos/${p.codigo}`}>
                    <ImagenProducto
                      className="card-img-top"
                      codigo={p.codigo}
                      imagen={p.imagen}
                      alt={p.nombre}
                    />
                  </Link>
                  <Card.Body>
                    <Card.Title as="h3" className="h6">
                      <Link to={`/productos/${p.codigo}`}>{p.nombre}</Link>
                    </Card.Title>
                    <PrecioProducto producto={p} className="mb-0" />
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
      )}
    </Container>
  );
}
