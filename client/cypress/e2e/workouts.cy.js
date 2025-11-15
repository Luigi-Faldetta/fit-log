/**
 * E2E Tests for Workouts Page
 *
 * Tests the main workouts listing, creation, and management functionality
 */

describe('Workouts Page', () => {
  beforeEach(() => {
    // Mock authentication
    cy.mockAuth();

    // Intercept API calls
    cy.intercept('GET', '/api/workouts', { fixture: 'workouts.json' }).as('getWorkouts');

    // Visit workouts page
    cy.visit('/workouts');
    cy.wait('@getWorkouts');
  });

  describe('Workout List Display', () => {
    it('should display the workouts page', () => {
      cy.get('h1').should('contain', 'Workouts');
    });

    it('should display list of workouts from API', () => {
      cy.findByText('Morning Cardio').should('be.visible');
      cy.findByText('Evening Strength').should('be.visible');
      cy.findByText('Leg Day').should('be.visible');
    });

    it('should display workout descriptions', () => {
      cy.findByText('30 minute cardio session').should('be.visible');
      cy.findByText('Upper body workout').should('be.visible');
    });

    it('should display workout count', () => {
      cy.contains(/3\s+(workouts?|total)/i).should('be.visible');
    });
  });

  describe('Workout Creation', () => {
    it('should show create workout button', () => {
      cy.findByRole('button', { name: /new workout|create|add/i }).should('be.visible');
    });

    it('should open create workout form when button clicked', () => {
      cy.findByRole('button', { name: /new workout|create|add/i }).click();
      cy.findByLabelText(/workout name/i).should('be.visible');
    });

    it('should create a new workout with valid data', () => {
      // Setup intercept for POST request
      cy.intercept('POST', '/api/workouts', {
        statusCode: 201,
        body: {
          workout_id: 4,
          name: 'New Test Workout',
          description: 'Test description',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }).as('createWorkout');

      // Open form and fill it
      cy.findByRole('button', { name: /new workout|create|add/i }).click();
      cy.fillWorkoutForm({
        name: 'New Test Workout',
        description: 'Test description',
      });

      // Submit form
      cy.findByRole('button', { name: /save|create|submit/i }).click();

      // Wait for API call
      cy.wait('@createWorkout');

      // Verify success message or redirect
      cy.findByText(/workout created|success/i).should('be.visible');
    });

    it('should show validation error for empty workout name', () => {
      cy.findByRole('button', { name: /new workout|create|add/i }).click();

      // Try to submit without filling name
      cy.findByRole('button', { name: /save|create|submit/i }).click();

      // Should show validation error
      cy.findByText(/workout name.*required|name.*empty/i).should('be.visible');
    });

    it('should show validation error for workout name too long', () => {
      cy.findByRole('button', { name: /new workout|create|add/i }).click();

      const longName = 'a'.repeat(256);
      cy.fillWorkoutForm({ name: longName });
      cy.findByRole('button', { name: /save|create|submit/i }).click();

      cy.findByText(/255 characters/i).should('be.visible');
    });
  });

  describe('Workout Navigation', () => {
    it('should navigate to workout details when workout clicked', () => {
      cy.intercept('GET', '/api/workouts/1', { fixture: 'workout-details.json' }).as('getWorkoutDetails');

      cy.findByText('Morning Cardio').click();

      cy.url().should('include', '/workouts/1');
      cy.wait('@getWorkoutDetails');
    });

    it('should navigate to workout details using keyboard', () => {
      cy.intercept('GET', '/api/workouts/1', { fixture: 'workout-details.json' }).as('getWorkoutDetails');

      cy.findByText('Morning Cardio').focus().type('{enter}');

      cy.url().should('include', '/workouts/1');
    });
  });

  describe('Workout Search/Filter', () => {
    it('should filter workouts by search term', () => {
      // If search functionality exists
      cy.get('input[type="search"], input[placeholder*="search" i]').then(($input) => {
        if ($input.length > 0) {
          cy.wrap($input).type('Cardio');
          cy.findByText('Morning Cardio').should('be.visible');
          cy.findByText('Evening Strength').should('not.exist');
        }
      });
    });
  });

  describe('Empty State', () => {
    it('should display empty state when no workouts exist', () => {
      cy.intercept('GET', '/api/workouts', { body: [] }).as('getEmptyWorkouts');

      cy.visit('/workouts');
      cy.wait('@getEmptyWorkouts');

      cy.findByText(/no workouts|get started|create your first/i).should('be.visible');
    });
  });

  describe('Error Handling', () => {
    it('should display error message when API fails', () => {
      cy.intercept('GET', '/api/workouts', {
        statusCode: 500,
        body: { error: 'Internal server error' },
      }).as('getWorkoutsError');

      cy.visit('/workouts');
      cy.wait('@getWorkoutsError');

      cy.findByText(/error|failed|try again/i).should('be.visible');
    });

    it('should handle network error gracefully', () => {
      cy.intercept('GET', '/api/workouts', { forceNetworkError: true }).as('networkError');

      cy.visit('/workouts');

      cy.findByText(/network|offline|connection/i).should('be.visible');
    });
  });

  describe('Accessibility', () => {
    it('should have proper page title', () => {
      cy.title().should('include', 'Workouts');
    });

    it('should have accessible workout cards', () => {
      cy.get('[role="button"], a').first().should('have.attr', 'tabindex');
    });

    it('should support keyboard navigation', () => {
      cy.get('body').tab();
      cy.focused().should('be.visible');
    });
  });

  describe('Loading State', () => {
    it('should show loading indicator while fetching workouts', () => {
      cy.intercept('GET', '/api/workouts', {
        delay: 1000,
        fixture: 'workouts.json',
      }).as('slowWorkouts');

      cy.visit('/workouts');

      // Should show loading state
      cy.get('[aria-busy="true"], [role="status"]').should('exist');

      cy.wait('@slowWorkouts');

      // Loading should disappear
      cy.get('[aria-busy="true"]').should('not.exist');
    });
  });
});
