import apiClient from './apiClient';
import {Game, GameSearchCriteria, GamesList} from '@/types';
import {setPreferenceGames, addGameToPreferences, removeGameFromPreferences} from '@/services/preferences';
import {handleApiError} from '@/services/api';
import {convertGamesList} from '@/utils/games';

const fetchGames = async (genres: string[], names: string[], releaseYears: number[], platforms: string[]): Promise<GamesList> => {
    const criteria: GameSearchCriteria = {};
    if (genres && genres.length > 0) criteria.genres = genres;
    if (names && names.length > 0) criteria.names = names;
    if (releaseYears && releaseYears.length > 0) criteria.releaseYears = releaseYears;
    if (platforms && platforms.length > 0) criteria.platforms = platforms;

    try {
        const response = await apiClient.get<GamesList>('/games', {params: criteria});
        return convertGamesList(response.data);
    } catch (error) {
        throw handleApiError(error, 'Failed to search games.');
    }
};

const fetchFavoriteGames = async (): Promise<GamesList> => {
    const response = await apiClient.get<GamesList>('/user/games');
    return convertGamesList(response.data);
};

const creteOrUpdateFavoriteGames = async (gameNames: string[]): Promise<void> => {
    try {
        await apiClient.put('/user/games', {games: gameNames});
        await setPreferenceGames(gameNames);
    } catch (error) {
        throw handleApiError(error, 'Failed to update user games.');
    }
};

const addGameToFavorites = async (gameName: string): Promise<void> => {
    try {
        await apiClient.post('/user/games', {game: gameName});
        await addGameToPreferences(gameName);
    } catch (error) {
        throw handleApiError(error, 'Failed to add game to favorites.');
    }
};

const removeGameFromFavorites = async (name: string): Promise<void> => {
    try {
        await apiClient.delete(`/user/games/${name}`);
        await removeGameFromPreferences(name);
    } catch (error) {
        throw handleApiError(error, 'Failed to remove game from favorites.');
    }
};

const fetchGameDetails = async (name: string): Promise<Game> => {
    const games = await fetchGames([], [name], [], []);
    if (games.length === 0) {
        throw new Error('Game not found');
    }
    return games[0];
};

const fetchSimilarGames = async (genres: string[]): Promise<Game[]> => {
    return await fetchGames(genres, [], [], []);
};


export {
    fetchGames,
    fetchFavoriteGames,
    creteOrUpdateFavoriteGames,
    addGameToFavorites,
    removeGameFromFavorites,
    fetchGameDetails,
    fetchSimilarGames
};
