import { useRef, useEffect, useState } from 'react';
import SpecSection from './SpecSection';
import './Skills.css';

const SKILLS = [
  'Claude', 'Supabase', 'Firebase', 'Appwrite',
  'VS Code', 'GitHub', 'Vercel',
  'JavaScript', 'React', 'CSS', 'HTML'
];

export default function Skills() {
  const containerRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(-1);
  const prevIdx = useRef(-1);
  const rafRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let isVisible = true;
    const visObs = new IntersectionObserver(([entry]) => { isVisible = entry.isIntersecting; }, { threshold: 0 });
    visObs.observe(el);

    function update() {
      if (!isVisible) { rafRef.current = requestAnimationFrame(update); return; }
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.bottom < 0 || rect.top > vh) { rafRef.current = requestAnimationFrame(update); return; }
      const progress = Math.max(0, Math.min(1, (vh / 2 - rect.top) / rect.height));
      const idx = Math.min(SKILLS.length - 1, Math.max(0, Math.floor(progress * SKILLS.length)));

      if (idx !== prevIdx.current) {
        prevIdx.current = idx;
        setActiveIdx(idx);
        if ('vibrate' in navigator) {
          try { navigator.vibrate(6); } catch (_) {}
        }
      }
      rafRef.current = requestAnimationFrame(update);
    }
    rafRef.current = requestAnimationFrame(update);

    return () => {
      visObs.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <SpecSection id="skills" num="03" title="Skills &amp; Tools">
      <div className="sk-inf stagger-up" ref={containerRef}>
        {SKILLS.map((name, i) => (
          <div
            key={name}
            className={`sk-inf-item${i === activeIdx ? ' sk-inf-item--center' : ''}`}
          >
            <span className="sk-inf-index">{String(i + 1).padStart(2, '0')}</span>
            <span className="sk-inf-name">{name}</span>
          </div>
        ))}
      </div>
    </SpecSection>
  );
}
