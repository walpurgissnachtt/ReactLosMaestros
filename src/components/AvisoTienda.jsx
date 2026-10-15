import Alert from 'react-bootstrap/Alert';
import { useTienda } from '../context/TiendaContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

// Avisos globales: errores de guardado y el último mensaje del reducer.
// Lo usan el Layout de la tienda y el panel de administración.
export default function AvisoTienda() {
  const { estado, dispatch, errorGuardado } = useTienda();
  const { errorGuardado: errorSesion } = useAuth();
  return (
    <>
      {(errorGuardado || errorSesion) && (
        <Alert variant="warning">
          No se pudo guardar en este navegador. Los cambios funcionan mientras
          esta página permanezca abierta.
        </Alert>
      )}
      {estado.aviso && (
        <Alert
          className="mt-3"
          variant={estado.aviso.tipo}
          dismissible
          onClose={() => dispatch({ type: 'CERRAR_AVISO' })}
          role="status"
        >
          {estado.aviso.texto}
        </Alert>
      )}
    </>
  );
}
