/**
 * GAMES/GRID.JS
 * Generic grid puzzle game (STUB - UI shell only)
 * Future expansion: word search, logic puzzles, pattern games
 */

const GridGame = {
  title: 'Grid Puzzle',
  instructions: '<p>Solve various grid-based puzzles including word searches, logic grids, and pattern challenges.</p><p><strong>How to play:</strong> Instructions will vary by puzzle type. Use mouse or touch to interact with the grid.</p><p>This feature is coming soon!</p>',
  
  /**
   * Render the game (stub)
   */
  render(container, gameId) {
    container.innerHTML = `
      <div class="game-placeholder">
        <div class="game-placeholder-icon">⬜</div>
        <h2 class="game-placeholder-text">Grid Puzzle</h2>
        <p class="game-placeholder-subtext">Coming soon</p>
        <p style="margin-top: 16px; max-width: 400px; color: var(--ink-secondary);">
          Various grid-based puzzles will be available here, including word searches and logic grids.
          The framework is designed for flexible grid layouts.
        </p>
      </div>
    `;
    
    // Keyboard handler placeholder
    KeyboardHandler.register((e) => {
      // Future: handle arrow keys, selection, letter input
      console.log('Grid game keyboard input:', e.key);
    });
  },
  
  /**
   * Clean up
   */
  destroy() {
    // Future: clear grid state, save progress
    console.log('Grid game destroyed');
  }
};

// Register the game
GameRegistry.register('grid', GridGame);

console.log('✓ Grid game stub loaded');
