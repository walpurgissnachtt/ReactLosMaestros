import { createContext, useContext, useEffect, useState } from 'react';
import { cargarSesion, guardarSesion } from '../services/storage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(cargarSesion);
  const [errorGuardado, setErrorGuardado] = useState(false);
  useEffect(() => {
    setErrorGuardado(!guardarSesion(sesion));
  }, [sesion]);

  // Login de demostración (proyecto académico): no es seguridad real
  function ingresar(usuario, contrasena) {
    if (usuario.trim() !== 'admin' || contrasena !== '1234') return false;
    setSesion({
      nombre: 'Administrador',
      usuario: 'admin',
      rol: 'admin',
      logueado: true,
    });
    return true;
  }
  const cerrarSesion = () => setSesion(null);

  return (
    <AuthContext.Provider
      value={{ sesion, ingresar, cerrarSesion, errorGuardado }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth debe usarse dentro de AuthProvider.');
  return contexto;
}
