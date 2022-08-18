/// <reference types="Cypress" />

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.intercept('POST', '/api/v1/auth/login').as('login');

  cy.get('input').first().should('have.attr', 'name', 'email');
  cy.get('input').first().should('have.attr', 'type', 'email');
  cy.get('input').first().type(email);

  cy.get('input').eq(1).should('have.attr', 'name', 'password');
  cy.get('input').eq(1).should('have.attr', 'type', 'password');
  cy.get('input').eq(1).type(password);

  cy.getBySel('login-submit-btn').should('exist').click();
  cy.wait('@login');
});

Cypress.Commands.add(
  'register',
  (username: string, email: string, password: string, shouldFail?: boolean) => {
    cy.intercept('POST', '/api/v1/auth/register').as('register');

    cy.get('input').eq(0).type(username);
    cy.get('input').eq(1).type(email);
    cy.get('input').eq(2).type(password);

    cy.getBySel('register-submit-btn').click();
    cy.wait('@register')
      .its('response.statusCode')
      .should('eq', shouldFail ? 400 : 201);
  }
);

Cypress.Commands.add(
  'resetTestDataAndLogin',
  (email: string = 'test@test.com', password: string = 'test') => {
    cy.resetTestData();
    cy.login(email, password);
  }
);
