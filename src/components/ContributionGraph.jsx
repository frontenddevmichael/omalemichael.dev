import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchContributions, fetchCommitsByDate } from '../utils/github';

const GAP = 2;
const NUM_COL = 20;
const DAYS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const LEVELS = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function useCellSize() {
  const [size, setSize] = useState(() => window.innerWidth < 600 ? 14 : 10);
  useEffect(() => {
    function update() { setSize(window.innerWidth < 600 ? 14 : 10); }
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return size;
}

function getLevel(c) {
  if (c === 0) return 0;
  if (c <= 3) return 1;
  if (c <= 7) return 2;
  if (c <= 15) return 3;
  return 4;
}

function computeStats(weeks) {
  if (!weeks || weeks.length === 0) return { currentStreak: 0, longestStreak: 0, bestDay: 0 };
  const days = weeks.flatMap(w => w.contributionDays || []);
  let cur = 0, longest = 0, best = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    const c = days[i].contributionCount;
    if (c > best) best = c;
    if (c > 0) cur++;
    else break;
  }
  let run = 0;
  for (const d of days) {
    if (d.contributionCount > 0) { run++; if (run > longest) longest = run; }
    else run = 0;
  }
  return { currentStreak: cur, longestStreak: longest, bestDay: best };
}

function AnimatedCount({ value, suffix = '' }) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);
  const raf = useRef(null);
  useEffect(() => {
    if (value === display) return;
    const start = prev.current;
    const diff = value - start;
    const duration = 800;
    const startTime = performance.now();
    function tick(now) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(start + diff * eased));
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else prev.current = value;
    }
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [value]);
  return <>{display.toLocaleString()}{suffix}</>;
}

export default function ContributionGraph() {
  const [data, setData] = useState(undefined);
  const [inView, setInView] = useState(false);
  const [tooltip, setTooltip] = useState(null);
  const [dayCommits, setDayCommits] = useState({});
  const rootRef = useRef(null);
  const wrapRef = useRef(null);

  const CELL = useCellSize();
  const COL_W = CELL + GAP;

  useEffect(() => { fetchContributions().then(setData); }, []);
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!data || !wrapRef.current) return;
    wrapRef.current.scrollLeft = wrapRef.current.scrollWidth;
  }, [data]);

  const onCellEnter = useCallback((e, day, dateStr) => {
    const cr = e.target.closest('.contrib').getBoundingClientRect();
    const rr = e.target.getBoundingClientRect();
    const isMobile = window.innerWidth < 600;
    setTooltip({
      x: rr.left - cr.left + rr.width / 2,
      y: isMobile ? rr.top - cr.top + rr.height + 8 : rr.top - cr.top,
      date: dateStr, count: day.contributionCount,
      below: isMobile,
    });
    if (!dayCommits[dateStr] && day.contributionCount > 0) {
      if (onCellEnter._t) clearTimeout(onCellEnter._t);
      onCellEnter._t = setTimeout(() => {
        fetchCommitsByDate(dateStr).then(c => setDayCommits(p => ({ ...p, [dateStr]: c || [] })));
      }, 300);
    }
  }, [dayCommits]);
  const onCellLeave = useCallback(() => setTooltip(null), []);

  const weeks = data?.weeks || [];
  const total = data?.totalContributions || 0;
  const source = data?.source || 'unknown';
  const isMock = source === 'mock';
  const stats = computeStats(weeks);
  const w = weeks.length * COL_W + NUM_COL;
  const h = 7 * COL_W;
  const todayStr = new Date().toISOString().slice(0, 10);

  // Flatten, find peak
  const allDays = [];
  let peakCount = 0, peakWi = -1, peakDi = -1;
  weeks.forEach((week, wi) => week.contributionDays.forEach((day, di) => {
    allDays.push({ ...day, wi, di });
    if (day.contributionCount > peakCount) { peakCount = day.contributionCount; peakWi = wi; peakDi = di; }
  }));

  // Month boundaries, quarter separators
  const months = [];
  const quarterWeeks = [];
  let prevMonth = -1;
  weeks.forEach((week, wi) => {
    const fd = week.contributionDays?.[0];
    if (!fd?.date) return;
    const m = new Date(fd.date).getMonth();
    if (m !== prevMonth) {
      months.push({ month: m, startWi: wi, total: 0 });
      prevMonth = m;
      if ([0, 3, 6, 9].includes(m) && wi > 0) quarterWeeks.push(wi);
    }
    if (months.length) week.contributionDays.forEach(d => { months[months.length - 1].total += d.contributionCount; });
  });
  const maxMonthTotal = Math.max(...months.map(m => m.total), 1);

  // Year projection
  const firstDate = allDays[0]?.date;
  const lastDate = allDays[allDays.length - 1]?.date;
  const daysCovered = firstDate && lastDate ? Math.max(1, (+new Date(lastDate) - +new Date(firstDate)) / 86400000) : 1;
  const dailyAvg = total / daysCovered;
  const projected = Math.round(dailyAvg * 365);
  const peakMonth = months.reduce((best, m) => m.total > (best?.total || 0) ? m : best, null);

  // Week label positions (spread across year)
  const weekLabels = weeks.length > 0
    ? [...new Set([1, Math.round(weeks.length/4), Math.round(weeks.length/2), Math.round(3*weeks.length/4), weeks.length])]
        .filter(w => w > 0).map(w => w - 1)
    : [];

  return (
    <div ref={rootRef} className={`contrib${inView ? ' contrib--visible' : ''}`}>
      {data === undefined && <div className="contrib-placeholder contrib-placeholder--loading" aria-busy="true" />}
      {data && (<>
      <div className="contrib-head">
        <div className="contrib-head-stats">
          <span className="contrib-label">Contributions</span>
          <span className="contrib-count"><AnimatedCount value={total} suffix=" this year" /></span>
          {projected > total && <span className="contrib-projected">· on track for {projected.toLocaleString()}</span>}
        </div>
        <div className="contrib-highlights">
          {stats.currentStreak > 0 && <span className="contrib-hl" style={{'--hl-delay':'0'}}>
            <svg viewBox="0 0 16 16" fill="currentColor" width="10" height="10"><path d="M8 16A8 8 0 108 0a8 8 0 000 16zm1-11.5a.5.5 0 01.5.5v4a.5.5 0 01-.5.5H6a.5.5 0 010-1h2.5V5a.5.5 0 01.5-.5z"/></svg>
            {stats.currentStreak}d streak
          </span>}
          {stats.bestDay > 1 && <span className="contrib-hl" style={{'--hl-delay':'1'}}>
            <svg viewBox="0 0 16 16" fill="currentColor" width="10" height="10"><path d="M8 1a.5.5 0 01.5.5v5.8l3.15-3.15a.5.5 0 01.7.7l-4 4a.5.5 0 01-.7 0l-4-4a.5.5 0 01.7-.7L7.5 7.3V1.5A.5.5 0 018 1z"/></svg>
            Best {stats.bestDay}
          </span>}
          {stats.longestStreak > 1 && <span className="contrib-hl" style={{'--hl-delay':'2'}}>
            <svg viewBox="0 0 16 16" fill="currentColor" width="10" height="10"><path d="M2.5 2A1.5 1.5 0 001 3.5v9A1.5 1.5 0 002.5 14h11a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0013.5 2h-11zM3 4.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1zm4 0a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1zm4 0a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1z"/></svg>
            {stats.longestStreak}d best
          </span>}
          {peakMonth && <span className="contrib-hl" style={{'--hl-delay':'3'}}>
            <svg viewBox="0 0 16 16" fill="currentColor" width="10" height="10"><path d="M2 2.75A2.75 2.75 0 014.75 0h6.5A2.75 2.75 0 0114 2.75v10.5A2.75 2.75 0 0111.25 16h-6.5A2.75 2.75 0 012 13.25V2.75zM4.75 1.5c-.69 0-1.25.56-1.25 1.25v.5h9v-.5c0-.69-.56-1.25-1.25-1.25h-6.5zM12.5 5h-9v8.25c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V5z"/></svg>
            Peak {new Date(2026, peakMonth.month).toLocaleString('en',{month:'short'})} ({peakMonth.total})
          </span>}
        </div>
        {isMock && <span className="contrib-mock-badge">mock</span>}
      </div>

      <div className="contrib-svg-wrap" ref={wrapRef}>
        <svg width={w} height={h + 36} className="contrib-svg">
          {weeks.map((week, wi) => {
            const fd = week.contributionDays?.[0];
            if (!fd?.date) return null;
            const isStart = wi === 0 || new Date(fd.date).getMonth() !== new Date(weeks[wi-1]?.contributionDays?.[0]?.date).getMonth();
            const label = isStart ? new Date(fd.date).toLocaleString('en',{month:'short'}) : null;
            const m = months.find(mo => mo.startWi === wi);
            return <g key={`ml-${wi}`}>
              {label && <text x={NUM_COL + wi * COL_W + 4} y={14} className="contrib-month" fontSize="9" fill="var(--text-dim)">{label}</text>}
              {m && <rect x={NUM_COL + wi * COL_W + 2} y={17} width={Math.max(4, (m.total / maxMonthTotal) * 32)} height={3} rx={1.5} fill="var(--text-muted)" opacity="0.25" />}
            </g>;
          })}

          {quarterWeeks.map(wi => (
            <line key={`q-${wi}`} x1={NUM_COL + wi * COL_W} y1={22} x2={NUM_COL + wi * COL_W} y2={h + 22}
              stroke="var(--border-light)" strokeWidth="1" opacity="0.35" />
          ))}

          {weekLabels.map(wi => (
            <text key={`wn-${wi}`} x={NUM_COL - 14} y={24 + 3 * COL_W + 3}
              className="contrib-wn" fontSize="7" fill="var(--text-dim)" textAnchor="end">{wi + 1}</text>
          ))}

          <g transform={`translate(${NUM_COL}, 24)`}>
            {weeks.map((week, wi) => week.contributionDays.map((day, di) => {
              const delay = wi * 10 + (6 - di) * 4;
              const date = new Date(day.date);
              const dayName = DAY_NAMES[date.getDay()];
              const formatted = date.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' });
              const dateStr = day.date;
              const isToday = dateStr === todayStr;
              const isPeak = wi === peakWi && di === peakDi && peakCount > 0;
              return <g key={`${wi}-${di}`}>
                <rect className="contrib-cell" x={wi * COL_W} y={di * COL_W} width={CELL} height={CELL} rx={2}
                  fill={LEVELS[getLevel(day.contributionCount)]} style={{'--cell-delay':delay}}
                  onMouseEnter={e => onCellEnter(e, day, dateStr)} onMouseLeave={onCellLeave}>
                  <title>{dayName}, {formatted} &mdash; {day.contributionCount} contribution{day.contributionCount !== 1 ? 's' : ''}</title>
                </rect>
                {isToday && <rect x={wi * COL_W - 1} y={di * COL_W - 1} width={CELL + 2} height={CELL + 2} rx={3}
                  fill="none" stroke="var(--text)" strokeWidth="1.5" opacity="0.7" className="contrib-today"
                  style={{'--cell-delay': delay + 20}} />}
                {isPeak && <text x={wi * COL_W + CELL / 2} y={di * COL_W + 9} textAnchor="middle" fontSize="8"
                  fill="var(--text)" opacity="0.8" className="contrib-peak" style={{'--cell-delay': delay + 10}}>&#x2605;</text>}
              </g>;
            }))}
          </g>
        </svg>
      </div>

      <div className="contrib-labels">
        <div className="contrib-days">
          {DAYS.map((d, i) => <span key={i} className="contrib-dl">{d}</span>)}
        </div>
        <div className="contrib-legend">
          <span className="contrib-lt">Less</span>
          {LEVELS.map((l, i) => <span key={i} className="contrib-sq" style={{ background: l }} />)}
          <span className="contrib-lt">More</span>
        </div>
      </div>

      {tooltip && <div className={`contrib-tip${tooltip.below ? ' contrib-tip--below' : ''}`} style={{ left: tooltip.x, top: tooltip.y }}>
        <div className="tip-date">{tooltip.date}</div>
        <div className="tip-count">{tooltip.count} contribution{tooltip.count !== 1 ? 's' : ''}</div>
        {dayCommits[tooltip.date] && dayCommits[tooltip.date].length > 0 && (
          <div className="tip-commits">{dayCommits[tooltip.date].slice(0, 5).map((c, i) => (
            <div key={i} className="tip-commit"><span className="tip-repo">{c.repo}</span><span className="tip-msg">{c.message}</span></div>
          ))}</div>
        )}
        {dayCommits[tooltip.date] && dayCommits[tooltip.date].length === 0 && tooltip.count > 0 && <div className="tip-loading">No commit details</div>}
        {!dayCommits[tooltip.date] && tooltip.count > 0 && <div className="tip-loading">Loading commits...</div>}
      </div>}

      {isMock && <div className="contrib-notice"><span className="contrib-notice-icon">&#x2699;</span><span>Showing sample data. Add a <code>GITHUB_TOKEN</code> env var.</span></div>}
      </>)}
    </div>
  );
}
