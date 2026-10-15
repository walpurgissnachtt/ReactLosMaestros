import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { validarContacto } from '../utils/validaciones.js';

const vacio = {
  nombre: '',
  apellido: '',
  email: '',
  rut: '',
  celular: '',
  descripcion: '',
};
const CAMPOS = [
  { campo: 'nombre', texto: 'Nombre', tipo: 'text', autoComplete: 'given-name' },
  { campo: 'apellido', texto: 'Apellido', tipo: 'text', autoComplete: 'family-name' },
  { campo: 'email', texto: 'Correo electrónico', tipo: 'email', autoComplete: 'email' },
  { campo: 'rut', texto: 'RUT', tipo: 'text', placeholder: 'Ej: 12345678-9' },
  { campo: 'celular', texto: 'Celular', tipo: 'tel', autoComplete: 'tel' },
  { campo: 'descripcion', texto: 'Descripción (opcional)', tipo: 'text' },
];

export default function Contacto() {
  const [campos, setCampos] = useState(vacio);
  const [errores, setErrores] = useState({});
  const [tocados, setTocados] = useState({});
  const [enviado, setEnviado] = useState(false);

  // Valida el campo que se está escribiendo (en tiempo real)
  function actualizar(evento) {
    const { name, value } = evento.target;
    const siguientes = { ...campos, [name]: value };
    setCampos(siguientes);
    setTocados((actual) => ({ ...actual, [name]: true }));
    setErrores((actual) => ({
      ...actual,
      [name]: validarContacto(siguientes)[name],
    }));
    setEnviado(false);
  }

  function enviar(evento) {
    evento.preventDefault();
    const nuevos = validarContacto(campos);
    setErrores(nuevos);
    setTocados(Object.fromEntries(CAMPOS.map(({ campo }) => [campo, true])));
    if (!Object.keys(nuevos).length) {
      setEnviado(true);
      setCampos(vacio);
      setTocados({});
    }
  }

  return (
    <Container as="section" className="py-4 pagina-contacto">
      <h1>Contacto</h1>
      <p>
        Formulario de demostración. Se valida en el navegador; no se envía
        correo.
      </p>
      {enviado && (
        <Alert variant="success" role="status">
          ¡Mensaje enviado con éxito! Nos pondremos en contacto contigo a la
          brevedad.
        </Alert>
      )}
      <Form className="formulario-contacto" onSubmit={enviar} noValidate>
        {CAMPOS.map(({ campo, texto, tipo, placeholder, autoComplete }) => (
          <Form.Group
            key={campo}
            controlId={`contacto-${campo}`}
            className="mb-3"
          >
            <Form.Label>{texto}</Form.Label>
            <Form.Control
              as={campo === 'descripcion' ? 'textarea' : 'input'}
              rows={campo === 'descripcion' ? 4 : undefined}
              type={tipo}
              placeholder={placeholder}
              autoComplete={autoComplete}
              name={campo}
              value={campos[campo]}
              onChange={actualizar}
              isInvalid={Boolean(tocados[campo] && errores[campo])}
              isValid={Boolean(tocados[campo] && !errores[campo])}
              aria-describedby={errores[campo] ? `error-${campo}` : undefined}
            />
            <Form.Control.Feedback type="invalid" id={`error-${campo}`}>
              {errores[campo]}
            </Form.Control.Feedback>
          </Form.Group>
        ))}
        <Button type="submit">Enviar mensaje</Button>
      </Form>
    </Container>
  );
}
