import { useState, useEffect, useRef } from 'react';
import { LINKS } from '../data/links';

function CoffeeCup({ celebrate }) {
  return (
    <svg className={`support-cup-svg${celebrate ? ' sup--celebrate' : ''}`} viewBox="0 0 120 140" fill="none">
      <defs>
        <clipPath id="cup-mask">
          <rect x="0" y="0" width="120" height="140" />
        </clipPath>
      </defs>
      {!celebrate && (
        <g clipPath="url(#cup-mask)">
          <path className="sup-steam sup-steam--1" d="M36,28 Q32,12 38,-4" strokeWidth="1.4" strokeLinecap="round" />
          <path className="sup-steam sup-steam--2" d="M55,26 Q51,10 57,-6" strokeWidth="1.4" strokeLinecap="round" />
          <path className="sup-steam sup-steam--3" d="M74,28 Q70,12 76,-6" strokeWidth="1.4" strokeLinecap="round" />
          <path className="sup-steam sup-steam--4" d="M46,30 Q42,14 48,-2" strokeWidth="1.4" strokeLinecap="round" />
          <path className="sup-steam sup-steam--5" d="M64,30 Q60,14 66,-4" strokeWidth="1.4" strokeLinecap="round" />
        </g>
      )}
      {celebrate && (
        <g clipPath="url(#cup-mask)">
          {[0, 1, 2, 3, 4].map(i => (
            <path key={i} className="sup-heart" style={{animationDelay: `${i * 0.35}s`}}
              d="M60,24 C58,19 53,16 49,20 C45,24 45,30 60,44 C75,30 75,24 71,20 C67,16 62,19 60,24Z" />
          ))}
        </g>
      )}
      <path className="sup-handle" d="M90,45 Q115,48 112,72 Q110,88 90,85" strokeWidth="1.4" />
      <path className="sup-cup" d="M27,36 L33,102 L87,102 L93,36" strokeWidth="1.4" />
      <path className="sup-rim" d="M25,36 L95,36" strokeWidth="1.8" strokeLinecap="round" />
      <g className="sup-coffee-g">
        <path className="sup-coffee" d="M30,42 L35,98 L85,98 L90,42" />
        <path className="sup-coffee-shine" d="M37,50 L39,92" strokeWidth="1.5" strokeLinecap="round" opacity="0.15" />
      </g>
      <ellipse className="sup-saucer" cx="60" cy="107" rx="46" ry="5" strokeWidth="1.4" />
      {celebrate && (
        <>
          <circle className="sup-check-circle" cx="60" cy="66" r="22" strokeWidth="2.5" />
          <path className="sup-check" d="M48,66 L56,74 L73,57" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
    </svg>
  );
}

export default function Support() {
  const [phase, setPhase] = useState('idle');
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(LINKS.bank.number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = LINKS.bank.number;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="section support" id="support" ref={ref}>
      <div className="container">
        <div className="section-grid">
          <div className="spec-h stagger-left">
            <span className="num">-- sup</span>
            <h2>Support</h2>
            <span className="dim"></span>
          </div>
          <div className="section-body">
            <div className={`support-inner${visible ? ' visible' : ''}${phase === 'success' ? ' sup--celebrate' : ''}`}>

              {phase === 'success' ? (
                <>
                  <div className="support-cup-col sup-success-cup">
                    <CoffeeCup celebrate />
                  </div>
                  <div className="support-text-col">
                    <div className="sup-chip" style={{animation:'fade-up 0.4s var(--ease-out) 0.1s both'}}>thank you</div>
                    <h3 className="sup-head" style={{animation:'fade-up 0.4s var(--ease-out) 0.2s both'}}>You're awesome!</h3>
                    <p className="sup-sub" style={{animation:'fade-up 0.4s var(--ease-out) 0.35s both'}}>
                      Your support means the world. This coffee fuels the next line of code.
                    </p>
                    <div className="sup-actions" style={{animation:'fade-up 0.4s var(--ease-out) 0.5s both'}}>
                      <button className="btn sup-btn" onClick={() => { setPhase('idle'); setCopied(false); }}>
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <path d="M8 1v14M4 11l4 4 4-4" />
                        </svg>
                        Buy again
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="support-cup-col">
                    <CoffeeCup />
                  </div>
                  <div className="support-text-col">
                    <div className="sup-chip stagger-pop">donate</div>
                    <h3 className="sup-head stagger-up" style={{transitionDelay:'0.1s'}}>Buy me a coffee</h3>
                    <p className="sup-sub stagger-up" style={{transitionDelay:'0.2s'}}>
                      If my work has helped you, consider buying me a coffee. Transfer to the account below.
                    </p>

                    <div className="sup-bank stagger-up" style={{transitionDelay:'0.3s'}}>
                      <div className="sup-bank-row">
                        <span className="sup-bank-l">Bank</span>
                        <span className="sup-bank-v">{LINKS.bank.bank}</span>
                      </div>
                      <div className="sup-bank-row">
                        <span className="sup-bank-l">Name</span>
                        <span className="sup-bank-v">{LINKS.bank.name}</span>
                      </div>
                      <div className="sup-bank-row sup-bank-row--acct" onClick={handleCopy} style={{cursor:'pointer'}} title="Tap to copy">
                        <span className="sup-bank-l">Account</span>
                        <span className="sup-bank-v sup-bank-num">{LINKS.bank.number}</span>
                      </div>
                      <button className={`sup-copy-btn${copied ? ' sup-copy-btn--done' : ''}`}
                        onClick={handleCopy} aria-label="Copy account number">
                        {copied ? (
                          <>
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                              <path d="M3 8l3 3 7-7" />
                            </svg>
                            Copied!
                          </>
                        ) : (
                          <>
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                              <rect x="2" y="2" width="10" height="12" rx="1" /><path d="M6 4h7a1 1 0 011 1v8a1 1 0 01-1 1H6a1 1 0 01-1-1V5a1 1 0 011-1z" />
                            </svg>
                            Copy account number
                          </>
                        )}
                      </button>
                    </div>

                    {copied && (
                      <div className="sup-actions stagger-up" style={{transitionDelay:'0.4s'}}>
                        <button className="btn sup-btn" onClick={() => setPhase('success')}>
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                            <path d="M8 1v14M4 11l4 4 4-4" />
                          </svg>
                          I've sent it!
                        </button>
                      </div>
                    )}

                    <p className="sup-footnote stagger-up" style={{transitionDelay:'0.45s'}}>
                      Transfer any amount &mdash; every drop fuels the code.
                    </p>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
