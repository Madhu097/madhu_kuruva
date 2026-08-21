import { useEffect, useState, useRef } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────
const NAME  = 'MADHU KURUVA';
const ROLE  = 'FULL STACK DEVELOPER';
const POOL  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%*<>?/\\';
const rand  = (n: number) => Math.floor(Math.random() * n);

const CORNER_PATHS: Record<string, string> = {
  tl: 'M 38 2 L 2 2 L 2 38',
  tr: 'M 10 2 L 46 2 L 46 38',
  bl: 'M 38 46 L 2 46 L 2 10',
  br: 'M 10 46 L 46 46 L 46 10',
};
const CORNER_DOT: Record<string, [number, number]> = {
  tl: [2, 2], tr: [46, 2], bl: [2, 46], br: [46, 46],
};

// ─── Corner bracket SVG ───────────────────────────────────────────────────────
function Corner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const [cx, cy] = CORNER_DOT[pos];
  return (
    <svg
      className={`ls-corner ls-corner--${pos}`}
      viewBox="0 0 48 48"
      fill="none"
      width="48"
      height="48"
      aria-hidden="true"
    >
      <path
        d={CORNER_PATHS[pos]}
        stroke="rgba(34,211,238,0.55)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: 100,
          animation: 'ls-draw 0.65s 0.2s cubic-bezier(0.4,0,0.2,1) both',
        }}
      />
      <circle
        cx={cx}
        cy={cy}
        r="2.5"
        fill="rgba(34,211,238,0.85)"
        style={{ animation: 'ls-fadein 0.3s 0.75s ease both' }}
      />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LoadingScreen() {
  const [display, setDisplay] = useState<string[]>(() =>
    NAME.split('').map(c => (c === ' ' ? ' ' : POOL[rand(POOL.length)]))
  );
  const [locked,       setLocked]       = useState<boolean[]>(() => NAME.split('').map(() => false));
  const [flash,        setFlash]        = useState<number | null>(null);
  const [progress,     setProgress]     = useState(0);
  const [showRole,     setShowRole]     = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [exiting,      setExiting]      = useState(false);
  const [done,         setDone]         = useState(false);

  const lockedRef = useRef<boolean[]>(NAME.split('').map(() => false));

  // ── Scramble loop ─────────────────────────────────────────────────────────
  useEffect(() => {
    let raf: number;
    let last = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < 45) return;
      last = now;
      setDisplay(prev =>
        prev.map((_, i) => {
          if (lockedRef.current[i]) return NAME[i];
          if (NAME[i] === ' ') return ' ';
          return POOL[rand(POOL.length)];
        })
      );
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // ── Lock letters one by one ───────────────────────────────────────────────
  useEffect(() => {
    let idx = 0;
    const next = () => {
      if (idx >= NAME.length) {
        setShowRole(true);
        setShowProgress(true);
        return;
      }
      const i = idx;
      setFlash(i);
      setTimeout(() => setFlash(f => (f === i ? null : f)), 190);
      lockedRef.current[i] = true;
      setLocked(prev => { const n = [...prev]; n[i] = true; return n; });
      idx++;
      const delay = i < 4 ? 105 : i < 8 ? 140 : 170;
      setTimeout(next, delay);
    };
    const t = setTimeout(next, 700);
    return () => clearTimeout(t);
  }, []);

  // ── Progress bar ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!showProgress) return;
    let p = 0;
    const tick = () => {
      p = Math.min(100, p + rand(5) + 2);
      setProgress(Math.floor(p));
      if (p < 100) setTimeout(tick, 28);
    };
    tick();
  }, [showProgress]);

  // ── Exit ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (progress < 100) return;
    const t1 = setTimeout(() => setExiting(true), 500);
    const t2 = setTimeout(() => setDone(true),    1350);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [progress]);

  if (done) return null;

  return (
    <>
      <style>{STYLES}</style>
      <div className={`ls${exiting ? ' ls--exit' : ''}`} role="status" aria-label="Loading portfolio">

        {/* Ambient BG */}
        <div className="ls-grid"     aria-hidden="true" />
        <div className="ls-orb"      aria-hidden="true" />
        <div className="ls-vignette" aria-hidden="true" />

        {/* Corners */}
        <Corner pos="tl" /><Corner pos="tr" />
        <Corner pos="bl" /><Corner pos="br" />

        {/* Sweep line */}
        <div className="ls-sweep" aria-hidden="true" />

        {/* Top bar */}
        <div className="ls-topbar" aria-hidden="true">
          <div className="ls-topbar-left">
            <span className="ls-pulse-dot" />
            <span>PORTFOLIO.SYS</span>
          </div>
          <div className="ls-topbar-center">SIGNAL&nbsp;ACQUISITION</div>
          <div className="ls-topbar-right">{new Date().getFullYear()}&nbsp;·&nbsp;v1.0</div>
        </div>

        {/* Body */}
        <div className="ls-body">
          <div className="ls-rule" aria-hidden="true">
            <span className="ls-rule-tick" />
            <span className="ls-rule-line" />
            <span className="ls-rule-tick" />
          </div>

          {/* Name decode */}
          <div className="ls-name">
            {NAME.split('').map((orig, i) => (
              <span
                key={i}
                className={[
                  'ls-ch',
                  orig === ' '  ? 'ls-ch--space' : '',
                  locked[i]     ? 'ls-ch--on'    : 'ls-ch--off',
                  flash === i   ? 'ls-ch--flash'  : '',
                ].filter(Boolean).join(' ')}
              >
                {display[i]}
              </span>
            ))}
          </div>

          <div className="ls-rule ls-rule--flip" aria-hidden="true">
            <span className="ls-rule-tick" />
            <span className="ls-rule-line" />
            <span className="ls-rule-tick" />
          </div>

          <p className={`ls-role${showRole ? ' ls-role--in' : ''}`}>{ROLE}</p>

          {/* Progress */}
          <div className={`ls-prog${showProgress ? ' ls-prog--in' : ''}`}>
            <div className="ls-track">
              <div className="ls-fill"    style={{ width: `${progress}%` }} />
              <div className="ls-glowtip" style={{ left:  `${progress}%` }} />
            </div>
            <div className="ls-track-meta">
              <span>LOADING ASSETS</span>
              <span className="ls-track-pct">{String(progress).padStart(3, '0')}%</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="ls-botbar" aria-hidden="true">
          <span>HYDERABAD&nbsp;·&nbsp;INDIA</span>
          <span className="ls-botbar-sep">◆</span>
          <span>FULL&nbsp;STACK&nbsp;DEVELOPER</span>
          <span className="ls-botbar-sep">◆</span>
          <span>MK&nbsp;·&nbsp;2026</span>
        </div>
      </div>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
.ls {
  position: fixed; inset: 0; z-index: 9999;
  background: #03030a;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  overflow: hidden; user-select: none;
  font-family: 'Courier New', 'Consolas', monospace;
  will-change: transform, opacity;
}

/* CRT turn-off: squish to horizontal line → vanish */
.ls--exit { animation: ls-crt-off 0.75s cubic-bezier(0.4,0,1,1) forwards; }
@keyframes ls-crt-off {
  0%   { transform: scaleY(1)     scaleX(1);    opacity: 1;    }
  45%  { transform: scaleY(0.003) scaleX(1);    opacity: 1;    }
  68%  { transform: scaleY(0.003) scaleX(0.65); opacity: 0.85; }
  100% { transform: scaleY(0)     scaleX(0.1);  opacity: 0;    }
}

/* ── Background ────────────────────────────────── */
.ls-grid {
  position: absolute; inset: 0; pointer-events: none;
  background-image:
    linear-gradient(rgba(34,211,238,0.028) 1px, transparent 1px),
    linear-gradient(90deg, rgba(34,211,238,0.028) 1px, transparent 1px);
  background-size: 72px 72px;
}
.ls-orb {
  position: absolute; pointer-events: none;
  width: min(800px, 100vw); height: min(800px, 100vw);
  border-radius: 50%;
  background: radial-gradient(ellipse at center,
    rgba(109,40,217,0.10) 0%,
    rgba(34,211,238,0.055) 38%,
    transparent 68%
  );
  animation: ls-orb-pulse 5s ease-in-out infinite;
}
@keyframes ls-orb-pulse {
  0%,100% { transform: scale(1);    opacity: 0.75; }
  50%      { transform: scale(1.14); opacity: 1;    }
}
.ls-vignette {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse at center,
    transparent 40%, rgba(0,0,5,0.65) 100%
  );
}

/* ── Corners ───────────────────────────────────── */
.ls-corner { position: absolute; }
.ls-corner--tl { top: 18px; left: 18px; }
.ls-corner--tr { top: 18px; right: 18px; }
.ls-corner--bl { bottom: 18px; left: 18px; }
.ls-corner--br { bottom: 18px; right: 18px; }
@keyframes ls-draw {
  from { stroke-dashoffset: 100; opacity: 0; }
  5%   { opacity: 1; }
  to   { stroke-dashoffset: 0;   opacity: 1; }
}
@keyframes ls-fadein {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* ── Sweep line ────────────────────────────────── */
.ls-sweep {
  position: absolute; left: 0; right: 0; top: 0;
  height: 1.5px; pointer-events: none; z-index: 10;
  background: linear-gradient(90deg,
    transparent  0%,
    rgba(34,211,238,0.15) 10%,
    rgba(34,211,238,0.95) 50%,
    rgba(34,211,238,0.15) 90%,
    transparent 100%
  );
  box-shadow:
    0 0 10px rgba(34,211,238,0.8),
    0 0 35px rgba(34,211,238,0.3),
    0 0 70px rgba(34,211,238,0.1);
  animation: ls-sweep 2.4s ease-in-out forwards;
}
@keyframes ls-sweep {
  0%   { top: 0%;   opacity: 0; }
  3%   { opacity: 1; }
  97%  { opacity: 0.7; }
  100% { top: 100%; opacity: 0; }
}

/* ── Top bar ───────────────────────────────────── */
.ls-topbar {
  position: absolute; top: 0; left: 0; right: 0;
  height: 38px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 clamp(18px, 5vw, 80px);
  border-bottom: 1px solid rgba(34,211,238,0.06);
  font-size: 0.5rem; letter-spacing: 0.28em;
  color: rgba(34,211,238,0.35); text-transform: uppercase;
  opacity: 0; animation: ls-fadein 0.5s 0.25s ease both;
}
.ls-topbar-left  { display: flex; align-items: center; gap: 8px; }
.ls-topbar-center{ color: rgba(34,211,238,0.2); }
.ls-topbar-right { color: rgba(34,211,238,0.2); }
.ls-pulse-dot {
  display: inline-block;
  width: 5px; height: 5px; border-radius: 50%;
  background: #22d3ee;
  box-shadow: 0 0 7px rgba(34,211,238,0.9);
  animation: ls-blink 1s steps(1) infinite;
}
@keyframes ls-blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }

/* ── Body ──────────────────────────────────────── */
.ls-body {
  display: flex; flex-direction: column;
  align-items: center; gap: 0;
}

/* ── Decorative rule ───────────────────────────── */
.ls-rule {
  display: flex; align-items: center; gap: 10px;
  width: 100%; margin: 14px 0 8px;
  opacity: 0; animation: ls-fadein 0.6s 0.3s ease both;
}
.ls-rule--flip { margin: 8px 0 14px; }
.ls-rule-line {
  flex: 1; height: 1px;
  background: linear-gradient(90deg,
    transparent,
    rgba(34,211,238,0.18) 30%,
    rgba(34,211,238,0.18) 70%,
    transparent
  );
}
.ls-rule-tick {
  display: block;
  width: 4px; height: 4px;
  border: 1px solid rgba(34,211,238,0.4);
  transform: rotate(45deg);
  flex-shrink: 0;
}

/* ── Name decode ───────────────────────────────── */
.ls-name {
  display: flex; align-items: center; justify-content: center;
}
.ls-ch {
  display: inline-flex; align-items: center; justify-content: center;
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  font-size: clamp(2.2rem, 6.5vw, 5.2rem);
  font-weight: 900; line-height: 1.05;
  width: 0.61em; min-width: 0.61em;
  text-align: center;
  transition: color 0.12s ease, text-shadow 0.18s ease;
}
.ls-ch--space { min-width: 0.28em; width: 0.28em; }
.ls-ch--off   { color: rgba(34,211,238,0.15); }
.ls-ch--on    {
  color: #f1f5f9;
  text-shadow:
    0 0 18px rgba(34,211,238,0.3),
    0 0 50px rgba(34,211,238,0.08);
}
.ls-ch--flash {
  color: #22d3ee !important;
  text-shadow:
    0 0 12px rgba(34,211,238,1),
    0 0 35px rgba(34,211,238,0.95),
    0 0 80px rgba(34,211,238,0.55) !important;
}

/* ── Role text ─────────────────────────────────── */
.ls-role {
  font-size: clamp(0.5rem, 1.2vw, 0.72rem);
  letter-spacing: 0.52em; text-transform: uppercase;
  color: rgba(34,211,238,0.48);
  margin: 0 0 52px;
  opacity: 0; transform: translateY(10px);
  transition: opacity 0.7s ease, transform 0.7s ease;
  white-space: nowrap;
}
.ls-role--in { opacity: 1; transform: translateY(0); }

/* ── Progress ──────────────────────────────────── */
.ls-prog {
  width: clamp(260px, 42vw, 480px);
  opacity: 0; transform: translateY(8px);
  transition: opacity 0.5s 0.12s ease, transform 0.5s 0.12s ease;
}
.ls-prog--in { opacity: 1; transform: translateY(0); }
.ls-track {
  position: relative; height: 2px;
  background: rgba(34,211,238,0.07);
  margin-bottom: 10px; overflow: visible;
}
.ls-track::before {
  content: '';
  position: absolute; bottom: -5px; left: 0; right: 0; height: 1px;
  background: repeating-linear-gradient(
    90deg,
    rgba(34,211,238,0.15) 0, rgba(34,211,238,0.15) 1px,
    transparent 1px, transparent 10%
  );
}
.ls-fill {
  height: 100%;
  background: linear-gradient(90deg, #6d28d9 0%, #2563eb 45%, #22d3ee 100%);
  transition: width 0.07s linear;
  box-shadow: 0 0 10px rgba(34,211,238,0.5), 0 0 25px rgba(34,211,238,0.2);
}
.ls-glowtip {
  position: absolute; top: 50%;
  transform: translate(-50%, -50%);
  width: 7px; height: 7px; border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 6px #22d3ee, 0 0 18px rgba(34,211,238,0.85), 0 0 40px rgba(34,211,238,0.35);
  transition: left 0.07s linear;
}
.ls-track-meta {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 0.5rem; letter-spacing: 0.18em; text-transform: uppercase;
  color: rgba(34,211,238,0.3);
}
.ls-track-pct {
  color: rgba(34,211,238,0.68);
  font-variant-numeric: tabular-nums;
  font-size: 0.62rem;
}

/* ── Bottom bar ────────────────────────────────── */
.ls-botbar {
  position: absolute; bottom: 0; left: 0; right: 0;
  height: 38px;
  display: flex; align-items: center; justify-content: center;
  gap: 16px;
  border-top: 1px solid rgba(34,211,238,0.06);
  font-size: 0.48rem; letter-spacing: 0.22em;
  color: rgba(34,211,238,0.22); text-transform: uppercase;
  opacity: 0; animation: ls-fadein 0.5s 0.45s ease both;
}
.ls-botbar-sep { font-size: 0.35rem; color: rgba(34,211,238,0.15); }
`;

