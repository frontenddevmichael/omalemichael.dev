import { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Work from './components/Work';
import Skills from './components/Skills';
import Now from './components/Now';
import Process from './components/Process';
import Testimonials from './components/Testimonials';
import Resume from './components/Resume';
import Contact from './components/Contact';
import Support from './components/Support';
import BigM from './components/BigM';
import Footer from './components/Footer';
import CommandPalette from './components/CommandPalette';
import ScrollProgress from './components/ScrollProgress';

function App() {
  const [palOpen, setPalOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.02, rootMargin: '0px 0px -20px 0px' });
    document.querySelectorAll('.stagger-up, .stagger-left, .stagger-pop').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    let raf = null;
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--scroll-y', window.scrollY);
        raf = null;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <LoadingScreen />
      <ScrollProgress />
      <Nav onOpenPalette={() => setPalOpen(true)} />
      <main id="main-content">
        <Hero />
        <div className="gap-sec stagger-up">
          <span className="num">01</span>
          <span className="l">About</span>
        </div>
        <About />
        <div className="gap-sec stagger-up">
          <span className="num">02</span>
          <span className="l">Work</span>
        </div>
        <Work />
        <div className="gap-sec stagger-up">
          <span className="num">03</span>
          <span className="l">Skills</span>
        </div>
        <Skills />
        <div className="gap-sec stagger-up">
          <span className="num">04</span>
          <span className="l">Now</span>
        </div>
        <Now />
        <div className="gap-sec stagger-up">
          <span className="num">05</span>
          <span className="l">Process</span>
        </div>
        <Process />
        <div className="gap-sec stagger-up">
          <span className="num">06</span>
          <span className="l">Testimonials</span>
        </div>
        <Testimonials />
        <div className="gap-sec stagger-up">
          <span className="num">07</span>
          <span className="l">Resume</span>
        </div>
        <Resume />
        <div className="gap-sec stagger-up">
          <span className="num">08</span>
          <span className="l">Contact</span>
        </div>
        <Contact />
        <BigM />
        <div className="gap-sec stagger-up">
          <span className="num">09</span>
          <span className="l">Support</span>
        </div>
        <Support />
        <div className="gap-sec stagger-up">
          <span className="num">End</span>
          <span className="l">Fin</span>
        </div>
      </main>
      <Footer />
      <CommandPalette isOpen={palOpen} onClose={() => setPalOpen(false)} />
    </>
  );
}

export default App;
