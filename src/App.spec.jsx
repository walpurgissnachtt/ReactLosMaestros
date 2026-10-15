import { productosIniciales } from './data/productosIniciales.js';
import { CLAVES } from './services/storage.js';
import {
  boton,
  botonQueContiene,
  campo,
  clic,
  escribir,
  esperar,
  limpiar,
  q,
  qa,
  renderizarApp,
  desmontarApp,
} from './test/utils.jsx';

const iniciarSesionAdmin = () =>
  localStorage.setItem(CLAVES.sesion, JSON.stringify({ usuario: 'admin', rol: 'admin' }));
const guardado = () => JSON.parse(localStorage.getItem(CLAVES.tienda));
const titulo = () => q('h1')?.textContent;

// Funciona con Jasmine (xit) y con Vitest (it.skip)
const pendiente = globalThis.xit ?? it.skip;

// NOTA: las pruebas marcadas con pendiente dependen del panel de administración (ruta /admin),
// que está desarrollando el leo. Cuando se integre, cambiar pendiente( por it(.
describe('navegación y acceso', () => {
  afterEach(limpiar);

  it('cambia de página con el menú y marca el enlace activo', () => {
    renderizarApp();
    clic(boton('Productos'));
    expect(titulo()).toBe('Catálogo de productos');
    expect(boton('Productos').getAttribute('aria-current')).toBe('page');
  });

  it('muestra una página 404 para direcciones desconocidas', () => {
    renderizarApp('/ruta-inexistente');
    expect(titulo()).toBe('Página no encontrada');
  });

  pendiente('redirige /admin al login, rechaza una clave incorrecta y permite entrar y salir', async () => {
    renderizarApp('/admin');
    expect(titulo()).toBe('Inicio de sesión administrador');

    escribir(campo('Usuario'), 'admin');
    escribir(campo('Contraseña'), 'incorrecta');
    clic(q('form button[type=submit]'));
    expect(document.body.textContent).toContain('Usuario o contraseña incorrectos.');

    escribir(campo('Contraseña'), '1234');
    clic(q('form button[type=submit]'));
    await esperar(() => titulo() === 'Administración de productos');
    expect(JSON.parse(localStorage.getItem(CLAVES.sesion)).rol).toBe('admin');

    clic(boton('Cerrar sesión'));
    await esperar(() => titulo() === 'Ferretería Los Maestros');
    expect(localStorage.getItem(CLAVES.sesion)).toBeNull();
  });

  pendiente('restaura la sesión al volver a abrir la aplicación', () => {
    iniciarSesionAdmin();
    renderizarApp('/admin');
    expect(titulo()).toBe('Administración de productos');
  });
});

describe('catálogo y detalle', () => {
  afterEach(limpiar);

  it('muestra todos los productos y combina filtros, con opción de limpiar', () => {
    renderizarApp('/productos');
    expect(qa('article').length).toBe(productosIniciales.length);

    escribir(campo('Buscar producto'), 'stanley');
    const stanley = productosIniciales.filter((p) => p.marca === 'Stanley').length;
    expect(qa('article').length).toBe(stanley);

    escribir(campo('Categoría'), 'Herramientas');
    escribir(campo('Precio máximo'), '2000');
    const esperados = productosIniciales.filter(
      (p) => p.marca === 'Stanley' && p.categoria === 'Herramientas' && p.precioVenta <= 2000,
    ).length;
    expect(qa('article').length).toBe(esperados);

    escribir(campo('Precio máximo'), '0');
    expect(document.body.textContent).toContain('No encontramos productos con esos filtros.');

    clic(boton('Limpiar filtros'));
    expect(qa('article').length).toBe(productosIniciales.length);
  });

  it('impide agregar un producto agotado', () => {
    localStorage.setItem(
      CLAVES.tienda,
      JSON.stringify({ productos: [{ ...productosIniciales[0], stock: 0 }], carrito: [] }),
    );
    renderizarApp('/productos');
    expect(boton('Sin stock').disabled).toBe(true);
  });

  it('abre el detalle por la URL, agrega varias unidades y muestra productos sugeridos', () => {
    renderizarApp('/productos/HM001');
    expect(titulo()).toBe('Martillo carpintero 500g');
    expect(qa('article').length).toBeGreaterThan(0);
    escribir(campo('Cantidad'), '3');
    clic(boton('Añadir al carrito'));
    expect(boton('Carrito (3)')).toBeDefined();
    expect(document.body.textContent).toContain('Martillo carpintero 500g agregado al carrito.');
  });

  it('muestra "Producto no encontrado" si el código no existe', () => {
    renderizarApp('/productos/NOEXISTE');
    expect(titulo()).toBe('Producto no encontrado');
  });
});

describe('carrito', () => {
  afterEach(limpiar);

  it('agrega, cambia cantidades, cancela vaciar y pasa al pago', async () => {
    renderizarApp('/productos');
    clic(qa('button').find((b) => b.textContent === 'Agregar al carrito'));
    clic(boton('Carrito (1)'));
    clic(q('[aria-label^="Agregar una unidad de"]'));
    expect(q('[aria-label^="Cantidad de"]').textContent).toBe('2');

    clic(boton('Vaciar carrito'));
    const dialogo = await esperar(() => q('[role=dialog]'));
    clic(boton('Cancelar', dialogo));
    await esperar(() => !q('[role=dialog]'));
    expect(q('[aria-label^="Cantidad de"]').textContent).toBe('2');

    clic(boton('Ir al pago'));
    expect(titulo()).toBe('Finalizar compra');
  });

  it('conserva el carrito al cerrar y volver a abrir la aplicación', () => {
    renderizarApp('/productos');
    clic(qa('button').find((b) => b.textContent === 'Agregar al carrito'));
    desmontarApp();
    renderizarApp('/carrito');
    expect(q('[aria-label^="Cantidad de"]').textContent).toBe('1');
    clic(botonQueContiene('Eliminar '));
    expect(document.body.textContent).toContain('Tu carrito está vacío.');
  });

  it('vacía el carrito mediante confirmación', async () => {
    localStorage.setItem(
      CLAVES.tienda,
      JSON.stringify({ productos: productosIniciales, carrito: [{ codigo: 'MC001', cantidad: 1 }] }),
    );
    renderizarApp('/carrito');
    clic(boton('Vaciar carrito'));
    const dialogo = await esperar(() => q('[role=dialog]'));
    clic(boton('Confirmar', dialogo));
    await esperar(() => document.body.textContent.includes('Tu carrito está vacío.'));
  });

  it('el carrito toma el precio nuevo cuando el catálogo cambia', () => {
    const cambiados = productosIniciales.map((p) => (p.codigo === 'MC001' ? { ...p, precioVenta: 10000 } : p));
    localStorage.setItem(
      CLAVES.tienda,
      JSON.stringify({ productos: cambiados, carrito: [{ codigo: 'MC001', cantidad: 2 }] }),
    );
    renderizarApp('/carrito');
    expect(document.body.textContent).toContain('Subtotal: $17.000');
  });
});

describe('administración y contacto', () => {
  afterEach(limpiar);

  async function rellenarProducto(nombre = 'Escalera de aluminio') {
    const dialogo = q('[role=dialog]');
    escribir(campo('Código', dialogo), 'EE001');
    escribir(campo('Nombre del producto', dialogo), nombre);
    escribir(campo('Categoría', dialogo), 'Herramientas');
    escribir(campo('Subcategoría', dialogo), 'Escaleras');
    escribir(campo('Marca', dialogo), 'Stanley');
    escribir(campo('Unidad', dialogo), 'Unidad');
    escribir(campo('Precio de compra', dialogo), '20000');
    escribir(campo('Precio de venta', dialogo), '35000');
    escribir(campo('Stock', dialogo), '3');
    escribir(campo('Stock mínimo', dialogo), '1');
  }

  pendiente('crea y edita un producto mediante el modal', async () => {
    iniciarSesionAdmin();
    renderizarApp('/admin');
    clic(boton('Nuevo producto'));
    await esperar(() => q('[role=dialog]'));
    await rellenarProducto();
    clic(boton('Guardar producto'));
    await esperar(() => !q('[role=dialog]'));
    expect(botonQueContiene('Editar Escalera de aluminio')).toBeDefined();
    expect(guardado().productos.length).toBe(productosIniciales.length + 1);

    clic(botonQueContiene('Editar Escalera de aluminio'));
    await esperar(() => q('[role=dialog]'));
    expect(campo('Código', q('[role=dialog]')).disabled).toBe(true);
    escribir(campo('Precio de venta', q('[role=dialog]')), '40000');
    clic(boton('Guardar producto'));
    await esperar(() => !q('[role=dialog]'));
    const fila = qa('tr').find((tr) => tr.textContent.includes('Escalera de aluminio'));
    expect(fila.textContent).toContain('40.000');
  });

  pendiente('muestra errores del formulario y rechaza un código repetido', async () => {
    iniciarSesionAdmin();
    renderizarApp('/admin');
    clic(boton('Nuevo producto'));
    await esperar(() => q('[role=dialog]'));
    clic(boton('Guardar producto'));
    expect(q('[role=dialog]').textContent).toContain('El precio de venta debe ser mayor que cero.');
    await rellenarProducto();
    escribir(campo('Código', q('[role=dialog]')), 'MC001');
    clic(boton('Guardar producto'));
    expect(q('[role=dialog]').textContent).toContain('Ya existe un producto con ese código.');
  });

  pendiente('cancela y confirma la eliminación, retirando el producto del carrito', async () => {
    iniciarSesionAdmin();
    localStorage.setItem(
      CLAVES.tienda,
      JSON.stringify({ productos: productosIniciales, carrito: [{ codigo: 'MC001', cantidad: 1 }] }),
    );
    renderizarApp('/admin');
    clic(botonQueContiene('Eliminar Cemento Polpaico gris 25 kg'));
    let dialogo = await esperar(() => q('[role=dialog]'));
    clic(boton('Cancelar', dialogo));
    await esperar(() => !q('[role=dialog]'));
    expect(guardado().productos.length).toBe(productosIniciales.length); // cancelar no cambia nada

    clic(botonQueContiene('Eliminar Cemento Polpaico gris 25 kg'));
    dialogo = await esperar(() => q('[role=dialog]'));
    clic(boton('Confirmar', dialogo));
    await esperar(() => !q('[role=dialog]'));
    await esperar(() => guardado()?.productos.length === productosIniciales.length - 1);
    expect(guardado().carrito).toEqual([]);
  });

  it('valida el formulario de contacto en tiempo real y al enviar', () => {
    renderizarApp('/contacto');
    escribir(campo('Nombre'), 'Pedro2');
    expect(q('#error-nombre').textContent).toContain('sin números');

    clic(q('form button[type=submit]'));
    expect(q('#error-email').textContent).toContain('correo electrónico válido');

    escribir(campo('Nombre'), 'Pedro');
    escribir(campo('Apellido'), 'Pérez');
    escribir(campo('Correo electrónico'), 'pedro@correo.cl');
    escribir(campo('RUT'), '12345678-9');
    escribir(campo('Celular'), '912345678');
    clic(q('form button[type=submit]'));
    expect(document.body.textContent).toContain('Mensaje enviado con éxito');
  });
});
