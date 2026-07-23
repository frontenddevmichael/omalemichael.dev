import { useRef, useEffect, useCallback } from 'react';
import SpecSection from './SpecSection';
import './Skills.css';

const SKILLS = [
  'Claude', 'Supabase', 'Firebase', 'Appwrite',
  'VS Code', 'GitHub', 'Vercel',
  'JavaScript', 'React', 'CSS', 'HTML'
];

const IH = 84;                  // must match --sk-item-h in Skills.css
const SET_LEN = SKILLS.length;
const SETS = 3;                 // copies for seamless wraparound
const SET_H = SET_LEN * IH;
const ITEMS = Array.from({ length: SETS }, () => SKILLS).flat();

export default function Skills() {
  const sectionRef = useRef(null);
  const wrapRef = useRef(null);
  const rafRef = useRef(null);
  const tickingRef = useRef(false);

  const applyEffect = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ch = el.clientHeight || 420;
    const center = el.scrollTop + ch / 2;
    const children = el.children;
    for (let i = 0; i < children.length; i++) {
      const c = children[i];
      const itemCenter = i * IH + IH / 2;
      const d = Math.abs(itemCenter - center);
      const p = Math.max(0, 1 - d / (ch * 0.5));
      const s = p * p * (3 - 2 * p); // smoothstep
      const scale = 0.2 + s * 0.8;
      const opacity = 0.04 + s * 0.96;
      const z = Math.round(s * 100);
      c.style.transform = `scale(${scale})`;
      c.style.opacity = opacity;
      if (z !== c._z) { c._z = z; c.style.zIndex = z; }
    }
  }, []);

  const handleScroll = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;

    // seamless infinite wrap: jump by exactly one full set near either edge
    if (el.scrollTop < SET_H * 0.5) {
      el.scrollTop += SET_H;
    } else if (el.scrollTop > SET_H * 1.5) {
      el.scrollTop -= SET_H;
    }

    if (!tickingRef.current) {
      tickingRef.current = true;
      rafRef.current = requestAnimationFrame(() => {
        applyEffect();
        tickingRef.current = false;
      });
    }
  }, [applyEffect]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    el.scrollTop = SET_H; // start centered on the middle set
    applyEffect();

    el.addEventListener('scroll', handleScroll, { passive: true });
    const ro = new ResizeObserver(() => applyEffect());
    ro.observe(el);

    return () => {
      el.removeEventListener('scroll', handleScroll);
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [applyEffect, handleScroll]);

  const onClick = useCallback(e => {
    const t = e.target?.closest?.('.sk-inf-item');
    const el = wrapRef.current;
    if (!t || !el) return;
    const i = Array.from(el.children).indexOf(t);
    if (i < 0) return;
    el.scrollTo({
      top: i * IH + IH / 2 - el.clientHeight / 2,
      behavior: 'smooth',
    });
  }, []);

  return (
    <SpecSection id="skills" num="03" title="Skills &amp; Tools" sectionRef={sectionRef}>
      <div
        ref={wrapRef}
        className="sk-inf stagger-up"
        onClick={onClick}
        tabIndex={0}
        role="list"
        aria-label="Skills and tools"
      >
        {ITEMS.map((name, i) => {
          const inMiddleSet = i >= SET_LEN && i < SET_LEN * 2;
          return (
            <div
              key={i}
              className="sk-inf-item"
              role="listitem"
              aria-hidden={inMiddleSet ? undefined : true}
            >
              <span className="sk-inf-index">
                {String((i % SET_LEN) + 1).padStart(2, '0')}
              </span>
              <span className="sk-inf-name">{name}</span>
            </div>
          );
        })}
      </div>
    </SpecSection>
  );
}