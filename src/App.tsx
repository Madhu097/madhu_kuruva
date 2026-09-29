import { lazy, Suspense, useEffect, useState, useRef } from 'react';
import CinematicIntro from './components/CinematicIntro';
import Hero from './components/Hero';
import ScrollAnimations from './components/ScrollAnimations';
import RightNavbar from './components/RightNavbar';

// Code-split below-the-fold components so they do not block initial viewport or execute JS upfront
const About = lazy(() => import('./components/About'));
const Experience = lazy(() => import('./components/Experience'));
const Skills = lazy(() => import('./components/Skills'));
const Portfolio = lazy(() => import('./components/Portfolio'));
const Certifications = lazy(() => import('./components/Certifications'));
const Contact = lazy(() => import('./components/Contact'));
const CliChatbot = lazy(() => import('./components/CliChatbot'));

/** Viewport-based lazy section wrapper: only evaluates JS when scrolled near, or immediately on nav click */
function LazySection({ id, children, minHeight = '500px' }: { id: string; children: React.ReactNode; minHeight?: string }) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '600px 0px' }
    );
    observer.observe(el);

    const onReveal = (e: Event) => {
      const custom = e as CustomEvent<string>;
      if (custom.detail === id) {
        setInView(true);
      }
    };
    window.addEventListener('reveal-section', onReveal);

    return () => {
      observer.disconnect();
      window.removeEventListener('reveal-section', onReveal);
    };
  }, [id]);

  return (
    <div id={inView ? undefined : id} ref={ref} style={{ minHeight: inView ? undefined : minHeight }}>
      {inView ? children : null}
    </div>
  );
}

/** Minimal preloader — ultra-fast ramp with GPU-composited transform and WCAG AA contrast */
function MinimalLoader() {
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let p = 0;
    const id = setInterval(() => {
      p += Math.random() * 25 + 20;
      if (p >= 100) {
        p = 100;
        clearInterval(id);
        setTimeout(() => setHidden(true), 150);
      }
      setProgress(p);
    }, 40);
    return () => clearInterval(id);
  }, []);

  if (hidden) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#03030a',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '24px',
        opacity: progress >= 100 ? 0 : 1,
        transition: 'opacity 0.25s ease',
        pointerEvents: progress >= 100 ? 'none' : 'all',
      }}
    >
      {/* Name */}
      <div style={{ fontFamily: 'monospace', fontSize: '13px', letterSpacing: '0.3em', color: '#94A3B8', textTransform: 'uppercase' }}>
        Madhu Kuruva
      </div>

      {/* Progress bar — GPU accelerated scaleX instead of layout-triggering width */}
      <div style={{ width: '180px', height: '2px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: '100%',
            transform: `scaleX(${progress / 100})`,
            transformOrigin: 'left',
            background: 'linear-gradient(90deg, #0A84FF, #409CFF)',
            borderRadius: '99px',
            transition: 'transform 0.05s linear',
            willChange: 'transform',
          }}
        />
      </div>

      {/* Percent */}
      <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#94A3B8', letterSpacing: '0.15em' }}>
        {Math.floor(progress)}%
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="bg-background text-primaryText">
      <MinimalLoader />
      <ScrollAnimations />
      <CinematicIntro />
      <Hero />
      <Suspense fallback={null}>
        <LazySection id="about" minHeight="500px">
          <About />
        </LazySection>
        <LazySection id="experience" minHeight="500px">
          <Experience />
        </LazySection>
        <LazySection id="skills" minHeight="600px">
          <Skills />
        </LazySection>
        <LazySection id="portfolio" minHeight="700px">
          <Portfolio />
        </LazySection>
        <LazySection id="certifications" minHeight="650px">
          <Certifications />
        </LazySection>
        <LazySection id="contact" minHeight="500px">
          <Contact />
        </LazySection>
      </Suspense>
      <RightNavbar />
      <Suspense fallback={null}>
        <CliChatbot />
      </Suspense>
    </div>
  );
}

export default App;
