import { Game } from '@/types';

describe('HomePage', () => {
    beforeEach(() => {
        cy.fixture('games.json').as('gamesData');
    });

    it('debería mostrar los juegos en la página principal', function () {
        const games: Game[] = this.gamesData;

        cy.intercept('GET', '/games', {
            statusCode: 200,
            body: games
        }).as('getGames');

        cy.visit('/home');
        cy.wait('@getGames');

        games.forEach(game => {
            cy.contains(game.name).should('be.visible');
            cy.get(`img[src="${game.artwork}"]`).should('be.visible');
        });
    });
});
