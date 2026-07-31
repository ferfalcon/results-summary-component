# Implementation Plan — Results Summary Component

## Document status

This plan translates the approved Figma design, `DESIGN.md`, `SPEC.md`, and the current repository into an incremental implementation sequence.

It defines:

- The target architecture
- Exact file responsibilities
- A buildable order of work
- Reviewable commit boundaries
- Verification gates for every phase
- Acceptance-criteria coverage
- Tradeoffs, risks, and mitigations

The plan does not include production implementation code.

### Source precedence

When sources conflict, use this order:

1. `SPEC.md` for functional, technical, accessibility, and testable requirements
2. `DESIGN.md` for visual intent and documented production deviations from Figma
3. Figma for original geometry, hierarchy, spacing, typography, gradients, and component appearance
4. `REVIEW.md` for the rationale behind resolved contradictions and remaining verification risks
5. Existing starter code only for repository conventions that do not conflict with the documents above

---

## 1. Current repository baseline

### 1.1 Application structure

The runnable application is under `frontend/` and currently contains a Vite starter rather than the Results Summary implementation.

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
- No custom Vite configuration
- `frontend/tsconfig.json` currently enables:
  - Bundler module resolution
  - `verbatimModuleSyntax`
  - `noUnusedLocals`
  - `noUnusedParameters`
  - `erasableSyntaxOnly`
  - `noEmit`
- JSON-module resolution is not currently enabled

### 1.3 Starter code to replace

The current implementation is disposable starter content:

- `main.ts` renders Vite documentation and social links.
- `counter.ts` implements a demo counter.
- `style.css` defines unrelated tokens, dark mode, decorative layout, and nested starter selectors.
- The current favicon and SVG sprite belong to the Vite starter.
- The document title is `frontend`.

No starter layout or abstraction should remain in the final code merely to reduce the diff.

### 1.4 Project-local implementation guidance

The repository includes `.agents/skills/modern-web-guidance/`.

At implementation start:

1. Run the local Modern Web Guidance search for the relevant HTML, accessibility, and responsive-layout topics when network access is available.
2. Review the bundled accessibility and CSS-layout guidance before writing production markup or CSS.
3. Prefer logical properties, intrinsic sizing, native semantics, Grid/Flexbox, and safe overflow behavior.
4. Do not add an experimental API, fallback, or dependency unless this component actually needs it.

Ordinary semantic HTML, DOM APIs, CSS Grid, Flexbox, and media queries are sufficient. Container queries, subgrid, polyfills, and animation libraries are not required.

---

## 2. Implementation decisions

### 2.1 Technology approach

Implement with:

- Semantic HTML created through TypeScript DOM APIs
- Plain TypeScript modules
- Mobile-first CSS
- CSS custom properties
- Local JSON imported at build time
- A small handwritten runtime validator
- Exact local font and SVG assets

Do not add:

- React, Vue, Angular, or another framework
- Tailwind or another CSS framework
- A runtime schema-validation package
- A component library
- A state-management library
- A router

### 2.2 Rendering approach

Use DOM construction and `textContent`, not JSON interpolation into `innerHTML`.

Reasons:

- The component is small enough for direct DOM construction.
- Imported JSON remains untrusted until runtime validation succeeds.
- `textContent` avoids an escaping helper and injection risk.
- Native element creation keeps headings, description-list markup, images, and button semantics explicit.

Do not build a generic DOM factory. Small local helpers are acceptable only when they remove obvious repetition without hiding the structure.

### 2.3 Component boundary

Expose one rendering function:

```text
renderResultsSummary(data, options?) -> HTMLElement
```

The options object contains one future integration boundary:

```text
onContinue?: () => void
```

The default page passes no callback, so Continue remains a native operable button with no navigation or destructive effect.

### 2.4 Data boundary

Treat the imported JSON value as `unknown` at the validator boundary.

Return a discriminated result:

```text
{ ok: true, data: ResultsSummaryData }
{ ok: false, issues: string[] }
```

Render only:

- A complete validated ready state, or
- A simple unavailable fallback

Never render partial score data.

### 2.5 Responsive strategy

Use one mobile-first viewport media query:

```text
below 700px   -> mobile composition
700px and up  -> two-column card
```

A viewport query is appropriate because the first release is one page containing one component and `SPEC.md` defines exact viewport checks at `699px`, `700px`, and `701px`.

Tradeoff: the component will not independently adapt when embedded in a narrower container on a wide viewport. Container-query embedding is deferred until the component has a real reuse case.

### 2.6 Wide-column strategy

Use equal tracks:

```css
grid-template-columns: repeat(2, minmax(0, 1fr));
```

Expected widths:

- At the `768px` reference: about `344px / 344px`
- At the desktop maximum: `368px / 368px`

Figma uses `338px / 348px` at tablet. Equal tracks differ by at most `6px` per side and remain within the `8px` tablet tolerance in `SPEC.md`.

Benefits:

- Simpler responsive logic
- Exact desktop symmetry
- Reliable equal-height columns
- No fractional hardcoded tracks

Downside: tablet is slightly less asymmetric than Figma and requires visual review.

### 2.7 Safe vertical centering

Use a flex page shell and automatic margins on the card at wide sizes.

- When the card and page padding fit, auto margins center it.
- When content is taller than the viewport, auto margins resolve without placing the top above the reachable viewport.
- Normal page scrolling remains available.

Do not absolutely position the card.

### 2.8 Motion strategy

Do not add transitions initially.

Immediate button state changes:

- Satisfy the interaction requirements
- Avoid trying to animate between a solid fill and gradient
- Remove unnecessary reduced-motion complexity

If a transition is introduced during refinement, it must be no longer than `150ms` and disabled or minimized for `prefers-reduced-motion`.

### 2.9 Testing strategy

Add Vitest as the only new dev dependency and use it only for the pure runtime validator.

Do not add:

- jsdom
- Testing Library
- Playwright
- A visual-regression service

Rationale:

- The closed schema has many invalid permutations.
- Validator tests directly protect the data and fallback requirements.
- Node-only tests remain small and low maintenance.

Before installation, verify Vitest compatibility with the current Vite and TypeScript versions. If compatibility cannot be achieved without unrelated stack upgrades, stop and revise this plan before continuing; do not silently drop the test gate or introduce a second toolchain.

### 2.10 Runtime asset strategy

Use:

- One copied variable TTF covering weights `500`, `700`, and `800`
- Exact copies of the four `20 × 20px` SVGs
- The supplied `32 × 32px` PNG favicon

Do not convert, subset, redraw, or recolor source assets in the first release.

The SVGs already contain their correct bright category strokes. Render them inside approximately `32 × 32px` reserved boxes without CSS filters.

Use a base-aware relative favicon URL rather than hardcoding the site root, so the document remains compatible with nested deployment paths.

---

## 3. Target file structure

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
- Set `<title>Results summary</title>`.
- Reference the copied favicon through a relative/base-aware path.
- Keep one `#app` mount node and one module entry.

#### `frontend/src/main.ts`

- Import CSS in deterministic order:
  1. `tokens.css`
  2. `base.css`
  3. `results-summary.css`
- Import raw JSON.
- Validate before rendering.
- Create exactly one `<main>`.
- Mount the complete component or fallback.
- Log validation issues only during development when practical.
- Contain bootstrap orchestration, not component markup details.

#### `results-summary.types.ts`

- Define `ScoreCategoryId` as a string union.
- Define `ScoreCategory` and `ResultsSummaryData`.
- Define validation result types where useful.
- Use `import type` under `verbatimModuleSyntax`.
- Do not use enums or namespaces because `erasableSyntaxOnly` is enabled.

#### `validate-results-summary.ts`

- Accept `unknown`.
- Validate the entire closed schema.
- Return typed success or descriptive issues.
- Never clamp, round, reorder, or fill missing values.
- Remain independent of DOM and CSS code.

#### `validate-results-summary.test.ts`

- Test valid default data.
- Test numeric boundaries.
- Test each meaningful invalid schema class.
- Use the default Node environment.

#### `category-icons.ts`

- Import four copied SVG URLs.
- Export one exhaustive `ScoreCategoryId`-to-URL mapping.
- Use `satisfies Record<ScoreCategoryId, string>` or equivalent.
- Store no labels, scores, or colors.

#### `render-results-summary.ts`

- Build the component with DOM APIs.
- Assign validated strings through `textContent`.
- Create heading and description-list semantics.
- Generate rows through one iteration path.
- Attach the optional callback only when supplied.
- Keep no global state.

#### `tokens.css`

Define semantic tokens for:

- Palette
- Accessible production colors
- Gradients
- Shadow
- Spacing
- Radii
- Typography
- Card and content maximum sizes

Use semantic names such as `--color-surface`, `--color-text-primary`, `--gradient-result`, and `--radius-card`, not the ambiguous Vite starter names.

#### `base.css`

- Define `@font-face` and `font-display: swap`.
- Apply box sizing and a minimal reset.
- Set body, `#app`, and font defaults.
- Define a robust visually-hidden utility.
- Preserve native focus behavior.
- Avoid broad resets and automatic dark mode.

#### `results-summary.css`

- Contain page-shell and component rules.
- Start with mobile styles.
- Add the primary `min-width: 700px` query.
- Define category variables through `data-category` selectors.
- Define button and forced-colors states.
- Use logical properties.
- Avoid fixed text heights and absolute primary layout.

---

## 4. Buildable implementation phases

## Phase 0 — Establish a clean baseline

### Goal

Confirm the starter builds before product changes.

### Tasks

1. Work on a focused branch such as `feat/results-summary-component`.
2. From `frontend/`, record Node and pnpm versions.
3. Run:
   - `pnpm install`
   - `pnpm build`
4. Run the current application and confirm the Vite starter loads.
5. Confirm the working tree is clean.
6. Review the relevant project-local accessibility and CSS-layout guidance.
7. Retain Figma mobile, tablet, desktop, and Active-button references.

### Verification gate

- Baseline install succeeds.
- Baseline build succeeds.
- Pre-existing warnings are recorded separately.

---

## Phase 1 — Add configuration and runtime source assets

### Goal

Prepare correct metadata, build settings, tests, and application-owned assets without breaking the still-running starter.

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

### Tasks

1. Set the document title to `Results summary`.
2. Reference the PNG favicon with a base-aware relative URL.
3. Copy the variable font and four SVGs unchanged.
4. Enable `resolveJsonModule` in `tsconfig.json`.
5. Add a `test` script.
6. Add a compatible Vitest version as a dev dependency.
7. Keep all currently imported starter files temporarily so this phase still builds.
8. Keep `docs/design/` unchanged.

### Verification gate

- `pnpm build` still succeeds.
- Runtime copies exist inside `frontend/`.
- The favicon resolves.
- No source uses a temporary Figma URL.
- Design-source assets remain unchanged.

### Acceptance criteria advanced

- AC-01
- AC-02
- AC-04 through AC-06

### Suggested commit

```text
chore: add results summary runtime assets
```

---

## Phase 2 — Implement the content model and validator

### Goal

Create one trustworthy data boundary before rendering score UI.

### Files to create

- `frontend/src/data/results.json`
- `frontend/src/results-summary/results-summary.types.ts`
- `frontend/src/results-summary/validate-results-summary.ts`
- `frontend/src/results-summary/validate-results-summary.test.ts`

### Tasks

1. Add approved data:
   - Overall `76`
   - Maximum `100`
   - Percentile `65`
   - Reaction `80`
   - Memory `92`
   - Verbal `61`
   - Visual `73`
   - Action `Continue`
2. Define the closed TypeScript model from `SPEC.md`.
3. Add focused helpers for records, strings, integers, and category order.
4. Validate:
   - Root shape
   - Required non-whitespace text
   - `maximumScore === 100`
   - Scores in `0...100`
   - Percentile in `0...100`
   - Exactly four categories
   - Exact IDs and order
   - No duplicates or unknown IDs
5. Return useful field-path issues without making the validator unnecessarily complex.
6. Do not mutate, clamp, round, normalize, or reorder input.
7. Keep the overall score independent from the category average.

### Test matrix

#### Valid

- Exact default object
- Overall score `0` and `100`
- Category score `0` and `100`
- Percentile `0` and `100`

#### Invalid root/text

- `null`
- Array or primitive root
- Missing required field
- Blank heading, rating, summary heading, action, or category label

#### Invalid numbers

- Maximum other than `100`
- Negative, over-100, decimal, `NaN`, or infinite score
- Out-of-range or decimal percentile

#### Invalid categories

- Missing or non-array categories
- Empty, three-item, or five-item array
- Duplicate or unknown ID
- Missing ID
- Correct IDs in wrong order
- Non-object category value

### Verification gate

- `pnpm test` passes.
- `pnpm build` passes.
- Tests prove invalid data is rejected rather than repaired.
- Validator has no DOM dependency.
- Types comply with `erasableSyntaxOnly` and `verbatimModuleSyntax`.

### Acceptance criteria advanced

- AC-03
- AC-07 through AC-14

### Suggested commit

```text
feat: add validated results summary data
```

---

## Phase 3 — Build semantic rendering, CSS foundations, and remove the starter

### Goal

Land one complete buildable skeleton: validated rendering, semantic markup, local font setup, CSS foundations, and removal of all obsolete Vite starter files.

### Files to create

- `frontend/src/results-summary/category-icons.ts`
- `frontend/src/results-summary/render-results-summary.ts`
- `frontend/src/styles/tokens.css`
- `frontend/src/styles/base.css`
- `frontend/src/styles/results-summary.css`

### Files to replace

- `frontend/src/main.ts`

### Files to remove after `main.ts` no longer imports them

- `frontend/src/counter.ts`
- `frontend/src/style.css`
- `frontend/src/assets/hero.png`
- `frontend/src/assets/typescript.svg`
- `frontend/src/assets/vite.svg`
- `frontend/public/icons.svg`
- `frontend/public/favicon.svg`

### 3.1 CSS foundation tasks

#### Tokens

Define semantic custom properties for:

- White and pale-blue surfaces
- Navy and lavender text
- Accessible category labels
- Pale category backgrounds
- `#5F677B` secondary score
- Result and score gradients
- Shadow
- Spacing scale
- `12px` and `32px` radii
- Pill radius
- Typography sizes and line heights
- `736px` card maximum
- `260px` result-content maximum

#### Font

1. Define one variable `@font-face` covering weights `500` through `800`.
2. Point to the copied TTF through a relative Vite-managed URL.
3. Use `font-display: swap`.
4. Provide a system sans-serif fallback.
5. Use `font-synthesis: none`.

#### Minimal reset

Include:

- Border-box sizing
- Body margin reset
- Button font inheritance
- Targeted component margin resets
- `min-inline-size: 0` where needed
- A safe visually-hidden utility

Do not:

- Enable dark mode or `color-scheme: light dark`
- Remove outlines globally
- Use a broad opinionated reset
- Rely on CSS nesting for this small component

`results-summary.css` may begin with structural hooks and shared component rules; detailed mobile and wide geometry is completed in later phases.

### 3.2 Bootstrap tasks

1. Import CSS in this order:
   1. `tokens.css`
   2. `base.css`
   3. `results-summary.css`
2. Import raw JSON.
3. Validate before rendering.
4. Locate `#app` defensively.
5. Create exactly one `<main>`.
6. Mount either the complete component or `Results are unavailable.`.
7. Log validation issues only in development when practical.
8. Do not throw an uncaught error for invalid content.

### 3.3 Ready-state DOM

Preserve this order at every width:

```text
main
└── results summary wrapper
    ├── result overview
    │   ├── h1
    │   ├── overall score
    │   ├── rating
    │   └── comparison message
    └── summary panel
        ├── h2
        ├── dl
        │   └── grouped dt + dd × 4
        └── button
```

### 3.4 Accessible scores

#### Overall score

- Keep one container in the accessibility tree.
- Hide visual number fragments with `aria-hidden="true"`.
- Add a visually hidden `76 out of 100` outside every hidden ancestor.
- Prevent duplicate announcements.

#### Category scores

- Use visible labels in `<dt>`.
- In each `<dd>`, hide visual fragments and expose a visually hidden complete value such as `80 out of 100`.
- Do not add `aria-label` to a non-interactive row.
- Do not repeat the category label in hidden text unless real assistive-technology testing demonstrates a need.

### 3.5 Icons and button

- Use one exhaustive category-to-icon map.
- Render icons with empty alt text and explicit `20 × 20px` intrinsic dimensions.
- Reserve an approximately `32 × 32px` layout box.
- Create `<button type="button">` with the validated action label.
- Attach one click listener only when a callback exists.
- Rely on native Enter and Space behavior.

### 3.6 Fallback

- Render only `Results are unavailable.` inside `<main>`.
- Render no stale headings, rows, scores, or button.
- Do not use `aria-live` for this synchronous initial state.

### Verification gate

- All new CSS is imported and processed by the build.
- Local font loads; fallback remains usable when blocked.
- One `<main>`, `<h1>`, and `<h2>` exist in the ready state.
- One `<dl>` contains four grouped `<dt>`/`<dd>` pairs.
- Rows come from one array iteration.
- Dynamic text uses `textContent`.
- Continue is a native non-submitting button.
- Accessible score phrases are coherent and not duplicated in the accessibility tree.
- Invalid data renders only the fallback.
- No starter import or obsolete starter file remains.
- `pnpm test` and `pnpm build` pass.

### Acceptance criteria advanced

- AC-04 through AC-14
- AC-32 and AC-33
- AC-40
- AC-45 through AC-53
- AC-60

### Suggested commit

```text
feat: render semantic results summary component
```

---

## Phase 4 — Implement the mobile-first composition

### Goal

Match the `375 × 809` Figma frame while remaining resilient from `320px` through `699px`.

### Page shell

- White background
- Normal document flow
- No vertical centering
- At least viewport height without clipping
- Normal scrolling on short viewports

### Result overview

- Full inline size
- Result gradient
- Square top corners
- `32px` bottom corners
- Mobile shadow on the result panel
- Default minimum height `356px`
- Centered internal content
- `260px` maximum content width
- Approximately `32px` block inset
- `24px` primary gaps
- `8px` rating-to-message gap
- `140px` score circle
- Natural growth for copy, fallback font, zoom, and text spacing

### Summary panel

Use:

```css
padding-inline: clamp(24px, 8vw, 30px);
```

Also apply:

- `24px` gap below result panel
- `24px` major internal gaps
- `16px` row gaps
- Full-width button
- Enough bottom space for focus outline and page breathing room

### Category rows

Use Grid:

```text
minmax(0, 1fr) auto
```

First track:

```text
32px icon box + 8px gap + flexible label
```

Second track:

```text
no-wrap score phrase
```

Rules:

- `min-inline-size: 0` on flexible children
- Label may wrap
- Score phrase stays on one line
- `min-block-size: 56px`, never fixed height
- Row grows under text-spacing overrides
- Icon box never collapses

Use `data-category` selectors for row background and accessible label color. The source SVG retains its own bright stroke.

### Mobile typography

- Result heading `18 / 700`
- Score `56 / 800`
- Maximum `16 / 700`
- Rating `24 / 700`
- Comparison `16 / 500`
- Summary heading `18 / 700`
- Category label `16 / 500`
- Category score `16 / 700`
- Button `18 / 700`
- Tabular numerals for scores

### Verification matrix

Test:

- `320px`
- `375 × 809`
- `480px`
- `699px`
- Short landscape height

Check:

- No horizontal scrollbar
- Full-bleed result panel
- No pale gutters around result panel
- Approximately `30px` summary gutters at `375px`
- At least `24px` gutters at `320px`
- No label/score overlap
- Soft mobile shadow
- Unclipped focus outline
- Long labels grow rows

### Acceptance criteria advanced

- AC-15 through AC-20
- AC-31
- AC-54 through AC-56
- AC-59 and AC-60

### Suggested commit

```text
style: implement mobile results summary layout
```

---

## Phase 5 — Implement tablet and desktop behavior

### Goal

Create the two-column composition at `700px` and above.

### Media query

```css
@media (min-width: 700px) { ... }
```

Apply wide typography in the same query unless visual testing proves another adjustment is necessary.

### Wide page shell

- Background `#F3F4FD`
- Approximately `32px` block padding
- Approximately `40px` inline padding
- Flex layout with card auto margins
- Safe normal-flow fallback when content is taller than the viewport

### Composite card

- `inline-size: 100%` of padded area
- `max-inline-size: 736px`
- `min-block-size: 512px`
- Two equal flexible Grid tracks
- Equal resulting column heights
- White surface
- `32px` radius
- Specified shadow
- Natural height growth
- No `overflow: hidden` or `overflow: clip` on the outer card, preserving focus visibility

### Result column

- Result gradient
- `32px` radius on all corners
- Default content centered on both axes
- `260px` content maximum
- `32px` primary gaps
- `16px` rating-to-message gap
- `200px` score circle

### Summary column

- Default content vertically centered
- Full-width internal wrapper
- Inline inset interpolating from `24px` to `40px`
- Initial candidate:

```css
padding-inline: clamp(24px, calc(20vw - 116px), 40px);
```

Expected anchors:

- `700px`: about `24px`
- `768px`: about `37.6px`, yielding about `269px` content
- Desktop maximum: `40px`, yielding `288px` content

Verify this formula in-browser. Adjust only if the three anchor results fall outside tolerance.

Use:

- `32px` major gaps
- `16px` row gaps
- Full-width button

### Wide typography

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

Confirm:

- No horizontal scrollbar
- No overlap
- No unreachable vertical jump
- Both columns fit
- Focus outline remains visible
- DOM order remains unchanged

### Reference targets

#### `768 × 1080`

- Card approximately `686–688px` wide
- Default height approximately `512px`
- Summary content approximately `269px`
- `200px` score circle
- Centered composition

#### `1440 × 1080`

- Card `736 × 512px`
- Two approximately `368px` columns
- Summary content `288px`
- Centered composition

### Acceptance criteria advanced

- AC-21 through AC-31
- AC-34
- AC-54 through AC-56

### Suggested commit

```text
style: add responsive results summary card
```

---

## Phase 6 — Complete interaction, contrast, and user preferences

### Goal

Implement all interaction states and accessibility-specific visual behavior.

### Button states

#### Default

- Navy `#303B59`
- White text
- Minimum `56px` height
- Pill shape
- Stable dimensions

#### Hover

Use a capability query such as:

```css
@media (hover: hover) { ... }
```

Apply the result gradient.

Do not require `(pointer: fine)` unless testing identifies a concrete reason; hover-capable stylus input should not be excluded unnecessarily.

#### Pressed

- Gradient on `:active`
- No scale or translation
- No border/padding change that moves content

#### Focus visible

- `3px` outline in `#1125D6`
- At least `3px` offset
- Visible with navy or gradient fill
- Coexists with hover
- Not clipped

### Forced colors

Add a focused forced-colors rule that:

- Allows system fill replacement
- Preserves a button boundary
- Uses a system focus color such as `Highlight` where needed
- Does not force the authored gradient

### Contrast validation

Measure rendered contrast for:

- White result heading
- White score
- White rating
- `#CAC9FF` comparison message at its actual gradient position
- `#CAC9FF` score maximum inside the circle
- Accessible category labels
- `#5F677B` category maximum
- White button text on navy and gradient
- Focus outline against adjacent surfaces

If either `#CAC9FF` combination fails:

1. Lighten only the affected foreground.
2. Preserve hierarchy beneath primary white text.
3. Update `DESIGN.md` and `SPEC.md` with the final value.

Do not darken the gradient solely to repair one text combination without broader visual review.

### Reduced motion

With no transition, confirm no motion occurs. Add a reduced-motion rule only if refinement introduces a transition.

### Verification gate

- Hover is capability-gated.
- Focus works alone and with hover.
- Enter and Space activate once each.
- Pressed state does not move layout.
- Forced colors preserve button and focus visibility.
- All meaningful text passes contrast.
- No focus outline is clipped.

### Acceptance criteria advanced

- AC-36 through AC-46
- AC-53
- AC-57 and AC-58

### Suggested commit

```text
style: complete accessible interaction states
```

---

## Phase 7 — Refine visual fidelity against Figma

### Goal

Tune the stable implementation against all three Figma frames.

### Process

1. Capture browser screenshots at:
   - `375 × 809`
   - `768 × 1080`
   - `1440 × 1080`
2. Compare through overlays or measured side-by-side views.
3. Review in this order:
   1. Outer composition and centering
   2. Card/panel dimensions
   3. Score-circle dimensions
   4. Major vertical spacing
   5. Summary width and row spacing
   6. Typography and line breaks
   7. Radii
   8. Gradients
   9. Shadow
   10. Icon alignment
4. Adjust tokens/shared rules before adding isolated overrides.
5. Preserve documented accessibility deviations.

### Tolerances

- General reference geometry: `±4px`
- Tablet column proportions: `±8px`
- Minor font rasterization differences are acceptable when hierarchy and content dimensions remain equivalent.

### Do not use

- Absolute positioning to force coincidence
- Fixed text heights
- Negative margins that break reflow
- Screenshot-specific magic values
- Inaccessible Figma colors
- Focus clipping to match the card silhouette

### Verification gate

- All reference frames fall within tolerance.
- Intermediate widths remain stable.
- Long-content and text-spacing tests still pass.
- Visual changes do not alter semantics or DOM order.
- Intentional differences are documented.

### Acceptance criteria advanced

- AC-15 through AC-39

---

## Phase 8 — Complete accessibility and resilience QA

### 8.1 Keyboard

- Tab to Continue.
- Confirm full focus visibility.
- Activate with Enter and Space.
- Confirm no reload, navigation, or submission without a callback.
- Confirm no unexpected focus stop.

### 8.2 Accessibility tree

Confirm:

- One main landmark
- One level-one heading
- One level-two heading
- One button named Continue
- Overall score announced once as `76 out of 100`
- Each category associated with a complete score
- Decorative icons unnamed and unfocusable
- No duplicate visual score fragments

Run a brief screen-reader smoke test when a calibrated environment is available.

### 8.3 Reflow and zoom

Test:

- `320px` viewport
- `200%` desktop zoom
- `400%` zoom from a `1280px` viewport
- Short portrait and landscape heights

Confirm:

- No horizontal page scrollbar
- No overlap or clipping
- All content reachable
- Effective widths below `700px` use the mobile composition

### 8.4 Text spacing

Apply:

- Line height `1.5`
- Paragraph spacing `2em`
- Letter spacing `0.12em`
- Word spacing `0.16em`

Confirm:

- Rows and card sections grow
- Score phrases remain distinguishable
- Button label and focus remain visible
- No clipping or overlap

### 8.5 Failure modes

#### Font failure

Block the font request and confirm fallback text remains readable without clipping.

#### Icon failure

Block one icon and confirm the reserved box, row alignment, and visible category meaning remain.

#### Invalid data

Exercise incorrect maximum, duplicate/reordered/missing categories, invalid numbers, and blank text. Confirm only the fallback renders.

### 8.6 Automated/browser audits

Run:

- `pnpm test`
- `pnpm build`
- Browser console check
- Lighthouse accessibility or axe-based browser audit where available

Automated scores are signals, not proof of usability.

### 8.7 Browser coverage

Test current versions of:

- A Chromium browser
- Firefox
- Safari when available

Pay attention to:

- Variable font loading
- Description-list accessibility
- Safe centering
- Focus outline
- Summary inset calculation
- Forced colors where supported

### Verification gate

- Every available AC-01 through AC-60 test has a recorded result.
- Environmental limitations are recorded rather than guessed.

### Suggested commit

```text
test: verify results summary acceptance criteria
```

---

## Phase 9 — Cleanup and documentation

### Goal

Leave only intentional code and accurate documentation.

### Tasks

1. Remove temporary fixtures, debug logs, measurement helpers, and comparison code.
2. Confirm no deleted starter file is referenced.
3. Confirm no temporary Figma MCP URL exists in source or build output.
4. Confirm no runtime path reaches into `docs/design/`.
5. Confirm only required dependencies remain.
6. Run final:
   - `pnpm test`
   - `pnpm build`
   - `pnpm preview`
7. Update `README.md` only where facts changed:
   - Replace screenshot after visual QA
   - Confirm technology list
   - Keep the live URL only if it still resolves
8. Record any final contrast color change in `DESIGN.md` and `SPEC.md`.
9. Mark each acceptance criterion:
   - Passed
   - Failed
   - Not testable in the available environment
10. Do not claim full cross-browser or assistive-technology verification when an environment was unavailable.

### Suggested commit

```text
docs: update results summary implementation notes
```

---

## 5. Acceptance-criteria traceability

| Area | Primary criteria |
|---|---|
| Build, configuration, and runtime assets | AC-01 through AC-06 |
| Content model and validation | AC-07 through AC-14 |
| Mobile layout | AC-15 through AC-20 |
| Breakpoint, tablet, and desktop | AC-21 through AC-31 |
| Typography, gradients, colors, and icons | AC-32 through AC-39 |
| Interaction | AC-40 through AC-46 |
| Semantics and assistive technology | AC-47 through AC-53 |
| Reflow, preferences, and failure modes | AC-54 through AC-60 |

A screenshot match alone does not complete a phase. Semantic, build, interaction, and resilience criteria must also pass.

---

## 6. Planned commit sequence

1. `chore: add results summary runtime assets`
2. `feat: add validated results summary data`
3. `feat: render semantic results summary component`
4. `style: implement mobile results summary layout`
5. `style: add responsive results summary card`
6. `style: complete accessible interaction states`
7. `test: verify results summary acceptance criteria`
8. `docs: update results summary implementation notes`

Every commit must pass `pnpm build`. Commits from Phase 2 onward must also pass `pnpm test`.

Avoid combining asset migration, validation, markup, all responsive CSS, and documentation into one change.

---

## 7. Risks and mitigations

### 7.1 Breakpoint tension

**Risk:** At `700px`, about `620px` remains after wide page gutters, producing two approximately `310px` columns.

**Mitigation:**

- Test `699px`, `700px`, and `701px` early.
- Keep result content at `260px` maximum.
- Start summary inset at `24px`.
- Keep rows intrinsic.
- Change the breakpoint only through a documented `SPEC.md` revision.

### 7.2 Tablet asymmetry

**Risk:** Equal tracks differ from Figma’s `338px / 348px` tablet split.

**Mitigation:**

- Use the documented `8px` tolerance.
- Review visual balance at `768px`.
- Avoid fractional tracks unless equal columns create a material problem.

### 7.3 Gradient-position contrast

**Risk:** `#CAC9FF` contrast varies along gradients.

**Mitigation:**

- Measure actual rendered positions in mobile and wide layouts.
- Lighten only affected text if required.
- Synchronize final values into design/spec documents.

### 7.4 Focus clipping

**Risk:** Figma’s clipped outer card treatment could hide the button outline.

**Mitigation:**

- Do not clip the outer card.
- Keep space around the button.
- Test focus at narrow wide-layout widths and while hovered.

### 7.5 Font metrics and loading

**Risk:** Variable TTF and fallback metrics may change line breaks.

**Mitigation:**

- Use `font-display: swap`.
- Use natural heights.
- Test with the font blocked.
- Tune for Hanken Grotesk while keeping fallback usable.

### 7.6 Excess abstraction

**Risk:** A small component becomes fragmented across generic layers.

**Mitigation:**

- Limit modules to types, validation, icons, rendering, bootstrap, and three CSS files.
- Do not add a component base class, template engine, store, or dependency injection.

### 7.7 Unsafe markup

**Risk:** JSON interpolated into `innerHTML` creates escaping and injection concerns.

**Mitigation:**

- Use DOM APIs.
- Assign content through `textContent`.
- Validate before rendering.

### 7.8 Description-list variation

**Risk:** Assistive technologies may announce grouped `<dt>`/`<dd>` content differently.

**Mitigation:**

- Keep valid simple markup.
- Expose complete hidden score text in `<dd>`.
- Inspect the accessibility tree and smoke-test a screen reader.
- Avoid unnecessary ARIA.

### 7.9 Test compatibility

**Risk:** Vitest may not align with current Vite/TypeScript versions.

**Mitigation:**

- Verify compatibility before installation.
- Keep tests Node-only.
- Do not upgrade the app stack only for tests.
- Stop and revise the plan if the required `pnpm test` gate cannot be implemented cleanly.

### 7.10 Figma overfitting

**Risk:** Optimizing only the three screenshots breaks intermediate widths or accessibility settings.

**Mitigation:**

- Use intrinsic Grid/Flexbox.
- Test intermediate widths after visual changes.
- Prefer token/shared-rule changes.
- Treat `512px` and `56px` as defaults/minimums, not clipping constraints.

### 7.11 Deployment-path assets

**Risk:** Root-absolute favicon or asset paths work on Vercel root deployment but fail on a nested GitHub Pages path.

**Mitigation:**

- Use Vite-managed imports for application assets.
- Use a relative/base-aware favicon URL.
- Verify the production preview and deployed base before finalizing README links.

---

## 8. Explicit tradeoffs

### Equal columns instead of exact tablet tracks

Accepted for simplicity and resilience. Desktop is exact; tablet remains within tolerance.

### Media query instead of container query

Accepted for the current viewport-defined single-page use case.

### Variable TTF instead of three static files

Accepted to cover all required weights in one supplied asset without a conversion pipeline.

### DOM APIs instead of a framework

Accepted because the component has limited state and one interaction.

### Handwritten validator instead of a schema library

Accepted because the schema is small and closed; tests protect the failure paths.

### Limited automated testing

Validation is automated. Visual, responsive, keyboard, screen-reader, and preference behavior remains browser-tested because a full browser stack would be disproportionate.

### No animation

Accepted because Figma does not require motion and immediate state changes reduce complexity.

---

## 9. Definition of done

Implementation is complete only when:

- Starter UI and obsolete starter assets are removed.
- Runtime assets live inside `frontend/`.
- Local JSON is imported and runtime-validated.
- Invalid data renders only the fallback.
- Ready content is generated from validated data.
- Correct headings, description-list semantics, and native button are present.
- Screen readers receive coherent non-duplicated scores.
- Mobile, tablet, and desktop references meet tolerance.
- The `700px` switch is stable at `699px`, `700px`, and `701px`.
- No horizontal page scrolling occurs at `320px` or high zoom.
- Text-spacing overrides cause growth rather than clipping.
- Hover, pressed, focus, forced-colors, and keyboard behavior pass.
- Meaningful text passes contrast at actual rendered positions.
- Font and icon failures remain usable.
- `pnpm test` passes.
- `pnpm build` passes.
- Production preview has no missing assets or console errors.
- No temporary Figma URL or `docs/design/` runtime dependency remains.
- All 60 acceptance criteria have recorded outcomes.

---

## 10. Deferred work

Do not include without revising the specification:

- Continue destination
- Success state
- Disabled/loading button
- Async fetching
- Backend integration
- Authentication or persistence
- Score editing
- Multiple result cards
- Arbitrary maximum scales
- Additional categories
- Animated score counting
- Dark theme
- Full localization
- Right-to-left layout
- Container-query embedding
- Automated visual regression
- Font conversion or subsetting
