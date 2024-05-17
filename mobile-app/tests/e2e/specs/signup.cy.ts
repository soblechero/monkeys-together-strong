import { User } from '@/types';

describe('Signup', () => {
    beforeEach(() => {
        cy.fixture('users.json').as('usersData');
        cy.fixture('errors.json').as('errorData');
    });

    it('debería registrar con credenciales válidas', function () {
        const newUser: User = {
            username: 'testuser3',
            email: 'user3@test.dev',
            password: 'Test9012!',
            access_token: 'valid_token_for_user3'
        };

        cy.intercept('POST', '/signup', {
            statusCode: 201,
            body: { access_token: newUser.access_token }
        }).as('signupRequest');

        cy.visit('/auth');
        cy.contains('Signup').click();
        cy.get('input[placeholder="Username"]').type(newUser.username);
        cy.get('input[placeholder="Email"]').type(newUser.email);
        cy.get('input[placeholder="Password"]').type(newUser.password);
        cy.get('button').contains('Continue').click();

        cy.wait('@signupRequest');
        cy.url().should('eq', `${Cypress.config().baseUrl}/onboarding`);
    });

    it('debería fallar al intentar registrar con un email existente', function () {
        const users: User[] = this.usersData;
        const existingUser = users[0];

        cy.intercept('POST', '/signup', {
            statusCode: 400,
            body: { message: this.errorData.user_already_exists }
        }).as('signupRequest');

        cy.visit('/auth');
        cy.contains('Signup').click();
        cy.get('input[placeholder="Username"]').type('anotheruser');
        cy.get('input[placeholder="Email"]').type(existingUser.email);
        cy.get('input[placeholder="Password"]').type('AnotherPass123!');
        cy.get('button').contains('Continue').click();

        cy.wait('@signupRequest');
        cy.get('ion-text[color="danger"]').should('contain', this.errorData.user_already_exists);
    });
});
