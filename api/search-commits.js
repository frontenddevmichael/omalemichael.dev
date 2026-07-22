// Vercel serverless function -- searches commits by date for the contribution
// graph tooltip. Returns up to 5 commits matching the given date.
export default async function handler(req, res) {
  const token = process.env.GITHUB_TOKEN;
  const USER = 'frontenddevmichael';
  const { date } = req.query;
  if (!date) return res.status(200).json([]);

  const headers = { 'User-Agent': 'portfolio-site', Accept: 'application/vnd.github.cloak-preview' };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const ghRes = await fetch(
      `https://api.github.com/search/commits?q=author:${USER}+committer-date:${date}&per_page=5&sort=committer-date`,
      { headers }
    );
    if (!ghRes.ok) return res.status(200).json([]);
    const data = await ghRes.json();
    return res.status(200).json(data.items || []);
  } catch {
    return res.status(200).json([]);
  }
}
