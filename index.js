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
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <meta name="robots" content="noindex, nofollow">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="theme-color" content="#1e222a">
  <title>Flappy Penguin</title>
  <link rel="icon" href="/assets/icons/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/assets/icons/favicon.ico" sizes="48x48">
  <link rel="apple-touch-icon" href="/assets/icons/apple-touch-icon.png" sizes="180x180">
  <link rel="manifest" href="/manifest.webmanifest">

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }
    html, body {
      width: 100vw;
      height: 100dvh;
      overflow: hidden;
      background: #1e222a;
      touch-action: none;
      overscroll-behavior: none;
      user-select: none;
      -webkit-user-select: none;
    }
    canvas {
      display: block;
      width: 100vw;
      height: 100dvh;
      cursor: pointer;
    }
    .nav-btn {
      position: fixed;
      top: calc(14px + env(safe-area-inset-top));
      left: calc(14px + env(safe-area-inset-left));
      z-index: 10;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: rgba(46, 52, 64, 0.72);
      border: 1px solid rgba(216, 222, 233, 0.2);
      color: #eceff4;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      transition: background 0.15s ease, transform 0.1s ease;
    }
    .nav-btn:hover {
      background: rgba(59, 66, 82, 0.9);
    }
    .nav-btn:active {
      transform: scale(0.95);
    }
    .nav-btn svg {
      width: 18px;
      height: 18px;
      stroke: currentColor;
      stroke-width: 2.2;
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  </style>
</head>
<body>
  <a class="nav-btn" href="https://${domain}" aria-label="Back to Dashboard">
    <svg viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
  </a>

  <canvas id="game"></canvas>

  <script>
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');

    const nowDate = new Date();
    const isBirthday = (nowDate.getMonth() === 0 && nowDate.getDate() === 22);
    const confettiPalette = ['191, 97, 106', '235, 203, 139', '163, 190, 140', '136, 192, 208'];
    const bdayNotes = [
      261.63, 261.63, 293.66, 261.63, 349.23, 329.63,
      261.63, 261.63, 293.66, 261.63, 392.00, 349.23,
      261.63, 261.63, 523.25, 440.00, 349.23, 329.63, 293.66,
      466.16, 466.16, 440.00, 349.23, 392.00, 349.23
    ];
    let noteIndex = 0;

    const H = 480;
    let W = 800;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const groundHeight = 28;
    const playHeight = H - groundHeight;
    const muteBtn = { x: W - 50, y: 14, w: 36, h: 36 };

    const stars = [];
    const flakes = [];
    const farMountains = [];
    const nearMountains = [];
    let farSpan = 0;
    let nearSpan = 0;

    function initScenery() {
      stars.length = 0;
      const starCount = Math.max(28, Math.round(W * 0.065));
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * (playHeight * 0.62),
          r: Math.random() * 1.15 + 0.4,
          a: Math.random() * 0.45 + 0.15
        });
      }

      flakes.length = 0;
      const flakeCount = Math.max(36, Math.round(W * 0.08));
      for (let i = 0; i < flakeCount; i++) {
        flakes.push({
          x: Math.random() * W,
          y: Math.random() * playHeight,
          r: Math.random() * 2 + 1,
          s: Math.random() * 0.6 + 0.35
        });
      }

      farMountains.length = 0;
      let fx = 0;
      const farTemplates = [
        { w: 190, h: 155, snowRatio: 0.36 },
        { w: 225, h: 185, snowRatio: 0.38 },
        { w: 200, h: 145, snowRatio: 0.35 },
        { w: 215, h: 175, snowRatio: 0.37 },
        { w: 210, h: 160, snowRatio: 0.36 }
      ];
      let fi = 0;
      while (fx < W + 450) {
        const tpl = farTemplates[fi % farTemplates.length];
        farMountains.push({ x: fx, w: tpl.w, h: tpl.h, snowRatio: tpl.snowRatio });
        fx += tpl.w * 0.82;
        fi++;
      }
      farSpan = fx;

      nearMountains.length = 0;
      let nx = 15;
      const nearTemplates = [
        { w: 160, h: 112, snowRatio: 0.34 },
        { w: 180, h: 132, snowRatio: 0.36 },
        { w: 165, h: 102, snowRatio: 0.33 },
        { w: 175, h: 124, snowRatio: 0.35 },
        { w: 160, h: 108, snowRatio: 0.34 }
      ];
      let ni = 0;
      while (nx < W + 400) {
        const tpl = nearTemplates[ni % nearTemplates.length];
        nearMountains.push({ x: nx, w: tpl.w, h: tpl.h, snowRatio: tpl.snowRatio });
        nx += tpl.w * 0.84;
        ni++;
      }
      nearSpan = nx - 15;
    }

    function resize() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const aspect = vw / Math.max(1, vh);
      W = Math.max(320, Math.round(H * aspect));
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      muteBtn.x = W - 50;
      muteBtn.y = 14;

      initScenery();
    }

    window.addEventListener('resize', resize);
    resize();

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

      if (isBirthday) {
        const freq = bdayNotes[noteIndex % bdayNotes.length];
        noteIndex++;
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.11, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.28);
      } else {
        osc.frequency.setValueAtTime(987.77, now);
        osc.frequency.setValueAtTime(1318.51, now + 0.075);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.24);
      }
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

    let particles = [];
    let shakeT = 0, scorePop = 0, auroraT = 0;
    let groundOffset = 0;

    let y = 205, vel = 0, gravity = 0.36, jump = -6.5;
    let pipes = [], frame = 0, score = 0;
    let best = parseInt(localStorage.getItem('flappy_penguin_best') || '0', 10);
    let isNewBest = false;
    let gameOver = false, started = false, crashed = false;

    function getPenguinX() {
      return Math.max(68, Math.min(180, Math.round(W * 0.22)));
    }

    function spawnSnowBurst(bx, by, count) {
      for (let i = 0; i < count; i++) {
        const rgb = isBirthday
          ? confettiPalette[Math.floor(Math.random() * confettiPalette.length)]
          : '236, 239, 244';
        particles.push({
          x: bx,
          y: by,
          vx: (Math.random() - 0.5) * 4.5,
          vy: (Math.random() - 0.5) * 4.5 - 1,
          r: Math.random() * 2.5 + 1,
          life: 1.0,
          rgb: rgb
        });
      }
    }

    function reset() {
      y = 205; vel = 0; pipes = []; particles = [];
      frame = 0; score = 0; noteIndex = 0;
      gameOver = false; started = true; crashed = false; isNewBest = false;
      scorePop = 0; shakeT = 0;
      vel = jump;
      playFlapSound();
      spawnSnowBurst(getPenguinX() + 5, y + 18, 6);
    }

    function flap() {
      if (gameOver) {
        reset();
      } else if (!started) {
        reset();
      } else if (!crashed) {
        vel = jump;
        playFlapSound();
        spawnSnowBurst(getPenguinX() + 5, y + 18, 5);
      }
    }

    function triggerCrash(fromGround = false) {
      if (!crashed) {
        crashed = true;
        if (!reduceMotion) shakeT = 1;
        vel = fromGround ? 0 : -2.5;
        playCrashSound();
        spawnSnowBurst(getPenguinX() + 15, y + 14, 14);
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

      if (cx >= muteBtn.x - 8 && cx <= muteBtn.x + muteBtn.w + 8 &&
          cy >= muteBtn.y - 8 && cy <= muteBtn.y + muteBtn.h + 8) {
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
      } else if (e.code === 'Escape') {
        window.location.href = 'https://${domain}';
      }
    });
    canvas.addEventListener('mousedown', e => handlePointer(e.clientX, e.clientY));
    canvas.addEventListener('touchstart', e => {
      e.preventDefault();
      if (e.touches.length > 0) {
        handlePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: false });

    // Geliştirilmiş Aurora: 960px genişlik (tekrarı azaltır), dikey ışık perdeleri ve yumuşak alt geçiş
    const aurora = (() => {
      const AW = 960, AH = 240;
      const c = document.createElement('canvas');
      c.width = AW; c.height = AH;
      const g = c.getContext('2d');
      const green = [163, 190, 140], ice = [136, 192, 208], purple = [180, 142, 173];
      const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

      for (let x = 0; x < AW; x++) {
        const th = (x / AW) * Math.PI * 2;
        const base = 98 + Math.sin(th * 2) * 20 + Math.sin(th * 3 + 1.3) * 11 + Math.cos(th * 5 - 0.6) * 5;
        const len = 76 + Math.sin(th * 4 + 0.7) * 18 + Math.sin(th * 7) * 9;

        // Kuzey ışıklarına özgü dikey ışık huzmeleri (ray streaks)
        const rayPrimary = Math.pow((Math.sin(th * 19 + Math.sin(th * 3) * 1.4) + 1) / 2, 1.8);
        const raySecondary = Math.pow((Math.sin(th * 37 + 1.1) + 1) / 2, 2.2);
        const envelope = 0.5 + 0.5 * Math.sin(th * 2 + 0.4);
        const strength = (0.32 + 0.48 * rayPrimary + 0.2 * raySecondary) * (0.65 + 0.35 * envelope);

        let col = mix(green, ice, (Math.sin(th * 2 + 0.5) + 1) / 2);
        col = mix(col, purple, Math.max(0, Math.sin(th * 3 - 0.8)) * 0.72);
        const rgb = col.join(',');

        const top = Math.max(0, base - len);
        const total = len * 1.55;
        const grad = g.createLinearGradient(0, top, 0, top + total);
        grad.addColorStop(0, 'rgba(' + rgb + ',0)');
        grad.addColorStop(0.35, 'rgba(' + rgb + ',' + (0.22 * strength).toFixed(3) + ')');
        grad.addColorStop(0.68, 'rgba(' + rgb + ',' + (0.56 * strength).toFixed(3) + ')');
        grad.addColorStop(0.84, 'rgba(' + rgb + ',' + (0.18 * strength).toFixed(3) + ')');
        grad.addColorStop(1, 'rgba(' + rgb + ',0)');

        g.fillStyle = grad;
        g.fillRect(x, top, 1, total);
      }
      return { c, AW };
    })();

    function drawAurora() {
      const t = auroraT;
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      // 1. Ana perde katmanı
      ctx.globalAlpha = 0.78 + Math.sin(t * 0.011) * 0.14;
      let ox = -((t * 0.12) % aurora.AW);
      for (let x = ox; x < W; x += aurora.AW) {
        ctx.drawImage(aurora.c, x, 0);
      }

      // 2. Ters yönlü ikinci katman (perdelerin birbirinin içinden süzülme hissi verir)
      ctx.globalAlpha = 0.42 + Math.sin(t * 0.019 + 1.2) * 0.2;
      ctx.save();
      ctx.translate(W, 18);
      ctx.scale(-1, 0.88);
      ox = -((t * 0.075) % aurora.AW);
      for (let x = ox; x < W; x += aurora.AW) {
        ctx.drawImage(aurora.c, x, 0);
      }
      ctx.restore();

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
          if (m.x + m.w < 0) m.x += farSpan;
        }
        drawSnowyMountain(m, playHeight, '#2e3644', '#272e3a', '#aeb9c7', '#8f9cab');
      }

      for (const m of nearMountains) {
        if (started && !crashed) {
          m.x -= 0.55;
          if (m.x + m.w < 0) m.x += nearSpan;
        }
        drawSnowyMountain(m, playHeight, '#364052', '#2d3646', '#d8dee9', '#b8c3d1');
      }
    }

    function drawGround() {
      const gy = playHeight;
      ctx.save();

      ctx.fillStyle = '#3b4252';
      ctx.fillRect(0, gy, W, groundHeight);

      ctx.beginPath();
      ctx.rect(0, gy, W, groundHeight);
      ctx.clip();

      ctx.strokeStyle = 'rgba(136, 192, 208, 0.24)';
      ctx.lineWidth = 1;
      ctx.lineJoin = 'round';
      const cs = 72;
      const off = groundOffset % cs;
      for (let gx = -cs + off; gx < W + cs; gx += cs) {
        ctx.beginPath();
        ctx.moveTo(gx + 10, gy + 13);
        ctx.lineTo(gx + 22, gy + 18);
        ctx.lineTo(gx + 17, gy + 24);
        ctx.moveTo(gx + 22, gy + 18);
        ctx.lineTo(gx + 34, gy + 17);
        ctx.moveTo(gx + 52, gy + 14);
        ctx.lineTo(gx + 58, gy + 22);
        ctx.stroke();
      }

      ctx.fillStyle = '#81a1c1';
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(W, gy);
      ctx.lineTo(W, gy + 12);
      for (let x = W; x >= 0; x -= 6) {
        const ph = x - groundOffset;
        ctx.lineTo(x, gy + 9 + Math.sin(ph * 0.045) * 2.2 + Math.cos(ph * 0.11) * 1.1);
      }
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#eceff4';
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(W, gy);
      ctx.lineTo(W, gy + 8);
      for (let x = W; x >= 0; x -= 6) {
        const ph = x - groundOffset;
        ctx.lineTo(x, gy + 5.5 + Math.sin(ph * 0.045) * 2.0 + Math.cos(ph * 0.11) * 0.9);
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

      if (isBirthday) {
        ctx.save();
        ctx.translate(-1, -11);
        ctx.rotate(-0.15);

        ctx.fillStyle = '#ebcb8b';
        ctx.beginPath();
        ctx.moveTo(-6, 0);
        ctx.lineTo(6, 0);
        ctx.lineTo(0, -13);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#bf616a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-3.5, -5.5);
        ctx.lineTo(3.5, -5.5);
        ctx.stroke();

        ctx.fillStyle = '#eceff4';
        ctx.beginPath();
        ctx.arc(0, -14, 2.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
    }

    function drawIceBlockPipe(x, py, w, h, isTop) {
      if (h <= 0) return;
      const cx = x + w / 2;

      ctx.fillStyle = '#81a1c1';
      ctx.fillRect(x, py, w, h);
      ctx.fillStyle = '#5e81ac';
      ctx.fillRect(x + w - 10, py, 10, h);
      ctx.fillStyle = 'rgba(143, 188, 187, 0.65)';
      ctx.fillRect(x + 5, py, 6, h);
      ctx.fillStyle = 'rgba(236, 239, 244, 0.25)';
      ctx.fillRect(x + 14, py, 2, h);

      if (isTop) {
        const capH = Math.min(11, h);
        const capY = py + h - capH;
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x - 3, capY, w + 6, capH, [3, 3, 5, 5]);
        ctx.fillStyle = '#88c0d0';
        ctx.fill();
        ctx.clip();

        ctx.fillStyle = 'rgba(236, 239, 244, 0.45)';
        ctx.fillRect(x + 2, capY, 7, capH);

        ctx.fillStyle = '#5e81ac';
        ctx.fillRect(x + w - 10, capY, 13, capH);

        ctx.fillStyle = 'rgba(236, 239, 244, 0.35)';
        ctx.fillRect(x - 3, capY + capH - 2, w + 6, 2);
        ctx.restore();
      } else {
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

        const baseY = py + h;
        ctx.fillStyle = '#eceff4';
        ctx.beginPath();
        ctx.ellipse(x + 6, baseY + 1, 9, 4.5, 0, Math.PI, Math.PI * 2);
        ctx.ellipse(cx, baseY + 1, 14, 5.5, 0, Math.PI, Math.PI * 2);
        ctx.ellipse(x + w - 6, baseY + 1, 9, 4.5, 0, Math.PI, Math.PI * 2);
        ctx.fill();
      }
    }

    function hitsTopPipe(p, pX, py, pSize, pipeW) {
      return pX + pSize - 3 > p.x - 2 &&
             pX + 3 < p.x + pipeW + 2 &&
             py + 3 < p.top;
    }

    function drawMuteButton() {
      ctx.save();
      ctx.fillStyle = 'rgba(46, 52, 64, 0.72)';
      ctx.beginPath();
      ctx.roundRect(muteBtn.x, muteBtn.y, muteBtn.w, muteBtn.h, 8);
      ctx.fill();
      ctx.strokeStyle = 'rgba(216, 222, 233, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = muted ? '#bf616a' : '#eceff4';
      ctx.strokeStyle = muted ? '#bf616a' : '#eceff4';
      ctx.lineWidth = 1.8;

      const cx = muteBtn.x + 11;
      const cy = muteBtn.y + 18;
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

      const boxW = 148;
      const boxH = 38;
      const boxX = (W - boxW) / 2;
      const boxY = 264;

      ctx.fillStyle = 'rgba(59, 66, 82, 0.85)';
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, 8);
      ctx.fill();
      ctx.strokeStyle = 'rgba(136, 192, 208, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.fillStyle = '#88c0d0';
      ctx.font = '600 14px system-ui, sans-serif';
      ctx.fillText('Tap to Flap', W / 2, boxY + 24);

      ctx.restore();
    }

    function drawGameOverCard() {
      ctx.save();
      ctx.fillStyle = 'rgba(30, 34, 42, 0.52)';
      ctx.fillRect(0, 0, W, H);

      const cardW = 260;
      const cardH = 192;
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
      const innerH = 76;

      ctx.fillStyle = '#2e3440';
      ctx.beginPath();
      ctx.roundRect(innerX, innerY, innerW, innerH, 8);
      ctx.fill();

      ctx.fillStyle = '#aeb8c4';
      ctx.font = '600 11px system-ui, sans-serif';
      ctx.fillText('score', innerX + innerW * 0.27, innerY + 24);
      ctx.fillStyle = '#eceff4';
      ctx.font = '700 24px system-ui, sans-serif';
      ctx.fillText(score, innerX + innerW * 0.27, innerY + 55);

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
      ctx.fillText(best, innerX + innerW * 0.73, innerY + 55);

      if (isNewBest && score > 0) {
        ctx.fillStyle = '#bf616a';
        ctx.beginPath();
        ctx.roundRect(innerX + innerW - 42, innerY - 8, 36, 16, 4);
        ctx.fill();
        ctx.fillStyle = '#eceff4';
        ctx.font = '700 10px system-ui, sans-serif';
        ctx.fillText('new', innerX + innerW - 24, innerY + 3);
      }

      const btnW = 152;
      const btnH = 34;
      const btnX = (W - btnW) / 2;
      const btnY = cardY + 143;

      ctx.fillStyle = '#5e81ac';
      ctx.beginPath();
      ctx.roundRect(btnX, btnY, btnW, btnH, 6);
      ctx.fill();

      ctx.fillStyle = '#eceff4';
      ctx.font = '600 13px system-ui, sans-serif';
      ctx.fillText('Play Again', W / 2, btnY + 22);

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

      const speed = 2.6;
      const pipeSpacing = 240;
      const pX = getPenguinX();
      const pSize = 26, pipeW = 50;

      if (!started) {
        frame++;
        groundOffset -= 1.2;
        y = 205 + Math.sin(frame * 0.08) * 7;
      } else if (!crashed) {
        vel += gravity;
        y += vel;
        frame++;
        groundOffset -= speed;

        if (pipes.length === 0 || pipes[pipes.length - 1].x <= W - pipeSpacing) {
          let gap = 136;
          let minTop = 52;
          let maxTop = playHeight - gap - 52;
          let topH = Math.floor(Math.random() * (maxTop - minTop)) + minTop;
          pipes.push({ x: W + 20, top: topH, bottom: topH + gap, passed: false });
        }
      } else if (!gameOver) {
        vel += gravity * 1.15;
        y += vel;
        frame++;
      }

      drawGround();

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

      for (let i = particles.length - 1; i >= 0; i--) {
        let pt = particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life -= 0.04;
        if (pt.life <= 0) {
          particles.splice(i, 1);
        } else {
          ctx.fillStyle = 'rgba(' + (pt.rgb || '236, 239, 244') + ', ' + pt.life + ')';
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
        ctx.translate(W / 2, 54);
        const sc = 1 + 0.3 * scorePop;
        ctx.scale(sc, sc);
        ctx.fillStyle = '#eceff4';
        ctx.font = '700 36px system-ui, sans-serif';
        ctx.fillText(score, 0, 0);
        ctx.restore();

        ctx.save();
        ctx.textAlign = 'center';
        ctx.fillStyle = '#d8dee9';
        ctx.font = '600 13px system-ui, sans-serif';
        ctx.fillText('Best: ' + best, W / 2, 76);
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