import apiClient from './apiClient';
import {Game, GameSearchCriteria, GamesList} from '@/types';
import {setPreferenceGames, addGameToPreferences, removeGameFromPreferences} from '@/services/preferences';
import {handleApiError} from '@/services/api';
import {convertGamesList} from '@/utils/convertGameData';

const getGames = async (): Promise<GamesList> => {
    const response = await apiClient.get<GamesList>('/games');
    return convertGamesList(response.data);
};

const searchGames = async (genres: string[], names: string[], releaseYears: number[], platforms: string[]): Promise<GamesList> => {
    if (genres.length === 0 && names.length === 0 && releaseYears.length === 0 && platforms.length === 0) {
        throw new Error('At least one search criteria must be provided.');
    }

    const criteria: GameSearchCriteria = {};
    if (genres && genres.length > 0) criteria.genres = genres;
    if (names && names.length > 0) criteria.names = names;
    if (releaseYears && releaseYears.length > 0) criteria.releaseYears = releaseYears;
    if (platforms && platforms.length > 0) criteria.platforms = platforms;

    try {
        const response = await apiClient.get<GamesList>('/games/search', {params: criteria});
        return convertGamesList(response.data);
    } catch (error) {
        throw handleApiError(error, 'Failed to search games.');
    }
};

const getUserGames = async (): Promise<GamesList> => {
    const response = await apiClient.get<GamesList>('/user/games');
    return convertGamesList(response.data);
};

const updateUserGames = async (gameNames: string[]): Promise<void> => {
    try {
        await apiClient.post('/user/games', {games: gameNames});
        await setPreferenceGames(gameNames); // Actualiza las preferencias locales
    } catch (error) {
        throw handleApiError(error, 'Failed to update user games.');
    }
};

const addGameToFavorites = async (name: string): Promise<void> => {
    try {
        await apiClient.post('/user/game', { game: name });
        await addGameToPreferences(name);
    } catch (error) {
        throw handleApiError(error, 'Failed to add game to favorites.');
    }
};

const removeGameFromFavorites = async (name: string): Promise<void> => {
    try {
        await apiClient.delete(`/user/game/${name}`);
        await removeGameFromPreferences(name);
    } catch (error) {
        throw handleApiError(error, 'Failed to remove game from favorites.');
    }
};

const getGameDetails = async (name: string): Promise<Game> => {
    const games = await searchGames([], [name], [], []);
    if (games.length === 0) {
        throw new Error('Game not found');
    }
    return games[0];
};

const getSimilarGames = async (genres: string[]): Promise<Game[]> => {
    return await searchGames(genres, [], [], []);
};


export {
    getGames,
    searchGames,
    getUserGames,
    updateUserGames,
    addGameToFavorites,
    removeGameFromFavorites,
    getGameDetails,
    getSimilarGames
};
