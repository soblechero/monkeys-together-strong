import axios, { AxiosRequestHeaders } from 'axios';
import { getAuthToken, setAuthToken, removeAuthToken } from '@/services/preferences';
import config from '@/config';
import router from '@/router';

const apiClient = axios.create({
    baseURL: config.backendUrl,
});

// Interceptor de solicitud para añadir el token a las cabeceras
apiClient.interceptors.request.use(async (config) => {
    console.log('interceptors.request');
    const token = await getAuthToken();
    if (!config.headers) {
        config.headers = {} as AxiosRequestHeaders;
    }
    if (token) {
        (config.headers as AxiosRequestHeaders).Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    console.log('error: interceptors.request');
    return Promise.reject(error);
});

// Interceptor de respuesta para manejar errores de autenticación
apiClient.interceptors.response.use((response) => {
    console.log('interceptors.response');
    return response;
}, async (error) => {
    console.log('error: interceptors.response');
    if (error.response && error.response.status === 401) {
        await removeAuthToken();
        await router.push('/auth');
    }
    return Promise.reject(error);
});

const login = async (email: string, password: string) => {
    console.log('api login request');
    const response = await apiClient.post('/login', { email, password });
    await setAuthToken(response.data.access_token);
    return response.data.access_token;
};

const signup = async (username: string, email: string, password: string) => {
    console.log('api signup request');
    const response = await apiClient.post('/signup', { username, email, password });
    await setAuthToken(response.data.access_token);
    return response.data.access_token;
};

export { apiClient, login, signup };
