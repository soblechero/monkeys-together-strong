import {Game} from '@/types';

export const games = (data: any): Game => {
    return {
        ...data,
        releaseDate: new Date(data.releaseDate), // Asegura que releaseDate sea un objeto Date
    };
};

export const convertGamesList = (data: any[]): Game[] => {
    return data.map(games);
};

export const groupGamesByProvidedGenres = (gamesList: Game[], genres: string[]): Record<string, Game[]> => {
    return genres.reduce((acc, genre) => {
        acc[genre] = gamesList.filter(game => game.genres.includes(genre));
        return acc;
    }, {} as Record<string, Game[]>);
};

export const groupGamesByGameGenres = (gamesList: Game[]): Record<string, Game[]> => {
    return gamesList.reduce((acc, game) => {
        game.genres.forEach(genre => {
            if (!acc[genre]) {
                acc[genre] = [];
            }
            acc[genre].push(game);
        });
        return acc;
    }, {} as Record<string, Game[]>);
};