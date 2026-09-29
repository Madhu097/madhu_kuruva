import { useEffect, useRef, useCallback } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────
const TOTAL_FRAMES = 240;
const SCROLL_VH = 400;

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

// Device tier — determines rendering quality vs performance tradeoff
const getDeviceTier = () => {
  const w = window.innerWidth;
  if (w < 768) return 'mobile';   // phones
  if (w < 1024) return 'tablet';   // tablets
  return 'desktop';
};

// DPR capped by device tier to avoid over-rendering on mobile
const getTierDPR = () => {
  const tier = getDeviceTier();
  if (tier === 'mobile') return 1;                                 // 1× — CSS pixels only
  if (tier === 'tablet') return Math.min(window.devicePixelRatio || 1, 1.5);
  return Math.min(window.devicePixelRatio || 1, 2);                 // desktop up to 2×
};

// How many ms between canvas draws (throttle on mobile to save main thread)
const getDrawInterval = () => {
  return 0; // Uncapped on all devices for buttery-smooth high refresh rate rendering
};

// Real viewport height (accounts for mobile browser chrome bar)
const getVH = () => window.visualViewport?.height ?? window.innerHeight;
const getVW = () => window.visualViewport?.width ?? window.innerWidth;

// ─── Component ───────────────────────────────────────────────────────────────
export default function CinematicIntro() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const isLoopRunningRef = useRef<boolean>(false);
  const hasStartedPreloadRef = useRef<boolean>(false);

  // Frame store
  const framesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const loadedRef = useRef<boolean[]>(new Array(TOTAL_FRAMES).fill(false));

  // Scroll progress — written by passive scroll listener, read by rAF
  const rawPRef = useRef(0);
  const smoothPRef = useRef(0);

  // Wrapper metrics cached to avoid layout reads during scroll
  const wrapTopRef = useRef(0);
  const wrapHRef = useRef(0);

  // Canvas state
  const vpRef = useRef({ w: getVW(), h: getVH() });
  const lastDrawnRef = useRef(-1);
  const dirtyRef = useRef(true);
  const lastDrawTime = useRef(0);
  const lastDrawnImgRef = useRef<HTMLImageElement | null>(null);
  const isInViewRef = useRef(true);

  // DOM refs updated by rAF (avoids React re-renders)
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const welcomeRef = useRef<HTMLDivElement>(null);
  const lastOpacitiesRef = useRef<number[]>(new Array(6).fill(-999));
  const lastWelcomeOpRef = useRef<number>(-999);
  const preloadUpcomingRef = useRef<((startIdx: number, count?: number) => void) | null>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const lastHintOpRef = useRef<number>(-999);

  // ── 1. Removed Scroll to top on mount to fix refresh behavior ────────────────
  useEffect(() => {
    // Let the browser handle scroll restoration natively so sections aren't hidden on refresh
  }, []);

  // ── 2. Cache wrapper metrics (read once, not every scroll) ──────────────────
  const cacheWrapperMetrics = useCallback(() => {
    const w = wrapperRef.current;
    if (!w) return;
    // Use offsetTop + offsetHeight — no layout thrash, just property read
    wrapTopRef.current = w.offsetTop;
    wrapHRef.current = w.offsetHeight;
  }, []);

  // ── 3. Draw frame (all coords in CSS px; DPR handled by ctx.scale) ──────────
  const drawFrame = useCallback((frameIdx: number, p: number, mobile: boolean): boolean => {
    const canvas = canvasRef.current;
    if (!canvas) return false;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    // Check if the exact target frame is loaded
    let img: HTMLImageElement | null = null;
    const currentFrame = framesRef.current[frameIdx];

    if (currentFrame && loadedRef.current[frameIdx] && currentFrame.naturalWidth > 0) {
      img = currentFrame;
    } else {
      // Missing frame: trigger priority preload for this and nearby frames
      preloadUpcomingRef.current?.(frameIdx, 20);

      // Search bidirectionally for nearest loaded frame to avoid visual jump
      let bestImg: HTMLImageElement | null = null;
      for (let offset = 1; offset < 30; offset++) {
        const back = frameIdx - offset;
        if (back >= 0 && loadedRef.current[back] && framesRef.current[back]?.naturalWidth! > 0) {
          bestImg = framesRef.current[back];
          break;
        }
        const fwd = frameIdx + offset;
        if (fwd < TOTAL_FRAMES && loadedRef.current[fwd] && framesRef.current[fwd]?.naturalWidth! > 0) {
          bestImg = framesRef.current[fwd];
          break;
        }
      }
      img = bestImg || lastDrawnImgRef.current;
    }

    if (!img) return false;
    lastDrawnImgRef.current = img;

    const { w: W, h: H } = vpRef.current;

    // ── Cover-fit: always fill the full screen ────────────────────────────────
    const iW = img.naturalWidth || 1920;
    const iH = img.naturalHeight || 1080;

    let scale = Math.max(W / iW, H / iH);

    if (W < H) scale *= 0.88;

    const dW = iW * scale;
    const dH = iH * scale;

    const dX = (W - dW) / 2;
    const dY = (H - dH) * 0.38;

    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(img, dX, dY, dW, dH);

    // Note: Static top and bottom gradients moved to CSS overlay (.ci-gradient-overlay)
    // to save canvas layout invalidations and drawing overhead.

    // Desktop-only extras (vignette, bloom, fog — too expensive on mobile)
    if (!mobile) {
      const vr = Math.max(W, H) * 0.9;
      const vg = ctx.createRadialGradient(W / 2, H / 2, vr * 0.35, W / 2, H / 2, vr);
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, `rgba(0,0,0,${lerp(0.55, 0.22, easeInOut4(clamp(p * 1.3, 0, 1)))})`);
      ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);

      if (p > 0.76) {
        const bt = clamp((p - 0.76) / 0.24, 0, 1);
        const bl = ctx.createRadialGradient(W / 2, H * 0.42, 0, W / 2, H * 0.42, Math.max(W, H) * 0.75);
        bl.addColorStop(0, `rgba(10,132,255,${bt * 0.18})`);
        bl.addColorStop(0.4, `rgba(64,156,255,${bt * 0.07})`);
        bl.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = bl; ctx.fillRect(0, 0, W, H);
      }

      const fo = lerp(0.12, 0.02, easeOut3(clamp(p * 1.6, 0, 1)));
      const fg = ctx.createLinearGradient(0, H * 0.57, 0, H * 0.82);
      fg.addColorStop(0, 'rgba(10,20,40,0)');
      fg.addColorStop(0.5, `rgba(10,20,40,${fo})`);
      fg.addColorStop(1, 'rgba(10,20,40,0)');
      ctx.fillStyle = fg; ctx.fillRect(0, 0, W, H);
    }

    // End-fade
    if (p > 0.94) {
      const fadeAmt = easeInOut4(clamp((p - 0.94) / 0.06, 0, 1));
      ctx.fillStyle = `rgba(0,0,0,${fadeAmt.toFixed(3)})`;
      ctx.fillRect(0, 0, W, H);
    }

    return true;
  }, []);

  // ── 4. rAF loop ─────────────────────────────────────────────────────────────
  const tick = useCallback((now: number) => {
    const tier = getDeviceTier();
    const mobile = tier === 'mobile';
    const lerpFac = mobile ? 0.35 : 0.30; // Butter-smooth responsive scroll tracking

    // Smooth progress
    smoothPRef.current = lerp(smoothPRef.current, rawPRef.current, lerpFac);

    // Snap progress if extremely close to settle animation
    const diff = Math.abs(smoothPRef.current - rawPRef.current);
    const settled = diff < 0.001;
    if (settled) {
      smoothPRef.current = rawPRef.current;
    }

    const p = smoothPRef.current;
    const frameIdx = Math.min(Math.floor(p * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1);

    // Throttle canvas draws by device tier
    const interval = getDrawInterval();
    const canDraw = now - lastDrawTime.current >= interval;

    if (canDraw && (frameIdx !== lastDrawnRef.current || dirtyRef.current)) {
      const ok = drawFrame(frameIdx, p, mobile);
      if (ok) {
        const isExact = loadedRef.current[frameIdx] && framesRef.current[frameIdx] === lastDrawnImgRef.current;
        if (isExact) {
          lastDrawnRef.current = frameIdx;
          dirtyRef.current = false;
        } else {
          // Force redraw once the real frame loads
          lastDrawnRef.current = -1;
        }
        lastDrawTime.current = now;
      }
    }

    // ── Text panels (cheap DOM writes — always at 60fps) ──────────────────────
    const RISE = 0.035; // Smoother, longer transition rise
    const FADE = 0.035; // Smoother, longer transition fade

    TEXT_SEQUENCE.forEach((seg, i) => {
      const panel = panelRefs.current[i];
      if (!panel) return;
      const rEnd = seg.start + RISE;
      const fSt = seg.end - FADE;

      let op = 0, ty = 0, sc = 1;
      if (p < seg.start) { op = 0; ty = 28; sc = 0.96; }
      else if (p < rEnd) { const t = easeOut3((p - seg.start) / RISE); op = t; ty = lerp(28, 0, t); sc = lerp(0.96, 1, t); }
      else if (p < fSt) { op = 1; ty = 0; sc = 1; }
      else if (p < seg.end) { const t = easeInOut4((p - fSt) / FADE); op = 1 - t; ty = lerp(0, -20, t); sc = lerp(1, 1.03, t); }
      else { op = 0; ty = -20; sc = 1.03; }

      // Only write to the DOM if the panel is currently visible, OR just transitioned to 0
      const lastOp = lastOpacitiesRef.current[i];
      if (op !== 0 || lastOp !== 0) {
        panel.style.opacity = op.toFixed(3);
        panel.style.transform = `translateY(${ty.toFixed(1)}px) scale(${sc.toFixed(3)})`;
        lastOpacitiesRef.current[i] = op;
      }
    });

    // Welcome panel
    const wEl = welcomeRef.current;
    if (wEl) {
      let op = 0, ty = 28;
      if (p >= 0.88) {
        const t = easeOut3(clamp((p - 0.88) / 0.08, 0, 1));
        op = t;
        ty = lerp(28, 0, t);
      }

      const lastWelcomeOp = lastWelcomeOpRef.current;
      if (op !== 0 || lastWelcomeOp !== 0) {
        wEl.style.opacity = op.toFixed(3);
        wEl.style.transform = `translateY(${ty.toFixed(1)}px)`;
        lastWelcomeOpRef.current = op;
      }
    }

    // First frame scroll prompt: visible on initial frames (frameIdx <= 1), removes after 2nd frame
    const hintEl = scrollHintRef.current;
    if (hintEl) {
      const showHint = frameIdx <= 1;
      const targetOp = showHint ? 1 : 0;
      if (lastHintOpRef.current !== targetOp) {
        hintEl.style.opacity = String(targetOp);
        hintEl.style.transform = `translateX(-50%) translateY(${showHint ? 0 : 8}px)`;
        hintEl.style.pointerEvents = showHint ? 'auto' : 'none';
        lastHintOpRef.current = targetOp;
      }
    }

    // Keep running if animation hasn't settled or a redraw is forced (e.g. newly loaded image)
    if (!settled || dirtyRef.current) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      isLoopRunningRef.current = false;
    }
  }, [drawFrame]);

  // ── 5. Wake up loop ─────────────────────────────────────────────────────────
  const wakeUpLoop = useCallback(() => {
    if (!isLoopRunningRef.current) {
      isLoopRunningRef.current = true;
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  // ── 5b. IntersectionObserver to completely pause/resume CinematicIntro processing
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;
        if (!entry.isIntersecting) {
          isLoopRunningRef.current = false;
          if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = 0;
          }
        } else {
          cacheWrapperMetrics();
          wakeUpLoop();
        }
      },
      { threshold: 0 }
    );

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }
    return () => observer.disconnect();
  }, [cacheWrapperMetrics, wakeUpLoop]);

  // ── 6. Passive scroll listener — no layout reads, pure arithmetic ───────────
  useEffect(() => {
    const onScroll = () => {
      if (!isInViewRef.current) return;
      const scrolled = clamp(
        window.scrollY - wrapTopRef.current,
        0,
        wrapHRef.current - window.innerHeight
      );
      const denom = wrapHRef.current - window.innerHeight;
      rawPRef.current = denom > 0 ? scrolled / denom : 0;

      // Preload next batch of frames just-in-time ahead of scroll position
      const currentIdx = Math.floor(rawPRef.current * (TOTAL_FRAMES - 1));
      preloadUpcomingRef.current?.(currentIdx, 20);

      wakeUpLoop();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [wakeUpLoop]);

  // ── 7. Canvas resize ── reads sticky container dimensions (not window) so canvas
  //    ALWAYS fills its parent regardless of dvh/svh/visualViewport discrepancies
  const resizeCanvas = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    // Read the sticky container's actual rendered size
    const parent = c.parentElement as HTMLElement | null;
    if (!parent) return;

    const dpr = getTierDPR();
    const W = parent.clientWidth || getVW();
    const H = parent.clientHeight || getVH();

    vpRef.current = { w: W, h: H };

    // Physical pixel size (crisp on retina)
    c.width = Math.round(W * dpr);
    c.height = Math.round(H * dpr);

    // Exact CSS size matching the container (zero gap guarantee)
    c.style.width = `${W}px`;
    c.style.height = `${H}px`;

    // Reset transform THEN scale — prevents accumulation on repeated calls
    const ctx = c.getContext('2d');
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }

    lastDrawnRef.current = -1;
    dirtyRef.current = true;
  }, []);

  // ── 8. Preload — frame 0 critical path, then staggered batches ──────────────
  useEffect(() => {
    if (hasStartedPreloadRef.current) return;
    hasStartedPreloadRef.current = true;

    console.log('[CinematicIntro] Preloader hook mounted.');
    const frames = framesRef.current;
    const loaded = loadedRef.current;

    // Helper to mark images loaded without forcing redundant rAF loops for background frames
    const markLoaded = (img: HTMLImageElement, i: number, cb?: () => void) => {
      loaded[i] = true;
      if (i === 0) {
        dirtyRef.current = true;
        frames[0] = img;
        resizeCanvas();
        cacheWrapperMetrics();
        drawFrame(0, 0, getDeviceTier() === 'mobile');
        lastDrawnRef.current = 0;
        wakeUpLoop();
      } else {
        const curIdx = Math.min(Math.floor(smoothPRef.current * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1);
        if (i === curIdx) {
          dirtyRef.current = true;
          wakeUpLoop();
        }
      }
      cb?.();
    };

    // Load frame 1 (index 0) as WebP immediately
    const firstImg = new Image();
    firstImg.decoding = 'async';

    firstImg.onload = () => {
      markLoaded(firstImg, 0, () => startPreloadFlow());
    };

    firstImg.onerror = () => {
      loaded[0] = true;
      wakeUpLoop();
    };

    firstImg.src = `/frames/ezgif-frame-001.webp`;

    const startPreloadFlow = () => {
      const loadOne = (i: number) => {
        if (i < 0 || i >= TOTAL_FRAMES || frames[i]) return;
        const img = new Image();
        img.decoding = 'async';

        img.onload = () => {
          markLoaded(img, i);
        };

        img.onerror = () => {
          loaded[i] = true;
          const curIdx = Math.min(Math.floor(smoothPRef.current * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1);
          if (i === curIdx) {
            wakeUpLoop();
          }
        };

        frames[i] = img;
        img.src = `/frames/ezgif-frame-${String(i + 1).padStart(3, '0')}.webp`;
      };

      const preloadUpcoming = (startIdx: number, count = 25) => {
        const end = Math.min(startIdx + count, TOTAL_FRAMES);
        for (let i = startIdx; i < end; i++) {
          loadOne(i);
        }
      };
      preloadUpcomingRef.current = preloadUpcoming;

      // Preload initial batch of frames (1-25) right away
      preloadUpcoming(1, 25);

      // Continuously preload all remaining frames in sequential background batches
      let nextBatch = 26;
      const loadNextBatch = () => {
        if (nextBatch >= TOTAL_FRAMES) return;
        preloadUpcoming(nextBatch, 20);
        nextBatch += 20;
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(loadNextBatch, { timeout: 800 });
        } else {
          setTimeout(loadNextBatch, 250);
        }
      };

      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(loadNextBatch, { timeout: 400 });
      } else {
        setTimeout(loadNextBatch, 350);
      }
    };
  }, [drawFrame, cacheWrapperMetrics, resizeCanvas, wakeUpLoop]);

  // ── 8. Mount: resize, cache metrics, start rAF ──────────────────────────────
  useEffect(() => {
    const doResize = () => {
      const c = canvasRef.current;
      if (!c) return;
      const parent = c.parentElement as HTMLElement | null; // .ci-sticky
      if (!parent) return;

      const dpr = getTierDPR();
      const W = parent.clientWidth || getVW();
      const H = parent.clientHeight || getVH();

      vpRef.current = { w: W, h: H };
      c.width = Math.round(W * dpr);
      c.height = Math.round(H * dpr);
      c.style.width = `${W}px`;
      c.style.height = `${H}px`;

      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
      }
      lastDrawnRef.current = -1;
      dirtyRef.current = true;
    };

    doResize();
    cacheWrapperMetrics();
    wakeUpLoop();

    const onResize = () => { doResize(); cacheWrapperMetrics(); wakeUpLoop(); };
    window.addEventListener('resize', onResize, { passive: true });
    window.visualViewport?.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      isLoopRunningRef.current = false;
      window.removeEventListener('resize', onResize);
      window.visualViewport?.removeEventListener('resize', onResize);
    };
  }, [cacheWrapperMetrics, tick, wakeUpLoop]);

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        /* ═══════════ Cinematic Intro ═══════════ */

        .ci-wrap {
          position: relative;
          height: ${SCROLL_VH}vh;
          background: #000000;
          /* Isolation prevents scroll from bubbling and causing jank */
          isolation: isolate;
        }

        .ci-sticky {
          position: sticky;
          top: 0;
          width: 100%;
          height: 100vh;
          height: 100dvh;
          overflow: hidden;
          background: #000000;
          /* Critical: tell browser this is independent — improves compositing */
          contain: layout style;
          will-change: transform;
        }

        .ci-canvas {
          position: absolute;
          top: 0; left: 0;
          display: block;
          /* GPU layer hint */
          will-change: contents;
        }

        /* Static gradients overlay — hardware accelerated */
        .ci-gradient-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 5;
          background: 
            linear-gradient(to bottom, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0) 30%),
            linear-gradient(to bottom, rgba(0,0,0,0) 55%, rgba(0,0,0,0.92) 100%);
        }

        /* Decorative flares */
        .ci-flare {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          mix-blend-mode: screen;
          /* Own compositing layer — doesn't invalidate parent */
          will-change: opacity;
        }

        /* Text panels */
        .ci-panel {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 0 clamp(1.2rem, 5vw, 6vw) clamp(4vh, 6vh, 7vh);
          z-index: 15;
          pointer-events: none;
          will-change: opacity, transform;
          opacity: 0;
          transform: translateY(28px);
          /* translateZ forces GPU compositing — prevents layout jank on mobile */
          transform-style: flat;
        }

        .ci-panel-h {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: clamp(1.8rem, 5.5vw, 6.5rem);
          color: #fff;
          line-height: 1.06;
          letter-spacing: -0.02em;
          margin: 0;
          text-shadow:
            0 0 55px rgba(10,132,255,0.45),
            0 2px 24px rgba(0,0,0,0.98);
        }

        .ci-panel-sub {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 300;
          font-size: clamp(0.75rem, 2vw, 2rem);
          color: rgba(10,132,255,0.88);
          letter-spacing: clamp(0.10em, 0.28em, 0.28em);
          text-transform: uppercase;
          margin: 0.4em 0 0;
          text-shadow: 0 0 20px rgba(10,132,255,0.50);
        }

        .ci-panel-rule {
          display: block;
          width: clamp(50px, 8vw, 100px);
          height: 1.5px;
          margin: 0.8em 0 0;
          background: linear-gradient(90deg,
            rgba(10,132,255,0.70), rgba(64,156,255,0.50), transparent);
          border: none;
        }

        /* Welcome panel */
        .ci-welcome {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 0 clamp(1.2rem, 5vw, 6vw) clamp(4vh, 6vh, 7vh);
          z-index: 15;
          pointer-events: none;
          will-change: opacity, transform;
          opacity: 0;
          transform: translateY(28px);
        }

        .ci-welcome-h {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: clamp(1.6rem, 4.5vw, 5rem);
          color: #fff;
          letter-spacing: -0.02em;
          line-height: 1.10;
          margin: 0;
          text-shadow: 0 0 70px rgba(10,132,255,0.50), 0 2px 32px rgba(0,0,0,0.98);
        }

        .ci-welcome-cap {
          display: inline-block;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(0.6rem, 1.3vw, 0.82rem);
          color: rgba(10,132,255,0.65);
          letter-spacing: 0.38em;
          text-transform: uppercase;
          margin-top: 1.3em;
          animation: ci-bounce 2.4s ease-in-out infinite;
        }

        @keyframes ci-bounce {
          0%,100% { opacity: 0.45; transform: translateY(0);   }
          50%      { opacity: 1.00; transform: translateY(5px); }
        }

        /* Fog */
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
          height: 40%;
          background: radial-gradient(
            ellipse 140% 65% at 50% 110%,
            rgba(10,20,40,0.42) 0%, transparent 70%
          );
          animation: ci-fog-drift 22s ease-in-out infinite;
          /* Separate compositing layer for animated element */
          will-change: transform;
        }
        @keyframes ci-fog-drift {
          0%   { transform: translateX(-12%) scaleX(1.10); }
          50%  { transform: translateX(12%)  scaleX(0.91); }
          100% { transform: translateX(-12%) scaleX(1.10); }
        }

        /* Transition overlay */
        .ci-trans-overlay {
          position: fixed;
          inset: 0;
          z-index: 200;
          pointer-events: none;
          opacity: 0;
          will-change: opacity;
          background: #000000;
        }

        /* First-frame mobile scroll hint */
        .ci-mobile-scroll-hint {
          position: absolute;
          bottom: clamp(20px, 4.5vh, 42px);
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 99px;
          background: rgba(8, 12, 24, 0.76);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(129, 140, 248, 0.32);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.65), 0 0 16px rgba(99, 102, 241, 0.22);
          z-index: 40;
          opacity: 1;
          transition: opacity 0.35s ease, transform 0.35s ease;
          pointer-events: none;
        }

        .ci-hint-icon {
          color: #818CF8;
          font-size: 13px;
          font-weight: 800;
          animation: ci-hint-bounce 1.5s ease-in-out infinite;
        }

        .ci-hint-text {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.66rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: #E2E8F0;
          text-transform: uppercase;
        }

        @keyframes ci-hint-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.7; }
          50% { transform: translateY(4px); opacity: 1; }
        }

        /* ─── Mobile ≤ 480px ──────────────────────────────────────────── */
        @media (max-width: 480px) {
          .ci-wrap { height: 380vh; }
          .ci-sticky {
            height: 100vh;      /* fallback */
            height: 100svh;     /* excludes browser chrome bar */
          }
          .ci-panel { padding-bottom: clamp(4vh, 6vh, 8vh); }
          .ci-panel-h { font-size: clamp(1.7rem, 7.5vw, 2.8rem); }
          .ci-panel-sub { font-size: clamp(0.65rem, 3.2vw, 0.95rem); letter-spacing: 0.13em; }
          .ci-welcome-h { font-size: clamp(1.5rem, 6.5vw, 2.5rem); }
          .ci-fog::before { animation: none; }
          .ci-flare { display: none; }
        }

        /* ─── Tablet 481–768px ───────────────────────────────────────── */
        @media (min-width: 481px) and (max-width: 768px) {
          .ci-wrap { height: 400vh; }
          .ci-sticky {
            height: 100vh;
            height: 100dvh;
          }
          .ci-panel-h { font-size: clamp(2rem, 5.5vw, 3.5rem); }
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .ci-wrap { height: 100vh; }
          .ci-fog::before { animation: none; }
          .ci-welcome-cap { animation: none; opacity: 0.7; }
        }
      `}</style>

      <div ref={wrapperRef} className="ci-wrap" aria-hidden="true">
        <div className="ci-sticky">

          <canvas ref={canvasRef} className="ci-canvas" />
          <div className="ci-gradient-overlay" />

          <div className="ci-fog" />

          {/* Lens flares — hidden on mobile via CSS */}
          <div className="ci-flare" style={{
            width: 'clamp(80px,15vw,220px)', height: 'clamp(80px,15vw,220px)',
            top: '12%', left: '6%',
            background: 'radial-gradient(circle,rgba(10,132,255,0.10) 0%,transparent 72%)',
          }} />
          <div className="ci-flare" style={{
            width: 'clamp(60px,12vw,150px)', height: 'clamp(60px,12vw,150px)',
            top: '58%', right: '8%',
            background: 'radial-gradient(circle,rgba(64,156,255,0.08) 0%,transparent 72%)',
          }} />
          <div className="ci-flare" style={{
            width: 'clamp(30px,5vw,80px)', height: 'clamp(30px,5vw,80px)',
            top: '26%', right: '16%',
            background: 'radial-gradient(circle,rgba(10,132,255,0.12) 0%,transparent 72%)',
          }} />

          {TEXT_SEQUENCE.map((seg, i) => (
            <div key={i} ref={el => { panelRefs.current[i] = el; }} className="ci-panel">
              <h2 className="ci-panel-h">{seg.text}</h2>
              {seg.sub && <p className="ci-panel-sub">{seg.sub}</p>}
              <hr className="ci-panel-rule" />
            </div>
          ))}

          <div ref={welcomeRef} className="ci-welcome">
            <h2 className="ci-welcome-h">Welcome to my<br />digital world.</h2>
            <p className="ci-welcome-cap">Scroll to begin</p>
          </div>

          {/* First frame mobile scroll indicator — prompts user to scroll, fades after 2nd frame */}
          <div ref={scrollHintRef} className="ci-mobile-scroll-hint" aria-hidden="true">
            <span className="ci-hint-icon">↓</span>
            <span className="ci-hint-text">SCROLL DOWN</span>
          </div>

        </div>
      </div>
    </>
  );
}
