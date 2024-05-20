import axios, { AxiosRequestHeaders } from 'axios';
import {getAuthToken, removeAuthToken } from '@/services/preferences';
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
    return config;
}, (error) => {
    return Promise.reject(error);
});

apiClient.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    if (error.response && error.response.status === 401) {
        await removeAuthToken();
        await router.push('/auth');
    }
    return Promise.reject(error);
});

export default apiClient;
