# Typing Defender

A fast-paced browser-based typing game built with HTML5, CSS3, vanilla JavaScript, and p5.js. Type falling developer-themed words before they reach the bottom of the screen to survive and achieve the highest score.

**Demo:** https://typing-defender-swart.vercel.app/

## Features

- **7 Game Screens** — Loading, Home, Instructions, Gameplay, Pause, Game Over, Statistics
- **Progressive Difficulty** — Levels increase every 30 seconds with faster speeds and more simultaneous words
- **Combo System** — Chain 5+ correct words for score multipliers (x2, x3, x4...)
- **5 Power-Ups** — Freeze Time, Double Score, Bomb, Extra Life, Slow Motion
- **Particle Effects** — Colorful burst animations and floating score text on word completion
- **Developer-Themed Dictionary** — 100+ words from HTML to Kubernetes to Polymorphism
- **Persistent Statistics** — High score, games played, best combo, accuracy, and more saved to localStorage
- **Procedural Audio** — Synthesized sound effects using the Web Audio API (no audio files needed)
- **Dark Cyber Theme** — Neon glows, gradient backgrounds, animated orbs, and smooth transitions
- **Responsive Design** — Desktop-optimized with tablet support down to 768px

## Installation

No build tools or server required.

1. Clone or download this repository
2. Open `index.html` in a modern browser (Chrome, Firefox, Safari, Edge)

```bash
git clone <repo-url>
cd typing-defender
open index.html
```

## Controls

| Key | Action |
|-----|--------|
| A-Z | Type letters to match falling words |
| ESC | Pause / Resume game |
| Mouse | Navigate menus |

## Folder Structure

```
typing-defender/
├── index.html          # Entry point
├── css/
│   └── style.css       # All styles, CSS variables, responsive design
├── js/
│   ├── sketch.js       # p5.js setup, draw loop, input handling
│   ├── game.js         # Core game logic, state management
│   ├── word.js         # FallingWord class
│   ├── particle.js     # Particle, FloatingText, ParticleSystem classes
│   ├── powerup.js      # PowerUp class and types
│   ├── ui.js           # DOM-based UI/screen management
│   ├── stats.js        # Statistics persistence (localStorage)
│   ├── audio.js        # AudioManager with Web Audio API
│   └── words.js        # Developer-themed word dictionary
├── assets/
│   ├── sounds/         # Reserved for future audio files
│   └── images/         # Reserved for future image assets
└── README.md
```

## Scoring

| Word Length | Points |
|------------|--------|
| 3-5 letters | 5 |
| 6-8 letters | 10 |
| 9-12 letters | 20 |
| 13+ letters | 30 |

Points are multiplied by your current combo multiplier and doubled during the Double Score power-up.

## Future Improvements

- Custom word list editor
- Multiplayer mode
- Leaderboard with backend integration
- Additional themes (light mode, retro, minimal)
- Mobile touch keyboard support
- Achievement system
- Word categories filter (frontend, backend, DevOps)
- Difficulty presets (Easy, Normal, Hard)

## Tech Stack

- **HTML5** — Semantic markup, screen structure
- **CSS3** — Variables, grid, flexbox, animations, backdrop-filter
- **Vanilla JavaScript (ES6)** — Classes, modules, destructuring
- **p5.js** — Canvas rendering, game loop, particle effects

## License

MIT License — free to use, modify, and distribute.
