import apiClient from './apiClient';
import { GenresList } from '@/types/genres';
import { setSelectedGenres } from '@/services/preferences/selectedGenres';
import handleApiError from './handleApiError';

const getGenres = async (): Promise<GenresList> => {
    const response = await apiClient.get<GenresList>('/genres');
    return response.data;
};

const getUserGenres = async (): Promise<GenresList> => {
    const response = await apiClient.get<GenresList>('/user/genres');
    return response.data;
};

const updateUserGenres = async (genres: string[]): Promise<void> => {
    const request: GenresList = { genres };
    try {
        await apiClient.post('/user/genres', request);
        await setSelectedGenres(genres);
    } catch (error) {
        throw handleApiError(error, 'Failed to update genres.');
    }
};

export { getGenres, getUserGenres, updateUserGenres };
