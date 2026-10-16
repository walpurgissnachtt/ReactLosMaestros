import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {mockUsers} from './constants/mockUsers'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css'
import { TiendaProvider } from './context/TiendaContext.jsx'

if (!localStorage.getItem('users')) {
  localStorage.setItem('users', JSON.stringify(mockUsers))
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TiendaProvider>
      <App />
    </TiendaProvider>
  </StrictMode>,
)
