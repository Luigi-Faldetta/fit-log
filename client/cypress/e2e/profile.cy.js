/**
 * E2E Tests for Profile Page
 *
 * Tests user profile viewing, editing, and body metrics tracking
 */

describe('Profile Page', () => {
  beforeEach(() => {
    cy.mockAuth();

    cy.intercept('GET', '/api/profile', { fixture: 'profile.json' }).as('getProfile');

    cy.visit('/profile');
    cy.wait('@getProfile');
  });

  describe('Profile Display', () => {
    it('should display the profile page', () => {
      cy.get('h1, h2').should('contain.text', /profile|settings/i);
    });

    it('should display user information', () => {
      cy.findByText('Test User').should('be.visible');
    });

    it('should display user age', () => {
      cy.contains(/25|age/i).should('be.visible');
    });

    it('should display experience level', () => {
      cy.contains(/intermediate|experience/i).should('be.visible');
    });
  });

  describe('Profile Editing', () => {
    it('should show edit profile button', () => {
      cy.findByRole('button', { name: /edit.*profile/i }).should('be.visible');
    });

    it('should allow editing user name', () => {
      cy.intercept('PUT', '/api/profile', {
        statusCode: 200,
        body: {
          user_id: 'test-user-123',
          name: 'Updated User',
          age: 25,
          experience_level: 'intermediate',
        },
      }).as('updateProfile');

      cy.findByRole('button', { name: /edit.*profile/i }).click();

      cy.findByLabelText(/name/i).clear().type('Updated User');
      cy.findByRole('button', { name: /save/i }).click();

      cy.wait('@updateProfile');
      cy.findByText('Updated User').should('be.visible');
    });

    it('should allow changing age', () => {
      cy.intercept('PUT', '/api/profile', {
        statusCode: 200,
        body: {
          user_id: 'test-user-123',
          name: 'Test User',
          age: 26,
          experience_level: 'intermediate',
        },
      }).as('updateProfile');

      cy.findByRole('button', { name: /edit.*profile/i }).click();

      cy.findByLabelText(/age/i).clear().type('26');
      cy.findByRole('button', { name: /save/i }).click();

      cy.wait('@updateProfile');
      cy.contains(/26/).should('be.visible');
    });

    it('should allow changing experience level', () => {
      cy.intercept('PUT', '/api/profile', {
        statusCode: 200,
        body: {
          user_id: 'test-user-123',
          name: 'Test User',
          age: 25,
          experience_level: 'advanced',
        },
      }).as('updateProfile');

      cy.findByRole('button', { name: /edit.*profile/i }).click();

      cy.findByLabelText(/experience/i).select('advanced');
      cy.findByRole('button', { name: /save/i }).click();

      cy.wait('@updateProfile');
      cy.contains(/advanced/i).should('be.visible');
    });

    it('should validate age is within acceptable range', () => {
      cy.findByRole('button', { name: /edit.*profile/i }).click();

      cy.findByLabelText(/age/i).clear().type('10');
      cy.findByRole('button', { name: /save/i }).click();

      cy.findByText(/age.*13|minimum.*age/i).should('be.visible');
    });

    it('should cancel editing when cancel clicked', () => {
      cy.findByRole('button', { name: /edit.*profile/i }).click();

      cy.findByLabelText(/name/i).clear().type('Changed Name');
      cy.findByRole('button', { name: /cancel/i }).click();

      cy.findByText('Test User').should('be.visible');
    });
  });

  describe('Body Weight Tracking', () => {
    it('should display body weight history', () => {
      cy.contains(/weight|body weight/i).should('be.visible');
      cy.contains(/75\.5|74\.8/).should('be.visible');
    });

    it('should show add weight button', () => {
      cy.findByRole('button', { name: /add.*weight|log.*weight/i }).should('be.visible');
    });

    it('should add new body weight entry', () => {
      cy.intercept('POST', '/api/weights', {
        statusCode: 201,
        body: {
          weight_id: 3,
          user_id: 'test-user-123',
          weight: 74.0,
          date: new Date().toISOString().split('T')[0],
        },
      }).as('addWeight');

      cy.findByRole('button', { name: /add.*weight|log.*weight/i }).click();

      cy.findByLabelText(/weight/i).type('74.0');
      cy.findByRole('button', { name: /save|add/i }).click();

      cy.wait('@addWeight');
      cy.contains(/74\.0/).should('be.visible');
    });

    it('should validate weight is within acceptable range', () => {
      cy.findByRole('button', { name: /add.*weight|log.*weight/i }).click();

      cy.findByLabelText(/weight/i).type('1000');
      cy.findByRole('button', { name: /save|add/i }).click();

      cy.findByText(/weight.*999|maximum.*weight/i).should('be.visible');
    });

    it('should display weight chart if available', () => {
      cy.get('canvas, svg').then(($chart) => {
        if ($chart.length > 0) {
          cy.wrap($chart).should('be.visible');
        }
      });
    });

    it('should delete weight entry', () => {
      cy.intercept('DELETE', '/api/weights/1', {
        statusCode: 204,
      }).as('deleteWeight');

      // Find delete button for first weight entry
      cy.contains(/75\.5/).parent().findByRole('button', { name: /delete|remove/i }).click();

      cy.findByRole('button', { name: /confirm|yes|delete/i }).click();

      cy.wait('@deleteWeight');
      cy.contains(/75\.5/).should('not.exist');
    });
  });

  describe('Body Fat Tracking', () => {
    it('should display body fat history', () => {
      cy.contains(/body fat|bf%/i).should('be.visible');
      cy.contains(/18\.5|17\.2/).should('be.visible');
    });

    it('should show add body fat button', () => {
      cy.findByRole('button', { name: /add.*body fat|log.*body fat/i }).should('be.visible');
    });

    it('should add new body fat entry', () => {
      cy.intercept('POST', '/api/bodyfat', {
        statusCode: 201,
        body: {
          bodyfat_id: 3,
          user_id: 'test-user-123',
          percentage: 16.5,
          date: new Date().toISOString().split('T')[0],
        },
      }).as('addBodyFat');

      cy.findByRole('button', { name: /add.*body fat|log.*body fat/i }).click();

      cy.findByLabelText(/percentage|body fat/i).type('16.5');
      cy.findByRole('button', { name: /save|add/i }).click();

      cy.wait('@addBodyFat');
      cy.contains(/16\.5/).should('be.visible');
    });

    it('should validate body fat percentage is within acceptable range', () => {
      cy.findByRole('button', { name: /add.*body fat|log.*body fat/i }).click();

      cy.findByLabelText(/percentage|body fat/i).type('80');
      cy.findByRole('button', { name: /save|add/i }).click();

      cy.findByText(/70|maximum.*body fat/i).should('be.visible');
    });

    it('should delete body fat entry', () => {
      cy.intercept('DELETE', '/api/bodyfat/1', {
        statusCode: 204,
      }).as('deleteBodyFat');

      cy.contains(/18\.5/).parent().findByRole('button', { name: /delete|remove/i }).click();

      cy.findByRole('button', { name: /confirm|yes|delete/i }).click();

      cy.wait('@deleteBodyFat');
      cy.contains(/18\.5/).should('not.exist');
    });
  });

  describe('Statistics Display', () => {
    it('should show current weight', () => {
      cy.contains(/current.*weight|latest.*weight/i).should('be.visible');
      cy.contains(/74\.8/).should('be.visible');
    });

    it('should show current body fat', () => {
      cy.contains(/current.*body fat|latest.*body fat/i).should('be.visible');
      cy.contains(/17\.2/).should('be.visible');
    });

    it('should show weight change if available', () => {
      // Check for weight change indicator (e.g., -0.7 kg)
      cy.contains(/\-0\.7|\+|\-/).then(($change) => {
        if ($change.length > 0) {
          cy.wrap($change).should('be.visible');
        }
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle profile fetch error', () => {
      cy.intercept('GET', '/api/profile', {
        statusCode: 500,
        body: { error: 'Internal server error' },
      }).as('getProfileError');

      cy.visit('/profile');
      cy.wait('@getProfileError');

      cy.findByText(/error|failed|try again/i).should('be.visible');
    });

    it('should handle weight creation error', () => {
      cy.intercept('POST', '/api/weights', {
        statusCode: 400,
        body: { error: 'Invalid weight data' },
      }).as('addWeightError');

      cy.findByRole('button', { name: /add.*weight|log.*weight/i }).click();

      cy.findByLabelText(/weight/i).type('75');
      cy.findByRole('button', { name: /save|add/i }).click();

      cy.wait('@addWeightError');
      cy.findByText(/error|failed|invalid/i).should('be.visible');
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no weight data exists', () => {
      cy.intercept('GET', '/api/profile', {
        body: {
          user_id: 'test-user-123',
          name: 'Test User',
          age: 25,
          experience_level: 'intermediate',
          bodyWeights: [],
          bodyFats: [],
        },
      }).as('getEmptyProfile');

      cy.visit('/profile');
      cy.wait('@getEmptyProfile');

      cy.findByText(/no.*weight.*data|start tracking/i).should('be.visible');
    });
  });

  describe('Accessibility', () => {
    it('should have proper page title', () => {
      cy.title().should('match', /profile|settings/i);
    });

    it('should have accessible form labels', () => {
      cy.findByRole('button', { name: /edit.*profile/i }).click();

      cy.get('input, select, textarea').each(($input) => {
        const id = $input.attr('id');
        if (id) {
          cy.get(`label[for="${id}"]`).should('exist');
        }
      });
    });
  });

  describe('Loading State', () => {
    it('should show loading state while fetching profile', () => {
      cy.intercept('GET', '/api/profile', {
        delay: 1000,
        fixture: 'profile.json',
      }).as('slowProfile');

      cy.visit('/profile');

      cy.get('[aria-busy="true"], [role="status"]').should('exist');

      cy.wait('@slowProfile');

      cy.get('[aria-busy="true"]').should('not.exist');
    });
  });
});
