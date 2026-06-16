# Project Rio Frontend

The website for [Project Rio](https://github.com/ProjectRio) — competitive Mario Superstar Baseball. Ranked ladders, live games, player/character stats, community game modes, and tools, backed by the Rio Web API at `api.projectrio.app`.

Built with **Next.js 15** (App Router, React 19, TypeScript, Tailwind CSS v4), deployed to **Cloudflare** via the OpenNext Cloudflare adapter.

## Development

```bash
npm install
npm run dev        # dev server at http://localhost:3000
npm run check      # typecheck
npm run build      # production build
```

## Deployment (Cloudflare)

```bash
npm run preview    # build + run locally on the Workers runtime
npm run deploy     # build + deploy with wrangler
```

Configuration lives in `wrangler.toml` and `open-next.config.ts`.

## Project layout

- `app/` — routes (App Router). Stats pages are client components that fetch from the public API; content pages are static/server-rendered.
- `components/` — shared UI (nav, game cards, ladder/stat tables, design primitives in `ui.tsx`).
- `lib/` — API client (`api.ts`), display helpers, MSSB game data, and the decompiled pitch-simulation math under `lib/mssb/` (kept verbatim from the decompilation).
- `public/images/` — character, team, and base art.

The shared theme (Rio red / night palette, Rajdhani + Inter fonts) is defined in `app/globals.css` via Tailwind v4 `@theme` tokens.

Components are plain React, so they can be shared with the [ProjectRioStreamHelper](https://github.com/ProjectRio) (React 19 + Vite) app.
