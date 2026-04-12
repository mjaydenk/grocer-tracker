# Grocery Price Comparer

A local-first web app for comparing grocery prices across multiple stores. You add items, define markets (stores), and record prices per market—then browse and compare everything in one table. **All data stays in your browser** using IndexedDB (`grocer-tracker` database); there is no cloud sync or server-side grocery database.

Built with [TanStack Start](https://tanstack.com/start), [React](https://react.dev/), [Vite](https://vite.dev/), [TanStack Router](https://tanstack.com/router) (file-based routes), [TanStack Query](https://tanstack.com/query), [Tailwind CSS](https://tailwindcss.com/), and UI primitives in the [shadcn](https://ui.shadcn.com/) style.

## Getting started

Install dependencies (this repo includes a `bun.lock`; you can also use `npm` or `pnpm` if you prefer):

```bash
bun install
```

Start the development server:

```bash
bun run dev
```

The app is served at **http://localhost:3000** (`vite dev --port 3000`).

### Production build

```bash
bun run build
bun run preview
```

`preview` serves the production build locally (default Vite preview port unless you pass `--port`).

## Scripts

| Script    | Description                                      |
| --------- | ------------------------------------------------ |
| `dev`     | Vite dev server on port **3000**                 |
| `build`   | Production build                                 |
| `preview` | Preview production build                         |
| `lint`    | ESLint                                           |
| `format`  | Prettier check                                   |
| `check`   | Prettier write + ESLint fix                      |

## App settings (first run & preferences)

There is **no `.env` file** required for local development. Runtime behavior that feels like “settings”:

- **Theme** — Light, dark, or system (“auto”) is stored under the `theme` key in **localStorage** and applied on load (see the root layout script in `src/routes/__root.tsx`).
- **Settings UI** — Markets, tags, and related options open from the header **gear** button, or by visiting the home route with search `?options=true` (e.g. `http://localhost:3000/?options=true`).
- **Data** — Grocery items, markets, and tags live in **IndexedDB** only; clearing site data removes them.

## Project layout (high level)

- `src/routes/` — File-based routes; `__root.tsx` is the app shell (header, footer, theme, devtools).
- `src/components/` — Feature UI (e.g. grocery table, settings dialog).
- `src/lib/idb/` — IndexedDB access and schema for groceries.

## Learn more

- [TanStack Start](https://tanstack.com/start)
- [TanStack Router](https://tanstack.com/router)
