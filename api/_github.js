const USER = 'frontenddevmichael';

export async function ghFetch(path, token) {
  const headers = { 'User-Agent': 'portfolio-site', Accept: 'application/vnd.github.v3+json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) return null;
  return res.json();
}

export async function ghGraphQL(query, variables, token) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) return null;
  return res.json();
}

export function send(res, data, status = 200) {
  res.setHeader('Content-Type', 'application/json');
  res.status(status).end(JSON.stringify(data));
}
