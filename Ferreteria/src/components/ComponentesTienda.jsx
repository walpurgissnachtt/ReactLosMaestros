import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import { useTienda } from '../context/TiendaContext.jsx';

// Pie de página con la dirección y enlaces de información de la tienda.
export function Footer() {
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

// Ventana reutilizable para pedir confirmación antes de una acción.
export function ConfirmarModal({
  abierto,
  titulo,
  children,
  confirmar,
  cancelar,
}) {
  return (
    <Modal
      show={abierto}
      onHide={cancelar}
      centered
      aria-labelledby="titulo-confirmar"
    >
      <Modal.Header closeButton>
        <Modal.Title id="titulo-confirmar">{titulo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={cancelar}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={confirmar}>
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

// Informa errores de guardado y avisos generados por las acciones de la tienda.
export function AvisoTienda() {
  const { estado, dispatch, errorGuardado } = useTienda();

  return (
    <>
      {errorGuardado && (
        <Alert variant="warning">
          No se pudo guardar en este navegador. Los cambios funcionan mientras
          esta página permanezca abierta.
        </Alert>
      )}
      {estado.aviso && (
        <Alert
          className="mt-3"
          variant={estado.aviso.tipo}
          dismissible
          onClose={() => dispatch({ type: 'CERRAR_AVISO' })}
          role="status"
        >
          {estado.aviso.texto}
        </Alert>
      )}
    </>
  );
}
