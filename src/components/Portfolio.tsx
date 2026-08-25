import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import DesignerImg from '../assets/Designer.jpg';
import FoodImg from '../assets/food remainder.png';
import HomecoImg from '../assets/homeco.png';
import Habitracker from '../assets/habit tracking.png';
import RealestateImg from '../assets/realestate.jpg';

const projects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    category: 'Full Stack',
    description: 'MartVibe – Grocery E-commerce Platform: Built a responsive grocery shopping website with product browsing, cart management, and online ordering.',
    image: DesignerImg,
    tags: ['React', 'Nodejs', 'Express', 'MongoDB'],
    color: '#22d3ee',
    github: 'https://github.com/Madhu097/martvibe',
    live: 'https://mart-vibe.vercel.app/',
  },
  {
    id: 2,
    title: 'Food Remainder',
    category: 'React App',
    description: 'A food remainder app with real-time inventory management',
    image: FoodImg,
    tags: ['React', 'Node.js', 'PostgreSQL'],
    color: '#a78bfa',
    github: 'https://github.com/Madhu097/foodremainder',
    live: 'https://foodremainder.vercel.app/',
  },
  {
    id: 3,
    title: 'HomeCo Services',
    category: 'Web Services',
    description: 'A home services website find all type of services ',
    image: HomecoImg,
    tags: ['React', 'JavaScript', 'Firebase'],
    color: '#3b82f6',
    github: 'https://github.com/Madhu097/HomeCo-Service',
    live: 'https://homeco-service.onrender.com/',
  },
  {
    id: 4,
    title: 'Habit Tracker',
    category: 'Productivity',
    description: 'Track all your habits in one place with HabitFlow, goals, steak, monthly report and more',
    image: Habitracker,
    tags: ['React Native', 'Firebase'],
    color: '#10b981',
    github: 'https://github.com/Madhu097/Habit-tracker',
    live: 'https://habit-trackings.vercel.app/',
  },
  {
    id: 5,
    title: 'Real Estate Listing',
    category: 'Real Estate',
    description: 'Detects realestate properties and displays risk percentage, details',
    image: RealestateImg,
    tags: ["React", "Python", "Firebase"],
    color: '#f59e0b',
    github: 'https://github.com/Madhu097/realestate-fraud-frontend',
    live: 'https://realestate-fraud-frontend.vercel.app/',
  },
];

export default function Portfolio() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty('--rx', `${-y * 12}deg`);
    card.style.setProperty('--ry', `${x * 12}deg`);
    card.style.setProperty('--tx', `${x * -14}px`);
    card.style.setProperty('--ty', `${y * -14}px`);
    card.style.setProperty('--mx', `${(x + 0.5) * 100}%`);
    card.style.setProperty('--my', `${(y + 0.5) * 100}%`);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
    card.style.setProperty('--tx', '0px');
    card.style.setProperty('--ty', '0px');
    card.style.setProperty('--mx', '50%');
    card.style.setProperty('--my', '50%');
  };

  return (
    <section ref={sectionRef} className="py-24 bg-background overflow-hidden relative" id="portfolio">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accentHover/5 rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className={`mb-20 space-y-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-accent" />
            <span className="text-accent font-mono text-sm tracking-widest uppercase">Portfolio</span>
          </div>
          <h2 className="font-syne text-5xl sm:text-7xl font-bold text-white leading-none">
            CREATIVE <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/20">WORKS</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-24">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`project-card group relative transition-all duration-1000 ${
                isVisible 
                  ? 'opacity-100 translate-y-0 translate-x-0' 
                  : `opacity-0 translate-y-20 ${index % 2 === 0 ? '-translate-x-10' : 'translate-x-10'}`
              }`}
              style={{
                transitionDelay: `${index * 120}ms`,
                perspective: '1000px',
                '--rx': '0deg',
                '--ry': '0deg',
                '--tx': '0px',
                '--ty': '0px',
              } as React.CSSProperties}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Parallax Container */}
              <div 
                className="relative overflow-hidden rounded-3xl aspect-[16/10] sm:aspect-[16/9] bg-card transition-transform duration-200 ease-out preserve-3d"
                style={{
                  transform: 'rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Background Image with Deep Parallax */}
                <div 
                  className="absolute inset-[-10%] transition-transform duration-300 ease-out"
                  style={{
                    transform: 'translate3d(var(--tx, 0px), var(--ty, 0px), 0) scale(1.06)',
                  }}
                >
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700" />
                  {/* Better Contrast Overlays */}
                  <div className="absolute inset-0 bg-background/40" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-background/50 to-transparent pointer-events-none" />
                </div>

                {/* Floating Content (Z-layer 1) */}
                <div 
                  className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 transition-transform duration-300 preserve-3d"
                  style={{ transform: 'translateZ(50px)' }}
                >
                  <div className="space-y-4 relative z-10">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-card border border-border text-xs font-bold text-primaryText backdrop-blur-md uppercase tracking-widest drop-shadow-sm">
                      {project.category}
                    </span>
                    <h3 className="font-syne text-3xl sm:text-5xl font-bold text-white group-hover:text-accent transition-colors duration-300 drop-shadow-lg">
                      {project.title}
                    </h3>
                    <p className="max-w-md text-secondaryText text-sm sm:text-base line-clamp-2 transform translate-z-10 group-hover:text-primaryText transition-colors duration-300 drop-shadow">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-[10px] text-accent font-mono font-bold flex items-center gap-1.5 drop-shadow-sm">
                          <span className="w-1.5 h-1.5 bg-accent rounded-full shadow-[0_0_8px_rgba(10,132,255,0.8)]" /> {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions (Z-layer 2) */}
                <div 
                  className="absolute top-8 right-8 flex flex-col gap-3 transition-all duration-500 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 preserve-3d"
                  style={{ transform: 'translateZ(80px)' }}
                >
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-card border border-border hover:bg-accent text-primaryText transition-all backdrop-blur-xl">
                    <Github size={20} />
                  </a>
                  <a href={project.live} target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-card border border-border hover:bg-accent text-primaryText transition-all backdrop-blur-xl">
                    <ExternalLink size={20} />
                  </a>
                </div>

                {/* Number Indicator */}
                <div className="absolute top-8 left-8 text-border/30 font-bold text-8xl pointer-events-none select-none">
                  0{index + 1}
                </div>

                {/* Holographic Mouse Shine */}
                <div 
                  className="absolute pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-30"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 70%)',
                    width: '300px',
                    height: '300px',
                    left: 'var(--mx, 50%)',
                    top: 'var(--my, 50%)',
                    transform: 'translate(-50%, -50%)',
                    mixBlendMode: 'soft-light'
                  }}
                />
              </div>

            </div>
          ))}
        </div>
      </div>

      <style>{`
        .preserve-3d {
          transform-style: preserve-3d;
        }
        
        .translate-z-10 {
          transform: translateZ(10px);
        }

        .project-card:nth-child(even) {
          margin-top: 0;
        }

        @media (min-width: 1024px) {
          .project-card:nth-child(even) {
            margin-top: 120px;
          }
        }

        .project-card:hover {
          z-index: 50;
        }
      `}</style>
    </section>
  );
}
