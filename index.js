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
      background: #1f242d;
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
    footer a { color: var(--ice); text-decoration: none; font-weight: 600; }
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

  <footer>Created with <span class="nord-heart" aria-hidden="true"><svg width="13" height="13" viewBox="0 0 512 512" fill="currentColor"><path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"/></svg></span> by <a href="https://fatihertem.com" target="_blank" rel="noopener">fatih</a></footer>

  <script>
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');

    // Web Audio API - Doğal arcade ses efektleri
    let audioCtx = null;
    let muted = localStorage.getItem('flappy_penguin_muted') === 'true';

    function initAudio() {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) audioCtx = new AudioContext();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    }

    function playFlapSound() {
      if (muted) return;
      initAudio();
      if (!audioCtx) return;
      const now = audioCtx.currentTime;
      const bufferSize = Math.floor(audioCtx.sampleRate * 0.08);
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(380, now);
      filter.frequency.exponentialRampToValueAtTime(750, now + 0.08);
      filter.Q.value = 1.8;

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start(now);
    }

    function playScoreSound() {
      if (muted) return;
      initAudio();
      if (!audioCtx) return;
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.setValueAtTime(1318.51, now + 0.065);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    }

    function playHitSound() {
      if (muted) return;
      initAudio();
      if (!audioCtx) return;
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(42, now + 0.18);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    }

    const groundH = 36;
    const playH = canvas.height - groundH;
    let groundOffset = 0;

    const flakes = Array.from({ length: 34 }, () => ({
      x: Math.random() * 480,
      y: Math.random() * playH,
      r: Math.random() * 1.8 + 0.8,
      s: Math.random() * 0.6 + 0.3
    }));

    const bgMountains = [
      { x: 0, w: 150, h: 95 },
      { x: 110, w: 170, h: 125 },
      { x: 245, w: 145, h: 88 },
      { x: 355, w: 185, h: 118 }
    ];

    let particles = [];
    function spawnSnowBurst(px, py, count) {
      for (let i = 0; i < count; i++) {
        particles.push({
          x: px,
          y: py,
          vx: (Math.random() - 0.5) * 3.8,
          vy: (Math.random() - 0.8) * 3.5,
          r: Math.random() * 2.5 + 1.2,
          life: 1.0
        });
      }
    }

    let y = 175, vel = 0, gravity = 0.36, jump = -6.5;
    let pipes = [], frame = 0, score = 0, best = parseInt(localStorage.getItem('flappy_penguin_best') || '0', 10);
    let dying = false, gameOver = false, started = false;
    let auroraTime = 0;

    function reset() {
      y = 175;
      vel = 0;
      pipes = [];
      particles = [];
      frame = 0;
      score = 0;
      dying = false;
      gameOver = false;
      started = true;
      flap();
    }

    function flap() {
      if (!started || gameOver) {
        reset();
        return;
      }
      if (dying) return;
      vel = jump;
      playFlapSound();
      spawnSnowBurst(98, y + 20, 4);
    }

    function toggleMute(e) {
      if (e) e.stopPropagation();
      muted = !muted;
      localStorage.setItem('flappy_penguin_muted', muted);
    }

    window.addEventListener('keydown', e => {
      if (e.code === 'Space') { e.preventDefault(); flap(); }
      if (e.code === 'KeyM') { toggleMute(); }
    });

    function handlePointer(clientX, clientY, e) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const cx = (clientX - rect.left) * scaleX;
      const cy = (clientY - rect.top) * scaleY;

      if (cx >= canvas.width - 42 && cx <= canvas.width - 10 && cy >= 10 && cy <= 42) {
        toggleMute(e);
        return;
      }
      flap();
    }

    canvas.addEventListener('mousedown', e => handlePointer(e.clientX, e.clientY, e));
    canvas.addEventListener('touchstart', e => {
      e.preventDefault();
      const t = e.touches[0];
      handlePointer(t.clientX, t.clientY, e);
    }, { passive: false });

    function drawAurora() {
      auroraTime += 0.012;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      // Kıvrımlı iki aurora perdesi (keskin alt sınır + yukarı süzülen dikey ışık huzmeleri)
      const curtains = [
        { baseY: 118, amp: 16, freq: 0.013, phase: auroraTime, height: 95, c1: 'rgba(136, 192, 208, 0.22)', c2: 'rgba(163, 190, 140, 0.16)' },
        { baseY: 92,  amp: 12, freq: 0.017, phase: -auroraTime * 0.8 + 1.5, height: 78, c1: 'rgba(163, 190, 140, 0.18)', c2: 'rgba(180, 142, 173, 0.12)' }
      ];

      for (const c of curtains) {
        // Dikey ışık huzmeleri (rays)
        for (let x = 0; x <= canvas.width; x += 6) {
          const wave = Math.sin(x * c.freq + c.phase) * c.amp + Math.cos(x * c.freq * 0.5 - c.phase * 0.7) * 6;
          const bottomY = c.baseY + wave;
          const rayPulse = 0.55 + 0.45 * Math.sin(x * 0.045 + auroraTime * 2.2);
          const rayH = c.height * (0.65 + 0.35 * Math.cos(x * 0.03 - auroraTime * 1.5));

          const grad = ctx.createLinearGradient(0, bottomY, 0, bottomY - rayH);
          grad.addColorStop(0, 'rgba(163, 190, 140, 0)');
          grad.addColorStop(0.12, c.c1);
          grad.addColorStop(0.45, c.c2);
          grad.addColorStop(1, 'rgba(136, 192, 208, 0)');

          ctx.fillStyle = grad;
          ctx.globalAlpha = rayPulse;
          ctx.fillRect(x, bottomY - rayH, 4, rayH);
        }

        // Keskin alt ışık kenarı (ribbon edge)
        ctx.globalAlpha = 0.35;
        ctx.strokeStyle = '#a3be8c';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 6) {
          const wave = Math.sin(x * c.freq + c.phase) * c.amp + Math.cos(x * c.freq * 0.5 - c.phase * 0.7) * 6;
          const bottomY = c.baseY + wave - 6;
          if (x === 0) ctx.moveTo(x, bottomY);
          else ctx.lineTo(x, bottomY);
        }
        ctx.stroke();
      }

      ctx.restore();
    }

    function drawBackground() {
      // Kutup ışıkları
      drawAurora();

      // Uzak buzul dağ siluetleri
      ctx.fillStyle = '#262c37';
      for (const m of bgMountains) {
        ctx.beginPath();
        ctx.moveTo(m.x, playH);
        ctx.lineTo(m.x + m.w * 0.5, playH - m.h);
        ctx.lineTo(m.x + m.w, playH);
        ctx.closePath();
        ctx.fill();
      }
    }

    function drawGround() {
      ctx.fillStyle = '#3b4252';
      ctx.fillRect(0, playH, canvas.width, groundH);

      ctx.fillStyle = '#eceff4';
      ctx.fillRect(0, playH, canvas.width, 5);

      ctx.fillStyle = '#88c0d0';
      ctx.fillRect(0, playH + 5, canvas.width, 3);

      ctx.fillStyle = '#2e3440';
      for (let gx = -24 + groundOffset; gx < canvas.width + 24; gx += 24) {
        ctx.beginPath();
        ctx.moveTo(gx, playH + 12);
        ctx.lineTo(gx + 10, playH + 12);
        ctx.lineTo(gx + 4, playH + groundH);
        ctx.lineTo(gx - 6, playH + groundH);
        ctx.closePath();
        ctx.fill();
      }
    }

    function drawPenguin(x, y) {
      ctx.save();
      ctx.translate(x + 15, y + 14);
      const angle = dying ? Math.min(Math.PI / 2, vel * 0.12) : Math.max(-0.35, Math.min(0.45, vel * 0.055));
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
      ctx.ellipse(-3, 2, 7, 3.8, vel < 0 ? -0.5 : 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawIceBlockPipe(x, y, w, h, isTop) {
      if (h <= 0) return;
      const capH = 18;
      const capOverhang = 4;

      ctx.fillStyle = '#5e81ac';
      ctx.fillRect(x, y, w, h);

      ctx.fillStyle = '#88c0d0';
      ctx.fillRect(x + 4, y, 6, h);

      ctx.fillStyle = '#4c6a8f';
      ctx.fillRect(x + w - 9, y, 9, h);

      ctx.fillStyle = '#435d7e';
      ctx.fillRect(x, y, 2, h);
      ctx.fillRect(x + w - 2, y, 2, h);

      const capY = isTop ? (y + h - capH) : y;
      const capX = x - capOverhang;
      const capW = w + capOverhang * 2;

      ctx.fillStyle = '#688db9';
      ctx.fillRect(capX, capY, capW, capH);

      ctx.fillStyle = '#88c0d0';
      ctx.fillRect(capX + 4, capY, 7, capH);

      ctx.fillStyle = '#4c6a8f';
      ctx.fillRect(capX + capW - 10, capY, 10, capH);

      if (isTop) {
        ctx.fillStyle = '#88c0d0';
        ctx.fillRect(capX, capY + capH - 4, capW, 4);
      } else {
        ctx.fillStyle = '#eceff4';
        ctx.fillRect(capX, capY, capW, 5);
        ctx.fillStyle = '#d8dee9';
        ctx.fillRect(capX, capY + 5, capW, 2);
      }

      ctx.strokeStyle = '#3b4e6b';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(capX + 0.75, capY + 0.75, capW - 1.5, capH - 1.5);
    }

    function drawMuteButton() {
      const bx = canvas.width - 38;
      const by = 12;
      ctx.save();
      ctx.fillStyle = 'rgba(59, 66, 82, 0.75)';
      ctx.beginPath();
      ctx.roundRect(bx, by, 26, 26, 6);
      ctx.fill();

      ctx.strokeStyle = '#d8dee9';
      ctx.fillStyle = '#d8dee9';
      ctx.lineWidth = 1.6;

      ctx.beginPath();
      ctx.moveTo(bx + 6, by + 10);
      ctx.lineTo(bx + 10, by + 10);
      ctx.lineTo(bx + 14, by + 6);
      ctx.lineTo(bx + 14, by + 20);
      ctx.lineTo(bx + 10, by + 16);
      ctx.lineTo(bx + 6, by + 16);
      ctx.closePath();
      ctx.fill();

      if (muted) {
        ctx.strokeStyle = '#bf616a';
        ctx.beginPath();
        ctx.moveTo(bx + 17, by + 10);
        ctx.lineTo(bx + 22, by + 16);
        ctx.moveTo(bx + 22, by + 10);
        ctx.lineTo(bx + 17, by + 16);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(bx + 15, by + 13, 3.5, -0.7, 0.7);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(bx + 15, by + 13, 6.5, -0.7, 0.7);
        ctx.stroke();
      }
      ctx.restore();
    }

    function triggerCrash() {
      if (dying || gameOver) return;
      dying = true;
      vel = -2.5;
      playHitSound();
      spawnSnowBurst(108, y + 14, 16);
      if (score > best) {
        best = score;
        localStorage.setItem('flappy_penguin_best', best);
      }
    }

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawBackground();

      ctx.fillStyle = 'rgba(236, 239, 244, 0.28)';
      for (const f of flakes) {
        f.y += f.s;
        f.x -= 0.45;
        if (f.y > playH) { f.y = 0; f.x = Math.random() * canvas.width; }
        if (f.x < 0) f.x = canvas.width;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }

      const speed = 2.4;
      if (started && !gameOver && !dying) {
        groundOffset = (groundOffset - speed) % 24;
        vel += gravity;
        y += vel;
        frame++;
        if (frame % 92 === 0) {
          let gap = 128;
          let minTop = 48;
          let maxTop = playH - gap - 48;
          let topH = Math.floor(Math.random() * (maxTop - minTop)) + minTop;
          pipes.push({ x: canvas.width + 6, top: topH, bottom: topH + gap, passed: false });
        }
      } else if (dying) {
        vel += gravity * 1.15;
        y += vel;
      }

      const pX = 95, pSize = 26, pipeW = 48;
      for (let i = pipes.length - 1; i >= 0; i--) {
        let p = pipes[i];
        if (started && !gameOver && !dying) p.x -= speed;

        drawIceBlockPipe(p.x, 0, pipeW, p.top, true);
        drawIceBlockPipe(p.x, p.bottom, pipeW, playH - p.bottom, false);

        if (!dying && !gameOver) {
          if (pX + pSize - 3 > p.x - 2 && pX + 3 < p.x + pipeW + 2 && (y + 3 < p.top || y + pSize - 3 > p.bottom)) {
            triggerCrash();
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
        }
        if (p.x + pipeW + 10 < 0) pipes.splice(i, 1);
      }

      drawGround();

      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += 0.14;
        pt.life -= 0.035;
        if (pt.life <= 0) {
          particles.splice(i, 1);
        } else {
          ctx.fillStyle = 'rgba(236, 239, 244, ' + pt.life + ')';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (y + pSize >= playH) {
        y = playH - pSize;
        if (!gameOver) {
          if (!dying) playHitSound();
          dying = false;
          gameOver = true;
          if (score > best) {
            best = score;
            localStorage.setItem('flappy_penguin_best', best);
          }
        }
      }
      if (y < 0) {
        y = 0;
        vel = 0;
      }

      drawPenguin(pX, y);

      ctx.save();
      ctx.shadowColor = 'rgba(20, 24, 31, 0.9)';
      ctx.shadowBlur = 5;
      ctx.fillStyle = '#eceff4';
      ctx.font = '600 22px system-ui, sans-serif';
      ctx.fillText(score, 18, 36);
      ctx.fillStyle = '#d8dee9';
      ctx.font = '600 13px system-ui, sans-serif';
      ctx.fillText('Best: ' + best, 18, 56);
      ctx.restore();

      drawMuteButton();

      if (!started || gameOver) {
        ctx.fillStyle = 'rgba(31, 36, 45, 0.82)';
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
        ctx.fillText('Space / Click / Tap to flap', canvas.width / 2, gameOver ? 235 : 210);
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
