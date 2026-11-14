export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const domain = "misantropic.net";
    const iconSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath fill='%23eceff4' d='M256 32C132.3 32 32 132.3 32 256v192c0 17.7 14.3 32 32 32h112v-64c0-35.3 28.7-64 64-64s64 28.7 64 64v64h112c17.7 0 32-14.3 32-32V256C480 132.3 379.7 32 256 32zm0 64c97.2 0 176 78.8 176 176H80C80 174.8 158.8 96 256 96z'/%3E%3C/svg%3E";

    if (url.pathname === '/flap' || url.pathname === '/flap/') {
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="robots" content="noindex, nofollow">
  <title>Flappy Penguin - misantropic</title>
  <link rel="icon" type="image/svg+xml" href="${iconSvg}">
  <style>
    :root {
      --bg: #20242d;
      --surface: #2b303c;
      --header-bg: #5e81ac;
      --accent: #88c0d0;
      --text: #eceff4;
      --muted: #99a7be;
      --border: #4c566a;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      height: 100dvh;
      overflow: hidden;
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      display: flex;
      flex-direction: column;
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
    }
    header {
      background: var(--header-bg);
      padding: 12px 5%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      z-index: 10;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .brand img {
      width: 36px;
      height: 36px;
      object-fit: contain;
    }
    .brand-text .sub {
      font-size: 11px;
      opacity: 0.9;
      text-transform: lowercase;
      letter-spacing: 0.2px;
      line-height: 1.2;
    }
    .brand-text h1 {
      font-size: 20px;
      font-weight: 500;
      letter-spacing: -0.4px;
      line-height: 1.1;
    }
    .back-btn {
      color: var(--text);
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      background: rgba(0, 0, 0, 0.15);
      padding: 7px 14px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      transition: all 0.2s ease;
    }
    .back-btn:hover {
      background: rgba(0, 0, 0, 0.28);
    }
    main {
      flex: 1;
      min-height: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .game-wrapper {
      background: var(--surface);
      padding: 16px;
      border-radius: 16px;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.45);
      border: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      max-width: 100%;
      max-height: 100%;
    }
    canvas {
      background: #181c24;
      border-radius: 10px;
      display: block;
      cursor: pointer;
      box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
      max-height: calc(100dvh - 160px);
      width: auto;
      max-width: 100%;
      aspect-ratio: 400 / 580;
    }
    .game-footer {
      display: flex;
      width: 100%;
      justify-content: space-between;
      padding: 0 4px;
      font-size: 13px;
      color: var(--muted);
      font-weight: 500;
    }
    .game-footer span {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .key {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 11px;
      font-family: monospace;
      color: var(--text);
    }
    footer {
      text-align: center;
      padding: 10px;
      font-size: 12px;
      color: var(--muted);
      flex-shrink: 0;
    }
    footer a { color: var(--accent); text-decoration: none; font-weight: 500; }
    footer a:hover { color: #ebcb8b; text-decoration: underline; }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <img src="${iconSvg}" alt="misantropic">
      <div class="brand-text">
        <div class="sub">fewer letters, fewer people.</div>
        <h1>misantropic</h1>
      </div>
    </div>
    <a class="back-btn" href="https://${domain}">← Dashboard</a>
  </header>

  <main>
    <div class="game-wrapper">
      <canvas id="game" width="400" height="580"></canvas>
      <div class="game-footer">
        <span><kbd class="key">Space</kbd> / Tap to flap</span>
        <span>Flappy Penguin</span>
      </div>
    </div>
  </main>

  <footer>Created with 🤍 by <a href="https://fatihertem.com" target="_blank" rel="noopener">fatih</a></footer>

  <script>
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const flakes = Array.from({ length: 40 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2.2 + 0.8,
      s: Math.random() * 0.7 + 0.3,
      drift: Math.random() * 0.5 - 0.25
    }));
    let bird = { x: 90, y: H / 2 - 20, w: 32, h: 24, vel: 0, gravity: 0.38, jump: -6.8, rotation: 0 };
    let pipes = [];
    let pipeWidth = 46;
    let pipeGap = 150;
    let pipeSpeed = 2.4;
    let spawnTimer = 0;
    let spawnInterval = 95;
    let score = 0;
    let best = parseInt(localStorage.getItem('flappy_penguin_best') || '0', 10);
    let state = 'START';
    let flashTimer = 0;
    function resetGame() {
      bird.y = H / 2 - 20;
      bird.vel = 0;
      bird.rotation = 0;
      pipes = [];
      score = 0;
      spawnTimer = 0;
      flashTimer = 0;
      state = 'PLAYING';
    }
    function triggerAction() {
      if (state === 'START' || state === 'GAMEOVER') {
        if (state === 'GAMEOVER' && flashTimer > 0) return;
        resetGame();
      } else if (state === 'PLAYING') {
        bird.vel = bird.jump;
      }
    }
    window.addEventListener('keydown', e => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        triggerAction();
      }
    });
    canvas.addEventListener('mousedown', e => {
      e.preventDefault();
      triggerAction();
    });
    canvas.addEventListener('touchstart', e => {
      e.preventDefault();
      triggerAction();
    }, { passive: false });
    function drawBackground() {
      let grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#192231');
      grad.addColorStop(1, '#2b384e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(236, 239, 244, 0.25)';
      for (const f of flakes) {
        f.y += f.s;
        f.x += f.drift;
        if (f.y > H) { f.y = 0; f.x = Math.random() * W; }
        if (f.x < 0) f.x = W;
        if (f.x > W) f.x = 0;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    function drawIceColumn(x, y, w, h, isTop) {
      ctx.fillStyle = '#5e81ac';
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 4);
      ctx.fill();
      ctx.fillStyle = '#88c0d0';
      ctx.fillRect(x + 4, y, 6, h);
      ctx.fillStyle = '#81a1c1';
      ctx.beginPath();
      if (isTop) {
        ctx.moveTo(x, y + h);
        ctx.lineTo(x + w / 2, y + h + 14);
        ctx.lineTo(x + w, y + h);
      } else {
        ctx.moveTo(x, y);
        ctx.lineTo(x + w / 2, y - 14);
        ctx.lineTo(x + w, y);
      }
      ctx.closePath();
      ctx.fill();
    }
    function drawPipes() {
      for (const p of pipes) {
        drawIceColumn(p.x, -4, pipeWidth, p.top + 4, true);
        drawIceColumn(p.x, p.bottom, pipeWidth, H - p.bottom + 4, false);
      }
    }
    function drawBird() {
      ctx.save();
      ctx.translate(bird.x + bird.w / 2, bird.y + bird.h / 2);
      let targetRot = Math.min(Math.PI / 2, Math.max(-0.45, bird.vel * 0.08));
      bird.rotation += (targetRot - bird.rotation) * 0.2;
      ctx.rotate(bird.rotation);
      ctx.fillStyle = '#d08770';
      ctx.beginPath();
      ctx.ellipse(-6, 12, 5.5, 2.8, 0, 0, Math.PI * 2);
      ctx.ellipse(4, 12, 5.5, 2.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#242933';
      ctx.beginPath();
      ctx.ellipse(0, 0, 16, 14.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#eceff4';
      ctx.beginPath();
      ctx.ellipse(3, 2, 10.5, 11.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#242933';
      ctx.beginPath();
      ctx.arc(7, -5, 2.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(7.8, -5.8, 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ebcb8b';
      ctx.beginPath();
      ctx.moveTo(14, -3);
      ctx.lineTo(23, 0.5);
      ctx.lineTo(14, 4);
      ctx.closePath();
      ctx.fill();
      let wingOffset = bird.vel < 0 ? -4 : 2;
      let wingRot = bird.vel < 0 ? -0.6 : 0.3;
      ctx.save();
      ctx.translate(-3, wingOffset);
      ctx.rotate(wingRot);
      ctx.fillStyle = '#3b4252';
      ctx.beginPath();
      ctx.ellipse(0, 0, 7.5, 4.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.restore();
    }
    function drawScore() {
      if (state === 'PLAYING' || state === 'GAMEOVER') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.font = '700 36px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(score, W / 2 + 2, 62);
        ctx.fillStyle = '#eceff4';
        ctx.fillText(score, W / 2, 60);
      }
    }
    function drawStartScreen() {
      ctx.fillStyle = 'rgba(24, 28, 36, 0.65)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#eceff4';
      ctx.font = '700 32px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Flappy Penguin', W / 2, H / 2 - 60);
      ctx.fillStyle = '#88c0d0';
      ctx.font = '600 15px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('Tap or Press Space to Start', W / 2, H / 2 - 15);
    }
    function drawGameOverScreen() {
      ctx.fillStyle = 'rgba(24, 28, 36, 0.75)';
      ctx.fillRect(0, 0, W, H);
      let cardW = 260;
      let cardH = 180;
      let cardX = (W - cardW) / 2;
      let cardY = (H - cardH) / 2 - 20;
      ctx.fillStyle = '#2b303c';
      ctx.strokeStyle = '#4c566a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 14);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#bf616a';
      ctx.font = '700 24px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over', W / 2, cardY + 36);
      ctx.fillStyle = '#99a7be';
      ctx.font = '500 13px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('SCORE', cardX + 70, cardY + 74);
      ctx.fillText('BEST', cardX + 190, cardY + 74);
      ctx.fillStyle = '#eceff4';
      ctx.font = '700 28px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(score, cardX + 70, cardY + 110);
      ctx.fillText(best, cardX + 190, cardY + 110);
      ctx.fillStyle = '#88c0d0';
      ctx.font = '600 14px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('Tap or Space to Retry', W / 2, cardY + 152);
    }
    function update() {
      if (flashTimer > 0) flashTimer--;
      if (state === 'PLAYING') {
        bird.vel += bird.gravity;
        bird.y += bird.vel;
        spawnTimer++;
        if (spawnTimer >= spawnInterval) {
          spawnTimer = 0;
          let minTop = 60;
          let maxTop = H - pipeGap - 120;
          let topH = Math.floor(Math.random() * (maxTop - minTop + 1)) + minTop;
          pipes.push({ x: W, top: topH, bottom: topH + pipeGap, passed: false });
        }
        for (let i = pipes.length - 1; i >= 0; i--) {
          let p = pipes[i];
          p.x -= pipeSpeed;
          let hitBoxMargin = 4;
          let bLeft = bird.x + hitBoxMargin;
          let bRight = bird.x + bird.w - hitBoxMargin;
          let bTop = bird.y + hitBoxMargin;
          let bBottom = bird.y + bird.h - hitBoxMargin;
          let pLeft = p.x;
          let pRight = p.x + pipeWidth;
          if (bRight > pLeft && bLeft < pRight) {
            if (bTop < p.top || bBottom > p.bottom) {
              state = 'GAMEOVER';
              flashTimer = 10;
              if (score > best) {
                best = score;
                localStorage.setItem('flappy_penguin_best', best);
              }
            }
          }
          if (!p.passed && p.x + pipeWidth < bird.x) {
            score++;
            p.passed = true;
            if (score > best) {
              best = score;
              localStorage.setItem('flappy_penguin_best', best);
            }
          }
          if (p.x + pipeWidth < 0) {
            pipes.splice(i, 1);
          }
        }
        if (bird.y + bird.h >= H - 20 || bird.y <= 0) {
          bird.y = Math.max(0, Math.min(bird.y, H - 20 - bird.h));
          state = 'GAMEOVER';
          flashTimer = 10;
          if (score > best) {
            best = score;
            localStorage.setItem('flappy_penguin_best', best);
          }
        }
      }
    }
    function render() {
      ctx.clearRect(0, 0, W, H);
      drawBackground();
      drawPipes();
      drawBird();
      ctx.fillStyle = '#3b4252';
      ctx.fillRect(0, H - 20, W, 20);
      ctx.fillStyle = '#88c0d0';
      ctx.fillRect(0, H - 20, W, 4);
      drawScore();
      if (state === 'START') {
        drawStartScreen();
      } else if (state === 'GAMEOVER') {
        drawGameOverScreen();
      }
      if (flashTimer > 0) {
        ctx.fillStyle = \`rgba(255, 255, 255, \${flashTimer / 10 * 0.4})\`;
        ctx.fillRect(0, 0, W, H);
      }
    }
    function loop() {
      update();
      render();
      requestAnimationFrame(loop);
    }
    loop();
  </script>
</body>
</html>`;

      return new Response(html, {
        headers: {
          'content-type': 'text/html;charset=UTF-8',
          'X-Robots-Tag': 'noindex, nofollow',
        },
      });
    }

    return env.ASSETS.fetch(request);
  },
};
