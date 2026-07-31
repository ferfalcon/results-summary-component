# Phase 8 Task — Refine Visual Fidelity Against Figma

## Decision

Tune the stable, accessible implementation against the three Figma reference frames only after semantic structure, responsive behavior, and interaction states are complete.

Visual refinement must improve shared tokens and resilient layout rules. It must not introduce screenshot-specific hacks that break intermediate widths, zoom, content expansion, focus visibility, or documented accessibility corrections.

## Objective

At completion:

- Browser captures at `375 × 809`, `768 × 1080`, and `1440 × 1080` closely match Figma.
- General reference geometry is within `±4px` where browser/font rendering permits.
- Tablet column proportions remain within the documented `±8px` tolerance.
- Typography, spacing, radii, gradients, shadow, and icon alignment are reviewed in a controlled order.
- Intermediate widths and expanded-content behavior remain stable after refinement.
- Accessibility corrections remain intentional and documented.
- `pnpm test` and `pnpm build` pass.

## Prerequisites

Phase 7 is complete:

- Mobile and wide layouts are stable.
- Button states are complete.
- Meaningful contrast has been verified.
- Any color changes are already reflected in documentation.

## Read before editing

- `PLAN.md` Phase 8
- `DESIGN.md` in full
- `SPEC.md` responsive and acceptance-criteria sections
- `REVIEW.md`
- Figma mobile, tablet, and desktop frames
- Local design JPGs as secondary references
- Current CSS token and component files

## Primary files that may change

```text
frontend/src/styles/tokens.css
frontend/src/styles/results-summary.css
frontend/src/styles/base.css, only for verified font/reset issues
```

Documentation may change only when an intentional implementation decision changes a normative value:

```text
DESIGN.md
SPEC.md
REVIEW.md
```

## Out of scope

Do not:

- Redesign the component
- Change content values
- Change DOM order or semantics
- Add new product states
- Add animation
- Revert accessibility colors to match Figma
- Add absolute positioning for primary layout
- Use fixed text heights
- Use negative margins to force one screenshot
- Add one-off rules that apply only to a single exact viewport
- Add automated visual-regression tooling

## Reference setup

### Required browser captures

Capture the implementation at exactly:

```text
375 × 809
768 × 1080
1440 × 1080
```

Before each capture:

- Use 100% browser zoom.
- Confirm Hanken Grotesk has loaded.
- Disable browser extensions that alter page rendering.
- Use the approved default JSON.
- Ensure no focus ring is visible unless comparing focus.
- Ensure the browser viewport—not the outer window—is the target size.

### Required Figma references

Use the exact Figma frames:

```text
Mobile:  20143:3
Tablet:  20143:62
Desktop: 20143:182
```

Figma is the geometry source. `DESIGN.md` and `SPEC.md` define intentional production differences.

## Comparison method

Use one or both:

- Side-by-side comparison with measured browser developer tools
- Semi-transparent overlay in Figma or an image editor

Do not rely on visual memory.

Keep temporary captures and overlay files outside committed source, or remove them before Phase 10.

## Review order

Always review and correct in this order so later detail changes do not hide structural errors.

### 1. Outer composition

Check:

- Page background
- Top alignment on mobile
- Safe centering on wide layouts
- Card maximum width
- Mobile full-bleed behavior
- Page gutters
- Overall vertical placement

Do not tune internal typography while the outer card is incorrectly placed.

### 2. Main panel dimensions

Check:

- Mobile result panel default height
- Wide card default height
- Wide column widths
- Result and summary section proportions
- Natural height behavior

### 3. Score circle

Check:

```text
Mobile: 140 × 140px
Wide:   200 × 200px
```

Also verify:

- Circle centering
- Gradient direction
- Internal score alignment
- Visual relationship between score and `of 100`

### 4. Major vertical spacing

Check:

- Result heading to circle
- Circle to feedback
- Rating to comparison message
- Summary heading to list
- List to button
- Mobile result-to-summary gap
- Category row gaps

Prefer correcting shared gap tokens or container rules.

### 5. Summary widths and row geometry

Check:

- Mobile summary gutters
- Tablet summary content width
- Desktop summary content width
- Row minimum height
- Row radii
- Leading and trailing insets
- Icon box and score alignment

### 6. Typography

Check:

- Font family actually rendered
- Weight 500 versus 700 versus 800
- Font sizes
- Line heights
- Line wrapping
- Text alignment
- Tabular numeral behavior

Do not compensate for a font-loading failure with spacing hacks.

### 7. Radii

Check:

```text
Mobile result bottom corners: 32px
Wide result all corners:      32px
Wide outer card:              32px
Rows:                         12px
Button:                       pill
Score circle:                 circular
```

### 8. Gradients

Check:

- Result gradient direction and endpoints
- Score gradient direction and transparency
- Hover/pressed button gradient

Preserve any contrast correction already completed.

### 9. Shadow

Check:

```text
0 30px 60px rgb(61 108 236 / 15%)
```

Verify:

- Mobile shadow belongs to the result panel.
- Wide shadow belongs to the shared card.
- Shadow remains soft.
- Shadow does not introduce horizontal scrolling.

### 10. Icon alignment

Check:

- Exact local assets
- 20px intrinsic icon inside 32px box
- Vertical centering
- Icon-to-label 8px gap
- No CSS-filter distortion

## Reference target checklist

### Mobile — 375 × 809

Target:

```text
Result width:             375px
Result default height:    about 356px
Score circle:             140px
Result-to-summary gap:    24px
Summary width:            about 315px
Summary gutters:          about 30px
Row minimum height:       56px
Row gap:                  16px
Button minimum height:    56px
Default content endpoint: about 779px
```

Check that the remaining approximately 30px is viewport context, not internal component padding hidden in the wrong section.

### Tablet — 768 × 1080

Target:

```text
Card width:            about 686–688px
Card default height:   about 512px
Equal code columns:    about 344px each
Figma column tolerance: within 8px of intended balance
Summary content width: about 269px
Score circle:          200px
Page gutters:          about 40px
```

### Desktop — 1440 × 1080

Target:

```text
Card:                  736 × about 512px
Columns:               about 368px each
Summary content width: 288px
Score circle:          200px
Card:                  centered
```

## Adjustment rules

### Prefer shared corrections

When multiple elements are wrong by the same amount, adjust:

- Token
- Parent gap
- Shared inset
- Grid/flex alignment
- Font loading or weight

Do not add several child-specific offsets.

### Keep formulas explainable

When the summary inset formula changes:

- Preserve the 700px, 768px, and desktop anchors.
- Keep the simplest maintainable formula.
- Add or update a short CSS comment.

### Preserve natural growth

Every visual adjustment must survive:

- Longer text
- Text-spacing overrides
- Fallback font
- 320px width
- Short viewport height

### Document intentional deviations

Known intentional deviations include:

- Accessible result heading color
- Accessible category label colors
- Solid category maximum color
- Equal code columns at tablet within tolerance
- Separate focus ring not shown in original Figma

Do not “fix” these back to the original inaccessible or brittle state.

## Intermediate-width regression matrix

After every meaningful visual adjustment, test:

```text
320px
480px
699px
700px
701px
820px
1024px
```

Confirm:

- No horizontal overflow
- No overlap
- Stable breakpoint transition
- No awkward summary inset jump
- No unexpectedly stretched mobile content
- No focus clipping

## Content and accessibility regression checks

Re-run at least:

- Long category label
- Score `100`
- Longer comparison message
- Font blocked
- Keyboard focus visible
- Text-spacing override smoke test

Restore approved content after testing.

## Tolerance and judgment rules

### Acceptable

- Up to `±4px` reference geometry differences caused by browser/font rendering
- Tablet column distribution within `±8px`
- Minor antialiasing differences
- Documented accessible color differences

### Not acceptable

- Different information hierarchy
- Wrong score-circle size
- Wrong breakpoint composition
- Fixed-height clipping
- Horizontal scrollbar
- Incorrect font or weight
- Missing local icon
- Focus clipping
- Hidden or duplicated content
- Magic values that work only at one exact viewport

## Commands

From `frontend/`:

```bash
pnpm test
pnpm build
pnpm dev
```

After refinement:

```bash
git diff -- src/styles
git status --short
```

Search for brittle techniques:

```bash
rg -n "position:\s*absolute|margin-(top|left|right|bottom):\s*-|block-size:\s*(356|512|56)px|overflow:\s*(hidden|clip)" src/styles
```

Review findings contextually. Absolute positioning inside decorative score fragments may be acceptable only when it is not primary layout and remains resilient.

## Review log

Keep a temporary refinement log:

```text
Viewport:
Observed difference:
Root cause:
Shared rule changed:
Regression widths retested:
Accessibility impact:
```

Remove temporary notes before final cleanup or summarize meaningful decisions in `IMPLEMENTATION.md`.

## Stop conditions

Stop and reassess when:

- A screenshot match requires absolute primary layout.
- Several negative margins are accumulating.
- One viewport improves while intermediate widths break.
- Accessibility colors or focus visibility are being sacrificed.
- Fixed heights are introduced to hold text.
- The font is not loading but CSS is being tuned around fallback metrics.
- A normative value changes without a documentation update.

## Verification checklist

- [ ] Captures were made at all three exact reference viewports.
- [ ] Figma frames were used, not visual memory alone.
- [ ] Outer composition was reviewed first.
- [ ] Mobile and wide panel dimensions are within tolerance.
- [ ] Score circles are exact target sizes.
- [ ] Major spacing matches visual intent.
- [ ] Mobile, tablet, and desktop summary widths are within tolerance.
- [ ] Typography family, size, weight, and line height were checked.
- [ ] Radii match the design.
- [ ] Gradients match the design.
- [ ] Shadow matches and does not overflow horizontally.
- [ ] Icons are exact and aligned.
- [ ] Accessibility deviations remain intact.
- [ ] Intermediate widths were retested.
- [ ] Long-content and fallback-font tests still pass.
- [ ] Focus remains visible.
- [ ] No brittle screenshot-only hack was added.
- [ ] `pnpm test` passes.
- [ ] `pnpm build` passes.

## Acceptance criteria advanced

- AC-15 through AC-39 — final mobile, responsive, typography, color, gradient, and asset fidelity

Phase 9 performs the final systematic acceptance pass across AC-01 through AC-60.

## Deliverable

A visually polished implementation matching the Figma references within documented tolerance while retaining resilient layout and accessibility behavior.

## Commit guidance

When this phase changes code, use a focused optional commit:

```text
style: refine results summary fidelity
```

Do not mix temporary screenshots or overlay files into the commit.

## Handoff to Phase 9

Phase 9 treats the refined implementation as a release candidate. It must record pass, fail, or unavailable status rather than making untracked assumptions.