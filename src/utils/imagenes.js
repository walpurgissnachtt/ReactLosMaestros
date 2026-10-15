// Las imágenes de los productos están en /public/assets/Productos/<codigo>.<extension>
export const EXTENSIONES = ['jpg', 'webp', 'png', 'avif'];
export const IMAGEN_RESPALDO = '/assets/img/montain.jfif';

// indice 0 prueba .jpg, 1 prueba .webp, ... y al agotarse devuelve la imagen de respaldo.
// Si el producto trae una URL propia (creado desde Admin), se usa esa y luego el respaldo.
export function rutaImagen(codigo, indice = 0, imagen = '') {
  if (imagen) return indice === 0 ? imagen : IMAGEN_RESPALDO;
  if (indice >= EXTENSIONES.length) return IMAGEN_RESPALDO;
  return `/assets/Productos/${codigo}.${EXTENSIONES[indice]}`;
}
