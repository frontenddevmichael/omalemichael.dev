import { useState, useEffect } from 'react';
import { FlickerSpinner } from 'flicker-dot';
import { loaderGrids } from '../data/grids';
import { usePrefersReducedMotion } from '../utils/useReducedMotion';

export default function LoadingScreen() {
  const [mounted, setMounted] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setMounted(false);
      return;
    }

    let cancelled = false;
    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    const minDuration = new Promise(res => setTimeout(res, 1200));

    Promise.all([fontsReady, minDuration]).then(() => {
      if (cancelled) return;
      setLeaving(true);
      setTimeout(() => { if (!cancelled) setMounted(false); }, 400);
    });

    return () => { cancelled = true; };
  }, [reducedMotion]);

  if (!mounted) return null;

  return (
    <div className={`loading-screen${leaving ? ' hide' : ''}`} role="status" aria-live="polite">
      <div className="loading-spinner">
        <FlickerSpinner
          grids={loaderGrids}
          onColor="#F5F5F5"
          offColor="#000000"
        />
      </div>
    </div>
  );
}
