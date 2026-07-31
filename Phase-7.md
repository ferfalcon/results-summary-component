# Phase 7 Task — Complete Interaction, Contrast, and User-Preference Behavior

## Decision

Add the complete button state model and verify all meaningful foreground/background combinations after the responsive layout is stable.

Accessibility corrections documented in `DESIGN.md` and `SPEC.md` override the original failing Figma text colors. Interaction styling must not change layout dimensions or invent product behavior.

## Objective

At completion:

- Continue has correct default, hover, pressed, and focus-visible treatments.
- Hover is applied only on hover-capable devices.
- Focus uses a separate visible `3px` ring with at least `3px` offset.
- Pressed and hover states do not move or resize the button.
- Forced-colors mode preserves a recognizable button and focus indicator.
- No animation is introduced unless it is optional, short, and reduced-motion safe.
- All meaningful text meets contrast at its actual rendered position.
- Any required contrast correction is synchronized into `DESIGN.md` and `SPEC.md`.
- `pnpm test` and `pnpm build` pass.

## Prerequisites

Phase 6 is complete:

- Mobile and wide geometry are stable.
- Continue is a native `type="button"`.
- The outer card does not clip overflow.
- The current page renders approved data at all breakpoints.

## Read before editing

- `PLAN.md` Phase 7
- `DESIGN.md` sections 6, 9, 10, and 11
- `SPEC.md` sections 3.4, 5.3 through 5.7, and 6.4 through 6.8
- Figma Active button variant
- `docs/design/active-states.jpg`
- Current component CSS

## Primary file to update

```text
frontend/src/styles/results-summary.css
```

Potential documentation updates only when rendered verification changes a normative color:

```text
DESIGN.md
SPEC.md
REVIEW.md, only when rationale needs clarification
```

## Out of scope

Do not:

- Add navigation or Continue success behavior
- Add disabled or loading states
- Add a click-scale animation
- Add layout-changing borders or padding in interaction states
- Require hover for operation or understanding
- Replace native button keyboard behavior
- Hide focus outlines globally
- Force authored gradients in forced-colors mode
- Revert accessible category label colors to Figma originals

## Required button-state contract

### Default

Use:

```text
Background:     #303B59
Text:           #FFFFFF
Minimum height: 56px
Shape:          pill
```

The button remains full width within the summary panel.

### Hover

On devices that report hover capability:

- Replace the navy fill with the approved result gradient.
- Preserve dimensions.
- Preserve white text.
- Reveal no required information.

Gate with a capability query equivalent to:

```css
@media (hover: hover) {
  .continue-button:hover { ... }
}
```

Do not require `(pointer: fine)` unless a verified input problem demands it. Hover-capable stylus input should not be excluded without reason.

### Pressed

For `:active`:

- Retain the gradient treatment.
- Preserve padding, border dimensions, and size.
- Do not translate or scale.
- Do not move surrounding content.

The pressed state may coexist with focus.

### Focus visible

For `:focus-visible` in normal color modes:

```text
Outline width:  3px
Outline style:  solid
Outline color:  #1125D6
Outline offset: at least 3px
```

Requirements:

- Fully visible against white and pale blue surrounding surfaces.
- Visible over both navy and gradient button fills.
- Able to coexist with hover and pressed states.
- Not clipped by summary, card, or page overflow.
- Browser focus must remain available when `:focus-visible` is unsupported or custom styling fails.

Do not apply `outline: none` outside the custom focus-visible rule.

## Task A — Implement the CSS state cascade

Order rules so the cascade is predictable:

1. Default button
2. Hover capability query
3. Active state
4. Focus-visible state
5. Forced-colors overrides
6. Optional reduced-motion override only when motion exists

Check combined states:

- Hover + focus-visible
- Active + focus-visible
- Keyboard focus without hover
- Pointer hover without focus-visible

Do not rely on source-order accidents that cause focus to disappear when hover applies.

## Task B — Implement forced-colors behavior

Add a focused query:

```css
@media (forced-colors: active) { ... }
```

Goals:

- Allow system colors to replace gradients and fills.
- Keep button boundary recognizable.
- Keep focus visible.
- Avoid forcing inaccessible authored colors.

A suitable approach may include:

- System border such as `ButtonText`
- System text/fill defaults
- Focus outline using `Highlight`
- `forced-color-adjust: auto`

Do not set `forced-color-adjust: none` on the entire button merely to preserve brand colors.

Test in an available forced-colors emulator or Windows High Contrast environment. When unavailable, record that limitation for Phase 9 rather than claiming success.

## Task C — Decide motion explicitly

The approved default is no transition.

### Preferred implementation

Use immediate state changes and add no transition declaration.

### When a transition is introduced during refinement

It must:

- Be optional
- Be no longer than `150ms`
- Affect only non-layout visual properties
- Not communicate the state exclusively through motion
- Be disabled or minimized under:

```css
@media (prefers-reduced-motion: reduce)
```

Do not animate size, transform, or position.

## Task D — Verify documented production colors

Confirm the rendered implementation uses:

```text
Result heading:          #FFFFFF
Reaction label:          #C93838
Memory label:            #8A5A00
Verbal label:            #007A5E
Visual label:            #1125D6
Achieved category score: #303B59
Category / 100:          #5F677B at solid opacity
```

The brighter Figma icon strokes remain unchanged because the visible labels carry the meaning.

Search for accidental opacity rules on meaningful score text. Remove any Figma-like 50% opacity from `/ 100`.

## Task E — Measure meaningful text contrast

### Required combinations

Verify at actual rendered positions:

- White `Your Result` over the result gradient
- White overall score over the score gradient
- White rating over the result gradient
- `#CAC9FF` comparison message over its result-gradient position
- `#CAC9FF` `of 100` over its score-gradient position
- Each accessible category label over its row background
- `#303B59` achieved scores over each row background
- `#5F677B` `/ 100` over each row background
- White button text over navy
- White button text over the top and bottom of the hover gradient
- Focus outline against adjacent page/card surfaces

### Thresholds

- Normal meaningful text: at least `4.5:1`
- Large meaningful text: at least `3:1`
- Meaningful non-text and focus indication: at least `3:1` against adjacent colors

### Gradient-specific method

Do not rely only on a scanner that evaluates one CSS endpoint.

For text over gradients:

1. Render the exact mobile and wide states.
2. Sample the background color behind representative text pixels or use a tool that evaluates the rendered location.
3. Calculate contrast with the actual foreground.
4. Test both mobile and wide positions when vertical placement differs.
5. Record the measured value and viewport.

### When `#CAC9FF` fails

1. Lighten only the affected foreground.
2. Keep it visually subordinate to primary white text.
3. Recheck both mobile and wide positions.
4. Update the production value in:
   - `DESIGN.md`
   - `SPEC.md`
   - CSS token
5. Add a short rationale to `REVIEW.md` only when the existing review no longer explains the change.

Do not darken the result gradient solely to repair one text combination without reviewing the full visual system.

## Task F — Verify native activation behavior

With no callback supplied by the default application:

- `Tab` reaches Continue.
- `Enter` activates native button behavior without reload or navigation.
- `Space` activates native button behavior without reload or navigation.
- No fake toast, success message, or redirect appears.

When testing the optional callback locally, use an uncommitted temporary integration or browser console technique and confirm one callback invocation per native activation.

Restore the default no-callback bootstrap before commit.

## Viewport/state matrix

Test button states at:

```text
375px mobile
700px breakpoint
768px tablet
1440px desktop
```

At each applicable size, test:

```text
Default
Hover
Pressed
Keyboard focus
Hover + keyboard focus
```

Confirm no state changes:

- Button height
- Button width
- Text position
- Summary panel height
- Card geometry

## Commands

From `frontend/`:

```bash
pnpm test
pnpm build
pnpm dev
```

Search for risky styles:

```bash
rg -n "outline:\s*none|opacity:\s*0\.5|opacity:\s*50%|transform:|scale\(" src/styles
```

Review each result rather than deleting blindly.

## Stop conditions

Stop and correct before completion when:

- Focus disappears under hover.
- The focus outline is clipped.
- Pressed state moves layout.
- Hover styling applies as required behavior on touch-only devices.
- Forced-colors rules preserve brand gradient at the expense of visibility.
- Meaningful `/ 100` text uses opacity.
- Gradient contrast is assumed rather than measured.
- A required color correction is made only in CSS and not in source documentation.
- Continue gains invented product behavior.

## Verification checklist

- [ ] Default button uses navy and white.
- [ ] Hover is gated by `(hover: hover)`.
- [ ] Hover uses the result gradient.
- [ ] Active retains gradient feedback.
- [ ] Hover and active do not change dimensions.
- [ ] Focus-visible uses a 3px blue outline.
- [ ] Focus offset is at least 3px.
- [ ] Focus remains visible while hovered.
- [ ] Focus is not clipped.
- [ ] Forced-colors behavior preserves boundary and focus.
- [ ] No transition exists, or reduced motion is respected.
- [ ] Result heading is white.
- [ ] Category labels use accessible production colors.
- [ ] `/ 100` uses solid #5F677B.
- [ ] All meaningful text combinations were measured.
- [ ] Gradient-position contrast was measured in rendered layouts.
- [ ] Any final color change is synchronized into documentation.
- [ ] Enter and Space use native button activation.
- [ ] Default action causes no reload, navigation, or fake success.
- [ ] `pnpm test` passes.
- [ ] `pnpm build` passes.

## Acceptance criteria advanced

- AC-36 through AC-39 — accessible production colors and rendered contrast
- AC-40 through AC-46 — button semantics and interaction behavior
- AC-53 — accessible button name and native semantics
- AC-57 — reduced-motion requirement when motion exists
- AC-58 — forced-colors visibility

## Deliverable

A fully styled, keyboard-visible, capability-aware Continue control and verified accessible color system across mobile and wide layouts.

## Suggested commit

```text
style: complete accessible interaction states
```

When contrast verification changes normative documentation, include those documentation updates in the same focused commit or a directly adjacent documentation commit.

## Handoff to Phase 8

Phase 8 may refine visual measurements only after preserving every accessibility correction and combined interaction state completed here.