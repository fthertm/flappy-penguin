export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const domain = "misantropic.net";
    const icons = "https://" + domain + "/assets/icons/";

    if (url.pathname === '/flap' || url.pathname === '/flap/') {
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>Flappy Penguin</title>
  <link rel="icon" type="image/svg+xml" href="${icons}favicon.svg">
  <link rel="apple-touch-icon" href="${icons}apple-touch-icon.png">
  <link rel="shortcut icon" href="${icons}favicon.ico">
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
      gap: 14px;
      text-decoration: none;
      color: var(--text);
    }
    .brand img {
      width: 34px;
      height: 34px;
      object-fit: contain;
      filter: brightness(0) invert(1);
    }
    header h1 { font-size: 19px; font-weight: 500; letter-spacing: -0.4px; line-height: 1; }
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
      max-height: calc(100dvh - 145px);
      width: auto;
      max-width: 100%;
    }
    .hint { font-size: 12px; color: var(--muted); }
    footer {
      text-align: center;
      padding: 8px;
      font-size: 12px;
      color: var(--muted);
      flex-shrink: 0;
    }
    footer a { color: var(--ice); text-decoration: none; }
    footer a:hover { color: #ebcb8b; }
    .nord-heart {
      color: #88c0d0 !important;
      margin: 0 3px;
      display: inline-block;
      transition: color 0.25s ease;
      cursor: pointer;
    }
    .nord-heart:hover {
      color: #bf616a !important;
      animation: nord-heartbeat 1.2s ease-in-out infinite;
    }
    @keyframes nord-heartbeat {
      0%, 28%, 70%, 100% { transform: scale(1); }
      14% { transform: scale(1.28); }
      42% { transform: scale(1.18); }
    }
  </style>
</head>
<body>
  <header>
    <a class="brand" href="https://${domain}">
      <img src="${icons}favicon.svg" alt="Flappy Penguin">
      <h1>Flappy Penguin</h1>
    </a>
    <a class="back-btn" href="https://${domain}">← Dashboard</a>
  </header>

  <main>
    <div class="card">
      <canvas id="game" width="480" height="440"></canvas>
      <div class="hint">Space / Click / Tap to flap</div>
    </div>
  </main>

  <footer>Created with <span class="nord-heart">🤍</span> by <a href="https://fatihertem.com" target="_blank" rel="noopener">fatih</a></footer>

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
    let pipes = [], frame = 0, score = 0, best = parseInt(localStorage.getItem('flappy_penguin_best') || '0', 10), gameOver = false, started = false;

    function reset() {
      y = 190; vel = 0; pipes = []; frame = 0; score = 0; gameOver = false; started = true;
    }

    function flap() {
      if (!started || gameOver) reset();
      else vel = jump;
    }

    window.addEventListener('keydown', e => { if (e.code === 'Space') { e.preventDefault(); flap(); } });
    canvas.addEventListener('mousedown', flap);
    canvas.addEventListener('touchstart', e => { e.preventDefault(); flap(); }, { passive: false });

    function drawPenguin(x, y) {
      ctx.save();
      ctx.translate(x + 15, y + 14);
      ctx.rotate(Math.max(-0.35, Math.min(0.45, vel * 0.055)));

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
      ctx.ellipse(-3, 2, 7, 3.8, vel < 0 ? -0.5 : 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawIceColumn(x, y, w, h, isTop) {
      ctx.save();
      ctx.beginPath();

      if (isTop) {
        const endY = y + h;
        const neckY = Math.max(y, endY - 32);
        const topExpand = 12;
        ctx.moveTo(x - topExpand, y);
        ctx.lineTo(x + w + topExpand, y);
        ctx.lineTo(x + w * 0.86, neckY);
        ctx.lineTo(x + w * 0.72, endY + 12);
        ctx.lineTo(x + w * 0.60, endY + 2);
        ctx.lineTo(x + w * 0.44, endY + 24);
        ctx.lineTo(x + w * 0.26, neckY + 6);
        ctx.lineTo(x + w * 0.14, neckY);
      } else {
        const neckY = Math.min(y + h, y + 32);
        const baseExpand = 14;
        ctx.moveTo(x - baseExpand, y + h);
        ctx.lineTo(x + w * 0.14, neckY);
        ctx.lineTo(x + w * 0.26, y - 6);
        ctx.lineTo(x + w * 0.48, y - 22);
        ctx.lineTo(x + w * 0.70, y - 8);
        ctx.lineTo(x + w * 0.86, neckY);
        ctx.lineTo(x + w + baseExpand, y + h);
      }

      ctx.closePath();
      ctx.clip();

      ctx.fillStyle = '#5e81ac';
      ctx.fillRect(x - 18, y - 26, w + 36, h + 52);

      ctx.fillStyle = '#4c6a8f';
      ctx.beginPath();
      if (isTop) {
        ctx.moveTo(x + w * 0.52, y);
        ctx.lineTo(x + w + 16, y);
        ctx.lineTo(x + w * 0.85, y + h + 26);
        ctx.lineTo(x + w * 0.44, y + h + 26);
      } else {
        ctx.moveTo(x + w * 0.48, y - 26);
        ctx.lineTo(x + w * 0.85, y - 26);
        ctx.lineTo(x + w + 18, y + h);
        ctx.lineTo(x + w * 0.52, y + h);
      }
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#88c0d0';
      ctx.beginPath();
      if (isTop) {
        ctx.moveTo(x - 6, y);
        ctx.lineTo(x + 4, y);
        ctx.lineTo(x + w * 0.34, y + h + 26);
        ctx.lineTo(x + w * 0.22, y + h + 26);
      } else {
        ctx.moveTo(x + w * 0.24, y - 26);
        ctx.lineTo(x + w * 0.36, y - 26);
        ctx.lineTo(x + 4, y + h);
        ctx.lineTo(x - 8, y + h);
      }
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = 'rgba(236, 239, 244, 0.3)';
      ctx.beginPath();
      if (isTop) {
        ctx.moveTo(x + w * 0.28, y);
        ctx.lineTo(x + w * 0.34, y);
        ctx.lineTo(x + w * 0.46, y + h + 26);
        ctx.lineTo(x + w * 0.42, y + h + 26);
      } else {
        ctx.moveTo(x + w * 0.44, y - 26);
        ctx.lineTo(x + w * 0.48, y - 26);
        ctx.lineTo(x + w * 0.34, y + h);
        ctx.lineTo(x + w * 0.28, y + h);
      }
      ctx.closePath();
      ctx.fill();

      ctx.restore();
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
          let gap = 152;
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

        if (pX + pSize - 4 > p.x + 6 && pX + 4 < p.x + 40 && (y + 3 < p.top + 14 || y + pSize - 3 > p.bottom - 14)) {
          gameOver = true;
        }
        if (!p.passed && p.x + 44 < pX) {
          score++;
          p.passed = true;
          if (score > best) {
            best = score;
            localStorage.setItem('flappy_penguin_best', best);
          }
        }
        if (p.x + 64 < 0) pipes.splice(i, 1);
      }

      if (y + pSize > canvas.height || y < 0) {
        gameOver = true;
        if (score > best) {
          best = score;
          localStorage.setItem('flappy_penguin_best', best);
        }
      }
      drawPenguin(pX, y);

      ctx.save();
      ctx.shadowColor = 'rgba(20, 24, 30, 0.85)';
      ctx.shadowBlur = 4;
      ctx.fillStyle = '#eceff4';
      ctx.font = '600 22px system-ui, sans-serif';
      ctx.fillText(score, 18, 36);
      ctx.fillStyle = '#d8dee9';
      ctx.font = '500 13px system-ui, sans-serif';
      ctx.fillText('Best: ' + best, 18, 56);
      ctx.restore();

      if (!started || gameOver) {
        ctx.fillStyle = 'rgba(36, 41, 51, 0.85)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#eceff4';
        ctx.font = '600 22px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(gameOver ? 'Frozen!' : 'Flappy Penguin', canvas.width / 2, 175);
        
        if (gameOver) {
          ctx.fillStyle = '#d8dee9';
          ctx.font = '14px system-ui, sans-serif';
          ctx.fillText('Score: ' + score + '  |  Best: ' + best, canvas.width / 2, 210);
        }

        ctx.fillStyle = '#88c0d0';
        ctx.font = '14px system-ui, sans-serif';
        ctx.fillText('Space / Click / Tap to flap', canvas.width / 2, gameOver ? 245 : 225);
        ctx.textAlign = 'left';
      }

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
