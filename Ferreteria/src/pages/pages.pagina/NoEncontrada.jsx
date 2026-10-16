import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

// Página de respuesta para direcciones que no coinciden con una ruta conocida.
export default function NoEncontrada() {
  return (
    <Container as="section" className="py-5">
      <h1>Página no encontrada</h1>
      <p>La dirección que abriste no existe.</p>
      <Link to="/">Volver al inicio</Link>
    </Container>
  );
}
