import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Github, Eye } from 'lucide-react';
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
    description: 'A modern e-commerce platform with real-time inventory management',
    image: DesignerImg,
    tags: ['HTML', 'CSS', 'JavaScript'],
    color: '#22d3ee',
    github: 'https://github.com/Madhu097/shopify',
    live: 'https://madhu097.github.io/shopify/',
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, id: null });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, id: number | null) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y, id });
  };

  return (
    <section ref={sectionRef} className="py-24 bg-[#080810] overflow-hidden relative" id="portfolio">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className={`mb-20 space-y-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-cyan-500" />
            <span className="text-cyan-400 font-mono text-sm tracking-widest uppercase">Portfolio</span>
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
              style={{ transitionDelay: `${index * 150}ms`, perspective: '1000px' }}
              onMouseMove={(e) => handleMouseMove(e, project.id)}
              onMouseLeave={() => setMousePos({ x: 0, y: 0, id: null })}
            >
              {/* Parallax Container */}
              <div 
                className="relative overflow-hidden rounded-3xl aspect-[16/10] sm:aspect-[16/9] bg-[#1a1a24] transition-transform duration-300 ease-out preserve-3d"
                style={{
                  transform: mousePos.id === project.id 
                    ? `rotateY(${mousePos.x * 15}deg) rotateX(${-mousePos.y * 15}deg)` 
                    : 'rotateY(0deg) rotateX(0deg)'
                }}
              >
                {/* Background Image with Deep Parallax */}
                <div 
                  className="absolute inset-[-10%] transition-transform duration-500 ease-out"
                  style={{
                    transform: mousePos.id === project.id 
                      ? `translate3d(${mousePos.x * -20}px, ${mousePos.y * -20}px, 0) scale(1.1)` 
                      : 'translate3d(0, 0, 0) scale(1)'
                  }}
                >
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700" />
                  {/* Better Contrast Overlays */}
                  <div className="absolute inset-0 bg-[#080810]/40" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080810] via-[#080810]/60 to-transparent opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#080810]/50 to-transparent pointer-events-none" />
                </div>

                {/* Floating Content (Z-layer 1) */}
                <div 
                  className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 transition-transform duration-300 preserve-3d"
                  style={{ transform: 'translateZ(50px)' }}
                >
                  <div className="space-y-4 relative z-10">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-white backdrop-blur-md uppercase tracking-widest drop-shadow-sm">
                      {project.category}
                    </span>
                    <h3 className="font-syne text-3xl sm:text-5xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300 drop-shadow-lg">
                      {project.title}
                    </h3>
                    <p className="max-w-md text-gray-300 text-sm sm:text-base line-clamp-2 transform translate-z-10 group-hover:text-white transition-colors duration-300 drop-shadow">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-[10px] text-cyan-400 font-mono font-bold flex items-center gap-1.5 drop-shadow-sm">
                          <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" /> {tag}
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
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-white/10 hover:bg-cyan-500 text-white transition-all backdrop-blur-xl">
                    <Github size={20} />
                  </a>
                  <a href={project.live} target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-white/10 hover:bg-cyan-500 text-white transition-all backdrop-blur-xl">
                    <ExternalLink size={20} />
                  </a>
                </div>

                {/* Number Indicator */}
                <div className="absolute top-8 left-8 text-white/10 font-bold text-8xl pointer-events-none select-none">
                  0{index + 1}
                </div>

                {/* Holographic Mouse Shine */}
                <div 
                  className="absolute pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-30"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 70%)',
                    width: '300px',
                    height: '300px',
                    left: `${(mousePos.x + 0.5) * 100}%`,
                    top: `${(mousePos.y + 0.5) * 100}%`,
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
