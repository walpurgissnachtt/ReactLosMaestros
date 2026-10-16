// Preparación común de las pruebas con Vitest (se ejecuta antes de cada archivo de prueba).
// Con Karma/Jasmine no se usa: allí el navegador real ya trae estas APIs.
import { afterEach, beforeEach, vi } from 'vitest';

// Limpia almacenamiento y dobles de prueba para aislar cada caso.
beforeEach(() => localStorage.clear());
afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});
