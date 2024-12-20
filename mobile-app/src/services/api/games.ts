import apiClient from './apiClient';
import {Game, GameBase, GamesBaseList, GameSearchCriteria, GamesList} from '@/types';
import {setPreferenceGames, addGameToPreferences, removeGameFromPreferences} from '@/services/preferences';
import {handleApiError} from '@/services/api';
import {convertGamesList} from '@/utils/games';

const fetchGames = async (criteria: GameSearchCriteria): Promise<GamesList> => {
    const defaultCriteria = {
        limit: 50,
        offset: 0,
        ...criteria
    };
    try {
        const response = await apiClient.get<GamesList>('/games', {params: defaultCriteria});
        return convertGamesList(response.data);
    } catch (error) {
        throw handleApiError(error, 'Failed to fetch games.');
    }
};

const searchGames = async (criteria: GameSearchCriteria): Promise<GamesList> => {
    const defaultCriteria = {
        limit: 50,
        offset: 0,
        ...criteria
    };
    try {
        const response = await apiClient.get<GamesList>('/games/search', {params: defaultCriteria});
        return convertGamesList(response.data);
    } catch (error) {
        throw handleApiError(error, 'Failed to search games.');
    }
};

const fetchFavoriteGames = async (): Promise<string[]> => {
    try {
        const response = await apiClient.get<GamesBaseList>('/user/games');
        return response.data.map(game => game.name);
    } catch (error) {
        throw handleApiError(error, 'Failed to fetch user games.');
    }

};

const creteOrUpdateFavoriteGames = async (gameNames: string[]): Promise<void> => {
    try {
        const games: GamesBaseList = gameNames.map(name => ({name} as GameBase));
        await apiClient.put('/user/games', {games});
        await setPreferenceGames(gameNames);
    } catch (error) {
        throw handleApiError(error, 'Failed to update user games.');
    }
};

const addGameToFavorites = async (gameName: string): Promise<void> => {
    try {
        const game: GameBase = {name: gameName};
        await apiClient.post('/user/games', game);
        await addGameToPreferences(gameName);
    } catch (error) {
        throw handleApiError(error, 'Failed to add game to favorites.');
    }
};

const removeGameFromFavorites = async (gameName: string): Promise<void> => {
    try {
        await apiClient.delete(`/user/games/${gameName}`);
        await removeGameFromPreferences(gameName);
    } catch (error) {
        throw handleApiError(error, 'Failed to remove game from favorites.');
    }
};

const fetchGameDetails = async (gameName: string): Promise<Game> => {
    const games = await fetchGames({names: [gameName]});
    if (games.length === 0) {
        throw new Error('Game not found');
    }
    return games[0];
};

const fetchSimilarGames = async (genres: string[]): Promise<Game[]> => {
    return await fetchGames({genres: genres});
};


export {
    fetchGames,
    searchGames,
    fetchFavoriteGames,
    creteOrUpdateFavoriteGames,
    addGameToFavorites,
    removeGameFromFavorites,
    fetchGameDetails,
    fetchSimilarGames
};
