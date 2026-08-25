import { useEffect, useState, useRef } from 'react';

// ─── Data ─────────────────────────────────────────────────────────────────────
const NAME = 'MADHU KURUVA';
const ROLE = 'FULL STACK DEVELOPER';

// Code/syntax chars — feels like scrambling through source code
const POOL = '<>{}[]();:=>/\\|!#$@*+-~^&?_';
const rand = (n: number) => Math.floor(Math.random() * n);

// Fake compile log — each line appears 190ms apart after decode completes
const LOG_LINES = [
  { sym: '✔', text: 'react@18.3.1', col: '#4ade80' },
  { sym: '✔', text: 'typescript@5.5.3', col: '#4ade80' },
  { sym: '✔', text: 'vite@5.4.21', col: '#4ade80' },
  { sym: '✔', text: 'node@20.x  (lts)', col: '#4ade80' },
  { sym: '⟳', text: 'bundling /portfolio...', col: '#22d3ee' },
  { sym: '✓', text: 'built in 847ms', col: '#a78bfa' },
];

// Tech-stack badges
const BADGES = [
  { label: 'React', color: '#61dafb' },
  { label: 'TypeScript', color: '#3b82f6' },
  { label: 'Node.js', color: '#68a063' },
  { label: 'Python', color: '#f7c948' },
  { label: 'PostgreSQL', color: '#336791' },
  { label: 'Tailwind', color: '#38bdf8' },
  { label: 'Vite', color: '#bd34fe' },
];

// Dynamic build-stage label driven by progress value
const stageLabel = (p: number) => {
  if (p < 20) return 'INITIALIZING REACT APP...';
  if (p < 40) return 'COMPILING TYPESCRIPT...';
  if (p < 65) return 'BUNDLING ASSETS...';
  if (p < 85) return 'OPTIMIZING CHUNKS...';
  if (p < 100) return 'GENERATING OUTPUT...';
  return 'BUILD SUCCESSFUL ✓';
};

// SVG corner brackets (draw themselves in via stroke-dasharray animation)
const CPATHS: Record<string, string> = {
  tl: 'M 38 2 L 2 2 L 2 38',
  tr: 'M 10 2 L 46 2 L 46 38',
  bl: 'M 38 46 L 2 46 L 2 10',
  br: 'M 10 46 L 46 46 L 46 10',
};
const CDOTS: Record<string, [number, number]> = {
  tl: [2, 2], tr: [46, 2], bl: [2, 46], br: [46, 46],
};
function Corner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const [cx, cy] = CDOTS[pos];
  return (
    <svg className={`lc lc--${pos}`} viewBox="0 0 48 48" fill="none" width="48" height="48" aria-hidden="true">
      <path
        d={CPATHS[pos]}
        stroke="rgba(34,211,238,0.45)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ strokeDasharray: 100, animation: 'lc-draw 0.65s 0.2s cubic-bezier(0.4,0,0.2,1) both' }}
      />
      <circle cx={cx} cy={cy} r="2" fill="rgba(34,211,238,0.85)"
        style={{ animation: 'lc-fadein 0.3s 0.75s ease both' }} />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LoadingScreen() {
  const [display, setDisplay] = useState<string[]>(() =>
    NAME.split('').map(c => c === ' ' ? ' ' : POOL[rand(POOL.length)])
  );
  const [locked, setLocked] = useState<boolean[]>(() => NAME.split('').map(() => false));
  const [flash, setFlash] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [showRole, setShowRole] = useState(false);
  const [showProgress, setShowProg] = useState(false);
  const [logCount, setLogCount] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [done, setDone] = useState(false);

  const lockedRef = useRef<boolean[]>(NAME.split('').map(() => false));

  // ── Scramble loop (22fps — code chars cycling) ────────────────────────────
  useEffect(() => {
    let raf: number;
    let last = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < 45) return;
      last = now;
      setDisplay(prev => prev.map((_, i) => {
        if (lockedRef.current[i]) return NAME[i];
        if (NAME[i] === ' ') return ' ';
        return POOL[rand(POOL.length)];
      }));
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // ── Lock letters one by one ───────────────────────────────────────────────
  useEffect(() => {
    let idx = 0;
    const next = () => {
      if (idx >= NAME.length) { setShowRole(true); setShowProg(true); return; }
      const i = idx;
      setFlash(i);
      setTimeout(() => setFlash(f => f === i ? null : f), 190);
      lockedRef.current[i] = true;
      setLocked(prev => { const n = [...prev]; n[i] = true; return n; });
      idx++;
      setTimeout(next, i < 4 ? 105 : i < 8 ? 140 : 170);
    };
    const t = setTimeout(next, 700);
    return () => clearTimeout(t);
  }, []);

  // ── Progress bar ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!showProgress) return;
    let p = 0;
    const tick = () => { p = Math.min(100, p + rand(5) + 2); setProgress(Math.floor(p)); if (p < 100) setTimeout(tick, 28); };
    tick();
  }, [showProgress]);

  // ── Compile log: one line every 190ms ────────────────────────────────────
  useEffect(() => {
    if (!showProgress) return;
    let idx = 0;
    const id = setInterval(() => { idx++; setLogCount(idx); if (idx >= LOG_LINES.length) clearInterval(id); }, 190);
    return () => clearInterval(id);
  }, [showProgress]);

  // ── Exit ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (progress < 100) return;
    const t1 = setTimeout(() => setExiting(true), 500);
    const t2 = setTimeout(() => setDone(true), 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [progress]);

  if (done) return null;

  return (
    <>
      <style>{CSS}</style>
      <div className={`ls${exiting ? ' ls--exit' : ''}`} role="status" aria-label="Loading portfolio">

        {/* Ambient layers */}
        <div className="ls-grid" aria-hidden="true" />
        <div className="ls-orb" aria-hidden="true" />
        <div className="ls-vignette" aria-hidden="true" />

        {/* Faint code watermark */}
        <pre className="ls-codebg" aria-hidden="true">{CODE_WM}</pre>

        {/* Corner brackets */}
        <Corner pos="tl" /><Corner pos="tr" />
        <Corner pos="bl" /><Corner pos="br" />

        {/* Scan sweep */}
        <div className="ls-sweep" aria-hidden="true" />

        {/* ── Terminal top bar ─────────────────────────────────────────── */}
        <div className="ls-topbar" aria-hidden="true">
          <div className="ls-topbar-l">
            <span className="ls-dot ls-dot--r" />
            <span className="ls-dot ls-dot--y" />
            <span className="ls-dot ls-dot--g" />
            <span className="ls-cmd">
              <span className="ls-prompt">$&nbsp;</span>
              npm&nbsp;run&nbsp;build:portfolio
            </span>
          </div>
          <div className="ls-branch">
            <span className="ls-branch-ico">⎇</span>&nbsp;main
          </div>
        </div>

        {/* ── Main body ────────────────────────────────────────────────── */}
        <div className="ls-body">

          {/* Decorative rule with HTML tag */}
          <div className="ls-rule" aria-hidden="true">
            <span className="ls-rtick" />
            <span className="ls-rline" />
            <span className="ls-rtag">&lt;/&gt;</span>
            <span className="ls-rline" />
            <span className="ls-rtick" />
          </div>

          {/* Name — letters decode from code chars */}
          <div className="ls-name">
            {NAME.split('').map((orig, i) => (
              <span key={i} className={[
                'ls-ch',
                orig === ' ' ? 'ls-ch--sp' : '',
                locked[i] ? 'ls-ch--on' : 'ls-ch--off',
                flash === i ? 'ls-ch--fx' : '',
              ].filter(Boolean).join(' ')}>
                {display[i]}
              </span>
            ))}
          </div>

          {/* Lower decorative rule with curly braces */}
          <div className="ls-rule ls-rule--b" aria-hidden="true">
            <span className="ls-rtick" />
            <span className="ls-rline" />
            <span className="ls-rtag">{'{ }'}</span>
            <span className="ls-rline" />
            <span className="ls-rtick" />
          </div>

          {/* Role subtitle */}
          <p className={`ls-role${showRole ? ' ls-role--in' : ''}`}>{ROLE}</p>

          {/* Tech-stack badges */}
          <div className={`ls-badges${showRole ? ' ls-badges--in' : ''}`}>
            {BADGES.map((b, i) => (
              <span
                key={b.label}
                className="ls-badge"
                style={{
                  borderColor: `${b.color}40`,
                  color: b.color,
                  animationDelay: `${i * 70}ms`,
                }}
              >
                {b.label}
              </span>
            ))}
          </div>

          {/* Compile log */}
          <div className={`ls-log${showProgress ? ' ls-log--in' : ''}`}>
            {LOG_LINES.slice(0, logCount).map((ln, i) => (
              <div key={i} className="ls-logline" style={{ color: ln.col }}>
                <span className="ls-logsym">{ln.sym}</span>
                <span className="ls-logtext">{ln.text}</span>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className={`ls-prog${showProgress ? ' ls-prog--in' : ''}`}>
            <div className="ls-track">
              <div className="ls-fill" style={{ width: `${progress}%` }} />
              <div className="ls-glowtip" style={{ left: `${progress}%` }} />
            </div>
            <div className="ls-meta">
              <span className="ls-stage">{stageLabel(progress)}</span>
              <span className="ls-pct">{String(progress).padStart(3, '0')}%</span>
            </div>
          </div>
        </div>

        {/* ── Bottom tech stack bar ─────────────────────────────────────── */}
        <div className="ls-botbar" aria-hidden="true">
          {['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'Tailwind', 'Vite', 'AI/ML'].map((t, i) => (
            <span key={t}>
              {i > 0 && <span className="ls-bsep"> · </span>}
              {t}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Faint code watermark text ────────────────────────────────────────────────
const CODE_WM = `
import { Developer } from '@madhu/core';
import React, { useState, useEffect } from 'react';

const portfolio = new Developer({
  name: 'Madhu Kuruva',
  role: 'Full Stack Developer',
  stack: ['React','TypeScript','Node.js','Python'],
  location: 'Hyderabad, India',
});

export default function App(): JSX.Element {
  const [ready, setReady] = useState<boolean>(false);
  useEffect(() => {
    portfolio.init().then(() => setReady(true));
  }, []);
  return ready ? <Portfolio dev={portfolio} /> : null;
}`.trim();

// ─── Styles ───────────────────────────────────────────────────────────────────
const CSS = `
/* === ROOT === */
.ls {
  position: fixed; inset: 0; z-index: 9999;
  background: #03030a;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  overflow: hidden; user-select: none;
  will-change: transform, opacity, filter;
}

/* ── Exit: smooth portal open — expands + floats up + fades out ── */
.ls--exit { animation: ls-exit 1.0s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
@keyframes ls-exit {
  0%   { opacity: 1; transform: scale(1)    translateY(0);    filter: blur(0px);   }
  40%  { opacity: 1; transform: scale(1.04) translateY(-1%);  filter: blur(0px);   }
  100% { opacity: 0; transform: scale(1.12) translateY(-4%);  filter: blur(8px);   }
}

/* === BACKGROUND === */
.ls-grid {
  position: absolute; inset: 0; pointer-events: none;
  background-image:
    linear-gradient(rgba(34,211,238,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(34,211,238,0.025) 1px, transparent 1px);
  background-size: 70px 70px;
}
.ls-orb {
  position: absolute; pointer-events: none;
  width: min(800px, 100vw); height: min(800px, 100vw); border-radius: 50%;
  background: radial-gradient(ellipse at center,
    rgba(109,40,217,0.09) 0%, rgba(34,211,238,0.05) 38%, transparent 68%);
  animation: ls-pulse 5s ease-in-out infinite;
}
@keyframes ls-pulse { 0%,100%{transform:scale(1); opacity:.75} 50%{transform:scale(1.12); opacity:1} }
.ls-vignette {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,6,0.65) 100%);
}

/* Code watermark */
.ls-codebg {
  position: absolute; inset: 0; pointer-events: none;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Courier New', monospace;
  font-size: 0.62rem; line-height: 1.75;
  color: rgba(34,211,238,0.032);
  white-space: pre; overflow: hidden;
  margin: 0; padding: 0;
}

/* === CORNERS === */
.lc { position: absolute; }
.lc--tl { top: 18px; left: 18px; }
.lc--tr { top: 18px; right: 18px; }
.lc--bl { bottom: 18px; left: 18px; }
.lc--br { bottom: 18px; right: 18px; }
@keyframes lc-draw {
  from { stroke-dashoffset:100; opacity:0; }
  5%   { opacity:1; }
  to   { stroke-dashoffset:0; opacity:1; }
}
@keyframes lc-fadein { from{opacity:0} to{opacity:1} }

/* === SWEEP LINE === */
.ls-sweep {
  position: absolute; left: 0; right: 0; top: 0;
  height: 1.5px; pointer-events: none; z-index: 10;
  background: linear-gradient(90deg,
    transparent 0%, rgba(34,211,238,0.12) 10%,
    rgba(34,211,238,0.95) 50%, rgba(34,211,238,0.12) 90%, transparent 100%);
  box-shadow: 0 0 10px rgba(34,211,238,0.8), 0 0 35px rgba(34,211,238,0.3);
  animation: ls-sweep 2.4s ease-in-out forwards;
}
@keyframes ls-sweep {
  0%{top:0%; opacity:0} 3%{opacity:1} 97%{opacity:.7} 100%{top:100%; opacity:0}
}

/* === TERMINAL TOP BAR === */
.ls-topbar {
  position: absolute; top: 0; left: 0; right: 0; height: 40px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 clamp(16px,4vw,64px);
  background: rgba(255,255,255,0.015);
  border-bottom: 1px solid rgba(34,211,238,0.07);
  opacity: 0; animation: ls-fin 0.5s 0.2s ease both;
}
@keyframes ls-fin { from{opacity:0} to{opacity:1} }
.ls-topbar-l { display: flex; align-items: center; gap: 10px; }

/* macOS-style traffic light dots */
.ls-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.ls-dot--r { background: #ff5f57; box-shadow: 0 0 5px rgba(255,95,87,.6); }
.ls-dot--y { background: #ffbd2e; box-shadow: 0 0 5px rgba(255,189,46,.6); }
.ls-dot--g { background: #28c941; box-shadow: 0 0 5px rgba(40,201,65,.6); }

.ls-cmd {
  font-family: 'Courier New', monospace;
  font-size: 0.54rem; letter-spacing: 0.12em;
  color: rgba(34,211,238,0.65);
}
.ls-prompt { color: rgba(40,201,65,0.8); }
.ls-branch {
  font-family: 'Courier New', monospace;
  font-size: 0.5rem; letter-spacing: 0.15em;
  color: rgba(34,211,238,0.28);
  display: flex; align-items: center;
}
.ls-branch-ico { font-size: 0.7rem; margin-right: 3px; }

/* === BODY === */
.ls-body { display: flex; flex-direction: column; align-items: center; }

/* Decorative rule */
.ls-rule {
  display: flex; align-items: center; gap: 8px;
  width: 100%; margin: 8px 0 4px;
  opacity: 0; animation: ls-fin 0.6s 0.3s ease both;
}
.ls-rule--b { margin: 4px 0 10px; }
.ls-rline {
  flex: 1; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(34,211,238,0.15) 35%, rgba(34,211,238,0.15) 65%, transparent);
}
.ls-rtick {
  display: block; width: 4px; height: 4px; flex-shrink: 0;
  border: 1px solid rgba(34,211,238,0.35); transform: rotate(45deg);
}
.ls-rtag {
  font-family: 'Courier New', monospace;
  font-size: 0.62rem; letter-spacing: 0.08em;
  color: rgba(34,211,238,0.38); flex-shrink: 0; padding: 0 4px;
}

/* === NAME DECODE === */
.ls-name { display: flex; align-items: center; justify-content: center; }
.ls-ch {
  display: inline-flex; align-items: center; justify-content: center;
  font-family: 'Inter','Helvetica Neue',Arial,sans-serif;
  font-size: clamp(2rem, 6.2vw, 5rem); font-weight: 900; line-height: 1.05;
  width: 0.61em; min-width: 0.61em; text-align: center;
  transition: color .12s ease, text-shadow .18s ease;
}
.ls-ch--sp  { width: 0.26em; min-width: 0.26em; }
.ls-ch--off { color: rgba(34,211,238,0.13); font-family: 'Courier New',monospace; font-weight:400; }
.ls-ch--on  { color: #f1f5f9; text-shadow: 0 0 18px rgba(34,211,238,.3), 0 0 50px rgba(34,211,238,.08); }
.ls-ch--fx  {
  color: #22d3ee !important;
  text-shadow: 0 0 12px rgba(34,211,238,1), 0 0 35px rgba(34,211,238,.95), 0 0 80px rgba(34,211,238,.5) !important;
}

/* === ROLE === */
.ls-role {
  font-family: 'Courier New', monospace;
  font-size: clamp(0.48rem, 1.15vw, 0.68rem);
  letter-spacing: 0.5em; text-transform: uppercase;
  color: rgba(34,211,238,0.46); margin: 0 0 10px;
  opacity: 0; transform: translateY(10px);
  transition: opacity .7s ease, transform .7s ease;
  white-space: nowrap;
}
.ls-role--in { opacity: 1; transform: translateY(0); }

/* === TECH BADGES === */
.ls-badges {
  display: flex; flex-wrap: wrap; justify-content: center;
  gap: 5px; margin: 0 0 14px;
  opacity: 0; transform: translateY(8px);
  transition: opacity .6s .15s ease, transform .6s .15s ease;
  max-width: min(520px, 92vw);
}
.ls-badges--in { opacity: 1; transform: translateY(0); }
.ls-badge {
  display: inline-flex; align-items: center;
  padding: 2px 8px;
  border: 1px solid; border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 0.46rem; letter-spacing: 0.14em;
  background: rgba(34,211,238,0.025);
  opacity: 0; animation: ls-fin 0.4s ease both;
}

/* === COMPILE LOG === */
.ls-log {
  font-family: 'Courier New', monospace;
  font-size: 0.5rem; line-height: 1.9; letter-spacing: 0.1em;
  margin: 0 0 12px; min-height: 5.4rem;
  width: clamp(240px, 40vw, 440px);
  opacity: 0; transition: opacity .35s ease;
}
.ls-log--in { opacity: 1; }
.ls-logline {
  display: flex; align-items: center; gap: 8px;
  animation: ls-fin 0.25s ease both;
}
.ls-logsym { width: 1em; text-align: center; flex-shrink: 0; }
.ls-logtext { opacity: 0.82; }

/* === PROGRESS BAR === */
.ls-prog {
  width: clamp(240px, 40vw, 440px);
  opacity: 0; transform: translateY(6px);
  transition: opacity .5s .1s ease, transform .5s .1s ease;
}
.ls-prog--in { opacity: 1; transform: translateY(0); }
.ls-track {
  position: relative; height: 2px;
  background: rgba(34,211,238,0.07);
  margin-bottom: 9px; overflow: visible;
}
.ls-track::before {
  content:''; position: absolute; bottom: -5px; left: 0; right: 0; height: 1px;
  background: repeating-linear-gradient(90deg,
    rgba(34,211,238,.14) 0, rgba(34,211,238,.14) 1px, transparent 1px, transparent 10%);
}
.ls-fill {
  height: 100%;
  background: linear-gradient(90deg, #6d28d9 0%, #2563eb 45%, #22d3ee 100%);
  transition: width .07s linear;
  box-shadow: 0 0 10px rgba(34,211,238,.5), 0 0 24px rgba(34,211,238,.2);
}
.ls-glowtip {
  position: absolute; top: 50%; transform: translate(-50%,-50%);
  width: 7px; height: 7px; border-radius: 50%; background: #fff;
  box-shadow: 0 0 6px #22d3ee, 0 0 18px rgba(34,211,238,.85), 0 0 40px rgba(34,211,238,.35);
  transition: left .07s linear;
}
.ls-meta {
  display: flex; justify-content: space-between; align-items: center;
  font-family: 'Courier New', monospace;
  font-size: 0.48rem; letter-spacing: 0.16em; text-transform: uppercase;
}
.ls-stage { color: rgba(34,211,238,0.42); }
.ls-pct { color: rgba(34,211,238,0.7); font-variant-numeric: tabular-nums; font-size: 0.6rem; }

/* === BOTTOM TECH BAR === */
.ls-botbar {
  position: absolute; bottom: 0; left: 0; right: 0; height: 38px;
  display: flex; align-items: center; justify-content: center; flex-wrap: nowrap;
  gap: 0;
  border-top: 1px solid rgba(34,211,238,0.06);
  font-family: 'Courier New', monospace;
  font-size: 0.47rem; letter-spacing: 0.2em;
  color: rgba(34,211,238,0.2); text-transform: uppercase;
  opacity: 0; animation: ls-fin 0.5s 0.4s ease both;
  overflow: hidden; white-space: nowrap;
}
.ls-bsep { opacity: 0.4; padding: 0 2px; }
`;
