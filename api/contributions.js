// Vercel serverless function. Deploy this file as-is (Vercel auto-detects /api).
// In your Vercel project settings, set GITHUB_TOKEN as an environment variable
// (Project Settings -> Environment Variables). Do NOT prefix it with VITE_ --
// that would ship it to the browser. Server-only env vars are never bundled
// into client code, which is what keeps this safe.
export default async function handler(req, res) {
  const token = process.env.GITHUB_TOKEN;
  const USER = 'frontenddevmichael';

  if (!token) {
    return res.status(200).json(null); // graceful: frontend just hides the graph
  }

  const query = `query($user:String!) {
    user(login:$user) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks { contributionDays { contributionCount date } }
        }
      }
    }
  }`;

  try {
    const ghRes = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { user: USER } }),
    });
    if (!ghRes.ok) return res.status(200).json(null);
    const json = await ghRes.json();
    const cal = json.data?.user?.contributionsCollection?.contributionCalendar || null;
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return res.status(200).json(cal);
  } catch {
    return res.status(200).json(null);
  }
}
