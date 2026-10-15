import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useTienda } from '../context/TiendaContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { detalleCarrito, resumenCarrito } from '../store/tiendaReducer.js';
import { validarCheckout } from '../utils/validaciones.js';
import { precioCLP } from '../utils/formatos.js';
import { precioOferta } from '../utils/ofertas.js';

export default function Checkout() {
  const { estado, dispatch } = useTienda();
  const { sesion } = useAuth();
  const navigate = useNavigate();
  const detalle = detalleCarrito(estado);
  const resumen = resumenCarrito(estado);

  // Si el usuario inició sesión, sus datos se completan solos (nota del PDF)
  const [campos, setCampos] = useState({
    nombre: sesion?.nombre ?? '',
    email: '',
    direccion: '',
    comuna: '',
    entrega: 'despacho',
    pago: 'aprobado', // simulación: permite probar la pantalla de pago con error
  });
  const [errores, setErrores] = useState({});

  const envio = campos.entrega === 'retiro' ? 0 : resumen.envio;
  const total = resumen.subtotal + envio;

  function actualizar(evento) {
    const { name, value } = evento.target;
    setCampos((actual) => ({ ...actual, [name]: value }));
  }

  function pagar(evento) {
    evento.preventDefault();
    const nuevos = validarCheckout(campos);
    setErrores(nuevos);
    if (Object.keys(nuevos).length) return;

    const stockCambio = detalle.some((p) => p.cantidad > p.stock);
    if (campos.pago === 'rechazado' || stockCambio) {
      navigate('/pago-error', {
        replace: true,
        state: {
          motivo: stockCambio
            ? 'El stock de algún producto cambió mientras comprabas.'
            : 'El banco rechazó el pago.',
        },
      });
      return;
    }
    // El resumen se arma ANTES de comprar, porque COMPRAR vacía el carrito
    const pedido = {
      numero: `FM-${Date.now().toString().slice(-8)}`,
      cliente: { nombre: campos.nombre, email: campos.email },
      entrega: campos.entrega,
      direccion: campos.entrega === 'despacho' ? `${campos.direccion}, ${campos.comuna}` : 'Retiro en tienda',
      items: detalle.map((p) => ({ codigo: p.codigo, nombre: p.nombre, cantidad: p.cantidad, subtotal: precioOferta(p) * p.cantidad })),
      subtotal: resumen.subtotal,
      envio,
      total,
    };
    dispatch({ type: 'COMPRAR' });
    navigate('/compra-exitosa', { replace: true, state: { pedido } });
  }

  if (!detalle.length)
    return (
      <Container as="section" className="py-4">
        <h1>Finalizar compra</h1>
        <Alert variant="info">Tu carrito está vacío.</Alert>
        <Button as={Link} to="/productos">Ver productos</Button>
      </Container>
    );

  const campoTexto = (nombre, etiqueta, tipo = 'text') => (
    <Form.Group controlId={`checkout-${nombre}`} className="mb-3">
      <Form.Label>{etiqueta}</Form.Label>
      <Form.Control
        type={tipo}
        name={nombre}
        value={campos[nombre]}
        onChange={actualizar}
        isInvalid={Boolean(errores[nombre])}
      />
      <Form.Control.Feedback type="invalid">{errores[nombre]}</Form.Control.Feedback>
    </Form.Group>
  );

  return (
    <Container as="section" className="py-4 pagina-checkout">
      <h1>Finalizar compra</h1>
      <Row className="g-4">
        <Col lg={7}>
          <Form onSubmit={pagar} noValidate>
            {campoTexto('nombre', 'Nombre completo')}
            {campoTexto('email', 'Correo electrónico', 'email')}
            <Form.Group controlId="checkout-entrega" className="mb-3">
              <Form.Label>Tipo de entrega</Form.Label>
              <Form.Select name="entrega" value={campos.entrega} onChange={actualizar}>
                <option value="despacho">Despacho a domicilio</option>
                <option value="retiro">Retiro en tienda (sin costo)</option>
              </Form.Select>
            </Form.Group>
            {campos.entrega === 'despacho' && (
              <>
                {campoTexto('direccion', 'Dirección')}
                {campoTexto('comuna', 'Comuna')}
              </>
            )}
            <Form.Group controlId="checkout-pago" className="mb-3">
              <Form.Label>Resultado del pago (simulación)</Form.Label>
              <Form.Select name="pago" value={campos.pago} onChange={actualizar}>
                <option value="aprobado">Pago aprobado</option>
                <option value="rechazado">Pago rechazado</option>
              </Form.Select>
            </Form.Group>
            <Button type="submit">Pagar {precioCLP(total)}</Button>
          </Form>
        </Col>
        <Col lg={5}>
          <Card>
            <Card.Body>
              <h2 className="h5">Resumen</h2>
              {detalle.map((p) => (
                <p className="mb-1" key={p.codigo}>
                  {p.cantidad} × {p.nombre}: {precioCLP(precioOferta(p) * p.cantidad)}
                </p>
              ))}
              <hr />
              <p className="mb-1">Subtotal: {precioCLP(resumen.subtotal)}</p>
              <p className="mb-1">Envío: {precioCLP(envio)}</p>
              <p className="fw-bold">Total: {precioCLP(total)}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
