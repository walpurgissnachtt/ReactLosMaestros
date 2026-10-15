import { Link } from 'react-router';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { useTienda } from '../context/TiendaContext.jsx';

// Lista las categorías del catálogo con la cantidad de productos de cada una
export default function Categorias() {
  const { estado } = useTienda();
  const categorias = [...new Set(estado.productos.map((p) => p.categoria))].sort();
  return (
    <Container as="section" className="py-4 pagina-categorias">
      <h1>Categorías</h1>
      <Row className="g-4">
        {categorias.map((nombre) => {
          const cantidad = estado.productos.filter((p) => p.categoria === nombre).length;
          return (
            <Col sm={6} lg={4} key={nombre}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title as="h2" className="h5">
                    <Link to={`/categorias/${encodeURIComponent(nombre)}`}>{nombre}</Link>
                  </Card.Title>
                  <Card.Text>{cantidad} productos</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}