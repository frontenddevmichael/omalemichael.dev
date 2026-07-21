import { useState, useEffect, useMemo } from 'react';
import SpecSection from './SpecSection';
import ContributionGraph from './ContributionGraph';
import { fetchRepos } from '../utils/github';

// The one deep-dive case study, above the grid. Recruiters spend most of
// their attention on a single project if you let them -- this gives them
// somewhere to spend it. Edit this object directly with your real project.
const FEATURED_PROJECT = {
  name: 'Globacom Replica',
  tagline: 'Pixel-perfect GSM landing page replica',
  problem:
    'Recreate a large telecom brand\u2019s marketing page from scratch, matching its visual system exactly while making it faster and more accessible than the original.',
  decisions: [
    'Built with React + CSS Modules to keep component styles isolated and easy to reason about at this scale.',
    'Mobile-first from the first commit rather than retrofitting breakpoints afterward.',
    'Semantic HTML and keyboard navigation throughout, since the source page had neither.',
  ],
  result:
    'A pixel-accurate, fully responsive rebuild that loads faster than the original and passes basic accessibility checks it didn\u2019t before.',
  tech: ['React', 'CSS Modules', 'Responsive', 'Accessibility'],
  live: null,
  repo: 'https://github.com/frontenddevmichael',
};

const STATIC_PROJECTS = [
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
    topics: ['React', 'CSS Grid', 'Responsive'],
    meta: { l: 'Design', v: 'Custom' },
  },
];

const repoIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
);

function safeHostname(url) {
  try {
    const u = url.startsWith('http') ? new URL(url) : new URL('https://' + url);
    return u.hostname.replace('www.', '');
  } catch { return null; }
}

export default function Work() {
  const [repos, setRepos] = useState(null);
  const [activeTag, setActiveTag] = useState('All');

  useEffect(() => {
    fetchRepos()
      .then(data => setRepos(data))
      .catch(() => setRepos([]));
  }, []);

  const hasRepos = repos !== null;
  const gridItems = useMemo(() => {
    if (hasRepos && repos.length > 0) {
      return repos.slice(0, 12).map(r => ({
        key: r.name,
        title: r.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        desc: r.desc || '',
        tags: r.topics && r.topics.length ? r.topics.slice(0, 4) : (r.lang ? [r.lang] : []),
        meta: r.stars != null ? { l: 'Stars', v: r.stars } : null,
        live: r.live,
        href: r.live || r.url,
      }));
    }
    return STATIC_PROJECTS.map(p => ({
      key: p.name,
      title: p.name,
      desc: p.desc,
      tags: p.topics,
      meta: p.meta,
      live: null,
      href: null,
    }));
  }, [hasRepos, repos]);

  const tags = useMemo(() => {
    const set = new Set();
    gridItems.forEach(it => it.tags.forEach(t => set.add(t)));
    return ['All', ...Array.from(set).sort()];
  }, [gridItems]);

  const filtered = activeTag === 'All'
    ? gridItems
    : gridItems.filter(it => it.tags.includes(activeTag));

  return (
    <SpecSection id="work" num="02" title="Work">
      <ContributionGraph />

      {/* Featured Project -- the deep-dive case study */}
      <div className="featured-proj stagger-up" style={{ marginTop: 'var(--space-2xl)' }}>
        <div className="featured-proj-head">
          <span className="tag tag--featured">Featured</span>
          <h3>{FEATURED_PROJECT.name}</h3>
          <p className="featured-tagline">{FEATURED_PROJECT.tagline}</p>
        </div>
        <div className="featured-proj-body">
          <div className="fp-block">
            <span className="fp-label">Problem</span>
            <p>{FEATURED_PROJECT.problem}</p>
          </div>
          <div className="fp-block">
            <span className="fp-label">Decisions</span>
            <ul>
              {FEATURED_PROJECT.decisions.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          </div>
          <div className="fp-block">
            <span className="fp-label">Result</span>
            <p>{FEATURED_PROJECT.result}</p>
          </div>
        </div>
        <div className="featured-proj-foot">
          <div className="proj-specs">
            {FEATURED_PROJECT.tech.map(t => <span key={t} className="s">{t}</span>)}
          </div>
          <div className="fp-links">
            {FEATURED_PROJECT.live && (
              <a href={FEATURED_PROJECT.live} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">Live site</a>
            )}
            {FEATURED_PROJECT.repo && (
              <a href={FEATURED_PROJECT.repo} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
                {repoIcon}<span>Code</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Tag filters */}
      {tags.length > 2 && (
        <div className="proj-filters" role="tablist" aria-label="Filter projects by tag">
          {tags.map(t => (
            <button
              key={t}
              role="tab"
              aria-selected={activeTag === t}
              className={`proj-filter${activeTag === t ? ' active' : ''}`}
              onClick={() => setActiveTag(t)}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {/* Bento grid */}
      <div className="proj-grid proj-grid--bento" style={{ marginTop: 'var(--space-xl)' }}>
        {filtered.length === 0 ? (
          <div className="proj proj--dyn">
            <div className="head"><span className="tag">note</span></div>
            <h3>No projects match this filter</h3>
            <p>Try a different tag.</p>
          </div>
        ) : (
          filtered.map((it, i) => {
            const hostname = it.live ? safeHostname(it.live) : null;
            const isBig = i === 0 && filtered.length > 2;
            const body = (
              <>
                <div className="head">
                  {repoIcon}
                  <span className="tag">{it.tags[0] || 'project'}</span>
                </div>
                <h3>{it.title}</h3>
                <p>{it.desc}</p>
                {(hostname || it.meta) && (
                  <div className="proj-result">
                    {hostname && <><span className="l">Live</span><span className="v">{hostname}</span></>}
                    {it.meta && <><span className="d">{hostname ? '·' : ''}</span><span className="l">{it.meta.l}</span><span className="v">{it.meta.v}</span></>}
                  </div>
                )}
                {it.tags.length > 0 && (
                  <div className="proj-specs">
                    {it.tags.slice(0, 4).map(t => <span key={t} className="s">{t}</span>)}
                  </div>
                )}
              </>
            );
            const className = `proj proj--dyn stagger-up${isBig ? ' proj--wide' : ''}`;
            const style = { transitionDelay: `${i * 80}ms` };
            return it.href ? (
              <a key={it.key} href={it.href} target="_blank" rel="noopener noreferrer" className={className} style={style}>{body}</a>
            ) : (
              <div key={it.key} className={className} style={style}>{body}</div>
            );
          })
        )}
      </div>
    </SpecSection>
  );
}
