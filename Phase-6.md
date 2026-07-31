# Phase 6 Task — Implement Tablet and Desktop Behavior

## Decision

Switch to one centered two-column card at `700px` and above using a single explicit media query, equal flexible columns, fluid page gutters, and safe vertical centering.

The wide layout changes presentation only. It must preserve the mobile DOM order and continue to expand naturally when content, zoom, or text-spacing settings require more height.

## Objective

At completion:

- `699px` remains the stacked mobile composition.
- `700px` and above use the two-column card.
- The transition is stable at `699px`, `700px`, and `701px`.
- At `768 × 1080`, the card is approximately `686–688px × 512px` with approximately `269px` summary content.
- At `1440 × 1080`, the card is `736 × 512px` with two approximately `368px` columns and `288px` summary content.
- Wide content is safely centered when it fits and remains reachable when it does not.
- The score circle is `200px` and wide typography matches the specification.
- No outer-card clipping hides focus or content.
- `pnpm test` and `pnpm build` pass.

## Prerequisites

Phase 5 is complete:

- Mobile layout is stable from `320px` through `699px`.
- No horizontal overflow exists.
- Mobile styles are the base cascade.
- DOM and semantic output are not changing.

## Read before editing

- `PLAN.md` Phase 6
- `DESIGN.md` desktop and tablet layout sections
- `SPEC.md` sections 4.3 and 4.4
- Figma tablet frame `20143:62`
- Figma desktop frame `20143:182`
- Current `results-summary.css`

## Primary file to update

```text
frontend/src/styles/results-summary.css
```

Update `tokens.css` only for a genuinely reusable missing value. Keep `700px` explicit in the media query.

## Out of scope

Do not:

- Change the `700px` breakpoint without revising `SPEC.md`
- Add container queries
- Add a second wide breakpoint merely to force one screenshot
- Duplicate markup for tablet or desktop
- Reorder content visually with CSS `order`
- Use absolute positioning to center the card
- Clip the outer card
- Add final button interaction states
- Revert mobile behavior

## Task A — Add the explicit wide media query

Add one primary query:

```css
/* SPEC.md: wide composition begins at 700px */
@media (min-width: 700px) {
  /* wide overrides */
}
```

Do not define `700px` as an ordinary CSS custom property and attempt to consume it in the media-query condition.

Keep wide typography and layout overrides together unless later evidence clearly justifies a separate rule.

## Task B — Configure the wide page shell

At `700px` and above, the page shell must:

- Use `#F3F4FD` background.
- Use at least `100svh`.
- Use flex layout.
- Permit normal vertical scrolling.
- Safely center the card with automatic margins.

Use fluid page padding equivalent to:

```css
padding-block: 32px;
padding-inline: clamp(32px, 5.25vw, 40px);
```

Expected behavior:

- Near `700px`, gutters are fluid and below the 40px maximum.
- At `768px`, gutters reach approximately 40px.
- At large desktop widths, gutters remain 40px while the card stops growing at 736px.

### Safe-centering requirement

A suitable pattern is:

```text
wide page shell: display flex
card: margin auto
```

Verify that when the card plus padding exceeds viewport height, block-axis auto margins do not make the card top unreachable.

Do not use:

- `position: absolute`
- `top: 50%` plus transform
- A fixed viewport height
- Overflow clipping on the page shell that prevents scrolling

## Task C — Create the composite wide card

At `700px` and above, `.results-summary` must become the visible shared card.

Required properties:

```text
inline size:        100% of the padded page area
maximum inline:     736px
minimum block size: 512px
layout:             two-column CSS Grid
tracks:             repeat(2, minmax(0, 1fr))
background:         #FFFFFF
corner radius:      32px
shadow:             approved card shadow
```

### Height behavior

- Use `min-block-size: 512px`, not fixed `block-size`.
- Grid columns stretch to the same resulting height.
- Expanded content grows both the card and relevant column.

### Overflow behavior

Do not apply `overflow: hidden` or `overflow: clip` to the outer card.

Reason:

- The Continue focus outline must remain visible.
- Expanded content must remain reachable.

The result column has its own radius, so outer clipping is not needed to produce the visual silhouette.

## Task D — Configure the wide result column

At wide sizes, `.result-overview` must:

- Occupy the first grid column.
- Use the approved result gradient.
- Use `32px` radius on all four corners.
- Stretch to the card’s full resulting height.
- Center default content horizontally and vertically.
- Retain `260px` maximum content width.
- Use a `200px` score circle.
- Use `32px` main gaps.
- Use `16px` rating-to-message gap.
- Preserve natural content growth.

Override the mobile-only square top-corner treatment.

## Task E — Configure the wide summary column

At wide sizes, `.summary-panel` must:

- Occupy the second grid column.
- Stretch to the card’s height.
- Center its default content vertically.
- Use one full-width internal wrapper.
- Use `32px` between heading, list, and button.
- Keep `16px` between category rows.
- Keep the button full width.

### Summary inline inset

Start with:

```css
padding-inline: clamp(24px, calc(20vw - 116px), 40px);
```

Add a short CSS comment explaining the intended anchors:

```text
700px viewport  -> 24px inset
768px viewport  -> about 37.6px inset
large desktop   -> 40px inset
```

Treat this formula as a measured implementation starting point.

Do not preserve it merely because it appears in the plan when browser measurement does not meet the required anchors. Adjust the simplest shared rule after measuring.

### Expected content widths

At `768px`:

- Viewport padding: approximately 40px each side
- Card width: approximately 688px
- Equal column: approximately 344px
- Summary content: approximately 269px

At desktop maximum:

- Column width: 368px
- Summary inset: 40px each side
- Summary content: 288px

## Task F — Apply wide typography

Within the same wide query, use:

```text
Result heading:     24px / 1.3 / 700
Score:              72px / 1 / 800
Maximum score:      18px / 1.3 / 700
Rating:             32px / 1.3 / 700
Comparison message: 18px / 1.3 / 500
Summary heading:    24px / 1.3 / 700
Category label:     18px / 1.3 / 500
Category score:     18px / 1.3 / 700
Button:             18px / 1.3 / 700
```

Continue using tabular numerals.

Do not use fluid typography between mobile and wide sizes unless the specification is revised.

## Task G — Verify the breakpoint boundary first

Before detailed tablet and desktop tuning, test:

```text
699px
700px
701px
```

At `699px`:

- White mobile page background
- Full-width stacked result panel
- Separate summary section

At `700px` and `701px`:

- Pale page background
- Shared white two-column card
- Wide score circle and typography

At all three:

- No horizontal scrollbar
- No overlap
- No unreachable vertical jump
- DOM order unchanged
- Button remains reachable
- Focus indication is not clipped

Inspect:

```js
document.documentElement.scrollWidth === document.documentElement.clientWidth
```

## Task H — Verify tablet reference

Set viewport to `768 × 1080` after Hanken Grotesk has loaded.

Target:

```text
Card width:           approximately 686–688px
Card default height:  approximately 512px
Column widths:        approximately 344px each
Summary content:      approximately 269px
Score circle:         200px
Card position:        horizontally and vertically centered
Page gutters:         approximately 40px
```

The equal columns intentionally differ slightly from Figma’s `338px / 348px` split. The difference must remain within the documented `8px` tablet tolerance and preserve visual balance.

## Task I — Verify desktop reference

Set viewport to `1440 × 1080`.

Target:

```text
Card:                 736 × approximately 512px
Columns:              approximately 368px each
Summary content:      288px
Score circle:         200px
Card position:        centered
Page background:      #F3F4FD
Card radius:          32px
Card shadow:          approved shadow
```

The card must not grow wider than 736px at larger viewport widths.

## Task J — Test intermediate and height-constrained layouts

Also test:

```text
720px
820px
1024px
1440px with a short height
```

Confirm:

- Summary inset changes smoothly.
- No sudden content compression occurs beyond the required 700px switch.
- Equal columns remain stable.
- Short viewports scroll normally.
- The card top remains reachable.

## Content-expansion checks

Temporarily test longer text and text-spacing conditions.

Confirm:

- Card grows beyond 512px.
- Both columns retain equal resulting height.
- Result and summary content stay vertically sensible.
- No focus outline is clipped.
- Page scrolls when needed.

Restore approved data before commit.

## Commands

From `frontend/`:

```bash
pnpm test
pnpm build
pnpm dev
```

Inspect the CSS diff:

```bash
git diff -- src/styles/results-summary.css src/styles/tokens.css
```

## Stop conditions

Stop and correct before completion when:

- The `700px` layout overlaps or horizontally scrolls.
- Tablet fidelity requires hardcoded fractional column tracks without first testing equal tracks.
- The card uses fixed height and clips expanded content.
- Safe centering makes the card top unreachable.
- Outer overflow clipping hides focus.
- A second markup tree is introduced for wide layout.
- CSS order changes visual order relative to DOM order.
- The breakpoint is moved without updating `SPEC.md`.

## Verification checklist

- [ ] One explicit `min-width: 700px` query controls wide composition.
- [ ] 699px remains mobile.
- [ ] 700px and 701px are stable two-column layouts.
- [ ] Wide page background is #F3F4FD.
- [ ] Wide page gutters are fluid and capped at 40px.
- [ ] Card uses safe auto-margin centering.
- [ ] Card maximum width is 736px.
- [ ] Card minimum height is 512px.
- [ ] Card can grow naturally.
- [ ] Card uses equal flexible grid tracks.
- [ ] Outer card does not clip overflow.
- [ ] Result column has 32px radius on all corners.
- [ ] Score circle is 200px.
- [ ] Summary inset meets tablet and desktop anchors.
- [ ] Wide typography matches the specification.
- [ ] 768px card width is approximately 686–688px.
- [ ] 768px summary content is approximately 269px.
- [ ] 1440px card is 736px wide.
- [ ] 1440px columns are approximately 368px.
- [ ] 1440px summary content is 288px.
- [ ] Short viewports remain scrollable and reachable.
- [ ] No horizontal scrollbar exists.
- [ ] DOM order remains unchanged.
- [ ] `pnpm test` passes.
- [ ] `pnpm build` passes.

## Acceptance criteria advanced

- AC-21 through AC-31 — breakpoint, tablet, desktop, maximum width, and growth
- AC-34 — wide result and score gradients remain applied
- AC-54 through AC-56 — responsive reflow and natural growth

## Deliverable

A resilient two-column tablet/desktop card at `700px` and above, accurately anchored to the `768px` and `1440px` Figma references.

## Suggested commit

```text
style: add responsive results summary card
```

## Handoff to Phase 7

Phase 7 must add interaction and accessibility-specific visual states without changing the responsive geometry established here.