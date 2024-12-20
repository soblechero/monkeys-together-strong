import apiClient from '@/services/api/apiClient';
import {setAuthToken, setUserEmailToPreferences} from '@/services/preferences';
import {handleApiError} from '@/services/api';
import {Token, User} from '@/types';

const login = async (email: string, password: string): Promise<string> => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    try {
        const response = await apiClient.post<Token>('/login', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        await setUserEmailToPreferences(email);
        await setAuthToken(response.data.access_token);
        return response.data.access_token;
    } catch (error) {
        throw handleApiError(error, 'Login failed.');
    }
};

const signup = async (name: string, email: string, password: string): Promise<string> => {
    const user: User = {name, email, password};
    try {
        const response = await apiClient.post<Token>('/signup', user);
        await setUserEmailToPreferences(email);
        await setAuthToken(response.data.access_token);
        return response.data.access_token;
    } catch (error) {
        throw handleApiError(error, 'Signup failed.');
    }
};

export {login, signup};
