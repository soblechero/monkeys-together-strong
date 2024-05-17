import { User } from '@/types';

describe('Login', () => {
    beforeEach(() => {
        cy.fixture('users.json').as('usersData');
        cy.fixture('errors.json').as('errorData');
    });

    it('debería iniciar sesión con credenciales válidas', function () {
        const users: User[] = this.usersData;
        const validUser = users.find(user => user.email === 'user1@test.dev') as User;

        cy.intercept('POST', '/login', {
            statusCode: 200,
            body: { access_token: validUser.access_token }
        }).as('loginRequest');

        cy.visit('/auth');
        cy.get('input[placeholder="Email"]').type(validUser.email);
        cy.get('input[placeholder="Password"]').type(validUser.password);
        cy.get('button').contains('Continue').click();

        cy.wait('@loginRequest');
        cy.url().should('eq', `${Cypress.config().baseUrl}/`);
    });

    it('debería fallar el inicio de sesión con credenciales inválidas', function () {
        cy.intercept('POST', '/login', {
            statusCode: 401,
            body: { message: this.errorData.invalid_credentials }
        }).as('loginRequest');

        cy.visit('/auth');
        cy.get('input[placeholder="Email"]').type('invalid@test.dev');
        cy.get('input[placeholder="Password"]').type('wrongpassword');
        cy.get('button').contains('Continue').click();

        cy.wait('@loginRequest');
        cy.get('ion-text[color="danger"]').should('contain', this.errorData.invalid_credentials);
    });
});
