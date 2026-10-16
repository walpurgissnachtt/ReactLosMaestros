// Importa los componentes de navegación, interfaz y contextos de la tienda.
import { Link, NavLink } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import logo from './admin_components/assets/img/montain.jfif';
import { useTienda, resumenCarrito } from "../context/TiendaContext.jsx";

export default function Header() {
  // Obtiene el estado del carrito para mostrar sus unidades.
  const { estado } = useTienda();

  // Renderiza la barra superior y los enlaces de navegación de la tienda.
  return (
    <header>
      <Navbar
        expand="lg"
        className="navbar-ferreteria"
        data-bs-theme="dark"
        collapseOnSelect
      >
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img src={logo} alt="" className="logo-icon" />
            Ferretería Los Maestros
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="menu-principal"
            aria-label="Abrir navegación"
          />
          <Navbar.Collapse id="menu-principal">
            <Nav className="ms-auto" aria-label="Navegación principal">
              {/* Enlaces para acceder a las páginas principales de la tienda. */}
              <Nav.Link as={NavLink} to="/" end eventKey="inicio">
                Inicio
              </Nav.Link>
              <Nav.Link as={NavLink} to="/productos" eventKey="productos">
                Productos
              </Nav.Link>
              <Nav.Link as={NavLink} to="/ofertas" eventKey="ofertas">
                Ofertas
              </Nav.Link>
              <Nav.Link as={NavLink} to="/nosotros" eventKey="nosotros">
                Nosotros
              </Nav.Link>
              <Nav.Link as={NavLink} to="/contacto" eventKey="contacto">
                Contacto
              </Nav.Link>
              {/* Muestra la cantidad de unidades que hay en el carrito. */}
              <Nav.Link as={NavLink} to="/carrito" eventKey="carrito">
                Carrito ({resumenCarrito(estado).unidades})
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
