import { useState } from 'react';
import { rutaImagen } from '../utils/imagenes.js';

// Prueba .jpg, .webp, .png y .avif; si ninguna existe muestra la imagen de respaldo.
export default function ImagenProducto({ codigo, imagen = '', alt, className }) {
  const clave = `${codigo}|${imagen}`;
  // Se guarda junto a la clave para reiniciar el intento cuando cambia el producto
  const [intento, setIntento] = useState({ clave, indice: 0 });
  const indice = intento.clave === clave ? intento.indice : 0;
  return (
    <img
      src={rutaImagen(codigo, indice, imagen)}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setIntento({ clave, indice: indice + 1 })}
    />
  );
}
