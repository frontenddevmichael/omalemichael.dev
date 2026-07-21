import { useRef, lazy, Suspense } from 'react';
import '../hero.css';
import { usePrefersReducedMotion } from '../utils/useReducedMotion';

// Lazy-loaded: three.js is the single biggest chunk of this site's bundle
// and this scene is purely decorative, so it shouldn't block first paint.
const HeroScene = lazy(() => import('./HeroScene'));

export default function Hero() {
  const sectionRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section className="hero" id="top" ref={sectionRef}>
      {!reducedMotion && (
        <Suspense fallback={null}>
          <HeroScene containerRef={sectionRef} />
        </Suspense>
      )}
      <div className="hero-content" style={{position:'relative',zIndex:1}}>
        <div className="status stagger-reveal" style={{animationDelay:'0ms'}}>
          <span className="dot"></span>
          Available for work
        </div>
        <h1 className="stagger-reveal" style={{animationDelay:'150ms'}}>
          <span>Design.</span>
          <span>Code. Experience.</span>
        </h1>
        <p className="sub stagger-reveal" style={{animationDelay:'350ms'}}>
          Frontend developer and UI/UX designer. I build responsive, accessible interfaces
          and craft clean digital experiences with React, modern CSS, and a focus on usability.
        </p>
        <div className="hero-actions stagger-reveal" style={{animationDelay:'500ms'}}>
          <a href="#work" className="btn">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M8 3v10M4 9l4 4 4-4"/></svg>
            <span>View work</span>
          </a>
        </div>
        <div className="scroll-hint">
          <div className="sc-track">
            <div className="sc-drop"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
