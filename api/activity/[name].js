export default async function handler(req, res) {
  const token = process.env.GITHUB_TOKEN;
  const USER = 'frontenddevmichael';
  const { name } = req.query;
  const headers = { 'User-Agent': 'portfolio-site' };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const ghRes = await fetch(
      `https://api.github.com/repos/${USER}/${name}/stats/commit_activity`,
      { headers }
    );
    if (!ghRes.ok) return res.status(200).json(null);
    const data = await ghRes.json();
    return res.status(200).json(Array.isArray(data) ? data : null);
  } catch {
    return res.status(200).json(null);
  }
}
