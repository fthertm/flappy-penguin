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
  <link rel="icon" type="image/svg+xml" href="${icons}favicon.svg">
  <link rel="apple-touch-icon" href="${icons}apple-touch-icon.png">
  <link rel="shortcut icon" href="${icons}favicon.ico">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 100vw;
      height: 100dvh;
      overflow: hidden;
      background: #1e222a;
      user-select: none;
      -webkit-user-select: none;
      touch-action: none;
      overscroll-behavior: none;
    }
    canvas {
      display: block;
      width: 100vw;
      height: 100dvh;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <canvas id="game"></canvas>

  <script>
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');

    const H = 480;
    let W = 760;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const groundHeight = 28;
    const playHeight = H - groundHeight;

    let stars = [];
    let flakes = [];
    let farMountains = [];
    let nearMountains = [];
    let farSpan = 0;
    let nearSpan = 0;

    let safeTop = 0;
    let safeLeft = 0;
    let safeRight = 0;

    function getSafeInsets() {
      const probe = document.createElement('div');
      probe.style.cssText = 'position:fixed;top:env(safe-area-inset-top,0px);left:env(safe-area-inset-left,0px);right:env(safe-area-inset-right,0px);pointer-events:none;visibility:hidden;';
      document.body.appendChild(probe);
      const rect = probe.getBoundingClientRect();
      const vw = window.innerWidth || 1;
      const vh = window.innerHeight || 1;
      const scale = H / vh;
      safeTop = rect.top * scale;
      safeLeft = rect.left * scale;
      safeRight = Math.max(0, (vw - rect.right) * scale);
      document.body.removeChild(probe);
    }

    const backBtn = { x: 14, y: 14, w: 34, h: 34 };
    const muteBtn = { x: W - 48, y: 14, w: 34, h: 34 };

    function updateUIPositions() {
      const topY = Math.max(14, safeTop + 10);
      backBtn.x = Math.max(14, safeLeft + 12);
      backBtn.y = topY;
      muteBtn.x = W - muteBtn.w - Math.max(14, safeRight + 12);
      muteBtn.y = topY;
    }

    function initScenery() {
      const span = Math.max(W + 300, 960);

      const starCount = Math.max(24, Math.round((span / 760) * 34));
      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * span,
        y: Math.random() * 250,
        r: Math.random() * 1.1 + 0.4,
        a: Math.random() * 0.4 + 0.15
      }));

      const flakeCount = Math.max(32, Math.round((span / 760) * 48));
      flakes = Array.from({ length: flakeCount }, () => ({
        x: Math.random() * span,
        y: Math.random() * playHeight,
        r: Math.random() * 2 + 1,
        s: Math.random() * 0.6 + 0.35
      }));

      farMountains = [];
      let fx = 0;
      const farWidths = [180, 210, 190, 180, 200];
      const farHeights = [155, 188, 145, 175, 160];
      let fi = 0;
      while (fx < span) {
        const w = farWidths[fi % farWidths.length];
        const h = farHeights[fi % farHeights.length];
        farMountains.push({
          x: fx,
          w,
          h,
          snowRatio: 0.35 + (fi % 4) * 0.01
        });
        fx += w - 35;
        fi++;
      }
      farSpan = fx;

      nearMountains = [];
      let nx = 15;
      const nearWidths = [150, 170, 155, 165, 150];
      const nearHeights = [115, 135, 102, 128, 108];
      let ni = 0;
      while (nx < span) {
        const w = nearWidths[ni % nearWidths.length];
        const h = nearHeights[ni % nearHeights.length];
        nearMountains.push({
          x: nx,
          w,
          h,
          snowRatio: 0.33 + (ni % 4) * 0.01
        });
        nx += w - 25;
        ni++;
      }
      nearSpan = nx;
    }

    function getPenguinX() {
      return Math.max(68, Math.min(165, Math.round(W * 0.22)));
    }

    function resize() {
      const vw = window.innerWidth || 480;
      const vh = window.innerHeight || 480;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(260, Math.round(H * (vw / vh)));
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      getSafeInsets();
      updateUIPositions();
      if (farSpan < W + 220) {
        initScenery();
      }
    }

    resize();
    initScenery();
    window.addEventListener('resize', resize);

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

    let particles = [];
    let shakeT = 0, scorePop = 0, auroraT = 0;
    let groundOffset = 0;

    let y = 205, vel = 0, gravity = 0.36, jump = -6.5;
    let pipes = [], frame = 0, score = 0;
    let best = parseInt(localStorage.getItem('flappy_penguin_best') || '0', 10);
    let isNewBest = false;
    let gameOver = false, started = false, crashed = false;

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
      y = 205; vel = 0; pipes = []; particles = [];
      frame = 0; score = 0;
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

      if (cx >= backBtn.x - 6 && cx <= backBtn.x + backBtn.w + 6 &&
          cy >= backBtn.y - 6 && cy <= backBtn.y + backBtn.h + 6) {
        window.location.href = 'https://${domain}';
        return;
      }

      if (cx >= muteBtn.x - 6 && cx <= muteBtn.x + muteBtn.w + 6 &&
          cy >= muteBtn.y - 6 && cy <= muteBtn.y + muteBtn.h + 6) {
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

    const aurora = (() => {
      const AW = 480, AH = 200;
      const c = document.createElement('canvas');
      c.width = AW; c.height = AH;
      const g = c.getContext('2d');
      const green = [163, 190, 140], ice = [136, 192, 208], purple = [180, 142, 173];
      const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
      for (let x = 0; x < AW; x++) {
        const th = (x / AW) * Math.PI * 2;
        const base = 82 + Math.sin(th * 2) * 16 + Math.sin(th * 3 + 1.3) * 9;
        const len = 66 + Math.sin(th * 4 + 0.7) * 16 + Math.sin(th * 7) * 7;
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
      for (let x = ox; x < W + aurora.AW; x += aurora.AW) {
        ctx.drawImage(aurora.c, x, 0);
      }

      ctx.globalAlpha = 0.45 + Math.sin(t * 0.021 + 1) * 0.25;
      ctx.translate(W, 14);
      ctx.scale(-1, 0.85);
      ox = -((t * 0.06) % aurora.AW);
      for (let x = ox; x < W + aurora.AW; x += aurora.AW) {
        ctx.drawImage(aurora.c, x, 0);
      }
      ctx.restore();
    }

    function drawSnowyMountain(m, baseY, bodyColor, shadeColor, snowColor, snowShade) {
      if (m.x > W + 20 || m.x + m.w < -20) return;
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
        if (s.x > W + 5) continue;
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
        const capY = py + h - 11;
        ctx.fillStyle = '#88c0d0';
        ctx.beginPath();
        ctx.roundRect(x - 3, capY, w + 6, 11, [3, 3, 5, 5]);
        ctx.fill();
        ctx.fillStyle = '#5e81ac';
        ctx.beginPath();
        ctx.roundRect(x + w - 10, capY, 13, 11, [0, 3, 5, 0]);
        ctx.fill();
        ctx.fillStyle = 'rgba(236, 239, 244, 0.35)';
        ctx.fillRect(x - 1, capY + 2, w - 9, 2);
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

    function drawBackButton() {
      ctx.save();
      ctx.fillStyle = 'rgba(46, 52, 64, 0.72)';
      ctx.beginPath();
      ctx.roundRect(backBtn.x, backBtn.y, backBtn.w, backBtn.h, 8);
      ctx.fill();
      ctx.strokeStyle = 'rgba(216, 222, 233, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.strokeStyle = '#eceff4';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      const cx = backBtn.x + backBtn.w / 2;
      const cy = backBtn.y + backBtn.h / 2;
      ctx.beginPath();
      ctx.moveTo(cx + 5, cy);
      ctx.lineTo(cx - 5, cy);
      ctx.moveTo(cx - 1, cy - 4);
      ctx.lineTo(cx - 5, cy);
      ctx.lineTo(cx - 1, cy + 4);
      ctx.stroke();
      ctx.restore();
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

      const cx = muteBtn.x + 10;
      const cy = muteBtn.y + 17;
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

      const boxW = Math.min(180, W - 40);
      const boxH = 38;
      const boxX = (W - boxW) / 2;
      const boxY = 278;

      ctx.fillStyle = 'rgba(59, 66, 82, 0.85)';
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, 9);
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

      const cardW = Math.min(250, W - 32);
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

      const btnW = Math.min(146, innerW);
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

      const flakeSpan = Math.max(W + 100, 960);
      ctx.fillStyle = 'rgba(236, 239, 244, 0.35)';
      for (const f of flakes) {
        f.y += f.s;
        f.x -= 0.45;
        if (f.y > playHeight) { f.y = 0; f.x = Math.random() * flakeSpan; }
        if (f.x < 0) f.x += flakeSpan;
        if (f.x <= W + 5) {
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const speed = 2.6;
      const pX = getPenguinX();
      const pSize = 26;
      const pipeW = 50;
      const pipeSpacing = 250;

      if (!started) {
        frame++;
        groundOffset -= 1.2;
        y = 205 + Math.sin(frame * 0.08) * 7;
      } else if (!crashed) {
        vel += gravity;
        y += vel;
        frame++;
        groundOffset -= speed;

        if (pipes.length === 0 || (W + 20 - pipes[pipes.length - 1].x) >= pipeSpacing) {
          let gap = 132;
          let minTop = 54;
          let maxTop = playHeight - gap - 54;
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
        const scoreY = Math.max(54, safeTop + 46);
        ctx.save();
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(30, 34, 42, 0.85)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetY = 1;
        ctx.translate(W / 2, scoreY);
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
        ctx.fillText('Best: ' + best, W / 2, scoreY + 22);
        ctx.restore();
      }

      drawBackButton();
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
