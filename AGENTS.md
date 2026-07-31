# Repository Guidelines

## Project Structure & Module Organization

- `frontend/` is the active Vite + TypeScript application. Keep application code in `frontend/src/`, static files served unchanged in `frontend/public/`, and the package configuration/lockfile in `frontend/`.
- `docs/code/` contains the reference implementation: `index.html`, `styles/style.css`, `scripts/`, and `data.json`. Treat it as the source for the challenge markup, styles, and data behavior when implementing the frontend.
- `docs/design/` holds reference images, icons, and the Hanken Grotesk fonts. Consult `style-guide.md`, `mobile-design.jpg`, and `desktop-design.jpg` before visual changes.
- Root-level `SPEC.md`, `DESIGN.md`, `PLAN.md`, and `Phase-*.md` record the agreed requirements and implementation plan. Update them only when their guidance changes.

## Build, Test, and Development Commands

Run commands from `frontend/`:

```bash
pnpm install       # install locked development dependencies
pnpm dev           # start the Vite development server
pnpm build         # type-check with tsc and create a production build
pnpm preview       # serve the production build locally
```

There is no automated test or lint script yet. `pnpm build` is the required pre-review verification; also check the page at both mobile and desktop widths against the design references.

## Coding Style & Naming Conventions

Follow the conventions of the file you edit: the TypeScript frontend uses two-space indentation, single quotes, semicolon-free statements, and `camelCase` identifiers. CSS should use two-space indentation, custom properties for reusable values, and semantic class names. In the reference stylesheet, component classes follow BEM-style names such as `.results-summary__score`; preserve that pattern for related elements. Use explicit `alt` text for meaningful images and keep interactive controls keyboard-accessible.

## Testing Guidelines

When adding behavior, validate the build and manually test loading, keyboard focus, and responsive layout. If a test framework is introduced, place tests beside the module or under `frontend/src/`, name them `*.test.ts`, and add a documented `pnpm test` script before relying on them in review.

## Commit & Pull Request Guidelines

Use the established conventional, imperative commit format: `feat: add score renderer`, `fix: correct mobile spacing`, or `docs: clarify phase guidance`. Keep each commit scoped to one concern. Pull requests should explain the user-visible change, link the relevant issue or phase when applicable, confirm `pnpm build` passed, and include desktop and mobile screenshots for UI changes.
