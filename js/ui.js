// ============================================
// ui.js — DOM-based UI screens management
// ============================================

class UI {
  constructor(stats) {
    this.stats = stats;
    this.currentScreen = null;
    this.screens = {};
    this.onStartGame = null;
    this.onResumeGame = null;
    this.onGoHome = null;
    this.onMuteToggle = null;

    this.cacheScreens();
    this.setupEventListeners();
  }

  cacheScreens() {
    this.screens = {
      loading: document.getElementById('loading-screen'),
      home: document.getElementById('home-screen'),
      instructions: document.getElementById('instructions-screen'),
      gameplay: document.getElementById('gameplay-screen'),
      pause: document.getElementById('pause-screen'),
      gameover: document.getElementById('gameover-screen'),
      statistics: document.getElementById('statistics-screen')
    };
  }

  setupEventListeners() {
    // Home screen buttons
    document.getElementById('btn-start').addEventListener('click', () => {
      if (this.onStartGame) this.onStartGame();
    });

    document.getElementById('btn-instructions').addEventListener('click', () => {
      this.showScreen('instructions');
    });

    document.getElementById('btn-statistics').addEventListener('click', () => {
      this.updateStatsScreen();
      this.showScreen('statistics');
    });

    // Instructions back
    document.getElementById('btn-instructions-back').addEventListener('click', () => {
      this.showScreen('home');
    });

    // Statistics back
    document.getElementById('btn-stats-back').addEventListener('click', () => {
      this.showScreen('home');
    });

    // Statistics reset
    document.getElementById('btn-stats-reset').addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all statistics?')) {
        this.stats.reset();
        this.updateStatsScreen();
      }
    });

    // Pause screen
    document.getElementById('btn-resume').addEventListener('click', () => {
      if (this.onResumeGame) this.onResumeGame();
    });

    document.getElementById('btn-pause-home').addEventListener('click', () => {
      if (this.onGoHome) this.onGoHome();
    });

    // Game Over screen
    document.getElementById('btn-restart').addEventListener('click', () => {
      if (this.onStartGame) this.onStartGame();
    });

    document.getElementById('btn-gameover-home').addEventListener('click', () => {
      if (this.onGoHome) this.onGoHome();
    });

    // Mute button
    document.getElementById('btn-mute').addEventListener('click', () => {
      if (this.onMuteToggle) this.onMuteToggle();
    });
  }

  showScreen(name) {
    // Hide all screens
    Object.values(this.screens).forEach(screen => {
      if (screen) screen.classList.remove('active');
    });

    // Show target
    if (this.screens[name]) {
      this.screens[name].classList.add('active');
      this.currentScreen = name;
    }

    // Show/hide canvas
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.style.display = (name === 'gameplay') ? 'block' : 'none';
    }

    // Show/hide HUD
    const hud = document.getElementById('hud');
    if (hud) {
      hud.style.display = (name === 'gameplay') ? 'flex' : 'none';
    }

    // Update home high score
    if (name === 'home') {
      document.getElementById('home-highscore').textContent = this.stats.data.highScore;
    }
  }

  // Update HUD elements during gameplay
  updateHUD(lives, score, level, combo, comboMultiplier, timeSurvived, highScore) {
    document.getElementById('hud-lives').textContent = '❤️'.repeat(Math.max(0, lives));
    document.getElementById('hud-score').textContent = score;
    document.getElementById('hud-level').textContent = level;
    document.getElementById('hud-time').textContent = this.stats.formatTime(timeSurvived);
    document.getElementById('hud-highscore').textContent = highScore;

    const comboEl = document.getElementById('hud-combo');
    if (combo >= 5) {
      comboEl.textContent = `Combo x${comboMultiplier}`;
      comboEl.style.display = 'block';
    } else {
      comboEl.style.display = 'none';
    }
  }

  // Show active power-up indicator
  showPowerUpIndicator(name, timeLeft) {
    let indicator = document.getElementById('powerup-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'powerup-indicator';
      document.getElementById('gameplay-screen').appendChild(indicator);
    }
    indicator.textContent = `${name} — ${Math.ceil(timeLeft / 1000)}s`;
    indicator.style.display = 'block';
  }

  hidePowerUpIndicator() {
    const indicator = document.getElementById('powerup-indicator');
    if (indicator) indicator.style.display = 'none';
  }

  // Update Game Over screen
  updateGameOverScreen(score, combo, level, timeSurvived, accuracy, isNewHighScore) {
    document.getElementById('go-score').textContent = score;
    document.getElementById('go-combo').textContent = combo;
    document.getElementById('go-level').textContent = level;
    document.getElementById('go-time').textContent = this.stats.formatTime(timeSurvived);
    document.getElementById('go-accuracy').textContent = `${accuracy}%`;

    const newHSEl = document.getElementById('go-new-highscore');
    if (newHSEl) {
      newHSEl.style.display = isNewHighScore ? 'block' : 'none';
    }
  }

  // Update Statistics screen
  updateStatsScreen() {
    const d = this.stats.data;
    document.getElementById('stat-highscore').textContent = d.highScore;
    document.getElementById('stat-games').textContent = d.gamesPlayed;
    document.getElementById('stat-combo').textContent = d.bestCombo;
    document.getElementById('stat-level').textContent = d.highestLevel;
    document.getElementById('stat-survival').textContent = this.stats.formatTime(d.longestSurvival);
    document.getElementById('stat-accuracy').textContent = `${this.stats.getAverageAccuracy()}%`;
    document.getElementById('stat-words').textContent = d.totalWordsTyped;
  }

  setMuteIcon(muted) {
    document.getElementById('btn-mute').textContent = muted ? '🔇' : '🔊';
  }

  // Loading screen progress
  setLoadingProgress(percent) {
    const bar = document.getElementById('loading-bar-fill');
    if (bar) bar.style.width = `${percent}%`;
  }
}
