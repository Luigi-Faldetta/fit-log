/**
 * E2E Tests for AI Workout Generator Page
 *
 * Tests AI-powered workout generation functionality
 */

describe('AI Workout Generator', () => {
  beforeEach(() => {
    cy.mockAuth();

    cy.intercept('GET', '/api/profile', { fixture: 'profile.json' }).as('getProfile');

    cy.visit('/ai-workout');
  });

  describe('Page Display', () => {
    it('should display AI workout generator page', () => {
      cy.get('h1, h2').should('contain.text', /ai.*workout|generate.*workout/i);
    });

    it('should display description or instructions', () => {
      cy.findByText(/generate|create|ai|personalized/i).should('be.visible');
    });

    it('should display workout generation form', () => {
      cy.get('form, [role="form"]').should('be.visible');
    });
  });

  describe('Form Fields', () => {
    it('should have goal/focus field', () => {
      cy.findByLabelText(/goal|focus|objective/i).should('be.visible');
    });

    it('should have duration field', () => {
      cy.findByLabelText(/duration|length|time/i).should('be.visible');
    });

    it('should have difficulty/intensity field', () => {
      cy.findByLabelText(/difficulty|intensity|level/i).should('be.visible');
    });

    it('should have equipment field', () => {
      cy.findByLabelText(/equipment|tools|gear/i).then(($field) => {
        if ($field.length > 0) {
          cy.wrap($field).should('be.visible');
        }
      });
    });

    it('should have additional notes/preferences field', () => {
      cy.findByLabelText(/notes|preferences|additional|custom/i).then(($field) => {
        if ($field.length > 0) {
          cy.wrap($field).should('be.visible');
        }
      });
    });
  });

  describe('Workout Generation', () => {
    it('should generate workout with valid inputs', () => {
      cy.intercept('POST', '/api/ai/generate-workout', {
        statusCode: 200,
        body: {
          name: 'AI Generated HIIT Workout',
          description: 'High-intensity interval training workout',
          exercises: [
            { name: 'Burpees', sets: 3, reps: 15, weight: 0 },
            { name: 'Mountain Climbers', sets: 3, reps: 20, weight: 0 },
            { name: 'Jump Squats', sets: 3, reps: 12, weight: 0 },
          ],
        },
      }).as('generateWorkout');

      cy.findByLabelText(/goal|focus/i).type('Build endurance and burn fat');
      cy.findByLabelText(/duration/i).type('30');
      cy.findByLabelText(/difficulty|intensity/i).select('intermediate');

      cy.findByRole('button', { name: /generate|create/i }).click();

      cy.wait('@generateWorkout');

      cy.findByText('AI Generated HIIT Workout').should('be.visible');
    });

    it('should display generated exercises', () => {
      cy.intercept('POST', '/api/ai/generate-workout', {
        statusCode: 200,
        body: {
          name: 'AI Generated Workout',
          description: 'Custom workout',
          exercises: [
            { name: 'Push-ups', sets: 3, reps: 15, weight: 0 },
            { name: 'Squats', sets: 4, reps: 12, weight: 0 },
          ],
        },
      }).as('generateWorkout');

      cy.findByLabelText(/goal|focus/i).type('Upper and lower body strength');
      cy.findByLabelText(/duration/i).type('45');

      cy.findByRole('button', { name: /generate|create/i }).click();

      cy.wait('@generateWorkout');

      cy.findByText('Push-ups').should('be.visible');
      cy.findByText('Squats').should('be.visible');
      cy.contains(/3\s*×\s*15|3 sets.*15 reps/i).should('be.visible');
    });

    it('should allow saving generated workout', () => {
      cy.intercept('POST', '/api/ai/generate-workout', {
        statusCode: 200,
        body: {
          name: 'AI Generated Workout',
          description: 'Custom workout',
          exercises: [
            { name: 'Lunges', sets: 3, reps: 12, weight: 0 },
          ],
        },
      }).as('generateWorkout');

      cy.intercept('POST', '/api/workouts', {
        statusCode: 201,
        body: {
          workout_id: 10,
          name: 'AI Generated Workout',
          description: 'Custom workout',
        },
      }).as('saveWorkout');

      cy.findByLabelText(/goal|focus/i).type('Leg strength');
      cy.findByRole('button', { name: /generate|create/i }).click();

      cy.wait('@generateWorkout');

      cy.findByRole('button', { name: /save.*workout|add.*workout/i }).click();

      cy.wait('@saveWorkout');

      cy.findByText(/workout saved|success/i).should('be.visible');
    });

    it('should allow regenerating workout', () => {
      cy.intercept('POST', '/api/ai/generate-workout', {
        statusCode: 200,
        body: {
          name: 'AI Generated Workout 1',
          description: 'First workout',
          exercises: [
            { name: 'Exercise 1', sets: 3, reps: 10, weight: 0 },
          ],
        },
      }).as('generateWorkout1');

      cy.findByLabelText(/goal|focus/i).type('Test');
      cy.findByRole('button', { name: /generate|create/i }).click();

      cy.wait('@generateWorkout1');

      cy.intercept('POST', '/api/ai/generate-workout', {
        statusCode: 200,
        body: {
          name: 'AI Generated Workout 2',
          description: 'Second workout',
          exercises: [
            { name: 'Exercise 2', sets: 4, reps: 12, weight: 0 },
          ],
        },
      }).as('generateWorkout2');

      cy.findByRole('button', { name: /regenerate|try again|new/i }).click();

      cy.wait('@generateWorkout2');

      cy.findByText('AI Generated Workout 2').should('be.visible');
    });
  });

  describe('Form Validation', () => {
    it('should validate required fields', () => {
      cy.findByRole('button', { name: /generate|create/i }).click();

      cy.findByText(/required|enter|provide/i).should('be.visible');
    });

    it('should validate duration is within range', () => {
      cy.findByLabelText(/duration/i).type('300');

      cy.findByRole('button', { name: /generate|create/i }).click();

      cy.findByText(/180|maximum.*duration/i).should('be.visible');
    });

    it('should validate minimum duration', () => {
      cy.findByLabelText(/duration/i).type('5');

      cy.findByRole('button', { name: /generate|create/i }).click();

      cy.findByText(/10|minimum.*duration/i).should('be.visible');
    });
  });

  describe('User Profile Integration', () => {
    it('should pre-fill experience level from profile', () => {
      cy.wait('@getProfile');

      cy.findByLabelText(/difficulty|intensity|level/i).should('have.value', 'intermediate');
    });

    it('should use profile data in workout generation', () => {
      cy.intercept('POST', '/api/ai/generate-workout', (req) => {
        expect(req.body).to.have.property('experienceLevel', 'intermediate');
        req.reply({
          statusCode: 200,
          body: {
            name: 'Intermediate Workout',
            description: 'Based on your profile',
            exercises: [],
          },
        });
      }).as('generateWorkout');

      cy.findByLabelText(/goal|focus/i).type('Test workout');
      cy.findByRole('button', { name: /generate|create/i }).click();

      cy.wait('@generateWorkout');
    });
  });

  describe('Loading State', () => {
    it('should show loading indicator while generating', () => {
      cy.intercept('POST', '/api/ai/generate-workout', {
        delay: 2000,
        statusCode: 200,
        body: {
          name: 'Generated Workout',
          description: 'Test',
          exercises: [],
        },
      }).as('slowGenerate');

      cy.findByLabelText(/goal|focus/i).type('Test');
      cy.findByRole('button', { name: /generate|create/i }).click();

      cy.findByText(/generating|loading|creating/i).should('be.visible');
      cy.findByRole('button', { name: /generate|create/i }).should('be.disabled');

      cy.wait('@slowGenerate');

      cy.findByRole('button', { name: /generate|create/i }).should('not.be.disabled');
    });
  });

  describe('Error Handling', () => {
    it('should display error when generation fails', () => {
      cy.intercept('POST', '/api/ai/generate-workout', {
        statusCode: 500,
        body: { error: 'AI service unavailable' },
      }).as('generateError');

      cy.findByLabelText(/goal|focus/i).type('Test workout');
      cy.findByRole('button', { name: /generate|create/i }).click();

      cy.wait('@generateError');

      cy.findByText(/error|failed|try again/i).should('be.visible');
    });

    it('should handle API rate limit error', () => {
      cy.intercept('POST', '/api/ai/generate-workout', {
        statusCode: 429,
        body: { error: 'Rate limit exceeded' },
      }).as('rateLimitError');

      cy.findByLabelText(/goal|focus/i).type('Test workout');
      cy.findByRole('button', { name: /generate|create/i }).click();

      cy.wait('@rateLimitError');

      cy.findByText(/rate limit|too many|wait/i).should('be.visible');
    });

    it('should handle invalid API key error', () => {
      cy.intercept('POST', '/api/ai/generate-workout', {
        statusCode: 401,
        body: { error: 'Invalid API key' },
      }).as('authError');

      cy.findByLabelText(/goal|focus/i).type('Test workout');
      cy.findByRole('button', { name: /generate|create/i }).click();

      cy.wait('@authError');

      cy.findByText(/configuration|contact|unavailable/i).should('be.visible');
    });

    it('should allow retry after error', () => {
      cy.intercept('POST', '/api/ai/generate-workout', {
        statusCode: 500,
        body: { error: 'Error' },
      }).as('generateError');

      cy.findByLabelText(/goal|focus/i).type('Test workout');
      cy.findByRole('button', { name: /generate|create/i }).click();

      cy.wait('@generateError');

      // Mock successful response for retry
      cy.intercept('POST', '/api/ai/generate-workout', {
        statusCode: 200,
        body: {
          name: 'Success Workout',
          description: 'Retry successful',
          exercises: [],
        },
      }).as('generateSuccess');

      cy.findByRole('button', { name: /try again|retry/i }).click();

      cy.wait('@generateSuccess');

      cy.findByText('Success Workout').should('be.visible');
    });
  });

  describe('Accessibility', () => {
    it('should have proper page title', () => {
      cy.title().should('match', /ai.*workout|generate/i);
    });

    it('should have accessible form labels', () => {
      cy.get('input, select, textarea').each(($input) => {
        const id = $input.attr('id');
        if (id) {
          cy.get(`label[for="${id}"]`).should('exist');
        }
      });
    });

    it('should have submit button with proper label', () => {
      cy.findByRole('button', { name: /generate|create/i }).should('be.visible');
    });
  });

  describe('Responsive Design', () => {
    it('should work on mobile devices', () => {
      cy.viewport('iphone-x');

      cy.get('form, [role="form"]').should('be.visible');
      cy.findByRole('button', { name: /generate|create/i }).should('be.visible');
    });

    it('should work on tablets', () => {
      cy.viewport('ipad-2');

      cy.get('form, [role="form"]').should('be.visible');
      cy.findByRole('button', { name: /generate|create/i }).should('be.visible');
    });
  });
});
