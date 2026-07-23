import SpecSection from './SpecSection';
import { LINKS } from '../data/links';


const RESUME_PATH = '/resume.pdf';
// resume goes here
export default function Resume() {
  return (
    <SpecSection id="resume" num="07" title="Resume">
      <div className="about-grid">
        <div className="about-text stagger-up">
          <p style={{marginBottom:'1.5rem'}}>Download my resume for a complete overview of my experience, education, and skills as a frontend developer.</p>
          <a
            href={RESUME_PATH}
            download
            className="btn"
            onClick={async e => {
              const res = await fetch(RESUME_PATH, { method: 'HEAD' }).catch(() => null);
              if (!res || !res.ok) {
                e.preventDefault();
                window.location.href = `mailto:${LINKS.email}?subject=${encodeURIComponent('Resume request')}&body=${encodeURIComponent('Hi Michael, could you send over your resume?')}`;
              }
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <path d="M8 3v9M4 8l4 4 4-4M2 13v2h12v-2"/>
            </svg>
            <span>Download Resume</span>
          </a>
        </div>
        <div className="metrics stagger-up">
          <div className="metric">
            <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><circle cx="9" cy="9" r="8"/><path d="M9 5v4l3 2"/></svg>
            <span className="l">experience</span>
            <span className="v">1+ year</span>
          </div>
          <div className="metric">
            <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><rect x="2" y="2" width="14" height="14" rx="2"/><path d="M2 7h14"/></svg>
            <span className="l">education</span>
            <span className="v">B.Sc Comp. Sci.</span>
          </div>
          <div className="metric">
            <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M12 2l4 4-4 4M6 16l-4-4 4-4"/></svg>
            <span className="l">focus</span>
            <span className="v">Frontend & UI</span>
          </div>
          <div className="metric">
            <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M9 1v4M9 13v4M1 9h4M13 9h4"/></svg>
            <span className="l">languages</span>
            <span className="v">JS · TS · CSS</span>
          </div>
        </div>
      </div>
    </SpecSection>
  );
}
