import { useEffect, lazy, Suspense } from 'react';
import CustomCursor from './components/CustomCursor';
import LoadingScreen from './components/LoadingScreen';
import CinematicIntro from './components/CinematicIntro';
import Hero from './components/Hero';
import ScrollAnimations from './components/ScrollAnimations';

// Lazy-load below-the-fold sections — they download in parallel while loading screen plays
const About         = lazy(() => import('./components/About'));
const Experience    = lazy(() => import('./components/Experience'));
const Skills        = lazy(() => import('./components/Skills'));
const Portfolio     = lazy(() => import('./components/Portfolio'));
const Certifications = lazy(() => import('./components/Certifications'));
const Contact       = lazy(() => import('./components/Contact'));

function App() {
  useEffect(() => {
    document.body.style.cursor = 'none';
    return () => { document.body.style.cursor = 'auto'; };
  }, []);

  return (
    <div className="bg-background text-primaryText">
      <LoadingScreen />
      <CustomCursor />
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
