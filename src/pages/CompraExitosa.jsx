import { Link, Navigate, useLocation } from 'react-router';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { precioCLP } from '../utils/formatos.js';

// El pedido llega por el "state" de la navegación (lo envía Checkout)
export default function CompraExitosa() {
  const { state } = useLocation();
  const pedido = state?.pedido;
  if (!pedido) return <Navigate to="/" replace />; // entrar directo por URL no tiene sentido
  return (
    <Container as="section" className="py-4">
      <h1>¡Compra exitosa!</h1>
      <Alert variant="success">
        Pedido {pedido.numero}. Enviamos el comprobante a {pedido.cliente.email}.
      </Alert>
      <ul>
        {pedido.items.map((i) => (
          <li key={i.codigo}>
            {i.cantidad} × {i.nombre} — {precioCLP(i.subtotal)}
          </li>
        ))}
      </ul>
      <p>Entrega: {pedido.direccion}</p>
      <p>Envío: {precioCLP(pedido.envio)}</p>
      <p className="fw-bold">Total pagado: {precioCLP(pedido.total)}</p>
      <Button as={Link} to="/productos">Seguir comprando</Button>
    </Container>
  );
}
