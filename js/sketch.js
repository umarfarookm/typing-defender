// ============================================
// sketch.js — p5.js entry point
// ============================================

let game;
let canvasElement;

function setup() {
  const cw = windowWidth;
  const ch = windowHeight;
  canvasElement = createCanvas(cw, ch);
  canvasElement.parent('canvas-container');
  canvasElement.style('display', 'none');

  textFont('Courier New');
  game = new Game(cw, ch);
}

function draw() {
  if (!game) return;

  if (game.state === GAME_STATES.PLAYING) {
    game.update();
    game.render();
  }
}

function keyPressed() {
  if (!game) return;

  // Escape to pause/resume
  if (keyCode === ESCAPE) {
    if (game.state === GAME_STATES.PLAYING) {
      game.pauseGame();
    } else if (game.state === GAME_STATES.PAUSED) {
      game.resumeGame();
    }
    return false; // prevent default
  }

  // During gameplay, handle typing
  if (game.state === GAME_STATES.PLAYING && key.length === 1) {
    game.handleKey(key);
    return false; // prevent scrolling etc.
  }
}

function windowResized() {
  const cw = windowWidth;
  const ch = windowHeight;
  resizeCanvas(cw, ch);

  if (game) {
    game.canvasWidth = cw;
    game.canvasHeight = ch;

    // Regenerate background stars
    game.bgStars = [];
    for (let i = 0; i < 80; i++) {
      game.bgStars.push({
        x: random(cw),
        y: random(ch),
        size: random(1, 3),
        speed: random(0.2, 0.8),
        brightness: random(80, 200)
      });
    }
  }
}
