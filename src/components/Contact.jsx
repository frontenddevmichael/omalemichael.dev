import { useRef, useEffect, useCallback } from 'react';
import { LINKS } from '../data/links';

const CARDS = [
  { url: LINKS.githubUrl,  icon: 'github',  label: 'GitHub',    handle: `@${LINKS.githubUser}`, target: '_blank', rel: 'noopener noreferrer' },
  { url: LINKS.linkedinUrl,icon: 'linkedin', label: 'LinkedIn',  handle: LINKS.linkedinHandle,  target: '_blank', rel: 'noopener noreferrer' },
  { url: `mailto:${LINKS.email}`, icon: 'mail', label: 'Email', handle: LINKS.email },
  { url: LINKS.whatsapp,   icon: 'whatsapp', label: 'WhatsApp',  handle: LINKS.whatsappDisplay, target: '_blank', rel: 'noopener noreferrer' },
];

const paths = {
  github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>',
  linkedin: '<path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
  mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  whatsapp: '<path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>',
};

export default function Contact() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const offsetsRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current;
    if (!section || cards.length !== 4) return;

    const getOffsets = () => {
      const top0 = cards[0].getBoundingClientRect().top;
      return cards.map(c => c.getBoundingClientRect().top - top0);
    };

    let raf = null;
    let scrollY = 0;

    const update = () => {
      raf = null;
      const sectionH = section.offsetHeight;
      const viewH = window.innerHeight;
      const sectionTop = section.offsetTop;
      const scrollPast = scrollY - sectionTop;
      const travel = sectionH - viewH;
      const progress = Math.max(0, Math.min(1, scrollPast / travel));
      const offsets = offsetsRef.current || getOffsets();

      const maxOff = Math.max(...offsets);
      const m = maxOff > 0 ? Math.max(1.0, Math.min(2.0, Math.round(travel / maxOff * 2 * 10) / 10)) : 2.0;
      for (let i = 0; i < cards.length; i++) {
        cards[i].style.transform = `translateY(${-progress * offsets[i] * m}px)`;
        cards[i].style.zIndex = i + 1;
      }
    };

    const onScroll = () => {
      scrollY = window.scrollY;
      if (!raf) raf = requestAnimationFrame(update);
    };

    const calc = () => { offsetsRef.current = getOffsets(); };
    calc();

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
      } else {
        window.removeEventListener('scroll', onScroll);
      }
    }, { threshold: [0, 0.01] });

    obs.observe(section);
    window.addEventListener('resize', calc, { passive: true });
    return () => { obs.disconnect(); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', calc); if (raf) cancelAnimationFrame(raf); };
  }, []);

  const setCardRef = useCallback((el, i) => { cardsRef.current[i] = el; }, []);

  return (
    <section className="section" id="contact" ref={sectionRef} style={{position:'relative'}}>
      <div className="container" style={{position:'relative',zIndex:1}}>
        <div className="section-grid">
          <div className="spec-h stagger-left">
            <span className="num">-- 08</span>
            <h2>Contact</h2>
            <span className="dim"></span>
          </div>
          <div className="section-body contact-section">
            <div className="contact-status stagger-up">
              <span className="dot"></span>
              <span>Available for contract &middot; UTC+1</span>
            </div>
            <div className="contact-stack">
              {CARDS.map((c, i) => (
                <a key={c.label} href={c.url} className="clink-card stagger-up"
                  ref={el => setCardRef(el, i)}
                  target={c.target} rel={c.rel}
                  aria-label={`${c.label}${c.target ? ' — opens in new tab' : ''}`}>
                  <span className="cc-icon" dangerouslySetInnerHTML={{__html: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">${paths[c.icon]}</svg>`}} />
                  <span className="cc-body">
                    <span className="cc-l">{c.label}</span>
                    <span className="cc-h">{c.handle}</span>
                  </span>
                  <span className="cc-arrow"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><line x1="3" y1="8" x2="13" y2="8"/><polyline points="9 4 13 8 9 12"/></svg></span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
