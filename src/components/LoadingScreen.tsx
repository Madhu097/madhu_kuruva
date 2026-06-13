import { useEffect, useState, useRef } from 'react';

export default function LoadingScreen() {
  const [phase, setPhase]     = useState<'loading' | 'reveal' | 'done'>('loading');
  const [progress, setProgress] = useState(0);
  const rafRef   = useRef<number>(0);
  const startRef = useRef(0);

  useEffect(() => {
    // Animate a fake-but-smooth progress bar over ~1.8s
    startRef.current = performance.now();
    const DURATION = 1800;

    const step = (now: number) => {
      const elapsed = now - startRef.current;
      const raw     = Math.min(elapsed / DURATION, 1);
      // ease-out so it starts fast and slows near 100%
      const eased   = 1 - Math.pow(1 - raw, 2.5);
      setProgress(Math.floor(eased * 100));

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        // Progress complete → start reveal fade-out
        setPhase('reveal');
        setTimeout(() => setPhase('done'), 700);
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  if (phase === 'done') return null;

  return (
    <>
      <style>{`
        /* Loading screen */
        .ls-root {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #06060e;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: opacity 0.65s cubic-bezier(0.4, 0, 0.2, 1),
                      visibility 0.65s;
        }
        .ls-root.reveal {
          opacity: 0;
          visibility: hidden;
        }

        /* Central monogram ring */
        .ls-ring {
          position: relative;
          width: 110px;
          height: 110px;
          margin-bottom: 2.8rem;
        }
        .ls-ring svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          animation: ls-spin 1.6s linear infinite;
        }
        @keyframes ls-spin {
          to { transform: rotate(360deg); }
        }
        .ls-initials {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 1.9rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.05em;
          text-shadow: 0 0 30px rgba(100,180,255,0.6);
        }

        /* Name */
        .ls-name {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.5rem, 4vw, 2.4rem);
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          opacity: 0;
          animation: ls-name-rise 0.7s 0.3s cubic-bezier(0.22,1,0.36,1) forwards;
          text-shadow: 0 0 40px rgba(100,170,255,0.40);
        }
        @keyframes ls-name-rise {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0);    }
        }

        .ls-tagline {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(0.6rem, 1.4vw, 0.75rem);
          font-weight: 400;
          color: rgba(130,200,255,0.55);
          letter-spacing: 0.40em;
          text-transform: uppercase;
          margin-top: 0.6em;
          opacity: 0;
          animation: ls-name-rise 0.7s 0.55s cubic-bezier(0.22,1,0.36,1) forwards;
        }

        /* Progress bar */
        .ls-bar-wrap {
          margin-top: 3rem;
          width: clamp(180px, 28vw, 320px);
          height: 2px;
          background: rgba(255,255,255,0.08);
          border-radius: 999px;
          overflow: hidden;
        }
        .ls-bar {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg,
            rgba(80,160,255,0.9),
            rgba(160,100,255,0.9)
          );
          box-shadow: 0 0 12px rgba(100,160,255,0.5);
          transition: width 0.05s linear;
        }
        .ls-pct {
          margin-top: 0.8em;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.7rem;
          color: rgba(130,200,255,0.45);
          letter-spacing: 0.22em;
        }

        /* Noise texture overlay for depth */
        .ls-noise {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          background-size: 200px 200px;
          pointer-events: none;
          opacity: 0.4;
        }
      `}</style>

      <div className={`ls-root${phase === 'reveal' ? ' reveal' : ''}`}>
        <div className="ls-noise" />

        {/* Spinning ring */}
        <div className="ls-ring">
          <svg viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="44" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
            <circle
              cx="50" cy="50" r="44"
              stroke="url(#ls-grad)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="180 96"
            />
            <defs>
              <linearGradient id="ls-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%"   stopColor="rgba(80,160,255,0.95)" />
                <stop offset="100%" stopColor="rgba(160,100,255,0.95)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="ls-initials">MK</div>
        </div>

        {/* Name & tagline */}
        <div className="ls-name">Madhu Kuruva</div>
        <div className="ls-tagline">Portfolio</div>

        {/* Progress bar */}
        <div className="ls-bar-wrap">
          <div className="ls-bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="ls-pct">{progress}%</div>
      </div>
    </>
  );
}
