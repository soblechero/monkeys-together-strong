/**
 * Punto de entrada para todos los servicios API.
 *
 * Este módulo incluye:
 * - apiClient: Configuración del cliente Axios para manejar solicitudes HTTP con autenticación.
 * - auth: Servicios relacionados con la autenticación.
 * - genres: Servicios relacionados con los géneros de juegos.
 * - handleApiError: Manejo de errores de la API.
 * - games: Servicios relacionados con los juegos.
 */
export { default as apiClient } from './apiClient';
export * from './auth';
export * from './genres';
export * from './handleApiError';
export * from './games';
