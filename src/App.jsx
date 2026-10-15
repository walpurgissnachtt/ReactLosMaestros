import { Route, Routes } from 'react-router';
import { TiendaProvider } from './context/TiendaContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import Inicio from './pages/Inicio.jsx';
import Productos from './pages/Productos.jsx';
import DetalleProducto from './pages/DetalleProducto.jsx';
import Carrito from './pages/Carrito.jsx';
import Nosotros from './pages/Nosotros.jsx';
import Contacto from './pages/Contacto.jsx';
import Login from './pages/Login.jsx';
import Categorias from './pages/Categorias.jsx';
import CategoriaDetalle from './pages/CategoriaDetalle.jsx';
import Ofertas from './pages/Ofertas.jsx';
import Checkout from './pages/Chechout.jsx';
import CompraExitosa from './pages/CompraExitosa.jsx';
import PagoError from './pages/PagoError.jsx';
import NoEncontrada from './pages/NoEncontrada.jsx';

export default function App() {
  return (
    <AuthProvider>
      <TiendaProvider>
        <Routes>
          {/* Tienda pública: comparte Header, avisos y Footer */}
          <Route element={<Layout />}>
            <Route index element={<Inicio />} />
            <Route path="productos" element={<Productos />} />
            <Route path="productos/:codigo" element={<DetalleProducto />} />
            <Route path="categorias" element={<Categorias />} />
            <Route path="categorias/:categoria" element={<CategoriaDetalle />} />
            <Route path="ofertas" element={<Ofertas />} />
            <Route path="carrito" element={<Carrito />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="compra-exitosa" element={<CompraExitosa />} />
            <Route path="pago-error" element={<PagoError />} />
            <Route path="nosotros" element={<Nosotros />} />
            <Route path="contacto" element={<Contacto />} />
            <Route path="login" element={<Login />} />
            <Route path="*" element={<NoEncontrada />} />
          </Route>
        </Routes>
      </TiendaProvider>
    </AuthProvider>
  );
}