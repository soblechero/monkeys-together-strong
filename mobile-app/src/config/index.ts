/**
 * Configuración de la aplicación.
 *
 * - backendUrl: La URL base para las solicitudes API, definida en las variables de entorno.
 * - isDevelopment: Indica si la aplicación está en modo de desarrollo.
 * - mode: El modo en el que está ejecutándose la aplicación (puede ser 'development', 'production', etc.).
 * - useMocks: Indica si se deben usar datos simulados (mocks), definido en las variables de entorno.
 */
const config = {
    backendUrl: import.meta.env.VITE_API_BASE_URL,
    isDevelopment: import.meta.env.DEV,
    mode: import.meta.env.MODE,
    useMocks: import.meta.env.VITE_USE_MOCKS,
};

export default config;
