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
    .canvas-wrap {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
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
    .mute-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 32px;
      height: 32px;
      border-radius: 6px;
      border: 1px solid rgba(136, 192, 208, 0.25);
      background: rgba(46, 52, 64, 0.78);
      color: var(--text);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s;
      z-index: 5;
    }
    .mute-btn:hover {
      background: rgba(59, 66, 82, 0.95);
      border-color: var(--ice);
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
      <div class="canvas-wrap">
        <canvas id="game" width="480" height="440"></canvas>
        <button id="muteBtn" class="mute-btn" type="button" aria-label="Toggle Sound" title="Sound On/Off"></button>
      </div>
      <div class="hint">Space / Click / Tap to flap</div>
    </div>
  </main>

  <footer>Created with <span class="nord-heart" aria-hidden="true"><svg viewBox="0 0 512 512"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg></span> by <a href="https://fatihertem.com" target="_blank" rel="noopener">fatih</a></footer>

  <script>
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    const muteBtn = document.getElementById('muteBtn');

    let muted = localStorage.getItem('flappy_penguin_muted') === '1';
    const iconSoundOn = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>';
    const iconSoundOff = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>';

    function updateMuteUI() {
      muteBtn.innerHTML = muted ? iconSoundOff : iconSoundOn;
    }
    updateMuteUI();

    muteBtn.addEventListener('click', e => {
      e.stopPropagation();
      muted = !muted;
      localStorage.setItem('flappy_penguin_muted', muted ? '1' : '0');
      updateMuteUI();
    });

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;

    function playSound(type) {
      if (muted || !AudioCtx) return;
      try {
        if (!audioCtx) audioCtx = new AudioCtx();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const now = audioCtx.currentTime;

        if (type === 'flap') {
          const bufferSize = Math.floor(audioCtx.sampleRate * 0.085);
          const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
          }
          const noise = audioCtx.createBufferSource();
          noise.buffer = buffer;

          const filter = audioCtx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(520, now);
          filter.frequency.exponentialRampToValueAtTime(980, now + 0.08);
          filter.Q.value = 1.4;

          const gain = audioCtx.createGain();
          gain.gain.setValueAtTime(0.14, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);

          noise.connect(filter);
          filter.connect(gain);
          gain.connect(audioCtx.destination);
          noise.start(now);
        } else if (type === 'score') {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(659.25, now);
          osc.frequency.setValueAtTime(987.77, now + 0.075);

          gain.gain.setValueAtTime(0.09, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.24);
        } else if (type === 'hit') {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(165, now);
          osc.frequency.exponentialRampToValueAtTime(42, now + 0.18);

          gain.gain.setValueAtTime(0.22, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.19);

          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.19);
        }
      } catch (e) {}
    }

    const groundH = 38;
    const playH = canvas.height - groundH;
    let groundOffset = 0;
    let bgOffset = 0;

    const flakes = Array.from({ length: 34 }, () => ({
      x: Math.random() * 480,
      y: Math.random() * playH,
      r: Math.random() * 2 + 1,
      s: Math.random() * 0.6 + 0.3
    }));

    let particles = [];
    function spawnSnowBurst(px, py, count) {
      for (let i = 0; i < count; i++) {
        particles.push({
          x: px,
          y: py,
          vx: (Math.random() - 0.5) * 4.5,
          vy: (Math.random() - 0.8) * 4.2,
          r: Math.random() * 2.5 + 1.2,
          life: 1
        });
      }
    }

    let y = 180, vel = 0, gravity = 0.36, jump = -6.5;
    let pipes = [], frame = 0, score = 0;
    let best = parseInt(localStorage.getItem('flappy_penguin_best') || '0', 10);
    let gameOver = false, dying = false, started = false;

    function reset() {
      y = 180;
      vel = 0;
      pipes = [];
      particles = [];
      frame = 0;
      score = 0;
      gameOver = false;
      dying = false;
      started = true;
      vel = jump;
      playSound('flap');
    }

    function flap() {
      if (!started || gameOver) {
        reset();
      } else if (!dying) {
        vel = jump;
        playSound('flap');
        spawnSnowBurst(98, y + 18, 4);
      }
    }

    window.addEventListener('keydown', e => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        flap();
      }
    });
    canvas.addEventListener('mousedown', flap);
    canvas.addEventListener('touchstart', e => { e.preventDefault(); flap(); }, { passive: false });

    function triggerCrash(px, py) {
      if (!dying && !gameOver) {
        dying = true;
        vel = -2.5;
        playSound('hit');
        spawnSnowBurst(px, py, 16);
      }
    }

    function drawBackground() {
      const aurora = ctx.createLinearGradient(0, 0, canvas.width, 160);
      aurora.addColorStop(0, 'rgba(136, 192, 208, 0.08)');
      aurora.addColorStop(0.5, 'rgba(163, 190, 140, 0.06)');
      aurora.addColorStop(1, 'rgba(180, 142, 173, 0.07)');
      ctx.fillStyle = aurora;
      ctx.fillRect(0, 0, canvas.width, 180);

      ctx.fillStyle = 'rgba(59, 66, 82, 0.65)';
      const peaks = [
        [0, 140], [70, 75], [140, 125], [220, 60], [310, 130], [390, 70], [480, 140]
      ];
      for (let shift = 0; shift <= 480; shift += 480) {
        ctx.beginPath();
        ctx.moveTo(shift - bgOffset, playH);
        for (const [px, py] of peaks) {
          ctx.lineTo(shift + px - bgOffset, playH - py);
        }
        ctx.lineTo(shift + 480 - bgOffset, playH);
        ctx.closePath();
        ctx.fill();
      }
    }

    function drawPenguin(x, y) {
      ctx.save();
      ctx.translate(x + 15, y + 14);
      let angle = Math.max(-0.35, Math.min(0.45, vel * 0.055));
      if (dying || gameOver) {
        angle = Math.min(Math.PI / 2, Math.max(0.3, vel * 0.14));
      }
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
      const capOver = 4;

      ctx.fillStyle = '#5e81ac';
      ctx.fillRect(x, y, w, h);

      ctx.fillStyle = '#88c0d0';
      ctx.fillRect(x + 4, y, 6, h);

      ctx.fillStyle = '#4c6a8f';
      ctx.fillRect(x + w - 8, y, 8, h);

      const capX = x - capOver;
      const capW = w + capOver * 2;
      const capY = isTop ? y + h - capH : y;

      ctx.fillStyle = '#5e81ac';
      ctx.beginPath();
      ctx.roundRect(capX, capY, capW, capH, 4);
      ctx.fill();

      ctx.fillStyle = '#88c0d0';
      ctx.beginPath();
      ctx.roundRect(capX + 3, capY + 2, 7, capH - 4, 2);
      ctx.fill();

      ctx.fillStyle = '#4c6a8f';
      ctx.beginPath();
      ctx.roundRect(capX + capW - 9, capY + 2, 6, capH - 4, 2);
      ctx.fill();

      if (!isTop) {
        ctx.fillStyle = '#eceff4';
        ctx.beginPath();
        ctx.roundRect(capX, capY, capW, 5, [4, 4, 1, 1]);
        ctx.fill();
      } else {
        ctx.fillStyle = 'rgba(236, 239, 244, 0.32)';
        ctx.fillRect(capX + 3, capY + capH - 3, capW - 6, 2);
      }
    }

    function drawGround() {
      const gy = playH;
      ctx.fillStyle = '#3b4252';
      ctx.fillRect(0, gy, canvas.width, groundH);

      ctx.fillStyle = '#4c566a';
      for (let gx = -24 + groundOffset; gx < canvas.width + 24; gx += 24) {
        ctx.beginPath();
        ctx.moveTo(gx, gy + 7);
        ctx.lineTo(gx + 12, gy + 7);
        ctx.lineTo(gx + 4, gy + groundH);
        ctx.lineTo(gx - 8, gy + groundH);
        ctx.closePath();
        ctx.fill();
      }

      ctx.fillStyle = '#88c0d0';
      ctx.fillRect(0, gy + 5, canvas.width, 3);

      ctx.fillStyle = '#eceff4';
      ctx.fillRect(0, gy, canvas.width, 5);
    }

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (started && !gameOver && !dying) {
        groundOffset = (groundOffset - 2.4) % 24;
        bgOffset = (bgOffset + 0.45) % 480;
      }

      drawBackground();

      ctx.fillStyle = 'rgba(236, 239, 244, 0.3)';
      for (const f of flakes) {
        f.y += f.s;
        f.x -= 0.4;
        if (f.y > playH) { f.y = 0; f.x = Math.random() * canvas.width; }
        if (f.x < 0) f.x = canvas.width;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (started && !gameOver) {
        vel += gravity;
        y += vel;
        if (!dying) {
          frame++;
          if (frame % 92 === 0) {
            let gap = 128;
            let topH = Math.floor(Math.random() * (playH - gap - 90)) + 45;
            pipes.push({ x: canvas.width, top: topH, bottom: topH + gap, passed: false });
          }
        }
      }

      const pX = 95, pSize = 26, pipeW = 50;
      for (let i = pipes.length - 1; i >= 0; i--) {
        let p = pipes[i];
        if (started && !gameOver && !dying) p.x -= 2.4;

        drawIceBlockPipe(p.x, 0, pipeW, p.top, true);
        drawIceBlockPipe(p.x, p.bottom, pipeW, playH - p.bottom, false);

        if (!dying && !gameOver) {
          if (pX + pSize - 2 > p.x - 3 && pX + 2 < p.x + pipeW + 3 && (y + 2 < p.top || y + pSize - 2 > p.bottom)) {
            triggerCrash(pX + 14, y + 14);
          }
          if (!p.passed && p.x + pipeW < pX) {
            score++;
            p.passed = true;
            playSound('score');
            if (score > best) {
              best = score;
              localStorage.setItem('flappy_penguin_best', best);
            }
          }
        }
        if (p.x + pipeW + 10 < 0) pipes.splice(i, 1);
      }

      drawGround();

      if (y + pSize >= playH) {
        y = playH - pSize;
        if (!gameOver) {
          if (!dying) {
            playSound('hit');
            spawnSnowBurst(pX + 14, playH - 4, 14);
          }
          dying = false;
          gameOver = true;
          if (score > best) {
            best = score;
            localStorage.setItem('flappy_penguin_best', best);
          }
        }
      }
      if (y < 0 && !dying && !gameOver) {
        y = 0;
        vel = 0;
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += 0.15;
        pt.life -= 0.035;
        if (pt.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.fillStyle = 'rgba(236, 239, 244, ' + pt.life + ')';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();
      }

      drawPenguin(pX, y);

      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 4;
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
