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
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }
    footer a {
      color: var(--ice);
      text-decoration: none;
      font-weight: 600;
    }
    footer a:hover { color: #ebcb8b; }
    .nord-heart {
      color: #88c0d0 !important;
      margin: 0 2px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
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

  <footer>Created with <span class="nord-heart" aria-hidden="true"><svg viewBox="0 0 512 512"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg></span> by <a href="https://fatihertem.com" target="_blank" rel="noopener">fatih</a></footer>

  <script>
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    const groundH = 38;
    const playH = canvas.height - groundH;

    let muted = localStorage.getItem('flappy_penguin_muted') === '1';
    let audioCtx = null;

    function getAudioCtx() {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) audioCtx = new AudioContextClass();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      return audioCtx;
    }

    function playSound(type) {
      if (muted) return;
      try {
        const ac = getAudioCtx();
        if (!ac) return;
        const now = ac.currentTime;

        if (type === 'flap') {
          const bufferSize = Math.floor(ac.sampleRate * 0.08);
          const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
          }
          const noise = ac.createBufferSource();
          noise.buffer = buffer;

          const filter = ac.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(380, now);
          filter.frequency.exponentialRampToValueAtTime(750, now + 0.08);
          filter.Q.value = 1.6;

          const gain = ac.createGain();
          gain.gain.setValueAtTime(0.14, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

          noise.connect(filter);
          filter.connect(gain);
          gain.connect(ac.destination);
          noise.start(now);
        } else if (type === 'score') {
          const osc = ac.createOscillator();
          const gain = ac.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(987.77, now);
          osc.frequency.setValueAtTime(1318.51, now + 0.07);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
          osc.connect(gain);
          gain.connect(ac.destination);
          osc.start(now);
          osc.stop(now + 0.22);
        } else if (type === 'hit') {
          const osc = ac.createOscillator();
          const gain = ac.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(150, now);
          osc.frequency.exponentialRampToValueAtTime(42, now + 0.16);
          gain.gain.setValueAtTime(0.16, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
          osc.connect(gain);
          gain.connect(ac.destination);
          osc.start(now);
          osc.stop(now + 0.16);
        }
      } catch (e) {}
    }

    const flakes = Array.from({ length: 34 }, () => ({
      x: Math.random() * 480,
      y: Math.random() * playH,
      r: Math.random() * 2 + 1,
      s: Math.random() * 0.6 + 0.3
    }));

    let particles = [];
    let y = 175, vel = 0, gravity = 0.35, jump = -6.3;
    let pipes = [], frame = 0, score = 0;
    let best = parseInt(localStorage.getItem('flappy_penguin_best') || '0', 10);
    let gameOver = false, dying = false, started = false;
    let groundOffset = 0, bgOffset = 0, auroraTime = 0;

    function spawnParticles(px, py, color, count) {
      for (let i = 0; i < count; i++) {
        particles.push({
          x: px,
          y: py,
          vx: (Math.random() - 0.5) * 3.8,
          vy: (Math.random() - 0.5) * 3.8 - 1,
          life: 1,
          color: color
        });
      }
    }

    function reset() {
      y = 175; vel = 0; pipes = []; particles = []; frame = 0; score = 0;
      gameOver = false; dying = false; started = true;
      playSound('flap');
    }

    function flap() {
      if (dying) return;
      if (!started || gameOver) {
        reset();
      } else {
        vel = jump;
        playSound('flap');
        spawnParticles(98, y + 18, 'rgba(236, 239, 244, 0.7)', 4);
      }
    }

    function toggleMute(e) {
      if (e) e.stopPropagation();
      muted = !muted;
      localStorage.setItem('flappy_penguin_muted', muted ? '1' : '0');
    }

    window.addEventListener('keydown', e => {
      if (e.code === 'Space') { e.preventDefault(); flap(); }
      if (e.code === 'KeyM') { toggleMute(); }
    });

    function handlePointer(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const cx = (clientX - rect.left) * scaleX;
      const cy = (clientY - rect.top) * scaleY;

      if (cx >= canvas.width - 46 && cx <= canvas.width - 10 && cy >= 10 && cy <= 42) {
        toggleMute();
        return;
      }
      flap();
    }

    canvas.addEventListener('mousedown', e => handlePointer(e.clientX, e.clientY));
    canvas.addEventListener('touchstart', e => {
      e.preventDefault();
      if (e.touches.length > 0) {
        handlePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: false });

    function drawAurora() {
      auroraTime += 0.015;
      ctx.save();
      const ribbons = [
        { baseY: 85, amp: 14, freq: 0.012, speed: 1, height: 65, color: 'rgba(163, 190, 140, 0.14)' },
        { baseY: 105, amp: 18, freq: 0.009, speed: -0.7, height: 75, color: 'rgba(136, 192, 208, 0.12)' },
        { baseY: 70, amp: 10, freq: 0.015, speed: 0.5, height: 50, color: 'rgba(180, 142, 173, 0.09)' }
      ];

      for (const r of ribbons) {
        ctx.beginPath();
        ctx.moveTo(0, r.baseY);
        for (let x = 0; x <= canvas.width; x += 12) {
          const wave = Math.sin(x * r.freq + auroraTime * r.speed) * r.amp +
                       Math.cos(x * r.freq * 0.5 - auroraTime * r.speed * 0.8) * (r.amp * 0.5);
          ctx.lineTo(x, r.baseY + wave);
        }
        for (let x = canvas.width; x >= 0; x -= 12) {
          const wave = Math.sin(x * r.freq + auroraTime * r.speed) * r.amp +
                       Math.cos(x * r.freq * 0.5 - auroraTime * r.speed * 0.8) * (r.amp * 0.5);
          ctx.lineTo(x, r.baseY + wave + r.height);
        }
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, r.baseY - 15, 0, r.baseY + r.height + 15);
        grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        grad.addColorStop(0.35, r.color);
        grad.addColorStop(0.75, r.color);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fill();
      }
      ctx.restore();
    }

    function drawBackgroundMountains() {
      ctx.save();
      ctx.fillStyle = 'rgba(46, 52, 64, 0.65)';
      const step = 120;
      for (let x = -step; x < canvas.width + step * 2; x += step) {
        const mx = x - (bgOffset % step);
        ctx.beginPath();
        ctx.moveTo(mx, playH);
        ctx.lineTo(mx + 60, playH - 125);
        ctx.lineTo(mx + 120, playH);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    function drawGround() {
      ctx.fillStyle = '#3b4252';
      ctx.fillRect(0, playH, canvas.width, groundH);

      ctx.fillStyle = '#d8dee9';
      ctx.fillRect(0, playH, canvas.width, 6);
      ctx.fillStyle = '#88c0d0';
      ctx.fillRect(0, playH + 6, canvas.width, 4);

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, playH + 10, canvas.width, groundH - 10);
      ctx.clip();

      ctx.fillStyle = '#2e3440';
      const stripeW = 24;
      for (let x = -stripeW; x < canvas.width + stripeW * 2; x += stripeW) {
        const sx = x - (groundOffset % stripeW);
        ctx.beginPath();
        ctx.moveTo(sx, playH + 10);
        ctx.lineTo(sx + 10, playH + 10);
        ctx.lineTo(sx - 4, canvas.height);
        ctx.lineTo(sx - 14, canvas.height);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    function drawPenguin(px, py) {
      ctx.save();
      ctx.translate(px + 15, py + 14);
      let angle = Math.max(-0.35, Math.min(0.45, vel * 0.055));
      if (dying || gameOver) angle = Math.min(Math.PI / 2, vel * 0.12);
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
      ctx.ellipse(-3, 2, 7, 3.8, vel < 0 && !dying ? -0.5 : 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawIceBlockPipe(x, y, w, h, isTop) {
      if (h <= 0) return;
      const capH = 20;
      const capOver = 4;

      ctx.fillStyle = '#5e81ac';
      ctx.fillRect(x, y, w, h);

      ctx.fillStyle = '#88c0d0';
      ctx.fillRect(x + 5, y, 7, h);

      ctx.fillStyle = '#4c6a8f';
      ctx.fillRect(x + w - 10, y, 10, h);

      const capY = isTop ? y + h - capH : y;
      const capX = x - capOver;
      const capW = w + capOver * 2;

      ctx.fillStyle = '#5e81ac';
      ctx.beginPath();
      ctx.roundRect(capX, capY, capW, capH, 3);
      ctx.fill();

      ctx.fillStyle = '#88c0d0';
      ctx.fillRect(capX + 5, capY + 2, 8, capH - 4);

      ctx.fillStyle = '#4c6a8f';
      ctx.fillRect(capX + capW - 11, capY + 2, 11, capH - 4);

      if (isTop) {
        ctx.fillStyle = '#8fbcbb';
        ctx.fillRect(capX + 2, capY + capH - 4, capW - 4, 4);
      } else {
        ctx.fillStyle = '#eceff4';
        ctx.beginPath();
        ctx.roundRect(capX, capY, capW, 6, [3, 3, 1, 1]);
        ctx.fill();
      }
    }

    function drawMuteButton() {
      const bx = canvas.width - 42;
      const by = 14;
      ctx.save();
      ctx.fillStyle = 'rgba(46, 52, 64, 0.78)';
      ctx.beginPath();
      ctx.roundRect(bx, by, 28, 26, 6);
      ctx.fill();
      ctx.strokeStyle = 'rgba(136, 192, 208, 0.35)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = muted ? '#bf616a' : '#88c0d0';
      ctx.beginPath();
      ctx.moveTo(bx + 7, by + 10);
      ctx.lineTo(bx + 11, by + 10);
      ctx.lineTo(bx + 16, by + 6);
      ctx.lineTo(bx + 16, by + 20);
      ctx.lineTo(bx + 11, by + 16);
      ctx.lineTo(bx + 7, by + 16);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = muted ? '#bf616a' : '#88c0d0';
      ctx.lineWidth = 1.6;
      if (muted) {
        ctx.beginPath();
        ctx.moveTo(bx + 19, by + 10);
        ctx.lineTo(bx + 23, by + 16);
        ctx.moveTo(bx + 23, by + 10);
        ctx.lineTo(bx + 19, by + 16);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(bx + 17, by + 13, 3.5, -0.7, 0.7);
        ctx.stroke();
      }
      ctx.restore();
    }

    function triggerCrash() {
      if (dying || gameOver) return;
      dying = true;
      vel = -3.2;
      playSound('hit');
      spawnParticles(110, y + 14, '#88c0d0', 14);
      if (score > best) {
        best = score;
        localStorage.setItem('flappy_penguin_best', best);
      }
    }

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawAurora();
      drawBackgroundMountains();

      ctx.fillStyle = 'rgba(236, 239, 244, 0.25)';
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
          groundOffset += 2.3;
          bgOffset += 0.45;
          frame++;
          if (frame % 96 === 0) {
            let gap = 138;
            let topH = Math.floor(Math.random() * (playH - gap - 90)) + 45;
            pipes.push({ x: canvas.width + 6, top: topH, bottom: topH + gap, passed: false });
          }
        }
      }

      const pX = 95, pSize = 26, pipeW = 48;
      for (let i = pipes.length - 1; i >= 0; i--) {
        let p = pipes[i];
        if (started && !gameOver && !dying) p.x -= 2.3;

        drawIceBlockPipe(p.x, 0, pipeW, p.top, true);
        drawIceBlockPipe(p.x, p.bottom, pipeW, playH - p.bottom, false);

        if (!dying && !gameOver) {
          if (pX + pSize - 3 > p.x - 2 && pX + 3 < p.x + pipeW + 2 && (y + 3 < p.top || y + pSize - 3 > p.bottom)) {
            triggerCrash();
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

      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += 0.12;
        pt.life -= 0.035;
        if (pt.life <= 0) {
          particles.splice(i, 1);
        } else {
          ctx.globalAlpha = pt.life;
          ctx.fillStyle = pt.color;
          ctx.fillRect(pt.x, pt.y, 3, 3);
          ctx.globalAlpha = 1;
        }
      }

      if (y + pSize >= playH) {
        y = playH - pSize;
        if (!gameOver) {
          if (!dying) playSound('hit');
          dying = false;
          gameOver = true;
          if (score > best) {
            best = score;
            localStorage.setItem('flappy_penguin_best', best);
          }
        }
      } else if (y < 0 && !dying && !gameOver) {
        y = 0;
        vel = 0;
      }

      drawPenguin(pX, y);
      drawMuteButton();

      ctx.save();
      ctx.shadowColor = 'rgba(20, 24, 31, 0.95)';
      ctx.shadowBlur = 5;
      ctx.fillStyle = '#eceff4';
      ctx.font = '600 22px system-ui, sans-serif';
      ctx.fillText(score, 18, 36);
      ctx.fillStyle = '#e5e9f0';
      ctx.font = '500 13px system-ui, sans-serif';
      ctx.fillText('Best: ' + best, 18, 56);
      ctx.restore();

      if (!started || gameOver) {
        ctx.fillStyle = 'rgba(36, 41, 51, 0.84)';
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
        drawMuteButton();
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
