import { useRef } from 'react';
import SpecSection from './SpecSection';

const TOOLS = [
  'Supabase', 'Firebase', 'VSCode', 'React',
  'Claude', 'Cloudflare', 'Vercel', 'Figma',
];

export default function Skills() {
  const sectionRef = useRef(null);

  return (
    <SpecSection id="skills" num="03" title="Skills" sectionRef={sectionRef} style={{position:'relative',overflow:'hidden'}}>
      <div className="sk-kinetic" style={{position:'relative',zIndex:1}}>
        {TOOLS.map((name, i) => (
          <div
            key={name}
            className={`sk-row stagger-up ${i % 2 === 0 ? 'sk-row--right' : 'sk-row--left'}`}
            style={{ '--idx': i }}
          >
            <span className="sk-bar" />
            <span className="sk-name">{name}</span>
            <span className="sk-num">{String(i + 1).padStart(2, '0')}</span>
          </div>
        ))}
        <div className="sk-connector" aria-hidden="true" />
      </div>
    </SpecSection>
  );
}
