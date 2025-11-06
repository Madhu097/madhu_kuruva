import { useEffect, useRef, useState } from 'react';
import { Award, Trophy, Star, Sparkles, Medal, Shield, ExternalLink } from 'lucide-react';

export default function Certifications() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const isUserInteractingRef = useRef(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -100px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    const SCROLL_SPEED = 0.045; // pixels per millisecond (~45px/s)

    const handleMouseEnter = () => {
      isUserInteractingRef.current = true;
    };

    const handleMouseLeave = () => {
      isUserInteractingRef.current = false;
    };

    const handleTouchStart = () => {
      isUserInteractingRef.current = true;
    };

    const handleTouchEnd = () => {
      isUserInteractingRef.current = false;
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('touchcancel', handleTouchEnd);

    let lastTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
      }

      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      if (!isUserInteractingRef.current && scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft += delta * SCROLL_SPEED;

        const maxScroll = scrollContainerRef.current.scrollWidth / 2;
        if (scrollContainerRef.current.scrollLeft >= maxScroll) {
          scrollContainerRef.current.scrollLeft -= maxScroll;
        }
      }

      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []);

  const certifications = [
    {
      id: 1,
      title: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2024',
      icon: Shield,
      gradient: 'from-cyan-500 to-blue-500',
      description: 'Professional level cloud architecture certification',
      certificateUrl: 'https://aws.amazon.com/certification/',
    },
    {
      id: 2,
      title: 'Google Cloud Professional',
      issuer: 'Google Cloud',
      date: '2024',
      icon: Award,
      gradient: 'from-purple-500 to-pink-500',
      description: 'Advanced cloud platform expertise',
      certificateUrl: 'https://cloud.google.com/certification',
    },
    {
      id: 3,
      title: 'React Advanced Patterns',
      issuer: 'Meta Blueprint',
      date: '2023',
      icon: Sparkles,
      gradient: 'from-blue-500 to-purple-500',
      description: 'Mastery in React development patterns',
      certificateUrl: 'https://www.facebook.com/business/learn',
    },
    {
      id: 4,
      title: 'Full Stack Excellence Award',
      issuer: 'Tech Excellence Institute',
      date: '2023',
      icon: Trophy,
      gradient: 'from-pink-500 to-rose-500',
      description: 'Recognition for outstanding full-stack development',
      certificateUrl: 'https://example.com/certificate',
    },
    {
      id: 5,
      title: 'UI/UX Design Master',
      issuer: 'Design Institute',
      date: '2023',
      icon: Star,
      gradient: 'from-rose-500 to-orange-500',
      description: 'Excellence in user experience design',
      certificateUrl: 'https://example.com/certificate',
    },
    {
      id: 6,
      title: 'Innovation Excellence',
      issuer: 'Tech Innovation Hub',
      date: '2022',
      icon: Medal,
      gradient: 'from-orange-500 to-cyan-500',
      description: 'Award for innovative solutions and creativity',
      certificateUrl: 'https://example.com/certificate',
    },
  ];

  const displayCertifications = [...certifications, ...certifications];

  return (
    <section
      id="certifications"
      ref={sectionRef}
      className="min-h-screen bg-[#0a0a14] py-16 sm:py-24 md:py-32 px-4 sm:px-6 relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600 rounded-full blur-[150px] animate-pulse-slower" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500 rounded-full blur-[100px] animate-float" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div
          className={`text-center mb-12 md:mb-20 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
            Certifications & Rewards
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mt-6">
            Recognized achievements and professional certifications that validate my expertise
          </p>
          <div className="h-1 w-32 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full mx-auto mt-6 animate-shimmer" />
        </div>

        {/* Scroll Hint */}
        <div className={`text-center mb-6 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          <p className="text-cyan-400/60 text-sm animate-pulse">← Scroll horizontally to explore →</p>
        </div>

        {/* Certifications Horizontal Scroll */}
        <div className={`relative transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
        }`}>
          {/* Gradient Overlays for scroll indication */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0a0a14] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0a0a14] to-transparent z-10 pointer-events-none" />
          
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto overflow-y-hidden pb-8 scrollbar-custom snap-x"
          >
            <div className="flex gap-6 md:gap-8 px-4">
              {displayCertifications.map((cert, index) => {
                const Icon = cert.icon;
                const isDuplicate = index >= certifications.length;

                return (
                  <div
                    key={`${cert.id}-${index}`}
                    className={`group relative flex-shrink-0 w-[280px] sm:w-[320px] md:w-[380px] transition-all duration-700 hover:scale-105 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                    aria-hidden={isDuplicate}
                  >
                    {/* Main Card */}
                    <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/30 overflow-hidden transition-all duration-500 h-full">
                      <div className="relative p-4 sm:p-6 flex flex-col h-full">
                        {/* Icon */}
                        <div className="mb-4 relative">
                          <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${cert.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                            <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-grow">
                          <h3 className="text-lg sm:text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                            {cert.title}
                          </h3>
                          <p className="text-gray-400 mb-4 line-clamp-2 text-sm sm:text-base">
                            {cert.description}
                          </p>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-cyan-400 font-medium text-sm">
                              {cert.issuer}
                            </span>
                            <span className="text-gray-500 text-xs">{cert.date}</span>
                          </div>
                        </div>

                        {/* View Certificate Button */}
                        <a
                          href={cert.certificateUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-cyan-500/50 transition-all text-sm group-hover:scale-105"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-4 h-4" />
                          View Certificate
                        </a>

                        {/* Bottom Gradient Bar */}
                        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${cert.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }

        @keyframes pulse-slower {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.25; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-20px) translateX(10px); }
          66% { transform: translateY(-10px) translateX(-10px); }
        }

        @keyframes float-particle {
          0% { 
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% { 
            transform: translateY(-100vh) translateX(50px) scale(0);
            opacity: 0;
          }
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-pulse-slower {
          animation: pulse-slower 6s ease-in-out infinite;
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-particle {
          animation: float-particle linear infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-shimmer {
          overflow: hidden;
          position: relative;
        }

        .animate-shimmer::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: shimmer 3s infinite;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .scrollbar-custom {
          scrollbar-width: thin;
          scrollbar-color: rgba(34, 211, 238, 0.3) rgba(255, 255, 255, 0.05);
        }

        .scrollbar-custom::-webkit-scrollbar {
          height: 8px;
        }

        .scrollbar-custom::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }

        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: linear-gradient(90deg, rgba(34, 211, 238, 0.5), rgba(168, 85, 247, 0.5));
          border-radius: 10px;
        }

        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(90deg, rgba(34, 211, 238, 0.8), rgba(168, 85, 247, 0.8));
        }
      `}</style>
    </section>
  );
}
