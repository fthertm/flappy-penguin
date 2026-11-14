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
      vertical-align: -2px;
      transform-origin: center;
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

    // Web Audio API (harici ses dosyası gerektirmeyen retro efektler)
    let audioCtx = null;
    function playTone(freq, type, duration, vol = 0.08, slideTo = null) {
      try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, audioCtx.currentTime + duration);
        gain.gain.setValueAtTime(vol, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch (e) {}
    }

    function playFlapSound() { playTone(320, 'sine', 0.11, 0.08, 520); }
    function playScoreSound() {
      playTone(587.33, 'triangle', 0.09, 0.09);
      setTimeout(() => playTone(880, 'triangle', 0.14, 0.09), 75);
    }
    function playCrashSound() { playTone(160, 'sawtooth', 0.25, 0.11, 45); }

    // Kar taneleri ve çarpışma parçacıkları
    const flakes = Array.from({ length: 34 }, () => ({
      x: Math.random() * 480,
      y: Math.random() * 440,
      r: Math.random() * 2 + 1,
      s: Math.random() * 0.6 + 0.3
    }));
    let particles = [];

    // Paralaks arka plan buzul siluetleri
    const bgPeaks = [
      { x: 0, w: 150, topH: 95, botH: 85 },
      { x: 140, w: 170, topH: 60, botH: 115 },
      { x: 300, w: 160, topH: 110, botH: 70 },
      { x: 450, w: 180, topH: 75, botH: 100 }
    ];

    const GROUND_H = 38;
    const PLAY_H = canvas.height - GROUND_H;
    let groundOffset = 0;

    let y = 175, vel = 0, gravity = 0.36, jump = -6.5;
    let pipes = [], frame = 0, score = 0;
    let best = parseInt(localStorage.getItem('flappy_penguin_best') || '0', 10);
    let gameOver = false, started = false;

    function spawnParticles(px, py, color, count = 12) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3.2 + 0.8;
        particles.push({
          x: px,
          y: py,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          r: Math.random() * 2.5 + 1.2,
          color
        });
      }
    }

    function reset() {
      y = 175;
      vel = 0;
      pipes = [];
      particles = [];
      frame = 0;
      score = 0;
      gameOver = false;
      started = true;
      vel = jump;
      playFlapSound();
      spawnParticles(105, y + 18, '#eceff4', 5);
    }

    function triggerGameOver(px, py) {
      if (!gameOver) {
        gameOver = true;
        playCrashSound();
        spawnParticles(px, py, '#88c0d0', 18);
        if (score > best) {
          best = score;
          localStorage.setItem('flappy_penguin_best', best);
        }
      }
    }

    function flap() {
      if (!started || gameOver) {
        reset();
      } else {
        vel = jump;
        playFlapSound();
        spawnParticles(98, y + 18, 'rgba(236, 239, 244, 0.7)', 4);
      }
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

    // TwoBitCode Flappy-Penguin tarzı klasik buz bloğu/sütun + Nord kristal başlıkları
    function drawIceBlockPipe(x, y, w, h, isTop) {
      if (h <= 0) return;
      const capH = 22;
      const capOver = 4;

      ctx.save();

      if (isTop) {
        const bodyH = Math.max(0, h - capH);
        // Ana buz gövdesi
        ctx.fillStyle = '#5e81ac';
        ctx.fillRect(x, y, w, bodyH);

        // Gövde sol parlama & sağ gölge
        ctx.fillStyle = '#88c0d0';
        ctx.fillRect(x + 4, y, 6, bodyH);
        ctx.fillStyle = 'rgba(236, 239, 244, 0.35)';
        ctx.fillRect(x + 12, y, 2, bodyH);
        ctx.fillStyle = '#4c6a8f';
        ctx.fillRect(x + w - 9, y, 9, bodyH);

        // Buz bloğu başlığı (Cap)
        const capY = y + bodyH;
        ctx.fillStyle = '#5e81ac';
        ctx.beginPath();
        ctx.roundRect(x - capOver, capY, w + capOver * 2, capH, 3);
        ctx.fill();

        // Başlık üst kar/buz kenarı
        ctx.fillStyle = '#eceff4';
        ctx.fillRect(x - capOver + 2, capY, w + capOver * 2 - 4, 3);

        // Başlık parlama & gölge
        ctx.fillStyle = '#88c0d0';
        ctx.fillRect(x - capOver + 4, capY + 3, 7, capH - 4);
        ctx.fillStyle = '#4c6a8f';
        ctx.fillRect(x + w + capOver - 10, capY + 3, 9, capH - 4);

        // Başlık çerçeve çizgisi
        ctx.strokeStyle = '#3b4252';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(x - capOver, capY, w + capOver * 2, capH, 3);
        ctx.stroke();

        // Küçük sarkan buz dişleri
        ctx.fillStyle = '#88c0d0';
        ctx.beginPath();
        ctx.moveTo(x + 6, capY + capH);
        ctx.lineTo(x + 11, capY + capH + 6);
        ctx.lineTo(x + 16, capY + capH);
        ctx.moveTo(x + w - 18, capY + capH);
        ctx.lineTo(x + w - 13, capY + capH + 5);
        ctx.lineTo(x + w - 8, capY + capH);
        ctx.fill();
      } else {
        const bodyY = y + capH;
        const bodyH = Math.max(0, h - capH);

        // Ana buz gövdesi
        ctx.fillStyle = '#5e81ac';
        ctx.fillRect(x, bodyY, w, bodyH);

        // Gövde sol parlama & sağ gölge
        ctx.fillStyle = '#88c0d0';
        ctx.fillRect(x + 4, bodyY, 6, bodyH);
        ctx.fillStyle = 'rgba(236, 239, 244, 0.35)';
        ctx.fillRect(x + 12, bodyY, 2, bodyH);
        ctx.fillStyle = '#4c6a8f';
        ctx.fillRect(x + w - 9, bodyY, 9, bodyH);

        // Buz bloğu başlığı (Cap)
        ctx.fillStyle = '#5e81ac';
        ctx.beginPath();
        ctx.roundRect(x - capOver, y, w + capOver * 2, capH, 3);
        ctx.fill();

        // Başlık üst kar tabakası
        ctx.fillStyle = '#eceff4';
        ctx.beginPath();
        ctx.roundRect(x - capOver + 1, y, w + capOver * 2 - 2, 5, [3, 3, 1, 1]);
        ctx.fill();

        // Başlık parlama & gölge
        ctx.fillStyle = '#88c0d0';
        ctx.fillRect(x - capOver + 4, y + 5, 7, capH - 6);
        ctx.fillStyle = '#4c6a8f';
        ctx.fillRect(x + w + capOver - 10, y + 5, 9, capH - 6);

        // Başlık çerçeve çizgisi
        ctx.strokeStyle = '#3b4252';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(x - capOver, y, w + capOver * 2, capH, 3);
        ctx.stroke();
      }

      ctx.restore();
    }

    function drawGround() {
      const gy = PLAY_H;
      // Buzul taban
      ctx.fillStyle = '#3b4252';
      ctx.fillRect(0, gy, canvas.width, GROUND_H);

      // Üst kar örtüsü
      ctx.fillStyle = '#eceff4';
      ctx.fillRect(0, gy, canvas.width, 7);

      // Buz şeridi
      ctx.fillStyle = '#88c0d0';
      ctx.fillRect(0, gy + 7, canvas.width, 5);

      // Kayar diyagonal buz blok çizgileri
      ctx.fillStyle = '#4c6a8f';
      const step = 28;
      for (let gx = -step + (groundOffset % step); gx < canvas.width + step; gx += step) {
        ctx.beginPath();
        ctx.moveTo(gx, gy + 12);
        ctx.lineTo(gx + 14, gy + 12);
        ctx.lineTo(gx + 6, canvas.height);
        ctx.lineTo(gx - 8, canvas.height);
        ctx.closePath();
        ctx.fill();
      }

      // Üst sınır çizgisi
      ctx.fillStyle = '#2e3440';
      ctx.fillRect(0, gy - 1, canvas.width, 1.5);
    }

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Arka plan kırıklı buzul siluetleri
      ctx.fillStyle = 'rgba(59, 66, 82, 0.35)';
      for (const bp of bgPeaks) {
        if (started && !gameOver) bp.x -= 0.45;
        if (bp.x + bp.w < 0) bp.x = canvas.width + 20;

        ctx.beginPath();
        ctx.moveTo(bp.x, 0);
        ctx.lineTo(bp.x + bp.w * 0.35, bp.topH * 0.65);
        ctx.lineTo(bp.x + bp.w * 0.52, bp.topH);
        ctx.lineTo(bp.x + bp.w * 0.72, bp.topH * 0.55);
        ctx.lineTo(bp.x + bp.w, 0);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(bp.x, PLAY_H);
        ctx.lineTo(bp.x + bp.w * 0.28, PLAY_H - bp.botH * 0.6);
        ctx.lineTo(bp.x + bp.w * 0.48, PLAY_H - bp.botH);
        ctx.lineTo(bp.x + bp.w * 0.75, PLAY_H - bp.botH * 0.5);
        ctx.lineTo(bp.x + bp.w, PLAY_H);
        ctx.closePath();
        ctx.fill();
      }

      // Kar taneleri
      ctx.fillStyle = 'rgba(236, 239, 244, 0.25)';
      for (const f of flakes) {
        f.y += f.s;
        f.x -= 0.4;
        if (f.y > PLAY_H) { f.y = 0; f.x = Math.random() * canvas.width; }
        if (f.x < 0) f.x = canvas.width;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }

      const speed = Math.min(3.4, 2.3 + score * 0.04);

      if (started && !gameOver) {
        vel += gravity;
        y += vel;
        groundOffset -= speed;
        frame++;
        if (frame % 95 === 0) {
          let gap = 132;
          let topH = Math.floor(Math.random() * (PLAY_H - gap - 90)) + 45;
          pipes.push({ x: canvas.width, top: topH, bottom: topH + gap, passed: false });
        }
      } else if (!started) {
        groundOffset -= 1.2;
      }

      const pX = 95, pSize = 26, pipeW = 48;
      for (let i = pipes.length - 1; i >= 0; i--) {
        let p = pipes[i];
        if (started && !gameOver) p.x -= speed;

        drawIceBlockPipe(p.x, 0, pipeW, p.top, true);
        drawIceBlockPipe(p.x, p.bottom, pipeW, PLAY_H - p.bottom, false);

        // Tam blok çarpışma kontrolü
        if (
          pX + pSize - 3 > p.x - 2 &&
          pX + 3 < p.x + pipeW + 2 &&
          (y + 3 < p.top || y + pSize - 3 > p.bottom)
        ) {
          triggerGameOver(pX + pSize / 2, y + pSize / 2);
        }

        if (!p.passed && p.x + pipeW < pX) {
          score++;
          p.passed = true;
          playScoreSound();
          if (score > best) {
            best = score;
            localStorage.setItem('flappy_penguin_best', best);
          }
        }
        if (p.x + pipeW + 10 < 0) pipes.splice(i, 1);
      }

      // Zemin ve tavan çarpışması
      if (y + pSize >= PLAY_H) {
        y = PLAY_H - pSize;
        triggerGameOver(pX + pSize / 2, PLAY_H);
      } else if (y < 0) {
        y = 0;
        vel = 0;
      }

      drawGround();
      drawPenguin(pX, y);

      // Parçacık efektleri
      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life -= 0.035;
        if (pt.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = pt.life;
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Skor ve Rekor (yüksek kontrastlı gölgeli)
      ctx.save();
      ctx.shadowColor = 'rgba(27, 31, 39, 0.9)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.fillStyle = '#eceff4';
      ctx.font = '600 22px system-ui, sans-serif';
      ctx.fillText(score, 18, 36);
      ctx.fillStyle = '#d8dee9';
      ctx.font = '13px system-ui, sans-serif';
      ctx.fillText('Best: ' + best, 18, 56);
      ctx.restore();

      if (!started || gameOver) {
        ctx.fillStyle = 'rgba(36, 41, 51, 0.85)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#eceff4';
        ctx.font = '600 22px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(gameOver ? 'Frozen!' : 'Flappy Penguin', canvas.width / 2, 165);
        
        if (gameOver) {
          ctx.fillStyle = '#d8dee9';
          ctx.font = '14px system-ui, sans-serif';
          ctx.fillText('Score: ' + score + '  |  Best: ' + best, canvas.width / 2, 200);
        }

        ctx.fillStyle = '#88c0d0';
        ctx.font = '14px system-ui, sans-serif';
        ctx.fillText('Space / Click / Tap to flap', canvas.width / 2, gameOver ? 235 : 215);
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
