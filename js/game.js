// ============================================
// game.js — Core game logic
// ============================================

const GAME_STATES = {
  LOADING: 'loading',
  HOME: 'home',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAMEOVER: 'gameover'
};

const LEVEL_INTERVAL = 30; // seconds between level ups

class Game {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.state = GAME_STATES.LOADING;

    // Core systems
    this.stats = new Statistics();
    this.ui = new UI(this.stats);
    this.audio = new AudioManager();
    this.particleSystem = new ParticleSystem();

    // Game state
    this.lives = 3;
    this.score = 0;
    this.level = 1;
    this.combo = 0;
    this.maxCombo = 0;
    this.comboMultiplier = 1;
    this.startTime = 0;
    this.timeSurvived = 0;
    this.lastLevelTime = 0;

    // Typing stats
    this.correctChars = 0;
    this.totalChars = 0;
    this.wordsTyped = 0;

    // Entities
    this.words = [];
    this.powerUps = [];
    this.activeTarget = null; // currently targeted word/powerup

    // Power-up effects
    this.activePowerUpEffects = {};
    this.originalSpeed = 0;

    // Power-up spawn timer
    this.lastPowerUpTime = 0;
    this.powerUpInterval = 15000; // ms between power-up spawns

    // Background stars
    this.bgStars = [];
    for (let i = 0; i < 80; i++) {
      this.bgStars.push({
        x: random(canvasWidth),
        y: random(canvasHeight),
        size: random(1, 3),
        speed: random(0.2, 0.8),
        brightness: random(80, 200)
      });
    }

    this.setupUICallbacks();
    this.simulateLoading();
  }

  setupUICallbacks() {
    this.ui.onStartGame = () => this.startGame();
    this.ui.onResumeGame = () => this.resumeGame();
    this.ui.onGoHome = () => this.goHome();
    this.ui.onMuteToggle = () => {
      this.audio.init();
      const muted = this.audio.toggleMute();
      this.ui.setMuteIcon(muted);
    };
  }

  simulateLoading() {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          this.state = GAME_STATES.HOME;
          this.ui.showScreen('home');
        }, 400);
      }
      this.ui.setLoadingProgress(progress);
    }, 200);
  }

  startGame() {
    this.audio.init();
    this.state = GAME_STATES.PLAYING;
    this.lives = 3;
    this.score = 0;
    this.level = 1;
    this.combo = 0;
    this.maxCombo = 0;
    this.comboMultiplier = 1;
    this.correctChars = 0;
    this.totalChars = 0;
    this.wordsTyped = 0;
    this.words = [];
    this.powerUps = [];
    this.activeTarget = null;
    this.activePowerUpEffects = {};
    this.particleSystem.clear();

    this.startTime = millis();
    this.lastLevelTime = this.startTime;
    this.lastPowerUpTime = this.startTime;
    this.timeSurvived = 0;

    // Spawn initial words
    this.spawnInitialWords();

    this.ui.showScreen('gameplay');
  }

  spawnInitialWords() {
    const count = this.getMaxWords();
    for (let i = 0; i < count; i++) {
      this.spawnWord();
    }
  }

  getMaxWords() {
    return Math.min(3 + this.level - 1, 10);
  }

  getFallSpeed() {
    let speed = 0.4 + (this.level - 1) * 0.15;
    // Slow motion effect
    if (this.activePowerUpEffects.SLOW_MOTION) {
      speed *= 0.4;
    }
    return speed;
  }

  spawnWord() {
    const word = getRandomWord(this.level);
    const speed = this.getFallSpeed() + random(-0.1, 0.1);
    const w = new FallingWord(word, speed, this.canvasWidth, this.canvasHeight);
    // Stagger Y position so words don't all start at same height
    w.y = random(-80, -20);
    this.words.push(w);
  }

  spawnPowerUp() {
    const types = Object.keys(POWERUP_TYPES);
    const type = types[Math.floor(Math.random() * types.length)];
    const pu = new PowerUp(type, this.canvasWidth, this.canvasHeight);
    this.powerUps.push(pu);
  }

  pauseGame() {
    if (this.state !== GAME_STATES.PLAYING) return;
    this.state = GAME_STATES.PAUSED;
    this.ui.showScreen('pause');
  }

  resumeGame() {
    if (this.state !== GAME_STATES.PAUSED) return;
    this.state = GAME_STATES.PLAYING;
    this.ui.showScreen('gameplay');
  }

  goHome() {
    this.state = GAME_STATES.HOME;
    this.ui.hidePowerUpIndicator();
    this.ui.showScreen('home');
  }

  gameOver() {
    this.state = GAME_STATES.GAMEOVER;
    this.audio.playGameOver();

    const accuracy = this.totalChars > 0
      ? Math.round((this.correctChars / this.totalChars) * 100)
      : 0;

    const isNewHighScore = this.score > this.stats.data.highScore;

    this.stats.updateAfterGame(
      this.score, this.maxCombo, this.level,
      this.timeSurvived, this.correctChars, this.totalChars, this.wordsTyped
    );

    this.ui.updateGameOverScreen(
      this.score, this.maxCombo, this.level,
      this.timeSurvived, accuracy, isNewHighScore
    );
    this.ui.hidePowerUpIndicator();
    this.ui.showScreen('gameover');
  }

  // Main game update loop — called from p5 draw()
  update() {
    if (this.state !== GAME_STATES.PLAYING) return;

    const now = millis();
    this.timeSurvived = (now - this.startTime) / 1000;

    // Level up check
    if (now - this.lastLevelTime > LEVEL_INTERVAL * 1000) {
      this.level++;
      this.lastLevelTime = now;
      this.audio.playLevelUp();
      this.particleSystem.addFloatingText(
        this.canvasWidth / 2, this.canvasHeight / 2,
        `Level ${this.level}!`, [255, 215, 0]
      );
    }

    // Power-up spawn check
    if (now - this.lastPowerUpTime > this.powerUpInterval) {
      if (Math.random() < 0.6) {
        this.spawnPowerUp();
      }
      this.lastPowerUpTime = now;
    }

    // Update power-up effect timers
    this.updatePowerUpEffects(now);

    // Freeze check — don't move words if frozen
    const isFrozen = !!this.activePowerUpEffects.FREEZE;

    // Update words
    for (let i = this.words.length - 1; i >= 0; i--) {
      const w = this.words[i];
      if (!isFrozen) w.update();

      if (w.isOutOfBounds()) {
        this.words.splice(i, 1);
        this.loseLife();
        if (this.activeTarget === w) this.activeTarget = null;
        this.spawnWord();
      }
    }

    // Update power-ups
    for (let i = this.powerUps.length - 1; i >= 0; i--) {
      const pu = this.powerUps[i];
      if (!isFrozen) pu.update();

      if (pu.isOutOfBounds()) {
        this.powerUps.splice(i, 1);
        if (this.activeTarget === pu) this.activeTarget = null;
      }
    }

    // Ensure enough words on screen
    while (this.words.length < this.getMaxWords()) {
      this.spawnWord();
    }

    // Update particles
    this.particleSystem.update();

    // Update HUD
    this.ui.updateHUD(
      this.lives, this.score, this.level,
      this.combo, this.comboMultiplier,
      this.timeSurvived, Math.max(this.stats.data.highScore, this.score)
    );
  }

  updatePowerUpEffects(now) {
    for (const [type, endTime] of Object.entries(this.activePowerUpEffects)) {
      if (endTime > 0 && now >= endTime) {
        delete this.activePowerUpEffects[type];
        this.ui.hidePowerUpIndicator();
      } else if (endTime > 0) {
        this.ui.showPowerUpIndicator(
          POWERUP_TYPES[type].name,
          endTime - now
        );
      }
    }
  }

  loseLife() {
    this.lives--;
    this.combo = 0;
    this.comboMultiplier = 1;
    this.audio.playLifeLost();

    if (this.lives <= 0) {
      this.gameOver();
    }
  }

  // Handle keyboard input
  handleKey(key) {
    if (this.state !== GAME_STATES.PLAYING) return;
    if (key.length !== 1) return; // ignore special keys

    this.totalChars++;

    // Try to match against active target first
    if (this.activeTarget && this.activeTarget.active) {
      if (this.activeTarget.tryMatch(key)) {
        this.correctChars++;
        this.audio.playType();

        if (this.activeTarget.completed) {
          this.onTargetCompleted(this.activeTarget);
          this.activeTarget = null;
        }
        return;
      }
    }

    // No active target or mismatch — find a new target
    // Check power-ups first
    for (const pu of this.powerUps) {
      if (pu.active && pu.word[0] === key.toUpperCase()) {
        // Reset old target
        if (this.activeTarget) this.activeTarget.resetProgress();
        this.activeTarget = pu;
        pu.tryMatch(key);
        this.correctChars++;
        this.audio.playType();

        if (pu.completed) {
          this.onTargetCompleted(pu);
          this.activeTarget = null;
        }
        return;
      }
    }

    // Check words
    for (const w of this.words) {
      if (w.active && w.upperText[0] === key.toUpperCase()) {
        // Reset old target
        if (this.activeTarget) this.activeTarget.resetProgress();
        this.activeTarget = w;
        w.tryMatch(key);
        this.correctChars++;
        this.audio.playType();

        if (w.completed) {
          this.onTargetCompleted(w);
          this.activeTarget = null;
        }
        return;
      }
    }

    // No match at all
    this.audio.playMiss();
    this.combo = 0;
    this.comboMultiplier = 1;
  }

  onTargetCompleted(target) {
    if (target instanceof PowerUp) {
      this.activatePowerUp(target);
      this.audio.playPowerUp();
      this.particleSystem.emitRing(target.x, target.y, 20, target.config.color);
      // Remove from array
      const idx = this.powerUps.indexOf(target);
      if (idx !== -1) this.powerUps.splice(idx, 1);
    } else {
      // It's a FallingWord
      this.wordsTyped++;
      this.combo++;
      this.maxCombo = Math.max(this.maxCombo, this.combo);

      // Update combo multiplier every 5 consecutive words
      this.comboMultiplier = 1 + Math.floor(this.combo / 5);

      let points = target.getScore() * this.comboMultiplier;
      if (this.activePowerUpEffects.DOUBLE_SCORE) {
        points *= 2;
      }
      this.score += points;

      // Effects
      this.audio.playWordComplete();
      this.particleSystem.emit(target.x, target.y, 15, [0, 255, 150]);
      this.particleSystem.addFloatingText(
        target.x, target.y - 20,
        `+${points}`, [0, 255, 150]
      );

      // Combo milestone effect
      if (this.combo > 0 && this.combo % 5 === 0) {
        this.audio.playCombo();
        this.particleSystem.addFloatingText(
          this.canvasWidth / 2, this.canvasHeight / 2,
          `Combo x${this.comboMultiplier}!`, [255, 215, 0]
        );
        this.particleSystem.emitRing(
          this.canvasWidth / 2, this.canvasHeight / 2, 30, [255, 215, 0]
        );
      }

      // Remove word and spawn replacement
      const idx = this.words.indexOf(target);
      if (idx !== -1) this.words.splice(idx, 1);
      this.spawnWord();
    }
  }

  activatePowerUp(pu) {
    const now = millis();
    const type = pu.type;
    const config = POWERUP_TYPES[type];

    switch (type) {
      case 'FREEZE':
        this.activePowerUpEffects.FREEZE = now + config.duration;
        break;

      case 'DOUBLE_SCORE':
        this.activePowerUpEffects.DOUBLE_SCORE = now + config.duration;
        break;

      case 'BOMB':
        // Destroy all active words with effects
        for (const w of this.words) {
          this.particleSystem.emit(w.x, w.y, 10, [255, 80, 60]);
          this.score += 2; // small bonus per destroyed word
        }
        this.words = [];
        // Respawn
        this.spawnInitialWords();
        break;

      case 'EXTRA_LIFE':
        this.lives = Math.min(this.lives + 1, 5);
        this.particleSystem.addFloatingText(
          this.canvasWidth / 2, this.canvasHeight / 2,
          '+1 Life!', [0, 255, 100]
        );
        break;

      case 'SLOW_MOTION':
        this.activePowerUpEffects.SLOW_MOTION = now + config.duration;
        // Slow down existing words
        for (const w of this.words) {
          w.speed *= 0.4;
        }
        break;
    }
  }

  // Draw everything — called from p5 draw()
  render() {
    if (this.state !== GAME_STATES.PLAYING) return;

    // Background
    this.drawBackground();

    // Draw words
    for (const w of this.words) {
      w.draw();
    }

    // Draw power-ups
    for (const pu of this.powerUps) {
      pu.draw();
    }

    // Draw particles
    this.particleSystem.draw();

    // Freeze overlay
    if (this.activePowerUpEffects.FREEZE) {
      noStroke();
      fill(100, 200, 255, 15);
      rect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    // Active target indicator
    if (this.activeTarget && this.activeTarget.active) {
      this.drawTargetIndicator(this.activeTarget);
    }
  }

  drawBackground() {
    // Gradient background
    for (let y = 0; y < this.canvasHeight; y += 4) {
      const inter = map(y, 0, this.canvasHeight, 0, 1);
      const c = lerpColor(color(10, 10, 30), color(20, 5, 40), inter);
      stroke(c);
      strokeWeight(4);
      line(0, y, this.canvasWidth, y);
    }

    // Animated stars
    noStroke();
    for (const star of this.bgStars) {
      star.y += star.speed;
      if (star.y > this.canvasHeight) {
        star.y = 0;
        star.x = random(this.canvasWidth);
      }
      const flicker = star.brightness + sin(frameCount * 0.05 + star.x) * 30;
      fill(flicker, flicker, flicker + 40, 180);
      ellipse(star.x, star.y, star.size);
    }

    // Bottom danger zone
    noStroke();
    for (let i = 0; i < 30; i++) {
      fill(255, 0, 50, map(i, 0, 30, 20, 0));
      rect(0, this.canvasHeight - 30 + i, this.canvasWidth, 1);
    }
  }

  drawTargetIndicator(target) {
    noFill();
    stroke(0, 255, 150, 100 + sin(frameCount * 0.1) * 50);
    strokeWeight(1);
    const w = target.text ? target.text.length * 14 + 20 : 80;
    rectMode(CENTER);
    rect(target.x, target.y, w, 36, 6);
    rectMode(CORNER);
  }
}
