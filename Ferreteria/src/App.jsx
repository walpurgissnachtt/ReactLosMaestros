import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Home  from './pages/Home'
import MainLayout from './MainLayout'
import Dashboard from './components/admin_components/Dashboard'
import { useEffect } from 'react'
import { prod } from './components/admin_components/Constants'
import { employees } from './components/admin_components/Constants'

import Layout from './components/Layout.jsx';
import Inicio from './pages/pages.pagina/Inicio.jsx';
import Productos from './pages/pages.pagina/Productos.jsx';
import DetalleProducto from './pages/pages.pagina/DetalleProducto.jsx';
import Carrito from './pages/pages.pagina/Carrito.jsx';
import Checkout from './pages/pages.pagina/Checkout.jsx';
import PagoResultado from './pages/pages.pagina/PagoResultado.jsx';
import Ofertas from './pages/pages.pagina/Ofertas.jsx';
import Nosotros from './pages/pages.pagina/Nosotros.jsx';
import Contacto from './pages/pages.pagina/Contacto.jsx';
import NoEncontrada from './pages/pages.pagina/NoEncontrada.jsx';


export default function App() {
  // Se inicia el mockup para los datos del admin
  useEffect(() => {
    const prod_data = localStorage.getItem("prod");
    const employee_data = localStorage.getItem("employees");
    if (!prod_data) {
      localStorage.setItem("prod", JSON.stringify(prod));
    }
    if (!employee_data) {
      localStorage.setItem("employees", JSON.stringify(employees));
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {}
        <Route path="/" element={<Layout />}>
          <Route index element={<Inicio />} />
          <Route path="productos" element={<Productos />} />
          <Route path="productos/:id" element={<DetalleProducto />} />
          <Route path="ofertas" element={<Ofertas />} />
          <Route path="nosotros" element={<Nosotros />} />
          <Route path="contacto" element={<Contacto />} />
          <Route path="carrito" element={<Carrito />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="compra-exitosa" element={<PagoResultado tipo="exito" />} />
          <Route path="pago-error" element={<PagoResultado tipo="error" />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
        </Route>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="*" element={<NoEncontrada />} />
      </Routes>
    </BrowserRouter>
  );
}