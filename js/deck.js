/**
 * DECK.JS
 * Deck rendering logic and slide interaction
 * Moved from index.html
 */

// Configuration for deck loading
const DECK_URL = './deck.json';

// Global DECK variable (populated by loadDeck)
let DECK = [];

// Swiper instance
let deckSwiper;

/**
 * Generate HTML for a single slide
 */
function slideHTML(item, index) {
  const layoutClass = item.layout ? `layout-${item.layout}` : '';
  const bg = '';
const kicker = item.kicker ? `<div class="slide-kicker">${escapeHtml(item.kicker)}</div>` : '';
  const inlineImage = item.image ? `<img class="slide-image" src="${escapeAttr(item.image)}" alt="${escapeAttr(item.title || 'Image')}" loading="lazy">` : '';

  // For game cards, we'll stash game info in data attributes
  const dataAttrs = [
    `data-index="${index}"`,
    `data-type="${item.type}"`
  ];

  // Check if this is a puzzle/game slide
  if (item.game) {
    dataAttrs.push(`data-game="${item.game}"`);
    dataAttrs.push(`data-game-id="${item.gameId || item.game}"`);
  }

  // For non-game cards with answers
  if (item.answer) dataAttrs.push(`data-answer="${escapeAttr(item.answer)}"`);
  if (item.explain) dataAttrs.push(`data-explain="${escapeAttr(item.explain)}"`);

  return `
    <div class="swiper-slide ${layoutClass}" ${bg} ${dataAttrs.join(' ')}>
      <div class="slide-content">
        ${kicker}
        <h1 class="slide-title">${escapeHtml(item.title || '')}</h1>
        ${inlineImage}
        <p class="slide-description">${escapeHtml(item.body || '')}</p>
        ${item.type !== 'trivia' && !item.game ? `<div class="hint">Tap anywhere on this card to reveal the answer.</div>` : ''}
        ${item.game ? `<div class="hint">Tap to play this puzzle.</div>` : ''}
      </div>
    </div>
  `;
}

/**
 * Render all deck slides
 */
function renderDeck() {
  const wrapper = document.querySelector('#deck-swiper .swiper-wrapper');
  wrapper.innerHTML = DECK.map(slideHTML).join('');
}

/**
 * Escape HTML helper
 */
function escapeAttr(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
    .replaceAll('\n', ' ');
}

/**
 * Load deck data from JSON
 */
async function loadDeck() {
  try {
    const response = await fetch(DECK_URL, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    DECK = await response.json();
    return true;
  } catch (error) {
    console.error('Failed to load deck.json:', error);
    return false;
  }
}

/**
 * Show error message in the UI
 */
function showError(message) {
  const wrapper = document.querySelector('#deck-swiper .swiper-wrapper');
  wrapper.innerHTML = `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      width: 100vw;
      color: var(--ink-primary);
      font-size: 1.2rem;
      text-align: center;
      padding: 20px;
      background: var(--paper-bg);
    ">${message}</div>
  `;
}

/**
 * Initialize Swiper
 */
function initSwiper() {
  deckSwiper = new Swiper('#deck-swiper', {
    effect: 'slide',
    speed: 400,
    slidesPerView: 1,
    spaceBetween: 0,
    longSwipesRatio: 0.3,
    threshold: 10,
    resistance: true,
    resistanceRatio: 0,
    freeMode: false,
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    touchStartPreventDefault: false,
    slideToClickedSlide: false
  });

  // Reset reveal state when slide changes
  deckSwiper.on('slideChangeTransitionStart', () => {
    // Because loop clones slides, we clear reveals on all visible slides
    document.querySelectorAll('.swiper-slide .reveal').forEach(el => el.remove());
    document.querySelectorAll('.swiper-slide[data-revealed="1"]').forEach(sl => sl.dataset.revealed = '0');
  });

  // Update Swiper after slides are injected
  deckSwiper.update();
}

/**
 * Setup slide click handlers
 */
function setupSlideInteractions() {
  document.getElementById('deck-swiper').addEventListener('click', (e) => {
    const slide = e.target.closest('.swiper-slide');
    if (!slide) return;

    const type = slide.dataset.type;
    const game = slide.dataset.game;

    // If this is a puzzle slide, launch game mode
    if (game) {
      const gameId = slide.dataset.gameId || game;
      ModeController.enterGameMode(game, gameId);
      return;
    }

    // For trivia/title cards: toggle photo-only mode
    if (type === 'trivia') {
      slide.classList.toggle('is-photo');
      return;
    }

    // Already revealed? Don't spam
    if (slide.dataset.revealed === '1') return;

    // Reveal answer for Q&A cards
    const answer = slide.dataset.answer || 'Answer';
    const explain = slide.dataset.explain || '';

    const content = slide.querySelector('.slide-content');
    const pill = document.createElement('div');
    pill.className = 'reveal';
    pill.innerHTML = `<strong>${escapeHtml(answer)}</strong>${explain ? `<div style="margin-top:8px; opacity:0.9;">${escapeHtml(explain)}</div>` : ''}`;

    content.appendChild(pill);
    slide.dataset.revealed = '1';
  });
}

/**
 * Initialize deck
 * Called by app.js
 */
async function initDeck() {
  console.log('📚 Loading deck...');
  
  const loaded = await loadDeck();
  
  if (!loaded) {
    showError('Failed to load deck.json');
    return;
  }

  console.log(`✅ Loaded ${DECK.length} slides`);
  
  renderDeck();
  initSwiper();
  setupSlideInteractions();
  
  console.log('✅ Deck initialized');
}

// Export for use in app.js
window.initDeck = initDeck;
window.deckSwiper = deckSwiper;
window.DECK = DECK;
