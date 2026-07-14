// ============================================
// particle.js — Particle effects system
// ============================================

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color || [0, 255, 200];
    this.vx = random(-4, 4);
    this.vy = random(-6, -1);
    this.alpha = 255;
    this.size = random(3, 8);
    this.decay = random(4, 10);
    this.gravity = 0.15;
  }

  update() {
    this.x += this.vx;
    this.vy += this.gravity;
    this.y += this.vy;
    this.alpha -= this.decay;
    this.size *= 0.97;
  }

  draw() {
    noStroke();
    fill(this.color[0], this.color[1], this.color[2], this.alpha);
    ellipse(this.x, this.y, this.size);
  }

  isDead() {
    return this.alpha <= 0 || this.size < 0.5;
  }
}

// Floating score text that rises and fades
class FloatingText {
  constructor(x, y, text, color) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color || [0, 255, 200];
    this.alpha = 255;
    this.vy = -2;
    this.decay = 3;
    this.size = 22;
  }

  update() {
    this.y += this.vy;
    this.alpha -= this.decay;
    this.vy *= 0.98;
  }

  draw() {
    textAlign(CENTER, CENTER);
    textSize(this.size);
    textStyle(BOLD);
    fill(this.color[0], this.color[1], this.color[2], this.alpha);
    noStroke();
    text(this.text, this.x, this.y);
  }

  isDead() {
    return this.alpha <= 0;
  }
}

// Manages all particles and floating texts
class ParticleSystem {
  constructor() {
    this.particles = [];
    this.floatingTexts = [];
  }

  // Emit a burst of particles at position
  emit(x, y, count, color) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y, color));
    }
  }

  // Emit particles in a ring pattern
  emitRing(x, y, count, color) {
    for (let i = 0; i < count; i++) {
      const angle = (TWO_PI / count) * i;
      const p = new Particle(x, y, color);
      const speed = random(2, 5);
      p.vx = cos(angle) * speed;
      p.vy = sin(angle) * speed;
      p.gravity = 0;
      this.particles.push(p);
    }
  }

  // Add floating score text
  addFloatingText(x, y, text, color) {
    this.floatingTexts.push(new FloatingText(x, y, text, color));
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].isDead()) {
        this.particles.splice(i, 1);
      }
    }
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      this.floatingTexts[i].update();
      if (this.floatingTexts[i].isDead()) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  draw() {
    for (const p of this.particles) {
      p.draw();
    }
    for (const ft of this.floatingTexts) {
      ft.draw();
    }
  }

  clear() {
    this.particles = [];
    this.floatingTexts = [];
  }
}
