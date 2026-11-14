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
      --bg: #2e3440;
      --surface: #3b4252;
      --header: #5e81ac;
      --subnav: #4c6a8f;
      --text: #eceff4;
      --muted: #d8dee9;
      --ice: #88c0d0;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      height: 100dvh;
      overflow: hidden;
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      user-select: none;
    }
    header {
      background: var(--header);
      padding: 10px 8%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    header svg {
      width: 34px;
      height: 34px;
      fill: var(--text);
      flex-shrink: 0;
    }
    header .sub { font-size: 11px; opacity: 0.9; line-height: 1.1; }
    header h1 { font-size: 19px; font-weight: 500; letter-spacing: -0.4px; line-height: 1.2; }
    .back-btn {
      color: var(--text);
      text-decoration: none;
      font-size: 13px;
      background: var(--subnav);
      padding: 6px 12px;
      border-radius: 6px;
      opacity: 0.9;
      transition: opacity 0.15s;
    }
    .back-btn:hover { opacity: 1; }
    main {
      flex: 1;
      min-height: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px;
    }
    .card {
      background: var(--surface);
      padding: 12px;
      border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      max-height: 100%;
    }
    canvas {
      background: #242933;
      border-radius: 6px;
      display: block;
      cursor: pointer;
      max-height: calc(100dvh - 135px);
      width: auto;
      max-width: 100%;
    }
    .hint {
      font-size: 12px;
      color: var(--muted);
    }
    footer {
      text-align: center;
      padding: 8px;
      font-size: 12px;
      color: var(--muted);
      flex-shrink: 0;
    }
    footer a { color: var(--ice); text-decoration: none; }
    footer a:hover { color: #ebcb8b; }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <svg viewBox="0 0 576 512">
        <path d="M288 32C155.1 32 45.7 133.4 33.2 263.1C32.4 271.4 39 278.4 47.4 278.4H162.8C176.2 223.3 226.2 182.4 288 182.4s111.8 40.9 125.2 96H528.6c8.4 0 15-7 14.2-15.3C530.3 133.4 420.9 32 288 32zM208 69.2V128h-64.4c19.1-25.2 41.1-45.3 64.4-58.8zM240 54.4c15.5-5.6 31.6-9.1 48-10.1V128H240V54.4zM320 44.3c16.4 1 32.5 4.5 48 10.1V128H320V44.3zm80 24.9c23.3 13.5 45.3 33.6 64.4 58.8H400V69.2zM86.2 160H176v55.4c-11.2 11.4-20.5 24.5-27.6 39H65.1C69.6 220.4 76.9 188.6 86.2 160zm313.8 0h89.8c9.3 28.6 16.6 60.4 21.1 94.4H427.6c-7.1-14.5-16.4-27.6-27.6-39V160zM32 310.4v41.6h128V320c0-3.2 .2-6.4 .5-9.6H32zm383.5 0c.3 3.2 .5 6.4 .5 9.6v32H544V310.4H415.5zM32 384v64c0 17.7 14.3 32 32 32h96V384H32zm384 0v96h96c17.7 0 32-14.3 32-32V384H416zM288 214.4c-53 0-96 43-96 96V480H384V310.4c0-53-43-96-96-96z"/>
      </svg>
      <div>
        <div class="sub">fewer letters, fewer people.</div>
        <h1>misantropic</h1>
      </div>
    </div>
    <a class="back-btn" href="https://misantropic.net">← Dashboard</a>
  </header>

  <main>
    <div class="card">
      <canvas id="game" width="480" height="440"></canvas>
      <div class="hint">Space / Click / Tap to flap</div>
    </div>
  </main>

  <footer>Created with 🤍 by <a href="https://fatihertem.com" target="_blank" rel="noopener">fatih</a></footer>

  <script>
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');

    const flakes = Array.from({ length: 34 }, () => ({
      x: Math.random() * 480,
      y: Math.random() * 440,
      r: Math.random() * 2 + 1,
      s: Math.random() * 0.6 + 0.3
    }));

    let y = 190, vel = 0, gravity = 0.36, jump = -6.5;
    let pipes = [], frame = 0, score = 0, best = 0, gameOver = false, started = false;

    function reset() {
      y = 190; vel = 0; pipes = []; frame = 0; score = 0; gameOver = false; started = true;
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
          let gap = 126;
          let topH = Math.floor(Math.random() * (canvas.height - gap - 90)) + 45;
          pipes.push({ x: canvas.width, top: topH, bottom: topH + gap, passed: false });
        }
      }

      const pX = 95, pSize = 26;

      for (let i = pipes.length - 1; i >= 0; i--) {
        let p = pipes[i];
        if (started && !gameOver) p.x -= 2.3;

        drawIceColumn(p.x, -4, 46, p.top + 4, true);
        drawIceColumn(p.x, p.bottom, 46, canvas.height - p.bottom + 4, false);

        if (pX + pSize - 2 > p.x && pX + 2 < p.x + 46 &&
           (y + 2 < p.top + 8 || y + pSize - 2 > p.bottom - 8)) {
          gameOver = true;
        }

        if (!p.passed && p.x + 44 < pX) {
          score++;
          p.passed = true;
          if (score > best) best = score;
        }

        if (p.x + 46 < 0) pipes.splice(i, 1);
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
        ctx.fillText(gameOver ? 'Frozen!' : 'Flappy Penguin', canvas.width / 2, 200);
        ctx.fillStyle = '#88c0d0';
        ctx.font = '14px system-ui, sans-serif';
        ctx.fillText('Click or press Space to fly', canvas.width / 2, 228);
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
