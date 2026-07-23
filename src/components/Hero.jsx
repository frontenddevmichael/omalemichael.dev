import { useRef, useEffect, lazy, Suspense } from 'react';
import '../hero.css';
import { usePrefersReducedMotion } from '../utils/useReducedMotion';

const HeroScene = lazy(() => import('./HeroScene'));

export default function Hero({ pageLoaded }) {
  const sectionRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  /* Safety fallback: force all elements visible 800ms after pageLoaded
     (catches any case where CSS animation fails to fire) */
  useEffect(() => {
    if (!pageLoaded) return;
    const t = setTimeout(() => {
      const section = sectionRef.current;
      if (!section) return;
      section.querySelectorAll('.stagger-reveal, .hl, .scroll-hint')
        .forEach(el => { el.style.opacity = '1'; });
    }, 800);
    return () => clearTimeout(t);
  }, [pageLoaded]);

  return (
    <section className={`hero${pageLoaded ? ' hero--loaded' : ''}`} id="top" ref={sectionRef} aria-label="Hero introduction" role="region">
      {!reducedMotion && (
        <Suspense fallback={null}>
          <HeroScene containerRef={sectionRef} />
        </Suspense>
      )}
      <div className="hero-content">
        <div className="status stagger-reveal" style={{animationDelay:'200ms'}}>
          <span className="dot"></span>
          Available for work
        </div>
        <h1>
          <span className="hl" style={{animationDelay:'350ms'}}>Design.</span>
          <span className="hl hl--dim" style={{animationDelay:'500ms'}}>Code. Experience.</span>
        </h1>
        <p className="sub stagger-reveal" style={{animationDelay:'650ms'}}>
          Frontend developer and UI/UX designer. I build responsive, accessible interfaces
          and craft clean digital experiences with React, modern CSS, and a focus on usability.
        </p>
        <div className="hero-actions stagger-reveal" style={{animationDelay:'800ms'}}>
          <a href="#work" className="btn">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M8 3v10M4 9l4 4 4-4"/></svg>
            <span>View work</span>
          </a>
        </div>
        <div className="scroll-hint" aria-hidden="true" style={{animationDelay:'1000ms'}}>
          <div className="sc-track">
            <div className="sc-drop"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
