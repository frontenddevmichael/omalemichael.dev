import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { timeAgo, formatSize, activeSince } from '../utils/github';
import { addScrollLock, removeScrollLock } from '../utils/scrollLock';

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

export default function ProjectDetail({ project, commit, onClose }) {
  const panelRef = useRef(null);
  const prevFocus = useRef(null);

  useEffect(() => {
    prevFocus.current = document.activeElement;
    panelRef.current?.focus();
    addScrollLock(); // shared module-level counter
    return () => {
      removeScrollLock(); // shared module-level counter
      prevFocus.current?.focus();
    };
  }, []);

  useEffect(() => {
    if (!onClose) return;
    const handler = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
      if (e.key === 'Tab') {
        // Trap focus inside modal
        const focusable = panelRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Swipe-to-dismiss gesture state
  const touchStartY = useRef(null);

  const onTouchStart = useCallback((e) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const onTouchMove = useCallback((e) => {
    if (touchStartY.current === null) return;
    const panel = panelRef.current;
    if (!panel || panel.scrollTop > 0) return; // Only swipe when scrolled to top
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta < 0) return; // Only allow downward swipe
    const translate = Math.min(delta, 200);
    const opacity = Math.max(0, 1 - delta / 300);
    panel.style.transform = `translateY(${translate}px)`;
    panel.style.opacity = opacity;
    panel.style.transition = 'none';
  }, []);

  const onTouchEnd = useCallback((e) => {
    if (touchStartY.current === null) return;
    const delta = e.changedTouches[0].clientY - touchStartY.current;
    const panel = panelRef.current;
    if (panel) {
      panel.style.transition = '';
      panel.style.transform = '';
      panel.style.opacity = '';
    }
    if (delta > 120 && panel?.scrollTop === 0) {
      onClose();
    }
    touchStartY.current = null;
  }, [onClose]);

  if (!project) return null;

  const {
    title, desc, lang, tags, stars, live, href, hostname, name,
    size, forks, createdAt, weeks
  } = project;
  const color = lang ? langColor(lang) : null;
  const commitDate = commit?.date ? timeAgo(commit.date) : null;
  const age = createdAt ? activeSince(createdAt) : null;
  const sizeStr = size != null ? formatSize(size) : null;
  const maxWeeks = weeks ? Math.max(...weeks, 1) : 0;

  const body = (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-panel"
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Project details'}
        onClick={e => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseMove={e => {
          // Mouse tracking glow on the modal panel
          const rect = panelRef.current?.getBoundingClientRect();
          if (rect) {
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            panelRef.current?.style.setProperty('--mx', x);
            panelRef.current?.style.setProperty('--my', y);
          }
        }}
        style={{ '--lang-color': color || '#666' }}
      >
        {/* Close button */}
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Header */}
        <div className="modal-head">
          <span className="modal-live-indicator">
            <span className="live-dot"></span>
            {live ? 'Deployed' : 'Repository'}
          </span>
          <h2 className="modal-title">{title || name}</h2>
          {desc && <p className="modal-desc">{desc}</p>}
        </div>

        {/* Meta row */}
        <div className="modal-meta modal-meta--detail">
          {lang && (
            <span className="modal-meta-item ma--mi">
              <span className="proj-lang-dot" style={{ background: color }} />
              {lang}
            </span>
          )}
          {sizeStr && (
            <span className="modal-meta-item ma--mi" style={{ '--md': '1' }}>
              <svg viewBox="0 0 16 16" fill="currentColor" width="10" height="10"><path d="M2 1.75C2 .784 2.784 0 3.75 0h8.5C13.216 0 14 .784 14 1.75v12.5c0 .966-.784 1.75-1.75 1.75h-8.5A1.75 1.75 0 012 14.25V1.75zm1.75-.25a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h8.5a.25.25 0 00.25-.25V1.75a.25.25 0 00-.25-.25h-8.5zM5 4.75A.75.75 0 015.75 4h4.5a.75.75 0 010 1.5h-4.5A.75.75 0 015 4.75zm0 3a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5A.75.75 0 015 7.75z"/></svg>
              {sizeStr}
            </span>
          )}
          {age && (
            <span className="modal-meta-item ma--mi" style={{ '--md': '2' }}>
              <svg viewBox="0 0 16 16" fill="currentColor" width="10" height="10"><path d="M2 2.75A2.75 2.75 0 014.75 0h6.5A2.75 2.75 0 0114 2.75v10.5A2.75 2.75 0 0111.25 16h-6.5A2.75 2.75 0 012 13.25V2.75zM4.75 1.5c-.69 0-1.25.56-1.25 1.25v.5h9v-.5c0-.69-.56-1.25-1.25-1.25h-6.5zM12.5 5h-9v8.25c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V5z"/></svg>
              {age}
            </span>
          )}
          {forks != null && forks > 0 && (
            <span className="modal-meta-item ma--mi" style={{ '--md': '3' }}>
              <svg viewBox="0 0 16 16" fill="currentColor" width="10" height="10"><path fillRule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878z"/></svg>
              {forks} forks
            </span>
          )}
          {hostname && <span className="modal-meta-item ma--mi" style={{ '--md': '4' }}>{hostname}</span>}
          {stars != null && (
            <span className="modal-meta-item modal-stars ma--mi" style={{ '--md': '5' }}>
              <svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12">
                <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.192L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
              </svg>
              {stars}
            </span>
          )}
          {commitDate && (
            <span className="modal-meta-item modal-commit-date ma--mi" style={{ '--md': '6' }}>
              <svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12">
                <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 14.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13zM7.5 4a.5.5 0 01.5.5V8l3 1.5a.5.5 0 01-.5.866l-3.5-1.75A.5.5 0 017 8V4.5a.5.5 0 01.5-.5z"/>
              </svg>
              Updated {commitDate}
            </span>
          )}
        </div>

        {/* Modal sparkline */}
        {weeks && weeks.length > 0 && (
          <div className="modal-spark ma--spark">
            <span className="spark-label">Commit activity (12 weeks)</span>
            <div className="spark-track">
              {weeks.slice(-12).map((count, wi) => (
                <span
                  key={wi}
                  className="spark-bar"
                  style={{
                    height: `${Math.max(2, (count / maxWeeks) * 28)}px`,
                    '--spark-delay': `${wi * 30}ms`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="modal-tags">
            {tags.map((t, ti) => <span key={t} className="s" style={{ '--md': `${ti + 7}` }}>{t}</span>)}
          </div>
        )}

        {/* Commit detail */}
        {commit?.message && commit?.sha && (
          <div className="modal-commit ma--mi" style={{ '--md': '8' }}>
            <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
              <path fillRule="evenodd" d="M10.5 7.75a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm1.43.75a4.002 4.002 0 01-7.86 0H.75a.75.75 0 110-1.5h3.32a4.001 4.001 0 017.86 0h3.32a.75.75 0 110 1.5h-3.32z"/>
            </svg>
            <span className="modal-commit-sha">{commit.sha}</span>
            <span className="modal-commit-msg">{commit.message}</span>
          </div>
        )}

        {/* Actions */}
        <div className="modal-actions">
          {live && (
            <a href={live} target="_blank" rel="noopener noreferrer" className="btn btn--ghost btn--live ma--mi" style={{ '--md': '9' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Live site
            </a>
          )}
          {href && (
            <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn--ghost ma--mi" style={{ '--md': '10' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
              </svg>
              View code
            </a>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(body, document.body);
}
