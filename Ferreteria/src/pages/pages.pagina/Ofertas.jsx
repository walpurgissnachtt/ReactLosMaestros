import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import Alert from 'react-bootstrap/Alert';
import ProductoCard from '../../components/ProductoCard.jsx';
import { useTienda } from '../../context/TiendaContext.jsx';
import { enOferta, porcentajeOferta } from "../../utils/index.js";

// Muestra solo los productos con descuento vigente (ver utils/ofertas.js)
export default function Ofertas() {
  const { estado, dispatch } = useTienda();
  const ofertas = estado.productos.filter(enOferta);
  // Presenta los productos rebajados o un aviso si no hay ofertas vigentes.
  return (
    <Container as="section" className="py-4 pagina-ofertas">
      <h1>Ofertas</h1>
      {!ofertas.length ? (
        <Alert variant="info">Por ahora no hay productos en oferta.</Alert>
      ) : (
        <Row className="g-4">
          {ofertas.map((p) => (
            <Col sm={6} lg={4} xl={3} key={p.codigo}>
              <Badge bg="danger" className="mb-2">
                -{porcentajeOferta(p)}% · Oferta
              </Badge>
              <ProductoCard
                producto={p}
                alAgregar={(codigo) => dispatch({ type: 'AGREGAR', codigo })}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
