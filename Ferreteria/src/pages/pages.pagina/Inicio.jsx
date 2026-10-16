import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import banner from '../../components/admin_components/assets/img/baner.jfif';
import ProductoCard from '../../components/ProductoCard.jsx';
import { useTienda } from '../../context/TiendaContext.jsx';

// Códigos de los productos que se muestran como destacados
const DESTACADOS = ['HE006', 'HM007', 'HM002', 'PT004', 'PT005', 'MC001'];

// Presenta el banner principal y una selección de productos destacados.
export default function Inicio() {
  const { estado, dispatch } = useTienda();
  const destacados = estado.productos.filter((p) =>
    DESTACADOS.includes(p.codigo),
  );
  // El botón permite ir al catálogo y las tarjetas agregar productos al carrito.
  return (
    <>
      <section className="hero py-5">
        <Container className="text-center py-3">
          <h1 className="display-5 fw-bold">Ferretería Los Maestros</h1>
          <p className="lead">
            Materiales, herramientas y todo para tu proyecto en casa.
          </p>
          <img
            src={banner}
            alt="Ofertas imperdibles para el maestro en casa"
            className="banner-image img-fluid rounded mb-3"
          />
          <div>
            <Button as={Link} to="/productos" size="lg">
              Ver catálogo
            </Button>
          </div>
        </Container>
      </section>
      <section className="py-4">
        <Container>
          <h2 className="text-center mb-4">Productos destacados</h2>
          {/* 1 columna en móvil, 2 en tablet, 3 en escritorio */}
          <Row className="g-4">
            {destacados.map((p) => (
              <Col sm={6} lg={4} key={p.codigo}>
                <ProductoCard
                  producto={p}
                  alAgregar={(codigo) => dispatch({ type: 'AGREGAR', codigo })}
                />
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
}
