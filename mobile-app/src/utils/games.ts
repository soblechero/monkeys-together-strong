import {Game} from '@/types';

const games = (data: any): Game => {
    return {
        ...data,
        releaseDate: new Date(data.releaseDate),
    };
};

const convertGamesList = (data: any[]): Game[] => {
    return data.map(games);
};

const groupGamesByProvidedGenres = (gamesList: Game[], genres: string[]): Record<string, Game[]> => {
    return genres.reduce((acc, genre) => {
        acc[genre] = gamesList.filter(game => game.genres.includes(genre));
        return acc;
    }, {} as Record<string, Game[]>);
};

const groupGamesByGameGenres = (gamesList: Game[]): Record<string, Game[]> => {
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

const truncateSummary = (summary: string, maxLength: number = 99) => {
    return summary.length > maxLength ? summary.substring(0, maxLength) + '...' : summary;
};


export {convertGamesList, groupGamesByProvidedGenres, groupGamesByGameGenres, truncateSummary};