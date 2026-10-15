import { Badge } from 'react-bootstrap';
import { precioCLP } from '../utils/formatos.js';
import { enOferta, porcentajeOferta, precioOferta } from '../utils/ofertas.js';

export default function PrecioProducto({ producto, className = '' }) {
  const oferta = enOferta(producto);

  return (
    <div className={className}>
      {oferta && (
        <del className="d-block text-secondary">
          {precioCLP(producto.precioVenta)}
        </del>
      )}
      <span className={oferta ? 'fw-bold text-danger' : 'fw-bold'}>
        {precioCLP(precioOferta(producto))}
      </span>
      {oferta && (
        <Badge bg="danger" className="ms-2">
          -{porcentajeOferta(producto)}%
        </Badge>
      )}
    </div>
  );
}
