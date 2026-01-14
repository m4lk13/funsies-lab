const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const lastEl = document.getElementById("last");
const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");
const difficultySelect = document.getElementById("difficulty");

const difficultySettings = {
  chill: { gap: 170, speed: 2, spawnInterval: 140, gravity: 0.25, thrust: -5.3 },
  classic: { gap: 150, speed: 2.2, spawnInterval: 120, gravity: 0.28, thrust: -5.2 },
  cosmic: { gap: 130, speed: 2.6, spawnInterval: 105, gravity: 0.32, thrust: -5.1 },
};

const state = {
  frame: 0,
  running: false,
  started: false,
  gameOver: false,
  score: 0,
  best: 0,
  last: 0,
  difficulty: "classic",
};

const moon = {
  x: 140,
  y: 200,
  radius: 18,
  velocity: 0,
  gravity: difficultySettings.classic.gravity,
  thrust: difficultySettings.classic.thrust,
};

const pipes = [];
const pipeConfig = {
  gap: difficultySettings.classic.gap,
  width: 56,
  speed: difficultySettings.classic.speed,
  spawnInterval: difficultySettings.classic.spawnInterval,
};

const stars = Array.from({ length: 60 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  size: Math.random() * 2 + 1,
  twinkle: Math.random() * 0.5 + 0.3,
}));

const clouds = Array.from({ length: 6 }, (_, index) => ({
  x: Math.random() * canvas.width,
  y: 100 + index * 80,
  speed: 0.3 + Math.random() * 0.4,
  size: 1 + Math.random() * 0.6,
}));

const message = {
  title: "Moon Hopper",
  subtitle: "Press Start to launch",
};

function loadBestScore() {
  const stored = window.localStorage.getItem("moon-hopper-best");
  if (stored) {
    state.best = Number.parseInt(stored, 10) || 0;
  }
}

function saveBestScore() {
  window.localStorage.setItem("moon-hopper-best", String(state.best));
}

function applyDifficulty() {
  const settings = difficultySettings[state.difficulty];
  pipeConfig.gap = settings.gap;
  pipeConfig.speed = settings.speed;
  pipeConfig.spawnInterval = settings.spawnInterval;
  moon.gravity = settings.gravity;
  moon.thrust = settings.thrust;
}

function updateScore() {
  scoreEl.textContent = state.score;
  bestEl.textContent = state.best;
  lastEl.textContent = state.last;
}

function resetGame() {
  state.frame = 0;
  state.score = 0;
  state.gameOver = false;
  state.running = false;
  state.started = false;
  moon.y = canvas.height / 2;
  moon.velocity = 0;
  pipes.length = 0;
  message.title = "Moon Hopper";
  message.subtitle = "Press Start to launch";
  startButton.textContent = "Start";
  updateScore();
}

function startGame() {
  if (!state.started) {
    state.started = true;
  }
  if (!state.gameOver) {
    state.running = true;
  }
  message.subtitle = "Tap / Click / Space";
  startButton.textContent = state.running ? "Running" : "Start";
}

function spawnPipe() {
  const min = 120;
  const max = canvas.height - 160;
  const center = Math.random() * (max - min) + min;
  pipes.push({
    x: canvas.width + pipeConfig.width,
    center,
    passed: false,
  });
}

function drawBackground() {
  ctx.fillStyle = "#131a33";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#f7d66a";
  stars.forEach((star) => {
    const alpha = 0.5 + Math.sin(state.frame * 0.05 + star.x) * star.twinkle;
    ctx.globalAlpha = alpha;
    ctx.fillRect(star.x, star.y, star.size, star.size);
  });
  ctx.globalAlpha = 1;

  clouds.forEach((cloud) => {
    ctx.fillStyle = "rgba(97, 120, 186, 0.35)";
    const wobble = Math.sin((state.frame + cloud.x) * 0.01) * 4;
    drawPixelCloud(cloud.x + wobble, cloud.y, 24 * cloud.size, 12 * cloud.size);
  });
}

function drawPixelCloud(x, y, width, height) {
  ctx.fillRect(x, y, width, height);
  ctx.fillRect(x + width * 0.1, y - height * 0.4, width * 0.5, height * 0.6);
  ctx.fillRect(x + width * 0.5, y - height * 0.2, width * 0.4, height * 0.4);
}

function drawMoon() {
  ctx.save();
  ctx.translate(moon.x, moon.y);

  ctx.fillStyle = "#f6f0e0";
  ctx.beginPath();
  ctx.arc(0, 0, moon.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#d7cbb8";
  drawCrater(-6, -6, 4);
  drawCrater(6, 4, 3);
  drawCrater(0, 8, 2.5);

  ctx.strokeStyle = "#fff9ec";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-moon.radius, 0);
  ctx.lineTo(-moon.radius - 14, -4);
  ctx.lineTo(-moon.radius - 14, 4);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function drawCrater(x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawPipes() {
  pipes.forEach((pipe) => {
    const topHeight = pipe.center - pipeConfig.gap / 2;
    const bottomY = pipe.center + pipeConfig.gap / 2;

    ctx.fillStyle = "#6fe3b5";
    ctx.fillRect(pipe.x, 0, pipeConfig.width, topHeight);
    ctx.fillRect(pipe.x, bottomY, pipeConfig.width, canvas.height - bottomY);

    ctx.fillStyle = "#49c38b";
    ctx.fillRect(pipe.x + 6, 0, pipeConfig.width - 12, topHeight);
    ctx.fillRect(pipe.x + 6, bottomY, pipeConfig.width - 12, canvas.height - bottomY);

    ctx.fillStyle = "#2f8e63";
    ctx.fillRect(pipe.x, topHeight - 12, pipeConfig.width, 12);
    ctx.fillRect(pipe.x, bottomY, pipeConfig.width, 12);
  });
}

function drawGround() {
  ctx.fillStyle = "#1c243d";
  ctx.fillRect(0, canvas.height - 70, canvas.width, 70);

  ctx.fillStyle = "#2d375b";
  for (let x = 0; x < canvas.width; x += 40) {
    ctx.fillRect(x, canvas.height - 60, 24, 12);
  }

  ctx.fillStyle = "#3a456b";
  for (let x = 20; x < canvas.width; x += 80) {
    ctx.fillRect(x, canvas.height - 38, 30, 10);
  }
}

function drawMessage() {
  ctx.fillStyle = "rgba(11, 15, 26, 0.6)";
  ctx.fillRect(60, 180, canvas.width - 120, 180);

  ctx.strokeStyle = "#f7d66a";
  ctx.lineWidth = 3;
  ctx.strokeRect(60, 180, canvas.width - 120, 180);

  ctx.fillStyle = "#f7d66a";
  ctx.font = "20px 'Press Start 2P', monospace";
  ctx.textAlign = "center";
  ctx.fillText(message.title, canvas.width / 2, 240);

  ctx.fillStyle = "#d5d7ff";
  ctx.font = "12px 'Press Start 2P', monospace";
  ctx.fillText(message.subtitle, canvas.width / 2, 280);
}

function handleInput() {
  if (!state.started) {
    startGame();
  }

  if (!state.gameOver) {
    moon.velocity = moon.thrust;
  }

  if (state.gameOver) {
    resetGame();
  }
}

function checkCollision() {
  if (moon.y + moon.radius >= canvas.height - 70) {
    return true;
  }

  if (moon.y - moon.radius <= 0) {
    return true;
  }

  return pipes.some((pipe) => {
    const withinX = moon.x + moon.radius > pipe.x && moon.x - moon.radius < pipe.x + pipeConfig.width;
    if (!withinX) {
      return false;
    }

    const topHeight = pipe.center - pipeConfig.gap / 2;
    const bottomY = pipe.center + pipeConfig.gap / 2;
    return moon.y - moon.radius < topHeight || moon.y + moon.radius > bottomY;
  });
}

function update() {
  state.frame += 1;
  stars.forEach((star) => {
    star.y += 0.1;
    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }
  });

  clouds.forEach((cloud) => {
    cloud.x -= cloud.speed;
    if (cloud.x < -120) {
      cloud.x = canvas.width + 120;
      cloud.y = 100 + Math.random() * 300;
    }
  });

  if (!state.running) {
    return;
  }

  moon.velocity += moon.gravity;
  moon.y += moon.velocity;

  if (state.frame % pipeConfig.spawnInterval === 0) {
    spawnPipe();
  }

  pipes.forEach((pipe) => {
    pipe.x -= pipeConfig.speed;
    if (!pipe.passed && pipe.x + pipeConfig.width < moon.x) {
      pipe.passed = true;
      state.score += 1;
      state.best = Math.max(state.best, state.score);
      saveBestScore();
      updateScore();
    }
  });

  while (pipes.length && pipes[0].x + pipeConfig.width < 0) {
    pipes.shift();
  }

  if (checkCollision()) {
    state.gameOver = true;
    state.running = false;
    state.last = state.score;
    message.title = "Cosmic Crash!";
    message.subtitle = "Press Start or Tap to retry";
    startButton.textContent = "Retry";
    updateScore();
  }
}

function render() {
  drawBackground();
  drawPipes();
  drawGround();
  drawMoon();

  if (!state.started || state.gameOver) {
    drawMessage();
  }
}

function loop() {
  update();
  render();
  requestAnimationFrame(loop);
}

startButton.addEventListener("click", () => {
  if (state.gameOver) {
    resetGame();
  }
  startGame();
});

resetButton.addEventListener("click", resetGame);

difficultySelect.addEventListener("change", (event) => {
  state.difficulty = event.target.value;
  applyDifficulty();
  resetGame();
});

window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    handleInput();
  }

  if (event.code === "KeyR") {
    resetGame();
  }
});

window.addEventListener("pointerdown", (event) => {
  if (event.target.closest("button") || event.target.closest("select")) {
    return;
  }
  handleInput();
});

loadBestScore();
applyDifficulty();
updateScore();
resetGame();
loop();
