import { Game } from '@/types';

describe('SearchPage', () => {
    beforeEach(() => {
        cy.fixture('genres.json').as('genresData');
        cy.fixture('games.json').as('gamesData');
    });

    it('debería mostrar géneros y permitir buscar juegos', function () {
        const genres: string[] = this.genresData;
        const games: Game[] = this.gamesData;

        cy.intercept('GET', '/genres', {
            statusCode: 200,
            body: genres
        }).as('getGenres');

        cy.visit('/search');
        cy.wait('@fetchGenres');

        genres.forEach(genre => {
            cy.contains(genre).should('be.visible');
        });

        const searchQuery = games[0].name;
        cy.intercept('GET', '/games/search', {
            statusCode: 200,
            body: [games[0]]
        }).as('searchGames');

        cy.get('ion-searchbar input').type(searchQuery);
        cy.contains('Games').click();

        cy.wait('@fetchGames');
        cy.contains(games[0].name).should('be.visible');
    });
});
