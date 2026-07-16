# Contributing to Typing Defender

Thanks for your interest in contributing to Typing Defender! Whether you're fixing a bug, adding a feature, or suggesting an idea — all contributions are welcome.

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally

```bash
git clone https://github.com/<your-username>/typing-defender.git
cd typing-defender
```

3. **Open** `index.html` in your browser — no build tools or server required

## How to Contribute

### Suggest an Idea

Have a feature idea but don't want to build it yourself? No problem!

- Open a [GitHub Issue](https://github.com/umarfarookm/typing-defender/issues) with the label `enhancement`
- Describe the feature and why it would make the game better
- Include screenshots or mockups if possible

### Report a Bug

- Open a [GitHub Issue](https://github.com/umarfarookm/typing-defender/issues) with the label `bug`
- Include steps to reproduce, expected behavior, and actual behavior
- Mention your browser and OS

### Submit a Pull Request

1. Create a new branch from `main`:

```bash
git checkout -b feature/your-feature-name
```

2. Make your changes
3. Test your changes by opening `index.html` in the browser and playing through the game
4. Commit your changes with a clear message:

```bash
git commit -m "Add: brief description of your change"
```

5. Push to your fork:

```bash
git push origin feature/your-feature-name
```

6. Open a **Pull Request** against the `main` branch of this repository
7. In your PR description, explain what you changed and why

## Feature Ideas to Get You Started

Looking for something to work on? Here are some ideas:

- **Tech Quiz Mode** — Show technical questions with falling answer options
- **1v1 Online Multiplayer** — Real-time head-to-head typing battles
- **Word Categories** — Filter words by domain (Frontend, Backend, DevOps, Cloud, AI/ML)
- **Achievement System** — Unlock badges for milestones
- **Custom Word Lists** — Let players add their own word sets
- **Difficulty Presets** — Easy, Normal, Hard modes
- **Leaderboard** — Backend-powered global leaderboard
- **Mobile Support** — Touch keyboard support for mobile devices
- **Additional Themes** — Light mode, retro, minimal, etc.

Or check the [Issues](https://github.com/umarfarookm/typing-defender/issues) page for open tasks.

## Project Structure

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

## Code Guidelines

- **No frameworks or build tools** — This project uses vanilla JavaScript, HTML, and CSS
- **Keep it simple** — Write clean, readable code
- **Follow existing patterns** — Match the coding style already used in the project (ES6 classes, camelCase naming)
- **Test in multiple browsers** — Ensure your changes work in Chrome, Firefox, Safari, and Edge
- **Keep commits focused** — One feature or fix per pull request

## First Time Contributing to Open Source?

No worries! Here are some resources to help you get started:

- [How to Fork a Repository](https://docs.github.com/en/get-started/quickstart/fork-a-repo)
- [How to Create a Pull Request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)
- [First Contributions](https://github.com/firstcontributions/first-contributions)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
