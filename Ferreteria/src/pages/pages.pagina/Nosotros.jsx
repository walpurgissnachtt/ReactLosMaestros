import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

const VALORES = [
  {
    titulo: 'Compromiso',
    texto:
      'Nos ponemos la camiseta en cada proyecto del cliente para buscar la solución adecuada.',
  },
  {
    titulo: 'Honestidad',
    texto:
      'Ofrecemos precios justos y una recomendación sincera sobre qué producto comprar.',
  },
  {
    titulo: 'Cercanía',
    texto: 'Tratamos a cada comprador como parte de nuestra familia.',
  },
];

// Presenta información institucional, objetivos y valores de la ferretería.
export default function Nosotros() {
  return (
    <Container as="section" className="py-4 pagina-nosotros">
      <h1>Quiénes somos</h1>
      <p className="lead">
        Fundada con la visión de entregar soluciones integrales para el hogar.
      </p>
      <h2 className="h4">Nuestro objetivo</h2>
      <p>Ser la ferretería líder y de mayor confianza de la región.</p>
      <h2 className="h4 mt-4">Nuestros valores</h2>
      {/* Recorre los valores para mostrarlos como tarjetas informativas. */}
      <Row className="g-3">
        {VALORES.map((v) => (
          <Col md={4} key={v.titulo}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <h3 className="h5">{v.titulo}</h3>
                <p className="mb-0">{v.texto}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
