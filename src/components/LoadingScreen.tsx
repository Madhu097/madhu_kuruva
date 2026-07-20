import { useEffect, useState, useRef } from 'react';

const BOOT_LINES = [
  'INITIALIZING NEURAL CORE...',
  'SYNCING AI MODULES...',
  'MAPPING SYNAPTIC NETWORK...',
  'LOADING COGNITIVE LAYERS...',
  'CALIBRATING THOUGHT ENGINE...',
  'NEURAL LINK ESTABLISHED...',
  'ENTERING THE DIGITAL MIND...',
];

const HEX_CHARS = '0123456789ABCDEF';

// ── Canvas AI World Background ─────────────────────────────────────────────────
function useAICanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    let raf: number;

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W;
      canvas.height = H;
    };
    resize();
    window.addEventListener('resize', resize);

    // ── Neural nodes ──────────────────────────────────────────────────────────
    const NODE_COUNT = Math.min(Math.floor((W * H) / 14000), 90);
    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      x:    Math.random() * W,
      y:    Math.random() * H,
      vx:   (Math.random() - 0.5) * 0.35,
      vy:   (Math.random() - 0.5) * 0.35,
      r:    Math.random() * 1.8 + 0.8,
      pulse: Math.random() * Math.PI * 2,
      pSpeed: Math.random() * 0.02 + 0.01,
    }));

    // ── Data stream columns ───────────────────────────────────────────────────
    const COL_W  = 20;
    const COLS   = Math.ceil(W / COL_W);
    const streams = Array.from({ length: COLS }, (_, i) => ({
      x:      i * COL_W + COL_W / 2,
      drops:  Array.from({ length: Math.ceil(H / 14) + 2 }, (__, j) => ({
        y:    -Math.random() * H,
        char: HEX_CHARS[Math.floor(Math.random() * 16)],
        life: Math.random(),
        speed: Math.random() * 0.4 + 0.15,
        alpha: Math.random() * 0.12 + 0.03,
      })),
    }));


    let gridOff = 0;

    const draw = () => {
      gridOff = (gridOff + 0.4) % 60;
      ctx.clearRect(0, 0, W, H);

      // ── Deep background ────────────────────────────────────────────────────
      const bg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.75);
      bg.addColorStop(0,   '#020d1a');
      bg.addColorStop(0.5, '#010a14');
      bg.addColorStop(1,   '#000508');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // ── Perspective grid ──────────────────────────────────────────────────
      const GRID_LINES = 18;
      const HORIZON    = H * 0.52;
      ctx.save();

      // Horizontal lines converging to horizon
      for (let i = 0; i <= GRID_LINES; i++) {
        const rawT = (i / GRID_LINES + gridOff / (GRID_LINES * 60)) % 1;
        const yPos = HORIZON + Math.pow(rawT, 1.8) * (H - HORIZON);
        const alpha = rawT * 0.08;
        ctx.strokeStyle = `rgba(10,132,255,${alpha.toFixed(3)})`;
        ctx.lineWidth   = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, yPos);
        ctx.lineTo(W, yPos);
        ctx.stroke();
      }

      // Vertical lines fanning from vanishing point
      const VP_X = W / 2;
      const FAN  = 22;
      for (let i = -FAN; i <= FAN; i++) {
        const spread = (i / FAN) * (W * 0.8);
        const alpha  = (1 - Math.abs(i / FAN) * 0.7) * 0.05;
        ctx.strokeStyle = `rgba(10,132,255,${alpha.toFixed(3)})`;
        ctx.lineWidth   = 0.5;
        ctx.beginPath();
        ctx.moveTo(VP_X, HORIZON);
        ctx.lineTo(VP_X + spread, H);
        ctx.stroke();
      }
      ctx.restore();

      // ── Data streams (hex rain) ────────────────────────────────────────────
      ctx.font = '11px monospace';
      streams.forEach(col => {
        col.drops.forEach(drop => {
          drop.y += drop.speed * 1.6;
          drop.life += 0.015;
          if (drop.y > H + 14) {
            drop.y    = -14;
            drop.char = HEX_CHARS[Math.floor(Math.random() * 16)];
            drop.life = 0;
          }
          if (Math.random() < 0.04) drop.char = HEX_CHARS[Math.floor(Math.random() * 16)];

          const alpha = drop.alpha * Math.max(0, Math.sin(drop.life * Math.PI));
          if (alpha < 0.005) return;
          ctx.fillStyle = `rgba(10,132,255,${alpha.toFixed(3)})`;
          ctx.fillText(drop.char, col.x, drop.y);
        });
      });

      // ── Neural edges ───────────────────────────────────────────────────────
      const EDGE_DIST = Math.min(W, H) * 0.22;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx   = nodes[i].x - nodes[j].x;
          const dy   = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > EDGE_DIST) continue;
          const alpha = (1 - dist / EDGE_DIST) * 0.18;
          ctx.strokeStyle = `rgba(10,132,255,${alpha.toFixed(3)})`;
          ctx.lineWidth   = 0.6;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }

      // ── Neural nodes ───────────────────────────────────────────────────────
      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        n.pulse += n.pSpeed;

        const glow   = n.r * (2.5 + Math.sin(n.pulse) * 1.2);
        const alpha  = 0.55 + Math.sin(n.pulse) * 0.3;
        const grad   = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glow);
        grad.addColorStop(0,   `rgba(10,132,255,${alpha.toFixed(2)})`);
        grad.addColorStop(0.4, `rgba(64,156,255,${(alpha * 0.3).toFixed(2)})`);
        grad.addColorStop(1,   'rgba(10,132,255,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(n.x, n.y, glow, 0, Math.PI * 2);
        ctx.fill();

        // solid core dot
        ctx.fillStyle = `rgba(180,220,255,${(alpha * 0.9).toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 0.6, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);
}

// ─────────────────────────────────────────────────────────────────────────────
export default function LoadingScreen() {
  const [phase, setPhase]     = useState<'loading' | 'reveal' | 'done'>('loading');
  const [progress, setProgress] = useState(0);
  const [bootLine, setBootLine] = useState(0);
  const [glitch,  setGlitch]  = useState(false);
  const resolvedRef = useRef(false);
  const targetRef   = useRef({ value: 5 });
  const canvasRef   = useRef<HTMLCanvasElement>(null);

  useAICanvas(canvasRef);

  // ── Real resource tracking ─────────────────────────────────────────────────
  useEffect(() => {
    let current = 0;
    let rafId: number;

    const animateToTarget = () => {
      if (current < targetRef.current.value) {
        const speed = targetRef.current.value >= 100 ? 1.8 : 0.6;
        current = Math.min(current + speed, targetRef.current.value);
        setProgress(Math.floor(current));
      }
      if (!resolvedRef.current || current < 100) rafId = requestAnimationFrame(animateToTarget);
    };
    rafId = requestAnimationFrame(animateToTarget);

    const finish = () => {
      if (resolvedRef.current) return;
      resolvedRef.current = true;
      targetRef.current.value = 100;
    };

    const onDOMReady = () => { targetRef.current.value = Math.max(targetRef.current.value, 25); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onDOMReady, { once: true });
    else onDOMReady();

    const collectResources = () => {
      const imgs   = Array.from(document.querySelectorAll('img'));
      const videos = Array.from(document.querySelectorAll('video'));
      const total  = imgs.length + videos.length;
      if (total === 0) { targetRef.current.value = Math.max(targetRef.current.value, 85); return; }
      let loaded = 0;
      const onLoad = () => {
        loaded++;
        targetRef.current.value = Math.max(targetRef.current.value, 25 + Math.floor((loaded / total) * 60));
      };
      imgs.forEach(img => {
        if (img.complete) onLoad();
        else { img.addEventListener('load', onLoad, { once: true }); img.addEventListener('error', onLoad, { once: true }); }
      });
      videos.forEach(v => {
        if (v.readyState >= 3) onLoad();
        else { v.addEventListener('canplay', onLoad, { once: true }); v.addEventListener('error', onLoad, { once: true }); }
      });
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', collectResources, { once: true });
    else collectResources();

    const onWindowLoad = () => {
      targetRef.current.value = Math.max(targetRef.current.value, 95);
      setTimeout(() => { targetRef.current.value = 100; finish(); }, 350);
    };
    if (document.readyState === 'complete') onWindowLoad();
    else window.addEventListener('load', onWindowLoad, { once: true });

    const cap = setTimeout(finish, 9000);
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(cap);
      document.removeEventListener('DOMContentLoaded', onDOMReady);
      document.removeEventListener('DOMContentLoaded', collectResources);
      window.removeEventListener('load', onWindowLoad);
    };
  }, []);

  // ── Boot text ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => setBootLine(l => Math.min(l + 1, BOOT_LINES.length - 1)), 350);
    return () => clearInterval(id);
  }, []);

  // ── Glitch pulse ──────────────────────────────────────────────────────────
  useEffect(() => {
    const fire = () => { setGlitch(true); setTimeout(() => setGlitch(false), 130); };
    const id = setInterval(fire, 3200);
    return () => clearInterval(id);
  }, []);

  // ── Reveal at 100% ────────────────────────────────────────────────────────
  useEffect(() => {
    if (progress >= 100 && phase === 'loading') {
      const t1 = setTimeout(() => setPhase('reveal'), 500);
      const t2 = setTimeout(() => setPhase('done'), 1250);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [progress, phase]);

  if (phase === 'done') return null;

  return (
    <>
      <style>{`
        .ls-root {
          position: fixed; inset: 0; z-index: 9999;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          overflow: hidden;
          transition: opacity 0.7s cubic-bezier(0.4,0,0.2,1), visibility 0.7s;
        }
        .ls-root.reveal { opacity: 0; visibility: hidden; }

        /* ── Canvas bg ── */
        .ls-canvas {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          display: block;
          will-change: contents;
        }

        /* ── CSS scanlines overlay (replaces per-frame fillRect loop) ── */
        .ls-scanlines {
          position: absolute; inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent, transparent 2px,
            rgba(0,0,0,0.055) 2px, rgba(0,0,0,0.055) 3px
          );
          pointer-events: none; z-index: 3;
        }

        /* ── CSS vignette (replaces per-frame radial gradient) ── */
        .ls-vignette {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,8,0.72) 100%);
          pointer-events: none; z-index: 4;
        }

        /* ── HUD corners ── */
        .ls-hud {
          position: absolute; inset: 0; pointer-events: none; z-index: 5;
        }
        .ls-corner-svg {
          position: absolute;
          width: 48px; height: 48px;
          opacity: 0.55;
        }
        .ls-corner-svg.tl { top: 18px; left: 18px; }
        .ls-corner-svg.tr { top: 18px; right: 18px; transform: scaleX(-1); }
        .ls-corner-svg.bl { bottom: 18px; left: 18px; transform: scaleY(-1); }
        .ls-corner-svg.br { bottom: 18px; right: 18px; transform: scale(-1,-1); }

        /* side metrics */
        .ls-side-txt {
          position: absolute;
          font-family: monospace;
          font-size: 0.5rem;
          letter-spacing: 0.18em;
          color: rgba(10,132,255,0.35);
          text-transform: uppercase;
          writing-mode: vertical-rl;
        }
        .ls-side-txt.left  { left: 22px; top: 50%; transform: translateY(-50%); }
        .ls-side-txt.right { right: 22px; top: 50%; transform: translateY(-50%) rotate(180deg); }

        /* ── Central content ── */
        .ls-content {
          position: relative; z-index: 10;
          display: flex; flex-direction: column;
          align-items: center;
        }

        /* ── Orbital rings ── */
        .ls-rings {
          position: relative;
          width: 140px; height: 140px;
          margin-bottom: 2.2rem;
          flex-shrink: 0;
        }
        .ls-rings svg {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
        }
        .ls-r1 { animation: ls-spin  2.8s linear infinite; transform-origin: center; }
        .ls-r2 { animation: ls-spinr 1.9s linear infinite; transform-origin: center; }
        .ls-r3 { animation: ls-spin  4.5s linear infinite; transform-origin: center; }
        @keyframes ls-spin  { to { transform: rotate( 360deg); } }
        @keyframes ls-spinr { to { transform: rotate(-360deg); } }

        .ls-core {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          flex-direction: column;
        }
        .ls-monogram {
          font-family: 'Playfair Display', serif;
          font-size: 2.1rem; font-weight: 700;
          color: #fff;
          text-shadow: 0 0 24px rgba(10,132,255,0.9), 0 0 60px rgba(10,132,255,0.4);
          line-height: 1;
        }
        .ls-monogram-sub {
          font-family: monospace;
          font-size: 0.42rem;
          letter-spacing: 0.35em;
          color: rgba(10,132,255,0.65);
          text-transform: uppercase;
          margin-top: 3px;
        }

        /* ── Name + tagline ── */
        .ls-name {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.5rem, 3.5vw, 2.4rem);
          font-weight: 700; color: #fff;
          letter-spacing: 0.22em; text-transform: uppercase;
          opacity: 0;
          animation: ls-rise 0.8s 0.25s cubic-bezier(0.22,1,0.36,1) forwards;
          text-shadow: 0 0 36px rgba(10,132,255,0.55);
          position: relative; display: inline-block;
        }
        .ls-name.glitch::before, .ls-name.glitch::after {
          content: attr(data-text);
          position: absolute; inset: 0;
          font: inherit; letter-spacing: inherit; text-transform: inherit;
        }
        .ls-name.glitch::before {
          color: rgba(0,220,255,0.8);
          clip-path: polygon(0 20%,100% 20%,100% 45%,0 45%);
          animation: ls-ga 0.13s steps(2) forwards;
        }
        .ls-name.glitch::after {
          color: rgba(255,40,90,0.7);
          clip-path: polygon(0 60%,100% 60%,100% 82%,0 82%);
          animation: ls-gb 0.13s steps(2) forwards;
        }
        @keyframes ls-ga {
          0%  { transform: translate(-4px,0) skewX(-3deg); }
          50% { transform: translate(3px,0) skewX(4deg); }
          100%{ transform: translate(0,0); }
        }
        @keyframes ls-gb {
          0%  { transform: translate(4px,0) skewX(3deg); }
          50% { transform: translate(-3px,0) skewX(-4deg); }
          100%{ transform: translate(0,0); }
        }

        .ls-tagline {
          font-family: monospace;
          font-size: clamp(0.5rem,1.1vw,0.65rem);
          color: rgba(10,132,255,0.65);
          letter-spacing: 0.5em; text-transform: uppercase;
          margin-top: 0.4em;
          opacity: 0;
          animation: ls-rise 0.7s 0.5s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        @keyframes ls-rise {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }

        /* ── Boot text ── */
        .ls-boot {
          margin-top: 1.8rem;
          font-family: monospace;
          font-size: 0.58rem;
          color: rgba(10,132,255,0.48);
          letter-spacing: 0.2em; text-transform: uppercase;
          display: flex; align-items: center; gap: 0.5em;
          min-height: 1em;
        }
        .ls-cursor {
          display: inline-block; width: 5px; height: 0.65em;
          background: rgba(10,132,255,0.7);
          animation: ls-blink 0.85s steps(1) infinite;
          margin-left: 2px; vertical-align: middle;
        }
        @keyframes ls-blink { 0%,49%{opacity:1;} 50%,100%{opacity:0;} }

        /* ── Progress ── */
        .ls-progress {
          margin-top: 1.6rem;
          width: clamp(220px,32vw,380px);
          position: relative;
        }
        .ls-bar-bg {
          position: relative;
          height: 3px;
          background: rgba(10,132,255,0.08);
          border-radius: 0;
          overflow: visible;
        }
        /* tick marks */
        .ls-bar-bg::before {
          content: '';
          position: absolute; bottom: -6px; left: 0; right: 0;
          height: 1px;
          background: repeating-linear-gradient(
            90deg,
            rgba(10,132,255,0.2) 0px, rgba(10,132,255,0.2) 1px,
            transparent 1px, transparent 10%
          );
        }
        .ls-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #0550cc, #0A84FF, #40c4ff, #0A84FF);
          background-size: 300% 100%;
          animation: ls-shimmer 2s linear infinite;
          box-shadow: 0 0 8px rgba(10,132,255,0.8), 0 0 20px rgba(10,132,255,0.4), 0 0 40px rgba(10,132,255,0.15);
          transition: width 0.1s linear;
          position: relative;
        }
        /* leading edge glow dot */
        .ls-bar-fill::after {
          content: '';
          position: absolute; right: -2px; top: 50%;
          transform: translateY(-50%);
          width: 5px; height: 5px; border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 6px rgba(10,132,255,1), 0 0 14px rgba(10,132,255,0.7);
        }
        @keyframes ls-shimmer {
          from { background-position: 300% 0; }
          to   { background-position: -300% 0; }
        }
        .ls-bar-blur {
          position: absolute; top: 50%; transform: translateY(-50%);
          height: 10px; border-radius: 99px;
          background: rgba(10,132,255,0.2);
          filter: blur(6px); pointer-events: none;
          transition: width 0.1s linear;
        }
        .ls-meta {
          display: flex; justify-content: space-between; align-items: center;
          margin-top: 0.55rem;
        }
        .ls-label {
          font-family: monospace; font-size: 0.55rem;
          color: rgba(10,132,255,0.45); letter-spacing: 0.22em; text-transform: uppercase;
        }
        .ls-num {
          font-family: monospace; font-size: 0.7rem;
          color: rgba(10,132,255,0.75); letter-spacing: 0.12em;
          font-variant-numeric: tabular-nums;
        }
      `}</style>

      <div className={`ls-root${phase === 'reveal' ? ' reveal' : ''}`}>

        {/* AI World Canvas */}
        <canvas ref={canvasRef} className="ls-canvas" />
        {/* CSS overlays — cheaper than per-frame canvas draws */}
        <div className="ls-scanlines" />
        <div className="ls-vignette" />

        {/* HUD chrome */}
        <div className="ls-hud">
          {(['tl','tr','bl','br'] as const).map(pos => (
            <svg key={pos} className={`ls-corner-svg ${pos}`} viewBox="0 0 48 48" fill="none">
              <path d="M2 18 L2 2 L18 2"   stroke="rgba(10,132,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M2 8  L2 2 L8 2"    stroke="rgba(10,132,255,0.4)" strokeWidth="0.8" strokeLinecap="round"/>
              <circle cx="2" cy="2" r="1.5" fill="rgba(10,132,255,0.6)" />
            </svg>
          ))}
          <div className="ls-side-txt left">NEURAL · CORE · v2.4.1 · AI · WORLD</div>
          <div className="ls-side-txt right">SYN · LINK · ACTIVE · NODE · 0x4F2A</div>
        </div>

        {/* Central content */}
        <div className="ls-content">

          {/* Orbital rings */}
          <div className="ls-rings">
            {/* Outer ring */}
            <svg viewBox="0 0 100 100" fill="none" className="ls-r1">
              <circle cx="50" cy="50" r="47" stroke="rgba(10,132,255,0.10)" strokeWidth="0.8"/>
              <circle cx="50" cy="50" r="47" stroke="url(#g1)" strokeWidth="1.4"
                strokeLinecap="round" strokeDasharray="70 226"/>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%"   stopColor="#0A84FF"/>
                  <stop offset="60%"  stopColor="#40c4ff"/>
                  <stop offset="100%" stopColor="#0A84FF" stopOpacity="0"/>
                </linearGradient>
              </defs>
            </svg>
            {/* Mid ring */}
            <svg viewBox="0 0 100 100" fill="none" className="ls-r2" style={{position:'absolute',inset:0}}>
              <circle cx="50" cy="50" r="38" stroke="rgba(10,132,255,0.07)" strokeWidth="0.7"/>
              <circle cx="50" cy="50" r="38" stroke="url(#g2)" strokeWidth="1"
                strokeLinecap="round" strokeDasharray="35 205"/>
              <defs>
                <linearGradient id="g2" x1="1" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#40c4ff"/>
                  <stop offset="100%" stopColor="#0A84FF" stopOpacity="0"/>
                </linearGradient>
              </defs>
            </svg>
            {/* Inner dotted ring */}
            <svg viewBox="0 0 100 100" fill="none" className="ls-r3" style={{position:'absolute',inset:0}}>
              <circle cx="50" cy="50" r="27" stroke="rgba(10,132,255,0.18)" strokeWidth="0.6"
                strokeDasharray="3 7"/>
            </svg>
            {/* Core */}
            <div className="ls-core">
              <div className="ls-monogram">MK</div>
              <div className="ls-monogram-sub">AI · NODE</div>
            </div>
          </div>

          {/* Name */}
          <div
            className={`ls-name${glitch ? ' glitch' : ''}`}
            data-text="MADHU KURUVA"
          >
            MADHU KURUVA
          </div>
          <div className="ls-tagline">Full Stack Developer · AI Enthusiast</div>

          {/* Boot log */}
          <div className="ls-boot">
            {BOOT_LINES[bootLine]}
            <span className="ls-cursor"/>
          </div>

          {/* Progress */}
          <div className="ls-progress">
            <div className="ls-bar-bg">
              <div className="ls-bar-fill" style={{width:`${progress}%`}}/>
            </div>
            <div className="ls-bar-blur" style={{width:`${progress}%`}}/>
            <div className="ls-meta">
              <span className="ls-label">SYNCING NEURAL ASSETS</span>
              <span className="ls-num">{String(progress).padStart(3,'0')}%</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
