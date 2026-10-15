// Ayudantes para probar componentes de React con Jasmine (sin librerías extra).
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router';
import App from '../App.jsx';

// Le avisa a React que estamos en un entorno de pruebas (necesario para act)
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const montados = [];

function montar(ui) {
  const el = document.createElement('div');
  document.body.appendChild(el);
  const root = createRoot(el);
  act(() => root.render(ui));
  montados.push({ root, el });
  return el;
}

// Dibuja un componente suelto dentro de un Router
export function renderizar(ui, ruta = '/') {
  return montar(<MemoryRouter initialEntries={[ruta]}>{ui}</MemoryRouter>);
}

// Dibuja toda la aplicación (con sus proveedores) en la ruta indicada
export function renderizarApp(ruta = '/') {
  return montar(
    <MemoryRouter initialEntries={[ruta]}>
      <App />
    </MemoryRouter>,
  );
}

// Desmonta lo dibujado SIN borrar localStorage (simula cerrar y volver a abrir la página)
export function desmontarApp() {
  while (montados.length) {
    const { root, el } = montados.pop();
    act(() => root.unmount());
    el.remove();
  }
}

// Se llama en afterEach: desmonta todo y borra localStorage para que una prueba no ensucie a otra
export function limpiar() {
  while (montados.length) {
    const { root, el } = montados.pop();
    act(() => root.unmount());
    el.remove();
  }
  document.body.innerHTML = '';
  localStorage.clear();
}

// Simula un clic de usuario
export function clic(elemento) {
  act(() => {
    elemento.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true }),
    );
  });
}

// Simula que el usuario escribe o selecciona un valor en un input, textarea o select
export function escribir(campo, valor) {
  const asignar = Object.getOwnPropertyDescriptor(
    Object.getPrototypeOf(campo),
    'value',
  ).set;
  act(() => {
    asignar.call(campo, valor); // se salta el "value tracker" de React
    campo.dispatchEvent(new Event('input', { bubbles: true }));
    campo.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

// Espera (hasta ~1 s) a que algo aparezca; sirve para modales con animación
export async function esperar(condicion, ms = 1000) {
  const inicio = Date.now();
  for (;;) {
    try {
      const resultado = condicion();
      if (resultado) return resultado;
    } catch {
      // todavía no está listo
    }
    if (Date.now() - inicio > ms)
      throw new Error('Tiempo agotado esperando la condición');
    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });
  }
}

// Búsquedas rápidas en el DOM de la página (los modales viven en document.body)
export const q = (selector, raiz = document) => raiz.querySelector(selector);
export const qa = (selector, raiz = document) =>
  Array.from(raiz.querySelectorAll(selector));
export const boton = (texto, raiz = document) =>
  qa('button, a', raiz).find((b) => b.textContent.trim() === texto);
export const botonQueContiene = (texto, raiz = document) =>
  qa('button, a', raiz).find((b) => b.textContent.includes(texto));
// jsdom (Vitest) no trae CSS.escape; se usa una versión de respaldo
const escaparId = (id) =>
  globalThis.CSS?.escape ? CSS.escape(id) : id.replace(/([^\w-])/g, '\\$1');

export const campo = (etiqueta, raiz = document) => {
  const label = qa('label', raiz).find((l) => l.textContent.trim() === etiqueta);
  return label ? raiz.querySelector(`#${escaparId(label.htmlFor)}`) : null;
};

// Función espía sin depender de Jasmine ni de Vitest: guarda los argumentos de cada llamada
export function crearEspia() {
  const espia = (...args) => espia.llamadas.push(args);
  espia.llamadas = [];
  return espia;
}
