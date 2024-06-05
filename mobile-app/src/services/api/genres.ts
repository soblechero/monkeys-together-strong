import apiClient from './apiClient';
import {addGenreToPreferences, removeGenreFromPreferences, setPreferenceGenres} from '@/services/preferences';
import {handleApiError} from '@/services/api';
import {Genre} from "@/types";

const fetchGenres = async (): Promise<string[]> => {
    const response = await apiClient.get('/genres');
    return response.data;
};

const fetchFavoriteGenres = async (): Promise<string[]> => {
    const response = await apiClient.get('/user/genres');
    return response.data;
};

const creteOrUpdateFavoriteGenres = async (genres: string[]): Promise<void> => {
    try {
        await apiClient.put('/user/genres', {genres: genres});
        await setPreferenceGenres(genres);
    } catch (error) {
        throw handleApiError(error, 'Failed to update user genres.');
    }
};

const addGenreToFavorites = async (genreName: string): Promise<void> => {
    try {
        const genre: Genre = {name: genreName}
        await apiClient.post('/user/genres', genre);
        await addGenreToPreferences(genreName);
    } catch (error) {
        throw handleApiError(error, 'Failed to add genre to favorites.');
    }
};

const removeGenreFromFavorites = async (genreName: string): Promise<void> => {
    try {
        await apiClient.delete(`/user/genres/${genreName}`);
        await removeGenreFromPreferences(genreName);
    } catch (error) {
        throw handleApiError(error, 'Failed to remove genre from favorites.');
    }
};


export {
    fetchGenres,
    fetchFavoriteGenres,
    creteOrUpdateFavoriteGenres,
    addGenreToFavorites,
    removeGenreFromFavorites
};
