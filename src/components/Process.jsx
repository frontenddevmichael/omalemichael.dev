import SpecSection from './SpecSection';
import { FlickerSpinner } from 'flicker-dot';

const DECOR_GRIDS = Array.from({ length: 8 }, () =>
  Array.from({ length: 64 }, () => Math.random() < 0.18)
);

const STEPS = [
  {
    n: '01',
    t: 'Brief',
    d: 'Understand what the project actually needs to do, for whom, before opening any design tool.',
  },
  {
    n: '02',
    t: 'Deliberate',
    d: 'Think through structure, hierarchy, and layout options — the part that happens before any pixels get placed.',
  },
  {
    n: '03',
    t: 'Fine-tune with AI',
    d: 'Use AI tooling (Lovable, Bolt, Claude) to iterate quickly on directions and prototype faster.',
  },
  {
    n: '04',
    t: 'Development',
    d: 'Build it for real in React — component architecture, responsive behavior, clean code.',
  },
  {
    n: '05',
    t: 'Testing',
    d: 'Check it across devices and edge cases before calling it done.',
  },
];

export default function Process() {
  return (
    <SpecSection id="process" num="05" title="Process">
      <div className="process-section-wrap" style={{ position: 'relative' }}>
        <div className="process-decor" aria-hidden="true">
          <FlickerSpinner
            grids={DECOR_GRIDS}
            onColor="#F5F5F5"
            offColor="#1a1a1a"
          />
        </div>
        <div className="process-list">
          {STEPS.map((s, i) => (
          <div key={s.n} className="process-step stagger-left" style={{ transitionDelay: `${i * 120}ms` }}>
            <span className="process-num">{s.n}</span>
            <div className="process-body">
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
            {i < STEPS.length - 1 && (
              <span className="process-connector" aria-hidden="true" style={{ '--conn-delay': `${i * 120 + 400}ms` }}>
              </span>
            )}
          </div>
          ))}
        </div>
      </div>
    </SpecSection>
  );
}
