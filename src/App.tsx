import { useEffect } from 'react';
import CustomCursor from './components/CustomCursor';
import LoadingScreen from './components/LoadingScreen';
import CinematicIntro from './components/CinematicIntro';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Portfolio from './components/Portfolio';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import ScrollAnimations from './components/ScrollAnimations';

function App() {
  useEffect(() => {
    document.body.style.cursor = 'none';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <div className="bg-background text-primaryText">
      <LoadingScreen />
      <CustomCursor />
      <ScrollAnimations />
      <CinematicIntro />
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Portfolio />
      <Certifications />
      <Contact />
    </div>
  );
}

export default App;
