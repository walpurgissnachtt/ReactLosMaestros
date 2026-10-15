// Preparación común de las pruebas con Vitest (se ejecuta antes de cada archivo de prueba).
// Con Karma/Jasmine no se usa: allí el navegador real ya trae estas APIs.
import { afterEach, beforeEach, vi } from 'vitest';

beforeEach(() => localStorage.clear());
afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});
