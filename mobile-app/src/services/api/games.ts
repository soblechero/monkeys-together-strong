import apiClient from './apiClient';
import {GamesList, GameSearchCriteria} from '@/types';
import {setSelectedGames} from '@/services/preferences/games';
import handleApiError from './handleApiError';
import {convertGamesList} from '@/utils/convertGameData';

const getGames = async (): Promise<GamesList> => {
    const response = await apiClient.get<GamesList>('/games');
    return convertGamesList(response.data);
};

const searchGames = async (genre?: string, name?: string, releaseDate?: Date, platform?: string): Promise<GamesList> => {
    if (!genre && !name && !releaseDate && !platform) {
        throw new Error('At least one search criteria must be provided.');
    }

    const criteria: GameSearchCriteria = {};
    if (genre) criteria.genre = genre;
    if (name) criteria.name = name;
    if (releaseDate) criteria.releaseDate = releaseDate;
    if (platform) criteria.platform = platform;

    const response = await apiClient.get<GamesList>('/games/search', {params: criteria});
    return convertGamesList(response.data);
};

const getUserGames = async (): Promise<GamesList> => {
    const response = await apiClient.get<GamesList>('/user/games');
    return convertGamesList(response.data);
};

const updateUserGames = async (gameNames: string[]): Promise<void> => {
    try {
        await apiClient.post('/user/games', {games: gameNames});
        await setSelectedGames(gameNames); // Actualiza las preferencias locales
    } catch (error) {
        throw handleApiError(error, 'Failed to update user games.');
    }
};

export {getGames, searchGames, getUserGames, updateUserGames};
