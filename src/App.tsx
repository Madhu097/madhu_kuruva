import { lazy, Suspense, useEffect, useState } from 'react';
import CinematicIntro from './components/CinematicIntro';
import Hero from './components/Hero';
import ScrollAnimations from './components/ScrollAnimations';

// Lazy-load below-the-fold sections
const About = lazy(() => import('./components/About'));
const Experience = lazy(() => import('./components/Experience'));
const Skills = lazy(() => import('./components/Skills'));
const Portfolio = lazy(() => import('./components/Portfolio'));
const Certifications = lazy(() => import('./components/Certifications'));
const Contact = lazy(() => import('./components/Contact'));

/** Minimal preloader — dark overlay + thin progress bar, gone in ~1s */
function MinimalLoader() {
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Fast progress ramp: 0→100 in ~900ms
    let p = 0;
    const id = setInterval(() => {
      p += Math.random() * 18 + 8;
      if (p >= 100) {
        p = 100;
        clearInterval(id);
        // Fade out after bar completes
        setTimeout(() => setHidden(true), 300);
      }
      setProgress(p);
    }, 60);
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
        transition: 'opacity 0.3s ease',
        pointerEvents: progress >= 100 ? 'none' : 'all',
      }}
    >
      {/* Name */}
      <div style={{ fontFamily: 'monospace', fontSize: '13px', letterSpacing: '0.3em', color: '#64748b', textTransform: 'uppercase' }}>
        Madhu Kuruva
      </div>

      {/* Progress bar */}
      <div style={{ width: '180px', height: '2px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #0A84FF, #409CFF)',
            borderRadius: '99px',
            transition: 'width 0.06s linear',
          }}
        />
      </div>

      {/* Percent */}
      <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#334155', letterSpacing: '0.15em' }}>
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
        <About />
        <Experience />
        <Skills />
        <Portfolio />
        <Certifications />
        <Contact />
      </Suspense>
    </div>
  );
}

export default App;
