# Phase 3 Task — Build the Semantic Renderer as an Isolated Module

## Decision

Create the complete Results Summary DOM renderer as a standalone TypeScript module before integrating it into the page or replacing the Vite starter.

This phase isolates semantic structure and data-to-DOM behavior from CSS foundations, bootstrap logic, and starter cleanup. The new renderer may be type-checked without being mounted yet.

## Objective

At completion:

- A renderer accepts one validated `ResultsSummaryData` object.
- Category icons are mapped exhaustively from category IDs.
- The renderer creates the required headings, score content, description list, and native button.
- Visible content is assigned through `textContent`.
- Overall and category scores expose coherent, non-duplicated accessible phrases.
- Category rows are generated through one iteration path.
- An optional Continue callback is the only integration boundary.
- The module has no page bootstrap, fallback, CSS import, or global state.
- `pnpm test` and `pnpm build` pass while the Vite starter remains mounted.

## Prerequisites

Phase 2 is complete:

- `results.json` exists.
- Runtime validation passes.
- `ResultsSummaryData` and `ScoreCategoryId` exist.
- `SCORE_CATEGORY_IDS` is the single category-order source.
- Runtime icon files exist from Phase 1.

## Read before editing

- `PLAN.md` Phase 3
- `SPEC.md` sections 2.3 through 2.7 and 6.1 through 6.5
- `frontend/src/results-summary/results-summary.model.ts`
- `frontend/src/results-summary/validate-results-summary.ts`
- All four runtime SVG files

## Files to create

```text
frontend/src/results-summary/category-icons.ts
frontend/src/results-summary/render-results-summary.ts
```

## Out of scope

Do not:

- Replace or import from `main.ts`
- Create the invalid-data fallback
- Create CSS files
- Import page-level CSS
- Remove starter files
- Add a DOM test framework
- Add click behavior when no callback is supplied
- Add navigation, toast, success, loading, or disabled behavior
- Use `innerHTML` for content values
- Add ARIA roles to ordinary grouping containers
- Split this small renderer into a generic component framework

## Stable class contract

The renderer should assign a small, explicit class structure for later CSS. Use consistent names equivalent to:

```text
results-summary
result-overview
result-overview__heading
score-display
score-display__visual
score-display__score
score-display__maximum
result-feedback
result-feedback__rating
result-feedback__message
summary-panel
summary-panel__heading
score-list
score-item
score-item__topic
score-item__icon-box
score-item__icon
score-item__label
score-item__value
score-item__achieved
score-item__maximum
continue-button
visually-hidden
```

Minor naming differences are acceptable only when they remain equally clear and are used consistently. Do not encode layout state such as `mobile` or `desktop` in the DOM class names.

## Required renderer API

Export a function equivalent to:

```text
renderResultsSummary(
  data: ResultsSummaryData,
  options?: { onContinue?: () => void },
): HTMLElement
```

Rules:

- `data` is already validated.
- Return one root element.
- Do not validate again inside the renderer.
- Do not retain references in module-level mutable state.
- Add a click listener only when `onContinue` is a function.
- One native activation must invoke the callback once.

## Category icon mapping task

Create `category-icons.ts`.

### Imports

Import the four runtime SVGs as Vite asset URLs from:

```text
frontend/src/assets/icons/
```

### Mapping

Export one exhaustive record keyed by `ScoreCategoryId`:

```text
reaction -> icon-reaction.svg
memory   -> icon-memory.svg
verbal   -> icon-verbal.svg
visual   -> icon-visual.svg
```

Use a compile-time exhaustive check such as:

```ts
satisfies Record<ScoreCategoryId, string>
```

Do not store:

- Labels
- Scores
- Row backgrounds
- Accessible label colors
- Maximum score

Those belong to data or CSS.

## Required DOM structure

The renderer root must contain this order:

```text
.results-summary
├── .result-overview
│   ├── h1.result-overview__heading
│   ├── .score-display
│   │   ├── visual score content
│   │   └── visually hidden complete score
│   └── .result-feedback
│       ├── rating
│       └── comparison message
└── .summary-panel
    ├── h2.summary-panel__heading
    ├── dl.score-list
    │   └── div.score-item × 4
    │       ├── dt
    │       └── dd
    └── button.continue-button
```

This DOM order remains unchanged at all breakpoints.

## Step-by-step renderer task

### 1. Create the root

Create a neutral container element for `.results-summary`.

Do not use `<main>` here. The page shell owns the single main landmark in Phase 4.

### 2. Create the result overview

Create `.result-overview` containing:

- `<h1>` from `data.resultHeading`
- Score display from `data.score` and `data.maximumScore`
- Rating from `data.rating`
- Comparison sentence derived from `data.percentile`

The comparison sentence must be generated as:

```text
You scored higher than {percentile}% of the people who have taken these tests.
```

Do not store or duplicate the complete sentence in JSON.

### 3. Implement accessible overall score output

The visible score consists of separate visual fragments, but assistive technology must receive one phrase.

Recommended structure:

```text
.score-display
├── .score-display__visual [aria-hidden=true]
│   ├── visual score
│   └── visual “of 100”
└── .visually-hidden
    └── “76 out of 100”
```

Requirements:

- The hidden phrase must not be inside an `aria-hidden="true"` ancestor.
- The visual fragments must not also be announced.
- Do not place an `aria-label` on a generic non-interactive container when hidden ordinary text provides the phrase.
- Generate the phrase from data rather than hardcoding 76.

### 4. Create result feedback

Create a feedback container containing:

- Rating text
- Comparison message

Use ordinary text elements. Do not add live-region behavior.

### 5. Create the summary panel

Create:

- `<h2>` from `data.summaryHeading`
- One `<dl>` for all category scores
- One native button after the list

Do not create separate lists per category.

### 6. Generate category rows through one iteration

Iterate over `data.categories` exactly once to build rows.

Each row is a grouping `<div>` inside `<dl>`. It must receive:

- `.score-item`
- `data-category` equal to the validated category ID

Do not add `role="group"`, `role="listitem"`, or another unnecessary role.

### 7. Create the category term

Each `<dt>` contains a topic wrapper with:

- Reserved icon box
- Decorative `<img>`
- Visible category label

Icon requirements:

- `src` comes from the exhaustive icon map.
- `alt=""`.
- Explicit `width="20"` and `height="20"` or equivalent DOM properties.
- The image is not focusable.
- The surrounding icon box reserves approximately `32 × 32px` later through CSS.

The visible label is always present, so icon failure cannot remove meaning.

### 8. Create the category definition

Each `<dd>` contains:

- Visual score fragments hidden from assistive technology
- A visually hidden complete phrase such as `80 out of 100`

Recommended structure:

```text
dd.score-item__value
├── span.score-item__visual [aria-hidden=true]
│   ├── achieved score
│   └── / 100
└── span.visually-hidden
    └── 80 out of 100
```

Do not repeat the category label in the hidden `<dd>` phrase unless later real screen-reader testing shows the `<dt>`/`<dd>` association is insufficient.

### 9. Create Continue

Create:

```html
<button type="button">Continue</button>
```

The visible label comes from `data.actionLabel`.

Rules:

- Explicitly set `type="button"`.
- Do not add custom keyboard handlers.
- Do not disable the button when callback is absent.
- Do not navigate, submit, reload, or show a fake result.
- When `options.onContinue` exists, attach one `click` listener that calls it once.

### 10. Return the root

Return only the `.results-summary` element.

The renderer must not append directly to `document.body` or `#app`.

## DOM construction rules

- Use `document.createElement`.
- Use `classList` or `className` consistently.
- Use `textContent` for all user-visible strings.
- Attribute values from validated enum-like IDs may use `dataset`.
- Do not interpolate content into `innerHTML`.
- Avoid a generic create-element factory unless direct code becomes genuinely repetitive and the helper remains transparent.
- Keep helper functions local and behavior-specific, such as `createScoreItem`.

## TypeScript rules

- Use `import type` for type-only imports under `verbatimModuleSyntax`.
- Do not use path aliases.
- Do not use enums or namespaces.
- Avoid non-null assertions when a clearer construction path exists.
- Keep callback option typing narrow.
- Keep the module compatible with the strict compiler settings.

## Verification task

### Build and validator tests

From `frontend/`:

```bash
pnpm test
pnpm build
```

The renderer is not mounted yet, but TypeScript must validate it.

### Static review

Confirm through code review:

- One renderer root is returned.
- One `<h1>` and one `<h2>` are created.
- One `<dl>` is created.
- Four rows arise from one iteration path.
- Every row contains one `<dt>` and one `<dd>`.
- Icons use empty alt text.
- Button type is `button`.
- No content value reaches `innerHTML`.
- No CSS or bootstrap module is imported.
- No fallback is rendered here.
- Category mapping is exhaustive.

### Temporary browser inspection is optional

Do not permanently modify `main.ts` merely to inspect the renderer. When a temporary local mount is used for debugging:

- Keep it uncommitted.
- Restore `main.ts` before completing the phase.
- Confirm `git diff` contains only the two intended new modules.

## Guardrails

- The renderer accepts validated data only.
- Validation remains a separate responsibility.
- The page shell owns `<main>`.
- CSS owns category colors and layout.
- JSON owns visible labels and scores.
- The icon map owns only ID-to-asset relationships.
- Do not introduce framework-like abstractions.
- Do not invent Continue behavior.

## Verification checklist

- [ ] `category-icons.ts` imports all four runtime icons.
- [ ] Icon mapping is exhaustive by `ScoreCategoryId`.
- [ ] Renderer accepts `ResultsSummaryData`.
- [ ] Renderer returns one root element.
- [ ] DOM order matches the specification.
- [ ] Result heading is an `<h1>`.
- [ ] Summary heading is an `<h2>`.
- [ ] Categories use one `<dl>`.
- [ ] Each row uses a grouping `<div>` with `<dt>` and `<dd>`.
- [ ] Grouping divs have no unnecessary ARIA role.
- [ ] Overall score is exposed once as a complete phrase.
- [ ] Category scores are exposed as complete phrases.
- [ ] Visual fragments do not duplicate announcements.
- [ ] Icons are decorative and unfocusable.
- [ ] Continue is a native `type="button"`.
- [ ] Callback is optional and attached once.
- [ ] No fake action outcome exists.
- [ ] Dynamic content uses `textContent`.
- [ ] Renderer imports no CSS or bootstrap module.
- [ ] `pnpm test` passes.
- [ ] `pnpm build` passes.

## Acceptance criteria advanced

- AC-07 through AC-13 — approved validated content is renderable
- AC-40 — native non-submitting button structure
- AC-45 — native keyboard activation is preserved
- AC-46 — optional callback boundary and safe no-callback behavior
- AC-47 through AC-53 — headings, description list, coherent scores, decorative icons, and button semantics

Full browser verification occurs after integration in Phase 4 and QA in Phase 9.

## Deliverable

A focused, type-checked semantic renderer and exhaustive icon mapping ready for page integration.

## Suggested commit

```text
feat: add semantic results summary renderer
```

## Handoff to Phase 4

Phase 4 will:

- Import this renderer into `main.ts`.
- Choose ready versus fallback state after validation.
- Create the single `<main>`.
- Add CSS tokens, reset, and foundational styling.
- Remove the Vite starter only after the new bootstrap is complete.