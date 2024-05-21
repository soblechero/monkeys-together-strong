describe('Root', () => {
  it('Visits the app root url', () => {
    cy.visit('/')
    cy.contains('ion-segment-button', 'Login')
  })
})
