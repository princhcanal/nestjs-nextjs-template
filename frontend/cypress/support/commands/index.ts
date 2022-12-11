/// <reference types="Cypress" />

import './common';
import './auth';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to reset test data
       * @example cy.resetTestData()
       */
      resetTestData(): void;

      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.getBySel('greeting')
       */
      getBySel(
        selector: string,
        ...children: string[]
      ): Chainable<JQuery<HTMLElement>>;

      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.containsBySel('btn', 'Add')
       */
      containsBySel(selector: string, text: string): Chainable<JQuery<Element>>;

      /**
       * Custom command to log in
       * @example cy.login('test@test.com', 'test')
       */
      login(email: string, password: string): void;

      /**
       * Custom command to register
       * @example cy.register('test', 'test@test.com', 'test')
       * @example cy.register('test', 'test@test.com', 'test', true)
       */
      register(
        username: string,
        email: string,
        password: string,
        shouldFail?: boolean
      ): void;

      /**
       * Custom command to reset test data then log in
       * @example cy.resetTestDataAndLogin('test@test.com', 'test')
       */
      resetTestDataAndLogin(email?: string, password?: string): void;
    }
  }
}
