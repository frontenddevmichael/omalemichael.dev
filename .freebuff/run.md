# Run doc

## How to reproduce artifacts
- No environment files needed — `VITE_GITHUB_TOKEN` is optional and can be set in `.env` at project root (see `.env.example`).
- Dependencies are listed in `package.json`; run `npm install` after a fresh clone.

## How to run the dev server
```bash
npx vite --port PORT --host 127.0.0.1
```
- Default port: 5173. Use any free port if 5173 is taken.
- The server prints "ready" on stdout once it is listening.
- Access at `http://127.0.0.1:PORT/`.
