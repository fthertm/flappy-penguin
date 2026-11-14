export default {
  async fetch(request) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Flappy Penguin - misantropic</title>
  <style>
    :root {
      --bg: #2f3542;
      --surface: #3b4252;
      --header: #6c8eb4;
      --subnav: #587494;
      --text: #eceff4;
      --muted: #aeb8c4;
      --ice: #88c0d0;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      user-select: none;
    }
    header {
      background: var(--header);
      padding: 18px 10%;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    header svg {
      width: 44px;
      height: 44px;
      fill: var(--text);
      flex-shrink: 0;
    }
    header .sub { font-size: 12px; opacity: 0.9; }
    header h1 { font-size: 24px; font-weight: 500; letter-spacing: -0.5px; }
    nav {
      background: var(--subnav);
      padding: 10px 10%;
      font-size: 14px;
      display: flex;
      gap: 20px;
    }
    nav a {
      color: var(--text);
      text-decoration: none;
      opacity: 0.85;
      transition: opacity 0.15s;
    }
    nav a:hover { opacity: 1; }
    main {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: var(--surface);
      padding: 16px;
      border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
    canvas {
      background: #242933;
      border-radius: 6px;
      display: block;
      cursor: pointer;
    }
    .hint {
      font-size: 13px;
      color: var(--muted);
    }
    footer {
      text-align: center;
      padding: 16px;
      font-size: 13px;
      color: var(--muted);
    }
    footer a { color: var(--ice); text-decoration: none; }
  </style>
</head>
<body>
  <header>
    <svg viewBox="0 0 576 512">
      <path d="M288 32C156.9 32 48.2 128.4 33.7 256H162.8C176.2 200.9 226.2 160 288 160s111.8 40.9 125.2 96H542.3C527.8 128.4 419.1 32 288 32zM32 288v160c0 17.7 14.3 32 32 32h96V320c0-11 .9-21.7 2.8-32H32zm381.2 0c1.8 10.3 2.8 21 2.8 32v160h96c17.7 0 32-14.3 32-32V288H413.2zM288 192c-53 0-96 43-96 96v192h192V288c0-53-43-96-96-96z"/>
    </svg>
    <div>
      <div class="sub">fewer letters, fewer people.</div>
      <h1>misantropic</h1>
    </div>
  </header>
  <nav>
    <a href="https://misantropic.net">← Back to Dashboard</a>
  </nav>

  <main>
    <div class="card">
      <canvas id="game" width="340" height="460"></canvas>
      <div class="hint">Space / Click / Tap to flap</div>
    </div>
  </main>

  <footer>Created with 🤍 by <a href="https://misantropic.net">fatih</a></footer>

  <script>
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');

    const flakes = Array.from({ length: 28 }, () => ({
      x: Math.random() * 340,
      y: Math.random() * 460,
      r: Math.random() * 2 + 1,
      s: Math.random() * 0.6 + 0.3
    }));

    let y = 200, vel = 0, gravity = 0.36, jump = -6.5;
    let pipes = [], frame = 0, score = 0, best = 0, gameOver = false, started = false;

    function reset() {
      y = 200; vel = 0; pipes = []; frame = 0; score = 0; gameOver = false; started = true;
    }

    function flap() {
      if (!started || gameOver) reset();
      else vel = jump;
    }

    window.addEventListener('keydown', e => {
      if (e.code === 'Space') { e.preventDefault(); flap(); }
    });
    canvas.addEventListener('mousedown', flap);
    canvas.addEventListener('touchstart', e => { e.preventDefault(); flap(); });

    function drawPenguin(x, y) {
      ctx.save();
      ctx.translate(x + 15, y + 14);
      const angle = Math.max(-0.35, Math.min(0.45, vel * 0.055));
      ctx.rotate(angle);

      ctx.fillStyle = '#d08770';
      ctx.beginPath();
      ctx.ellipse(-5, 13, 5, 2.5, 0, 0, Math.PI * 2);
      ctx.ellipse(4, 13, 5, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#1b1f27';
      ctx.beginPath();
      ctx.ellipse(0, 0, 14, 13, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#eceff4';
      ctx.beginPath();
      ctx.ellipse(3, 2, 9, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#1b1f27';
      ctx.beginPath();
      ctx.arc(6, -4, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(6.7, -4.7, 0.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ebcb8b';
      ctx.beginPath();
      ctx.moveTo(12, -2);
      ctx.lineTo(20, 1);
      ctx.lineTo(12, 4);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#3b4252';
      ctx.beginPath();
      const wingAngle = vel < 0 ? -0.5 : 0.35;
      ctx.ellipse(-3, 2, 7, 3.8, wingAngle, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
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

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(236, 239, 244, 0.25)';
      for (const f of flakes) {
        f.y += f.s;
        f.x -= 0.4;
        if (f.y > canvas.height) { f.y = 0; f.x = Math.random() * canvas.width; }
        if (f.x < 0) f.x = canvas.width;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (started && !gameOver) {
        vel += gravity;
        y += vel;
        frame++;

        if (frame % 95 === 0) {
          let gap = 128;
          let topH = Math.floor(Math.random() * (canvas.height - gap - 100)) + 45;
          pipes.push({ x: canvas.width, top: topH, bottom: topH + gap, passed: false });
        }
      }

      const pX = 68, pSize = 26;

      for (let i = pipes.length - 1; i >= 0; i--) {
        let p = pipes[i];
        if (started && !gameOver) p.x -= 2.2;

        drawIceColumn(p.x, -4, 44, p.top + 4, true);
        drawIceColumn(p.x, p.bottom, 44, canvas.height - p.bottom + 4, false);

        if (pX + pSize - 2 > p.x && pX + 2 < p.x + 44 &&
           (y + 2 < p.top + 8 || y + pSize - 2 > p.bottom - 8)) {
          gameOver = true;
        }

        if (!p.passed && p.x + 44 < pX) {
          score++;
          p.passed = true;
          if (score > best) best = score;
        }

        if (p.x + 44 < 0) pipes.splice(i, 1);
      }

      if (y + pSize > canvas.height || y < 0) gameOver = true;

      drawPenguin(pX, y);

      ctx.fillStyle = '#eceff4';
      ctx.font = '600 22px system-ui, sans-serif';
      ctx.fillText(score, 18, 36);
      ctx.fillStyle = '#aeb8c4';
      ctx.font = '13px system-ui, sans-serif';
      ctx.fillText('Best: ' + best, 18, 56);

      if (!started || gameOver) {
        ctx.fillStyle = 'rgba(36, 41, 51, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#eceff4';
        ctx.font = '600 22px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(gameOver ? 'Frozen!' : 'Flappy Penguin', canvas.width / 2, 210);
        ctx.fillStyle = '#88c0d0';
        ctx.font = '14px system-ui, sans-serif';
        ctx.fillText('Click or press Space to fly', canvas.width / 2, 238);
        ctx.textAlign = 'left';
      }

      requestAnimationFrame(loop);
    }
    loop();
  </script>
</body>
</html>`;

    return new Response(html, {
      headers: { 'content-type': 'text/html;charset=UTF-8' },
    });
  },
};
