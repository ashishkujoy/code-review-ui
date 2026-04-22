# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server at http://localhost:5173
npm run build     # type-check + vite production build
npm run lint      # eslint
npx tsc --noEmit  # type-check only (no emit)
```

No test runner is configured.

## Architecture

Vite + React 19 + TypeScript SPA. No router library — navigation is managed by a `route` state string in `App.tsx` with conditional rendering.

**`src/data.ts`** — all mock data and types. Single source of truth for `ASSIGNMENTS`, `INTERNS`, `FINDINGS_SAMPLE`, and `DEFAULT_PROMPT`. The intern list is deterministically generated via a seeded PRNG (`mulberry32`) so it is stable across renders.

**`src/components/`**
- `Icons.tsx` — inline SVG icon set. All icons are pre-rendered JSX constants in the `Icons` object; import and use by name.
- `Shell.tsx` — `Sidebar` and `Topbar` layout components shared across all screens. `Sidebar` receives `route` + `setRoute` and renders nav + cohort list + user footer. `Topbar` takes `crumbs: string[]` and an optional `actions` slot.

**`src/screens/`** — one file per screen, each exports a single component:
- `Dashboard.tsx` — KPI strip + assignment card grid
- `Configure.tsx` — assignment dropdown, glob pattern editor, prompt textarea, run simulation with animated progress
- `Reports.tsx` — split pane (intern list left, detail right) with filter/sort/search, histogram, score breakdown, findings list
- `Detail.tsx` — full single-intern report with tabbed views (Findings / Summary / Files / Prompt & Run)

**Styling** — all CSS lives in `src/index.css` as a single flat stylesheet using CSS custom properties. Design tokens are defined on `:root` (light) and `[data-theme="dark"]`. Density variants are driven by `[data-density="compact"]` on `<html>`. No CSS modules, no Tailwind. Class names follow a BEM-like convention matching the original prototype (`chip`, `chip--good`, `intern-row`, `split__left`, etc.).

**Theme/density** — `App.tsx` holds `tweaks` state and writes `data-theme` / `data-density` attributes to `document.documentElement`. A floating tweaks panel (bottom-right) lets you toggle them at runtime. The current route is persisted to `localStorage` under the key `cr.route`.
