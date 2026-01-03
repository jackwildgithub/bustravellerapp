/**
 * APP.JS
 * Main application controller
 * Handles mode switching between deck and game layers
 * Manages keyboard input infrastructure
 */

// Global app state
const AppState = {
  mode: 'deck', // 'deck' or 'game'
  currentGame: null,
  currentGameId: null,
  keyboardEnabled: false
};

// Keyboard input handler
const KeyboardHandler = {
  listeners: [],
  
  init() {
    document.addEventListener('keydown', (e) => {
      if (!AppState.keyboardEnabled) return;
      
      // Broadcast to all registered listeners
      this.listeners.forEach(listener => {
        if (typeof listener === 'function') {
          listener(e);
        }
      });
    });
  },
  
  register(callback) {
    this.listeners.push(callback);
  },
  
  clear() {
    this.listeners = [];
  },
  
  enable() {
    AppState.keyboardEnabled = true;
  },
  
  disable() {
    AppState.keyboardEnabled = false;
  }
};

// Mode switching controller
const ModeController = {
  /**
   * Switch to game mode
   * @param {string} gameType - The game type (e.g., 'trivia', 'crossword')
   * @param {string} gameId - Unique identifier for this game instance
   */
  enterGameMode(gameType, gameId) {
    if (AppState.mode === 'game') {
      console.warn('Already in game mode');
      return;
    }
    
    // Get game module from registry
    const gameModule = GameRegistry.get(gameType);
    if (!gameModule) {
      console.error(`Game type "${gameType}" not found in registry`);
      return;
    }
    
    // Store current game info
    AppState.currentGame = gameModule;
    AppState.currentGameId = gameId;
    AppState.mode = 'game';
    
    // Switch visual layer
    document.body.classList.add('mode-game');
    
    // Get game content container
    const gameContent = document.getElementById('game-content');
    gameContent.innerHTML = '';
    
    // Show intro screen first (not the game itself)
    this.showGameIntro(gameType, gameId, gameModule);
  },
  
  /**
   * Show game introduction screen
   */
  showGameIntro(gameType, gameId, gameModule) {
    const gameContent = document.getElementById('game-content');
    
    const introHTML = `
      <div class="game-intro">
        <div class="game-intro-content">
          <h1 class="game-intro-title">${escapeHtml(gameModule.title || gameType)}</h1>
          <div class="game-intro-instructions">
            ${gameModule.instructions || 'No instructions available.'}
          </div>
          <div class="game-intro-buttons">
            <button class="btn" id="btn-start-game">Play</button>
            <button class="btn btn-secondary" id="btn-cancel-game">Back</button>
          </div>
        </div>
      </div>
    `;
    
    gameContent.innerHTML = introHTML;
    
    // Wire up buttons
    document.getElementById('btn-start-game').addEventListener('click', () => {
      this.startGame();
    });
    
    document.getElementById('btn-cancel-game').addEventListener('click', () => {
      this.exitGameMode();
    });
  },
  
  /**
   * Start the actual game (after intro)
   */
  startGame() {
    const gameContent = document.getElementById('game-content');
    gameContent.innerHTML = '';
    
    // Add back button nav
    const nav = document.createElement('div');
    nav.className = 'game-nav';
    nav.innerHTML = '<button class="btn btn-back" id="btn-back-to-deck">← Back to Deck</button>';
    gameContent.appendChild(nav);
    
    // Create game container
    const container = document.createElement('div');
    container.className = 'game-container';
    container.id = 'active-game-container';
    gameContent.appendChild(container);
    
    // Render game
    try {
      AppState.currentGame.render(container, AppState.currentGameId);
      KeyboardHandler.enable();
    } catch (error) {
      console.error('Error rendering game:', error);
      container.innerHTML = '<div class="game-placeholder"><p class="game-placeholder-text">Failed to load game</p></div>';
    }
    
    // Wire up back button
    document.getElementById('btn-back-to-deck').addEventListener('click', () => {
      this.exitGameMode();
    });
  },
  
  /**
   * Return to deck mode
   */
  exitGameMode() {
    if (AppState.mode !== 'game') {
      console.warn('Not in game mode');
      return;
    }
    
    // Destroy current game
    if (AppState.currentGame && typeof AppState.currentGame.destroy === 'function') {
      try {
        AppState.currentGame.destroy();
      } catch (error) {
        console.error('Error destroying game:', error);
      }
    }
    
    // Clear keyboard listeners
    KeyboardHandler.disable();
    KeyboardHandler.clear();
    
    // Clear game content
    const gameContent = document.getElementById('game-content');
    gameContent.innerHTML = '';
    
    // Reset state
    AppState.currentGame = null;
    AppState.currentGameId = null;
    AppState.mode = 'deck';
    
    // Switch visual layer
    document.body.classList.remove('mode-game');
  }
};

// Offline-first persistence hooks (disabled by default)
// Future expansion: localStorage game state saving
const PersistenceManager = {
  enabled: false, // Set to true when ready to implement
  
  /**
   * Save game state to localStorage
   * @param {string} gameId - Unique game identifier
   * @param {object} state - Game state to save
   */
  saveGameState(gameId, state) {
    if (!this.enabled) return;
    
    try {
      const key = `gamestate_${gameId}`;
      localStorage.setItem(key, JSON.stringify(state));
      console.log(`Game state saved for ${gameId}`);
    } catch (error) {
      console.error('Failed to save game state:', error);
    }
  },
  
  /**
   * Load game state from localStorage
   * @param {string} gameId - Unique game identifier
   * @returns {object|null} Saved state or null
   */
  loadGameState(gameId) {
    if (!this.enabled) return null;
    
    try {
      const key = `gamestate_${gameId}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load game state:', error);
      return null;
    }
  },
  
  /**
   * Clear saved game state
   * @param {string} gameId - Unique game identifier
   */
  clearGameState(gameId) {
    if (!this.enabled) return;
    
    try {
      const key = `gamestate_${gameId}`;
      localStorage.removeItem(key);
      console.log(`Game state cleared for ${gameId}`);
    } catch (error) {
      console.error('Failed to clear game state:', error);
    }
  },
  
  /**
   * Save app preferences
   * @param {object} prefs - Preferences object
   */
  savePreferences(prefs) {
    if (!this.enabled) return;
    
    try {
      localStorage.setItem('app_preferences', JSON.stringify(prefs));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  },
  
  /**
   * Load app preferences
   * @returns {object} Preferences object
   */
  loadPreferences() {
    if (!this.enabled) return {};
    
    try {
      const data = localStorage.getItem('app_preferences');
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Failed to load preferences:', error);
      return {};
    }
  }
};

// Utility: Escape HTML
function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

// Initialize app
function initApp() {
  console.log('🎮 App initializing...');
  
  // Initialize keyboard handler
  KeyboardHandler.init();
  
  // Initialize deck
  if (typeof initDeck === 'function') {
    initDeck();
  } else {
    console.error('Deck module not loaded');
  }
  
  console.log('✅ App initialized');
}

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Export for use in other modules
window.AppState = AppState;
window.ModeController = ModeController;
window.KeyboardHandler = KeyboardHandler;
window.PersistenceManager = PersistenceManager;
window.escapeHtml = escapeHtml;
