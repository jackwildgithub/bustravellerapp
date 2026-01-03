/**
 * GAMES/CROSSWORD.JS
 * Crossword puzzle game (STUB - UI shell only)
 * Future expansion: implement grid logic and clue handling
 */

const CrosswordGame = {
  title: 'Daily Crossword',
  instructions: '<p>Fill in the crossword grid using the clues provided.</p><p><strong>How to play:</strong> Click a cell to select it, type letters to fill, use arrow keys to navigate, and backspace to erase.</p><p>This feature is coming soon!</p>',
  
  /**
   * Render the game (stub)
   */
  render(container, gameId) {
    container.innerHTML = `
      <div class="game-placeholder">
        <div class="game-placeholder-icon">✏️</div>
        <h2 class="game-placeholder-text">Crossword Puzzle</h2>
        <p class="game-placeholder-subtext">Coming soon</p>
        <p style="margin-top: 16px; max-width: 400px; color: var(--ink-secondary);">
          Classic crossword puzzles will be available here. 
          The framework is ready for implementation.
        </p>
      </div>
    `;
    
    // Keyboard handler placeholder
    KeyboardHandler.register((e) => {
      // Future: handle arrow keys, letter input, backspace
      console.log('Crossword keyboard input:', e.key);
    });
  },
  
  /**
   * Clean up
   */
  destroy() {
    // Future: clear grid state, save progress
    console.log('Crossword game destroyed');
  }
};

// Register the game
GameRegistry.register('crossword', CrosswordGame);

console.log('✓ Crossword game stub loaded');
