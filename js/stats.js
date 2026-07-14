// ============================================
// stats.js — Statistics persistence (localStorage)
// ============================================

class Statistics {
  constructor() {
    this.storageKey = 'typingDefenderStats';
    this.data = this.load();
  }

  // Default stats structure
  getDefaults() {
    return {
      highScore: 0,
      gamesPlayed: 0,
      bestCombo: 0,
      highestLevel: 0,
      longestSurvival: 0,   // in seconds
      totalCorrectChars: 0,
      totalTypedChars: 0,
      totalWordsTyped: 0
    };
  }

  load() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        return { ...this.getDefaults(), ...JSON.parse(raw) };
      }
    } catch (e) {
      console.warn('Failed to load stats from localStorage');
    }
    return this.getDefaults();
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Failed to save stats to localStorage');
    }
  }

  // Update stats after a game ends
  updateAfterGame(score, combo, level, survivalTime, correctChars, totalChars, wordsTyped) {
    this.data.gamesPlayed++;
    this.data.highScore = Math.max(this.data.highScore, score);
    this.data.bestCombo = Math.max(this.data.bestCombo, combo);
    this.data.highestLevel = Math.max(this.data.highestLevel, level);
    this.data.longestSurvival = Math.max(this.data.longestSurvival, survivalTime);
    this.data.totalCorrectChars += correctChars;
    this.data.totalTypedChars += totalChars;
    this.data.totalWordsTyped += wordsTyped;
    this.save();
  }

  getAverageAccuracy() {
    if (this.data.totalTypedChars === 0) return 0;
    return Math.round((this.data.totalCorrectChars / this.data.totalTypedChars) * 100);
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  }

  reset() {
    this.data = this.getDefaults();
    this.save();
  }
}
