import { useEffect, useRef, useState } from 'react';
import { Code2, Layers, Zap, Database, Palette, Globe } from 'lucide-react';

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  const skills = [
    {
      icon: Code2,
      name: 'React & TypeScript',
      description: 'Building type-safe, scalable applications',
      color: 'from-cyan-500 to-blue-500',
      delay: 0,
    },
    {
      icon: Layers,
      name: 'Next.js & Node',
      description: 'Full-stack development expertise',
      color: 'from-blue-500 to-purple-500',
      delay: 100,
    },
    {
      icon: Zap,
      name: 'Animation & Motion',
      description: 'Framer Motion, CSS animations',
      color: 'from-purple-500 to-pink-500',
      delay: 200,
    },
    {
      icon: Database,
      name: 'Database & APIs',
      description: 'SQL, MongoDB, PostgersQL',
      color: 'from-pink-500 to-rose-500',
      delay: 300,
    },
    {
      icon: Palette,
      name: 'UI/UX Design',
      description: 'Figma, Canva, design systems',
      color: 'from-rose-500 to-orange-500',
      delay: 400,
    },
    {
      icon: Globe,
      name: 'Tools',
      description: 'Git, GitHub, Docker, AWS, VS code',
      color: 'from-orange-500 to-cyan-500',
      delay: 500,
    },
  ];

  return (
    <section ref={sectionRef} className="min-h-screen bg-gradient-to-b from-[#0a0a14] to-[#0f0f1f] py-16 sm:py-24 md:py-32 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(34, 211, 238, 0.3) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`text-center mb-12 md:mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
            Tech Stack
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            A curated selection of technologies I use to bring ideas to life
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full mx-auto mt-6" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            return (
              <div
                key={index}
                className={`group relative p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-500 cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${skill.delay}ms` }}
                data-magnetic
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />

                <div className="relative z-10">
                  <div className={`w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br ${skill.color} rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <Icon className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                  </div>

                  <h3 className="text-lg sm:text-2xl font-bold text-white mb-2 sm:mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                    {skill.name}
                  </h3>

                  <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                    {skill.description}
                  </p>

                  <div className="mt-6 h-1 w-0 group-hover:w-full bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full transition-all duration-500" />
                </div>

                <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              </div>
            );
          })}
        </div>

        <div className={`mt-12 md:mt-20 text-center transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">And many more tools and technologies</p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {['Git', 'Docker', 'AWS', 'Vercel', 'Netlify', 'Render', 'Web Development', 'Data Science'].map((tool, i) => (
              <span
                key={i}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-gray-300 text-xs sm:text-sm hover:border-cyan-500/50 hover:text-cyan-400 transition-all duration-300 cursor-default"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
