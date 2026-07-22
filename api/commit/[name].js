// Vercel serverless function -- latest commit for a given repo, used for
// the "Xd ago" freshness indicator on Work cards. Dynamic route: [name].js
// maps to /api/commit/:name.
export default async function handler(req, res) {
  const token = process.env.GITHUB_TOKEN;
  const USER = 'frontenddevmichael';
  const { name } = req.query;
  const headers = { 'User-Agent': 'portfolio-site' };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const ghRes = await fetch(
      `https://api.github.com/repos/${USER}/${name}/commits?per_page=1`,
      { headers }
    );
    if (!ghRes.ok) return res.status(200).json(null);
    const data = await ghRes.json();
    if (!Array.isArray(data) || data.length === 0) return res.status(200).json(null);
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate');
    return res.status(200).json(data[0]);
  } catch {
    return res.status(200).json(null);
  }
}
