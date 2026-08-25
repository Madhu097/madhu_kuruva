import { useEffect, useRef, useState } from 'react';

const D = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';

const techs = [
  { name: 'React', logo: `${D}/react/react-original.svg`, color: '#61DAFB', bg: 'rgba(97,218,251,0.1)', category: 'Frontend' },
  { name: 'JavaScript', logo: `${D}/javascript/javascript-original.svg`, color: '#F7DF1E', bg: 'rgba(247,223,30,0.1)', category: 'Frontend' },
  { name: 'HTML5', logo: `${D}/html5/html5-original.svg`, color: '#E34F26', bg: 'rgba(227,79,38,0.1)', category: 'Frontend' },
  { name: 'CSS3', logo: `${D}/css3/css3-original.svg`, color: '#1572B6', bg: 'rgba(21,114,182,0.1)', category: 'Frontend' },
  { name: 'Python', logo: `${D}/python/python-original.svg`, color: '#3776AB', bg: 'rgba(55,118,171,0.1)', category: 'Backend' },
  { name: 'Node.js', logo: `${D}/nodejs/nodejs-original.svg`, color: '#68A063', bg: 'rgba(104,160,99,0.1)', category: 'Backend' },
  { name: 'Express.js', logo: 'https://cdn.simpleicons.org/express/FFFFFF', color: '#FFFFFF', bg: 'rgba(255,255,255,0.08)', category: 'Backend' },
  { name: 'MongoDB', logo: `${D}/mongodb/mongodb-original.svg`, color: '#47A248', bg: 'rgba(71,162,72,0.1)', category: 'Database' },
  { name: 'MySQL', logo: `${D}/mysql/mysql-original.svg`, color: '#4479A1', bg: 'rgba(68,121,161,0.1)', category: 'Database' },
  { name: 'Firebase', logo: `${D}/firebase/firebase-plain.svg`, color: '#FFCA28', bg: 'rgba(255,202,40,0.1)', category: 'Database' },
  { name: 'Git', logo: `${D}/git/git-original.svg`, color: '#F05032', bg: 'rgba(240,80,50,0.1)', category: 'Tools' },
  { name: 'GitHub', logo: 'https://cdn.simpleicons.org/github/FFFFFF', color: '#FFFFFF', bg: 'rgba(255,255,255,0.08)', category: 'Tools' },
  { name: 'AWS', logo: `${D}/amazonwebservices/amazonwebservices-plain-wordmark.svg`, color: '#FF9900', bg: 'rgba(255,153,0,0.1)', category: 'Tools' },
  { name: 'Vercel', logo: 'https://cdn.simpleicons.org/vercel/FFFFFF', color: '#FFFFFF', bg: 'rgba(255,255,255,0.08)', category: 'Tools' },
  { name: 'Figma', logo: `${D}/figma/figma-original.svg`, color: '#F24E1E', bg: 'rgba(242,78,30,0.1)', category: 'Design' },
  { name: 'VS Code', logo: `${D}/vscode/vscode-original.svg`, color: '#007ACC', bg: 'rgba(0,122,204,0.1)', category: 'Tools' },
];

const categories = ['All', 'Frontend', 'Backend', 'Database', 'Tools', 'Design'];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { setIsVisible(entry.isIntersecting); },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const filtered = activeFilter === 'All'
    ? techs
    : techs.filter(t => t.category === activeFilter);

  // Float animations stagger offsets (seconds)
  const floatOffsets = [0, 0.4, 0.8, 1.2, 1.6, 0.2, 0.6, 1.0, 1.4, 1.8, 0.3, 0.7, 1.1, 1.5, 1.9, 0.5, 0.9, 1.3, 1.7, 0.1, 0.45, 0.85];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-background py-20 px-4 sm:px-6 overflow-hidden"
    >
      {/* Floating tech logos as minimal background decoration */}
      {[
        { logo: techs[0].logo, top: '8%',  left: '4%',  size: 36, opacity: 0.07 },
        { logo: techs[1].logo, top: '18%', left: '91%', size: 30, opacity: 0.06 },
        { logo: techs[4].logo, top: '35%', left: '3%',  size: 28, opacity: 0.06 },
        { logo: techs[2].logo, top: '55%', left: '93%', size: 34, opacity: 0.07 },
        { logo: techs[7].logo, top: '70%', left: '6%',  size: 30, opacity: 0.05 },
        { logo: techs[5].logo, top: '82%', left: '88%', size: 32, opacity: 0.06 },
        { logo: techs[10].logo,top: '12%', left: '50%', size: 26, opacity: 0.05 },
        { logo: techs[14].logo,top: '90%', left: '45%', size: 28, opacity: 0.05 },
      ].map((item, i) => (
        <img
          key={i}
          src={item.logo}
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute', top: item.top, left: item.left,
            width: item.size, height: item.size,
            opacity: item.opacity,
            filter: 'grayscale(1) brightness(2)',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />
      ))}

      {/* Subtle ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full blur-[140px] pointer-events-none"
        style={{ background: 'rgba(10,132,255,0.05)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[140px] pointer-events-none"
        style={{ background: 'rgba(99,102,241,0.04)' }} />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ── Header ── */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
            Tech Stack
          </h2>
          <p className="text-secondaryText text-base max-w-md mx-auto drop-shadow-md">
            Technologies I work with daily to build fast, scalable, beautiful products.
          </p>
        </div>

        {/* ── Filter Pills ── */}
        <div className={`flex flex-wrap justify-center gap-2 mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className="relative px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 overflow-hidden"
              style={{
                color: activeFilter === cat ? 'var(--color-background)' : 'var(--color-secondary-text)',
                background: activeFilter === cat
                  ? 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))'
                  : 'var(--color-card)',
                border: `1px solid ${activeFilter === cat ? 'transparent' : 'var(--color-border)'}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Tech Grid ── */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
          {filtered.map((tech, i) => {
            const isHovered = hoveredIdx === i;
            const delay = floatOffsets[i % floatOffsets.length];

            return (
              <div
                key={`${activeFilter}-${tech.name}`}
                className="relative group skill-card"
                style={{
                  animationDelay: `${delay}s`,
                  '--float-delay': `${delay}s`,
                  opacity: isVisible ? 1 : 0,
                  transition: `opacity 0.6s ease ${(i * 40)}ms, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)`,
                  transform: isVisible ? 'scale(1)' : 'scale(0.5)',
                } as React.CSSProperties}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Card */}
                <div
                  className="relative w-24 sm:w-28 h-24 sm:h-28 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 cursor-pointer overflow-hidden"
                  style={{
                    background: isHovered ? tech.bg : 'var(--color-card)',
                    border: `1px solid ${isHovered ? tech.color + '55' : 'var(--color-border)'}`,
                    transform: isHovered ? 'translateY(-10px) scale(1.08)' : 'translateY(0px) scale(1)',
                    boxShadow: isHovered ? `0 20px 60px ${tech.color}30, 0 0 0 1px ${tech.color}22` : 'none',
                  }}
                >
                  {/* Shimmer beam on hover */}
                  {isHovered && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                      <div className="shimmer-beam" />
                    </div>
                  )}

                  {/* Glow circle behind logo */}
                  <div
                    className="absolute inset-0 rounded-2xl transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at 50% 40%, ${tech.color}18, transparent 70%)`,
                      opacity: isHovered ? 1 : 0,
                    }}
                  />

                  {/* Logo */}
                  <img
                    src={tech.logo}
                    alt={tech.name}
                    className="relative z-10 transition-all duration-300"
                    style={{
                      width: isHovered ? 44 : 36,
                      height: isHovered ? 44 : 36,
                      filter: `drop-shadow(0 0 ${isHovered ? '12px' : '0px'} ${tech.color}88)`,
                    }}
                    draggable={false}
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback && fallback.classList.contains('logo-fallback')) {
                        fallback.style.display = 'flex';
                      }
                    }}
                  />
                  {/* Fallback if logo fails */}
                  <div
                    className="logo-fallback relative z-10 items-center justify-center rounded-lg text-sm font-bold transition-all duration-300"
                    style={{
                      display: 'none',
                      width: isHovered ? 44 : 36,
                      height: isHovered ? 44 : 36,
                      background: tech.bg,
                      border: `1px solid ${tech.color}44`,
                      color: tech.color,
                    }}
                  >
                    {tech.name.charAt(0)}
                  </div>

                  {/* Name */}
                  <span
                    className="relative z-10 text-[11px] font-semibold tracking-wide transition-all duration-300"
                    style={{ color: isHovered ? tech.color : 'var(--color-secondary-text)' }}
                  >
                    {tech.name}
                  </span>

                  {/* Bottom glow bar */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full transition-all duration-300"
                    style={{
                      background: `linear-gradient(to right, transparent, ${tech.color}, transparent)`,
                      opacity: isHovered ? 1 : 0,
                      transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

      </div>

      <style>{`
        .skill-card {
          animation: floatCard 4s ease-in-out infinite;
          animation-delay: var(--float-delay, 0s);
        }

        @keyframes floatCard {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        .skill-card:hover {
          animation-play-state: paused;
        }

        .shimmer-beam {
          position: absolute;
          top: -50%;
          left: -75%;
          width: 50%;
          height: 200%;
          background: linear-gradient(
            105deg,
            transparent 40%,
            rgba(255,255,255,0.15) 50%,
            transparent 60%
          );
          transform: skewX(-20deg);
          animation: shimberBeam 0.8s ease forwards;
        }

        @keyframes shimberBeam {
          from { left: -75%; }
          to   { left: 125%; }
        }
      `}</style>
    </section>
  );
}
