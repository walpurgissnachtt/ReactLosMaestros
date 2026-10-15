import { Link, useParams } from 'react-router';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import ProductoCard from '../components/ProductoCard.jsx';
import { useTienda } from '../context/TiendaContext.jsx';

// Productos de UNA categoría; el nombre llega por la URL (/categorias/:categoria)
export default function CategoriaDetalle() {
  const { categoria } = useParams();
  const nombre = decodeURIComponent(categoria);
  const { estado, dispatch } = useTienda();
  const productos = estado.productos.filter((p) => p.categoria === nombre);
  return (
    <Container as="section" className="py-4">
      <h1>{nombre}</h1>
      <p>
        <Link to="/categorias">← Volver a categorías</Link>
      </p>
      {!productos.length ? (
        <Alert variant="info">No hay productos en esta categoría.</Alert>
      ) : (
        <Row className="g-4">
          {productos.map((p) => (
            <Col sm={6} lg={4} xl={3} key={p.codigo}>
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
