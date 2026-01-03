/**
 * GAMES/REGISTRY.JS
 * Central registry mapping gameId -> game module
 * Easy to extend with new games
 */

const GameRegistry = {
  games: {},
  
  /**
   * Register a game module
   * @param {string} gameId - Unique game identifier
   * @param {object} module - Game module with render() and destroy() methods
   */
  register(gameId, module) {
    if (!module.render || typeof module.render !== 'function') {
      console.error(`Game module "${gameId}" must have a render() method`);
      return;
    }
    
    if (!module.destroy || typeof module.destroy !== 'function') {
      console.error(`Game module "${gameId}" must have a destroy() method`);
      return;
    }
    
    this.games[gameId] = module;
    console.log(`✓ Game registered: ${gameId}`);
  },
  
  /**
   * Get a game module by ID
   * @param {string} gameId - Game identifier
   * @returns {object|null} Game module or null
   */
  get(gameId) {
    return this.games[gameId] || null;
  },
  
  /**
   * List all registered games
   * @returns {array} Array of game IDs
   */
  list() {
    return Object.keys(this.games);
  },
  
  /**
   * Check if a game is registered
   * @param {string} gameId - Game identifier
   * @returns {boolean}
   */
  has(gameId) {
    return gameId in this.games;
  }
};

// Export to global scope
window.GameRegistry = GameRegistry;

console.log('🎮 Game registry initialized');
