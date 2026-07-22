import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Dev-only middleware that mimics /api/contributions.js locally, so you can
// preview the contribution graph with `npm run dev` without deploying.
// Reads GITHUB_TOKEN from .env -- loadEnv's third argument ('') loads ALL
// vars (not just VITE_-prefixed ones), but this whole block only runs in
// Node during the dev server, so the token never reaches the browser bundle.
function githubContributionsDevMiddleware(mode) {
  const env = loadEnv(mode, process.cwd(), '');
  const token = env.GITHUB_TOKEN;
  const USER = 'frontenddevmichael';

  return {
    name: 'github-contributions-dev-middleware',
    configureServer(server) {
      server.middlewares.use('/api/contributions', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        if (!token) { res.end('null'); return; }

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
          const json = await ghRes.json();
          const cal = json.data?.user?.contributionsCollection?.contributionCalendar || null;
          res.end(JSON.stringify(cal));
        } catch {
          res.end('null');
        }
      });
    },
  };
}

function githubReposDevMiddleware(mode) {
  const env = loadEnv(mode, process.cwd(), '');
  const token = env.GITHUB_TOKEN;
  const USER = 'frontenddevmichael';
  const headers = { 'User-Agent': 'portfolio-site-dev' };
  if (token) headers.Authorization = `Bearer ${token}`;

  return {
    name: 'github-repos-dev-middleware',
    configureServer(server) {
      server.middlewares.use('/api/repos', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        try {
          const ghRes = await fetch(
            `https://api.github.com/users/${USER}/repos?sort=updated&per_page=30&type=public`,
            { headers }
          );
          const data = await ghRes.text();
          res.statusCode = ghRes.status;
          res.end(data);
        } catch {
          res.statusCode = 500;
          res.end(JSON.stringify({ message: 'Failed to fetch repos' }));
        }
      });

      server.middlewares.use('/api/commit', async (req, res) => {
        const name = decodeURIComponent(req.url.split('?')[0].replace(/^\//, ''));
        res.setHeader('Content-Type', 'application/json');
        if (!name) { res.end('null'); return; }
        try {
          const ghRes = await fetch(
            `https://api.github.com/repos/${USER}/${name}/commits?per_page=1`,
            { headers }
          );
          if (!ghRes.ok) { res.end('null'); return; }
          const data = await ghRes.json();
          res.end(JSON.stringify(Array.isArray(data) && data.length ? data[0] : null));
        } catch {
          res.end('null');
        }
      });

      server.middlewares.use('/api/activity', async (req, res) => {
        const name = decodeURIComponent(req.url.split('?')[0].replace(/^\//, ''));
        res.setHeader('Content-Type', 'application/json');
        if (!name) { res.end('null'); return; }
        try {
          const ghRes = await fetch(
            `https://api.github.com/repos/${USER}/${name}/stats/commit_activity`,
            { headers }
          );
          if (!ghRes.ok) { res.end('null'); return; }
          const data = await ghRes.json();
          res.end(JSON.stringify(Array.isArray(data) ? data : null));
        } catch {
          res.end('null');
        }
      });

      server.middlewares.use('/api/search-commits', async (req, res) => {
        const url = new URL(req.url, 'http://localhost');
        const date = url.searchParams.get('date');
        res.setHeader('Content-Type', 'application/json');
        if (!date) { res.end('[]'); return; }
        try {
          const ghRes = await fetch(
            `https://api.github.com/search/commits?q=author:${USER}+committer-date:${date}&per_page=5&sort=committer-date`,
            { headers: { ...headers, Accept: 'application/vnd.github.cloak-preview' } }
          );
          if (!ghRes.ok) { res.end('[]'); return; }
          const data = await ghRes.json();
          res.end(JSON.stringify(data.items || []));
        } catch {
          res.end('[]');
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), githubContributionsDevMiddleware(mode), githubReposDevMiddleware(mode)],
  optimizeDeps: { include: ['flicker-dot'] },
}))
