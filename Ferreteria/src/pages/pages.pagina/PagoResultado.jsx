import { Link, Navigate, useLocation } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { precioCLP } from '../../utils/index.js';

// Muestra la confirmación o el error del pago con los datos del pedido.
export default function PagoResultado({ tipo }) {
  const { state } = useLocation();
  const esExitoso = tipo === 'exito';
  const pedido = state?.pedido;

  // Evita mostrar una compra exitosa si no se recibieron datos del pedido.
  if (esExitoso && !pedido) return <Navigate to="/" replace />;

  // Renderiza el resumen de compra o las opciones para reintentar el pago.
  return (
    <Container as="section" className="py-4">
      <h1>{esExitoso ? '¡Compra exitosa!' : 'No se pudo realizar el pago'}</h1>
      <Alert variant={esExitoso ? 'success' : 'danger'}>
        {esExitoso ? (
          <>
            Pedido {pedido.numero}. Enviamos el comprobante a {pedido.cliente.email}.
          </>
        ) : (
          <>
            {state?.motivo ?? 'Ocurrió un problema al procesar el pago.'} No se
            descontó stock y tu carrito sigue guardado.
          </>
        )}
      </Alert>
      {esExitoso ? (
        <>
          <ul>
            {pedido.items.map((item) => (
              <li key={item.codigo}>
                {item.cantidad} × {item.nombre} — {precioCLP(item.subtotal)}
              </li>
            ))}
          </ul>
          <p>Entrega: {pedido.direccion}</p>
          <p>Envío: {precioCLP(pedido.envio)}</p>
          <p className="fw-bold">Total pagado: {precioCLP(pedido.total)}</p>
          <Button as={Link} to="/productos">Seguir comprando</Button>
        </>
      ) : (
        <>
          <Button as={Link} to="/checkout" className="me-2">Intentar de nuevo</Button>
          <Button as={Link} to="/carrito" variant="outline-primary">Volver al carrito</Button>
        </>
      )}
    </Container>
  );
}
