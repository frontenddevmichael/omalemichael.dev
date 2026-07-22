const USER = 'frontenddevmichael';

export async function fetchRepos() {
  // Fetch through the server-side proxy so the GITHUB_TOKEN authenticates
  // the request — this gives 5,000 requests/hour instead of 60.
  const res = await fetch(`/api/repos?_=${Date.now()}`);
  if (!res.ok) throw new Error('Failed to fetch repos');
  const data = await res.json();
  if (!Array.isArray(data)) {
    // Hit GitHub's rate limit or another error
    if (data.message) console.warn('GitHub API:', data.message);
    throw new Error(data.message || 'GitHub API error');
  }
  return data
    .filter(r => !r.fork)
    .map(r => ({
      name: r.name,
      desc: r.description,
      url: r.html_url,
      live: r.homepage || null,
      stars: r.stargazers_count,
      lang: r.language,
      topics: r.topics || [],
      size: r.size,
      forks: r.forks_count,
      openIssues: r.open_issues_count,
      license: r.license?.spdx_id || null,
      createdAt: r.created_at,
      pushedAt: r.pushed_at,
      updatedAt: r.updated_at,
      defaultBranch: r.default_branch,
      archived: r.archived,
    }));
}

// Contribution calendar requires GitHub's GraphQL API, which requires auth.
// That token must NEVER live in client code (a VITE_ env var ships straight into
// the browser bundle -- anyone can read it in devtools). Instead this calls a
// same-origin serverless function that holds the token server-side.
// See /api/contributions.js -- deploy it (Vercel/Netlify function) and set
// GITHUB_TOKEN as a server-only environment variable there (no VITE_ prefix).
export async function fetchContributions() {
  try {
    // Cache-bust: append timestamp so the browser never serves a stale response
    const res = await fetch(`/api/contributions?_=${Date.now()}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchCommit(repoName) {
  try {
    const res = await fetch(`/api/commit/${repoName}?_=${Date.now()}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || data.message) return null;
    return {
      sha: data.sha ? data.sha.slice(0, 7) : null,
      message: data.commit?.message?.split('\n')[0] || null,
      date: data.commit?.author?.date || null,
    };
  } catch {
    return null;
  }
}

// Fetch commit activity (weekly commit counts for last 52 weeks) for mini sparkline
export async function fetchRepoActivity(repoName) {
  try {
    const res = await fetch(`/api/activity/${repoName}?_=${Date.now()}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    return data.map(w => w.total || 0);
  } catch {
    return null;
  }
}

// Format bytes into human-readable size
export function formatSize(kb) {
  if (!kb || kb === 0) return '';
  if (kb < 1024) return `${kb} KB`;
  const mb = (kb / 1024).toFixed(1);
  return `${mb} MB`;
}

// Return "Active X months" or "Active X years"
export function activeSince(isoDate) {
  if (!isoDate) return '';
  const created = new Date(isoDate);
  const now = new Date();
  const months = (now.getFullYear() - created.getFullYear()) * 12 + now.getMonth() - created.getMonth();
  if (months < 1) return 'new';
  if (months < 12) return `Active ${months}mo`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  return rem > 0 ? `Active ${years}y ${rem}mo` : `Active ${years}y`;
}

// Fetch commits for a specific date via GitHub search API
export async function fetchCommitsByDate(dateStr) {
  try {
    const res = await fetch(`/api/search-commits?date=${dateStr}`);
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.map(c => ({
      sha: c.sha ? c.sha.slice(0, 7) : null,
      message: c.commit?.message?.split('\n')[0] || null,
      repo: c.repository?.full_name?.split('/')[1] || null,
      url: c.html_url,
    }));
  } catch {
    return [];
  }
}

// Return a human-friendly relative time string from an ISO date
const UNITS = [
  { label: 'year',  ms: 31536000000 },
  { label: 'month', ms: 2592000000 },
  { label: 'week',  ms: 604800000 },
  { label: 'day',   ms: 86400000 },
  { label: 'hour',  ms: 3600000 },
  { label: 'min',   ms: 60000 },
];
export function timeAgo(isoDate) {
  if (!isoDate) return '';
  const diff = Date.now() - new Date(isoDate).getTime();
  if (diff < 0) return 'just now';
  for (const u of UNITS) {
    const n = Math.floor(diff / u.ms);
    if (n >= 1) return `${n} ${u.label}${n > 1 ? 's' : ''} ago`;
  }
  return 'just now';
}
