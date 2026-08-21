import { lazy, Suspense } from 'react';
import LoadingScreen from './components/LoadingScreen';
import CinematicIntro from './components/CinematicIntro';
import Hero from './components/Hero';
import ScrollAnimations from './components/ScrollAnimations';

// Lazy-load below-the-fold sections — they download in parallel while loading screen plays
const About = lazy(() => import('./components/About'));
const Experience = lazy(() => import('./components/Experience'));
const Skills = lazy(() => import('./components/Skills'));
const Portfolio = lazy(() => import('./components/Portfolio'));
const Certifications = lazy(() => import('./components/Certifications'));
const Contact = lazy(() => import('./components/Contact'));

function App() {
  return (
    <div className="bg-background text-primaryText">
      <LoadingScreen />
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
