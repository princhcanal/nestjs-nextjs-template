describe('Login Form', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should have email and password fields and submit button', () => {
    cy.get('input').first().should('have.attr', 'placeholder', 'Email');
    cy.get('input').first().should('have.attr', 'type', 'email');
    cy.get('input').eq(1).should('have.attr', 'placeholder', 'Password');
    cy.get('button').first().contains('Submit').should('exist');
  });
});
