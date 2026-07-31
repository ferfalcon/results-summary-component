# Phase 1 Task — Add Metadata, Configuration, and Runtime Source Assets

## Decision

Prepare the application-owned assets and required configuration without replacing the Vite starter yet.

This phase must leave the current starter buildable. Starter imports and files remain in place until Phase 4 integrates the component.

## Objective

At completion:

- The document title and favicon metadata are correct.
- The package declares Node `>=22.18.0` and exposes `pnpm test` through Node’s built-in test runner.
- TypeScript can import JSON modules.
- Exact runtime copies of the variable font and four category icons exist inside `frontend/`.
- Copied runtime assets match the design-source bytes.
- No new dependency is added.
- The existing starter still builds.

## Prerequisites

Phase 0 is complete:

- Node is `22.18.0` or newer.
- `pnpm build` succeeds on the untouched starter.
- The working tree is clean.
- Work is happening on the focused feature branch.

## Read before editing

- `PLAN.md`, especially sections 2.10, 2.11, and Phase 1
- `SPEC.md` sections 1.1 and 1.2
- `frontend/index.html`
- `frontend/package.json`
- `frontend/tsconfig.json`
- `docs/design/fonts/HankenGrotesk-VariableFont_wght.ttf`
- `docs/design/images/favicon-32x32.png`
- All four `docs/design/images/icon-*.svg` files

## Scope

### Files to update

```text
frontend/index.html
frontend/package.json
frontend/tsconfig.json
```

### Files to create by copying exact source bytes

```text
frontend/public/favicon-32x32.png
frontend/src/assets/fonts/HankenGrotesk-VariableFont_wght.ttf
frontend/src/assets/icons/icon-memory.svg
frontend/src/assets/icons/icon-reaction.svg
frontend/src/assets/icons/icon-verbal.svg
frontend/src/assets/icons/icon-visual.svg
```

## Out of scope

Do not:

- Replace `frontend/src/main.ts`
- Remove Vite starter files
- Create the JSON content model
- Create the validator or tests
- Add Vitest, Jest, jsdom, or any dependency
- Modify the design-source files under `docs/design/`
- Add deployment-specific `vite.config.ts`
- Configure GitHub Pages or Vercel
- Convert, subset, optimize, recolor, or redraw assets

## Step-by-step task

### 1. Create runtime asset directories

From the repository root:

```bash
mkdir -p frontend/public
mkdir -p frontend/src/assets/fonts
mkdir -p frontend/src/assets/icons
```

Do not create a parallel root-level asset system.

### 2. Copy the favicon

Copy the supplied PNG unchanged:

```bash
cp docs/design/images/favicon-32x32.png \
  frontend/public/favicon-32x32.png
```

The favicon belongs in `public/` because it is referenced directly by `index.html`.

### 3. Copy the variable font

```bash
cp docs/design/fonts/HankenGrotesk-VariableFont_wght.ttf \
  frontend/src/assets/fonts/HankenGrotesk-VariableFont_wght.ttf
```

Use only the variable font in the first release. Do not also copy the three static font files.

### 4. Copy all category icons

```bash
cp docs/design/images/icon-memory.svg \
  frontend/src/assets/icons/icon-memory.svg
cp docs/design/images/icon-reaction.svg \
  frontend/src/assets/icons/icon-reaction.svg
cp docs/design/images/icon-verbal.svg \
  frontend/src/assets/icons/icon-verbal.svg
cp docs/design/images/icon-visual.svg \
  frontend/src/assets/icons/icon-visual.svg
```

The source SVG strokes already contain the approved bright category accent colors. Do not alter them.

### 5. Verify exact bytes

Use `cmp` or checksums. Example:

```bash
cmp -s docs/design/images/favicon-32x32.png \
  frontend/public/favicon-32x32.png
cmp -s docs/design/fonts/HankenGrotesk-VariableFont_wght.ttf \
  frontend/src/assets/fonts/HankenGrotesk-VariableFont_wght.ttf
cmp -s docs/design/images/icon-memory.svg \
  frontend/src/assets/icons/icon-memory.svg
cmp -s docs/design/images/icon-reaction.svg \
  frontend/src/assets/icons/icon-reaction.svg
cmp -s docs/design/images/icon-verbal.svg \
  frontend/src/assets/icons/icon-verbal.svg
cmp -s docs/design/images/icon-visual.svg \
  frontend/src/assets/icons/icon-visual.svg
```

Each command must exit successfully.

When using hashes instead, compare both sides explicitly and retain the output in working notes.

### 6. Update document metadata

In `frontend/index.html`:

- Keep `<!doctype html>`.
- Keep `<html lang="en">`.
- Keep the viewport meta element.
- Change the title to:

```html
<title>Results summary</title>
```

- Replace the Vite SVG favicon link with:

```html
<link
  rel="icon"
  type="image/png"
  sizes="32x32"
  href="%BASE_URL%favicon-32x32.png"
/>
```

Keep the existing `#app` mount element and module script unchanged in this phase.

Do not use `/favicon-32x32.png`; `%BASE_URL%` is required so a nested deployment base remains possible.

### 7. Enable JSON-module resolution

In `frontend/tsconfig.json`, add:

```json
"resolveJsonModule": true
```

Place it with the module-resolution options.

Preserve the current strict settings, including:

- `moduleResolution: "bundler"`
- `allowImportingTsExtensions: true`
- `verbatimModuleSyntax: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `erasableSyntaxOnly: true`
- `noEmit: true`

Do not relax compiler checks to make later work easier.

### 8. Update package metadata and scripts

In `frontend/package.json`:

- Preserve existing Vite and TypeScript versions.
- Add:

```json
"engines": {
  "node": ">=22.18.0"
}
```

- Add the script:

```json
"test": "node --test"
```

Do not add a test package. The scripts should now include:

```text
dev
build
preview
test
```

### 9. Protect the lockfile

No dependency is added, so `frontend/pnpm-lock.yaml` should normally remain unchanged.

Run:

```bash
git diff -- frontend/pnpm-lock.yaml
```

When it changed, determine why before committing. Do not accept a broad lockfile rewrite caused only by a different pnpm version without reviewing the impact.

### 10. Build the still-running starter

From `frontend/`:

```bash
pnpm build
```

The starter still imports its existing assets and must continue to build.

### 11. Check the favicon in development

Run:

```bash
pnpm dev
```

Confirm in browser developer tools:

- The document title is `Results summary`.
- `favicon-32x32.png` returns successfully.
- The console has no new error.

Stop the server after checking.

### 12. Inspect the diff

From the repository root:

```bash
git status --short
git diff -- frontend/index.html frontend/package.json frontend/tsconfig.json
```

Confirm:

- Only intended files changed.
- All copied assets are new files.
- No design-source asset changed.
- No starter source was deleted.

## Guardrails

- Runtime files must be copies, not symlinks into `docs/design/`.
- Production must not use temporary Figma MCP URLs.
- Do not use CSS filters to recolor icons later.
- Do not add static font duplicates.
- Do not hardcode root-absolute public paths.
- Do not change package versions.
- Do not alter the lockfile without a legitimate package-manager reason.

## Verification checklist

- [ ] `frontend/index.html` title is `Results summary`.
- [ ] Favicon uses `%BASE_URL%favicon-32x32.png`.
- [ ] `frontend/package.json` declares Node `>=22.18.0`.
- [ ] `frontend/package.json` has `test: node --test`.
- [ ] No test dependency was added.
- [ ] `resolveJsonModule` is enabled.
- [ ] Variable font exists in the runtime asset directory.
- [ ] All four runtime SVG files exist.
- [ ] Favicon exists in `frontend/public/`.
- [ ] Every copied file matches its source bytes.
- [ ] `docs/design/` is unchanged.
- [ ] Starter files still exist.
- [ ] `pnpm build` passes.
- [ ] Favicon request succeeds in development.
- [ ] No unexpected lockfile rewrite exists.

## Acceptance criteria advanced

- AC-01 — build remains successful
- AC-02 — JSON-module resolution is configured
- AC-04 — runtime font and icon assets live inside `frontend/`
- AC-05 — no temporary Figma URL is used
- AC-06 — `docs/design/` remains reference-only

These criteria are advanced but not all are fully complete until runtime imports are implemented and verified in later phases.

## Deliverable

A buildable starter with correct metadata, Node/test configuration, JSON import support, and verified application-owned runtime source assets.

## Suggested commit

```text
chore: add results summary runtime assets
```

## Handoff to Phase 2

Phase 2 may assume:

- Node’s test runner is available.
- `pnpm test` is defined.
- JSON imports are supported by TypeScript.
- Runtime icons and font have stable paths inside `frontend/`.
- Starter rendering remains untouched.