import React from 'react';
import { Link } from 'react-router-dom';
import {
  enOferta,
  imagenNoDisponible,
  obtenerRutaImagen,
  porcentajeOferta,
  precioCLP,
  precioOferta,
} from '../utils/index.js';

// Presenta un producto en el catálogo con precio, stock y acción de compra.
export function ProductoCard({ producto, alAgregar, onAgregarAlCarrito }) {
  if (!producto) return null;

  // Calcula los datos derivados para mostrar ofertas, precios y disponibilidad.
  const precio = producto.precioVenta ?? producto.precio ?? 0;
  const esOferta = enOferta(producto);
  const descuento = porcentajeOferta(producto);
  const precioFinal = precioOferta(producto);
  const agregar = alAgregar ?? onAgregarAlCarrito;
  const agotado = producto.stock <= 0;

  return (
    <article className="producto-card h-100">
      {esOferta && (
        <span className="badge-oferta">-{descuento}%</span>
      )}
      <Link to={`/productos/${encodeURIComponent(producto.codigo)}`}>
        <img
          src={obtenerRutaImagen(producto.imagen, producto.codigo)}
          alt={producto.nombre}
          className="card-img-top"
          onError={imagenNoDisponible}
        />
      </Link>
      <div className="card-body d-flex flex-column">
        <h3 className="card-title h5">
          <Link to={`/productos/${encodeURIComponent(producto.codigo)}`} className="text-decoration-none">
            {producto.nombre}
          </Link>
        </h3>
        <p className="producto-categoria">{producto.categoria}</p>
        {producto.stock < producto.stockMinimo && (
          <p>Stock crítico ({producto.stock})</p>
        )}
        <p className="fw-bold">
          {esOferta && (
            <span className="text-decoration-line-through me-2">
              {precioCLP(precio)}
            </span>
          )}
          {precioCLP(precioFinal)}
        </p>
        <button
          className="btn btn-outline-primary mt-auto"
          disabled={agotado}
          onClick={() => agregar?.(producto.codigo)}
        >
          {agotado ? 'Sin stock' : 'Agregar al carrito'}
        </button>
      </div>
    </article>
  );
}

export default ProductoCard;