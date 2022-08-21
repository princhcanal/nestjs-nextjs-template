/// <reference types="Cypress" />

Cypress.Commands.add('resetTestData', () => {
  const baseUrl = 'localhost:5001';
  const urlPath = '/api/v1/e2e/reset-test-data';
  const url = baseUrl + urlPath;

  return cy.request({ method: 'POST', url, timeout: 60000 }).wait(1000);
});

Cypress.Commands.add('getBySel', (selector: string, ...children: string[]) => {
  return cy.get(`[data-cy=${selector}] ${children ? children.join(' ') : ''}`);
});

Cypress.Commands.add('containsBySel', (selector: string, text: string) => {
  return cy.contains(`[data-cy=${selector}]`, text);
});
