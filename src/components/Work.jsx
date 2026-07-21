import { useState, useEffect } from 'react';
import SpecSection from './SpecSection';
import ContributionGraph from './ContributionGraph';
import { fetchRepos } from '../utils/github';

const STATIC_PROJECTS = [
  {
    name: 'Globacom Replica',
    desc: 'Pixel-perfect GSM landing page replica built with React and CSS modules. Mobile-first responsive design with accessibility in mind.',
    lang: 'React',
    topics: ['React', 'CSS', 'Responsive', 'SEO'],
    meta: { l: 'Status', v: 'Live' },
  },
  {
    name: 'Pig Game',
    desc: 'Two-player dice game with React state management. Real-time score tracking with smooth CSS transitions and animations.',
    lang: 'React',
    topics: ['React', 'State', 'Animation'],
    meta: { l: 'Type', v: 'Game' },
  },
  {
    name: 'Portfolio v2',
    desc: 'This site — command palette, parallax effects, sticky cards, and a fully responsive layout system with 6 breakpoints.',
    lang: 'React',
    topics: ['React', 'Parallax', 'CSS Grid'],
    meta: { l: 'Design', v: 'Custom' },
  },
];

export default function Work() {
  const [repos, setRepos] = useState(null);

  useEffect(() => {
    fetchRepos()
      .then(data => {
        console.log('Repos fetched:', data.length);
        setRepos(data);
      })
      .catch(err => {
        console.error('Failed to fetch repos:', err);
        setRepos([]);
      });
  }, []);

  const hasRepos = repos !== null;

  return (
    <SpecSection id="work" num="02" title="Work">
      <ContributionGraph token={import.meta.env.VITE_GITHUB_TOKEN} />

      <div className="proj-grid" style={{ marginTop: 'var(--space-2xl)' }}>
        {hasRepos ? (
          repos.length === 0 ? (
            <div className="proj proj--dyn">
              <div className="head"><span className="tag">note</span></div>
              <h3>No public repos found</h3>
              <p>GitHub API returned no repos or request failed. Check the console for details.</p>
            </div>
          ) : (
            repos.slice(0, 12).map((repo, i) => (
              <ProjectCard key={repo.name} repo={repo} i={i} />
            ))
          )
        ) : (
          STATIC_PROJECTS.map((p, i) => (
            <div key={p.name} className="proj stagger-up" style={{ transitionDelay: `${i * 120}ms` }}>
              <div className="head">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
                <span className="tag">{p.lang}</span>
              </div>
              <h3>{p.name}</h3>
              <p>{p.desc}</p>
              <div className="proj-result">
                <span className="l">{p.meta.l}</span>
                <span className="v">{p.meta.v}</span>
              </div>
              <div className="proj-specs">
                {p.topics.map(t => <span key={t} className="s">{t}</span>)}
              </div>
            </div>
          ))
        )}
      </div>
    </SpecSection>
  );
}

function safeHostname(url) {
  try {
    const u = url.startsWith('http') ? new URL(url) : new URL('https://' + url);
    return u.hostname.replace('www.', '');
  } catch { return null; }
}

function ProjectCard({ repo, i }) {
  const hostname = repo.live ? safeHostname(repo.live) : null;
  const inner = (
    <>
      <div className="head">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
        <span className="tag">{repo.lang || 'repo'}</span>
      </div>
      <h3>{repo.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</h3>
      <p>{repo.desc || ''}</p>
      <div className="proj-result">
        {hostname ? (
          <>
            <span className="l">Live</span>
            <span className="v">{hostname}</span>
            <span className="d">·</span>
          </>
        ) : null}
        <span className="l">Stars</span>
        <span className="v">{repo.stars}</span>
      </div>
      {repo.topics.length > 0 && (
        <div className="proj-specs">
          {repo.topics.slice(0, 4).map(t => <span key={t} className="s">{t}</span>)}
        </div>
      )}
    </>
  );

  const style = { animationDelay: `${i * 80}ms` };
  if (hostname && repo.live) {
    return (
      <a href={repo.live.startsWith('http') ? repo.live : 'https://' + repo.live} target="_blank" rel="noopener noreferrer" className="proj proj--dyn" style={style}>
        {inner}
      </a>
    );
  }
  return (
    <div className="proj proj--dyn" style={style}>
      {inner}
    </div>
  );
}
