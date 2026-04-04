import { useEffect, useRef, useState } from 'react';
import { Award, Trophy, Star, Sparkles, Medal, Shield, ExternalLink, ArrowRight, ArrowLeft } from 'lucide-react';

const certifications = [
  {
    id: 1,
    title: 'Udemy Full Stack',
    issuer: 'Sara Academy',
    date: '2025',
    icon: Shield,
    color: '#22d3ee',
    description: 'HTML, CSS, Java, & JavaScript: Full Stack Programming Course',
    url: 'https://drive.google.com/file/d/1Fgf7v1H0OTpPNv0EY95uBgCmvAVl07nU/view',
  },
  {
    id: 2,
    title: 'Python for Data Science',
    issuer: 'Cognitive class.ai',
    date: '2024',
    icon: Award,
    color: '#a78bfa',
    description: 'Python 101 for Data Science - Foundation for Analytics',
    url: 'https://drive.google.com/file/d/1CiS4NMxk9M9EMco_3bWceTJBfYh4qZrC/view',
  },
  {
    id: 3,
    title: 'Web Dev Internship',
    issuer: 'pantech e Learning',
    date: '2025',
    icon: Sparkles,
    color: '#3b82f6',
    description: 'Practical industry experience in modern web technologies',
    url: 'https://drive.google.com/file/d/1iD7fk8LdTAkDJhe6-rlbL2TFu6iEf-NE/view',
  },
  {
    id: 4,
    title: 'Java Mastery',
    issuer: 'Simplelearn',
    date: '2025',
    icon: Trophy,
    color: '#f43f5e',
    description: 'Advanced Java programming and object-oriented design',
    url: 'https://drive.google.com/file/d/1qYxtOBU0OxWaXqE1__R9UUFhmmYuO1Me/view',
  },
  {
    id: 5,
    title: 'MySQL Expert',
    issuer: 'Udemy',
    date: '2024',
    icon: Star,
    color: '#fb923c',
    description: 'Relational database design and complex query optimization',
    url: 'https://drive.google.com/file/d/1NF3CUm55fnCbV4Y3uksVjcZyiFu_Wv5p/view',
  },
  {
    id: 6,
    title: 'Cloud & Edge ML',
    issuer: 'NPTEL',
    date: '2025',
    icon: Medal,
    color: '#2dd4bf',
    description: 'Cloud IoT architectures and Edge Machine Learning foundations',
    url: 'https://drive.google.com/file/d/1DFsCZBrEYIwXH0g7kWHcMC_uUH1gm1RU/view',
  },
  {
    id: 7,
    title: 'Data Job Simulation',
    issuer: 'Deloitte',
    date: '2025',
    icon: Shield,
    color: '#84cc16',
    description: 'Hands-on simulation of real-world data analytics workflows',
    url: 'https://drive.google.com/file/d/1kZwP-8Mo8O17_z6XN1xd-MszGf2blayS/view?usp=drive_open',
  }
];

export default function Certifications() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const rotationTimer = useRef<number | null>(null);

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % certifications.length);
  };

  const prev = () => {
    setActiveIndex((prev) => (prev - 1 + certifications.length) % certifications.length);
  };

  useEffect(() => {
    if (isAnimating) {
      rotationTimer.current = setInterval(next, 5000);
    }
    return () => {
      if (rotationTimer.current) clearInterval(rotationTimer.current);
    };
  }, [isAnimating]);

  return (
    <section className="py-20 bg-[#080812] overflow-hidden min-h-[750px] flex flex-col justify-center relative" id="certifications">
      {/* Background radial effects */}
      <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-[500px] bg-gradient-to-t from-purple-500/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 w-full relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-7xl font-bold text-white mb-6 uppercase tracking-tight">
            Certificates & <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-white animate-text-gradient">Awards</span>
          </h2>
          <div className="flex items-center justify-center gap-4">
             <div className="h-[1px] w-12 bg-white/10" />
             <div className="w-2 h-2 rounded-full border border-cyan-500 animate-ping" />
             <div className="h-[1px] w-12 bg-white/10" />
          </div>
        </div>

        {/* ── 3D CIRCULAR CAROUSEL ── */}
        <div className="relative h-[480px] w-full flex items-center justify-center perspective-[2000px]">
          
          {/* Static Ambient Base Light */}
          <div 
             className="absolute w-[600px] h-[300px] blur-[150px] transition-all duration-1000 opacity-20 pointer-events-none" 
             style={{ backgroundColor: certifications[activeIndex].color }}
          />

          {/* Carousel Wrapper */}
          <div className="relative w-full h-full flex items-center justify-center transition-transform duration-700 preserve-3d">
            {certifications.map((cert, index) => {
              // Calculate spatial positions
              const count = certifications.length;
              let diff = index - activeIndex;

              // Wrapped diff for shortest rotation path
              if (diff > count / 2) diff -= count;
              if (diff < -count / 2) diff += count;

              const absDiff = Math.abs(diff);
              const isActive = index === activeIndex;
              const Icon = cert.icon;

              // 3D placement logic
              const rotateY = diff * 45; // Spread items degrees
              const translateZ = 300 - absDiff * 120; // Move active closer
              const translateX = diff * 280; // Spread horizontally
              const opacity = Math.max(1 - absDiff * 0.4, 0);
              const scale = 1 - absDiff * 0.15;
              const blur = absDiff * 4;

              return (
                <div
                  key={cert.id}
                  className="absolute transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer preserve-3d"
                  style={{
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${-rotateY}deg) scale(${scale})`,
                    opacity: opacity,
                    filter: `blur(${blur}px)`,
                    zIndex: 100 - absDiff,
                    pointerEvents: absDiff > 1 ? 'none' : 'auto'
                  }}
                  onClick={() => {
                    setActiveIndex(index);
                    setIsAnimating(false);
                  }}
                  onMouseEnter={() => setIsAnimating(false)}
                  onMouseLeave={() => setIsAnimating(true)}
                >
                  {/* The Card Plate */}
                  <div 
                    className={`relative w-[300px] sm:w-[380px] h-[420px] rounded-[3rem] p-1 border overflow-hidden transition-all duration-500 ${
                        isActive ? 'shadow-[0_0_80px_rgba(34,211,238,0.15)] bg-white/10' : 'bg-white/5'
                    }`}
                    style={{ 
                      borderColor: isActive ? cert.color : 'rgba(255,255,255,0.05)',
                      backdropFilter: 'blur(20px)'
                    }}
                  >
                    {/* Inner content */}
                    <div className="h-full w-full rounded-[2.8rem] bg-gradient-to-br from-white/10 to-transparent p-8 flex flex-col items-center">
                      
                      {/* Floating Badge Header */}
                      <div 
                        className="mb-6 w-20 h-20 rounded-full flex items-center justify-center relative"
                        style={{ border: `1px solid ${cert.color}44` }}
                      >
                         {/* Spinning Aura */}
                         <div 
                            className="absolute inset-[-15%] rounded-full opacity-20 transition-all duration-1000"
                            style={{ 
                               border: `2px dashed ${cert.color}`,
                               animation: isActive ? 'spin 12s linear infinite' : 'none'
                            }}
                         />
                         
                         {/* Core Icon */}
                         <div 
                           className="w-14 h-14 rounded-full flex items-center justify-center z-10 transition-transform duration-700"
                           style={{ backgroundColor: `${cert.color}15` }}
                         >
                            <Icon size={28} style={{ color: cert.color }} className="drop-shadow-glow" />
                         </div>
                      </div>

                      {/* Main Info */}
                      <div className="flex-grow text-center w-full">
                         <h3 className={`text-xl sm:text-3xl font-bold text-white mb-4 uppercase tracking-tight transition-all duration-700 ${isActive ? 'scale-100' : 'scale-75'}`}>
                            {cert.title}
                         </h3>
                         <p className="text-gray-400 text-xs sm:text-sm leading-relaxed opacity-70 px-4">
                           {cert.description}
                         </p>
                      </div>

                      {/* Detail Footer */}
                      <div className="w-full mt-8 pt-8 border-t border-white/5 flex items-end justify-between">
                         <div className="text-left">
                           <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-1">Issued By</p>
                           <p className="text-sm font-bold text-white/80">{cert.issuer}</p>
                         </div>
                         <div className="flex flex-col items-end gap-3">
                           <span className="text-xs font-mono text-cyan-400/50">{cert.date}</span>
                           <a 
                             href={cert.url} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="group/link flex items-center gap-2"
                           >
                             <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/link:bg-white group-hover/link:text-black transition-all duration-300">
                               <ExternalLink size={16} />
                             </div>
                           </a>
                         </div>
                      </div>
                    </div>

                    {/* Glossy Scan Light Animation */}
                    {isActive && (
                      <div className="absolute inset-0 pointer-events-none opacity-20 bg-gradient-to-t from-transparent via-white to-transparent -translate-y-full animate-[scan_3s_linear_infinite]" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Navigation Controls ── */}
          <div className="absolute bottom-[-60px] flex items-center gap-12">
            <button 
              onClick={prev}
              className="group p-4 rounded-full border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-white/30 hover:text-cyan-400 transition-all"
            >
              <ArrowLeft size={24} className="group-active:scale-90 transition-transform" />
            </button>

            {/* Pagination Dots */}
            <div className="flex gap-3">
              {certifications.map((_, i) => (
                <div 
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${i === activeIndex ? 'w-10 bg-cyan-400' : 'w-2 bg-white/10'}`}
                />
              ))}
            </div>

            <button 
              onClick={next}
              className="group p-4 rounded-full border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-white/30 hover:text-cyan-400 transition-all"
            >
              <ArrowRight size={24} className="group-active:scale-90 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .preserve-3d { transform-style: preserve-3d; }
        .drop-shadow-glow { filter: drop-shadow(0 0 8px currentColor); }

        @keyframes scan {
          0% { transform: translateY(-100%) skewY(-20deg); }
          100% { transform: translateY(200%) skewY(-20deg); }
        }

        .animate-text-gradient {
            background-size: 200% auto;
            animation: textFlow 3s linear infinite;
        }

        @keyframes textFlow {
            to { background-position: 200% center; }
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
           .perspective-[2000px] {
              perspective: 1000px;
           }
        }
      `}</style>
    </section>
  );
}
