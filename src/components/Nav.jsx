export default function Nav({ onOpenPalette }) {
  return (
    <nav className="top">
      <div className="top-inner">
        <span className="logo">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.3">
            <rect x="1.5" y="1.5" width="15" height="15" rx="3"/>
            <text x="9" y="12.5" textAnchor="middle" fill="currentColor" fontFamily="Inter" fontWeight="600" fontSize="8">M</text>
          </svg>
          michael/spec
        </span>
        <button className="palette-btn" onClick={onOpenPalette}>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
            <circle cx="6.5" cy="6.5" r="4.5"/><line x1="9.8" y1="9.8" x2="14" y2="14"/>
          </svg>
          <span>Commands</span>
          <span className="k">⌘K</span>
        </button>
      </div>
    </nav>
  );
}
