import { describe, it, expect } from 'vitest';
import { convertGamesList, groupGamesByProvidedGenres, groupGamesByGameGenres } from '@/utils/games';
import { Game } from '@/types';

describe('Games Utils', () => {
    it('should convert a list of raw game data to Game instances', () => {
        const rawGames = [
            { name: 'Game 1', releaseDate: '2022-01-01', genres: ['Action'], thumb: '', artwork: '', howLongToBeat: 10, rating: 5, summary: '', platforms: [] },
            { name: 'Game 2', releaseDate: '2022-02-01', genres: ['Adventure'], thumb: '', artwork: '', howLongToBeat: 20, rating: 8, summary: '', platforms: [] },
        ];
        const games = convertGamesList(rawGames);
        expect(games[0].releaseDate).toBeInstanceOf(Date);
    });

    it('should group games by provided genres', () => {
        const gamesList: Game[] = [
            { name: 'Game 1', releaseDate: new Date('2022-01-01'), genres: ['Action', 'Adventure'], thumb: '', artwork: '', howLongToBeat: 10, rating: 5, summary: '', platforms: [] },
            { name: 'Game 2', releaseDate: new Date('2022-02-01'), genres: ['Adventure'], thumb: '', artwork: '', howLongToBeat: 20, rating: 8, summary: '', platforms: [] },
        ];
        const groupedGames = groupGamesByProvidedGenres(gamesList, ['Action', 'Adventure']);
        expect(groupedGames.Action).toHaveLength(1);
        expect(groupedGames.Adventure).toHaveLength(2);
    });

    it('should group games by their genres', () => {
        const gamesList: Game[] = [
            { name: 'Game 1', releaseDate: new Date('2022-01-01'), genres: ['Action', 'Adventure'], thumb: '', artwork: '', howLongToBeat: 10, rating: 5, summary: '', platforms: [] },
            { name: 'Game 2', releaseDate: new Date('2022-02-01'), genres: ['Adventure'], thumb: '', artwork: '', howLongToBeat: 20, rating: 8, summary: '', platforms: [] },
        ];
        const groupedGames = groupGamesByGameGenres(gamesList);
        expect(groupedGames.Action).toHaveLength(1);
        expect(groupedGames.Adventure).toHaveLength(2);
    });
});
