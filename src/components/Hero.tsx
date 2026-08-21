import { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import heroVideo from '../assets/hero.mp4';

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nameRef   = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const COUNT    = isMobile ? 30 : 45;
    const MAX_DIST = 120;
    const MAX_DIST_SQ = MAX_DIST * MAX_DIST; // avoid sqrt in hot loop

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    type Particle = { x: number; y: number; vx: number; vy: number; size: number };
    const particles: Particle[] = [];
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x:    Math.random() * canvas.width,
        y:    Math.random() * canvas.height,
        vx:   (Math.random() - 0.5) * 0.4,
        vy:   (Math.random() - 0.5) * 0.4,
        size: Math.random() * 1.5 + 0.8,
      });
    }

    // Pre-bake particle glow into an offscreen canvas — avoids
    // createRadialGradient() inside the per-frame loop (expensive)
    const GLOW = 10;
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = glowCanvas.height = GLOW * 2;
    const gc   = glowCanvas.getContext('2d')!;
    const grad = gc.createRadialGradient(GLOW, GLOW, 0, GLOW, GLOW, GLOW);
    grad.addColorStop(0,   'rgba(34,211,238,0.55)');
    grad.addColorStop(0.5, 'rgba(34,211,238,0.12)');
    grad.addColorStop(1,   'rgba(34,211,238,0)');
    gc.fillStyle = grad;
    gc.fillRect(0, 0, GLOW * 2, GLOW * 2);

    let rafId: number;
    let lastTime = 0;
    const FRAME_MS = 1000 / 50; // cap to 50 fps — keeps GPU idle between frames

    const animate = (now: number) => {
      rafId = requestAnimationFrame(animate);
      if (now - lastTime < FRAME_MS) return;
      lastTime = now;

      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Move + draw nodes
      for (let i = 0; i < COUNT; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        ctx.globalAlpha = 0.85;
        ctx.drawImage(glowCanvas, p.x - GLOW, p.y - GLOW);
        ctx.globalAlpha = 1;
      }

      // Draw edges — use squared distance to skip sqrt
      ctx.lineWidth = 0.5;
      for (let i = 0; i < COUNT; i++) {
        for (let j = i + 1; j < COUNT; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dSq = dx * dx + dy * dy;
          if (dSq >= MAX_DIST_SQ) continue;
          const alpha = (1 - Math.sqrt(dSq) / MAX_DIST) * 0.14;
          ctx.strokeStyle = `rgba(34,211,238,${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    };
    rafId = requestAnimationFrame(animate);

    window.addEventListener('resize', resize, { passive: true });

    // Letter entrance animation
    if (nameRef.current) {
      Array.from(nameRef.current.children).forEach((letter, i) => {
        setTimeout(() => (letter as HTMLElement).classList.add('animate-in'), i * 80);
      });
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);


  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <video
        autoPlay loop muted playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        style={{ objectPosition: 'center 20%' }}
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />

      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-6">
        <div className="text-center space-y-4 sm:space-y-6">
          <div className="overflow-hidden">
            <h1 ref={nameRef} className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold tracking-[-0.02em] text-white leading-tight">
              {'MADHU KURUVA'.split('').map((char, i) => (
                <span key={i} className="inline-block opacity-0 translate-y-full letter" style={{ transitionDelay: `${i * 0.05}s` }}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h1>
          </div>

          <div className="overflow-hidden">
            <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-accent font-light tracking-[0.2em] sm:tracking-[0.3em] animate-fade-in-up opacity-0" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
              FULL STACK DEVELOPER
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 animate-fade-in-up opacity-0" style={{ animationDelay: '1.35s', animationFillMode: 'forwards' }}>
            <span>BTech Computer Science</span>
            <span className="hidden sm:inline">•</span>
            <span>2026 Graduate</span>
            <span className="hidden sm:inline">•</span>
            <span>Hyderabad, India</span>
          </div>

          <div className="overflow-hidden">
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg animate-fade-in-up opacity-0" style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}>
              Building elegant solutions to complex problems. Passionate about full-stack development, AI, and creating impactful digital experiences.
            </p>
          </div>

          <div className="pt-6 sm:pt-8 animate-fade-in-up opacity-0 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center" style={{ animationDelay: '1.8s', animationFillMode: 'forwards' }}>
            <a href="#portfolio" data-magnetic className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-accent to-accentHover rounded-full text-white font-medium relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(10,132,255,0.5)] text-sm sm:text-base">
              <span className="relative z-10">View My Work</span>
              <div className="absolute inset-0 bg-gradient-to-r from-accentHover to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
            <a href="/Madhu Resume.pdf" target="_blank" rel="noopener noreferrer" data-magnetic className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-accent text-accent rounded-full font-medium relative overflow-hidden transition-all duration-300 hover:bg-accent/10 text-sm sm:text-base">
              <span className="relative z-10">View Resume</span>
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
      </div>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out; }
        .letter { transition: all 0.6s cubic-bezier(0.68,-0.55,0.265,1.55); }
        .letter.animate-in { opacity: 1; transform: translateY(0); }
      `}</style>
    </section>
  );
}
