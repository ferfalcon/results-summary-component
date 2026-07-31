# Phase 5 Task — Implement the Mobile-First Composition

## Decision

Make the stacked mobile composition the default CSS behavior from `320px` through `699px`, matching the `375 × 809` Figma frame while preserving natural growth, reflow, and accessible focus.

Mobile is not a stacked desktop card. It uses a full-width result panel, square top corners, rounded bottom corners, a separate summary section, and normal top-to-bottom page flow.

## Objective

At completion:

- The page matches the mobile Figma composition at `375 × 809` within documented tolerance.
- The result panel is full width and begins at the top of the page.
- The result panel’s default content fits approximately `356px` high without a fixed clipping height.
- The score circle is `140px`.
- The summary has approximately `30px` side gutters at `375px` and at least `24px` at `320px`.
- Category rows remain readable and grow when labels or text spacing require it.
- The page has no horizontal scrollbar from `320px` through `699px`.
- Mobile shadow overflow is diagnosed rather than hidden indiscriminately.
- `pnpm test` and `pnpm build` continue to pass.

## Prerequisites

Phase 4 is complete:

- The real component is mounted.
- CSS tokens, base styles, and component selectors exist.
- Starter code is removed.
- Semantic output and fallback behavior are stable.

## Read before editing

- `PLAN.md` Phase 5
- `DESIGN.md` mobile layout, spacing, typography, color, and guardrail sections
- `SPEC.md` sections 4.2, 4.4, 6.6, 6.7, and 7
- Figma mobile frame `20143:3`
- `docs/design/mobile-design.jpg`
- Current `frontend/src/styles/results-summary.css`
- Current `frontend/src/styles/tokens.css`

## Primary file to update

```text
frontend/src/styles/results-summary.css
```

Update `tokens.css` only when a missing reusable approved value is discovered. Do not duplicate an existing token under a second name.

## Out of scope

Do not:

- Add the `700px` wide layout yet
- Add final hover, pressed, focus-ring, or forced-colors polish
- Change DOM order
- Change the content model or JSON values
- Add a mobile-only duplicate component
- Use absolute positioning for primary layout
- Set fixed heights on text containers
- Hide overflow globally before identifying its source
- Change accessibility colors back to Figma’s failing label values

## Mobile reference targets

At `375 × 809`:

```text
Result panel width:          375px
Result panel default height: approximately 356px
Score circle:                140 × 140px
Gap to summary:              24px
Summary content width:       approximately 315px
Summary side gutters:        approximately 30px
Category row minimum height: 56px
Category row gap:            16px
Button minimum height:       56px
Designed content endpoint:   approximately 779px
Remaining viewport space:    approximately 30px of context
```

General geometry tolerance is `±4px` after the local font has loaded.

## Task A — Configure the mobile page shell

The mobile page shell must:

- Use a white background.
- Begin content at the top of the viewport.
- Use normal document flow.
- Avoid vertical centering.
- Use at least `100svh` without forcing a fixed viewport height.
- Permit normal vertical scrolling.
- Provide bottom breathing room equivalent to approximately `24–30px`.

Do not place pale blue gutters around the result panel.

A suitable structure is:

```text
main.page-shell
└── .results-summary
```

The page shell may provide bottom padding, but the result panel itself must touch the top and both inline edges.

## Task B — Implement the full-width result overview

### Required geometry

Set `.result-overview` to:

- Fill the available inline size.
- Use the approved result gradient.
- Use square top corners.
- Use `32px` bottom-left and bottom-right radii.
- Use the approved soft shadow.
- Use a default `min-block-size` of `356px`.
- Center its content horizontally and vertically.
- Allow height growth.

Do not set `block-size: 356px`.

### Critical vertical-spacing rule

The Figma panel uses centered content, not explicit `32px` top and bottom padding added to the complete content height.

Implement the approximately `32px` free space by centering the content inside the `356px` minimum height. Do not combine:

```text
min-height: 356px
+ padding-block: 32px
+ the full content height
```

That combination would force the default panel taller than the Figma reference.

Small defensive block padding is acceptable only when it does not invalidate the `356px` default target and still permits growth.

### Internal content

Set the result content wrapper to:

- `inline-size: min(100%, 260px)` or equivalent
- Centered text
- Vertical flex layout
- `24px` gap between:
  - Result heading
  - Score circle
  - Feedback group

Inside the feedback group, use an `8px` gap between rating and comparison message.

### Score circle

Set `.score-display` to:

- `140px` inline and block size
- Circular shape
- Approved score gradient
- Centered visual score content
- Non-shrinking dimensions

Keep the hidden accessible phrase from influencing layout.

### Mobile result typography

Apply:

```text
Result heading:     18px / 1.3 / 700 / white production color
Score:              56px / 1 / 800 / white
Maximum score:      16px / 1.3 / 700 / #CAC9FF pending rendered verification
Rating:             24px / 1.3 / 700 / white
Comparison message: 16px / 1.3 / 500 / #CAC9FF pending rendered verification
```

Use white for `Your Result`, following the documented accessibility correction rather than the original lavender Figma value.

## Task C — Implement the mobile summary section

### Outer spacing

Place the summary panel `24px` after the result panel.

Use fluid inline gutters equivalent to:

```css
padding-inline: clamp(24px, 8vw, 30px);
```

Expected behavior:

- At `320px`: approximately `25.6px`, never less than 24px
- At `375px`: 30px
- At wider mobile widths: capped at 30px

The summary content fills the available width inside these gutters.

### Summary flow

Use a vertical layout with:

- `24px` between heading, category list, and button
- `16px` between category rows
- Full-width button

Do not wrap the mobile result and summary sections in a shared visible white card.

### Mobile summary typography

Apply:

```text
Summary heading: 18px / 1.3 / 700
Category label:  16px / 1.3 / 500
Category score:  16px / 1.3 / 700
Button:          18px / 1.3 / 700
```

Use tabular numerals for all score values when supported:

```css
font-variant-numeric: tabular-nums;
```

## Task D — Implement resilient category rows

### Row layout

Use a two-track grid equivalent to:

```css
grid-template-columns: minmax(0, 1fr) auto;
```

The first track contains the topic group. The second contains the score phrase.

### Topic group

Use a horizontal flex layout containing:

- `32px` reserved icon box
- `8px` gap
- Flexible visible label

Requirements:

- Icon box does not shrink.
- Topic group has `min-inline-size: 0`.
- Label can wrap when necessary.
- Missing icon does not collapse the reserved box.

The source icon is `20 × 20px` centered within the `32 × 32px` box.

### Score phrase

The visual score area must:

- Remain on one line.
- Align to the trailing edge.
- Use an `8px` gap between achieved score and `/ 100`.
- Use primary navy for achieved score.
- Use solid `#5F677B` for slash and maximum.
- Never use reduced opacity for meaningful maximum-score text.

### Row dimensions

Use:

- `min-block-size: 56px`
- `12px` radius
- `8px` leading inset
- `16px` trailing inset

Do not use a fixed `56px` block size. Rows must grow for:

- Wrapped labels
- Increased text size
- WCAG text-spacing overrides
- Fallback font metrics

### Category presentation

Use the existing `data-category` selectors to apply:

```text
Reaction: pale red background + accessible dark red label
Memory:   pale yellow background + accessible dark amber label
Verbal:   pale green background + accessible dark green label
Visual:   pale blue background + blue label
```

The SVGs retain their brighter embedded strokes.

## Task E — Complete the mobile button geometry

For `.continue-button`:

- Fill the summary content width.
- Use at least `56px` block size.
- Use pill radius.
- Keep `16px` inline text padding.
- Center the label.
- Keep sufficient surrounding space so the current native focus indication is not clipped.

Interaction-state polish is Phase 7. Do not remove native focus in this phase.

## Task F — Diagnose horizontal shadow overflow

The result panel’s shadow may contribute visual overflow.

### Initial rule

Implement the correct full-width geometry without horizontal clipping first.

### Measurement

At each test width, inspect:

```js
document.documentElement.scrollWidth
document.documentElement.clientWidth
```

Expected: values are equal.

### When horizontal scrolling exists

1. Inspect row, label, score, and width calculations first.
2. Temporarily disable the result shadow.
3. Recheck scroll width.
4. Only when the shadow alone is the cause, add the narrowest page-shell-level horizontal clipping solution.

Preferred behavior:

- Clip horizontal visual overflow only.
- Preserve vertical shadow.
- Preserve the button focus outline.
- Do not clip internal content.

Do not use `overflow-x: hidden` or `clip` to conceal a genuine layout defect.

## Verification matrix

### Viewport widths

Test at least:

```text
320px
375 × 809
480px
699px
```

Also test one short landscape viewport, such as approximately `667 × 375` while still below the wide breakpoint.

### At 375 × 809

Confirm:

- Result panel begins at y=0.
- Result panel spans the viewport width.
- Top corners are square.
- Bottom corners are 32px.
- Default result panel is approximately 356px high.
- Score circle is 140px.
- Summary begins approximately 24px below the panel.
- Summary side gutters are approximately 30px.
- Category rows are at least 56px high.
- Button is at least 56px high.
- Overall content endpoint is visually close to 779px.

### At 320px

Confirm:

- No horizontal scrolling.
- Summary gutters remain at least 24px.
- Category labels and scores do not overlap.
- Three-digit `100` fits.
- Button label remains visible.

### At 480px and 699px

Confirm:

- Mobile composition remains stacked.
- Result panel remains full width.
- Summary content does not stretch awkwardly because its inline padding caps at 30px.
- No desktop card shell appears early.

### Short viewport

Confirm:

- Page scrolls normally.
- The top of the result panel remains reachable.
- No vertical centering hides content.

## Content-expansion checks

Temporarily test locally with:

- A longer category label
- A longer rating
- A longer comparison message
- Score `100`

Confirm:

- Result panel grows beyond 356px when required.
- Rows grow beyond 56px when required.
- Score phrase remains on one line.
- No content clips or overlaps.

Restore approved JSON before committing.

## Commands

From `frontend/`:

```bash
pnpm test
pnpm build
pnpm dev
```

After browser testing, inspect:

```bash
git status --short
git diff -- src/styles/results-summary.css src/styles/tokens.css
```

## Stop conditions

Stop and correct before completing when:

- The panel uses a fixed 356px height and clips expanded content.
- Explicit vertical padding forces the default result panel outside tolerance.
- Mobile is implemented as a shared rounded outer card.
- Category rows use fixed height.
- Score phrases wrap under approved content.
- Horizontal clipping hides a real layout bug.
- DOM order is changed for visual convenience.
- Accessibility colors are reverted to failing Figma values.

## Verification checklist

- [ ] Mobile is the default composition below 700px.
- [ ] Page background is white.
- [ ] Content starts at the top.
- [ ] Result panel is full width.
- [ ] Result panel top corners are square.
- [ ] Result panel bottom corners are 32px.
- [ ] Result panel uses the approved shadow.
- [ ] Default panel is approximately 356px high at 375px.
- [ ] Panel can grow naturally.
- [ ] Result content maximum width is 260px.
- [ ] Score circle is 140px.
- [ ] Mobile typography matches the specification.
- [ ] Summary gap is 24px.
- [ ] Summary gutters are approximately 30px at 375px.
- [ ] Summary gutters are at least 24px at 320px.
- [ ] Rows use a two-track resilient grid.
- [ ] Icon box remains 32px and non-shrinking.
- [ ] Score phrase stays on one line.
- [ ] Rows use minimum, not fixed, 56px height.
- [ ] `/ 100` uses solid #5F677B.
- [ ] Button fills the summary width.
- [ ] No horizontal page scrollbar exists.
- [ ] Shadow overflow was measured rather than guessed.
- [ ] Long content causes growth, not clipping.
- [ ] `pnpm test` passes.
- [ ] `pnpm build` passes.

## Acceptance criteria advanced

- AC-15 through AC-20 — mobile visual and responsive behavior
- AC-31 — content taller than reference heights expands naturally
- AC-54 through AC-56 — reflow and growth foundations
- AC-59 — missing icon preserves meaning and row structure
- AC-60 — fallback font remains usable

Final accessibility and failure-mode verification occurs in Phase 9.

## Deliverable

A faithful, fluid, accessible mobile-first Results Summary layout from `320px` through `699px`.

## Suggested commit

```text
style: implement mobile results summary layout
```

## Handoff to Phase 6

Phase 6 will add the wide card inside one `min-width: 700px` media query. It must override presentation only; it must not duplicate markup or alter the mobile DOM order.