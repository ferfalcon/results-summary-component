# Implementation Plan — Results Summary Component

## Document status

This plan translates the approved Figma design, `DESIGN.md`, and `SPEC.md` into an incremental implementation sequence for the current repository.

The plan is intentionally implementation-oriented but does not include production code. It defines:

- The target architecture
- The files to create, replace, and remove
- The order of work
- Verification gates for each phase
- Acceptance-criteria coverage
- Known tradeoffs and implementation risks

### Source precedence

When implementation decisions conflict, use this order:

1. `SPEC.md` for functional, technical, accessibility, and testable requirements
2. `DESIGN.md` for visual intent and documented production deviations from Figma
3. Figma for original geometry, hierarchy, spacing, typography, gradients, and component appearance
4. `REVIEW.md` for the rationale behind resolved contradictions and remaining verification risks
5. Existing starter code only for repository conventions that do not conflict with the documents above

---

## 1. Current repository baseline

### 1.1 Application structure

The runnable application is under `frontend/` and currently contains a Vite starter rather than the Results Summary implementation.

Relevant current files:

```text
frontend/
├── .gitignore
├── index.html
├── package.json
├── pnpm-lock.yaml
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── typescript.svg
│   │   └── vite.svg
│   ├── counter.ts
│   ├── main.ts
│   └── style.css
└── tsconfig.json
```

Design-source assets are stored separately:

```text
docs/design/
├── active-states.jpg
├── desktop-design.jpg
├── desktop-preview.jpg
├── mobile-design.jpg
├── style-guide.md
├── fonts/
│   ├── HankenGrotesk-VariableFont_wght.ttf
│   └── static/
│       ├── HankenGrotesk-Bold.ttf
│       ├── HankenGrotesk-ExtraBold.ttf
│       └── HankenGrotesk-Medium.ttf
└── images/
    ├── favicon-32x32.png
    ├── icon-memory.svg
    ├── icon-reaction.svg
    ├── icon-verbal.svg
    └── icon-visual.svg
```

### 1.2 Current technical constraints

- Vite `8.x`
- TypeScript `6.x`
- pnpm lockfile v9
- No UI framework
- No CSS framework
- No runtime dependencies
- No automated test framework
- `frontend/tsconfig.json` enables:
  - Bundler module resolution
  - `verbatimModuleSyntax`
  - `noUnusedLocals`
  - `noUnusedParameters`
  - `erasableSyntaxOnly`
  - `noEmit`
- JSON-module resolution is not currently enabled
- There is no custom Vite configuration

### 1.3 Starter code to replace

The existing implementation is disposable starter content:

- `main.ts` renders Vite documentation and social links.
- `counter.ts` implements a demo counter.
- `style.css` defines unrelated starter tokens, dark mode, decorative layout, and nested starter selectors.
- The current favicon and SVG sprite belong to the Vite starter.
- The document title is currently `frontend`.

No starter layout or component abstraction should be preserved merely to reduce the diff. The replacement should remain incremental, but the final code should not carry dead starter concepts.

### 1.4 Project-local implementation guidance

The repository includes `.agents/skills/modern-web-guidance/`.

At the start of implementation:

1. Run the local Modern Web Guidance search for the relevant topics when network access is available.
2. At minimum, review the bundled accessibility and CSS-layout guidance before writing HTML, CSS, or client-side TypeScript.
3. Prefer logical properties, intrinsic sizing, Grid/Flexbox, native semantics, and safe overflow behavior.
4. Do not adopt a new dependency or experimental API merely because a guide mentions it.

For this component, ordinary semantic HTML, CSS Grid, Flexbox, media queries, and DOM APIs are sufficient. Container queries, subgrid, animation libraries, and polyfills are not required.

---

## 2. Implementation strategy

### 2.1 Technology approach

Implement the component with:

- Semantic HTML created through TypeScript DOM APIs
- Plain TypeScript modules
- Mobile-first CSS
- CSS custom properties
- Local JSON imported at build time
- A small handwritten runtime validator
- Exact local font and SVG assets

Do not add:

- React, Vue, Angular, or another UI framework
- Tailwind or another CSS framework
- A runtime validation library
- A component library
- A state-management library
- A router

### 2.2 Rendering approach

Use DOM construction and `textContent`, not interpolation of untrusted strings into `innerHTML`.

Reasons:

- The component is small enough that direct DOM construction remains readable.
- JSON content is treated as unknown until runtime validation succeeds.
- `textContent` avoids introducing an HTML-escaping helper or an injection risk.
- Native element creation makes button, heading, description-list, and image semantics explicit.

Avoid building a generic DOM factory abstraction. Small local helpers are acceptable only when they remove clear repetition without obscuring the markup.

### 2.3 Component boundary

Use one logical rendering entry point:

```text
renderResultsSummary(data, options?) -> HTMLElement
```

The optional configuration exposes one future integration boundary:

```text
onContinue?: () => void
```

The default application does not pass a callback. The native button therefore remains functional and focusable but has no navigation or destructive side effect.

### 2.4 Data boundary

Treat the imported JSON value as `unknown` at the validation boundary.

Use a discriminated validation result:

```text
{ ok: true, data: ResultsSummaryData }
{ ok: false, issues: string[] }
```

The application renders only one of two complete states:

- Validated ready state
- Simple unavailable fallback

Do not render partially valid score data.

### 2.5 CSS layout direction

Use a mobile-first stylesheet and one required viewport media query:

```text
below 700px   -> mobile composition
700px and up  -> two-column card
```

Use a viewport media query rather than a container query because:

- The current product is one page containing one component.
- `SPEC.md` defines the switch against viewport widths.
- A media query is simpler and easier to verify at `699px`, `700px`, and `701px`.

Tradeoff: the component will not independently switch layout when embedded in an unusually narrow container on a wide viewport. Embeddable container-query behavior is outside the first-release scope and can be introduced later if the component becomes reusable outside this page.

### 2.6 Wide-column decision

Use equal wide tracks:

```css
grid-template-columns: repeat(2, minmax(0, 1fr));
```

This produces:

- Approximately `344px / 344px` columns at the `768px` reference viewport
- `368px / 368px` columns at the desktop maximum

Figma uses `338px / 348px` at tablet. Equal tracks differ by at most `6px` per side and remain inside the `8px` tablet tolerance defined in `SPEC.md`.

Benefits:

- Simpler responsive logic
- Exact desktop symmetry
- Less brittle interpolation
- Easier equal-height behavior

Downside: the tablet result panel will be slightly wider and the summary panel slightly narrower than Figma. This is an intentional documented tradeoff and must be checked visually.

### 2.7 Safe vertical centering

Use a flex-based page shell with automatic margins on the card at wide sizes rather than absolute positioning or unsafe fixed centering.

Expected behavior:

- When the card plus page padding fits, automatic margins center it horizontally and vertically.
- When content is taller than the viewport, automatic block margins collapse to zero and normal page scrolling keeps the top reachable.

Do not use absolute positioning for the card.

### 2.8 Motion decision

Do not add transitions in the first implementation.

The button state changes may occur immediately. This:

- Matches the requirement that motion is optional
- Avoids awkward attempts to animate between a solid color and gradient
- Removes unnecessary reduced-motion complexity

`prefers-reduced-motion` should still be tested. If a short color transition is added during refinement, it must be isolated and disabled or minimized for reduced motion.

### 2.9 Test-dependency decision

Add Vitest as the only new dev dependency, limited to pure runtime-validation tests.

Do not add:

- jsdom
- Testing Library
- Playwright
- A visual-regression service

Rationale:

- The closed schema has many invalid permutations.
- The validator is a pure function and inexpensive to test.
- Automated validator tests directly protect AC-03 and AC-12 through AC-14.

Tradeoff:

- The lockfile and development dependency graph grow.
- The benefit is limited to data validation; visual, semantic, and browser behavior still require manual browser testing.

Before installation, verify that the selected Vitest version is compatible with the repository’s current Vite and TypeScript versions. Do not force an incompatible upgrade of Vite or TypeScript merely to add tests.

---

## 3. Target file structure

The planned application structure is:

```text
frontend/
├── index.html
├── package.json
├── pnpm-lock.yaml
├── public/
│   └── favicon-32x32.png
├── src/
│   ├── assets/
│   │   ├── fonts/
│   │   │   └── HankenGrotesk-VariableFont_wght.ttf
│   │   └── icons/
│   │       ├── icon-memory.svg
│   │       ├── icon-reaction.svg
│   │       ├── icon-verbal.svg
│   │       └── icon-visual.svg
│   ├── data/
│   │   └── results.json
│   ├── results-summary/
│   │   ├── category-icons.ts
│   │   ├── render-results-summary.ts
│   │   ├── results-summary.types.ts
│   │   ├── validate-results-summary.test.ts
│   │   └── validate-results-summary.ts
│   ├── styles/
│   │   ├── base.css
│   │   ├── results-summary.css
│   │   └── tokens.css
│   └── main.ts
└── tsconfig.json
```

### 3.1 File responsibilities

#### `frontend/index.html`

- Keep `lang="en"`.
- Change the title to `Results summary`.
- Replace the Vite favicon with the copied PNG favicon.
- Keep one `#app` mount node and one module entry.

#### `frontend/src/main.ts`

- Import styles in deterministic order.
- Import the raw JSON data.
- Validate the raw value.
- Create exactly one `<main>`.
- Mount the complete component or fallback.
- Log validation issues only in development when practical.
- Contain no component markup details beyond bootstrap orchestration.

#### `results-summary.types.ts`

- Define `ScoreCategoryId` as a string union.
- Define `ScoreCategory` and `ResultsSummaryData`.
- Define the validation-result types when that keeps the validator signature readable.
- Use `import type` where required by `verbatimModuleSyntax`.
- Do not use TypeScript enums or namespaces because `erasableSyntaxOnly` is enabled.

#### `validate-results-summary.ts`

- Accept `unknown`.
- Validate the entire closed schema.
- Return a typed success or a list of descriptive issues.
- Never clamp, round, reorder, or fill missing values.
- Remain independent from DOM and CSS code.

#### `validate-results-summary.test.ts`

- Test valid default data.
- Test all meaningful invalid schema classes.
- Test accepted numeric boundaries.
- Remain in the default Node test environment.

#### `category-icons.ts`

- Import the four copied SVG URLs.
- Export one exhaustive mapping from `ScoreCategoryId` to icon URL.
- Use `satisfies Record<ScoreCategoryId, string>` or an equivalent exhaustive check.
- Store no labels, scores, or colors in this file.

Category colors remain in CSS because they are presentation tokens, not data.

#### `render-results-summary.ts`

- Build the component with native DOM APIs.
- Use validated text through `textContent`.
- Create the semantic heading and description-list structure.
- Build category rows from one iteration path.
- Add the optional callback only when supplied.
- Expose no global state.

#### `tokens.css`

- Define semantic design tokens for:
  - Palette
  - Accessible production colors
  - Gradients
  - Shadow
  - Spacing
  - Radii
  - Typography sizes and line heights
  - Component maximum widths
  - Breakpoint-related values where CSS custom properties are useful
- Use semantic production names rather than reproducing Figma slash-delimited variable names.

#### `base.css`

- Define `@font-face`.
- Apply box sizing and minimal reset rules.
- Set body and application-root defaults.
- Define the visually-hidden utility.
- Define document-level typography and font fallback.
- Avoid a broad opinionated reset that changes native control behavior unnecessarily.

#### `results-summary.css`

- Contain all page-shell and component styling.
- Start with the mobile composition.
- Add one primary `min-width: 700px` media query.
- Define category custom properties through `data-category` selectors.
- Define button interaction and forced-colors rules.
- Avoid fixed text-container heights.
- Avoid absolute positioning for primary layout.

### 3.2 Runtime asset decision

Use the variable font file rather than copying all three static fonts.

Reasons:

- One request covers weights `500`, `700`, and `800`.
- It is an exact source asset already supplied by the repository.
- It avoids three separate runtime font files.

Use an `@font-face` weight range covering the required weights and `font-display: swap`.

Do not convert or subset the font during the first implementation. Conversion could improve payload size, but it would introduce a new asset-production step and conflict with the current requirement to preserve exact source bytes.

Copy the category SVGs unchanged. Their strokes already contain the correct bright Figma accent colors. Do not recolor them with CSS filters.

Render each `20 × 20px` source SVG inside the specified approximately `32 × 32px` reserved icon box.

---

## 4. Detailed implementation phases

## Phase 0 — Establish a clean baseline

### Goal

Confirm that the current scaffold builds before making implementation changes and create a reproducible starting point.

### Tasks

1. Work in a focused feature branch such as:
   - `feat/results-summary-component`
2. From `frontend/`, record:
   - Node version
   - pnpm version
3. Run:
   - `pnpm install`
   - `pnpm build`
4. Run the starter application and confirm the existing Vite page loads.
5. Confirm there are no uncommitted repository changes before implementation.
6. Review the project-local Modern Web Guidance files relevant to:
   - Semantic HTML and ARIA
   - Responsive CSS layout
   - Focus handling
   - Overflow and reflow
7. Capture or retain a reference to the current Figma desktop, tablet, mobile, and active-button views.

### Verification gate

- Baseline install succeeds.
- Baseline build succeeds before any product change.
- Any pre-existing warning is recorded rather than silently attributed to the new implementation.

### Risks addressed

- Distinguishes existing build problems from implementation regressions.
- Prevents environment-version surprises late in the work.

---

## Phase 1 — Replace starter configuration and establish runtime assets

### Goal

Remove unrelated Vite starter artifacts and establish the correct document metadata, asset ownership, and build configuration.

### Files to update

- `frontend/index.html`
- `frontend/tsconfig.json`
- `frontend/package.json`
- `frontend/pnpm-lock.yaml`

### Files to create or copy

- `frontend/public/favicon-32x32.png`
- `frontend/src/assets/fonts/HankenGrotesk-VariableFont_wght.ttf`
- `frontend/src/assets/icons/icon-memory.svg`
- `frontend/src/assets/icons/icon-reaction.svg`
- `frontend/src/assets/icons/icon-verbal.svg`
- `frontend/src/assets/icons/icon-visual.svg`

### Files to remove

- `frontend/public/favicon.svg`
- `frontend/public/icons.svg`
- `frontend/src/assets/hero.png`
- `frontend/src/assets/typescript.svg`
- `frontend/src/assets/vite.svg`
- `frontend/src/counter.ts`

### Tasks

1. Change the document title to `Results summary`.
2. Point the favicon link to the copied `favicon-32x32.png` and use the correct MIME type.
3. Copy the variable font and four SVGs without modifying their bytes.
4. Enable `resolveJsonModule` in `tsconfig.json`.
5. Add a `test` script to `package.json`.
6. Add a compatible Vitest version as a dev dependency.
7. Remove all Vite starter assets and the counter module.
8. Keep design-source assets under `docs/design/` unchanged.

### Verification gate

- No source import references a removed starter asset.
- The runtime font and icon files exist under `frontend/`.
- `pnpm build` succeeds after configuration changes.
- The favicon path resolves during development.
- `docs/design/` remains intact.

### Acceptance criteria covered

- AC-01
- AC-02
- AC-04
- AC-05
- AC-06
- AC-32
- AC-33

### Commit boundary

Suggested commit:

```text
chore: prepare results summary runtime assets
```

---

## Phase 2 — Implement the content model and runtime validation

### Goal

Create one trustworthy data boundary before any score UI is rendered.

### Files to create

- `frontend/src/data/results.json`
- `frontend/src/results-summary/results-summary.types.ts`
- `frontend/src/results-summary/validate-results-summary.ts`
- `frontend/src/results-summary/validate-results-summary.test.ts`

### Tasks

1. Add the exact approved default JSON content:
   - Overall `76`
   - Maximum `100`
   - Percentile `65`
   - Reaction `80`
   - Memory `92`
   - Verbal `61`
   - Visual `73`
   - Action `Continue`
2. Define the closed TypeScript model from `SPEC.md`.
3. Implement small validation helpers for:
   - Non-null records
   - Non-whitespace strings
   - Integer ranges
   - Exact category IDs and order
4. Validate:
   - Root object shape
   - Required text fields
   - `maximumScore === 100`
   - Overall and category scores in `0...100`
   - Percentile in `0...100`
   - Exactly four categories
   - Exact ID order
   - No duplicates or unknown IDs
5. Return all useful issues discovered in one pass where this does not complicate the validator.
6. Do not mutate the imported object.
7. Do not normalize invalid data into validity.
8. Keep the overall score independent from category arithmetic.

### Validator test matrix

#### Valid cases

- Exact default object
- Overall score `0`
- Overall score `100`
- Category scores `0`
- Category scores `100`
- Percentile `0`
- Percentile `100`

#### Invalid root and text cases

- `null`
- Array root
- Primitive root
- Missing required field
- Blank result heading
- Blank rating
- Blank summary heading
- Blank action label
- Blank category label

#### Invalid numeric cases

- Maximum score other than `100`
- Negative score
- Score greater than `100`
- Decimal score
- `NaN` where programmatically supplied
- Infinite number where programmatically supplied
- Percentile outside range
- Decimal percentile

#### Invalid category cases

- Missing category array
- Empty array
- Three categories
- Five categories
- Duplicate ID
- Unknown ID
- Missing required ID
- Correct IDs in the wrong order
- Category value that is not an object

### Verification gate

- `pnpm test` passes.
- `pnpm build` passes.
- Tests prove that invalid data is rejected rather than corrected.
- Validator code contains no DOM dependency.
- Types use no enum or other construct disallowed by `erasableSyntaxOnly`.

### Acceptance criteria covered

- AC-02
- AC-03
- AC-07 through AC-14

### Commit boundary

Suggested commit:

```text
feat: add validated results summary data model
```

---

## Phase 3 — Build the semantic renderer and application bootstrap

### Goal

Render the complete ready or fallback state with correct DOM order and native semantics before visual styling.

### Files to create

- `frontend/src/results-summary/category-icons.ts`
- `frontend/src/results-summary/render-results-summary.ts`

### Files to replace

- `frontend/src/main.ts`

### Tasks

#### Bootstrap

1. Import the three stylesheet modules in this order:
   1. `tokens.css`
   2. `base.css`
   3. `results-summary.css`
2. Import raw JSON.
3. Pass the imported value through runtime validation.
4. Locate `#app` defensively.
5. Create exactly one `<main>` page shell.
6. Mount either:
   - The rendered Results Summary component
   - A plain `Results are unavailable.` fallback
7. In development only, log validation issues with clear field paths.
8. Do not throw an uncaught error for invalid content.

#### Ready-state structure

Build this semantic hierarchy without changing its DOM order at different breakpoints:

```text
main
└── results summary wrapper
    ├── result overview
    │   ├── h1: Your Result
    │   ├── overall score
    │   ├── rating
    │   └── comparison message
    └── summary panel
        ├── h2: Summary
        ├── dl
        │   └── grouped dt + dd × 4
        └── button: Continue
```

#### Overall-score accessibility

Use one visual group and one coherent accessible phrase.

Recommended pattern:

- Keep the score container available to the accessibility tree.
- Mark visual number fragments as `aria-hidden="true"`.
- Add a visually hidden phrase such as `76 out of 100` outside any `aria-hidden` ancestor.
- Confirm the accessible phrase is not announced twice.

#### Category-score accessibility

For each row:

- `<dt>` exposes the visible category label.
- `<dd>` contains:
  - Visual score fragments hidden from assistive technology
  - A visually hidden complete value such as `80 out of 100`
- Do not repeat `Reaction` inside the hidden `<dd>` text unless screen-reader testing shows the `<dt>` and `<dd>` relationship is unclear.
- Do not add `aria-label` to a plain non-interactive row container.

#### Icons

- Create one exhaustive category-to-icon URL map.
- Render the icon with empty `alt` text.
- Set explicit intrinsic dimensions.
- Keep the icon outside the accessible name because the visible label already provides meaning.

#### Continue action

- Create a native `<button type="button">`.
- Use the validated action label.
- Attach one click listener only when `onContinue` exists.
- Do not synthesize keyboard handling; rely on native button behavior.

#### Fallback

- Render only `Results are unavailable.` inside `<main>`.
- Do not render stale headings, scores, list rows, or button.
- Do not use `aria-live` for this initial synchronous render.

### Verification gate

Before detailed styling:

- DOM reading order matches the specification.
- The document contains one `<main>`, one `<h1>`, and one `<h2>` in the ready state.
- The list is one `<dl>` containing four grouped `<dt>`/`<dd>` pairs.
- Continue is a native button and does not submit, reload, or navigate.
- Category rows are generated through one array iteration.
- Text values are assigned through `textContent`.
- Screen-reader output does not duplicate visual score fragments in the browser accessibility tree.
- Invalid JSON fixture renders only the fallback.
- `pnpm test` and `pnpm build` pass.

### Acceptance criteria covered

- AC-07 through AC-14
- AC-40
- AC-45
- AC-46
- AC-47 through AC-53

### Commit boundary

Suggested commit:

```text
feat: render semantic results summary markup
```

---

## Phase 4 — Establish tokens, typography, reset, and shared CSS foundations

### Goal

Create the design-system layer before styling individual responsive layouts.

### Files to create

- `frontend/src/styles/tokens.css`
- `frontend/src/styles/base.css`
- `frontend/src/styles/results-summary.css`

### Tasks

#### Tokens

Define semantic custom properties for:

- White surface
- Pale page background
- Navy primary text and button
- Lavender supporting text
- Accessible category label colors
- Category row backgrounds
- Bright icon accents where useful for documentation
- Secondary category score `#5F677B`
- Result gradient
- Score gradient
- Shadow
- Spacing scale `0` through `80px`
- `12px` and `32px` radii
- Pill radius
- Mobile and wide score sizes
- Card maximum width `736px`
- Result content maximum width `260px`
- Typography sizes and line heights

Prefer names such as:

```text
--color-surface
--color-page
--color-text-primary
--color-text-supporting
--color-category-reaction-label
--gradient-result
--shadow-card
--space-1
--radius-card
```

Do not use ambiguous starter names such as `--text`, `--bg`, or `--accent`.

#### Font

1. Define one `@font-face` for Hanken Grotesk.
2. Point it to the copied variable TTF through a relative Vite-managed URL.
3. Set the supported weight range to cover `500` through `800`.
4. Use `font-display: swap`.
5. Set a system sans-serif fallback.
6. Use `font-synthesis: none` so missing weights are not artificially generated.

#### Minimal reset

Include:

- Border-box sizing for all elements and pseudo-elements
- Body margin reset
- Inherited font for buttons
- Margin reset only for component headings, paragraphs, and description-list elements as needed
- Responsive images with explicit dimensions retained
- `min-inline-size: 0` where flex/grid children must shrink

Do not:

- Enable automatic dark mode
- Set `color-scheme: light dark`
- Remove all native outlines globally
- Apply a broad reset that changes unrelated elements

#### Visually hidden utility

Add one robust visually-hidden class that:

- Remains in the accessibility tree
- Occupies a `1px` box
- Prevents layout influence
- Does not hide focusable content permanently

The current component uses it only for non-focusable score text, but the utility should still follow a safe established pattern.

#### CSS authoring style

- Use flat, readable selectors.
- Native CSS nesting is not necessary for this small component.
- Use logical properties where practical.
- Use BEM-like or similarly explicit component class names.
- Keep selectors low-specificity.
- Avoid styling by element alone inside broad page scopes when a component class is clearer.

### Verification gate

- Local font request succeeds.
- The `500`, `700`, and `800` weights visually differ as intended.
- Disabling the font request falls back without clipped content.
- No starter dark-mode styles remain.
- No global outline removal exists.
- CSS tokens cover repeated design values rather than duplicating raw values throughout the component stylesheet.
- `pnpm build` passes.

### Acceptance criteria covered

- AC-32
- AC-33
- AC-34
- AC-36 through AC-39
- AC-60

### Commit boundary

This phase may be combined with Phase 5 if it is easier to review the CSS foundation together with the first rendered layout. Otherwise:

```text
style: add results summary design tokens
```

---

## Phase 5 — Implement the mobile-first composition

### Goal

Match the `375 × 809` Figma frame while remaining resilient down to `320px` and up to `699px`.

### Page shell

1. Use a white page background below `700px`.
2. Keep the component in normal document flow.
3. Do not vertically center the component.
4. Set the page and application root to at least the viewport height without forcing content clipping.
5. Permit normal vertical scrolling on short viewports.

### Result overview

1. Use full viewport/container inline size.
2. Use the result gradient.
3. Use square top corners and `32px` bottom corners.
4. Apply the mobile shadow to the result panel itself.
5. Set a default minimum height of `356px` at the reference content size.
6. Center the internal content horizontally.
7. Use a `260px` maximum content width.
8. Use approximately `32px` block inset.
9. Use:
   - `24px` primary gaps
   - `8px` rating-to-message gap
10. Use the `140px` score circle.
11. Allow the section to grow when copy, fallback font, zoom, or text spacing requires it.

### Summary panel

1. Place it `24px` after the result overview.
2. Use a fluid inline gutter equivalent to:

```css
padding-inline: clamp(24px, 8vw, 30px);
```

3. Use `24px` major vertical gaps.
4. Use `16px` between category rows.
5. Provide bottom space large enough for:
   - The button focus outline
   - Normal page breathing room
6. Keep the button full width.

### Category-row layout

Use CSS Grid for each row:

```text
minmax(0, 1fr) auto
```

The first track contains a flex row:

```text
32px icon box + 8px gap + flexible label
```

The second track contains a no-wrap score phrase.

Required resilience rules:

- `min-inline-size: 0` on the flexible topic area
- Label may wrap
- Score phrase remains on one line
- Row uses `min-block-size: 56px`, not fixed block size
- Row grows when text-spacing overrides require it
- Icon box never collapses

### Category presentation

Use `data-category` selectors to assign row-level custom properties:

```text
--category-background
--category-label-color
```

The icon remains the exact source SVG and does not depend on these CSS variables for its stroke.

### Mobile typography

Apply the exact mobile sizes and weights from `SPEC.md`:

- Result heading `18 / 700`
- Score `56 / 800`
- Maximum `16 / 700`
- Rating `24 / 700`
- Comparison `16 / 500`
- Summary heading `18 / 700`
- Category label `16 / 500`
- Category score `16 / 700`
- Button `18 / 700`

Use tabular numerals for all scores.

### Verification matrix

Test at:

- `320px` wide
- `375 × 809`
- `480px` wide
- `699px` wide
- Short landscape height

Check:

- No horizontal page scrollbar
- Full-bleed result panel
- No pale side gutters around result panel
- Approximately `30px` summary gutters at `375px`
- Minimum `24px` gutters at `320px`
- Score and labels do not overlap
- The mobile shadow is visible but soft
- Focus ring is not clipped at the bottom
- Long labels increase row height

### Acceptance criteria covered

- AC-15 through AC-20
- AC-31
- AC-54 through AC-56
- AC-59
- AC-60

### Commit boundary

Suggested commit:

```text
style: implement mobile results summary layout
```

---

## Phase 6 — Implement tablet and desktop behavior

### Goal

Create the resilient two-column composition at `700px` and above while matching the tablet and desktop reference frames.

### Media query

Use one primary layout query:

```css
@media (min-width: 700px) { ... }
```

All wide typography changes occur in the same query unless a later visual review proves a separate adjustment is necessary.

### Wide page shell

1. Change the page background to `#F3F4FD`.
2. Apply approximately:
   - `32px` block padding
   - `40px` inline padding
3. Use a flex page shell.
4. Give the card automatic margins for safe centering.
5. Preserve normal scrolling when the card exceeds available block size.

### Composite card

1. Use:

```text
inline-size: 100% of padded area
max-inline-size: 736px
min-block-size: 512px
```

2. Use a two-column CSS Grid with equal flexible tracks.
3. Stretch both columns to the same resulting height.
4. Use white surface, `32px` radius, and the specified shadow.
5. Do not set `overflow: hidden` or `overflow: clip` on the outer card because the Continue focus outline must remain visible.
6. Allow natural height growth.

### Result column

1. Use the result gradient.
2. Apply `32px` radius on all four corners.
3. Center default content on both axes.
4. Use `260px` maximum content width.
5. Use:
   - `32px` primary gaps
   - `16px` rating-to-message gap
6. Increase the score circle to `200px`.

### Summary column

1. Center default content vertically.
2. Use a full-width internal content wrapper.
3. Interpolate inline inset from `24px` at `700px` to `40px` near the desktop maximum.
4. Initial candidate formula:

```css
padding-inline: clamp(24px, calc(20vw - 116px), 40px);
```

Expected results:

- `700px` viewport: approximately `24px` inset
- `768px` viewport: approximately `37.6px` inset, producing about `269px` content width
- Desktop maximum: `40px` inset, producing `288px` content width

This formula must be verified rather than accepted blindly. If browser measurements fall outside tolerance, adjust the interpolation while preserving the three anchor results.

5. Use:
   - `32px` major gaps
   - `16px` category-row gaps
6. Keep the button full width.

### Wide typography

Apply:

- Result and summary headings `24 / 700`
- Score `72 / 800`
- Maximum `18 / 700`
- Rating `32 / 700`
- Comparison `18 / 500`
- Category label `18 / 500`
- Category score `18 / 700`
- Button `18 / 700`

### Breakpoint verification

Test exactly:

- `699px`
- `700px`
- `701px`

At the switch confirm:

- No horizontal scrollbar
- No overlapping columns
- No inaccessible vertical jump
- Both column contents fit
- Button focus ring remains visible
- DOM order is unchanged

### Reference verification

#### Tablet: `768 × 1080`

Target:

- Card approximately `686–688px` wide
- Card approximately `512px` high with default content
- Summary content approximately `269px` wide
- `200px` score circle
- Centered composition

#### Desktop: `1440 × 1080`

Target:

- Card `736 × 512px`
- Two approximately `368px` columns
- Summary content `288px` wide
- Centered composition

### Acceptance criteria covered

- AC-21 through AC-31
- AC-34
- AC-54 through AC-56

### Commit boundary

Suggested commit:

```text
style: add responsive tablet and desktop card
```

---

## Phase 7 — Implement interaction, contrast, and user-preference behavior

### Goal

Complete all interactive and accessibility-specific visual states without compromising Figma fidelity or focus visibility.

### Button states

#### Default

- Navy background `#303B59`
- White text
- Minimum `56px` height
- Pill shape
- Stable dimensions

#### Hover

Gate hover styling with a capability query such as:

```css
@media (hover: hover) { ... }
```

Use the result gradient on hover.

Do not require `(pointer: fine)` unless testing demonstrates a concrete need; stylus and other hover-capable inputs should not be excluded unnecessarily.

#### Pressed

- Retain gradient on `:active`.
- Do not scale or translate.
- Do not alter border or padding in a way that moves content.

#### Focus visible

- `3px` outline in `#1125D6`
- At least `3px` offset
- Visible over navy and gradient states
- Able to coexist with hover
- Never clipped by parent overflow

### Forced colors

Add a focused forced-colors rule that:

- Allows the system to override fills
- Preserves a visible button boundary
- Uses a system focus color such as `Highlight` where needed
- Does not force the authored gradient to remain

Test in forced-colors emulation or Windows High Contrast where available.

### Contrast validation

Verify rendered contrast for:

- White result heading
- White overall score
- White rating
- `#CAC9FF` comparison message at its actual lower-gradient position
- `#CAC9FF` maximum inside the score circle
- Accessible category labels on each pale row
- `#5F677B` category maximum on each pale row
- White button text on navy and both ends of the gradient
- Focus outline against surrounding white/pale backgrounds

If either `#CAC9FF` gradient combination fails:

1. Lighten the affected foreground only.
2. Preserve the relative hierarchy beneath white primary text.
3. Record the final value in `DESIGN.md` and `SPEC.md` before considering the implementation complete.

Do not darken the gradient solely to repair one text combination without checking the broader visual effect.

### Reduced motion

Because the first implementation adds no transition:

- Confirm no motion occurs.
- Keep a reduced-motion rule only if a transition is later introduced.

### Verification gate

- Hover works only where hover exists.
- Keyboard focus works with and without simultaneous hover.
- Enter and Space activate the button once each.
- Pressed state does not move layout.
- Forced colors preserve a recognizable button and focus ring.
- All meaningful text passes contrast checks.
- No focus outline is clipped.

### Acceptance criteria covered

- AC-36 through AC-46
- AC-53
- AC-57
- AC-58

### Commit boundary

Suggested commit:

```text
style: complete accessible button states
```

---

## Phase 8 — Perform visual-fidelity refinement

### Goal

Tune the implementation against Figma after structure, responsiveness, and accessibility are stable.

### Process

1. Capture browser screenshots at:
   - `375 × 809`
   - `768 × 1080`
   - `1440 × 1080`
2. Compare each against the matching Figma frame.
3. Check in this order:
   1. Outer composition and centering
   2. Card and panel dimensions
   3. Score-circle dimensions
   4. Major vertical spacing
   5. Summary width and row spacing
   6. Typography size, weight, and line breaks
   7. Radii
   8. Gradients
   9. Shadow
   10. Icon alignment
4. Use overlays or side-by-side measurement rather than visual memory.
5. Adjust tokens and shared layout rules before introducing one-off selector overrides.
6. Preserve the documented accessibility deviations even when they differ from Figma.

### Measurement tolerances

- General reference geometry: within `4px`
- Tablet column proportions: within `8px`
- Font line wrapping may differ slightly because of browser rasterization, but the content block should retain equivalent hierarchy and dimensions.

### Avoid during refinement

- Absolute positioning to force visual coincidence
- Fixed text heights
- Negative margins that break reflow
- Per-viewport magic values for only one screenshot
- Reintroducing inaccessible Figma colors
- Clipping focus to match the outer card silhouette

### Verification gate

- All three reference frames are within documented tolerance.
- Intermediate widths remain stable after tuning.
- Long-content and text-spacing tests still pass.
- Visual fixes do not change DOM order or semantics.
- Any intentional difference is documented rather than hidden.

### Acceptance criteria covered

- AC-15 through AC-39

---

## Phase 9 — Complete accessibility and resilience QA

### Goal

Test the component as a usable web interface, not only as a screenshot reproduction.

### 9.1 Keyboard test

Using only the keyboard:

1. Press `Tab`.
2. Confirm Continue receives focus.
3. Confirm the focus ring is fully visible.
4. Activate with `Enter`.
5. Activate with `Space`.
6. Confirm no navigation, reload, or submission occurs without a callback.
7. Confirm there is no unexpected extra focus stop.

### 9.2 Accessibility-tree test

Inspect the browser accessibility tree and confirm:

- One main landmark
- One level-one heading
- One level-two heading
- One button named `Continue`
- Overall score announced once as `76 out of 100`
- Each category label is associated with a complete score
- Decorative icons have no announced name
- Visual score fragments are not duplicated

Perform a brief screen-reader smoke test when a calibrated environment is available.

### 9.3 Reflow and zoom test

Test:

- `320px` viewport width
- `200%` zoom at a common desktop viewport
- `400%` zoom from a `1280px`-wide viewport
- Short portrait and landscape heights

Confirm:

- No horizontal page scrollbar
- No overlap
- No clipping
- All content remains reachable
- Wide layout reflows to mobile when the effective CSS viewport drops below `700px`

### 9.4 Text-spacing test

Apply:

- Line height `1.5`
- Paragraph spacing `2em`
- Letter spacing `0.12em`
- Word spacing `0.16em`

Confirm:

- Rows grow
- Card sections grow
- Score phrases remain distinguishable
- Button label remains visible
- Focus ring remains visible
- No content overlaps or clips

### 9.5 Failure-mode test

#### Font failure

Block or rename the font request temporarily.

Confirm:

- System sans-serif appears
- No fixed-height clipping occurs
- Content remains readable

#### Icon failure

Block one icon request.

Confirm:

- Reserved icon box remains
- Label and score remain aligned
- Category meaning remains clear

#### Invalid data

Run test fixtures for:

- Incorrect maximum
- Duplicate category
- Reordered category
- Missing category
- Invalid numeric value
- Blank text

Confirm only the fallback renders.

### 9.6 Automated and browser audits

Run:

- `pnpm test`
- `pnpm build`
- Browser console check
- Lighthouse accessibility audit or axe-based browser audit where available

Treat automated audit results as a signal, not proof of usability.

### 9.7 Browser coverage

Test current versions of at least:

- Chromium-based browser
- Firefox
- Safari when an environment is available

Pay particular attention to:

- Variable-font loading
- Description-list accessibility tree
- Safe vertical centering
- Focus outline
- CSS calculation used for summary inset
- Forced-colors behavior in supported environments

### Acceptance criteria covered

- AC-01 through AC-60

---

## Phase 10 — Cleanup, documentation, and final review

### Goal

Leave the repository with only intentional code and accurate project documentation.

### Tasks

1. Remove any temporary fixtures, debug logs, measurements, and comparison code.
2. Confirm no deleted starter file remains referenced.
3. Confirm no temporary Figma MCP URL exists in source or built output.
4. Confirm no runtime path reaches into `docs/design/`.
5. Confirm only required dependencies are present.
6. Run final:
   - `pnpm test`
   - `pnpm build`
7. Preview the production build with `pnpm preview`.
8. Update `README.md` only where implementation facts changed:
   - Replace the screenshot after visual QA
   - Confirm the technology list remains accurate
   - Keep the live URL only if deployment still resolves correctly
9. Record any accessibility color adjustment made during rendered contrast testing in both `DESIGN.md` and `SPEC.md`.
10. Review all 60 acceptance criteria and mark each as:
    - Passed
    - Failed
    - Not testable in the available environment
11. Do not claim full completion when Safari, forced-colors, or screen-reader checks were unavailable; record the limitation.

### Final commit boundary

Suggested commit:

```text
docs: update results summary implementation notes
```

---

## 5. Acceptance-criteria traceability

| Implementation area | Primary acceptance criteria |
|---|---|
| Build configuration and runtime assets | AC-01 through AC-06 |
| Content model and validator | AC-07 through AC-14 |
| Mobile layout | AC-15 through AC-20 |
| Breakpoint, tablet, and desktop layout | AC-21 through AC-31 |
| Typography, gradients, colors, icons | AC-32 through AC-39 |
| Button interaction | AC-40 through AC-46 |
| Semantics and assistive technology | AC-47 through AC-53 |
| Zoom, text spacing, preferences, failures | AC-54 through AC-60 |

No phase is considered complete merely because its visual screenshot looks correct. Each phase must also pass its associated semantic, build, and resilience criteria.

---

## 6. Planned implementation sequence and commits

Keep changes small and independently reviewable.

Recommended sequence:

1. `chore: prepare results summary runtime assets`
2. `feat: add validated results summary data model`
3. `feat: render semantic results summary markup`
4. `style: implement mobile results summary layout`
5. `style: add responsive tablet and desktop card`
6. `style: complete accessible button states`
7. `test: verify results summary acceptance criteria`
8. `docs: update results summary implementation notes`

Each commit should build successfully. Commits containing validator changes should also pass tests.

Avoid one large implementation commit that combines asset migration, validation, markup, all responsive CSS, and documentation.

---

## 7. Implementation risks and mitigations

### 7.1 Breakpoint visual tension

**Risk:** At exactly `700px`, the wide card has about `620px` available after page gutters, creating two approximately `310px` columns.

**Mitigation:**

- Verify `699px`, `700px`, and `701px` early in Phase 6.
- Keep result content capped at `260px`.
- Start summary inset at `24px`.
- Keep category rows intrinsically sized.
- Move the breakpoint only through a documented `SPEC.md` change if the two-column layout genuinely fails.

### 7.2 Tablet asymmetry

**Risk:** Equal Grid columns differ slightly from Figma’s `338px / 348px` split.

**Mitigation:**

- Use the documented `8px` tolerance.
- Verify the visual weight at `768px`.
- Do not introduce fractional hardcoded tracks unless the equal layout creates a material fidelity problem.

### 7.3 Gradient-position contrast

**Risk:** `#CAC9FF` contrast changes depending on the exact gradient position.

**Mitigation:**

- Test rendered pixels in both mobile and wide layouts.
- Lighten only the affected text if required.
- Synchronize any change into design and specification documents.

### 7.4 Focus clipping

**Risk:** Matching Figma’s clipped outer card could hide the button outline.

**Mitigation:**

- Do not clip the outer card.
- Keep enough summary spacing around the button.
- Test focus while hovered and at narrow wide-layout widths.

### 7.5 Font metrics and loading

**Risk:** The variable TTF and system fallback may produce different line breaks or temporary layout shifts.

**Mitigation:**

- Use `font-display: swap`.
- Use natural heights.
- Test with the font blocked.
- Tune widths based on Hanken Grotesk while keeping fallback usable.

### 7.6 Overly generic architecture

**Risk:** A simple component could become fragmented across too many abstraction layers.

**Mitigation:**

- Limit TypeScript modules to types, validation, icon mapping, rendering, and bootstrap.
- Do not add a general component base class, templating system, store, or dependency injection.
- Keep CSS to three focused files.

### 7.7 Unsafe dynamic markup

**Risk:** Using `innerHTML` with JSON strings could introduce injection risk and escaping complexity.

**Mitigation:**

- Build elements through DOM APIs.
- Assign all content with `textContent`.
- Treat imported JSON as unknown until validation.

### 7.8 Description-list screen-reader variation

**Risk:** Different screen readers may announce grouped `<dt>`/`<dd>` content differently.

**Mitigation:**

- Keep the markup valid and simple.
- Use a visually hidden complete score in `<dd>`.
- Verify the accessibility tree and run a screen-reader smoke test.
- Avoid unnecessary ARIA on plain containers.

### 7.9 Test dependency compatibility

**Risk:** A Vitest release may not align cleanly with the current Vite or TypeScript versions.

**Mitigation:**

- Verify compatibility before installation.
- Keep tests Node-only and dependency-light.
- Do not upgrade the application stack solely for tests.
- If compatibility cannot be achieved without scope expansion, document the issue and retain the pure validator for later testing rather than adding a second toolchain.

### 7.10 Figma overfitting

**Risk:** Tuning only the three reference screenshots could break intermediate widths, zoom, or expanded text.

**Mitigation:**

- Use flexible Grid/Flexbox and intrinsic sizing.
- Test intermediate widths after every visual adjustment.
- Prefer token changes over isolated magic values.
- Treat `512px` and `56px` as default/minimum dimensions, not clipping constraints.

---

## 8. Explicit tradeoffs

### Equal columns instead of exact tablet tracks

Accepted for simplicity and resilience. Desktop remains exact; tablet remains within tolerance.

### Media query instead of container query

Accepted because the first release is a single page with a viewport-defined specification. Revisit only if the component becomes embeddable.

### Variable TTF instead of three static font files

Accepted to reduce requests and preserve all required weights in one supplied asset. The payload is not converted or subset in this release.

### Manual DOM rendering instead of a framework

Accepted because the component is small, has one interaction, and does not justify framework runtime or tooling.

### Handwritten validation instead of a schema library

Accepted because the schema is closed and small. Tests protect the main failure paths.

### Limited automated testing

Validator behavior is automated. Visual, responsive, keyboard, screen-reader, and user-preference behavior remain browser-tested because adding a full browser-test stack would be disproportionate for this project.

### No animation

Accepted because the design does not require motion and immediate state changes reduce complexity.

---

## 9. Definition of done

Implementation is complete only when:

- The Vite starter interface and assets are fully removed.
- Runtime assets live inside `frontend/`.
- Local JSON is imported and runtime-validated.
- Invalid data renders only the unavailable fallback.
- The ready state is generated from the validated data.
- The page uses correct headings, description-list semantics, and a native button.
- Screen readers receive coherent, non-duplicated score phrases.
- Mobile, tablet, and desktop reference layouts meet documented tolerance.
- The `700px` switch is stable at `699px`, `700px`, and `701px`.
- The component has no horizontal page scrolling at `320px` or high zoom.
- Text-spacing overrides cause growth rather than clipping.
- Hover, pressed, focus-visible, forced-colors, and keyboard behavior pass.
- All meaningful text meets contrast requirements at its actual rendered position.
- Font and icon failure modes remain usable.
- `pnpm test` passes.
- `pnpm build` passes.
- Production preview loads without console errors or missing assets.
- No temporary Figma URL or `docs/design/` runtime dependency remains.
- All 60 acceptance criteria have recorded outcomes.

---

## 10. Deferred work

Do not include the following during this implementation unless the specification is revised:

- Continue navigation destination
- Success state
- Disabled or loading button
- Async fetching
- Backend integration
- Authentication or persistence
- Score editing
- Multiple result cards
- Arbitrary maximum-score scales
- Additional categories
- Animated score counting
- Dark theme
- Full localization
- Right-to-left layout
- Container-query embedding behavior
- Automated browser visual regression
- Production font conversion or subsetting
