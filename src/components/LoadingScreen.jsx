import { useState, useEffect } from 'react';
import { usePrefersReducedMotion } from '../utils/useReducedMotion';

const LINES = [
  'loading michael/spec',
  'fetching fonts',
  'mounting sections',
  'ready',
];

export default function LoadingScreen() {
  const [mounted, setMounted] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [lineIdx, setLineIdx] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setMounted(false);
      return;
    }

    let cancelled = false;
    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    const minDuration = new Promise(res => setTimeout(res, 900));

    const tick = setInterval(() => {
      setLineIdx(i => (i < LINES.length - 1 ? i + 1 : i));
    }, 260);

    Promise.all([fontsReady, minDuration]).then(() => {
      if (cancelled) return;
      clearInterval(tick);
      setLineIdx(LINES.length - 1);
      setTimeout(() => {
        if (cancelled) return;
        setLeaving(true);
        setTimeout(() => { if (!cancelled) setMounted(false); }, 400);
      }, 250);
    });

    return () => { cancelled = true; clearInterval(tick); };
  }, [reducedMotion]);

  if (!mounted) return null;

  return (
    <div className={`loading-screen${leaving ? ' hide' : ''}`} role="status" aria-live="polite">
      <div className="loading-box">
        <span className="loading-caret">$</span>
        <span className="loading-line">{LINES[lineIdx]}</span>
        <span className="loading-cursor" aria-hidden="true"></span>
      </div>
    </div>
  );
}
