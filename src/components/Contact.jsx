import { useRef } from 'react';
import { LINKS } from '../data/links';

export default function Contact() {
  const sectionRef = useRef(null);

  return (
    <section className="section scroll-mt" id="contact" ref={sectionRef} style={{position:'relative'}}>
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
              <a href={LINKS.githubUrl} className="clink-card stagger-up" data-i="1" target="_blank" rel="noopener noreferrer">
                <span className="cc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg></span>
                <span className="cc-body">
                  <span className="cc-l">GitHub</span>
                  <span className="cc-h">@{LINKS.githubUser}</span>
                </span>
                <span className="cc-arrow"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><line x1="3" y1="8" x2="13" y2="8"/><polyline points="9 4 13 8 9 12"/></svg></span>
              </a>
              <a href={LINKS.linkedinUrl} className="clink-card stagger-up" data-i="2" target="_blank" rel="noopener noreferrer">
                <span className="cc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg></span>
                <span className="cc-body">
                  <span className="cc-l">LinkedIn</span>
                  <span className="cc-h">{LINKS.linkedinHandle}</span>
                </span>
                <span className="cc-arrow"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><line x1="3" y1="8" x2="13" y2="8"/><polyline points="9 4 13 8 9 12"/></svg></span>
              </a>
              <a href={`mailto:${LINKS.email}`} className="clink-card stagger-up" data-i="3" target="_blank" rel="noopener noreferrer">
                <span className="cc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></span>
                <span className="cc-body">
                  <span className="cc-l">Email</span>
                  <span className="cc-h">{LINKS.email}</span>
                </span>
                <span className="cc-arrow"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><line x1="3" y1="8" x2="13" y2="8"/><polyline points="9 4 13 8 9 12"/></svg></span>
              </a>
              <a href={LINKS.whatsapp} className="clink-card stagger-up" data-i="4" target="_blank" rel="noopener noreferrer">
                <span className="cc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg></span>
                <span className="cc-body">
                  <span className="cc-l">WhatsApp</span>
                  <span className="cc-h">{LINKS.whatsappDisplay}</span>
                </span>
                <span className="cc-arrow"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><line x1="3" y1="8" x2="13" y2="8"/><polyline points="9 4 13 8 9 12"/></svg></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
