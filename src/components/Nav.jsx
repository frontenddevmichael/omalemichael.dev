import { useState, useEffect } from 'react';

const SECTIONS = [
  { l: 'About', a: '#about' },
  { l: 'Work', a: '#work' },
  { l: 'Skills', a: '#skills' },
  { l: 'Now', a: '#now' },
  { l: 'Process', a: '#process' },
  { l: 'Testimonials', a: '#testimonials' },
  { l: 'Resume', a: '#resume' },
  { l: 'Contact', a: '#contact' },
];

export default function Nav({ onOpenPalette }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [menuOpen]);

  return (
    <nav className="top">
      <div className="top-inner">
        <span className="logo">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.3">
            <rect x="1.5" y="1.5" width="15" height="15" rx="3"/>
            <text x="9" y="12.5" textAnchor="middle" fill="currentColor" fontFamily="Inter" fontWeight="600" fontSize="8">M</text>
          </svg>
          michael/spec
        </span>

        <a href="#contact" className="avail-badge" aria-label="Available for work, Lagos Nigeria, UTC+1. Go to contact section.">
          <span className="dot"></span>
          <span className="avail-text">Open to work</span>
          <span className="avail-sep">&middot;</span>
          <span className="avail-loc">Lagos, NG &middot; UTC+1</span>
        </a>

        <div className="top-actions">
          <button className="palette-btn" onClick={onOpenPalette}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <circle cx="6.5" cy="6.5" r="4.5"/><line x1="9.8" y1="9.8" x2="14" y2="14"/>
            </svg>
            <span>Commands</span>
            <span className="k">⌘K</span>
          </button>

          <button
            className={`nav-burger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      <div className={`nav-sheet${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        <ul>
          {SECTIONS.map((s, i) => (
            <li key={s.a} style={{ transitionDelay: `${i * 40}ms` }}>
              <a href={s.a} onClick={() => setMenuOpen(false)}>{s.l}</a>
            </li>
          ))}
        </ul>
        <button
          className="nav-sheet-cmd"
          onClick={() => { setMenuOpen(false); onOpenPalette(); }}
        >
          Open command palette
        </button>
      </div>
    </nav>
  );
}
