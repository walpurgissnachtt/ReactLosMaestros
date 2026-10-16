import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css'
import { TiendaProvider } from './context/TiendaContext.jsx';

// El proveedor comparte el estado de la tienda con la aplicación.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TiendaProvider>
      <App />
    </TiendaProvider>
  </StrictMode>,
)
