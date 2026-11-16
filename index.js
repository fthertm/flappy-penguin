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
      --header: #526e96;
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
    header h1 { font-size: 28px; font-weight: 500; letter-spacing: -0.4px; line-height: 1; }
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
      box-shadow: 0 8px 24px rgba(36, 41, 51, 0.55);
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
      width: min(480px, calc(100vw - 48px), calc((100dvh - 145px) * 480 / 440));
      height: auto;
      aspect-ratio: 480 / 440;
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
      transition: color 0.2s ease;
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
      <canvas id="game" width="480" height="440"></canvas>
      <div class="hint">Space / Click / Tap to flap</div>
    </div>
  </main>

  <footer>Created with <span class="nord-heart" aria-label="heart"><svg viewBox="0 0 512 512"><path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"/></svg></span> by <a href="https://fatihertem.com" target="_blank" rel="noopener">fatih</a></footer>

  <script>
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');

    const W = 480, H = 440;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const reduceMotion = false;

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
      filter.frequency.setValueAtTime(380, now);
      filter.frequency.exponentialRampToValueAtTime(750, now + 0.085);
      filter.Q.value = 1.6;

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);

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
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.setValueAtTime(1318.51, now + 0.075);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.24);
    }

    function playCrashSound() {
      if (muted) return;
      initAudio();
      if (!audioCtx) return;
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(42, now + 0.22);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    }

    const stars = Array.from({ length: 22 }, () => ({
      x: Math.random() * 480,
      y: Math.random() * 230,
      r: Math.random() * 1.1 + 0.4,
      a: Math.random() * 0.4 + 0.15
    }));

    const flakes = Array.from({ length: 32 }, () => ({
      x: Math.random() * 480,
      y: Math.random() * 410,
      r: Math.random() * 2 + 1,
      s: Math.random() * 0.6 + 0.35
    }));

    const farMountains = [
      { x: 0, w: 180, h: 145, snowRatio: 0.36 },
      { x: 140, w: 210, h: 175, snowRatio: 0.38 },
      { x: 310, w: 190, h: 135, snowRatio: 0.35 },
      { x: 460, w: 180, h: 165, snowRatio: 0.37 },
      { x: 610, w: 200, h: 150, snowRatio: 0.36 }
    ];

    const nearMountains = [
      { x: 20, w: 150, h: 105, snowRatio: 0.34 },
      { x: 150, w: 170, h: 125, snowRatio: 0.36 },
      { x: 295, w: 155, h: 95, snowRatio: 0.33 },
      { x: 430, w: 165, h: 118, snowRatio: 0.35 },
      { x: 575, w: 150, h: 100, snowRatio: 0.34 }
    ];

    let particles = [];
    let shakeT = 0, scorePop = 0, auroraT = 0;
    const tipH = 30;
    const groundHeight = 28;
    const playHeight = H - groundHeight;
    let groundOffset = 0;

    let y = 185, vel = 0, gravity = 0.36, jump = -6.5;
    let pipes = [], frame = 0, score = 0;
    let best = parseInt(localStorage.getItem('flappy_penguin_best') || '0', 10);
    let isNewBest = false;
    let gameOver = false, started = false, crashed = false;

    const muteBtn = { x: W - 42, y: 12, w: 30, h: 30 };

    function spawnSnowBurst(bx, by, count) {
      for (let i = 0; i < count; i++) {
        particles.push({
          x: bx,
          y: by,
          vx: (Math.random() - 0.5) * 4.5,
          vy: (Math.random() - 0.5) * 4.5 - 1,
          r: Math.random() * 2.5 + 1,
          life: 1.0
        });
      }
    }

    function reset() {
      y = 185; vel = 0; pipes = []; particles = [];
      frame = 0; score = 0;
      gameOver = false; started = true; crashed = false; isNewBest = false;
      scorePop = 0; shakeT = 0;
      vel = jump;
      playFlapSound();
      spawnSnowBurst(100, y + 18, 6);
    }

    function flap() {
      if (gameOver) {
        reset();
      } else if (!started) {
        reset();
      } else if (!crashed) {
        vel = jump;
        playFlapSound();
        spawnSnowBurst(100, y + 18, 5);
      }
    }

    function triggerCrash(fromGround = false) {
      if (!crashed) {
        crashed = true;
        if (!reduceMotion) shakeT = 1;
        vel = fromGround ? 0 : -2.5;
        playCrashSound();
        spawnSnowBurst(110, y + 14, 14);
        if (score > best) {
          best = score;
          isNewBest = true;
          localStorage.setItem('flappy_penguin_best', best);
        }
      }
    }

    function handlePointer(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = W / rect.width;
      const scaleY = H / rect.height;
      const cx = (clientX - rect.left) * scaleX;
      const cy = (clientY - rect.top) * scaleY;

      if (cx >= muteBtn.x - 4 && cx <= muteBtn.x + muteBtn.w + 4 &&
          cy >= muteBtn.y - 4 && cy <= muteBtn.y + muteBtn.h + 4) {
        muted = !muted;
        localStorage.setItem('flappy_penguin_muted', muted);
        if (!muted) initAudio();
        return;
      }
      flap();
    }

    window.addEventListener('keydown', e => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        flap();
      } else if (e.code === 'KeyM') {
        muted = !muted;
        localStorage.setItem('flappy_penguin_muted', muted);
      }
    });
    canvas.addEventListener('mousedown', e => handlePointer(e.clientX, e.clientY));
    canvas.addEventListener('touchstart', e => {
      e.preventDefault();
      if (e.touches.length > 0) {
        handlePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: false });

    const aurora = (() => {
      const AW = 480, AH = 190;
      const c = document.createElement('canvas');
      c.width = AW; c.height = AH;
      const g = c.getContext('2d');
      const green = [163, 190, 140], ice = [136, 192, 208], purple = [180, 142, 173];
      const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
      for (let x = 0; x < AW; x++) {
        const th = (x / AW) * Math.PI * 2;
        const base = 78 + Math.sin(th * 2) * 16 + Math.sin(th * 3 + 1.3) * 9;
        const len = 62 + Math.sin(th * 4 + 0.7) * 16 + Math.sin(th * 7) * 7;
        const strength = 0.55 + 0.45 * Math.sin(th * 3 + 0.4);
        let col = mix(green, ice, (Math.sin(th * 2 + 0.5) + 1) / 2);
        col = mix(col, purple, Math.max(0, Math.sin(th * 3 - 0.8)) * 0.7);
        const rgb = col.join(',');
        const top = base - len;
        const total = len * 1.35;
        const grad = g.createLinearGradient(0, top, 0, top + total);
        grad.addColorStop(0, 'rgba(' + rgb + ',0)');
        grad.addColorStop(0.74, 'rgba(' + rgb + ',' + (0.5 * strength).toFixed(3) + ')');
        grad.addColorStop(1, 'rgba(' + rgb + ',0)');
        g.fillStyle = grad;
        g.fillRect(x, top, 1, total);
      }
      return { c, AW };
    })();

    function drawAurora() {
      const t = auroraT;
      ctx.save();
      ctx.globalAlpha = 0.85 + Math.sin(t * 0.013) * 0.15;
      let ox = -((t * 0.10) % aurora.AW);
      ctx.drawImage(aurora.c, ox, 0);
      ctx.drawImage(aurora.c, ox + aurora.AW, 0);

      ctx.globalAlpha = 0.45 + Math.sin(t * 0.021 + 1) * 0.25;
      ctx.translate(W, 14);
      ctx.scale(-1, 0.85);
      ox = -((t * 0.06) % aurora.AW);
      ctx.drawImage(aurora.c, ox, 0);
      ctx.drawImage(aurora.c, ox + aurora.AW, 0);
      ctx.restore();
    }

    function drawSnowyMountain(m, baseY, bodyColor, shadeColor, snowColor, snowShade) {
      const peakX = m.x + m.w * 0.5;
      const peakY = baseY - m.h;

      ctx.fillStyle = bodyColor;
      ctx.beginPath();
      ctx.moveTo(m.x, baseY);
      ctx.lineTo(peakX, peakY);
      ctx.lineTo(m.x + m.w, baseY);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = shadeColor;
      ctx.beginPath();
      ctx.moveTo(peakX, peakY);
      ctx.lineTo(m.x + m.w, baseY);
      ctx.lineTo(peakX + m.w * 0.08, baseY);
      ctx.closePath();
      ctx.fill();

      const snowH = m.h * m.snowRatio;
      const leftSnowX = peakX - (m.w * 0.5) * m.snowRatio;
      const rightSnowX = peakX + (m.w * 0.5) * m.snowRatio;
      const snowBaseY = peakY + snowH;

      ctx.fillStyle = snowColor;
      ctx.beginPath();
      ctx.moveTo(peakX, peakY);
      ctx.lineTo(leftSnowX, snowBaseY);
      ctx.lineTo(leftSnowX + (rightSnowX - leftSnowX) * 0.25, snowBaseY - 7);
      ctx.lineTo(peakX, snowBaseY + 4);
      ctx.lineTo(leftSnowX + (rightSnowX - leftSnowX) * 0.75, snowBaseY - 6);
      ctx.lineTo(rightSnowX, snowBaseY);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = snowShade;
      ctx.beginPath();
      ctx.moveTo(peakX, peakY);
      ctx.lineTo(peakX, snowBaseY + 4);
      ctx.lineTo(leftSnowX + (rightSnowX - leftSnowX) * 0.75, snowBaseY - 6);
      ctx.lineTo(rightSnowX, snowBaseY);
      ctx.closePath();
      ctx.fill();
    }

    function drawBackground() {
      const skyGrad = ctx.createLinearGradient(0, 0, 0, playHeight);
      skyGrad.addColorStop(0, '#1e222a');
      skyGrad.addColorStop(1, '#292f3b');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, playHeight);

      drawAurora();

      for (const s of stars) {
        ctx.fillStyle = 'rgba(236, 239, 244, ' + s.a + ')';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const m of farMountains) {
        if (started && !crashed) {
          m.x -= 0.25;
          if (m.x + m.w < 0) m.x += 780;
        }
        drawSnowyMountain(m, playHeight, '#2e3644', '#272e3a', '#aeb9c7', '#8f9cab');
      }

      for (const m of nearMountains) {
        if (started && !crashed) {
          m.x -= 0.55;
          if (m.x + m.w < 0) m.x += 720;
        }
        drawSnowyMountain(m, playHeight, '#364052', '#2d3646', '#d8dee9', '#b8c3d1');
      }
    }

    function drawGround() {
      const gy = playHeight;
      ctx.fillStyle = '#3b4252';
      ctx.fillRect(0, gy, W, groundHeight);

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, gy, W, groundHeight);
      ctx.clip();

      ctx.strokeStyle = 'rgba(136, 192, 208, 0.30)';
      ctx.lineWidth = 1;
      ctx.lineJoin = 'round';
      const cs = 64;
      const off = groundOffset % cs;
      for (let gx = -cs + off; gx < W + cs; gx += cs) {
        ctx.beginPath();
        ctx.moveTo(gx + 6, gy + 11);
        ctx.lineTo(gx + 15, gy + 16);
        ctx.lineTo(gx + 11, gy + 20);
        ctx.lineTo(gx + 22, gy + 26);
        ctx.moveTo(gx + 15, gy + 16);
        ctx.lineTo(gx + 27, gy + 15);
        ctx.moveTo(gx + 44, gy + 12);
        ctx.lineTo(gx + 49, gy + 19);
        ctx.lineTo(gx + 46, gy + 24);
        ctx.stroke();
      }

      ctx.fillStyle = '#88c0d0';
      ctx.fillRect(0, gy + 8, W, 3);

      // Snow layer anchored seamlessly from gy down to the ice trim
      ctx.fillStyle = '#e5e9f0';
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(W, gy);
      ctx.lineTo(W, gy + 9);
      for (let x = W; x >= 0; x -= 4) {
        const ph = x - groundOffset;
        ctx.lineTo(x, gy + 5.5 + Math.sin(ph * 0.07) * 2.0 + Math.sin(ph * 0.19) * 0.9);
      }
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }

    function drawPenguin(x, py) {
      ctx.save();
      ctx.translate(x + 15, py + 14);
      let angle;
      if (!started) {
        angle = Math.sin(frame * 0.08) * 0.08;
      } else if (gameOver) {
        angle = Math.PI / 2;
      } else if (crashed) {
        angle = Math.min(Math.PI / 2, Math.max(0.35, vel * 0.11));
      } else {
        angle = Math.max(-0.35, Math.min(0.45, vel * 0.055));
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
      let wingAngle = vel < 0 ? -0.5 : 0.35;
      if (!started) wingAngle = Math.sin(frame * 0.14) * 0.35;
      ctx.beginPath();
      ctx.ellipse(-3, 2, 7, 3.8, wingAngle, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawIceBlockPipe(x, py, w, h, isTop) {
      if (h <= 0) return;
      const cx = x + w / 2;

      if (isTop) {
        const colH = Math.max(0, h - tipH);
        const ts = py + colH;
        const tip = py + h;

        ctx.save();
        // Single unified polygon for the entire icicle
        ctx.beginPath();
        ctx.moveTo(x, py);
        ctx.lineTo(x + w, py);
        ctx.lineTo(x + w, ts);
        ctx.lineTo(cx, tip);
        ctx.lineTo(x, ts);
        ctx.closePath();

        ctx.fillStyle = '#81a1c1';
        ctx.fill();
        ctx.clip();

        // Proportional right-edge shadow strip tapering cleanly to the tip
        ctx.fillStyle = '#5e81ac';
        ctx.beginPath();
        ctx.moveTo(x + w - 10, py);
        ctx.lineTo(x + w, py);
        ctx.lineTo(x + w, ts);
        ctx.lineTo(cx, tip);
        ctx.lineTo(cx - 4, tip);
        ctx.lineTo(x + w - 10, ts);
        ctx.closePath();
        ctx.fill();

        // Left ice highlight strip tapering cleanly toward the tip
        ctx.fillStyle = 'rgba(143, 188, 187, 0.65)';
        ctx.beginPath();
        ctx.moveTo(x + 5, py);
        ctx.lineTo(x + 11, py);
        ctx.lineTo(x + 11, ts);
        ctx.lineTo(cx - 8, tip);
        ctx.lineTo(cx - 11, tip);
        ctx.lineTo(x + 5, ts);
        ctx.closePath();
        ctx.fill();

        // Inner vertical highlight line
        ctx.fillStyle = 'rgba(236, 239, 244, 0.25)';
        ctx.fillRect(x + 14, py, 2, h);

        ctx.restore();
      } else {
        ctx.fillStyle = '#81a1c1';
        ctx.fillRect(x, py, w, h);
        ctx.fillStyle = '#5e81ac';
        ctx.fillRect(x + w - 10, py, 10, h);
        ctx.fillStyle = 'rgba(143, 188, 187, 0.65)';
        ctx.fillRect(x + 5, py, 6, h);
        ctx.fillStyle = 'rgba(236, 239, 244, 0.25)';
        ctx.fillRect(x + 14, py, 2, h);

        ctx.fillStyle = '#eceff4';
        ctx.beginPath();
        ctx.roundRect(x - 3, py, w + 6, 11, [5, 5, 3, 3]);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + 9, py + 11, 3.5, 0, Math.PI * 2);
        ctx.arc(cx + 5, py + 12, 4, 0, Math.PI * 2);
        ctx.arc(x + w - 8, py + 11, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#d8dee9';
        ctx.beginPath();
        ctx.roundRect(x + w - 10, py + 1, 13, 10, [0, 5, 3, 0]);
        ctx.fill();
      }
    }

    function hitsTopPipe(p, pX, py, pSize, pipeW) {
      const bx0 = pX + 3, bx1 = pX + pSize - 3;
      const ty = py + 3;
      if (ty >= p.top) return false;
      const cx = p.x + pipeW / 2;
      const tipStart = p.top - tipH;
      if (ty < tipStart) {
        return bx1 > p.x - 2 && bx0 < p.x + pipeW + 2;
      }
      const f = (p.top - ty) / tipH;
      const hw = (pipeW / 2) * f + 2;
      return bx1 > cx - hw && bx0 < cx + hw;
    }

    function drawMuteButton() {
      ctx.save();
      ctx.fillStyle = 'rgba(46, 52, 64, 0.72)';
      ctx.beginPath();
      ctx.roundRect(muteBtn.x, muteBtn.y, muteBtn.w, muteBtn.h, 6);
      ctx.fill();
      ctx.strokeStyle = 'rgba(216, 222, 233, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = muted ? '#bf616a' : '#eceff4';
      ctx.strokeStyle = muted ? '#bf616a' : '#eceff4';
      ctx.lineWidth = 1.8;

      const cx = muteBtn.x + 8;
      const cy = muteBtn.y + 15;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 3);
      ctx.lineTo(cx + 4, cy - 3);
      ctx.lineTo(cx + 8, cy - 7);
      ctx.lineTo(cx + 8, cy + 7);
      ctx.lineTo(cx + 4, cy + 3);
      ctx.lineTo(cx, cy + 3);
      ctx.closePath();
      ctx.fill();

      if (muted) {
        ctx.beginPath();
        ctx.moveTo(cx + 11, cy - 3);
        ctx.lineTo(cx + 16, cy + 3);
        ctx.moveTo(cx + 16, cy - 3);
        ctx.lineTo(cx + 11, cy + 3);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(cx + 9, cy, 3.5, -Math.PI / 3, Math.PI / 3);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx + 9, cy, 6.5, -Math.PI / 3, Math.PI / 3);
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawGetReadyOverlay() {
      ctx.save();
      ctx.textAlign = 'center';

      ctx.shadowColor = 'rgba(36, 41, 51, 0.85)';
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#eceff4';
      ctx.font = '700 28px system-ui, sans-serif';
      ctx.fillText('Get Ready!', W / 2, 118);

      const bob = Math.sin(frame * 0.08) * 4;
      const boxW = 210;
      const boxH = 34;
      const boxX = (W - boxW) / 2;
      const boxY = 250 + bob;

      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(59, 66, 82, 0.85)';
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, 8);
      ctx.fill();
      ctx.strokeStyle = 'rgba(136, 192, 208, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.fillStyle = '#88c0d0';
      ctx.font = '600 13px system-ui, sans-serif';
      ctx.fillText('Space / Click / Tap to Flap', W / 2, boxY + 21);

      ctx.restore();
    }

    function drawGameOverCard() {
      ctx.save();
      ctx.fillStyle = 'rgba(30, 34, 42, 0.52)';
      ctx.fillRect(0, 0, W, H);

      const cardW = 250;
      const cardH = 186;
      const cardX = (W - cardW) / 2;
      const cardY = (playHeight - cardH) / 2;

      ctx.shadowColor = 'rgba(36, 41, 51, 0.7)';
      ctx.shadowBlur = 16;
      ctx.fillStyle = '#3b4252';
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 12);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(216, 222, 233, 0.14)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#eceff4';
      ctx.font = '700 24px system-ui, sans-serif';
      ctx.fillText('Game Over', W / 2, cardY + 38);

      const innerX = cardX + 20;
      const innerY = cardY + 54;
      const innerW = cardW - 40;
      const innerH = 74;

      ctx.fillStyle = '#2e3440';
      ctx.beginPath();
      ctx.roundRect(innerX, innerY, innerW, innerH, 8);
      ctx.fill();

      ctx.fillStyle = '#aeb8c4';
      ctx.font = '600 11px system-ui, sans-serif';
      ctx.fillText('score', innerX + innerW * 0.27, innerY + 24);
      ctx.fillStyle = '#eceff4';
      ctx.font = '700 24px system-ui, sans-serif';
      ctx.fillText(score, innerX + innerW * 0.27, innerY + 54);

      ctx.strokeStyle = 'rgba(216, 222, 233, 0.12)';
      ctx.beginPath();
      ctx.moveTo(W / 2, innerY + 14);
      ctx.lineTo(W / 2, innerY + innerH - 14);
      ctx.stroke();

      ctx.fillStyle = '#aeb8c4';
      ctx.font = '600 11px system-ui, sans-serif';
      ctx.fillText('best', innerX + innerW * 0.73, innerY + 24);
      ctx.fillStyle = '#88c0d0';
      ctx.font = '700 24px system-ui, sans-serif';
      ctx.fillText(best, innerX + innerW * 0.73, innerY + 54);

      if (isNewBest && score > 0) {
        ctx.fillStyle = '#bf616a';
        ctx.beginPath();
        ctx.roundRect(innerX + innerW - 42, innerY - 8, 36, 16, 4);
        ctx.fill();
        ctx.fillStyle = '#eceff4';
        ctx.font = '700 10px system-ui, sans-serif';
        ctx.fillText('new', innerX + innerW - 24, innerY + 3);
      }

      const btnW = 146;
      const btnH = 32;
      const btnX = (W - btnW) / 2;
      const btnY = cardY + 140;

      ctx.fillStyle = '#5e81ac';
      ctx.beginPath();
      ctx.roundRect(btnX, btnY, btnW, btnH, 6);
      ctx.fill();

      ctx.fillStyle = '#eceff4';
      ctx.font = '600 13px system-ui, sans-serif';
      ctx.fillText('Play Again', W / 2, btnY + 21);

      ctx.restore();
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);

      ctx.save();
      if (shakeT > 0) {
        const m = shakeT * 5;
        ctx.translate((Math.random() - 0.5) * 2 * m, (Math.random() - 0.5) * 2 * m);
        shakeT = Math.max(0, shakeT - 0.07);
      }
      if (!reduceMotion) auroraT++;

      drawBackground();

      ctx.fillStyle = 'rgba(236, 239, 244, 0.35)';
      for (const f of flakes) {
        f.y += f.s;
        f.x -= 0.45;
        if (f.y > playHeight) { f.y = 0; f.x = Math.random() * W; }
        if (f.x < 0) f.x = W;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }

      const speed = 2.4;
      if (!started) {
        frame++;
        groundOffset -= 1.2;
        y = 185 + Math.sin(frame * 0.08) * 7;
      } else if (!crashed) {
        vel += gravity;
        y += vel;
        frame++;
        groundOffset -= speed;

        if (frame % 92 === 0) {
          let gap = 128;
          let minTop = 48;
          let maxTop = playHeight - gap - 48;
          let topH = Math.floor(Math.random() * (maxTop - minTop)) + minTop;
          pipes.push({ x: W + 10, top: topH, bottom: topH + gap, passed: false });
        }
      } else if (!gameOver) {
        vel += gravity * 1.15;
        y += vel;
        frame++;
      }

      const pX = 95, pSize = 26, pipeW = 48;
      for (let i = pipes.length - 1; i >= 0; i--) {
        let p = pipes[i];
        if (started && !crashed) p.x -= speed;

        drawIceBlockPipe(p.x, 0, pipeW, p.top, true);
        drawIceBlockPipe(p.x, p.bottom, pipeW, playHeight - p.bottom, false);

        if (!crashed) {
          const hitBottom = pX + pSize - 3 > p.x - 2 && pX + 3 < p.x + pipeW + 2 &&
                            y + pSize - 3 > p.bottom;
          if (hitBottom || hitsTopPipe(p, pX, y, pSize, pipeW)) {
            triggerCrash(false);
          }
          if (!p.passed && p.x + pipeW < pX) {
            score++;
            scorePop = 1;
            p.passed = true;
            playScoreSound();
          }
        }
        if (p.x + pipeW + 10 < 0) pipes.splice(i, 1);
      }

      drawGround();

      for (let i = particles.length - 1; i >= 0; i--) {
        let pt = particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life -= 0.04;
        if (pt.life <= 0) {
          particles.splice(i, 1);
        } else {
          ctx.fillStyle = 'rgba(236, 239, 244, ' + pt.life + ')';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (y + pSize >= playHeight) {
        y = playHeight - pSize;
        if (!crashed) triggerCrash(true);
        gameOver = true;
      }
      if (y < 0) {
        y = 0;
        vel = 0;
      }

      drawPenguin(pX, y);
      ctx.restore();

      scorePop = Math.max(0, scorePop - 0.07);

      if (started && !gameOver) {
        ctx.save();
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(30, 34, 42, 0.85)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetY = 1;
        ctx.translate(W / 2, 52);
        const sc = 1 + 0.3 * scorePop;
        ctx.scale(sc, sc);
        ctx.fillStyle = '#eceff4';
        ctx.font = '700 34px system-ui, sans-serif';
        ctx.fillText(score, 0, 0);
        ctx.restore();

        ctx.save();
        ctx.textAlign = 'center';
        ctx.fillStyle = '#d8dee9';
        ctx.font = '600 13px system-ui, sans-serif';
        ctx.fillText('Best: ' + best, W / 2, 74);
        ctx.restore();
      }

      drawMuteButton();

      if (!started) {
        drawGetReadyOverlay();
      } else if (gameOver) {
        drawGameOverCard();
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
