// ============================================
// audio.js — Audio manager with Web Audio API
// ============================================

class AudioManager {
  constructor() {
    this.muted = false;
    this.audioCtx = null;
    this.initialized = false;
  }

  // Initialize audio context on first user interaction
  init() {
    if (this.initialized) return;
    try {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  // Generate a short beep/tone procedurally
  _playTone(frequency, duration, type = 'sine', volume = 0.15) {
    if (this.muted || !this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
    gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + duration);
  }

  // Play two quick tones (ascending)
  _playChord(freqs, duration, type = 'sine', volume = 0.1) {
    if (this.muted || !this.audioCtx) return;
    freqs.forEach((f, i) => {
      setTimeout(() => this._playTone(f, duration, type, volume), i * 60);
    });
  }

  // Sound: key typed correctly
  playType() {
    this._playTone(600 + Math.random() * 200, 0.08, 'square', 0.06);
  }

  // Sound: word completed
  playWordComplete() {
    this._playChord([523, 659, 784], 0.2, 'sine', 0.12);
  }

  // Sound: combo milestone
  playCombo() {
    this._playChord([440, 554, 659, 880], 0.3, 'triangle', 0.12);
  }

  // Sound: game over
  playGameOver() {
    this._playChord([400, 300, 200], 0.5, 'sawtooth', 0.1);
  }

  // Sound: level up
  playLevelUp() {
    this._playChord([523, 659, 784, 1047], 0.25, 'sine', 0.15);
  }

  // Sound: power-up collected
  playPowerUp() {
    this._playChord([880, 1100, 1320], 0.15, 'triangle', 0.1);
  }

  // Sound: life lost
  playLifeLost() {
    this._playChord([300, 200], 0.4, 'sawtooth', 0.08);
  }

  // Sound: wrong key
  playMiss() {
    this._playTone(150, 0.1, 'square', 0.04);
  }
}
