/**
 * Configuración del cliente Axios para manejar solicitudes HTTP con autenticación.
 * Este cliente agrega automáticamente el token de autenticación a las solicitudes
 * y maneja respuestas con errores de autenticación redirigiendo al usuario a la
 * página de inicio.
 */
import axios, {AxiosRequestHeaders} from 'axios';
import {getAuthToken, removeAuthToken} from '@/services/preferences';
import config from '@/config';
import router from '@/router';

const apiClient = axios.create({
    baseURL: config.backendUrl,
});

apiClient.interceptors.request.use(async (config) => {
    const token = await getAuthToken();
    if (!config.headers) {
        config.headers = {} as AxiosRequestHeaders;
    }
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    const baseURL = config.baseURL ?? '';
    const url = config.url ?? '';
    const fullUrl = `${baseURL}${url}?${new URLSearchParams(config.params)}`;
    console.log('URL completa:', fullUrl);

    return config;
}, (error) => {
    return Promise.reject(error);
});

apiClient.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    if (error.response?.status === 401) {
        await removeAuthToken();
        await router.push('/auth');
    }
    return Promise.reject(error);
});

export default apiClient;
