import { useState, useEffect } from 'react';
import { FlickerSpinner } from 'flicker-dot';
import { michaelGrids } from '../data/grids';

const LETTERS = ['M', 'I', 'C', 'H', 'A', 'E', 'L'];

export default function BigM() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 600
  );

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <section className="big-m" aria-hidden="true">
      <div className="big-m-row">
        {michaelGrids.map((grids, i) => (
          <div key={LETTERS[i]} className="big-m-cell">
            <FlickerSpinner
              grids={grids}
              onColor="#F5F5F5"
              offColor="#000000"
              size={isMobile ? 42 : 84}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
