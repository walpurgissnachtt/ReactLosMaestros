import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router';
import Container from 'react-bootstrap/Container';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import AvisoTienda from './AvisoTienda.jsx';

const TITULOS = {
  '/': 'Inicio',
  '/productos': 'Productos',

  
  '/carrito': 'Carrito',
  '/nosotros': 'Nosotros',
  '/contacto': 'Contacto',
  '/login': 'Ingreso',
};

// Estructura común de la tienda: menú arriba, página activa al medio, pie abajo
export default function Layout() {
  const { pathname } = useLocation();
  const main = useRef(null);
  useEffect(() => {
    const titulo = pathname.startsWith('/productos/')
      ? 'Detalle de producto'
      : (TITULOS[pathname] ?? 'Página no encontrada');
    document.title = `${titulo} | Ferretería Los Maestros`;
    main.current?.focus();
  }, [pathname]);
  return (
    <>
      <a className="saltar-contenido" href="#contenido">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" tabIndex={-1} ref={main}>
        <Container>
          <AvisoTienda />
        </Container>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
