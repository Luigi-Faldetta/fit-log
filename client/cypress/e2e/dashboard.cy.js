/**
 * E2E Tests for Dashboard Page
 *
 * Tests the main dashboard/home page with statistics and quick access
 */

describe('Dashboard Page', () => {
  beforeEach(() => {
    cy.mockAuth();

    // Mock API responses
    cy.intercept('GET', '/api/workouts', { fixture: 'workouts.json' }).as('getWorkouts');
    cy.intercept('GET', '/api/profile', { fixture: 'profile.json' }).as('getProfile');
    cy.intercept('GET', '/api/stats*', {
      body: {
        totalWorkouts: 3,
        totalExercises: 15,
        workoutsThisWeek: 2,
        workoutsThisMonth: 8,
      },
    }).as('getStats');

    cy.visit('/');
  });

  describe('Dashboard Display', () => {
    it('should display the dashboard', () => {
      cy.get('h1, h2').should('contain.text', /dashboard|home|welcome/i);
    });

    it('should display user greeting', () => {
      cy.wait('@getProfile');
      cy.findByText(/welcome|hello|hi/i).should('be.visible');
    });

    it('should display workout statistics', () => {
      cy.wait('@getStats');

      // Check for various stats
      cy.contains(/total.*workout/i).should('be.visible');
      cy.contains(/3/).should('be.visible'); // Total workouts
    });

    it('should display recent workouts section', () => {
      cy.wait('@getWorkouts');

      cy.findByText(/recent.*workout/i).should('be.visible');
    });

    it('should display recent workouts', () => {
      cy.wait('@getWorkouts');

      cy.findByText('Morning Cardio').should('be.visible');
      cy.findByText('Evening Strength').should('be.visible');
    });
  });

  describe('Quick Actions', () => {
    it('should have quick action to create new workout', () => {
      cy.findByRole('link', { name: /new workout|add workout|create/i }).should('be.visible');
    });

    it('should navigate to workouts page from quick action', () => {
      cy.findByRole('link', { name: /view.*workout|all workout/i }).click();

      cy.url().should('include', '/workouts');
    });

    it('should navigate to profile page from quick action', () => {
      cy.findByRole('link', { name: /profile|settings/i }).click();

      cy.url().should('include', '/profile');
    });

    it('should navigate to AI workout generator', () => {
      cy.findByRole('link', { name: /ai.*workout|generate/i }).then(($link) => {
        if ($link.length > 0) {
          cy.wrap($link).click();
          cy.url().should('include', '/ai-workout');
        }
      });
    });
  });

  describe('Navigation Cards', () => {
    it('should navigate to workout details from recent workout', () => {
      cy.wait('@getWorkouts');

      cy.intercept('GET', '/api/workouts/1', { fixture: 'workout-details.json' }).as('getWorkoutDetails');

      cy.findByText('Morning Cardio').click();

      cy.url().should('include', '/workouts/1');
    });

    it('should show workout date on recent workouts', () => {
      cy.wait('@getWorkouts');

      // Should show some form of date/time
      cy.contains(/jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|ago|hours|days/i).should('be.visible');
    });
  });

  describe('Statistics Cards', () => {
    it('should display workouts this week', () => {
      cy.wait('@getStats');

      cy.contains(/this week/i).should('be.visible');
      cy.contains(/2/).should('be.visible');
    });

    it('should display workouts this month', () => {
      cy.wait('@getStats');

      cy.contains(/this month/i).should('be.visible');
      cy.contains(/8/).should('be.visible');
    });

    it('should display total exercises', () => {
      cy.wait('@getStats');

      cy.contains(/exercise/i).should('be.visible');
      cy.contains(/15/).should('be.visible');
    });
  });

  describe('Progress Tracking', () => {
    it('should display body weight progress if available', () => {
      cy.wait('@getProfile');

      cy.contains(/weight|progress/i).then(($el) => {
        if ($el.length > 0) {
          cy.contains(/kg|lbs|75|74/i).should('be.visible');
        }
      });
    });

    it('should display body fat progress if available', () => {
      cy.wait('@getProfile');

      cy.contains(/body fat|bf%/i).then(($el) => {
        if ($el.length > 0) {
          cy.contains(/18|17|%/i).should('be.visible');
        }
      });
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no workouts exist', () => {
      cy.intercept('GET', '/api/workouts', { body: [] }).as('getEmptyWorkouts');
      cy.intercept('GET', '/api/stats*', {
        body: {
          totalWorkouts: 0,
          totalExercises: 0,
          workoutsThisWeek: 0,
          workoutsThisMonth: 0,
        },
      }).as('getEmptyStats');

      cy.visit('/');
      cy.wait('@getEmptyWorkouts');

      cy.findByText(/get started|no workout|create your first/i).should('be.visible');
    });

    it('should show CTA button in empty state', () => {
      cy.intercept('GET', '/api/workouts', { body: [] }).as('getEmptyWorkouts');

      cy.visit('/');
      cy.wait('@getEmptyWorkouts');

      cy.findByRole('button', { name: /create|get started|add/i }).should('be.visible');
    });
  });

  describe('Error Handling', () => {
    it('should handle stats API error gracefully', () => {
      cy.intercept('GET', '/api/stats*', {
        statusCode: 500,
        body: { error: 'Internal server error' },
      }).as('getStatsError');

      cy.visit('/');
      cy.wait('@getStatsError');

      // Should still render page, maybe with fallback stats
      cy.get('h1, h2').should('exist');
    });

    it('should handle workouts API error gracefully', () => {
      cy.intercept('GET', '/api/workouts', {
        statusCode: 500,
        body: { error: 'Internal server error' },
      }).as('getWorkoutsError');

      cy.visit('/');
      cy.wait('@getWorkoutsError');

      cy.findByText(/error|failed|try again/i).should('be.visible');
    });
  });

  describe('Responsive Design', () => {
    it('should display correctly on mobile', () => {
      cy.viewport('iphone-x');
      cy.visit('/');

      cy.get('h1, h2').should('be.visible');
    });

    it('should display correctly on tablet', () => {
      cy.viewport('ipad-2');
      cy.visit('/');

      cy.get('h1, h2').should('be.visible');
    });

    it('should display correctly on desktop', () => {
      cy.viewport(1920, 1080);
      cy.visit('/');

      cy.get('h1, h2').should('be.visible');
    });
  });

  describe('Loading State', () => {
    it('should show loading state while fetching data', () => {
      cy.intercept('GET', '/api/workouts', {
        delay: 1000,
        fixture: 'workouts.json',
      }).as('slowWorkouts');

      cy.visit('/');

      cy.get('[aria-busy="true"], [role="status"]').should('exist');

      cy.wait('@slowWorkouts');

      cy.get('[aria-busy="true"]').should('not.exist');
    });
  });

  describe('Accessibility', () => {
    it('should have proper page title', () => {
      cy.title().should('match', /dashboard|home|fitlog/i);
    });

    it('should have main landmark', () => {
      cy.get('main, [role="main"]').should('exist');
    });

    it('should have skip to main content link', () => {
      cy.get('a[href="#main"], a[href="#content"]').then(($link) => {
        if ($link.length > 0) {
          cy.wrap($link).should('exist');
        }
      });
    });
  });
});
