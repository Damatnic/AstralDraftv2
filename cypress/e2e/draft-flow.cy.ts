/**
 * Complete Draft Flow E2E Tests
 * Tests the full draft experience from login to pick submission
 */

describe('Complete Draft Flow', () => {
  beforeEach(() => {
    // Mock API responses
    cy.intercept('GET', '/api/players', { fixture: 'players.json' }).as('getPlayers');
    cy.intercept('GET', '/api/draft/current', { fixture: 'draft-state.json' }).as('getDraft');
    cy.intercept('POST', '/api/draft/pick', { fixture: 'draft-pick-success.json' }).as('makePick');
    
    cy.visit('/');
  });

  it('should complete a full draft simulation', () => {
    // Step 1: Login
    cy.get('[data-testid="team-name-input"]').type('Cypress Test Team');
    cy.get('[data-testid="join-league-button"]').click();

    // Step 2: Navigate to draft room
    cy.get('[data-testid="draft-room-link"]').should('be.visible');
    cy.get('[data-testid="draft-room-link"]').click();

    // Step 3: Wait for draft room to load
    cy.wait('@getDraft');
    cy.wait('@getPlayers');
    
    cy.get('[data-testid="draft-room"]').should('be.visible');
    cy.get('[data-testid="draft-timer"]').should('be.visible');

    // Step 4: Verify available players are displayed
    cy.get('[data-testid^="player-"]').should('have.length.greaterThan', 0);
    cy.get('[data-testid="player-1"]').should('contain', 'Josh Allen');

    // Step 5: Make first pick
    cy.get('[data-testid="player-1"]').click();
    cy.get('[data-testid="confirm-pick"]').should('be.visible');
    cy.get('[data-testid="confirm-pick"]').click();

    // Step 6: Wait for pick to be processed
    cy.wait('@makePick');

    // Step 7: Verify pick was successful
    cy.get('[data-testid="my-roster"]').should('contain', 'Josh Allen');
    cy.get('[data-testid="draft-pick-confirmation"]').should('be.visible');

    // Step 8: Verify draft state updated
    cy.get('[data-testid="current-pick"]').should('not.contain', 'Pick 1');
    cy.get('[data-testid="draft-timer"]').should('be.visible');
  });

  it('should handle draft timer countdown', () => {
    // Login and navigate to draft
    cy.get('[data-testid="team-name-input"]').type('Timer Test Team');
    cy.get('[data-testid="join-league-button"]').click();
    cy.get('[data-testid="draft-room-link"]').click();

    // Wait for draft room
    cy.wait('@getDraft');
    
    // Check timer is present and counting down
    cy.get('[data-testid="draft-timer"]').should('be.visible');
    cy.get('[data-testid="timer-display"]').should('match', /\d+:\d+/);

    // Wait a few seconds and verify timer decreased
    cy.wait(3000);
    cy.get('[data-testid="timer-display"]').should('not.contain', '1:30');
  });

  it('should filter players by position', () => {
    // Login and navigate to draft
    cy.get('[data-testid="team-name-input"]').type('Filter Test Team');
    cy.get('[data-testid="join-league-button"]').click();
    cy.get('[data-testid="draft-room-link"]').click();

    cy.wait('@getPlayers');

    // Test position filtering
    cy.get('[data-testid="position-filter-QB"]').click();
    cy.get('[data-testid^="player-"]').each(($player) => {
      cy.wrap($player).should('contain', 'QB');
    });

    // Test RB filtering
    cy.get('[data-testid="position-filter-RB"]').click();
    cy.get('[data-testid^="player-"]').each(($player) => {
      cy.wrap($player).should('contain', 'RB');
    });
  });

  it('should search players by name', () => {
    cy.get('[data-testid="team-name-input"]').type('Search Test Team');
    cy.get('[data-testid="join-league-button"]').click();
    cy.get('[data-testid="draft-room-link"]').click();

    cy.wait('@getPlayers');

    // Search for specific player
    cy.get('[data-testid="player-search"]').type('Josh');
    cy.get('[data-testid^="player-"]').should('have.length.lessThan', 10);
    cy.get('[data-testid="player-1"]').should('contain', 'Josh');

    // Clear search
    cy.get('[data-testid="player-search"]').clear();
    cy.get('[data-testid^="player-"]').should('have.length.greaterThan', 10);
  });

  it('should display draft board correctly', () => {
    cy.get('[data-testid="team-name-input"]').type('Draft Board Test');
    cy.get('[data-testid="join-league-button"]').click();
    cy.get('[data-testid="draft-room-link"]').click();

    cy.wait(['@getDraft', '@getPlayers']);

    // Verify draft board elements
    cy.get('[data-testid="draft-board"]').should('be.visible');
    cy.get('[data-testid="current-pick-indicator"]').should('be.visible');
    cy.get('[data-testid="draft-order"]').should('be.visible');
    cy.get('[data-testid="recent-picks"]').should('be.visible');
  });

  it('should handle auto-pick when timer expires', () => {
    // Mock a draft state where time is almost up
    cy.intercept('GET', '/api/draft/current', { 
      fixture: 'draft-state-low-time.json' 
    }).as('getDraftLowTime');

    cy.get('[data-testid="team-name-input"]').type('Auto Pick Test');
    cy.get('[data-testid="join-league-button"]').click();
    cy.get('[data-testid="draft-room-link"]').click();

    cy.wait('@getDraftLowTime');

    // Wait for auto-pick to trigger
    cy.get('[data-testid="auto-pick-notification"]', { timeout: 15000 })
      .should('be.visible');
    
    // Verify a pick was made automatically
    cy.get('[data-testid="my-roster"]').should('not.be.empty');
  });

  it('should be responsive on mobile devices', () => {
    cy.viewport('iphone-x');

    cy.get('[data-testid="team-name-input"]').type('Mobile Test');
    cy.get('[data-testid="join-league-button"]').click();
    cy.get('[data-testid="draft-room-link"]').click();

    cy.wait(['@getDraft', '@getPlayers']);

    // Verify mobile-specific elements
    cy.get('[data-testid="mobile-draft-interface"]').should('be.visible');
    cy.get('[data-testid="mobile-player-list"]').should('be.visible');
    
    // Test mobile navigation
    cy.get('[data-testid="mobile-menu-toggle"]').click();
    cy.get('[data-testid="mobile-navigation"]').should('be.visible');
  });

  it('should handle errors gracefully', () => {
    // Mock API error
    cy.intercept('POST', '/api/draft/pick', {
      statusCode: 500,
      body: { error: 'Draft pick failed' }
    }).as('makePickError');

    cy.get('[data-testid="team-name-input"]').type('Error Test Team');
    cy.get('[data-testid="join-league-button"]').click();
    cy.get('[data-testid="draft-room-link"]').click();

    cy.wait('@getDraft');

    // Try to make a pick that will fail
    cy.get('[data-testid="player-1"]').click();
    cy.get('[data-testid="confirm-pick"]').click();

    cy.wait('@makePickError');

    // Verify error is displayed
    cy.get('[data-testid="error-message"]').should('be.visible');
    cy.get('[data-testid="error-message"]').should('contain', 'Draft pick failed');
    
    // Verify user can retry
    cy.get('[data-testid="retry-button"]').should('be.visible');
  });

  it('should maintain accessibility standards', () => {
    cy.get('[data-testid="team-name-input"]').type('Accessibility Test');
    cy.get('[data-testid="join-league-button"]').click();
    cy.get('[data-testid="draft-room-link"]').click();

    cy.wait(['@getDraft', '@getPlayers']);

    // Test keyboard navigation
    cy.get('[data-testid="player-1"]').focus();
    cy.get('[data-testid="player-1"]').should('have.focus');
    
    // Test ARIA labels
    cy.get('[data-testid="draft-timer"]').should('have.attr', 'aria-live');
    cy.get('[data-testid="player-1"]').should('have.attr', 'aria-label');
    
    // Test focus management
    cy.get('[data-testid="player-1"]').click();
    cy.get('[data-testid="confirm-pick"]').should('have.focus');
  });
});