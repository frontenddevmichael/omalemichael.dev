import SpecSection from './SpecSection';

export default function Writing() {
  return (
    <SpecSection id="writing" num="05" title="Writing">
      <div className="write-list">
        <div className="write stagger-left">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>
          <div className="c">
            <h3>Building with React in 2025</h3>
            <p>Why the ecosystem is better than ever. Server components, new hooks, and the tools I actually use.</p>
          </div>
        </div>
        <div className="write stagger-left" style={{transitionDelay:'300ms'}}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 15l6-6 4 4 8-8"/></svg>
          <div className="c">
            <h3>CSS Grid vs Flexbox</h3>
            <p>A practical guide to layout decisions. When to use which, and why you probably need both.</p>
          </div>
        </div>
        <div className="write stagger-left" style={{transitionDelay:'600ms'}}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <div className="c">
            <h3>What I learned building a command palette</h3>
            <p>UX patterns for power users. Keyboard navigation, search ranking, and accessibility considerations.</p>
          </div>
        </div>
      </div>
    </SpecSection>
  );
}
