import { useRef } from 'react';
import Galaxy from './Galaxy';

export default function Footer() {
  const footerRef = useRef(null);

  return (
    <footer className="footer" id="footer" ref={footerRef} style={{position:'relative',overflow:'hidden'}}>
      <Galaxy containerRef={footerRef} />
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
          <a href="https://github.com/frontenddevmichael" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/michael-omale-b63406354/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="mailto:omalemcmails@gmail.com">Email</a>
        </div>
        <div className="copy stagger-up" style={{transitionDelay:'0.32s'}}>&copy; {new Date().getFullYear()} <a href="#top">Michael Omale</a> &mdash; built with React</div>
      </div>
    </footer>
  );
}
