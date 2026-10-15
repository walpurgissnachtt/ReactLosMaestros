import { Link, useLocation } from 'react-router';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

export default function PagoError() {
  const { state } = useLocation();
  return (
    <Container as="section" className="py-4">
      <h1>No se pudo realizar el pago</h1>
      <Alert variant="danger">
        {state?.motivo ?? 'Ocurrió un problema al procesar el pago.'} No se
        descontó stock y tu carrito sigue guardado.
      </Alert>
      <Button as={Link} to="/checkout" className="me-2">Intentar de nuevo</Button>
      <Button as={Link} to="/carrito" variant="outline-primary">Volver al carrito</Button>
    </Container>
  );
}
