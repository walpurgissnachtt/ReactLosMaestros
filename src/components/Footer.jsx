import { Link } from 'react-router';
import Container from 'react-bootstrap/Container';

export default function Footer() {
  return (
    <footer className="footer-ferreteria py-4 mt-auto">
      <Container className="d-flex flex-wrap justify-content-between gap-2">
        <span>Ferretería Los Maestros · Av. Américo Vespucio 1252, Pudahuel</span>
        <span>
          <Link to="/nosotros">Quiénes somos</Link> ·{' '}
          <Link to="/contacto">Contáctanos</Link>
        </span>
      </Container>
    </footer>
  );
}
