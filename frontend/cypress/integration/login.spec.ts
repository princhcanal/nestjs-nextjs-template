describe('Login Form', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.intercept('/api/v1/auth/login').as('login');
  });

  xit('should successfully log in', () => {
    cy.get('input').first().should('have.attr', 'name', 'email');
    cy.get('input').first().should('have.attr', 'type', 'email');
    cy.get('input').first().type('test@test.com');

    cy.get('input').eq(1).should('have.attr', 'name', 'password');
    cy.get('input').eq(1).should('have.attr', 'type', 'password');
    cy.get('input').eq(1).type('test');

    cy.get('[data-cy="login-submit-btn"]').should('exist').click();
    cy.wait('@login');

    cy.get('[data-cy="home"]').contains('Home').should('exist');
  });

  it('should show errors when fields are empty', () => {
    cy.get('[data-cy="login-submit-btn"]').click();

    cy.get('.chakra-form__error-message')
      .eq(0)
      .contains('Required')
      .should('exist');

    cy.get('.chakra-form__error-message')
      .eq(1)
      .contains('Required')
      .should('exist');
  });

  it('should show error if email is invalid', () => {
    cy.get('input').first().type('test');
    cy.get('input').first().blur();

    cy.get('.chakra-form__error-message')
      .contains('Invalid email')
      .should('exist');
  });
});
