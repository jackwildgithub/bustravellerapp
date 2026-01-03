/**
 * GAMES/TRIVIA.JS
 * Minimal playable trivia game
 * Question -> multiple choice -> feedback
 */

const TriviaGame = {
  title: 'Daily Trivia',
  instructions: '<p>Test your knowledge with <strong>quick trivia questions</strong>.</p><p>Select the answer you think is correct. You will get instant feedback!</p>',
  
  // Game state (cleared on destroy)
  state: {
    currentQuestion: 0,
    score: 0,
    answered: false,
    container: null
  },
  
  // Sample questions (placeholder - future: load from data)
  questions: [
    {
      question: 'Geelong is located in which Australian state?',
      options: ['New South Wales', 'Victoria', 'Queensland', 'South Australia'],
      correct: 1,
      explanation: 'Geelong is Victoria\'s second-largest city, located on the Corio Bay.'
    },
    {
      question: 'What is the approximate distance between Melbourne Airport and Geelong?',
      options: ['35 km', '55 km', '75 km', '95 km'],
      correct: 2,
      explanation: 'The journey is approximately 75 kilometers and takes about an hour by bus.'
    },
    {
      question: 'Which famous Australian rules football team is based in Geelong?',
      options: ['The Cats', 'The Tigers', 'The Eagles', 'The Magpies'],
      correct: 0,
      explanation: 'The Geelong Cats (nicknamed "The Cats") are one of the AFL\'s most successful clubs.'
    }
  ],
  
  /**
   * Render the game
   */
  render(container, gameId) {
    this.state.container = container;
    this.state.currentQuestion = 0;
    this.state.score = 0;
    this.state.answered = false;
    
    this.renderQuestion();
    
    // Register keyboard handler for number keys
    KeyboardHandler.register(this.handleKeyboard.bind(this));
  },
  
  /**
   * Render current question
   */
  renderQuestion() {
    const q = this.questions[this.state.currentQuestion];
    
    const html = `
      <div class="trivia-question">
        <div class="trivia-question-text">
          ${escapeHtml(q.question)}
        </div>
        <div class="trivia-options" id="trivia-options">
          ${q.options.map((option, idx) => `
            <button class="trivia-option" data-index="${idx}">
              ${idx + 1}. ${escapeHtml(option)}
            </button>
          `).join('')}
        </div>
        <div id="trivia-feedback"></div>
      </div>
      
      <div class="trivia-score">
        Question ${this.state.currentQuestion + 1} of ${this.questions.length}
        <br>
        <strong>Score: ${this.state.score}/${this.state.currentQuestion}</strong>
      </div>
    `;
    
    this.state.container.innerHTML = html;
    this.state.answered = false;
    
    // Setup click handlers
    this.setupOptionHandlers();
  },
  
  /**
   * Setup click handlers for options
   */
  setupOptionHandlers() {
    const options = this.state.container.querySelectorAll('.trivia-option');
    options.forEach((option, idx) => {
      option.addEventListener('click', () => {
        if (!this.state.answered) {
          this.checkAnswer(idx);
        }
      });
    });
  },
  
  /**
   * Handle keyboard input (1-4 for options)
   */
  handleKeyboard(e) {
    if (this.state.answered) {
      // Space or Enter to continue
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        this.nextQuestion();
      }
      return;
    }
    
    // Number keys 1-4 for options
    const num = parseInt(e.key);
    if (num >= 1 && num <= 4) {
      const q = this.questions[this.state.currentQuestion];
      if (num - 1 < q.options.length) {
        this.checkAnswer(num - 1);
      }
    }
  },
  
  /**
   * Check if answer is correct
   */
  checkAnswer(selectedIndex) {
    if (this.state.answered) return;
    
    const q = this.questions[this.state.currentQuestion];
    const isCorrect = selectedIndex === q.correct;
    
    this.state.answered = true;
    
    if (isCorrect) {
      this.state.score++;
    }
    
    // Visual feedback
    const options = this.state.container.querySelectorAll('.trivia-option');
    options.forEach((option, idx) => {
      if (idx === q.correct) {
        option.classList.add('correct');
      } else if (idx === selectedIndex && !isCorrect) {
        option.classList.add('incorrect');
      }
      option.style.pointerEvents = 'none';
    });
    
    // Show explanation
    const feedback = this.state.container.querySelector('#trivia-feedback');
    feedback.innerHTML = `
      <div class="trivia-feedback ${isCorrect ? 'correct' : 'incorrect'}">
        <strong>${isCorrect ? '✓ Correct!' : '✗ Incorrect'}</strong>
        <p>${escapeHtml(q.explanation)}</p>
        <button class="btn" id="btn-next" style="margin-top: 16px;">
          ${this.state.currentQuestion < this.questions.length - 1 ? 'Next Question' : 'See Final Score'}
        </button>
      </div>
    `;
    
    // Wire next button
    this.state.container.querySelector('#btn-next').addEventListener('click', () => {
      this.nextQuestion();
    });
  },
  
  /**
   * Move to next question or show results
   */
  nextQuestion() {
    this.state.currentQuestion++;
    
    if (this.state.currentQuestion >= this.questions.length) {
      this.showResults();
    } else {
      this.renderQuestion();
    }
  },
  
  /**
   * Show final results
   */
  showResults() {
    const percent = Math.round((this.state.score / this.questions.length) * 100);
    let message = '';
    
    if (percent === 100) {
      message = 'Perfect score! You know your stuff!';
    } else if (percent >= 70) {
      message = 'Great job! You did really well!';
    } else if (percent >= 50) {
      message = 'Not bad! Keep learning!';
    } else {
      message = 'Give it another try!';
    }
    
    const html = `
      <div class="game-intro">
        <div class="game-intro-content">
          <h2 class="game-intro-title">Quiz Complete!</h2>
          <div class="trivia-score" style="font-size: 2rem; margin: 32px 0;">
            <strong>${this.state.score} / ${this.questions.length}</strong>
            <br>
            <span style="font-size: 1.2rem; opacity: 0.8;">${percent}%</span>
          </div>
          <p style="font-size: 1.2rem; margin-bottom: 32px;">
            ${escapeHtml(message)}
          </p>
          <div class="game-intro-buttons">
            <button class="btn" id="btn-play-again">Play Again</button>
            <button class="btn btn-secondary" id="btn-back-deck">Back to Deck</button>
          </div>
        </div>
      </div>
    `;
    
    this.state.container.innerHTML = html;
    
    // Wire buttons
    this.state.container.querySelector('#btn-play-again').addEventListener('click', () => {
      this.render(this.state.container, 'trivia');
    });
    
    this.state.container.querySelector('#btn-back-deck').addEventListener('click', () => {
      ModeController.exitGameMode();
    });
  },
  
  /**
   * Clean up game state
   */
  destroy() {
    this.state = {
      currentQuestion: 0,
      score: 0,
      answered: false,
      container: null
    };
  }
};

// Register the game
GameRegistry.register('trivia', TriviaGame);

console.log('✓ Trivia game loaded');
