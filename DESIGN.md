# Design Definition — Results Summary Component

## Document status

This document captures the visual and UX definition of the Results Summary component. It is based primarily on the Figma file and is intended to guide later specification, implementation, and review work.

The Figma file is the visual source of truth when it conflicts with older screenshots, starter markup, or challenge data. This document describes design intent and known constraints; it is not an implementation plan.

### Design sources

- Figma page: `🧪 Results summary`
- Figma sections: `Main page`, `Components`, and `Style Guide`
- Reference frames:
  - Mobile: `375 × 809`
  - Tablet: `768 × 1080`
  - Desktop: `1440 × 1080`
- Repository design assets: `docs/design/`
- Typeface: Hanken Grotesk, supplied in the repository

---

## 1. Purpose

The component presents an overall assessment result and a supporting category-by-category breakdown in a compact, reassuring interface.

Its UX goals are to:

- Make the overall score immediately understandable.
- Communicate the qualitative meaning of the result.
- Let users compare individual category scores without scanning a dense table.
- Provide one clear next action.
- Preserve the same information hierarchy across mobile, tablet, and desktop layouts.
- Remain usable and legible across the full responsive range, not only at the three Figma reference widths.

The experience is informational rather than analytical. The visual treatment should feel positive, lightweight, and focused. The gradient result panel is the emotional focal point; the summary list provides the factual detail.

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

On tablet and desktop, both regions form a single horizontal card. On mobile, they become vertically stacked sections with different outer treatments.

### 2.3 Result overview

The result overview is the primary visual region and contains:

1. “Your Result” eyebrow/title
2. Circular score display
   - Current score: `76`
   - Maximum score: `of 100`
3. Qualitative rating: “Great”
4. Supporting comparison message:
   - “You scored higher than 65% of the people who have taken these tests.”

The result overview uses a vertical purple-to-blue gradient, centered text, and a second translucent gradient inside the circular score display.

The overall score is the strongest visual element. The rating is the secondary emphasis. The descriptive message is supporting content and should not compete with the score.

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
- A category label
- The achieved value
- A visually de-emphasized `/ 100` maximum

The rows share the same structure, height, and radius, while their foreground and background colors communicate category identity.

### 2.5 Primary action

The button is a full-width pill within the summary panel. Its Figma component includes a default navy state and a gradient “Active” variant.

The visible screen instances currently contain the placeholder text `Label`, while the underlying text layer is named `Continue`. Final copy is unresolved and must be confirmed before implementation.

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
| Page positioning | Horizontally and vertically centered |

The desktop composition is symmetrical at the column level. The summary content has approximately `40px` of space on both sides.

The outer white card receives the shadow. The result panel overlaps no content; it occupies the complete left half and has a `32px` radius on all corners.

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
| Page positioning | Horizontally and vertically centered |

The tablet layout retains the horizontal composition. It compresses both columns while preserving the result panel height, score circle size, typography, row height, and button height.

The fractional width in the Figma frame is a resizing artifact, not a design token. Production behavior should preserve the visual proportions without reproducing values such as `268.717px`.

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
- The summary panel is not enclosed in a shared white card.
- The score circle and typography scale down.
- The page background is white.
- The action remains full width inside the summary section.

This mobile behavior must not be implemented as a simple desktop card that merely changes `flex-direction`.

---

## 4. Responsive behavior

### 4.1 General behavior

The component should be responsive from at least `320px` wide through large desktop screens.

The three Figma frames are reference snapshots, not hard viewport contracts. The layout should interpolate cleanly between them.

### 4.2 Narrow screens

At narrow widths:

- The result and summary sections stack vertically.
- The result section remains full bleed.
- The summary section uses stable side padding and fills the available width.
- Text may wrap naturally without clipping.
- Category labels and values must remain readable without overlapping.
- The button fills the summary content width.
- The component uses natural document flow rather than vertical centering.

At `375px`, the summary width is `315px`, equivalent to `30px` side margins. At `320px`, those margins may reduce to maintain adequate content width, but should not fall below a practical mobile gutter.

### 4.3 Wide screens

Once there is sufficient horizontal space:

- The component switches to a two-column card.
- The card is centered within the page.
- Both sections retain a `512px` reference height.
- The result section stays visually dominant.
- The composite card should not exceed the `736px` desktop reference width.
- The summary content remains centered within its column.
- The pale blue page background becomes visible around the card.

### 4.4 Breakpoint uncertainty

Figma demonstrates stacked behavior at `375px` and horizontal behavior at `768px`, but it does not define the exact transition point.

The switch should occur when the component can no longer preserve two readable columns, rather than being chosen only because a conventional device breakpoint exists. A component or container-width threshold is preferred conceptually.

The exact breakpoint belongs in `SPEC.md` after testing the design through intermediate widths.

### 4.5 Height and overflow

The Figma desktop and tablet cards use a fixed `512px` reference height. That height works for the supplied English content, but the production layout must tolerate:

- Browser zoom
- Larger user text settings
- Localized or longer copy
- Unexpected category labels
- Dynamic content

Content must not be clipped to preserve the reference height. The reference height should be treated as the default visual target, with natural expansion allowed when content requires it.

---

## 5. Typography

### 5.1 Typeface

- Family: `Hanken Grotesk`
- Required weights:
  - `500` — Medium
  - `700` — Bold
  - `800` — ExtraBold
- Letter spacing: `0`
- The local repository font assets should be preferred over a runtime dependency on an external font service.

### 5.2 Type styles

| Design style | Size | Line height | Weight | Primary use |
|---|---:|---:|---:|---|
| Display Large | `72px` | `100%` | `800` | Score on tablet and desktop |
| Display Medium | `56px` | `100%` | `800` | Score on mobile |
| Heading Large | `32px` | `130%` | `700` | “Great” on tablet and desktop |
| Heading Medium | `24px` | `130%` | `700` | Desktop/tablet headings; mobile “Great” |
| Body Large Strong | `18px` | `130%` | `700` | Desktop/tablet labels, values, and button |
| Body Large Default | `18px` | `130%` | `500` | Desktop/tablet supporting copy and labels |
| Body Medium Strong | `16px` | `130%` | `700` | Mobile values and maximum score |
| Body Medium Default | `16px` | `130%` | `500` | Mobile supporting copy and category labels |

### 5.3 Responsive type mapping

| Element | Mobile | Tablet/Desktop |
|---|---|---|
| “Your Result” | `18px / 700` | `24px / 700` |
| Score | `56px / 800` | `72px / 800` |
| “of 100” | `16px / 700` | `18px / 700` |
| Rating | `24px / 700` | `32px / 700` |
| Supporting message | `16px / 500` | `18px / 500` |
| “Summary” | `18px / 700` | `24px / 700` |
| Category label | `16px / 500` | `18px / 500` |
| Category value | `16px / 700` | `18px / 700` |
| Button label | `18px / 700` | `18px / 700` |

The score should use tabular numerals when available so changing values do not create distracting width shifts.

---

## 6. Colors

### 6.1 Semantic palette

| Role | Figma token | Value |
|---|---|---|
| Surface | `colors/white` | `#FFFFFF` |
| Page background | `colors/blue/50` | `#F3F4FD` |
| Primary dark text and button | `colors/navy/950` | `#303B59` |
| Result supporting text | `colors/navy/200` | `#CAC9FF` |
| Reaction background | `colors/red/50` | `#FFF6F6` |
| Reaction foreground | `colors/red/400` | `#FF5555` |
| Memory background | `colors/yellow/50` | `#FFFBF4` |
| Memory foreground | `colors/yellow/400` | `#FFB21E` |
| Verbal background | `colors/green/50` | `#F2FCF9` |
| Verbal foreground | `colors/green/500` | `#00BB8F` |
| Visual background | `colors/blue/50` | `#F3F4FD` |
| Visual foreground | `colors/blue/800` | `#1125D6` |

### 6.2 Result gradient

The result panel uses a vertical gradient:

```css
linear-gradient(180deg, #7755ff 0%, #2f2ce9 100%)
```

### 6.3 Score gradient

The circular score display uses a vertical gradient that fades to transparency:

```css
linear-gradient(180deg, #4d21c9 0%, rgb(37 33 201 / 0%) 100%)
```

### 6.4 Shadow

The desktop/tablet outer card and the mobile result panel use:

```css
box-shadow: 0 30px 60px rgb(61 108 236 / 15%);
```

The shadow should remain soft and low contrast. It supports separation without making the card feel elevated like a modal.

### 6.5 Contrast risks

The category foreground colors are visually faithful to Figma but do not all meet WCAG contrast requirements for normal-sized text against their pale row backgrounds.

Approximate contrast ratios:

| Category | Approximate ratio |
|---|---:|
| Reaction | `2.96:1` |
| Memory | `1.75:1` |
| Verbal | `2.36:1` |
| Visual | `8.48:1` |

Reaction, Memory, and Verbal require a design decision before implementation. Possible directions include darkening those foreground colors or using navy text while retaining the category color for the icon.

The lavender result text also varies in contrast across the gradient. On the lighter upper portion, mobile-sized text is at risk of insufficient contrast. This must be validated against the rendered gradient, not only one endpoint.

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
- Score value to `/ 100`: `8px`
- Gap between summary rows: `16px`
- Result content gap on mobile: `24px`
- Mobile rating-to-message gap: `8px`
- Summary heading-to-list group: `32px` on tablet/desktop
- Major result content gap: `32px` on tablet/desktop
- Summary horizontal inset: approximately `40px` on tablet/desktop
- Mobile summary side inset at `375px`: `30px`
- Row left inset: `8px`
- Row right inset: `16px`
- Button horizontal inset: `16px`

### 7.3 Fixed dimensions used as visual anchors

- Category row height: `56px`
- Button height: `56px`
- Category row radius: `12px`
- Main card/result radius: `32px`
- Button radius: `128px`
- Desktop/tablet score circle: `200px`
- Mobile score circle: `140px`

These values define the design’s rhythm and silhouette. Text containers, however, should not be constrained to fixed heights if doing so causes overflow.

---

## 8. Imagery and icons

The interface contains no photographic or illustrative imagery. Its visual identity comes from typography, gradients, color, and four small category icons.

### 8.1 Category icons

The icon set contains:

- Reaction — lightning bolt
- Memory — brain
- Verbal — speech bubble
- Visual — eye

The source SVG assets are available in `docs/design/images/`.

### 8.2 Icon treatment

- Icons sit inside an approximately `31 × 32px` layout box.
- The visible glyphs are smaller and centered inside that box.
- Each icon uses the foreground color of its category.
- Icons are supporting cues; the adjacent text label carries the semantic meaning.
- Icons should be rendered from the provided assets rather than redrawn.
- Because the category name is already visible, icons should normally be hidden from assistive technology.

No icon should be used as the only identifier for a score category.

---

## 9. Interaction states

### 9.1 Default button

- Background: `#303B59`
- Text: white
- Height: `56px`
- Shape: pill
- Label: unresolved; Figma instances currently show `Label`

### 9.2 Figma “Active” variant

The button component includes an `Active` variant using the same purple-to-blue gradient as the result panel.

The file does not define whether “Active” means:

- Hover
- Pressed
- Selected
- Keyboard focus
- A generic interactive state

There are no prototype reactions that resolve this ambiguity.

The repository also contains an `active-states.jpg` reference, but Figma remains the primary source. The state mapping should be confirmed in `SPEC.md`.

### 9.3 Required interaction behavior

Regardless of the final state mapping:

- The control must be a native button.
- Hover must be visually distinguishable on devices that support hover.
- Keyboard focus must be clearly visible and must not rely only on the background color change.
- Pressed state should provide immediate feedback without moving surrounding layout.
- The target area must remain at least the full `56px` button height.
- Disabled and loading states are not represented in Figma and are not currently required.
- No motion is required by the design.

A focus indicator may require an accessibility addition not shown in Figma. It should be visually compatible with the component and visible against both white and pale blue surroundings.

---

## 10. Accessibility considerations

### 10.1 Structure and semantics

The visual hierarchy should map to meaningful document structure:

- The component belongs inside a page landmark such as `<main>`.
- “Your Result” should function as the primary component heading.
- “Summary” should be a subordinate heading.
- The category collection should use semantic grouped content, such as a list or description list.
- The primary action must use a native `<button>`.
- Decorative icons should use empty alternative text or `aria-hidden="true"`.

The score should be announced as one coherent phrase, for example “76 out of 100,” rather than as disconnected text fragments.

### 10.2 Color and contrast

- Information is not communicated by color alone because every category includes an icon and text label.
- Reaction, Memory, and Verbal label colors have known contrast failures against their row backgrounds.
- Lavender text on the result gradient requires validation, especially at the top of the gradient and at mobile type sizes.
- The navy button and white label have strong contrast.
- Focus indication must meet contrast requirements against adjacent colors.

### 10.3 Reflow and text scaling

The component must remain usable:

- At `320px` viewport width
- At `200%` browser zoom
- With increased text size
- With longer content

Text must not clip, overlap scores, or force horizontal scrolling. Fixed Figma heights must yield to content when necessary.

### 10.4 Interaction and input

- The action must support keyboard activation.
- The focus order should follow the visual reading order.
- The button target is already comfortably larger than the common `44 × 44px` minimum.
- Hover styling must not be required to understand or operate the interface.
- No interaction depends on a fine pointer.

### 10.5 Motion

The design contains no required animation. Any later transitions should respect `prefers-reduced-motion` and must not be necessary to understand state.

---

## 11. Assumptions and uncertainties

| Topic | Current understanding | Required follow-up |
|---|---|---|
| Source of truth | Figma overrides older starter assets and markup | Maintain this rule during review |
| Visual category value | Figma shows Visual as `73`; older material may show `72` | Use `73` unless product data defines otherwise |
| Button copy | Instances show `Label`; layer name suggests `Continue` | Confirm final copy |
| Button `Active` variant | Gradient state exists but its trigger is undefined | Define hover, pressed, and focus behavior in `SPEC.md` |
| Responsive switch | Stacked at `375px`, horizontal at `768px` | Test intermediate widths and define the threshold |
| Tablet widths | Slightly asymmetric columns and fractional content width | Preserve intent, not fractional measurements |
| Overall score | Category average is `76.5`, while the displayed score is `76` | Treat total score as independent data unless a flooring rule is confirmed |
| Contrast remediation | Three category labels fail normal-text contrast | Decide whether accessibility may adjust Figma colors |
| Result lavender text | Contrast changes across the gradient | Validate rendered positions and adjust if needed |
| Dynamic content | Figma uses fixed English strings | Define length constraints and overflow behavior |
| Data states | Loading, error, empty, and partial states are absent | Confirm whether the component only renders complete data |
| Disabled action | No disabled variant exists | Add only if product behavior requires it |
| Mobile bottom space | The `809px` frame contains `779px` of designed content | Treat remaining space as viewport context, not component padding |
| Figma row component | Repeated values are overridden manually rather than exposed as properties | Code should use a data-driven row model |
| Figma variables | Variables use a generic collection and broad scopes | Normalize names and scopes when translating to code tokens |

---

## 12. Design guardrails

Later specifications and implementation work should preserve these non-negotiable characteristics:

- The result score remains the strongest visual element.
- Mobile uses a full-width top result panel with rounded bottom corners.
- Tablet and desktop use one centered, two-column white card.
- The result panel retains its vertical purple-to-blue gradient.
- The circular score display scales from `140px` on mobile to `200px` on wider layouts.
- Summary rows remain consistent in height, radius, spacing, and information order.
- Category identity is reinforced by icon and color, never color alone.
- The primary action remains visually prominent and full width within the summary panel.
- Accessibility corrections must be documented when they intentionally differ from Figma.
- Figma measurements should be translated into resilient layout behavior rather than copied as absolute positioning.
