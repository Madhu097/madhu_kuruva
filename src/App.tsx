import { lazy, Suspense, useEffect, useState } from 'react';
import CinematicIntro from './components/CinematicIntro';
import Hero from './components/Hero';
import ScrollAnimations from './components/ScrollAnimations';
import RightNavbar from './components/RightNavbar';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Portfolio from './components/Portfolio';
import Certifications from './components/Certifications';
import Contact from './components/Contact';

// Only the floating assistant can be lazily loaded in the background
const CliChatbot = lazy(() => import('./components/CliChatbot'));

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
        setTimeout(() => {
          setHidden(true);
        }, 150);
      }
      setProgress(p);
    }, 40);

    return () => {
      clearInterval(id);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      onWheel={(e) => e.preventDefault()}
      onTouchMove={(e) => e.preventDefault()}
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
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <div className="bg-background text-primaryText">
      <MinimalLoader />
      <ScrollAnimations />
      <CinematicIntro />
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Portfolio />
      <Certifications />
      <Contact />
      <RightNavbar />
      <Suspense fallback={null}>
        <CliChatbot />
      </Suspense>
    </div>
  );
}

export default App;
