import { useEffect, useRef, useState } from 'react';
import { Code2, Palette, Zap } from 'lucide-react';
import profilePic from '../assets/madhu.jpeg';

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const imgElement = imageRef.current;
    if (!imgElement) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = imgElement.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (y / rect.height) * 15;
      const rotateY = (x / rect.width) * -15;
      
      imgElement.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    };

    const handleMouseLeave = () => {
      imgElement.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    };

    imgElement.addEventListener('mousemove', handleMouseMove);
    imgElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      imgElement.removeEventListener('mousemove', handleMouseMove);
      imgElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const education = [
    { year: '2026', title: 'BTech in Computer Science', institute: 'Malla Reddy Engineering College And Management Science', status: 'Current' },
    { year: '2023', title: 'Diploma - ECE Stream', institute: 'Anurag Engineering College', status: 'Completed' },
    { year: '2020', title: '10th Grade', institute: 'SR High School', status: 'Completed' },
  ];

  return (
    <section ref={sectionRef} className="min-h-screen bg-[#0a0a14] py-16 sm:py-24 md:py-32 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 sm:w-96 h-64 sm:h-96 bg-cyan-500 rounded-full blur-[150px]" />
        <div className="absolute bottom-20 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-purple-600 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className={`space-y-6 md:space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
            <div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
                About Me
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full" />
            </div>

            <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed">
              I'm a final year BTech student passionate about building innovative solutions through full-stack development. With a strong foundation in computer science fundamentals, I love crafting elegant applications that solve real-world problems.
            </p>

            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              My journey in tech has taught me the importance of continuous learning and staying updated with latest technologies. I thrive on challenges and am excited to bring my skills to impactful projects.
            </p>

            <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-6 md:pt-8">
              <div className="text-center p-4 sm:p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105">
                <Code2 className="w-6 sm:w-8 h-6 sm:h-8 text-cyan-400 mx-auto mb-2 sm:mb-3" />
                <p className="text-xl sm:text-2xl font-bold text-white">5+</p>
                <p className="text-xs sm:text-sm text-gray-400">Projects</p>
              </div>
              <div className="text-center p-4 sm:p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105">
                <Palette className="w-6 sm:w-8 h-6 sm:h-8 text-purple-400 mx-auto mb-2 sm:mb-3" />
                <p className="text-xl sm:text-2xl font-bold text-white">10+</p>
                <p className="text-xs sm:text-sm text-gray-400">Skills</p>
              </div>
              <div className="text-center p-4 sm:p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105">
                <Zap className="w-6 sm:w-8 h-6 sm:h-8 text-yellow-400 mx-auto mb-2 sm:mb-3" />
                <p className="text-xl sm:text-2xl font-bold text-white">1+</p>
                <p className="text-xs sm:text-sm text-gray-400">Internships</p>
              </div>
            </div>
          </div>

          <div className={`space-y-6 md:space-y-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
            <div
              ref={imageRef}
              className="relative aspect-square rounded-2xl overflow-hidden transition-all duration-500 ease-out"
              style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
            >
              <img
                src={profilePic}
                alt="Madhu Kuruva - Full Stack Developer"
                className="w-full h-full object-cover pointer-events-none"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                width="800"
                height="800"
              />
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Education</h3>
              {education.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-cyan-500/50 transition-all duration-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
                  style={{ transitionDelay: `${600 + index * 100}ms` }}
                >
                  <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs sm:text-sm">{item.year}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm sm:text-base">{item.title}</p>
                    <p className="text-gray-400 text-xs sm:text-sm">{item.institute}</p>
                    <p className="text-cyan-400 text-xs mt-1">{item.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
