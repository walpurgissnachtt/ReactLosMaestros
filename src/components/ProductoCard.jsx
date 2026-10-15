import { Link } from 'react-router';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ImagenProducto from './ImagenProducto.jsx';
import PrecioProducto from './PrecioProducto.jsx';
import { estadoStock } from '../utils/formatos.js';

export default function ProductoCard({ producto, alAgregar }) {
  const stock = estadoStock(producto.stock, producto.stockMinimo);
  return (
    <Card as="article" className="h-100 shadow-sm producto-card">
      <Link to={`/productos/${producto.codigo}`} aria-label={`Ver ${producto.nombre}`}>
        <ImagenProducto
          className="card-img-top"
          codigo={producto.codigo}
          imagen={producto.imagen}
          alt={producto.nombre}
        />
      </Link>
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between gap-2 mb-2">
          <Badge bg="secondary">{producto.categoria}</Badge>
          <Badge
            bg={stock.variante}
            text={stock.variante === 'warning' ? 'dark' : undefined}
          >
            {stock.texto}
          </Badge>
        </div>
        <Card.Title as="h2" className="h6">
          <Link to={`/productos/${producto.codigo}`} className="text-reset text-decoration-none">
            {producto.nombre}
          </Link>
        </Card.Title>
        <PrecioProducto producto={producto} className="fs-5 mb-3" />
        <Button
          type="button"
          className="mt-auto"
          disabled={producto.stock === 0}
          onClick={() => alAgregar(producto.codigo)}
        >
          {producto.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
        </Button>
      </Card.Body>
    </Card>
  );
}
