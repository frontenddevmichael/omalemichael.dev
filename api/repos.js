// Vercel serverless function -- fetches public repos for the portfolio's
// Work section. Works even without GITHUB_TOKEN (GitHub's REST API allows
// unauthenticated public reads), but an authenticated request raises the
// rate limit from 60/hr to 5,000/hr, which matters once this section gets
// real traffic. Token stays server-side only, same pattern as contributions.js.
export default async function handler(req, res) {
  const token = process.env.GITHUB_TOKEN;
  const USER = 'frontenddevmichael';
  const headers = { 'User-Agent': 'portfolio-site' };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const ghRes = await fetch(
      `https://api.github.com/users/${USER}/repos?sort=updated&per_page=30&type=public`,
      { headers }
    );
    const data = await ghRes.json();
    if (!ghRes.ok) {
      return res.status(ghRes.status).json(data);
    }
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate');
    return res.status(200).json(data);
  } catch {
    return res.status(500).json({ message: 'Failed to fetch repos' });
  }
}
