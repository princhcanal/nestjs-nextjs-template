describe('register.spec.ts - Register Form', () => {
  beforeEach(() => {
    cy.resetTestData();
    cy.visit('/register');
  });

  it('should have username, email, and password fields and submit button', () => {
    cy.get('input').first().should('have.attr', 'name', 'username');

    cy.get('input').eq(1).should('have.attr', 'name', 'email');
    cy.get('input').eq(1).should('have.attr', 'type', 'email');

    cy.get('input').eq(2).should('have.attr', 'name', 'password');
    cy.get('input').eq(2).should('have.attr', 'type', 'password');

    cy.getBySel('register-submit-btn').should('exist');
  });

  it('should show errors when fields are empty', () => {
    cy.getBySel('register-submit-btn').click();

    cy.get('.chakra-form__error-message')
      .eq(0)
      .contains('Required')
      .should('exist');

    cy.get('.chakra-form__error-message')
      .eq(1)
      .contains('Required')
      .should('exist');

    cy.get('.chakra-form__error-message')
      .eq(2)
      .contains('Required')
      .should('exist');
  });

  it('should show error if email is invalid', () => {
    cy.get('input').eq(1).type('test');
    cy.get('input').eq(1).blur();

    cy.get('.chakra-form__error-message')
      .contains('Invalid email')
      .should('exist');
  });

  it('should show error if password is not at least 4 characters', () => {
    cy.get('input').eq(2).type('tes');
    cy.get('input').eq(2).blur();

    cy.get('.chakra-form__error-message')
      .contains('Password must be at least 4 characters')
      .should('exist');
  });

  it('should successfully register', () => {
    cy.register('test2', 'test2@test.com', 'test');

    cy.get('.chakra-heading').contains('Home').should('exist');
  });

  it('should not register with existing username and email', () => {
    cy.register('test', 'test@test.com', 'test', true);
  });
});
