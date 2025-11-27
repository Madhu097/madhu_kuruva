import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import DesignerImg from '../assets/Designer.jpg';
import FoodImg from '../assets/food remainder.png';
import HomecoImg from '../assets/homeco.png';

export default function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      category: 'web',
      description: 'A modern e-commerce platform with real-time inventory management',
      image: DesignerImg,
      tags: ['Html', 'Css', 'JavaScript'],
      gradient: 'from-cyan-500 to-blue-500',
      github: 'https://github.com/Madhu097/shopify',
      live: 'https://madhu097.github.io/shopify/',
    },
    {
      id: 2,
      title: 'Food Remainder',
      category: 'design',
      description: 'A food remainder app with real-time inventory management',
      image: FoodImg,
      tags: ['react', 'nodejs', 'postgresql'],
      gradient: 'from-purple-500 to-pink-500',
      github: 'https://github.com/Madhu097/foodremainder',
      live: 'https://foodremainder.onrender.com/',
    },
    {
      id: 3,
      title: 'HomeCo Services',
      category: 'web',
      description: 'A home services website find all type of services ',
  image: HomecoImg,
      tags: ['react', 'javascript', 'firebase'],
      gradient: 'from-blue-500 to-purple-500',
      github: 'https://github.com/Madhu097/HomeCo-Service',
      live: 'https://homeco-service.onrender.com/',
    },
    /*
    {
      id: 4,
      title: 'Mobile Fitness App',
      category: 'mobile',
      description: 'AI-powered fitness tracking app with personalized workout recommendations',
      image: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['React Native', 'TensorFlow', 'Firebase'],
      gradient: 'from-pink-500 to-rose-500',
      github: 'https://github.com/yourname/mobile-fitness-app',
      live: 'https://fitnessapp.example.com',
    },
    {
      id: 5,
      title: 'Brand Identity System',
      category: 'design',
      description: 'Complete brand identity and design system for a tech startup',
      image: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['Figma', 'UI/UX', 'Design System'],
      gradient: 'from-rose-500 to-orange-500',
      github: 'https://github.com/yourname/brand-identity-system',
      live: 'https://brand.example.com',
    },
    {
      id: 6,
      title: 'Real-time Collaboration',
      category: 'web',
      description: 'Collaborative workspace with real-time editing and video conferencing',
      image: 'https://images.pexels.com/photos/3861943/pexels-photo-3861943.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['WebRTC', 'Socket.io', 'React'],
      gradient: 'from-orange-500 to-cyan-500',
      github: 'https://github.com/yourname/realtime-collaboration',
      live: 'https://collab.example.com',
    },*/
  ];

  const filters = ['all'];

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(p => p.category === filter);

  return (
    <section id="portfolio" ref={sectionRef} className="min-h-screen bg-[#0a0a14] py-16 sm:py-24 md:py-32 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-500 rounded-full blur-[150px]" />
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-purple-600 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
            Featured Work
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            A selection of projects that showcase my skills and creativity
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full mx-auto mt-6" />
        </div>

        <div className={`flex justify-center gap-2 sm:gap-4 mb-12 md:mb-16 flex-wrap transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium text-xs sm:text-base transition-all duration-300 ${
                filter === f
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/50'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
              data-magnetic
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className={`group relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500 cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onClick={() => setSelectedProject(project.id)}
              data-magnetic
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={project.image}
                  alt={`${project.title} - ${project.description}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                  width="800"
                  height="450"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-40 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-60`} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14] via-transparent to-transparent opacity-60" />

                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`${project.title} GitHub`}
                  >
                    <Github className="w-5 h-5 text-white" />
                  </a>
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`${project.title} Live Demo`}
                  >
                    <ExternalLink className="w-5 h-5 text-white" />
                  </a>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-gray-400 mb-4 line-clamp-2 text-sm sm:text-base">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 sm:px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${project.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
            </div>
          ))}
        </div>

        {selectedProject && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in"
            onClick={() => setSelectedProject(null)}
          >
            <div className="bg-[#0a0a14] border border-white/20 rounded-2xl max-w-4xl w-full p-8 animate-scale-in" onClick={(e) => e.stopPropagation()}>
              {(() => {
                const activeProject = projects.find(p => p.id === selectedProject);
                if (!activeProject) return null;
                return (
                  <>
                    <img
                      src={activeProject.image}
                      alt={`${activeProject.title} - ${activeProject.description}`}
                      className="w-full h-64 object-cover rounded-xl mb-6"
                      loading="eager"
                      decoding="async"
                      width="800"
                      height="256"
                    />
                    <h3 className="text-4xl font-bold text-white mb-4">
                      {activeProject.title}
                    </h3>
                    <p className="text-gray-300 text-lg mb-6">
                      {activeProject.description}
                    </p>
                    <div className="flex flex-wrap gap-4 mb-6">
                      <a
                        href={activeProject.github}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-3 bg-white/10 border border-white/20 rounded-full text-white font-medium flex items-center gap-2 hover:bg-white/20 transition-colors"
                      >
                        <Github className="w-5 h-5" />
                        View Code
                      </a>
                      <a
                        href={activeProject.live}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full text-white font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                      >
                        <ExternalLink className="w-5 h-5" />
                        Live Demo
                      </a>
                    </div>
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="px-6 py-3 bg-white/5 border border-white/20 rounded-full text-white font-medium hover:bg-white/10 transition-colors"
                    >
                      Close
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scaleIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}
