// ============================================
// word.js — Falling word entity
// ============================================

class FallingWord {
  constructor(text, speed, canvasWidth, canvasHeight) {
    this.text = text;
    this.upperText = text.toUpperCase();
    this.typedIndex = 0; // how many chars have been matched
    this.speed = speed;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    // Position — leave margins for text width
    this.fontSize = 20;
    const approxWidth = this.text.length * 13;
    this.x = random(approxWidth / 2 + 20, canvasWidth - approxWidth / 2 - 20);
    this.y = -20;

    // Visual
    this.glowIntensity = 0;
    this.active = true;
    this.completed = false;
    this.isPowerUp = false;
  }

  update() {
    if (!this.active) return;
    this.y += this.speed;

    // Glow pulse when partially typed
    if (this.typedIndex > 0) {
      this.glowIntensity = 8 + sin(frameCount * 0.15) * 4;
    }
  }

  draw() {
    if (!this.active) return;

    textSize(this.fontSize);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);

    const totalWidth = textWidth(this.text);
    let startX = this.x - totalWidth / 2;

    // Draw each character individually for highlighting
    for (let i = 0; i < this.text.length; i++) {
      const charWidth = textWidth(this.text[i]);

      if (i < this.typedIndex) {
        // Typed characters — bright neon green with glow
        if (this.glowIntensity > 0) {
          drawingContext.shadowBlur = this.glowIntensity;
          drawingContext.shadowColor = 'rgba(0, 255, 150, 0.8)';
        }
        fill(0, 255, 150);
      } else {
        // Untyped characters — dimmer white
        drawingContext.shadowBlur = 4;
        drawingContext.shadowColor = 'rgba(255, 255, 255, 0.3)';
        fill(220, 220, 240);
      }

      noStroke();
      text(this.text[i], startX + charWidth / 2, this.y);
      startX += charWidth;
    }

    // Reset shadow
    drawingContext.shadowBlur = 0;

    // Progress bar under the word
    if (this.typedIndex > 0) {
      const progress = this.typedIndex / this.text.length;
      const barWidth = totalWidth + 10;
      const barX = this.x - barWidth / 2;
      const barY = this.y + this.fontSize / 2 + 6;

      noStroke();
      fill(50, 50, 70, 150);
      rect(barX, barY, barWidth, 3, 2);

      fill(0, 255, 150);
      rect(barX, barY, barWidth * progress, 3, 2);
    }
  }

  // Try to match a typed character
  tryMatch(char) {
    if (!this.active || this.completed) return false;

    const upperChar = char.toUpperCase();
    if (this.upperText[this.typedIndex] === upperChar) {
      this.typedIndex++;
      if (this.typedIndex >= this.text.length) {
        this.completed = true;
        this.active = false;
      }
      return true;
    }
    return false;
  }

  // Check if word reached the bottom
  isOutOfBounds() {
    return this.y > this.canvasHeight + 10;
  }

  // Reset typing progress (when switching targets)
  resetProgress() {
    this.typedIndex = 0;
  }

  // Get score based on word length
  getScore() {
    const len = this.text.length;
    if (len >= 13) return 30;
    if (len >= 9) return 20;
    if (len >= 6) return 10;
    return 5;
  }
}
