# Changes made in this pass

## Security
- **Removed the exposed GitHub token from client code.** It was previously a
  `VITE_GITHUB_TOKEN` env var, which Vite ships straight into the public
  browser bundle — anyone could read it in devtools. Contributions now go
  through `/api/contributions.js`, a serverless function template that keeps
  the token server-side.
  - **Action needed:** deploy this project to Vercel (or adapt the function
    for Netlify), then set `GITHUB_TOKEN` as a **server-only** environment
    variable in your hosting dashboard — never prefixed with `VITE_`.
  - The real token that was in your uploaded `.env` has been removed from
    this project. **Rotate/revoke it on GitHub** since it was shared in our
    chat — treat it as compromised regardless.

## Correctness fixes
- Contact info (GitHub, LinkedIn, email) was inconsistent between the
  Command Palette and the Contact/Footer sections — now centralized in
  `src/data/links.js`, one place to edit going forward.
- Fixed missing `<h1>` — the hero headline was an `<h2>`, meaning the page
  had no top-level heading at all (an SEO/accessibility issue).
- Fixed the "Download Resume" button, which previously just fired a fake
  `alert()`. It now serves `/resume.pdf` if present, or falls back to a
  prefilled email request.
  - **Action needed:** drop your actual resume PDF at `public/resume.pdf`.
- Fixed the About section's inaccurate "React + TS" claim (project is plain
  JS) to "React + JS".

## SEO
- Added canonical URL, Open Graph image, Twitter card tags, theme-color,
  JSON-LD `Person` schema, `robots.txt`, `sitemap.xml`, `site.webmanifest`.
- Generated a placeholder `og-image.png` and `apple-touch-icon.png` matching
  the site's aesthetic — replace with real assets whenever you'd like,
  they're just functional placeholders for now.

## Performance
- `HeroScene` and `Galaxy` (the two three.js scenes) are now lazy-loaded via
  `React.lazy()` — they no longer block the initial bundle. Main JS bundle
  dropped from ~765KB to ~229KB; three.js now loads in its own chunk only
  when needed.
- Both scenes are skipped entirely for users with `prefers-reduced-motion`
  enabled, instead of just disabling CSS animations around them.

## New sections / structure
- **Nav**: persistent "Open to work · Lagos, NG · UTC+1" badge, visible at
  all times (collapses gracefully on small screens). Mobile hamburger menu
  opens a full-screen sheet instead of squeezing into the existing bar.
- **Work**: added a "Featured Project" deep-dive case study (problem →
  decisions → result) above the grid — edit `FEATURED_PROJECT` in
  `Work.jsx` with your real flagship project. Grid below is now a bento
  layout with tag filter chips.
- **Process** (new, replaces "Writing"): your real 5-step workflow — Brief →
  Deliberate → Fine-tune with AI → Development → Testing.
- **Testimonials** (new): placeholder quotes clearly marked as such — swap
  `TESTIMONIALS` in `Testimonials.jsx` with real quotes when ready.
- **Loading screen**: branded boot-sequence-style preloader tied to real
  font-readiness, skipped entirely for reduced-motion users.

## Responsive / accessibility
- Mobile nav is a dedicated full-screen sheet, not a shrunken version of
  desktop nav.
- Command palette becomes a full-screen bottom sheet below 640px instead of
  a small floating modal.
- Contribution graph scrolls horizontally with proper touch scrolling on
  narrow screens, and shows a skeleton loading state instead of a bare
  "Loading…" string.
- Body scroll now locks while the mobile menu is open.

## Still worth doing (not done here)
- Add real resume PDF, real og-image/icon if you want something more
  custom, real testimonial quotes, deploy the `/api/contributions.js`
  function and set `GITHUB_TOKEN`.
- Consider trimming `Skills.jsx`'s tool list — it currently mixes actual
  skills (React, Figma) with services (Supabase, Cloudflare, Vercel) and one
  AI assistant (Claude) under one "Skills" umbrella; worth a pass to decide
  what belongs there.
