// ***********************************************
// Custom Cypress commands for FitLog E2E tests
// ***********************************************

/**
 * Custom command to mock authentication
 * Usage: cy.mockAuth()
 */
Cypress.Commands.add('mockAuth', (userId = 'test-user-123') => {
  cy.window().then((win) => {
    // Mock Clerk authentication
    win.localStorage.setItem('clerk-db-jwt', 'mock-jwt-token');
    win.localStorage.setItem('clerk-session', JSON.stringify({
      userId,
      sessionId: 'mock-session-id',
    }));
  });
});

/**
 * Custom command to mock API responses
 * Usage: cy.mockApiResponse('/api/workouts', { fixture: 'workouts.json' })
 */
Cypress.Commands.add('mockApiResponse', (url, options = {}) => {
  const { fixture, body, statusCode = 200 } = options;

  cy.intercept('GET', url, {
    statusCode,
    body: fixture ? undefined : body,
    fixture: fixture || undefined,
  }).as(options.alias || 'apiRequest');
});

/**
 * Custom command to wait for page load
 * Usage: cy.waitForPageLoad()
 */
Cypress.Commands.add('waitForPageLoad', () => {
  cy.window().should('have.property', 'document');
  cy.document().should('have.property', 'readyState', 'complete');
});

/**
 * Custom command to fill workout form
 * Usage: cy.fillWorkoutForm({ name: 'Morning Workout', description: 'Cardio' })
 */
Cypress.Commands.add('fillWorkoutForm', (data) => {
  if (data.name) {
    cy.get('input[name="name"]').clear().type(data.name);
  }
  if (data.description) {
    cy.get('textarea[name="description"]').clear().type(data.description);
  }
  if (data.date) {
    cy.get('input[name="date"]').clear().type(data.date);
  }
});

/**
 * Custom command to fill exercise form
 * Usage: cy.fillExerciseForm({ name: 'Bench Press', sets: 3, reps: 10, weight: 100 })
 */
Cypress.Commands.add('fillExerciseForm', (data) => {
  if (data.name) {
    cy.get('input[name="exerciseName"]').clear().type(data.name);
  }
  if (data.sets) {
    cy.get('input[name="sets"]').clear().type(data.sets.toString());
  }
  if (data.reps) {
    cy.get('input[name="reps"]').clear().type(data.reps.toString());
  }
  if (data.weight) {
    cy.get('input[name="weight"]').clear().type(data.weight.toString());
  }
});

/**
 * Custom command to check accessibility
 * Usage: cy.checkA11y()
 */
Cypress.Commands.add('checkA11y', () => {
  // Check for basic accessibility issues
  cy.get('img').each(($img) => {
    cy.wrap($img).should('have.attr', 'alt');
  });

  // Check for form labels
  cy.get('input[type="text"], input[type="number"], textarea').each(($input) => {
    const id = $input.attr('id');
    if (id) {
      cy.get(`label[for="${id}"]`).should('exist');
    }
  });
});

/**
 * Custom command to test keyboard navigation
 * Usage: cy.testKeyboardNav()
 */
Cypress.Commands.add('testKeyboardNav', (selector) => {
  cy.get(selector).first().focus();
  cy.focused().should('exist');
  cy.focused().type('{enter}');
});

/**
 * Custom command to login (for authenticated routes)
 * This assumes a login page exists
 * Usage: cy.login('user@example.com', 'password')
 */
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('not.include', '/login');
});
