describe('login.spec.ts - Login Form', () => {
  beforeEach(() => {
    cy.resetTestData();
    cy.visit('/login');
    cy.intercept('/api/v1/auth/logout').as('logout');
  });

  it('should successfully log in', () => {
    cy.login('test@test.com', 'test');
    cy.get('.chakra-heading').contains('Home').should('exist');
  });

  it('should successfully log out', () => {
    cy.login('test@test.com', 'test');

    // this check is needed for the "Log Out" button to be detected by cypress
    cy.get('.chakra-heading').contains('Home').should('exist');
    cy.get('.chakra-button').contains('Log Out').click();
    cy.wait('@logout');

    cy.url().should('contain', 'login');
  });

  it('should show errors when fields are empty', () => {
    cy.getBySel('login-submit-btn').click();

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
