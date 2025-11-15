/**
 * E2E Tests for Workout Details Page
 *
 * Tests individual workout viewing, editing, exercise management
 */

describe('Workout Details Page', () => {
  beforeEach(() => {
    cy.mockAuth();

    cy.intercept('GET', '/api/workouts/1', { fixture: 'workout-details.json' }).as('getWorkoutDetails');
    cy.intercept('GET', '/api/workouts/1/exercises', { fixture: 'workout-details.json' }).as('getExercises');

    cy.visit('/workouts/1');
    cy.wait('@getWorkoutDetails');
  });

  describe('Workout Details Display', () => {
    it('should display workout name', () => {
      cy.findByText('Morning Cardio').should('be.visible');
    });

    it('should display workout description', () => {
      cy.findByText('30 minute cardio session').should('be.visible');
    });

    it('should display workout date', () => {
      cy.contains(/created|date/i).should('be.visible');
    });

    it('should display exercise list', () => {
      cy.findByText('Running').should('be.visible');
      cy.findByText('Jumping Jacks').should('be.visible');
    });

    it('should display exercise details (sets, reps, weight)', () => {
      // Check for sets/reps display
      cy.contains(/3\s*×\s*20|3 sets.*20 reps/i).should('be.visible');
    });
  });

  describe('Workout Editing', () => {
    it('should show edit button', () => {
      cy.findByRole('button', { name: /edit/i }).should('be.visible');
    });

    it('should allow editing workout name', () => {
      cy.intercept('PUT', '/api/workouts/1', {
        statusCode: 200,
        body: {
          workout_id: 1,
          name: 'Updated Morning Cardio',
          description: '30 minute cardio session',
        },
      }).as('updateWorkout');

      cy.findByRole('button', { name: /edit/i }).click();

      cy.findByLabelText(/workout name/i).clear().type('Updated Morning Cardio');
      cy.findByRole('button', { name: /save/i }).click();

      cy.wait('@updateWorkout');
      cy.findByText('Updated Morning Cardio').should('be.visible');
    });

    it('should allow editing workout description', () => {
      cy.intercept('PUT', '/api/workouts/1', {
        statusCode: 200,
        body: {
          workout_id: 1,
          name: 'Morning Cardio',
          description: 'Updated description',
        },
      }).as('updateWorkout');

      cy.findByRole('button', { name: /edit/i }).click();

      cy.findByLabelText(/description/i).clear().type('Updated description');
      cy.findByRole('button', { name: /save/i }).click();

      cy.wait('@updateWorkout');
      cy.findByText('Updated description').should('be.visible');
    });

    it('should cancel editing when cancel button clicked', () => {
      cy.findByRole('button', { name: /edit/i }).click();

      cy.findByLabelText(/workout name/i).clear().type('Changed Name');
      cy.findByRole('button', { name: /cancel/i }).click();

      // Original name should still be visible
      cy.findByText('Morning Cardio').should('be.visible');
    });
  });

  describe('Workout Deletion', () => {
    it('should show delete button', () => {
      cy.findByRole('button', { name: /delete/i }).should('be.visible');
    });

    it('should show confirmation dialog when delete clicked', () => {
      cy.findByRole('button', { name: /delete/i }).click();

      cy.findByText(/are you sure|confirm|delete.*workout/i).should('be.visible');
    });

    it('should delete workout when confirmed', () => {
      cy.intercept('DELETE', '/api/workouts/1', {
        statusCode: 204,
      }).as('deleteWorkout');

      cy.findByRole('button', { name: /delete/i }).click();
      cy.findByRole('button', { name: /confirm|yes|delete/i }).click();

      cy.wait('@deleteWorkout');
      cy.url().should('include', '/workouts');
    });

    it('should cancel deletion when cancelled', () => {
      cy.findByRole('button', { name: /delete/i }).click();
      cy.findByRole('button', { name: /cancel|no/i }).click();

      // Should still be on workout details page
      cy.url().should('include', '/workouts/1');
      cy.findByText('Morning Cardio').should('be.visible');
    });
  });

  describe('Exercise Management', () => {
    it('should show add exercise button', () => {
      cy.findByRole('button', { name: /add exercise|new exercise/i }).should('be.visible');
    });

    it('should add new exercise', () => {
      cy.intercept('POST', '/api/workouts/1/exercises', {
        statusCode: 201,
        body: {
          exercise_id: 3,
          workout_id: 1,
          name: 'Burpees',
          sets: 3,
          reps: 15,
          weight: 0,
        },
      }).as('createExercise');

      cy.findByRole('button', { name: /add exercise|new exercise/i }).click();

      cy.fillExerciseForm({
        name: 'Burpees',
        sets: 3,
        reps: 15,
        weight: 0,
      });

      cy.findByRole('button', { name: /save|add/i }).click();

      cy.wait('@createExercise');
      cy.findByText('Burpees').should('be.visible');
    });

    it('should validate exercise form fields', () => {
      cy.findByRole('button', { name: /add exercise|new exercise/i }).click();

      // Try to submit empty form
      cy.findByRole('button', { name: /save|add/i }).click();

      cy.findByText(/exercise name.*required/i).should('be.visible');
    });

    it('should edit existing exercise', () => {
      cy.intercept('PUT', '/api/exercises/1', {
        statusCode: 200,
        body: {
          exercise_id: 1,
          workout_id: 1,
          name: 'Running Updated',
          sets: 1,
          reps: 1,
          weight: 0,
        },
      }).as('updateExercise');

      // Find edit button for first exercise
      cy.findByText('Running').parent().findByRole('button', { name: /edit/i }).click();

      cy.findByLabelText(/exercise name/i).clear().type('Running Updated');
      cy.findByRole('button', { name: /save/i }).click();

      cy.wait('@updateExercise');
      cy.findByText('Running Updated').should('be.visible');
    });

    it('should delete exercise', () => {
      cy.intercept('DELETE', '/api/exercises/1', {
        statusCode: 204,
      }).as('deleteExercise');

      // Find delete button for first exercise
      cy.findByText('Running').parent().findByRole('button', { name: /delete/i }).click();

      // Confirm deletion
      cy.findByRole('button', { name: /confirm|yes|delete/i }).click();

      cy.wait('@deleteExercise');
      cy.findByText('Running').should('not.exist');
    });
  });

  describe('Navigation', () => {
    it('should have back button to workouts list', () => {
      cy.findByRole('button', { name: /back/i }).should('be.visible');
    });

    it('should navigate back to workouts list when back clicked', () => {
      cy.findByRole('button', { name: /back/i }).click();

      cy.url().should('include', '/workouts');
      cy.url().should('not.include', '/workouts/1');
    });
  });

  describe('Error Handling', () => {
    it('should display error when workout not found', () => {
      cy.intercept('GET', '/api/workouts/999', {
        statusCode: 404,
        body: { error: 'Workout not found' },
      }).as('getWorkoutNotFound');

      cy.visit('/workouts/999');
      cy.wait('@getWorkoutNotFound');

      cy.findByText(/not found|doesn't exist/i).should('be.visible');
    });

    it('should handle exercise creation error', () => {
      cy.intercept('POST', '/api/workouts/1/exercises', {
        statusCode: 400,
        body: { error: 'Invalid exercise data' },
      }).as('createExerciseError');

      cy.findByRole('button', { name: /add exercise|new exercise/i }).click();

      cy.fillExerciseForm({
        name: 'Test Exercise',
        sets: 3,
        reps: 10,
        weight: 100,
      });

      cy.findByRole('button', { name: /save|add/i }).click();

      cy.wait('@createExerciseError');
      cy.findByText(/error|failed/i).should('be.visible');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      cy.get('h1').should('have.length.at.least', 1);
    });

    it('should have accessible exercise list', () => {
      cy.get('ul, ol').should('exist');
    });
  });

  describe('Loading State', () => {
    it('should show loading state while fetching workout', () => {
      cy.intercept('GET', '/api/workouts/2', {
        delay: 1000,
        fixture: 'workout-details.json',
      }).as('slowWorkout');

      cy.visit('/workouts/2');

      cy.get('[aria-busy="true"], [role="status"]').should('exist');

      cy.wait('@slowWorkout');

      cy.get('[aria-busy="true"]').should('not.exist');
    });
  });
});
