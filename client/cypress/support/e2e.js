// ***********************************************************
// This support file is processed and loaded automatically before
// your test files. Use this to set up custom commands and global
// configuration that applies to all E2E tests.
// ***********************************************************

import './commands';
import '@testing-library/cypress/add-commands';

// Prevent Cypress from failing tests on uncaught exceptions
// This is useful for handling expected errors in the application
Cypress.on('uncaught:exception', (err, runnable) => {
  // Return false to prevent test from failing
  // Only for expected errors - remove this in production testing
  if (err.message.includes('ResizeObserver')) {
    return false;
  }
  return true;
});

// Global before hook to set viewport size
beforeEach(() => {
  // Set consistent viewport for all tests
  cy.viewport(1280, 720);

  // Clear local storage and session storage before each test
  cy.clearLocalStorage();
  cy.clearCookies();
});
