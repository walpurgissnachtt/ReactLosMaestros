import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { cargarTienda, guardarTienda } from '../services/storage.js';
import { tiendaReducer } from '../store/tiendaReducer.js';

const TiendaContext = createContext(null);

export function TiendaProvider({ children }) {
  // useReducer: todas las acciones (carrito y CRUD) pasan por tiendaReducer
  const [estado, dispatch] = useReducer(tiendaReducer, undefined, cargarTienda);
  const [errorGuardado, setErrorGuardado] = useState(false);
  // Cada vez que cambia el catálogo o el carrito se guarda en localStorage
  useEffect(() => {
    setErrorGuardado(!guardarTienda(estado));
  }, [estado.productos, estado.carrito]);
  return (
    <TiendaContext.Provider value={{ estado, dispatch, errorGuardado }}>
      {children}
    </TiendaContext.Provider>
  );
}

export function useTienda() {
  const contexto = useContext(TiendaContext);
  if (!contexto)
    throw new Error('useTienda debe usarse dentro de TiendaProvider.');
  return contexto;
}
