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
    footer a {
      color: var(--ice);
      text-decoration: none;
      font-weight: 600;
    }
    footer a:hover { color: #ebcb8b; }
    .nord-heart {
      color: #88c0d0 !important;
      margin: 0 3px;
      display: inline-flex;
      align-items: center;
      vertical-align: middle;
      transition: color 0.25s ease;
      cursor: pointer;
    }
    .nord-heart svg {
      width: 13px;
      height: 13px;
      fill: currentColor;
      display: block;
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
    @media (prefers-reduced-motion: reduce) {
      .nord-heart:hover { animation: none; }
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

  <footer>Created with <span class="nord-heart" aria-label="love"><svg viewBox="0 0 512 512"><path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"/></svg></span> by <a href="https://fatihertem.com" target="_blank" rel="noopener">fatih</a></footer>

  <script>
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    const flakes = Array.from({ length: 34 }, () => ({
      x: Math.random() * 480,
      y: Math.random() * 440,
      r: Math.random() * 2 + 1,
      s: Math.random() * 0.6 + 0.3
    }));

    const bgRidges = [
      { x: 30, w: 90, h: 110, top: true },
      { x: 180, w: 120, h: 150, top: true },
      { x: 360, w: 100, h: 120, top: true },
      { x: 500, w: 110, h: 135, top: true },
      { x: 10, w: 110, h: 125, top: false },
      { x: 160, w: 130, h: 155, top: false },
      { x: 330, w: 95, h: 115, top: false },
      { x: 480, w: 120, h: 140, top: false }
    ];

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

    function drawBackgroundIce() {
      ctx.fillStyle = 'rgba(76, 106, 143, 0.14)';
      for (const r of bgRidges) {
        if (started && !gameOver) {
          r.x -= 0.45;
          if (r.x + r.w < 0) r.x = canvas.width + 20;
        }
        ctx.beginPath();
        if (r.top) {
          ctx.moveTo(r.x, 0);
          ctx.lineTo(r.x + r.w, 0);
          ctx.lineTo(r.x + r.w * 0.72, r.h * 0.65);
          ctx.lineTo(r.x + r.w * 0.48, r.h);
          ctx.lineTo(r.x + r.w * 0.25, r.h * 0.55);
        } else {
          ctx.moveTo(r.x, canvas.height);
          ctx.lineTo(r.x + r.w * 0.22, canvas.height - r.h * 0.6);
          ctx.lineTo(r.x + r.w * 0.52, canvas.height - r.h);
          ctx.lineTo(r.x + r.w * 0.78, canvas.height - r.h * 0.55);
          ctx.lineTo(r.x + r.w, canvas.height);
        }
        ctx.closePath();
        ctx.fill();
      }
    }

    function drawIceColumn(x, y, w, h, isTop) {
      ctx.save();
      ctx.beginPath();

      if (isTop) {
        const tipY = y + h + 16;
        ctx.moveTo(x - 5, y);
        ctx.lineTo(x + w + 5, y);
        ctx.lineTo(x + w * 0.84, y + h * 0.48);
        ctx.lineTo(x + w * 0.76, y + h * 0.72);
        ctx.lineTo(x + w * 0.66, y + h * 0.58);
        ctx.lineTo(x + w * 0.48, tipY);
        ctx.lineTo(x + w * 0.28, y + h * 0.62);
        ctx.lineTo(x + w * 0.16, y + h * 0.76);
        ctx.lineTo(x + w * 0.10, y + h * 0.45);
      } else {
        const base = y + h;
        const tipY = y - 16;
        ctx.moveTo(x - 7, base);
        ctx.lineTo(x + w * 0.08, y + h * 0.52);
        ctx.lineTo(x + w * 0.20, y + h * 0.28);
        ctx.lineTo(x + w * 0.30, y + h * 0.38);
        ctx.lineTo(x + w * 0.48, tipY);
        ctx.lineTo(x + w * 0.68, y + h * 0.32);
        ctx.lineTo(x + w * 0.78, y + h * 0.22);
        ctx.lineTo(x + w * 0.90, y + h * 0.55);
        ctx.lineTo(x + w + 7, base);
      }

      ctx.closePath();
      ctx.clip();

      ctx.fillStyle = '#5e81ac';
      ctx.fillRect(x - 10, y - 24, w + 20, h + 48);

      ctx.fillStyle = '#4c6a8f';
      ctx.beginPath();
      if (isTop) {
        ctx.moveTo(x + w * 0.48, y);
        ctx.lineTo(x + w + 8, y);
        ctx.lineTo(x + w + 8, y + h + 24);
        ctx.lineTo(x + w * 0.48, y + h + 24);
      } else {
        ctx.moveTo(x + w * 0.48, y - 24);
        ctx.lineTo(x + w + 10, y - 24);
        ctx.lineTo(x + w + 10, y + h + 8);
        ctx.lineTo(x + w * 0.48, y + h + 8);
      }
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#88c0d0';
      ctx.beginPath();
      if (isTop) {
        ctx.moveTo(x + 2, y);
        ctx.lineTo(x + 14, y);
        ctx.lineTo(x + w * 0.46, y + h + 20);
        ctx.lineTo(x + w * 0.36, y + h + 20);
      } else {
        ctx.moveTo(x + w * 0.36, y - 20);
        ctx.lineTo(x + w * 0.46, y - 20);
        ctx.lineTo(x + 14, y + h);
        ctx.lineTo(x + 1, y + h);
      }
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = 'rgba(236, 239, 244, 0.35)';
      ctx.beginPath();
      if (isTop) {
        ctx.moveTo(x + 17, y);
        ctx.lineTo(x + 21, y);
        ctx.lineTo(x + w * 0.48, y + h + 18);
        ctx.lineTo(x + w * 0.45, y + h + 18);
      } else {
        ctx.moveTo(x + w * 0.45, y - 18);
        ctx.lineTo(x + w * 0.48, y - 18);
        ctx.lineTo(x + 21, y + h);
        ctx.lineTo(x + 17, y + h);
      }
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }

    function checkConeCollision(pX, pY, pSize, pipe) {
      const colW = 46;
      const centerX = pipe.x + colW * 0.48;
      const pLeft = pX + 3;
      const pRight = pX + pSize - 3;
      const pTop = pY + 3;
      const pBottom = pY + pSize - 3;

      const topTip = pipe.top + 14;
      if (pTop < topTip) {
        const ratio = Math.max(0, Math.min(1, pTop / Math.max(1, topTip)));
        const halfWidth = (colW * 0.56) * (1 - ratio * 0.78);
        if (pRight > centerX - halfWidth && pLeft < centerX + halfWidth) {
          return true;
        }
      }

      const bottomTip = pipe.bottom - 14;
      if (pBottom > bottomTip) {
        const totalH = Math.max(1, canvas.height - bottomTip);
        const ratio = Math.max(0, Math.min(1, (canvas.height - pBottom) / totalH));
        const halfWidth = (colW * 0.58) * (1 - ratio * 0.78);
        if (pRight > centerX - halfWidth && pLeft < centerX + halfWidth) {
          return true;
        }
      }

      return false;
    }

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawBackgroundIce();

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

        if (checkConeCollision(pX, y, pSize, p)) {
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
        if (p.x + 56 < 0) pipes.splice(i, 1);
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
      ctx.shadowColor = 'rgba(27, 31, 39, 0.85)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.fillStyle = '#eceff4';
      ctx.font = '600 22px system-ui, sans-serif';
      ctx.fillText(score, 18, 36);
      ctx.fillStyle = '#d8dee9';
      ctx.font = '600 13px system-ui, sans-serif';
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
