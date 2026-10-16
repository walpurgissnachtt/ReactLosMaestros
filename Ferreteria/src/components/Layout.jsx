import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Header from './Header.jsx';
import { AvisoTienda, Footer } from './ComponentesTienda.jsx';

// Asocia cada ruta con el título que debe mostrarse en la pestaña del navegador.
const TITULOS = {
  '/': 'Inicio',
  '/productos': 'Productos',
  '/ofertas': 'Ofertas',

  
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
  // Mantiene la cabecera, los avisos, la página seleccionada y el pie comunes.
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
