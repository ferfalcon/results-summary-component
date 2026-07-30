# Design Definition — Results Summary Component

## Document status

This document captures the visual and UX definition of the Results Summary component. It is based primarily on the Figma file and guides specification, implementation planning, and visual review.

The Figma file is the visual source of truth for the original design. `SPEC.md` records the production decisions needed where Figma is incomplete, ambiguous, or not WCAG-compliant. Accessibility corrections documented here and in `SPEC.md` intentionally override the affected Figma colors or states.

This document describes design intent. Functional requirements and testable behavior belong in `SPEC.md`.

### Design sources

- Figma page: `🧪 Results summary`
- Figma sections: `Main page`, `Components`, and `Style Guide`
- Reference frames:
  - Mobile: `375 × 809`
  - Tablet: `768 × 1080`
  - Desktop: `1440 × 1080`
- Source design assets: `docs/design/`
- Typeface: Hanken Grotesk

---

## 1. Purpose

The component presents an overall assessment result and a supporting category-by-category breakdown in a compact, reassuring interface.

Its UX goals are to:

- Make the overall score immediately understandable.
- Communicate the qualitative meaning of the result.
- Let users compare individual category scores without scanning a dense table.
- Provide one clear next action.
- Preserve the same content hierarchy across mobile, tablet, and desktop.
- Remain usable and legible throughout the responsive range, not only at the three Figma reference widths.

The experience is informational rather than analytical. The gradient result panel is the emotional focal point; the summary list provides the factual detail.

---

## 2. Visual anatomy

The page contains one Results Summary composition with two conceptual regions.

### 2.1 Page canvas

On tablet and desktop, the component sits centered in a pale blue page canvas. The surrounding empty space is intentional and gives the card a focused, presentation-like quality.

On mobile, the composition begins at the top of the page and uses a white page background. The result panel becomes full width and is no longer contained by a shared outer card.

### 2.2 Results composition

The composition contains:

1. **Result overview**
2. **Summary panel**

On tablet and desktop, both regions form one horizontal card. On mobile, they become vertically stacked sections with different outer treatments.

### 2.3 Result overview

The result overview is the primary visual region and contains:

1. “Your Result” heading
2. Circular score display
   - Current score: `76`
   - Maximum score: `of 100`
3. Qualitative rating: “Great”
4. Supporting comparison message:
   - “You scored higher than 65% of the people who have taken these tests.”

The result overview uses a vertical purple-to-blue gradient, centered text, and a second translucent gradient inside the circular score display.

The overall score is the strongest visual element. The rating is the secondary emphasis. The comparison message is supporting content and should not compete with the score.

### 2.4 Summary panel

The summary panel contains:

1. Heading: “Summary”
2. Four category rows
   - Reaction — `80 / 100`
   - Memory — `92 / 100`
   - Verbal — `61 / 100`
   - Visual — `73 / 100`
3. Primary action button

Each category row contains:

- A category-specific icon
- A visible category label
- The achieved value
- A visually secondary `/ 100` maximum

The rows share the same structure, minimum height, radius, and spacing. Category identity is reinforced by icon and color, never by color alone.

### 2.5 Primary action

The button is a full-width pill within the summary panel.

The Figma screen instances display the placeholder `Label`, while the text layer is named `Continue`. The production copy is resolved as **Continue**.

The Figma button component includes:

- Default: navy background
- Active: purple-to-blue result gradient

The production mapping is resolved as:

- Resting state: navy
- Hover state: gradient on hover-capable devices
- Pressed state: gradient
- Keyboard focus: separate visible focus ring that can coexist with either fill

---

## 3. Layout structure

### 3.1 Desktop reference

| Property | Value |
|---|---:|
| Reference viewport | `1440 × 1080` |
| Composite card | `736 × 512` |
| Result column | `368 × 512` |
| Summary column | `368 × 512` |
| Summary content width | `288` |
| Card radius | `32` |
| Page position | Horizontally and vertically centered |

The desktop composition is symmetrical at the column level. The summary content has approximately `40px` of inline space on both sides.

The outer white card receives the shadow. The result panel occupies the full left column and has a `32px` radius on all corners.

### 3.2 Tablet reference

| Property | Value |
|---|---:|
| Reference viewport | `768 × 1080` |
| Composite card | `686 × 512` |
| Result column | `338 × 512` |
| Summary column | `348 × 512` |
| Summary content width | approximately `269` |
| Horizontal page margin | `41` |
| Card radius | `32` |
| Page position | Horizontally and vertically centered |

The tablet layout retains the horizontal composition. It compresses both columns while preserving the result panel height, score circle size, typography, row height, and button height.

The fractional summary width in Figma is a resizing artifact, not a production token. Implementation should preserve the visual proportions without reproducing values such as `268.717px`.

### 3.3 Mobile reference

| Property | Value |
|---|---:|
| Reference viewport | `375 × 809` |
| Result section | `375 × 356` |
| Summary section width | `315` |
| Summary side margins | `30` |
| Gap between result and summary | `24` |
| Total designed content height | `779` |

The mobile composition differs structurally from tablet and desktop:

- It starts at the top of the viewport.
- The result panel spans the full viewport width.
- The result panel has square top corners and `32px` bottom corners.
- The result panel receives the soft blue shadow.
- The summary is not enclosed in a shared outer card.
- The score circle and typography scale down.
- The page background is white.
- The action remains full width inside the summary section.

This mobile behavior is not simply the desktop card with a different flex direction.

---

## 4. Responsive behavior

### 4.1 General behavior

The component must work from at least `320px` wide through large desktop screens.

The three Figma frames are reference snapshots, not hard viewport contracts. Layout should interpolate cleanly between them.

The implementation breakpoint is resolved in `SPEC.md` at `700px`:

- Below `700px`: mobile composition
- At `700px` and above: tablet/desktop card composition

This breakpoint is an implementation decision derived from the space required by the two columns; it is not an explicit Figma token.

### 4.2 Narrow screens

At narrow widths:

- The result and summary sections stack vertically.
- The result section remains full bleed.
- The summary section uses fluid side gutters and fills the available width.
- Text wraps naturally without clipping.
- Category labels and values remain readable without overlapping.
- Score phrases remain aligned to the trailing edge.
- The button fills the summary content width.
- The component uses natural document flow rather than vertical centering.
- The page scrolls normally on short viewports.

At `375px`, the summary width is `315px`, equivalent to `30px` side margins. At `320px`, the margins reduce fluidly but remain at least `24px`.

### 4.3 Wide screens

At `700px` and above:

- The component becomes a two-column white card.
- The card is safely centered when it fits in the viewport.
- Both sections use `512px` as the default visual height.
- Both columns stretch to the same resulting height.
- The result and summary content are centered within their columns for the default content.
- The result section stays visually dominant.
- The composite card never exceeds `736px`.
- The pale blue page background is visible around the card.
- The card and page expand and scroll when content no longer fits the reference height.

### 4.4 Height and overflow

The Figma desktop and tablet cards use a fixed `512px` reference height. That height works for the supplied English content, but production must tolerate:

- Browser zoom
- User text enlargement
- WCAG text-spacing overrides
- Moderate English copy expansion
- Unexpected wrapping
- Font fallback

Content must not be clipped to preserve the reference height. The reference height is a default target, not a maximum.

---

## 5. Typography

### 5.1 Typeface

- Family: `Hanken Grotesk`
- Required weights:
  - `500` — Medium
  - `700` — Bold
  - `800` — ExtraBold
- Letter spacing: `0`
- Local repository font files are the source assets.
- Production should use a local runtime copy and a system sans-serif fallback.
- Text must remain visible during font loading.

### 5.2 Type styles

| Design style | Size | Line height | Weight | Primary use |
|---|---:|---:|---:|---|
| Display Large | `72px` | `100%` | `800` | Score on tablet and desktop |
| Display Medium | `56px` | `100%` | `800` | Score on mobile |
| Heading Large | `32px` | `130%` | `700` | “Great” on tablet and desktop |
| Heading Medium | `24px` | `130%` | `700` | Wide headings; mobile “Great” |
| Body Large Strong | `18px` | `130%` | `700` | Wide labels, values, and button |
| Body Large Default | `18px` | `130%` | `500` | Wide supporting copy and labels |
| Body Medium Strong | `16px` | `130%` | `700` | Mobile values and maximum score |
| Body Medium Default | `16px` | `130%` | `500` | Mobile supporting copy and labels |

### 5.3 Responsive type mapping

| Element | Mobile | Tablet/Desktop |
|---|---|---|
| “Your Result” | `18px / 700` | `24px / 700` |
| Score | `56px / 800` | `72px / 800` |
| “of 100” | `16px / 700` | `18px / 700` |
| Rating | `24px / 700` | `32px / 700` |
| Comparison message | `16px / 500` | `18px / 500` |
| “Summary” | `18px / 700` | `24px / 700` |
| Category label | `16px / 500` | `18px / 500` |
| Category score | `16px / 700` | `18px / 700` |
| Button label | `18px / 700` | `18px / 700` |

Scores should use tabular numerals when available so changing values do not create distracting width shifts.

---

## 6. Colors

### 6.1 Figma palette

| Role | Figma token | Value |
|---|---|---|
| Surface | `colors/white` | `#FFFFFF` |
| Page background | `colors/blue/50` | `#F3F4FD` |
| Primary dark text and button | `colors/navy/950` | `#303B59` |
| Result supporting text | `colors/navy/200` | `#CAC9FF` |
| Reaction background | `colors/red/50` | `#FFF6F6` |
| Reaction accent | `colors/red/400` | `#FF5555` |
| Memory background | `colors/yellow/50` | `#FFFBF4` |
| Memory accent | `colors/yellow/400` | `#FFB21E` |
| Verbal background | `colors/green/50` | `#F2FCF9` |
| Verbal accent | `colors/green/500` | `#00BB8F` |
| Visual background | `colors/blue/50` | `#F3F4FD` |
| Visual accent | `colors/blue/800` | `#1125D6` |

### 6.2 Production accessibility colors

The following intentional deviations preserve the design’s category identity while meeting normal-text contrast requirements:

| Role | Production value |
|---|---|
| Result heading | `#FFFFFF` |
| Reaction label | `#C93838` |
| Memory label | `#8A5A00` |
| Verbal label | `#007A5E` |
| Visual label | `#1125D6` |
| Achieved category score | `#303B59` |
| Category slash and maximum | `#5F677B` at solid opacity |

The brighter Figma category colors remain on decorative icons. The `/ 100` category text must not use Figma’s 50%-opacity navy because it does not meet the required contrast.

### 6.3 Result gradient

```css
linear-gradient(180deg, #7755ff 0%, #2f2ce9 100%)
```

### 6.4 Score gradient

```css
linear-gradient(180deg, #4d21c9 0%, rgb(37 33 201 / 0%) 100%)
```

### 6.5 Shadow

```css
box-shadow: 0 30px 60px rgb(61 108 236 / 15%);
```

The shadow belongs to:

- The composite white card on tablet and desktop
- The full-width result panel on mobile

It should remain soft and low contrast.

### 6.6 Remaining contrast verification

The comparison message and score maximum use `#CAC9FF` over gradient backgrounds. Their exact rendered positions must be checked in the browser because contrast changes along the gradient.

If either rendered combination falls below the required ratio, the foreground must be lightened without changing layout or hierarchy.

---

## 7. Spacing

### 7.1 Figma spacing scale

| Token | Value |
|---|---:|
| `spacing/0` | `0px` |
| `spacing/100` | `8px` |
| `spacing/200` | `16px` |
| `spacing/300` | `24px` |
| `spacing/400` | `32px` |
| `spacing/500` | `40px` |
| `spacing/600` | `48px` |
| `spacing/700` | `56px` |
| `spacing/800` | `64px` |
| `spacing/900` | `72px` |
| `spacing/1000` | `80px` |

The design follows an 8px base rhythm.

### 7.2 Key component spacing

- Icon to category label: `8px`
- Achieved score to `/ 100`: `8px`
- Gap between category rows: `16px`
- Result content gap on mobile: `24px`
- Mobile rating-to-message gap: `8px`
- Summary major gap on mobile: `24px`
- Summary major gap on tablet/desktop: `32px`
- Result major gap on tablet/desktop: `32px`
- Summary inline inset: approximately `40px` at desktop maximum
- Mobile summary side inset at `375px`: `30px`
- Minimum mobile side inset: `24px`
- Row leading inset: `8px`
- Row trailing inset: `16px`
- Button inline inset: `16px`

### 7.3 Visual anchor dimensions

- Category row minimum height: `56px`
- Button minimum height: `56px`
- Category row radius: `12px`
- Main card/result radius: `32px`
- Button radius: pill shape (`128px` in Figma)
- Desktop/tablet score circle: `200px`
- Mobile score circle: `140px`

These values define the design’s rhythm and silhouette. Content containers must grow if required by text or accessibility settings.

---

## 8. Imagery and icons

The interface contains no photography or illustration. Its identity comes from typography, gradients, color, and four category icons.

### 8.1 Category icons

- Reaction — lightning bolt
- Memory — brain
- Verbal — speech bubble
- Visual — eye

The exact source SVGs are available in `docs/design/images/`.

### 8.2 Icon treatment

- Icons sit inside an approximately `32 × 32px` reserved layout box.
- The visible glyphs are smaller and centered inside that box.
- Each icon uses its bright Figma category accent.
- Icons support the visible label rather than replacing it.
- Icons should use exact copies of the provided SVG assets.
- Icons are decorative for assistive technology.
- Missing icons must not remove category meaning or collapse row spacing.

The design-source files under `docs/design/` should be copied into the application’s runtime asset area during implementation rather than referenced as temporary Figma URLs.

---

## 9. Interaction states

### 9.1 Default

- Background: `#303B59`
- Text: white
- Minimum height: `56px`
- Shape: pill
- Label: `Continue`

### 9.2 Hover

On hover-capable devices:

- Background changes to the result gradient.
- Dimensions and layout remain unchanged.
- Hover reveals no required information.

### 9.3 Pressed

- The gradient remains visible during activation.
- No scale or translation is required.
- The state must not move surrounding content.

### 9.4 Keyboard focus

- Use a visible `3px` outline in `#1125D6`.
- Use at least `3px` outline offset.
- The ring must remain visible with either navy or gradient fill.
- Focus and hover may coexist.

### 9.5 Motion

No motion is required. Optional color transitions must be subtle, short, and removable through `prefers-reduced-motion`.

Disabled, loading, and success states are outside the current design scope.

---

## 10. Accessibility considerations

### 10.1 Structure and semantics

- The page uses one main landmark.
- “Your Result” is the primary page heading.
- “Summary” is a subordinate heading.
- Category results use semantic key-value grouping.
- The Continue action is a native button.
- Decorative icons are hidden from assistive technology.
- The overall score is announced as one coherent phrase, such as “76 out of 100.”
- Each category is announced with its label and complete score.

### 10.2 Color and contrast

- Meaning is never communicated by color alone.
- Production category label colors use the accessible values in section 6.2.
- The category maximum score uses solid `#5F677B`.
- “Your Result” uses white instead of Figma lavender.
- Gradient text combinations are verified at their actual rendered positions.
- Focus indication meets non-text contrast requirements.

### 10.3 Reflow and text adjustment

The component remains usable:

- At `320px` viewport width
- At `400%` browser zoom when the effective CSS viewport is approximately `320px`
- With increased text size
- With WCAG text-spacing overrides
- With moderate English content expansion
- On short landscape viewports

Text must not clip, overlap, or create horizontal page scrolling. Fixed Figma heights yield to content.

### 10.4 Interaction and input

- The button supports native keyboard activation.
- Focus order follows DOM and visual reading order.
- The button target exceeds `44 × 44px`.
- Hover is never required.
- No action depends on a fine pointer.
- The focus indicator remains visible in forced-colors mode.

### 10.5 Document and user preferences

- The document language is English.
- The page has a meaningful title.
- Text remains visible while the local font loads.
- A system sans-serif fallback is available.
- Optional transitions respect reduced-motion preferences.

---

## 11. Decisions, assumptions, and remaining uncertainties

### 11.1 Resolved production decisions

| Topic | Resolution |
|---|---|
| Source of truth | Figma defines original visuals; documented accessibility corrections override affected visual values |
| Visual category value | Use `73` for Visual |
| Action copy | Use `Continue` |
| Button Active variant | Map to hover and pressed; use a separate focus ring |
| Responsive switch | Use `700px` |
| Overall score | Store independently; do not derive it from category average |
| Maximum score | First release uses exactly `100` |
| Category labels | Use darker accessible production colors |
| Category maximum text | Use solid `#5F677B` |
| Result heading | Use white |
| Data state | Render complete valid data or a simple unavailable fallback; no loading state |
| Disabled action | Not required |
| Mobile bottom space | Treat the remaining frame space as viewport context, not component padding |
| Runtime assets | Copy exact source assets into the application runtime asset area |

### 11.2 Remaining implementation verification

- Confirm the chosen `700px` switch visually at `699px`, `700px`, and `701px`.
- Verify `#CAC9FF` contrast at the actual comparison-message and score-maximum positions.
- Confirm font metrics using the local Hanken Grotesk file and the system fallback.
- Confirm that text-spacing overrides do not break the `512px` reference height or row alignment.
- Define the future navigation or callback behavior after Continue; the current project only exposes the button.
- The invalid-data fallback has no Figma visual and should remain intentionally simple.

---

## 12. Design guardrails

Later implementation work must preserve these characteristics:

- The result score remains the strongest visual element.
- Mobile uses a full-width top result panel with rounded bottom corners and shadow.
- Tablet and desktop use one centered, two-column white card.
- The result panel retains its vertical purple-to-blue gradient.
- The score circle changes from `140px` on mobile to `200px` on wider layouts.
- Summary rows remain consistent in minimum height, radius, spacing, and information order.
- Category identity is reinforced by icon and color, never color alone.
- The Continue action remains prominent and full width within the summary panel.
- Accessibility deviations from Figma remain documented and intentional.
- Figma measurements are translated into resilient layout behavior rather than copied as absolute positioning.
