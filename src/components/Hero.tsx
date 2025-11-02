import { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import resumePdf from '../assets/madhu resume.pdf';

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }> = [];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 20, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        gradient.addColorStop(0, 'rgba(34, 211, 238, 0.8)');
        gradient.addColorStop(1, 'rgba(147, 51, 234, 0.2)');
        ctx.fillStyle = gradient;
        ctx.fill();

        particles.forEach((p2, j) => {
          if (i === j) return;
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(34, 211, 238, ${0.15 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    if (nameRef.current) {
      const letters = nameRef.current.children;
      Array.from(letters).forEach((letter, i) => {
        setTimeout(() => {
          letter.classList.add('animate-in');
        }, i * 80);
      });
    }

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#0a0a14]">
      <canvas ref={canvasRef} className="absolute inset-0" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-6">
        <div className="text-center space-y-4 sm:space-y-6">
          <div className="overflow-hidden">
            <h1 ref={nameRef} className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight text-white leading-tight">
              {'MADHU KURUVA'.split('').map((char, i) => (
                <span
                  key={i}
                  className="inline-block opacity-0 translate-y-full letter"
                  style={{ transitionDelay: `${i * 0.05}s` }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h1>
          </div>

          <div className="overflow-hidden">
            <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-cyan-400 font-light tracking-[0.2em] sm:tracking-[0.3em] animate-fade-in-up opacity-0" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
              FULL STACK DEVELOPER
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 animate-fade-in-up opacity-0" style={{ animationDelay: '1.35s', animationFillMode: 'forwards' }}>
            <span>BTech Computer Science</span>
            <span className="hidden sm:inline">•</span>
            <span>Final Year</span>
            <span className="hidden sm:inline">•</span>
            <span>Hyderabad, India</span>
          </div>

          <div className="overflow-hidden">
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg animate-fade-in-up opacity-0" style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}>
              Building elegant solutions to complex problems. Passionate about full-stack development, AI, and creating impactful digital experiences.
            </p>
          </div>

          <div className="pt-6 sm:pt-8 animate-fade-in-up opacity-0 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center" style={{ animationDelay: '1.8s', animationFillMode: 'forwards' }}>
            <a
              href="#portfolio"
              data-magnetic
              className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full text-white font-medium relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] text-sm sm:text-base"
            >
              <span className="relative z-10">View My Work</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
            <button
              data-magnetic
              className="group px-6 sm:px-8 py-3 sm:py-4 border-2 border-cyan-400 text-cyan-400 rounded-full font-medium relative overflow-hidden transition-all duration-300 hover:bg-cyan-400/10 text-sm sm:text-base"
            >
              <a href={resumePdf} target="_blank" rel="noreferrer"><span className="relative z-10">Download Resume</span></a>
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .letter {
          transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .letter.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </section>
  );
}

