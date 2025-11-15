/**
 * E2E Tests for App Navigation
 *
 * Tests navigation menu, routing, and overall app navigation flow
 */

describe('App Navigation', () => {
  beforeEach(() => {
    cy.mockAuth();
    cy.intercept('GET', '/api/**', {}).as('apiCall');
    cy.visit('/');
  });

  describe('Navigation Bar', () => {
    it('should display navigation menu', () => {
      cy.get('nav, header').should('be.visible');
    });

    it('should have link to Dashboard/Home', () => {
      cy.findByRole('link', { name: /home|dashboard/i }).should('be.visible');
    });

    it('should have link to Workouts', () => {
      cy.findByRole('link', { name: /workout/i }).should('be.visible');
    });

    it('should have link to Profile', () => {
      cy.findByRole('link', { name: /profile/i }).should('be.visible');
    });

    it('should have link to AI Workout Generator', () => {
      cy.findByRole('link', { name: /ai.*workout|generate/i }).then(($link) => {
        if ($link.length > 0) {
          cy.wrap($link).should('be.visible');
        }
      });
    });

    it('should highlight active navigation item', () => {
      cy.visit('/workouts');

      cy.findByRole('link', { name: /workout/i })
        .should('have.class', /active|current/)
        .or('have.attr', 'aria-current', 'page');
    });
  });

  describe('Navigation Flow', () => {
    it('should navigate to Dashboard from nav menu', () => {
      cy.visit('/workouts');

      cy.findByRole('link', { name: /home|dashboard/i }).click();

      cy.url().should('match', /\/$|\/dashboard/);
    });

    it('should navigate to Workouts from nav menu', () => {
      cy.findByRole('link', { name: /workout/i }).click();

      cy.url().should('include', '/workouts');
    });

    it('should navigate to Profile from nav menu', () => {
      cy.findByRole('link', { name: /profile/i }).click();

      cy.url().should('include', '/profile');
    });

    it('should navigate to AI Workout Generator from nav menu', () => {
      cy.findByRole('link', { name: /ai.*workout|generate/i }).then(($link) => {
        if ($link.length > 0) {
          cy.wrap($link).click();
          cy.url().should('include', '/ai-workout');
        }
      });
    });
  });

  describe('Browser Navigation', () => {
    it('should handle browser back button', () => {
      cy.visit('/');
      cy.visit('/workouts');
      cy.visit('/profile');

      cy.go('back');
      cy.url().should('include', '/workouts');

      cy.go('back');
      cy.url().should('match', /\/$|\/dashboard/);
    });

    it('should handle browser forward button', () => {
      cy.visit('/');
      cy.visit('/workouts');

      cy.go('back');
      cy.url().should('match', /\/$|\/dashboard/);

      cy.go('forward');
      cy.url().should('include', '/workouts');
    });
  });

  describe('Deep Linking', () => {
    it('should navigate directly to workout details via URL', () => {
      cy.intercept('GET', '/api/workouts/1', { fixture: 'workout-details.json' }).as('getWorkout');

      cy.visit('/workouts/1');

      cy.url().should('include', '/workouts/1');
      cy.wait('@getWorkout');
    });

    it('should navigate directly to profile via URL', () => {
      cy.intercept('GET', '/api/profile', { fixture: 'profile.json' }).as('getProfile');

      cy.visit('/profile');

      cy.url().should('include', '/profile');
      cy.wait('@getProfile');
    });
  });

  describe('Logo/Brand', () => {
    it('should display app logo/brand', () => {
      cy.get('nav img, header img, [alt*="logo" i]').then(($logo) => {
        if ($logo.length > 0) {
          cy.wrap($logo).should('be.visible');
        } else {
          cy.get('nav, header').contains(/fitlog/i).should('be.visible');
        }
      });
    });

    it('should navigate to home when logo clicked', () => {
      cy.visit('/workouts');

      cy.get('nav a, header a').first().click();

      cy.url().should('match', /\/$|\/dashboard|\/workouts/);
    });
  });

  describe('Mobile Navigation', () => {
    beforeEach(() => {
      cy.viewport('iphone-x');
    });

    it('should show mobile navigation menu', () => {
      cy.get('nav, header, [role="navigation"]').should('be.visible');
    });

    it('should toggle mobile menu if hamburger exists', () => {
      cy.get('button[aria-label*="menu" i], button[aria-label*="navigation" i]').then(($btn) => {
        if ($btn.length > 0) {
          cy.wrap($btn).click();
          cy.get('nav ul, nav div').should('be.visible');
        }
      });
    });

    it('should navigate on mobile', () => {
      cy.findByRole('link', { name: /workout/i }).click();

      cy.url().should('include', '/workouts');
    });
  });

  describe('Bottom Navigation (Mobile PWA)', () => {
    beforeEach(() => {
      cy.viewport('iphone-x');
    });

    it('should show bottom navigation on mobile', () => {
      cy.get('[class*="bottom-nav"], [class*="bottomNav"], nav').should('be.visible');
    });

    it('should navigate from bottom nav', () => {
      cy.get('[class*="bottom-nav"], [class*="bottomNav"]').within(() => {
        cy.findByRole('link', { name: /workout/i }).then(($link) => {
          if ($link.length > 0) {
            cy.wrap($link).click();
            cy.url().should('include', '/workouts');
          }
        });
      });
    });
  });

  describe('404 Not Found', () => {
    it('should display 404 page for invalid routes', () => {
      cy.visit('/invalid-route-that-does-not-exist', { failOnStatusCode: false });

      cy.findByText(/404|not found|page.*exist/i).should('be.visible');
    });

    it('should have link back to home from 404 page', () => {
      cy.visit('/invalid-route', { failOnStatusCode: false });

      cy.findByRole('link', { name: /home|dashboard|back/i }).click();

      cy.url().should('match', /\/$|\/dashboard/);
    });
  });

  describe('Authentication Redirects', () => {
    it('should redirect to sign in when not authenticated', () => {
      // Clear auth mock
      cy.clearLocalStorage();
      cy.clearCookies();

      cy.visit('/workouts', { failOnStatusCode: false });

      // Should redirect to sign-in or show login prompt
      cy.url().should('match', /sign-in|login|auth/i);
    });
  });

  describe('Loading States', () => {
    it('should show loading state during navigation', () => {
      cy.intercept('GET', '/api/workouts', {
        delay: 1000,
        fixture: 'workouts.json',
      }).as('slowWorkouts');

      cy.findByRole('link', { name: /workout/i }).click();

      cy.get('[aria-busy="true"], [role="status"]').should('exist');

      cy.wait('@slowWorkouts');
    });
  });

  describe('Accessibility', () => {
    it('should have skip to main content link', () => {
      cy.get('a[href="#main"], a[href="#content"]').then(($link) => {
        if ($link.length > 0) {
          cy.wrap($link).should('exist');
        }
      });
    });

    it('should have proper ARIA labels on navigation', () => {
      cy.get('nav').should('have.attr', 'aria-label')
        .or(cy.get('[role="navigation"]').should('exist'));
    });

    it('should support keyboard navigation in menu', () => {
      cy.get('nav a, nav button').first().focus();
      cy.focused().should('be.visible');

      cy.focused().tab();
      cy.focused().should('be.visible');
    });

    it('should indicate current page in navigation', () => {
      cy.visit('/workouts');

      cy.findByRole('link', { name: /workout/i })
        .should('have.attr', 'aria-current', 'page')
        .or('have.class', /active|current/);
    });
  });

  describe('Offline Navigation', () => {
    it('should show offline indicator when network is down', () => {
      cy.intercept('GET', '/api/**', { forceNetworkError: true }).as('networkError');

      cy.visit('/workouts');

      // Should show offline message or cached content
      cy.findByText(/offline|no.*connection|cached/i).then(($msg) => {
        if ($msg.length > 0) {
          cy.wrap($msg).should('be.visible');
        }
      });
    });
  });
});
