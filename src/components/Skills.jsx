import { useRef, useEffect, useCallback } from 'react';
import SpecSection from './SpecSection';
import './Skills.css';

const SKILLS = [
  'Claude', 'Supabase', 'Firebase', 'Appwrite',
  'VS Code', 'GitHub', 'Vercel',
  'JavaScript', 'React', 'CSS', 'HTML'
];

const IH = 84;
const CP = 2;
const ITEMS = Array.from({ length: CP }, () => SKILLS).flat();
const TH = ITEMS.length * IH;

export default function Skills() {
  const ref = useRef(null);
  const rf = useRef(null);
  const sy = useRef(0);
  const vel = useRef(1.8);
  const py = useRef(null);
  const ly = useRef(0);
  const lt = useRef(0);
  const ci = useRef(-1);
  const si = useRef(-1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let isVisible = true;
    const visObs = new IntersectionObserver(([entry]) => { isVisible = entry.isIntersecting; }, { threshold: 0 });
    visObs.observe(el);

    lt.current = performance.now();
    const loop = now => {
      if (!isVisible) { rf.current = requestAnimationFrame(loop); return; }
      const ch = el.clientHeight || 480;
      const dt = Math.min((now - lt.current) / 1000, 0.05);
      lt.current = now;

      if (py.current !== null) {
        const diff = py.current - ch / 2 - ((-sy.current) % IH);
        vel.current += diff * 0.002;
        vel.current *= 0.9;
      } else {
        vel.current += (1.8 - vel.current) * 0.01;
      }

      sy.current += vel.current;
      sy.current = ((sy.current % TH) + TH) % TH;

      let nearIdx = 0;
      let nearDist = Infinity;
      const children = [...el.children];

      for (let i = 0; i < ITEMS.length; i++) {
        const c = children[i];
        if (!c) continue;
        let y = i * IH + sy.current;
        y = ((y % TH) + TH) % TH;
        let vy = y;
        if (vy > TH / 2) vy -= TH;
        const d = Math.abs(vy - ch / 2);
        const p = Math.max(0, 1 - d / (ch * 0.5));
        const s = p * p * (3 - 2 * p);
        const scale = 0.2 + s * 0.8;
        const opacity = 0.04 + s * 0.96;
        const z = Math.round(s * 100);
        c.style.transform = `translateY(${vy - ch / 2}px) scale(${scale})`;
        c.style.opacity = opacity;
        if (z !== c._z) { c._z = z; c.style.zIndex = z; }
        if (d < nearDist) { nearDist = d; nearIdx = i; }
      }

      if (nearIdx !== ci.current) {
        if (ci.current >= 0 && children[ci.current]) children[ci.current].classList.remove('sk-inf-item--center');
        ci.current = nearIdx;
        if (children[nearIdx]) children[nearIdx].classList.add('sk-inf-item--center');
        if ('vibrate' in navigator) {
          try { navigator.vibrate(8); } catch (_) {}
        }
      }

      rf.current = requestAnimationFrame(loop);
    };
    rf.current = requestAnimationFrame(loop);
    return () => {
      visObs.disconnect();
      if (rf.current) cancelAnimationFrame(rf.current);
    };
  }, []);

  /* Page-scroll driven advancement: snap carousel to the skill
     that aligns with the user's scroll position through the section. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let prevScrollIdx = -1;
    let tick = 0;

    const onScroll = () => {
      const section = el.closest('section');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.bottom < 0 || rect.top > vh) return;
      const progress = Math.max(0, Math.min(1, (vh / 2 - rect.top) / rect.height));
      const scrollIdx = Math.min(SKILLS.length - 1, Math.max(0, Math.floor(progress * SKILLS.length)));

      if (scrollIdx !== prevScrollIdx) {
        prevScrollIdx = scrollIdx;
        if (scrollIdx >= 0) {
          si.current = scrollIdx;
          const ch = el.clientHeight || 480;
          const target = ch / 2 - scrollIdx * IH;
          const prevPy = py.current;
          py.current = null;
          sy.current = ((target % TH) + TH) % TH;
          vel.current = 0;
          if ('vibrate' in navigator) {
            try { navigator.vibrate(8); } catch (_) {}
          }
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onDown = useCallback(e => {
    const y = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    py.current = y;
    ly.current = y;
  }, []);

  const onMove = useCallback(e => {
    if (py.current === null) return;
    const y = e.clientY ?? e.touches?.[0]?.clientY;
    if (y == null) return;
    py.current = y;
    const dy = y - ly.current;
    ly.current = y;
    if (Math.abs(dy) > 1) {
      sy.current += dy;
      vel.current = dy * 0.3;
    }
  }, []);

  const onUp = useCallback(() => {
    py.current = null;
  }, []);

  const onClick = useCallback(e => {
    const t = e.target?.closest?.('.sk-inf-item');
    if (!t || !ref.current) return;
    const i = Array.from(ref.current.children).indexOf(t);
    if (i < 0) return;
    const ch = ref.current.clientHeight || 480;
    const target = ch / 2 - i * IH;
    sy.current = ((target % TH) + TH) % TH;
    vel.current = 0;
    if ('vibrate' in navigator) {
      try { navigator.vibrate(12); } catch (_) {}
    }
  }, []);

  return (
    <SpecSection id="skills" num="03" title="Skills &amp; Tools">
      <div
        ref={ref}
        className="sk-inf stagger-up"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        onTouchStart={onDown}
        onTouchMove={onMove}
        onTouchEnd={onUp}
        onClick={onClick}
        role="listbox"
        aria-label="Skills"
      >
        {ITEMS.map((name, i) => (
          <div key={i} className="sk-inf-item" role="option" aria-label={name}>
            <span className="sk-inf-index">{String((i % SKILLS.length) + 1).padStart(2, '0')}</span>
            <span className="sk-inf-name">{name}</span>
          </div>
        ))}
      </div>
    </SpecSection>
  );
}
