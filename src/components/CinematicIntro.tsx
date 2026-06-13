import { useEffect, useRef, useCallback } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────
const TOTAL_FRAMES = 192;
const SCROLL_VH = 420; // wrapper height in vh

const TEXT_SEQUENCE = [
  { text: 'Madhu Kuruva', sub: '', start: 0.02, end: 0.16 },
  { text: 'Creative Developer', sub: '', start: 0.19, end: 0.33 },
  { text: 'Immersive Digital', sub: 'Experiences', start: 0.36, end: 0.50 },
  { text: 'Interactive Experiences', sub: '', start: 0.53, end: 0.64 },
  { text: 'Motion Design', sub: '', start: 0.67, end: 0.76 },
  { text: 'Creative Technology', sub: '', start: 0.79, end: 0.87 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut3 = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut4 = (t: number) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

// ─── Main component ───────────────────────────────────────────────────────────
export default function CinematicIntro() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  // Frame store
  const framesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const loadedRef = useRef<boolean[]>(new Array(TOTAL_FRAMES).fill(false));

  // Animation state
  const smoothPRef = useRef(0);
  const lastDrawnRef = useRef(-1);   // index of last *successfully* drawn frame
  const dirtyRef = useRef(true); // always redraw when images arrive

  // DOM refs for rAF-driven updates (no React re-renders)
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const welcomeRef = useRef<HTMLDivElement>(null);

  // ── Preload frames ──────────────────────────────────────────────────────────
  useEffect(() => {
    const frames = new Array<HTMLImageElement | null>(TOTAL_FRAMES).fill(null);
    const loaded = new Array<boolean>(TOTAL_FRAMES).fill(false);

    const loadOne = (i: number) => {
      const img = new Image();
      img.src = `/frames/frame_${String(i).padStart(6, '0')}.png`;
      img.onload = () => {
        loaded[i] = true;
        dirtyRef.current = true; // signal rAF to redraw
      };
      img.onerror = () => { loaded[i] = true; };
      frames[i] = img;
    };

    // First 15 frames immediately
    for (let i = 0; i < Math.min(15, TOTAL_FRAMES); i++) loadOne(i);

    // Rest in batches
    let cursor = 15;
    const batch = () => {
      const end = Math.min(cursor + 25, TOTAL_FRAMES);
      for (let i = cursor; i < end; i++) loadOne(i);
      cursor = end;
      if (cursor < TOTAL_FRAMES) setTimeout(batch, 80);
    };
    setTimeout(batch, 250);

    framesRef.current = frames;
    loadedRef.current = loaded;
  }, []);

  // ── Canvas: always CSS-pixel sized (no DPR complexity) ─────────────────────
  const resizeCanvas = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    lastDrawnRef.current = -1; // must redraw after resize
    dirtyRef.current = true;
  }, []);

  // ── Draw one frame + overlays onto canvas ───────────────────────────────────
  const drawFrame = useCallback((frameIdx: number, p: number): boolean => {
    const canvas = canvasRef.current;
    if (!canvas) return false;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    // Resolve best available image (walk back if not yet loaded)
    let img: HTMLImageElement | null = null;
    let searchIdx = frameIdx;
    while (searchIdx >= 0) {
      const candidate = framesRef.current[searchIdx];
      if (candidate && loadedRef.current[searchIdx]) { img = candidate; break; }
      searchIdx--;
    }
    if (!img) return false; // nothing loaded yet

    const W = canvas.width;
    const H = canvas.height;

    // cover-fit
    const iW = img.naturalWidth || 1920;
    const iH = img.naturalHeight || 1080;
    const scale = Math.max(W / iW, H / iH);
    const dW = iW * scale;
    const dH = iH * scale;
    const dX = (W - dW) / 2;
    const dY = (H - dH) / 2;

    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(img, dX, dY, dW, dH);

    // top dark gradient
    const tg = ctx.createLinearGradient(0, 0, 0, H * 0.30);
    tg.addColorStop(0, 'rgba(8,8,16,0.92)');
    tg.addColorStop(1, 'rgba(8,8,16,0)');
    ctx.fillStyle = tg;
    ctx.fillRect(0, 0, W, H);

    // bottom dark gradient
    const bg = ctx.createLinearGradient(0, H * 0.55, 0, H);
    bg.addColorStop(0, 'rgba(8,8,16,0)');
    bg.addColorStop(1, 'rgba(8,8,16,0.94)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // radial vignette
    const vr = Math.max(W, H) * 0.9;
    const vg = ctx.createRadialGradient(W / 2, H / 2, vr * 0.35, W / 2, H / 2, vr);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, `rgba(0,0,0,${lerp(0.62, 0.28, easeInOut4(clamp(p * 1.3, 0, 1)))})`);
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);

    // bloom near end
    if (p > 0.76) {
      const bt = clamp((p - 0.76) / 0.24, 0, 1);
      const bl = ctx.createRadialGradient(W / 2, H * 0.42, 0, W / 2, H * 0.42, Math.max(W, H) * 0.75);
      bl.addColorStop(0, `rgba(200,220,255,${bt * 0.22})`);
      bl.addColorStop(0.4, `rgba(100,155,255,${bt * 0.09})`);
      bl.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = bl;
      ctx.fillRect(0, 0, W, H);
    }

    // fog band
    const fo = lerp(0.15, 0.03, easeOut3(clamp(p * 1.6, 0, 1)));
    const fg = ctx.createLinearGradient(0, H * 0.57, 0, H * 0.82);
    fg.addColorStop(0, `rgba(22,32,70,0)`);
    fg.addColorStop(0.5, `rgba(22,32,70,${fo})`);
    fg.addColorStop(1, `rgba(22,32,70,0)`);
    ctx.fillStyle = fg;
    ctx.fillRect(0, 0, W, H);

    return true; // draw succeeded
  }, []);

  // ── rAF loop ────────────────────────────────────────────────────────────────
  const tick = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) { rafRef.current = requestAnimationFrame(tick); return; }

    const rect = wrapper.getBoundingClientRect();
    const wrapH = wrapper.offsetHeight;
    const scrolled = clamp(-rect.top, 0, wrapH - window.innerHeight);
    const rawP = scrolled / (wrapH - window.innerHeight);

    // gentle lerp for buttery motion
    smoothPRef.current = lerp(smoothPRef.current, rawP, 0.16);
    const p = smoothPRef.current;

    // target frame
    const frameIdx = Math.min(Math.floor(p * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1);

    // Draw when frame changed OR when a new image just loaded (dirty flag)
    if (frameIdx !== lastDrawnRef.current || dirtyRef.current) {
      const ok = drawFrame(frameIdx, p);
      if (ok) {
        lastDrawnRef.current = frameIdx;
        dirtyRef.current = false;
      }
      // if !ok, keep dirty=true so we retry next frame
    }

    // ── Text panels ───────────────────────────────────────────────────────────
    const RISE = 0.022;
    const FADE = 0.022;

    TEXT_SEQUENCE.forEach((seg, i) => {
      const panel = panelRefs.current[i];
      if (!panel) return;

      const rEnd = seg.start + RISE;
      const fSt = seg.end - FADE;

      let op = 0, ty = 0, sc = 1, bl = 0;

      if (p < seg.start) {
        op = 0; ty = 30; sc = 0.96; bl = 7;
      } else if (p < rEnd) {
        const t = easeOut3((p - seg.start) / RISE);
        op = t; ty = lerp(30, 0, t); sc = lerp(0.96, 1, t); bl = lerp(7, 0, t);
      } else if (p < fSt) {
        op = 1; ty = 0; sc = 1; bl = 0;
      } else if (p < seg.end) {
        const t = easeInOut4((p - fSt) / FADE);
        op = 1 - t; ty = lerp(0, -20, t); sc = lerp(1, 1.03, t); bl = lerp(0, 5, t);
      } else {
        op = 0; ty = -20; sc = 1.03; bl = 5;
      }

      panel.style.opacity = String(op.toFixed(4));
      panel.style.transform = `translateY(${ty.toFixed(2)}px) scale(${sc.toFixed(4)})`;
      panel.style.filter = bl > 0.05 ? `blur(${bl.toFixed(2)}px)` : 'none';
    });

    // ── Welcome panel ─────────────────────────────────────────────────────────
    const wEl = welcomeRef.current;
    if (wEl) {
      const SHOW = 0.88;
      if (p >= SHOW) {
        const t = easeOut3(clamp((p - SHOW) / 0.08, 0, 1));
        wEl.style.opacity = t.toFixed(4);
        wEl.style.transform = `translateY(${lerp(30, 0, t).toFixed(2)}px)`;
        wEl.style.filter = `blur(${lerp(8, 0, t).toFixed(2)}px)`;
      } else {
        wEl.style.opacity = '0';
        wEl.style.transform = 'translateY(30px)';
        wEl.style.filter = 'blur(8px)';
      }
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [drawFrame]);

  // ── Mount / unmount ─────────────────────────────────────────────────────────
  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [resizeCanvas, tick]);

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        /* ═══════════════════ Cinematic Intro ══════════════════════ */
        .ci-wrap {
          position: relative;
          height: ${SCROLL_VH}vh;
          background: #08080f;
        }

        /* Sticky viewport lock */
        .ci-sticky {
          position: sticky;
          top: 0;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: #08080f;
        }

        /* Canvas: always exact viewport size, pixel perfect */
        .ci-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: block;
        }

        /* Decorative soft lens flares */
        .ci-flare {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          mix-blend-mode: screen;
        }

        /* ── Text panels — bottom anchored ─────────────────────── */
        .ci-panel {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 0 6vw 7vh;
          z-index: 15;
          pointer-events: none;
          will-change: opacity, transform, filter;
          opacity: 0;
          transform: translateY(30px);
          filter: blur(7px);
        }

        .ci-panel-h {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: clamp(2.6rem, 6vw, 6.5rem);
          color: #ffffff;
          line-height: 1.06;
          letter-spacing: -0.025em;
          margin: 0;
          text-shadow:
            0 0  70px rgba(100,155,255,0.50),
            0 2px 30px rgba(0,0,0,0.98),
            0 4px  8px rgba(0,0,0,0.90);
        }

        .ci-panel-sub {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 300;
          font-size: clamp(1rem, 2.2vw, 2rem);
          color: rgba(135,215,255,0.90);
          letter-spacing: 0.28em;
          text-transform: uppercase;
          margin: 0.4em 0 0;
          text-shadow:
            0 0 28px rgba(80,175,255,0.55),
            0 2px  8px rgba(0,0,0,0.92);
        }

        .ci-panel-rule {
          display: block;
          width: 110px;
          height: 1.5px;
          margin: 1em 0 0;
          background: linear-gradient(
            90deg,
            rgba(120,200,255,0.75),
            rgba(180,120,255,0.55),
            transparent
          );
          border: none;
          outline: none;
        }

        /* ── Welcome / final statement ─────────────────────────── */
        .ci-welcome {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 0 6vw 7vh;
          z-index: 15;
          pointer-events: none;
          will-change: opacity, transform, filter;
          opacity: 0;
          transform: translateY(30px);
          filter: blur(8px);
        }

        .ci-welcome-h {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: clamp(2rem, 4.8vw, 5rem);
          color: #ffffff;
          letter-spacing: -0.025em;
          line-height: 1.10;
          margin: 0;
          text-shadow:
            0 0  90px rgba(160,205,255,0.55),
            0 2px 40px rgba(0,0,0,0.98);
        }

        .ci-welcome-cap {
          display: inline-block;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(0.65rem, 1.4vw, 0.85rem);
          color: rgba(130,215,255,0.68);
          letter-spacing: 0.46em;
          text-transform: uppercase;
          margin-top: 1.5em;
          animation: ci-bounce 2.4s ease-in-out infinite;
        }

        @keyframes ci-bounce {
          0%,100% { opacity: 0.48; transform: translateY(0);   }
          50%      { opacity: 1.00; transform: translateY(6px); }
        }

        /* ── Drifting fog (CSS layer on top of canvas) ─────────── */
        .ci-fog {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 6;
        }
        .ci-fog::before {
          content: '';
          position: absolute;
          bottom: 0; left: -14%; right: -14%;
          height: 42%;
          background: radial-gradient(
            ellipse 140% 65% at 50% 110%,
            rgba(15,24,60,0.48) 0%,
            transparent 70%
          );
          animation: ci-fog-drift 22s ease-in-out infinite;
        }
        @keyframes ci-fog-drift {
          0%   { transform: translateX(-12%) scaleX(1.10); }
          50%  { transform: translateX(12%)  scaleX(0.91); }
          100% { transform: translateX(-12%) scaleX(1.10); }
        }

      `}</style>

      {/* ══════════════════ 420vh scroll wrapper ══════════════════ */}
      <div ref={wrapperRef} className="ci-wrap" aria-hidden="true">
        <div className="ci-sticky">

          {/* Canvas — fills sticky, redrawn per frame */}
          <canvas ref={canvasRef} className="ci-canvas" />

          {/* Fog atmosphere CSS layer */}
          <div className="ci-fog" />

          {/* Soft lens flares */}
          <div className="ci-flare" style={{
            width: 220, height: 220, top: '12%', left: '6%',
            background: 'radial-gradient(circle, rgba(65,118,255,0.10) 0%, transparent 72%)',
          }} />
          <div className="ci-flare" style={{
            width: 150, height: 150, top: '58%', right: '8%',
            background: 'radial-gradient(circle, rgba(168,85,255,0.08) 0%, transparent 72%)',
          }} />
          <div className="ci-flare" style={{
            width: 80, height: 80, top: '26%', right: '16%',
            background: 'radial-gradient(circle, rgba(125,215,255,0.12) 0%, transparent 72%)',
          }} />

          {/* Text panels — bottom-anchored, driven by rAF */}
          {TEXT_SEQUENCE.map((seg, i) => (
            <div
              key={i}
              ref={el => { panelRefs.current[i] = el; }}
              className="ci-panel"
            >
              <h2 className="ci-panel-h">{seg.text}</h2>
              {seg.sub && <p className="ci-panel-sub">{seg.sub}</p>}
              <hr className="ci-panel-rule" />
            </div>
          ))}

          {/* Welcome / final statement */}
          <div ref={welcomeRef} className="ci-welcome">
            <h2 className="ci-welcome-h">Welcome to my<br />digital world.</h2>
            <p className="ci-welcome-cap">Scroll to begin</p>
          </div>

        </div>
      </div>
    </>
  );
}
