import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import SpecSection from './SpecSection';
import ContributionGraph from './ContributionGraph';
import { fetchRepos, fetchCommit, fetchRepoActivity, formatSize, activeSince } from '../utils/github';
import ProjectDetail from './ProjectDetail';

// GitHub language colors — a minimal set for the languages in this repo list
const LANG_COLORS = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Python: '#3572a5',
  React: '#61dafb',
};

function langColor(lang) {
  return LANG_COLORS[lang] || '#666';
}

const FEATURED_PROJECT = {
  name: 'Synapse',
  tagline: 'Collaborative learning platform with AI-powered quizzes',
  problem:
    'Students and teams studying together need a way to turn study materials into active recall practice. Existing flashcard apps are static \u2014 they don\u2019t generate questions from your notes or adapt to what you\u2019re getting wrong.',
  decisions: [
    'Authentication + room system via Supabase so each study group gets a private space with owner and admin roles.',
    'Upload any document (PDF, DOCX, pasted text) and run it through OpenAI to generate multiple-choice and true/false questions at configurable difficulty.',
    'Built-in SM-2 spaced repetition algorithm that automatically identifies weak questions and schedules reviews \u2014 no manual curation needed.',
  ],
  result:
    'A live learning platform where users upload materials, get AI-generated quizzes, compete on leaderboards, and reinforce weak areas through spaced repetition. Deployed with offline support, push notifications, and full authentication.',
  tech: ['TypeScript', 'React', 'Supabase', 'OpenAI', 'Vite'],
  live: 'https://synapse-khaki.vercel.app',
  repo: 'https://github.com/frontenddevmichael/synapse',
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

function safeHostname(url) {
  try {
    const u = url.startsWith('http') ? new URL(url) : new URL('https://' + url);
    return u.hostname.replace('www.', '');
  } catch { return null; }
}

const repoIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
);

export default function Work() {
  const [repos, setRepos] = useState(null);
  const [activeTag, setActiveTag] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [commits, setCommits] = useState({});
  const [activity, setActivity] = useState({});
  const gridRef = useRef(null);

  useEffect(() => {
    fetchRepos()
      .then(data => setRepos(data))
      .catch(() => setRepos([]));
  }, []);

  // Fetch latest commit for each repo on load (parallel)
  useEffect(() => {
    if (!repos || repos.length === 0) return;
    let cancelled = false;
    const batch = repos.slice(0, 12);
    Promise.all(
      batch.map(async (r) => {
        const c = await fetchCommit(r.name);
        return { name: r.name, commit: c };
      })
    ).then((results) => {
      if (cancelled) return;
      const map = {};
      results.forEach(({ name, commit }) => {
        if (commit) map[name] = commit;
      });
      setCommits(map);
    });
    return () => { cancelled = true; };
  }, [repos]);

  // Fetch commit activity (weekly sparkline data) for each repo
  useEffect(() => {
    if (!repos || repos.length === 0) return;
    let cancelled = false;
    const batch = repos.slice(0, 12);
    Promise.all(
      batch.map(async (r) => {
        const a = await fetchRepoActivity(r.name);
        return { name: r.name, weeks: a };
      })
    ).then((results) => {
      if (cancelled) return;
      const map = {};
      results.forEach(({ name, weeks }) => {
        if (weeks) map[name] = weeks;
      });
      setActivity(map);
    });
    return () => { cancelled = true; };
  }, [repos]);

  const featured = useMemo(() => {
    if (!repos || repos.length === 0) return FEATURED_PROJECT;
    const synapse = repos.find(r => r.name.toLowerCase() === 'synapse');
    if (!synapse) return FEATURED_PROJECT;

    const tech = synapse.topics && synapse.topics.length >= 3
      ? synapse.topics.slice(0, 5)
      : synapse.lang
        ? [synapse.lang, ...(synapse.topics || [])].slice(0, 5)
        : FEATURED_PROJECT.tech;

    return {
      ...FEATURED_PROJECT,
      tagline: synapse.desc || FEATURED_PROJECT.tagline,
      tech,
      live: synapse.live || FEATURED_PROJECT.live,
      repo: synapse.url || FEATURED_PROJECT.repo,
    };
  }, [repos]);

  const hasRepos = repos !== null;
  const gridItems = useMemo(() => {
    if (hasRepos && repos.length > 0) {
      return repos.slice(0, 12).map(r => ({
        key: r.name,
        name: r.name,
        title: r.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        desc: r.desc || '',
        tags: r.topics && r.topics.length ? r.topics.slice(0, 4) : (r.lang ? [r.lang] : []),
        meta: r.stars != null ? { l: 'Stars', v: r.stars } : null,
        live: r.live,
        href: r.live || r.url,
        lang: r.lang,
        stars: r.stars,
        size: r.size,
        forks: r.forks,
        openIssues: r.openIssues,
        license: r.license,
        createdAt: r.createdAt,
        pushedAt: r.pushedAt,
        defaultBranch: r.defaultBranch,
        archived: r.archived,
      }));
    }
    return STATIC_PROJECTS.map(p => ({
      key: p.name,
      name: p.name,
      title: p.name,
      desc: p.desc,
      tags: p.topics,
      meta: p.meta,
      live: null,
      href: null,
      lang: p.lang,
      stars: null,
      size: null,
      forks: null,
      openIssues: null,
      license: null,
      createdAt: null,
      pushedAt: null,
      defaultBranch: null,
      archived: null,
    }));
  }, [hasRepos, repos]);

  // Scroll-triggered IntersectionObserver for card entrance animations
  // Must be placed AFTER gridItems declaration to avoid TDZ error
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = grid.querySelectorAll('.proj-card:not(.in-view)');
    if (!cards.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
    cards.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [gridItems.length]);

  // Mouse tracking glow on grid
  const handleGridMouse = useCallback((e) => {
    const grid = gridRef.current;
    if (!grid) return;
    const rect = grid.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    grid.style.setProperty('--mmx', x);
    grid.style.setProperty('--mmy', y);
  }, []);

  const tags = useMemo(() => {
    const set = new Set();
    gridItems.forEach(it => it.tags.forEach(t => set.add(t)));
    return ['All', ...Array.from(set).sort()];
  }, [gridItems]);

  const filtered = activeTag === 'All'
    ? gridItems
    : gridItems.filter(it => it.tags.includes(activeTag));

  const openDetail = useCallback((item) => {
    setSelectedProject(item);
  }, []);

  const closeDetail = useCallback(() => {
    setSelectedProject(null);
  }, []);

  return (
    <SpecSection id="work" num="02" title="Work">
      <ContributionGraph />

      {/* Featured Project */}
      <div className="featured-proj stagger-up" style={{ marginTop: 'var(--space-2xl)', '--lang-color': '#61dafb' }}>
        <div className="featured-proj-head">
          <span className="tag tag--featured">
            <span className="tag-dot"></span>
            Featured
          </span>
          <h3>{featured.name}</h3>
          <p className="featured-tagline">{featured.tagline}</p>
        </div>
        <div className="featured-proj-body">
          <div className="fp-block">
            <span className="fp-label">Problem</span>
            <p>{featured.problem}</p>
          </div>
          <div className="fp-block">
            <span className="fp-label">Decisions</span>
            <ul>
              {featured.decisions.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          </div>
          <div className="fp-block">
            <span className="fp-label">Result</span>
            <p>{featured.result}</p>
          </div>
        </div>
        <div className="featured-proj-foot">
          <div className="proj-specs">
            {featured.tech.map(t => <span key={t} className="s">{t}</span>)}
          </div>
          <div className="fp-links">
            {featured.live && (
              <a href={featured.live} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">Live site</a>
            )}
            {featured.repo && (
              <a href={featured.repo} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" style={{width:14,height:14}}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
                Code
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Tag filters */}
      {tags.length > 2 && (
        <div className="proj-filters scroll-fade" role="tablist" aria-label="Filter projects by tag">
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

      {/* Bento grid with mouse tracking glow */}
      <div
        className="proj-grid proj-grid--bento proj-grid--track"
        style={{ marginTop: 'var(--space-xl)' }}
        ref={gridRef}
        onMouseMove={handleGridMouse}
      >
        {filtered.length === 0 ? (
          <div className="proj proj-card">
            <div className="head"><span className="tag">note</span></div>
            <h3>No projects match this filter</h3>
            <p>Try a different tag.</p>
          </div>
        ) : (
          filtered.map((it, i) => {
            const hostname = it.live ? safeHostname(it.live) : null;
            const langColorVal = langColor(it.lang);
            const c = commits[it.name];
            const weeks = activity[it.name];
            const maxCommits = weeks ? Math.max(...weeks, 1) : 0;
            const age = it.createdAt ? activeSince(it.createdAt) : null;
            const size = it.size != null ? formatSize(it.size) : null;

            const body = (
              <>
                <div className="head ma--head">
                  <span className="head-icon-wrap">{repoIcon}</span>
                  <span className="tag">{it.tags[0] || 'project'}</span>
                </div>
                <h3 className="ma--title">{it.title}</h3>
                <p className="ma--desc">{it.desc}</p>

                <div className="proj-meta ma--meta">
                  {it.lang && (
                    <span className="proj-lang" style={{ '--ma-delay': '0' }}>
                      <span className="proj-lang-dot" style={{ background: langColorVal }} />
                      {it.lang}
                    </span>
                  )}
                  {size && (
                    <span className="proj-badge" style={{ '--ma-delay': '1' }}>
                      <svg viewBox="0 0 16 16" fill="currentColor" width="10" height="10"><path d="M2 1.75C2 .784 2.784 0 3.75 0h8.5C13.216 0 14 .784 14 1.75v12.5c0 .966-.784 1.75-1.75 1.75h-8.5A1.75 1.75 0 012 14.25V1.75zm1.75-.25a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h8.5a.25.25 0 00.25-.25V1.75a.25.25 0 00-.25-.25h-8.5zM5 4.75A.75.75 0 015.75 4h4.5a.75.75 0 010 1.5h-4.5A.75.75 0 015 4.75zm0 3a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5A.75.75 0 015 7.75z"/></svg>
                      {size}
                    </span>
                  )}
                  {age && (
                    <span className="proj-badge" style={{ '--ma-delay': '2' }}>
                      <svg viewBox="0 0 16 16" fill="currentColor" width="10" height="10"><path d="M2 2.75A2.75 2.75 0 014.75 0h6.5A2.75 2.75 0 0114 2.75v10.5A2.75 2.75 0 0111.25 16h-6.5A2.75 2.75 0 012 13.25V2.75zM4.75 1.5c-.69 0-1.25.56-1.25 1.25v.5h9v-.5c0-.69-.56-1.25-1.25-1.25h-6.5zM12.5 5h-9v8.25c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V5z"/></svg>
                      {age}
                    </span>
                  )}
                  {it.forks != null && it.forks > 0 && (
                    <span className="proj-badge" style={{ '--ma-delay': '3' }}>
                      <svg viewBox="0 0 16 16" fill="currentColor" width="10" height="10"><path fillRule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878z"/></svg>
                      {it.forks}
                    </span>
                  )}
                  {it.stars != null && it.stars > 0 && (
                    <span className="proj-stars" style={{ '--ma-delay': '4' }}>
                      <svg className="star-icon" viewBox="0 0 16 16" fill="currentColor" width="12" height="12"><path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.192L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/></svg>
                      <span className="star-count">{it.stars}</span>
                    </span>
                  )}
                </div>

                {/* Mini sparkline: 12-week commit activity bars */}
                {weeks && weeks.length > 0 && (
                  <div className="proj-spark ma--spark">
                    <div className="spark-track">
                      {weeks.slice(-12).map((count, wi) => (
                        <span
                          key={wi}
                          className="spark-bar"
                          style={{
                            height: `${Math.max(2, (count / maxCommits) * 24)}px`,
                            '--spark-delay': `${wi * 30}ms`,
                          }}
                        />
                      ))}
                    </div>
                    <span className="spark-label">12wk activity</span>
                  </div>
                )}

                <div className="proj-foot ma--foot">
                  {it.live && (
                    <span className="proj-live-badge">
                      <span className="live-dot"></span>
                      Live
                    </span>
                  )}
                  {c?.date && (
                    <span className="proj-commit-info">
                      <svg viewBox="0 0 16 16" fill="currentColor" width="10" height="10">
                        <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 14.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13zM7.5 4a.5.5 0 01.5.5V8l3 1.5a.5.5 0 01-.5.866l-3.5-1.75A.5.5 0 017 8V4.5a.5.5 0 01.5-.5z"/>
                      </svg>
                      {((Date.now() - new Date(c.date).getTime()) / 86400000).toFixed(0)}d ago
                    </span>
                  )}
                  {c?.message && (
                    <span className="proj-commit-msg" title={c.message}>
                      <svg viewBox="0 0 16 16" fill="currentColor" width="10" height="10"><path fillRule="evenodd" d="M10.5 7.75a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm1.43.75a4.002 4.002 0 01-7.86 0H.75a.75.75 0 110-1.5h3.32a4.001 4.001 0 017.86 0h3.32a.75.75 0 110 1.5h-3.32z"/></svg>
                      <span className="commit-msg-text">{c.message}</span>
                    </span>
                  )}
                  {it.tags.length > 0 && (
                    <div className="proj-specs">
                      {it.tags.slice(0, 4).map((t, ti) => (
                        <span key={t} className="s" style={{ '--ma-delay': `${ti}` }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </>
            );

            const style = {
              '--card-index': i,
              '--lang-color': langColorVal,
              transitionDelay: `${i * 60}ms`,
            };
            return (
              <div
                key={it.key}
                className="proj proj-card"
                style={style}
                data-card-index={i}
                role="button"
                tabIndex={0}
                aria-label={`View details for ${it.title || it.name}`}
                onClick={() => openDetail({ ...it, hostname, commit: c, weeks })}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDetail({ ...it, hostname, commit: c, weeks }); } }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  e.currentTarget.style.setProperty('--mx', x);
                  e.currentTarget.style.setProperty('--my', y);
                }}
              >
                {body}
              </div>
            );
          })
        )}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          commit={commits[selectedProject.name] || null}
          onClose={closeDetail}
        />
      )}
    </SpecSection>
  );
}
