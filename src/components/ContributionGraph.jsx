import { useState, useEffect } from 'react';
import { fetchContributions } from '../utils/github';

function getLevel(c) {
  if (c === 0) return 0;
  if (c <= 3) return 1;
  if (c <= 7) return 2;
  if (c <= 15) return 3;
  return 4;
}

const CELL = 10;
const GAP = 2;
const DAYS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

export default function ContributionGraph({ token }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchContributions(token).then(setData);
  }, [token]);

  if (!data) {
    return (
      <div className="contrib-placeholder">
        {token ? 'Loading…' : (
          <span style={{ color: 'var(--text-dim)', fontSize: 'var(--fs-small)', fontFamily: 'var(--font-mono)' }}>
            Set <code>VITE_GITHUB_TOKEN</code> to show contribution activity
          </span>
        )}
      </div>
    );
  }

  const weeks = data.weeks || [];
  const total = data.totalContributions || 0;
  const w = weeks.length * (CELL + GAP);
  const h = 7 * (CELL + GAP);
  const levels = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];

  return (
    <div className="contrib">
      <div className="contrib-head">
        <span className="contrib-label">Contributions</span>
        <span className="contrib-count">{total.toLocaleString()} this year</span>
      </div>
      <svg width={w} height={h} className="contrib-svg">
        {weeks.map((week, wi) =>
          week.contributionDays.map((day, di) => (
            <rect
              key={`${wi}-${di}`}
              x={wi * (CELL + GAP)}
              y={di * (CELL + GAP)}
              width={CELL}
              height={CELL}
              rx={2}
              fill={levels[getLevel(day.contributionCount)]}
            >
              <title>{day.date}: {day.contributionCount} contributions</title>
            </rect>
          ))
        )}
      </svg>
      <div className="contrib-labels">
        <div className="contrib-days">
          {DAYS.map((d, i) => <span key={i} className="contrib-dl">{d}</span>)}
        </div>
        <div className="contrib-legend">
          <span className="contrib-lt">Less</span>
          {levels.map((l, i) => (
            <span key={i} className="contrib-sq" style={{ background: l }} />
          ))}
          <span className="contrib-lt">More</span>
        </div>
      </div>
    </div>
  );
}
