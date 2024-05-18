import apiClient from './apiClient';
import { setAuthToken } from '@/services/preferences';
import handleApiError from './handleApiError';
import { AuthResponse, User } from '@/types';

const login = async (email: string, password: string): Promise<string> => {
    const user: User = { email, password };
    try {
        const response = await apiClient.post<AuthResponse>('/login', user);
        await setAuthToken(response.data.access_token);
        return response.data.access_token;
    } catch (error) {
        throw handleApiError(error, 'Login failed.');
    }
};

const signup = async (username: string, email: string, password: string): Promise<string> => {
    const user: User = { username, email, password };
    try {
        const response = await apiClient.post<AuthResponse>('/signup', user);
        await setAuthToken(response.data.access_token);
        return response.data.access_token;
    } catch (error) {
        throw handleApiError(error, 'Signup failed.');
    }
};

export { login, signup };
