# Phase 4 Task — Integrate the Component, Add CSS Foundations, and Remove the Starter

## Decision

Replace the Vite starter only after the validated data model and semantic renderer exist. Land one complete vertical slice containing bootstrap, fallback behavior, local font loading, semantic design tokens, foundational styling, and starter cleanup.

The page does not need final Figma geometry yet, but it must render the real Results Summary content as a coherent, accessible page and remain buildable.

## Objective

At completion:

- `main.ts` imports, validates, and renders the local JSON data.
- The page contains exactly one `<main>`.
- Invalid data renders only `Results are unavailable.`.
- Three focused CSS files replace the starter stylesheet.
- Hanken Grotesk loads locally with visible-text fallback behavior.
- Core design values exist as semantic CSS custom properties.
- The component has a stable basic visual shell for later mobile and wide refinement.
- All Vite starter modules and assets are removed after their imports are gone.
- `pnpm test` and `pnpm build` pass.

## Prerequisites

Phases 1 through 3 are complete:

- Runtime assets exist inside `frontend/`.
- JSON import support is enabled.
- Default JSON and validator exist.
- Semantic renderer and icon map exist.
- Validator tests and the application build pass.

## Read before editing

- `PLAN.md` Phase 4
- `DESIGN.md` typography, colors, spacing, interaction, and accessibility sections
- `SPEC.md` sections 1, 2, 5.2, and 6
- `frontend/src/main.ts`
- `frontend/src/style.css`
- `frontend/src/results-summary/render-results-summary.ts`
- `frontend/src/results-summary/validate-results-summary.ts`

## Files to create

```text
frontend/src/styles/tokens.css
frontend/src/styles/base.css
frontend/src/styles/results-summary.css
```

## File to replace

```text
frontend/src/main.ts
```

## Files to remove only after replacement bootstrap builds

```text
frontend/src/counter.ts
frontend/src/style.css
frontend/src/assets/hero.png
frontend/src/assets/typescript.svg
frontend/src/assets/vite.svg
frontend/public/icons.svg
frontend/public/favicon.svg
```

## Out of scope

Do not:

- Attempt final mobile screenshot matching
- Add the `700px` wide media query yet beyond harmless placeholders
- Complete hover, pressed, focus-visible, or forced-colors polish
- Add navigation or Continue success behavior
- Add a framework or CSS system
- Create a broad reset
- Add dark mode
- Use fixed text-container heights
- Remove starter files before `main.ts` stops importing them

## CSS architecture

### Import order

`main.ts` must import styles in this order:

```text
tokens.css
base.css
results-summary.css
```

This order is part of the architecture:

- Tokens define values.
- Base styles define document defaults and utilities.
- Component styles consume both.

Do not import the obsolete `style.css`.

## Task A — Create semantic design tokens

Create `frontend/src/styles/tokens.css`.

### Required color tokens

Define semantic custom properties for at least:

```text
--color-surface: #FFFFFF
--color-page: #F3F4FD
--color-text-primary: #303B59
--color-text-on-result: #FFFFFF
--color-text-result-supporting: #CAC9FF
--color-text-score-secondary: #5F677B

--color-reaction-background: #FFF6F6
--color-reaction-label: #C93838
--color-memory-background: #FFFBF4
--color-memory-label: #8A5A00
--color-verbal-background: #F2FCF9
--color-verbal-label: #007A5E
--color-visual-background: #F3F4FD
--color-visual-label: #1125D6
```

The accessible label values intentionally differ from the brighter icon strokes embedded in the SVGs.

### Required gradient and effect tokens

```text
--gradient-result: linear-gradient(180deg, #7755FF 0%, #2F2CE9 100%)
--gradient-score: linear-gradient(180deg, #4D21C9 0%, rgb(37 33 201 / 0%) 100%)
--shadow-card: 0 30px 60px rgb(61 108 236 / 15%)
```

### Required spacing tokens

Represent the approved 8px scale clearly:

```text
0px
8px
16px
24px
32px
40px
48px
56px
64px
72px
80px
```

Use names that are easy to maintain, such as `--space-0` through `--space-10`, or another documented semantic scale. Do not reuse ambiguous starter token names.

### Required shape and layout tokens

Include:

```text
--radius-row: 12px
--radius-card: 32px
--radius-pill: 999px or the Figma-equivalent pill value
--size-score-mobile: 140px
--size-score-wide: 200px
--size-control-min: 56px
--size-icon-box: 32px
--content-result-max: 260px
--card-max: 736px
```

### Required typography tokens

Define the mobile and wide sizes needed later:

```text
16px
18px
24px
32px
56px
72px
```

Also define:

```text
--line-height-display: 1
--line-height-body: 1.3
--font-weight-medium: 500
--font-weight-bold: 700
--font-weight-extra-bold: 800
```

Do not create a CSS custom property for the `700px` breakpoint because ordinary custom properties cannot be consumed directly in the media-query condition.

## Task B — Create base styles

Create `frontend/src/styles/base.css`.

### Local font

Define one variable `@font-face`:

- Family: `Hanken Grotesk`
- Source: copied variable TTF through a relative Vite-managed URL
- Weight range: `500 800`
- Style: normal
- `font-display: swap`

Use a declaration equivalent to:

```text
font-weight: 500 800
```

Set a system fallback stack after Hanken Grotesk.

Use `font-synthesis: none` so the browser does not fabricate missing weights or styles.

### Minimal reset

Include only what this page needs:

- `box-sizing: border-box` for all elements and pseudo-elements
- `body { margin: 0; }`
- Inherited font on buttons
- Targeted margin reset for headings, paragraphs, `dl`, `dt`, and `dd` used by the component
- Image display behavior that preserves explicit intrinsic dimensions
- `min-inline-size: 0` support where needed later

Do not:

- Reset every HTML element indiscriminately
- Remove outlines globally
- Set `color-scheme: light dark`
- Add automatic dark-mode rules
- Modify native button semantics

### Document defaults

Set:

- `html` and `body` minimum inline size behavior
- Body font family and primary text color
- White default background for the current mobile-first page
- `#app` minimum block size

Prefer `min-block-size: 100svh` where appropriate, while allowing content growth and scrolling.

### Visually hidden utility

Create `.visually-hidden` using a proven clipping pattern that:

- Keeps text in the accessibility tree
- Uses a `1px` box
- Prevents visual layout influence
- Does not use `display: none`, `visibility: hidden`, or `aria-hidden`

The current hidden content is not focusable, but use a generally safe utility rather than a brittle one-off.

## Task C — Create foundational component CSS

Create `frontend/src/styles/results-summary.css`.

This phase needs a coherent shell, not final fidelity.

### Required foundational rules

Define stable rules for:

- Page shell class on `<main>`
- `.results-summary`
- `.result-overview`
- `.score-display`
- `.result-feedback`
- `.summary-panel`
- `.score-list`
- `.score-item`
- `.score-item__topic`
- `.score-item__icon-box`
- `.score-item__icon`
- `.score-item__value`
- `.continue-button`

### Category tokens through data attributes

Use `data-category` selectors to assign row-level variables, for example:

```text
[data-category="reaction"]
[data-category="memory"]
[data-category="verbal"]
[data-category="visual"]
```

Each assigns:

- Row background
- Accessible visible label color

Do not recolor the SVG through filters.

### Foundational resilience

Include:

- `min-inline-size: 0` on shrinkable grid/flex children
- `min-block-size: 56px` for rows and button, not fixed height
- No fixed text-container heights
- No absolute positioning for primary content
- Score phrase white-space behavior that can later remain on one line
- Reserved `32px` icon box
- Full-width button inside its content region

### Initial button

Provide the default state only:

- Navy background
- White text
- Border reset appropriate for a custom button
- Native pointer behavior
- Minimum 56px height
- Pill shape

Do not remove focus outlines. Final custom focus treatment belongs in Phase 7.

## Task D — Replace bootstrap logic

Replace `frontend/src/main.ts`.

### Required imports

Import:

- The three CSS files in the specified order
- `results.json`
- `validateResultsSummary`
- `renderResultsSummary`

### Explicit unknown boundary

Assign the imported JSON to a value typed as `unknown` before validation. Do not cast it directly to `ResultsSummaryData`.

### Mount-root handling

Find `#app` defensively.

Acceptable behavior when missing:

- Throw one clear bootstrap error because the application cannot mount, or
- Handle with another explicit fail-fast path

Do not use an unexplained non-null assertion.

### Main landmark

Create exactly one `<main>` and assign the page-shell class.

Do not put `<main>` inside the renderer and do not add another landmark.

### Ready state

When validation succeeds:

- Render one component instance.
- Do not supply an `onContinue` callback in the default app.
- Append the returned component to `<main>`.

### Invalid-data fallback

When validation fails:

- Render visible text exactly:

```text
Results are unavailable.
```

- Do not render result headings, scores, rows, or Continue.
- Do not render partial valid values.
- Do not use `aria-live` for this initial synchronous result.
- Log descriptive validation issues only in development when practical.

### Mounting

Append the completed `<main>` to `#app`.

Avoid `innerHTML` for the dynamic content path. Clearing the known starter mount with `replaceChildren()` is appropriate.

## Task E — Remove obsolete starter files safely

Only after the replacement `main.ts` compiles and no longer imports starter assets, remove:

```text
frontend/src/counter.ts
frontend/src/style.css
frontend/src/assets/hero.png
frontend/src/assets/typescript.svg
frontend/src/assets/vite.svg
frontend/public/icons.svg
frontend/public/favicon.svg
```

Before deleting each file, search for references:

```bash
rg -n "counter|hero\.png|typescript\.svg|vite\.svg|icons\.svg|favicon\.svg|style\.css" frontend
```

After deletion, run the search again. Expected result: no obsolete source reference.

## Execution and verification

### 1. Run tests

From `frontend/`:

```bash
pnpm test
```

### 2. Build

```bash
pnpm build
```

### 3. Run the application

```bash
pnpm dev
```

Confirm:

- Real Results Summary content appears.
- Title and favicon remain correct.
- Local font request succeeds.
- Four icon requests succeed.
- No starter UI appears.
- No console error occurs.

### 4. Inspect semantics

In browser developer tools or the accessibility tree, confirm:

- Exactly one `<main>`
- Exactly one `<h1>` and one `<h2>` in ready state
- One `<dl>` with four grouped `<dt>`/`<dd>` pairs
- One native button named `Continue`
- Overall score complete phrase is present once
- Decorative icons have no accessible name

### 5. Test fallback manually

Temporarily make a local uncommitted invalid fixture, such as changing `maximumScore` to 99.

Confirm:

- Only `Results are unavailable.` renders inside `<main>`.
- Continue is absent.
- No stale score content remains.

Restore the valid JSON immediately and rerun tests/build.

Do not commit the invalid fixture.

### 6. Test font fallback

Block the font request temporarily in browser developer tools.

Confirm:

- System sans-serif text remains visible.
- Foundational layout does not clip.

Detailed fallback geometry is tested again in Phase 9.

### 7. Inspect repository state

```bash
git status --short
rg -n "figma\.com/api/mcp|docs/design" frontend/src frontend/index.html
```

Expected:

- No temporary Figma URL.
- No runtime source path reaches into `docs/design/`.
- Removed starter files are gone.
- Only intended new implementation files remain.

## Stop conditions

Stop before completing the phase when:

- The component requires weakening TypeScript settings.
- The font can only load through `docs/design/`.
- The renderer produces duplicate accessible score text.
- Invalid data still renders any score UI.
- Starter files remain referenced after integration.
- Final fidelity work is being forced through absolute positioning or fixed text heights.

## Verification checklist

- [ ] Tokens use semantic names and approved values.
- [ ] No breakpoint token is incorrectly defined for media-query use.
- [ ] Variable font is loaded locally with `font-display: swap`.
- [ ] System fallback exists.
- [ ] `font-synthesis: none` is applied.
- [ ] Base reset is minimal.
- [ ] Native focus is not removed.
- [ ] Visually hidden utility preserves accessibility-tree content.
- [ ] Component CSS uses category data attributes.
- [ ] Rows and button use minimum, not fixed, heights.
- [ ] `main.ts` validates an explicit `unknown` value.
- [ ] Exactly one `<main>` is created.
- [ ] Ready state renders the semantic component.
- [ ] Invalid data renders only the fallback.
- [ ] Continue receives no invented default behavior.
- [ ] Starter imports are removed.
- [ ] Starter files are removed after imports are gone.
- [ ] No runtime path points into `docs/design/`.
- [ ] No temporary Figma URL exists.
- [ ] Local font and icon requests succeed.
- [ ] `pnpm test` passes.
- [ ] `pnpm build` passes.

## Acceptance criteria advanced

- AC-04 through AC-06 — application-owned runtime assets and no temporary URLs
- AC-07 through AC-14 — ready and fallback content behavior
- AC-32 and AC-33 — local font and fallback foundations
- AC-40 — native button and minimum-size foundation
- AC-45 through AC-53 — keyboard-native structure and semantic output
- AC-60 — fallback font remains usable

Detailed visual, focus, contrast, and responsive completion remains in Phases 5 through 9.

## Deliverable

A real, locally styled, semantically correct Results Summary page replacing the Vite starter, with complete validation/fallback integration and no obsolete starter artifacts.

## Suggested commit

```text
feat: integrate results summary component
```

## Handoff to Phase 5

Phase 5 should work only in the existing CSS architecture. It must refine the mobile composition without changing data validation, DOM order, or semantic markup unless a verified accessibility defect requires a documented correction.