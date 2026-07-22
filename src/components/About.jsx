import { useState, useEffect } from 'react';
import SpecSection from './SpecSection';

export default function About() {
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const paragraphs = [
    "I'm a frontend developer and UI/UX designer based in Lagos, Nigeria, currently studying Computer Science at Bells University of Technology. I specialize in building responsive, accessible web interfaces with React, modern CSS, and a focus on usability.",
    "I'm expanding into React Native for mobile apps while exploring AI-assisted development workflows with tools like Lovable and Bolt to accelerate prototyping and product innovation.",
    "My goal is to merge design, code, and AI to build digital products that are not only functional but also intuitive and impactful. I'm passionate about clean UIs, component architecture, and creating experiences that users actually enjoy.",
  ];

  return (
    <SpecSection id="about" num="01" title="About">
      <div className="about-grid">
        <div className="about-text stagger-up">
          <p>{paragraphs[0]}</p>
          <br /><br />
          <p>{paragraphs[1]}</p>
          {(!isMobile || expanded) && (
            <>
              <br /><br />
              <p>{paragraphs[2]}</p>
            </>
          )}
          {isMobile && (
            <button
              className="about-expand"
              onClick={() => setExpanded((o) => !o)}
              aria-expanded={expanded}
            >
              {expanded ? (
                <>Show less <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 10l4-4 4 4"/></svg></>
              ) : (
                <>Read more <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 4l4 4-4 4"/></svg></>
              )}
            </button>
          )}
        </div>
        <div className="metrics stagger-up">
          <div className="metric">
            <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><circle cx="9" cy="9" r="8"/><path d="M9 5v4l3 2"/></svg>
            <span className="l">focus</span>
            <span className="v">Frontend</span>
          </div>
          <div className="metric">
            <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><rect x="2" y="2" width="14" height="14" rx="2"/><path d="M2 7h14"/></svg>
            <span className="l">stack</span>
            <span className="v">React + JS</span>
          </div>
          <div className="metric">
            <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M12 2l4 4-4 4M6 16l-4-4 4-4"/></svg>
            <span className="l">tools</span>
            <span className="v">Figma · Git</span>
          </div>
          <div className="metric">
            <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M9 1v4M9 13v4M1 9h4M13 9h4"/></svg>
            <span className="l">approach</span>
            <span className="v">Clean code</span>
          </div>
        </div>
      </div>
      <div className="about-term stagger-up">
        <div className="term-l"><span className="p">$</span> neofetch</div>
        <div className="term-l"><span className="d">os</span> <span>Windows · Linux</span></div>
        <div className="term-l"><span className="d">shell</span> <span>zsh</span></div>
        <div className="term-l"><span className="d">editor</span> <span>VS Code</span></div>
        <div className="term-l"><span className="d">role</span> <span>Frontend Developer</span></div>
      </div>
    </SpecSection>
  );
}
