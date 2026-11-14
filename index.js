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
      justify-content: center;
      align-items: center;
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
      width: 34px;
      height: 34px;
      border-radius: 8px;
      border: 1px solid rgba(236, 239, 244, 0.15);
      background: rgba(46, 52, 64, 0.72);
      color: var(--text);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s;
      z-index: 10;
    }
    .mute-btn:hover {
      background: rgba(59, 66, 82, 0.95);
      border-color: rgba(136, 192, 208, 0.45);
    }
    .mute-btn svg {
      width: 16px;
      height: 16px;
      fill: currentColor;
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
        <button id="muteBtn" class="mute-btn" type="button" aria-label="Toggle sound" title="Mute / Unmute"></button>
      </div>
      <div class="hint">Space / Click / Tap to flap</div>
    </div>
  </main>

  <footer>Created with <span class="nord-heart" aria-label="heart"><svg viewBox="0 0 512 512"><path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"/></svg></span> by <a href="https://fatihertem.com" target="_blank" rel="noopener">fatih</a></footer>

  <script>
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    const muteBtn = document.getElementById('muteBtn');

    let muted = localStorage.getItem('flappy_penguin_muted') === 'true';
    let audioCtx = null;

    const iconSoundOn = '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
    const iconSoundOff = '<svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>';

    function updateMuteUI() {
      muteBtn.innerHTML = muted ? iconSoundOff : iconSoundOn;
    }
    updateMuteUI();

    muteBtn.addEventListener('click', e => {
      e.stopPropagation();
      muted = !muted;
      localStorage.setItem('flappy_penguin_muted', muted);
      updateMuteUI();
    });

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
      const bufferSize = audioCtx.sampleRate * 0.09;
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
      filter.frequency.exponentialRampToValueAtTime(750, now + 0.09);
      filter.Q.value = 1.4;

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

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

      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now);
      osc.frequency.setValueAtTime(880, now + 0.065);

      gain.gain.setValueAtTime(0.11, now);
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

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(48, now + 0.22);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    }

    const groundH = 38;
    const playH = canvas.height - groundH;
    let groundX = 0;
    let bgOffset = 0;
    let auroraTime = 0;

    const flakes = Array.from({ length: 36 }, () => ({
      x: Math.random() * 480,
      y: Math.random() * playH,
      r: Math.random() * 2 + 1,
      s: Math.random() * 0.6 + 0.3
    }));

    let particles = [];
    function spawnSnowBurst(px, py, count) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.8 + 0.8;
        particles.push({
          x: px,
          y: py,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.8,
          r: Math.random() * 2.5 + 1.2,
          life: 1
        });
      }
    }

    let y = 175, vel = 0, gravity = 0.36, jump = -6.4;
    let pipes = [], frame = 0, score = 0;
    let best = parseInt(localStorage.getItem('flappy_penguin_best') || '0', 10);
    let dying = false, gameOver = false, started = false;

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
    }

    function triggerCrash(px, py) {
      if (dying || gameOver) return;
      dying = true;
      vel = -3.2;
      playHitSound();
      spawnSnowBurst(px + 14, py + 14, 18);
      if (score > best) {
        best = score;
        localStorage.setItem('flappy_penguin_best', best);
      }
    }

    function flap() {
      if (dying) return;
      if (!started || gameOver) {
        reset();
        vel = jump;
        playFlapSound();
        spawnSnowBurst(98, y + 18, 6);
      } else {
        vel = jump;
        playFlapSound();
        spawnSnowBurst(98, y + 18, 5);
      }
    }

    window.addEventListener('keydown', e => {
      if (e.code === 'Space') {
        e.preventDefault();
        flap();
      }
    });
    canvas.addEventListener('mousedown', flap);
    canvas.addEventListener('touchstart', e => {
      e.preventDefault();
      flap();
    }, { passive: false });

    function drawAurora() {
      auroraTime += 0.014;
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      const ribbons = [
        { baseY: 85, amp: 16, freq: 0.011, speed: 1.0, height: 68, color: '163, 190, 140', alpha: 0.14 },
        { baseY: 112, amp: 20, freq: 0.0085, speed: -0.75, height: 55, color: '136, 192, 208', alpha: 0.11 },
        { baseY: 68, amp: 12, freq: 0.014, speed: 0.6, height: 48, color: '180, 142, 173', alpha: 0.08 }
      ];

      for (const r of ribbons) {
        const step = 6;
        for (let x = 0; x <= canvas.width; x += step) {
          const wave = Math.sin(x * r.freq + auroraTime * r.speed) * r.amp +
                       Math.cos(x * r.freq * 1.9 - auroraTime * r.speed * 0.6) * (r.amp * 0.45);
          const shimmer = 0.55 + 0.45 * Math.sin(x * 0.032 + auroraTime * 2.1);
          const topY = r.baseY + wave;
          const h = r.height * (0.8 + 0.25 * shimmer);

          const grad = ctx.createLinearGradient(0, topY - h, 0, topY + 12);
          grad.addColorStop(0, `rgba(${r.color}, 0)`);
          grad.addColorStop(0.55, `rgba(${r.color}, ${(r.alpha * shimmer * 0.55).toFixed(3)})`);
          grad.addColorStop(0.88, `rgba(${r.color}, ${(r.alpha * shimmer).toFixed(3)})`);
          grad.addColorStop(1, `rgba(${r.color}, 0)`);

          ctx.fillStyle = grad;
          ctx.fillRect(x, topY - h, step + 1, h + 12);
        }
      }

      ctx.restore();
    }

    function drawBackgroundMountains() {
      const span = 240;
      const startX = -(bgOffset % span);

      ctx.fillStyle = '#2a303c';
      for (let x = startX - span; x < canvas.width + span; x += span) {
        ctx.beginPath();
        ctx.moveTo(x, playH);
        ctx.lineTo(x + 55, playH - 85);
        ctx.lineTo(x + 115, playH - 42);
        ctx.lineTo(x + 175, playH - 115);
        ctx.lineTo(x + span, playH);
        ctx.closePath();
        ctx.fill();
      }
    }

    function drawPenguin(x, y) {
      ctx.save();
      ctx.translate(x + 15, y + 14);
      let angle = Math.max(-0.35, Math.min(0.45, vel * 0.055));
      if (dying || gameOver) angle = Math.min(Math.PI / 2, Math.max(0.4, vel * 0.14));
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

      const capH = Math.min(20, h);
      const capOverhang = 4;
      const capW = w + capOverhang * 2;
      const capX = x - capOverhang;

      ctx.fillStyle = '#5e81ac';
      ctx.fillRect(x, y, w, h);

      ctx.fillStyle = '#88c0d0';
      ctx.fillRect(x + 4, y, 6, h);
      ctx.fillStyle = 'rgba(236, 239, 244, 0.3)';
      ctx.fillRect(x + 12, y, 2, h);

      ctx.fillStyle = '#4c6a8f';
      ctx.fillRect(x + w - 9, y, 9, h);

      const capY = isTop ? y + h - capH : y;

      ctx.fillStyle = '#688db8';
      ctx.beginPath();
      ctx.roundRect(capX, capY, capW, capH, 4);
      ctx.fill();

      ctx.fillStyle = '#88c0d0';
      ctx.fillRect(capX + 4, capY + 2, 7, capH - 4);
      ctx.fillStyle = '#4c6a8f';
      ctx.fillRect(capX + capW - 10, capY + 2, 10, capH - 4);

      if (isTop) {
        ctx.fillStyle = '#8fbcbb';
        ctx.beginPath();
        ctx.roundRect(capX + 1, capY + capH - 4, capW - 2, 4, [0, 0, 4, 4]);
        ctx.fill();
      } else {
        ctx.fillStyle = '#eceff4';
        ctx.beginPath();
        ctx.roundRect(capX + 1, capY, capW - 2, 5, [4, 4, 0, 0]);
        ctx.fill();
      }

      ctx.strokeStyle = '#3b4252';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(capX, capY, capW, capH, 4);
      ctx.stroke();
    }

    function drawGround() {
      ctx.fillStyle = '#3b4252';
      ctx.fillRect(0, playH, canvas.width, groundH);

      ctx.fillStyle = '#eceff4';
      ctx.fillRect(0, playH, canvas.width, 5);
      ctx.fillStyle = '#88c0d0';
      ctx.fillRect(0, playH + 5, canvas.width, 3);

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, playH + 8, canvas.width, groundH - 8);
      ctx.clip();

      ctx.fillStyle = '#4c566a';
      const stripeW = 24;
      const startX = -(groundX % stripeW);
      for (let x = startX - stripeW; x < canvas.width + stripeW; x += stripeW) {
        ctx.beginPath();
        ctx.moveTo(x, playH + 8);
        ctx.lineTo(x + 12, playH + 8);
        ctx.lineTo(x + 2, canvas.height);
        ctx.lineTo(x - 10, canvas.height);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawAurora();
      drawBackgroundMountains();

      ctx.fillStyle = 'rgba(236, 239, 244, 0.35)';
      for (const f of flakes) {
        f.y += f.s;
        f.x -= started && !dying && !gameOver ? 0.6 : 0.25;
        if (f.y > playH) { f.y = 0; f.x = Math.random() * canvas.width; }
        if (f.x < 0) f.x = canvas.width;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (started && !dying && !gameOver) {
        vel += gravity;
        y += vel;
        groundX += 2.4;
        bgOffset += 0.45;
        frame++;
        if (frame % 92 === 0) {
          let gap = 132;
          let minTop = 44;
          let maxTop = playH - gap - 44;
          let topH = Math.floor(Math.random() * (maxTop - minTop)) + minTop;
          pipes.push({ x: canvas.width + 8, top: topH, bottom: topH + gap, passed: false });
        }
      } else if (dying) {
        vel += gravity * 1.15;
        y += vel;
        if (y + 26 >= playH) {
          y = playH - 26;
          dying = false;
          gameOver = true;
        }
      }

      const pX = 95, pSize = 26;
      const pipeW = 48;
      for (let i = pipes.length - 1; i >= 0; i--) {
        let p = pipes[i];
        if (started && !dying && !gameOver) p.x -= 2.4;

        drawIceBlockPipe(p.x, 0, pipeW, p.top, true);
        drawIceBlockPipe(p.x, p.bottom, pipeW, playH - p.bottom, false);

        if (!dying && !gameOver) {
          const hitLeft = p.x - 2;
          const hitRight = p.x + pipeW + 2;
          if (pX + pSize - 3 > hitLeft && pX + 3 < hitRight && (y + 3 < p.top || y + pSize - 3 > p.bottom)) {
            triggerCrash(pX, y);
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

      if (!dying && !gameOver && (y + pSize >= playH || y < 0)) {
        if (y + pSize >= playH) y = playH - pSize;
        triggerCrash(pX, y);
        dying = false;
        gameOver = true;
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += 0.08;
        pt.life -= 0.035;
        if (pt.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(236, 239, 244, ${pt.life})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();
      }

      drawPenguin(pX, y);

      ctx.save();
      ctx.shadowColor = 'rgba(20, 24, 32, 0.92)';
      ctx.shadowBlur = 6;
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
