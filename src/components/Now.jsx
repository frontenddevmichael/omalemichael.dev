import SpecSection from './SpecSection';

export default function Now() {
  return (
    <SpecSection id="now" num="04" title="Now">
      <div className="now-grid">
        <div className="now-c stagger-up">
          <div className="h">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M2 4h12M2 8h12M2 12h8"/></svg>
            <span className="l">reading</span>
          </div>
          <div className="t"><em>Designing Data-Intensive Applications</em> — Kleppmann. Worth it for the replication chapter alone.</div>
        </div>
        <div className="now-c stagger-up" style={{transitionDelay:'350ms'}}>
          <div className="h">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><polyline points="4 6 8 10 12 6"/></svg>
            <span className="l">building</span>
          </div>
          <div className="t">React Native habit tracker. Exploring mobile UX patterns and push notification architecture.</div>
        </div>
        <div className="now-c stagger-up" style={{transitionDelay:'700ms'}}>
          <div className="h">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><circle cx="8" cy="8" r="6"/><path d="M8 4v4l3 2"/></svg>
            <span className="l">learning</span>
          </div>
          <div className="t">AI-assisted development workflows with Lovable and Bolt. Prototyping faster with AI tooling.</div>
        </div>
      </div>
    </SpecSection>
  );
}
