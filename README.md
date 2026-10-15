<<<<<<< HEAD
# ReactLosMaestros
Migrar a React el proyecto inicial
=======
# Ferretería Los Maestros (React + Vite + react-bootstrap)

Tienda con catálogo filtrable, detalle de producto, carrito con stock, compra simulada,
contacto validado, login de demostración y panel de administración con CRUD de productos.

```bash
npm install
npm run dev     # servidor de desarrollo
npm run build   # build de producción
npm test        # pruebas Jasmine + Karma (requiere Google Chrome)
```

Credenciales académicas del panel `/admin`: **admin / 1234** (simulación, no es seguridad real).
No abras `index.html` con Live Server: usa `npm run dev`.

## Organización de `src/`

| Carpeta | Contenido |
|---|---|
| `main.jsx` | StrictMode, BrowserRouter y estilos |
| `App.jsx` | Proveedores (Auth y Tienda) y rutas |
| `components/` | Layout, Header, Footer, tarjetas, modales, ruta protegida |
| `components/admin_components/` | Panel de administración (menú lateral + inventario) |
| `pages/` | Una pantalla por ruta |
| `context/` | `TiendaContext` (catálogo + carrito) y `AuthContext` (sesión) |
| `store/` | `tiendaReducer`: reglas puras de carrito, stock y CRUD |
| `services/` | Lectura y guardado seguros de `localStorage` |
| `utils/` | Formato CLP, imágenes y validaciones |
| `data/` | Catálogo inicial |
| `test/` y `*.spec.*` | Ayudantes y pruebas Jasmine |

`BrowserRouter` necesita servir `index.html` al abrir rutas como `/productos` directamente;
`public/_redirects` trae la regla para Netlify (otros proveedores usan su equivalente).
>>>>>>> 258ba93b (test: ultimos requesitos para la evaluacion)
