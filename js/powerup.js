// ============================================
// powerup.js — Power-up system
// ============================================

const POWERUP_TYPES = {
  FREEZE: {
    name: 'Freeze Time',
    icon: '❄️',
    color: [100, 200, 255],
    duration: 5000,
    description: 'Stops all words for 5 seconds'
  },
  DOUBLE_SCORE: {
    name: 'Double Score',
    icon: '⭐',
    color: [255, 215, 0],
    duration: 10000,
    description: 'Double points for 10 seconds'
  },
  BOMB: {
    name: 'Bomb',
    icon: '💣',
    color: [255, 80, 60],
    duration: 0,
    description: 'Destroys every active word'
  },
  EXTRA_LIFE: {
    name: 'Extra Life',
    icon: '💚',
    color: [0, 255, 100],
    duration: 0,
    description: 'Adds one life'
  },
  SLOW_MOTION: {
    name: 'Slow Motion',
    icon: '🐌',
    color: [180, 100, 255],
    duration: 8000,
    description: 'Reduces falling speed'
  }
};

class PowerUp {
  constructor(type, canvasWidth, canvasHeight) {
    this.type = type;
    this.config = POWERUP_TYPES[type];
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    // Generate a short trigger word
    const triggerWords = ['PWR', 'GET', 'USE', 'WIN', 'UP', 'GO', 'YES', 'NOW'];
    this.word = triggerWords[Math.floor(Math.random() * triggerWords.length)];
    this.typedIndex = 0;

    this.x = random(60, canvasWidth - 60);
    this.y = -30;
    this.speed = 0.5;
    this.active = true;
    this.completed = false;
    this.pulsePhase = random(TWO_PI);
    this.size = 50;
  }

  update() {
    if (!this.active) return;
    this.y += this.speed;
    this.pulsePhase += 0.08;
  }

  draw() {
    if (!this.active) return;

    const pulse = sin(this.pulsePhase) * 4;
    const s = this.size + pulse;

    // Glow background
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = `rgba(${this.config.color[0]}, ${this.config.color[1]}, ${this.config.color[2]}, 0.6)`;

    // Rounded box
    fill(20, 20, 40, 200);
    stroke(this.config.color[0], this.config.color[1], this.config.color[2], 180);
    strokeWeight(2);
    rectMode(CENTER);
    rect(this.x, this.y, s + 40, s, 12);
    rectMode(CORNER);

    drawingContext.shadowBlur = 0;

    // Icon
    textAlign(CENTER, CENTER);
    textSize(24);
    noStroke();
    text(this.config.icon, this.x - 20, this.y - 5);

    // Trigger word with typing progress
    textSize(14);
    textStyle(BOLD);
    const wordStartX = this.x + 5;
    const totalW = textWidth(this.word);
    let cx = wordStartX - totalW / 2;

    for (let i = 0; i < this.word.length; i++) {
      const cw = textWidth(this.word[i]);
      if (i < this.typedIndex) {
        fill(this.config.color[0], this.config.color[1], this.config.color[2]);
      } else {
        fill(200, 200, 220);
      }
      text(this.word[i], cx + cw / 2, this.y - 2);
      cx += cw;
    }

    // Label
    textSize(9);
    textStyle(NORMAL);
    fill(this.config.color[0], this.config.color[1], this.config.color[2], 180);
    text(this.config.name, this.x, this.y + 16);
  }

  tryMatch(char) {
    if (!this.active || this.completed) return false;
    const upperChar = char.toUpperCase();
    if (this.word[this.typedIndex] === upperChar) {
      this.typedIndex++;
      if (this.typedIndex >= this.word.length) {
        this.completed = true;
        this.active = false;
      }
      return true;
    }
    return false;
  }

  resetProgress() {
    this.typedIndex = 0;
  }

  isOutOfBounds() {
    return this.y > this.canvasHeight + 30;
  }
}
