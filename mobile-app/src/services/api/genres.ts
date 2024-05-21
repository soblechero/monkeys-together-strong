import apiClient from './apiClient';
import {addGenreToPreferences, removeGenreFromPreferences, setPreferenceGenres} from '@/services/preferences';
import {handleApiError} from '@/services/api';

const getGenres = async (): Promise<string[]> => {
    const response = await apiClient.get('/genres');
    return response.data;
};

const getUserGenres = async (): Promise<string[]> => {
    const response = await apiClient.get('/user/genres');
    return response.data;
};

const updateUserGenres = async (genres: string[]): Promise<void> => {
    try {
        await apiClient.post('/user/genres', {genres: genres});
        await setPreferenceGenres(genres);
    } catch (error) {
        throw handleApiError(error, 'Failed to update genres.');
    }
};

const addGenreToFavorites = async (name: string): Promise<void> => {
    try {
        await apiClient.post('/user/genre', {genre: name});
        await addGenreToPreferences(name);
    } catch (error) {
        throw handleApiError(error, 'Failed to add game to favorites.');
    }
};

const removeGenreFromFavorites = async (name: string): Promise<void> => {
    try {
        await apiClient.delete(`/user/genre/${name}`);
        await removeGenreFromPreferences(name);
    } catch (error) {
        throw handleApiError(error, 'Failed to remove game from favorites.');
    }
};


export {getGenres, getUserGenres, updateUserGenres, addGenreToFavorites, removeGenreFromFavorites};
