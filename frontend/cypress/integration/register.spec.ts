describe('Register Form', () => {
  before(() => {
    cy.visit('/register');
  });

  it('should have username, email, and password fields and submit button', () => {
    cy.get('input').first().should('have.attr', 'name', 'username');

    cy.get('input').eq(1).should('have.attr', 'name', 'email');
    cy.get('input').eq(1).should('have.attr', 'type', 'email');

    cy.get('input').eq(2).should('have.attr', 'name', 'password');
    cy.get('input').eq(2).should('have.attr', 'type', 'password');

    cy.get('button').first().contains('Register').should('exist');
  });

  // TODO: implement test
  it('should show errors when fields are empty', () => {});

  // TODO: implement test
  it('should show errors when email field is wrong', () => {});

  // TODO: implement test
  it('should successfully register', () => {});
});
