const USER = 'frontenddevmichael';

export async function fetchRepos() {
  const res = await fetch(`https://api.github.com/users/${USER}/repos?sort=updated&per_page=30&type=public`);
  if (!res.ok) throw new Error('Failed to fetch repos');
  const data = await res.json();
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
    const res = await fetch('/api/contributions');
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
