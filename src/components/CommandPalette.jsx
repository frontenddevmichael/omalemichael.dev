import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { LINKS } from '../data/links';
import { addScrollLock, removeScrollLock } from '../utils/scrollLock';

const ipaths = {
  user:'<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  briefcase:'<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>',
  code:'<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  mail:'<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>',
  github:'<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>',
  linkedin:'<path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
};

const groups = [
  { g:'Sections', items:[
    { l:'About',   i:'user',      a:'#about' },
    { l:'Work',    i:'briefcase', a:'#work' },
    { l:'Skills',  i:'code',      a:'#skills' },
    { l:'Now',     i:'clock',     a:'#now' },
    { l:'Process', i:'edit',      a:'#process' },
    { l:'Testimonials', i:'user', a:'#testimonials' },
    { l:'Resume',  i:'briefcase', a:'#resume' },
    { l:'Contact', i:'mail',      a:'#contact' },
  ]},
  { g:'Links', items:[
    { l:'GitHub',   i:'github',   a:LINKS.githubUrl },
    { l:'LinkedIn', i:'linkedin', a:LINKS.linkedinUrl },
    { l:'Email',    i:'mail',     a:`mailto:${LINKS.email}` },
  ]},
];

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [flat, setFlat] = useState([]);
  const [idx, setIdx] = useState(0);
  const inputRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setIdx(0);
      addScrollLock(); // shared module-level counter
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      removeScrollLock(); // shared module-level counter
    }
    return () => { removeScrollLock(); }; // shared module-level counter
  }, [isOpen]);

  const filtered = groups.map(g => ({
    ...g,
    items: query
      ? g.items.filter(x => x.l.toLowerCase().includes(query.toLowerCase()))
      : g.items,
  })).filter(g => g.items.length > 0);

  const fi = filtered.flatMap(g => g.items);
  useEffect(() => { setFlat(fi); }, [fi.length]);

  const navigate = useCallback((dir) => {
    if (!fi.length) return;
    setIdx(prev => {
      const m = fi.length - 1;
      return dir === 'd' ? (prev >= m ? 0 : prev + 1) : (prev <= 0 ? m : prev - 1);
    });
  }, [fi.length]);

  const act = useCallback(() => {
    if (idx < 0 || idx >= fi.length) return;
    const item = fi[idx];
    onClose();
    if (item.a.charAt(0) === '#') {
      const el = document.getElementById(item.a.slice(1));
      if (el) el.scrollIntoView({ behavior:'smooth', block:'start' });
    } else {
      window.open(item.a, '_blank');
    }
  }, [idx, fi, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); navigate('d'); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); navigate('u'); return; }
      if (e.key === 'Enter') { e.preventDefault(); act(); return; }
      if (e.key === '/') { e.preventDefault(); inputRef.current?.focus(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, navigate, act]);

  useEffect(() => {
    if (bodyRef.current) {
      const el = bodyRef.current.querySelector('.hl');
      if (el) el.scrollIntoView({ block:'nearest' });
    }
  }, [idx]);

  // On mobile, scroll the palette panel so input stays visible when keyboard opens
  const onInputFocus = useCallback(() => {
    if (('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth < 768) {
      setTimeout(() => {
        const pal = document.querySelector('.pal');
        if (pal) pal.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }, 300);
    }
  }, []);

  return createPortal(
    <div className={`pal-overlay${isOpen ? ' open' : ''}`} onClick={onClose}>
      <div className="pal" onClick={e => e.stopPropagation()}>
        <div className="pal-handle"></div>
        <div className="pal-head">
          <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
            <circle cx="7.5" cy="7.5" r="5"/><line x1="11" y1="11" x2="16" y2="16"/>
          </svg>
          <input ref={inputRef} type="text" placeholder="Search commands…" autoComplete="off" spellCheck="false" aria-label="Search commands"
            value={query} onChange={e => { setQuery(e.target.value); setIdx(0); }}
            onFocus={onInputFocus} />
        </div>
        <div className="pal-body" ref={bodyRef} role="listbox" aria-label="Command list">
          {filtered.length === 0 && <div className="pal-empty">No results</div>}
          {filtered.map(g => (
            <div key={g.g}>
              <div className="pal-g">{g.g}</div>
              {g.items.map((x, gi) => {
                const ci = fi.indexOf(x);
                return (
                  <div key={x.l}
                    className={`pal-item${ci === idx ? ' hl' : ''}`}
                    role="option"
                    aria-selected={ci === idx}
                    onClick={() => { setIdx(ci); act(); }}
                    onMouseEnter={() => setIdx(ci)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" dangerouslySetInnerHTML={{__html: ipaths[x.i]}} />
                    <span className="l">{x.l}</span>
                    <span className="h">&#8617;</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="pal-foot">
          <div className="pf">
            <span className="pf-desk"><kbd>&uarr;</kbd> <kbd>&darr;</kbd> navigate</span>
            <span className="pf-desk"><kbd>&crarr;</kbd> open</span>
            <span className="pf-desk"><kbd>Esc</kbd> close</span>
            <span className="pf-touch">Tap a command to open</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
