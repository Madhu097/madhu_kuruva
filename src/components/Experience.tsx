import { useEffect, useRef, useState } from 'react';

const BOOT_LINES = [
  { text: '> Connecting to career database...', delay: 0 },
  { text: '> Loading experience records...', delay: 320 },
  { text: '> Found: 2 active roles', delay: 640 },
  { text: '> Organization: F1RSTLOOK DIGITAL', delay: 960 },
  { text: '> Roles: Operations Head · Web Developer', delay: 1280 },
  { text: '> Status: ██████████ ACTIVE', delay: 1600 },
  { text: '> Rendering profile...', delay: 1920 },
];

const responsibilities = [
  'Leading day-to-day digital operations and managing internal workflows',
  'Designed and developed the official F1RSTLOOK website (firstlook.digital)',
  'Built responsive UI, integrated brand identity and optimized performance',
  'Bridging brand strategy with execution through digital tools and tech',
  'Overseeing product launches, campaigns and client deliverables',
  'Driving growth systems, automation and process optimization',
];

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [isBooted, setIsBooted] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [glitching, setGlitching] = useState(false);

  // Intersection observer triggers boot
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          BOOT_LINES.forEach(({ text, delay }) => {
            setTimeout(() => {
              setBootLines(prev => [...prev, text]);
            }, delay);
          });
          setTimeout(() => setIsBooted(true), 2600);
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [isVisible]);

  // Random glitch trigger — less frequent
  useEffect(() => {
    if (!isBooted) return;
    const id = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 150);
    }, 6000);
    return () => clearInterval(id);
  }, [isBooted]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouse({ x, y });
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#060610] py-20 px-4 sm:px-6 overflow-hidden min-h-screen flex flex-col justify-center"
    >
      {/* Grid background */}
      <div className="absolute inset-0 opacity-[0.035]" style={{
        backgroundImage: 'linear-gradient(rgba(34,211,238,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.6) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
      }} />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(34,211,238,0.04) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto relative z-10 w-full">

        {/* ── Header ── */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-cyan-400/60 text-xs tracking-[0.5em] uppercase mb-3">Work History</p>
          <h2 className="text-5xl sm:text-6xl font-bold text-white">Experience</h2>
        </div>

        {/* ── Boot Terminal ── */}
        {!isBooted && (
          <div
            className={`max-w-xl mx-auto rounded-xl p-6 font-mono text-sm transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            style={{
              background: 'rgba(0,255,200,0.03)',
              border: '1px solid rgba(34,211,238,0.2)',
            }}
          >
            {bootLines.map((line, i) => (
              <div
                key={i}
                className="leading-7"
                style={{
                  color: line.includes('ACTIVE') ? '#4ade80' : line.includes('F1RSTLOOK') ? '#22d3ee' : 'rgba(255,255,255,0.55)',
                  animation: 'fadeSlideIn 0.3s ease forwards',
                }}
              >
                {line}
              </div>
            ))}
            {bootLines.length < BOOT_LINES.length && (
              <span className="text-cyan-400 blink-cursor">█</span>
            )}
          </div>
        )}

        {/* ── Main Experience Card ── */}
        {isBooted && (
          <div
            ref={cardRef}
            className="relative mx-auto w-full experience-card-wrap"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setMouse({ x: 0, y: 0 })}
            style={{
              transform: `perspective(1200px) rotateY(${mouse.x * 14}deg) rotateX(${-mouse.y * 14}deg)`,
              transition: 'transform 0.1s linear',
              transformStyle: 'preserve-3d',
              animation: 'cardReveal 0.8s cubic-bezier(0.22,1,0.36,1) forwards',
            }}
          >

            {/* Card body */}
            <div
              className="relative overflow-hidden rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(12,12,28,0.97) 0%, rgba(8,8,20,0.97) 100%)',
                border: '1px solid rgba(34,211,238,0.12)',
                zIndex: 1,
              }}
            >
              {/* Scan line — pure CSS, no JS state */}
              <div className="scan-line absolute left-0 right-0 pointer-events-none" style={{ zIndex: 20 }} />

              {/* Content */}
              <div className="p-8 sm:p-10">

                {/* Top row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8">
                  <div>
                    {/* Company */}
                    <a
                      href="https://firstlook.digital/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-3 mb-3"
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #22d3ee22, #8b5cf622)', border: '1px solid rgba(34,211,238,0.3)' }}>
                        <span className="text-cyan-400 font-black text-xs">F1</span>
                      </div>
                      <span
                        className="text-xl sm:text-2xl font-black tracking-wide inline-flex"
                        style={{
                          transform: glitching ? 'skewX(-4deg)' : 'none',
                          transition: 'all 0.05s',
                          letterSpacing: glitching ? '0.12em' : '0.04em',
                          filter: glitching ? 'drop-shadow(2px 0 #ff6b00) drop-shadow(-2px 0 #fff)' : 'none',
                        }}
                      >
                        {/* F1RSTLOOK — F,R,S,T = orange · 1,L,O,O,K = white */}
                        {[
                          { char: 'F', orange: true  },
                          { char: '1', orange: false },
                          { char: 'R', orange: true  },
                          { char: 'S', orange: true  },
                          { char: 'T', orange: true  },
                          { char: 'L', orange: false },
                          { char: 'O', orange: false },
                          { char: 'O', orange: false },
                          { char: 'K', orange: false },
                        ].map(({ char, orange }, i) => (
                          <span
                            key={i}
                            style={{
                              color: orange
                                ? (glitching ? '#ff0000' : '#FF6B00')
                                : (glitching ? '#ff9900' : '#ffffff'),
                              textShadow: orange
                                ? `0 0 18px rgba(255,107,0,${glitching ? 1 : 0.5})`
                                : 'none',
                            }}
                          >
                            {char}
                          </span>
                        ))}
                      </span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-400/40 group-hover:text-cyan-400 transition-colors">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                      </svg>
                    </a>
                    <p className="text-gray-500 text-sm tracking-widest uppercase">firstlook.digital</p>
                  </div>

                  {/* Status badge */}
                  <div className="flex flex-col items-start sm:items-end gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                      style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.3)' }}>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                      </span>
                      <span className="text-green-400 text-xs font-semibold tracking-widest uppercase">Active</span>
                    </div>
                    <p className="text-gray-600 text-xs font-mono">2025 — Present</p>
                  </div>
                </div>

                {/* Dual Roles */}
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {/* Role 1 */}
                  <div className="p-5 rounded-xl" style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.2)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.2)' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
                      </div>
                      <span className="text-purple-400 text-xs tracking-widest uppercase font-semibold">Operations</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">Operations Head</h3>
                    <p className="text-gray-500 text-xs">Digital Startup · Full-time</p>
                  </div>
                  {/* Role 2 */}
                  <div className="p-5 rounded-xl" style={{ background: 'rgba(34,211,238,0.07)', border: '1px solid rgba(34,211,238,0.2)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(34,211,238,0.2)' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                      </div>
                      <span className="text-cyan-400 text-xs tracking-widest uppercase font-semibold">Engineering</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">Web Developer</h3>
                    <p className="text-gray-500 text-xs">Designed & built firstlook.digital</p>
                  </div>
                </div>

                {/* Responsibilities */}
                <div>
                  <p className="text-xs text-cyan-400/60 tracking-widest uppercase mb-4 font-mono">— Key Responsibilities</p>
                  <div className="space-y-3">
                    {responsibilities.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 group"
                        style={{
                          animation: `slideInRight 0.5s ease forwards`,
                          animationDelay: `${i * 80}ms`,
                          opacity: 0,
                        }}
                      >
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 group-hover:scale-150 transition-transform duration-300"
                          style={{ background: 'linear-gradient(135deg, #22d3ee, #8b5cf6)' }} />
                        <span className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-200 transition-colors duration-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom row */}
                <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-2">
                  {['Operations', 'Strategy', 'Digital Marketing', 'React', 'Web Dev', 'UI/UX', 'Team Leadership', 'Growth'].map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium text-gray-400 transition-all duration-300 hover:text-cyan-400"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating particles — reduced to 4 */}
            {[...Array(4)].map((_, i) => (
              <div key={i}
                className="absolute w-1 h-1 rounded-full pointer-events-none"
                style={{
                  background: i % 2 === 0 ? '#22d3ee' : '#8b5cf6',
                  opacity: 0.35,
                  top: `${20 + (i * 22)}%`,
                  left: i % 2 === 0 ? `-6px` : `auto`,
                  right: i % 2 !== 0 ? `-6px` : `auto`,
                  animation: `floatParticle ${4 + i * 0.6}s ease-in-out infinite alternate`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        @keyframes cardReveal {
          from { opacity: 0; transform: perspective(1200px) translateY(40px) scale(0.95); }
          to   { opacity: 1; transform: perspective(1200px) translateY(0) scale(1); }
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        @keyframes floatParticle {
          from { transform: translateY(-10px) scale(1); }
          to   { transform: translateY(10px) scale(1.4); }
        }

        .blink-cursor {
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

      `}</style>
    </section>
  );
}
