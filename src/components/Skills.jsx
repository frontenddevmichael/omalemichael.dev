import { useRef } from 'react';
import SpecSection from './SpecSection';

const TOOLS = [
  { name: 'React', bar: 95 },
  { name: 'TypeScript', bar: 90 },
  { name: 'JavaScript', bar: 88 },
  { name: 'Node.js', bar: 85 },
  { name: 'Python', bar: 78 },
  { name: 'Supabase', bar: 85 },
  { name: 'CSS / Tailwind', bar: 88 },
  { name: 'Git', bar: 92 },
];

export default function Skills() {
  const sectionRef = useRef(null);

  return (
    <SpecSection id="skills" num="03" title="Skills" sectionRef={sectionRef} style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="sk-kinetic" style={{ position: 'relative', zIndex: 1 }}>
        {TOOLS.map((tool, i) => (
          <div
            key={tool.name}
            className={`sk-row stagger-up ${i % 2 === 0 ? 'sk-row--right' : 'sk-row--left'}`}
            style={{ '--idx': i }}
          >
            <span className="sk-bar" />
            <span className="sk-name">{tool.name}</span>
            <span className="sk-num">{tool.bar}%</span>
          </div>
        ))}
        <div className="sk-connector" aria-hidden="true" />
      </div>
    </SpecSection>
  );
}
