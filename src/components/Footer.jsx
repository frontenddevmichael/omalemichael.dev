import { useRef, lazy, Suspense } from 'react';
import { LINKS } from '../data/links';
import { usePrefersReducedMotion } from '../utils/useReducedMotion';

const Galaxy = lazy(() => import('./Galaxy'));

export default function Footer() {
  const footerRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  return (
    <footer className="footer" id="footer" ref={footerRef} style={{position:'relative',overflow:'hidden'}}>
      {!reducedMotion && (
        <Suspense fallback={null}>
          <Galaxy containerRef={footerRef} />
        </Suspense>
      )}
      <div className="footer-inner" style={{position:'relative',zIndex:1}}>
        <a href="#top" className="top-link stagger-up">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M8 3v10M4 9l4 4 4-4"/></svg>
          back to top
        </a>
        <div className="big stagger-up" style={{transitionDelay:'0.08s'}}>
          Michael<span className="dim">/</span>Omale
        </div>
        <div className="sub stagger-up" style={{transitionDelay:'0.16s'}}>frontend developer & ui/ux designer</div>
        <div className="links stagger-up" style={{transitionDelay:'0.24s'}}>
          <a href={LINKS.githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={LINKS.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={`mailto:${LINKS.email}`}>Email</a>
        </div>
        <div className="copy stagger-up" style={{transitionDelay:'0.32s'}}>&copy; {new Date().getFullYear()} <a href="#top">Michael Omale</a> &mdash; built with React</div>
      </div>
    </footer>
  );
}
