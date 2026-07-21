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

const CONTRIB_QUERY = `query($user:String!) {
  user(login:$user) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
          }
        }
      }
    }
  }
}`;

export async function fetchContributions(token) {
  if (!token) return null;
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: CONTRIB_QUERY, variables: { user: USER } }),
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data?.user?.contributionsCollection?.contributionCalendar || null;
}
