/**
 * GAMES/SUDOKU.JS
 * Sudoku puzzle game (STUB - UI shell only)
 * Future expansion: implement 9x9 grid, validation, hints
 */

const SudokuGame = {
  title: 'Daily Sudoku',
  instructions: '<p>Fill the 9×9 grid so that each row, column, and 3×3 box contains the digits 1-9.</p><p><strong>How to play:</strong> Click a cell and type a number (1-9). Use arrow keys to navigate and backspace to clear.</p><p>This feature is coming soon!</p>',
  
  /**
   * Render the game (stub)
   */
  render(container, gameId) {
    container.innerHTML = `
      <div class="game-placeholder">
        <div class="game-placeholder-icon">🔢</div>
        <h2 class="game-placeholder-text">Sudoku Puzzle</h2>
        <p class="game-placeholder-subtext">Coming soon</p>
        <p style="margin-top: 16px; max-width: 400px; color: var(--ink-secondary);">
          Classic 9×9 sudoku puzzles will be available here. 
          The framework supports grid-based puzzles.
        </p>
      </div>
    `;
    
    // Keyboard handler placeholder
    KeyboardHandler.register((e) => {
      // Future: handle number keys 1-9, arrow navigation, backspace
      if (e.key >= '1' && e.key <= '9') {
        console.log('Sudoku number input:', e.key);
      }
    });
  },
  
  /**
   * Clean up
   */
  destroy() {
    // Future: clear grid state, save progress
    console.log('Sudoku game destroyed');
  }
};

// Register the game
GameRegistry.register('sudoku', SudokuGame);

console.log('✓ Sudoku game stub loaded');
