# Functional and Technical Specification — Results Summary Component

## Document status

This document converts the visual and UX definition in `DESIGN.md` into functional, technical, and testable requirements for the Results Summary project.

The Figma file remains the source of truth for the original visual design. `DESIGN.md` records design intent and reviewed visual decisions. Explicit requirements in this specification override unresolved Figma placeholders and documented accessibility failures.

This specification defines required behavior and constraints. File structure and implementation sequence belong in `PLAN.md`.

---

## 1. Scope and technical context

The project is a single-page Vite application implemented with semantic HTML, TypeScript, and maintainable CSS.

### 1.1 Required technical constraints

- Use the existing application under `frontend/`.
- Use the repository’s existing Vite and TypeScript setup.
- Do not add a UI framework or CSS framework.
- Use semantic HTML generated or assembled by TypeScript.
- Use CSS custom properties for reusable colors, spacing, typography, radii, gradients, shadow, and layout values.
- Use the local Hanken Grotesk design-source files already included in the repository.
- Copy the exact font and SVG assets needed at runtime into an application-owned location inside `frontend/`; do not make production rendering depend on `docs/design/` paths.
- Do not reference temporary Figma asset URLs in production code.
- Render visible content from one structured data source rather than duplicating category values manually.
- Store the default content in a local JSON file imported at build time.
- Enable TypeScript JSON-module resolution in `frontend/tsconfig.json`.
- Validate the imported JSON at runtime before rendering; do not rely on a type assertion as validation.
- Do not add a validation dependency for this small fixed schema unless later requirements justify one.
- Support current evergreen browsers.

### 1.2 Resolved project decisions

| Topic | Requirement |
|---|---|
| Action label | Use `Continue` |
| Overall score | Store independently; do not derive from category average |
| Maximum score | Exactly `100` for the first release |
| Visual category score | Use `73` for Visual, matching Figma |
| Categories | Exactly the four known categories in Figma order |
| Responsive switch | Use the horizontal card at `700px` and above |
| Figma Active button variant | Use the gradient for hover and pressed states |
| Keyboard focus | Add a separate visible focus ring |
| Data delivery | Import local JSON at build time; no loading state |
| Invalid data | Render one safe fallback instead of partial results |
| Category label contrast | Use the accessible label colors defined here |
| Secondary score contrast | Use solid `#5F677B`, not reduced opacity |
| Result heading contrast | Use white instead of Figma lavender |
| Runtime assets | Copy exact source assets into `frontend/` runtime assets |

---

## 2. Page and component responsibilities

The names below describe logical responsibilities. They do not require a framework or a one-file-per-component architecture.

### 2.1 Document shell

The document shell shall:

- Set `<html lang="en">`.
- Provide a meaningful document title such as `Results summary`.
- Mount the Vite application into the existing application root.
- Avoid unrelated navigation, footer content, attribution, or decoration in the initial scope.

### 2.2 Page shell

The page shell shall:

- Provide exactly one `<main>` landmark.
- Mount one Results Summary instance.
- Control page background, responsive centering, outer padding, and vertical overflow.
- Use safe centering so content is not clipped above or below short viewports.
- Use natural page scrolling when content exceeds the viewport.

### 2.3 Results Summary

The Results Summary shall:

- Receive one validated `ResultsSummaryData` object.
- Coordinate the result overview, summary heading, category collection, and primary action.
- Preserve this DOM and reading order at every viewport width:
  1. Result heading
  2. Overall score
  3. Rating
  4. Comparison message
  5. Summary heading
  6. Category scores
  7. Continue action
- Change visual layout without changing DOM order.
- Render either the complete ready state or the invalid-data fallback.
- Never render partial score data.

### 2.4 Result overview

The result overview shall:

- Display the result heading, overall score, maximum score, rating, and comparison message.
- Present the overall score as the dominant visual element.
- Expose the score as one coherent accessible phrase such as `76 out of 100`.
- Use the supplied overall score without recalculating it from categories.
- Construct the English comparison sentence from the percentile value.
- Center its default content horizontally and vertically in the wide layout.

### 2.5 Summary panel

The summary panel shall:

- Display the summary heading.
- Render category entries by iterating over the validated data array in source order.
- Align score phrases to the trailing edge.
- Place the Continue action after the category collection.
- Center its default content vertically in the wide layout.
- Expand naturally when text reflow increases its height.

### 2.6 Category score item

Each category item shall:

- Display one decorative category icon.
- Display one visible category label.
- Display the achieved score and maximum score.
- Derive icon, row background, icon color, and accessible label color from the category ID.
- Use a minimum height of `56px`.
- Grow when text spacing or wrapping requires more height.
- Keep the numeric score phrase on one line.
- Reserve the icon box even when the asset fails.
- Remain understandable without the icon.

### 2.7 Continue action

The Continue action shall:

- Be a native `<button type="button">`.
- Use the visible label supplied by valid data; the default value is `Continue`.
- Expose one integration boundary for a future callback.
- Invoke a supplied callback once for each native activation.
- Cause no form submission, page reload, or navigation when no callback is supplied.
- Support pointer, keyboard, and touch activation through native behavior.

---

## 3. Content model

### 3.1 TypeScript model

```ts
export type ScoreCategoryId =
  | "reaction"
  | "memory"
  | "verbal"
  | "visual";

export interface ScoreCategory {
  id: ScoreCategoryId;
  label: string;
  score: number;
}

export interface ResultsSummaryData {
  resultHeading: string;
  score: number;
  maximumScore: 100;
  rating: string;
  percentile: number;
  summaryHeading: string;
  actionLabel: string;
  categories: readonly [
    ScoreCategory,
    ScoreCategory,
    ScoreCategory,
    ScoreCategory,
  ];
}
```

The runtime validator, not the TypeScript interface alone, determines whether imported JSON is valid.

### 3.2 Required default content

```json
{
  "resultHeading": "Your Result",
  "score": 76,
  "maximumScore": 100,
  "rating": "Great",
  "percentile": 65,
  "summaryHeading": "Summary",
  "actionLabel": "Continue",
  "categories": [
    { "id": "reaction", "label": "Reaction", "score": 80 },
    { "id": "memory", "label": "Memory", "score": 92 },
    { "id": "verbal", "label": "Verbal", "score": 61 },
    { "id": "visual", "label": "Visual", "score": 73 }
  ]
}
```

The default comparison sentence shall render as:

> You scored higher than 65% of the people who have taken these tests.

### 3.3 Validation rules

The validator shall reject the complete object when any rule fails.

- The root value must be a non-null object.
- `resultHeading`, `rating`, `summaryHeading`, `actionLabel`, and every category `label` must contain non-whitespace text.
- `maximumScore` must equal the integer `100`.
- `score` and each category score must be integers from `0` through `100`, inclusive.
- `percentile` must be an integer from `0` through `100`, inclusive.
- `categories` must be an array of exactly four entries.
- Category IDs must appear exactly once each.
- Category order must be:
  1. `reaction`
  2. `memory`
  3. `verbal`
  4. `visual`
- Unknown IDs, missing IDs, duplicate IDs, additional IDs, and a different category count are invalid.
- Invalid numeric values must not be rounded or clamped.
- The overall score must not be calculated from category values.
- The renderer must still iterate over the validated category array; it must not contain four hand-written row templates.

### 3.4 Category presentation mapping

| ID | Icon | Row background | Icon color | Accessible label color |
|---|---|---|---|---|
| `reaction` | Lightning | `#FFF6F6` | `#FF5555` | `#C93838` |
| `memory` | Brain | `#FFFBF4` | `#FFB21E` | `#8A5A00` |
| `verbal` | Speech bubble | `#F2FCF9` | `#00BB8F` | `#007A5E` |
| `visual` | Eye | `#F3F4FD` | `#1125D6` | `#1125D6` |

The darker label colors are intentional accessibility deviations from Figma. Bright category accents remain on decorative icons.

Across every category row:

- The achieved score shall use `#303B59`.
- The slash and maximum score shall use solid `#5F677B`.
- The maximum score shall not use Figma’s 50%-opacity treatment.

### 3.5 Runtime asset mapping

Implementation shall create application-owned runtime copies of:

- Hanken Grotesk font file or files
- Reaction SVG
- Memory SVG
- Verbal SVG
- Visual SVG
- Favicon, when used

Requirements:

- Preserve the exact source asset bytes.
- Keep design-source assets under `docs/design/` unchanged.
- Import or serve runtime assets from inside `frontend/`.
- Reserve explicit icon dimensions to avoid layout shift.

---

## 4. Responsive rules

### 4.1 Supported range

- The interface shall work without horizontal page scrolling from `320px` viewport width upward.
- The layout shall remain coherent beyond the `1440px` desktop reference.
- The layout shall support an effective CSS viewport of `320px` at high browser zoom.
- The layout and responsive typography switch at `700px`.
- The exact threshold shall be visually checked at `699px`, `700px`, and `701px`.

### 4.2 Narrow layout: below `700px`

The page shall use the mobile composition.

#### Page shell

- Background: white.
- The component begins at the top of the page.
- The page does not vertically center the component.
- Short portrait and landscape viewports remain vertically scrollable.
- The default `375 × 809` composition leaves approximately `30px` of viewport space below the designed content; this is not fixed component padding.

#### Result overview

- Inline size: `100%` of the viewport or page container.
- Default minimum height at `375px`: `356px`.
- Top corners: square.
- Bottom corners: `32px` radius.
- Shadow: `0 30px 60px rgb(61 108 236 / 15%)`.
- Content alignment: centered horizontally.
- Internal content maximum width: `260px`.
- Default block inset: `32px`.
- Primary internal gap: `24px`.
- Rating-to-message gap: `8px`.
- Score circle: `140 × 140px`.
- The section grows when text or accessibility settings require it.

#### Summary panel

- Inline size: `100%`.
- Use a fluid inline gutter equivalent to `clamp(24px, 8vw, 30px)` or behavior that produces the same constraints.
- The gutter resolves to approximately `30px` at `375px`.
- The gutter never becomes smaller than `24px` in the supported range.
- Gap below result overview: `24px`.
- Major gap between summary heading, category list, and button: `24px`.
- Category row gap: `16px`.
- Button inline size: `100%` of summary content.
- Provide sufficient bottom spacing for the button focus ring and normal page breathing room.

#### Mobile typography

- Result heading: `18px`, weight `700`, line height `130%`.
- Score: `56px`, weight `800`, line height `100%`.
- Maximum score: `16px`, weight `700`, line height `130%`.
- Rating: `24px`, weight `700`, line height `130%`.
- Comparison message: `16px`, weight `500`, line height `130%`.
- Summary heading: `18px`, weight `700`, line height `130%`.
- Category label: `16px`, weight `500`, line height `130%`.
- Category score: `16px`, weight `700`, line height `130%`.
- Button: `18px`, weight `700`, line height `130%`.

### 4.3 Wide layout: `700px` and above

The page shall use the tablet/desktop composition.

#### Page shell

- Background: `#F3F4FD`.
- Minimum block size: `100svh`.
- Default page padding: at least `32px` block and approximately `40px` inline.
- The card is safely centered horizontally and vertically when the card plus required padding fits.
- When the card does not fit, alignment falls back to normal top-to-bottom flow and scrolling.
- Vertical centering must never make the top of the card unreachable.

#### Composite card

- Inline size: `100%` of the padded page area.
- Maximum inline size: `736px`.
- At a `768px` viewport with `40px` side padding, target width: approximately `688px`, within the Figma tolerance for `686px`.
- Default minimum height: `512px`.
- Height expands naturally.
- Corner radius: `32px`.
- Background: white.
- Shadow: `0 30px 60px rgb(61 108 236 / 15%)`.
- Layout: two approximately equal columns.
- Both columns stretch to the same resulting height.
- Do not use absolute positioning for the primary layout.

#### Result overview

- Occupies the first column.
- Has `32px` radius on all four corners.
- Centers default content horizontally and vertically.
- Internal content maximum width: `260px`.
- Score circle: `200 × 200px`.
- Primary internal gap: `32px`.
- Rating-to-message gap: `16px`.

#### Summary panel

- Occupies the second column.
- Centers default content vertically.
- Internal inline inset scales from approximately `24px` at the narrow end to `40px` at the desktop maximum.
- Summary content is approximately `269px` wide at the `768px` reference and `288px` wide at the desktop maximum.
- Major gap between summary heading, category list, and button: `32px`.
- Category row gap: `16px`.
- Button inline size: `100%`.

#### Wide typography

- Result heading and summary heading: `24px`, weight `700`, line height `130%`.
- Score: `72px`, weight `800`, line height `100%`.
- Maximum score: `18px`, weight `700`, line height `130%`.
- Rating: `32px`, weight `700`, line height `130%`.
- Comparison message: `18px`, weight `500`, line height `130%`.
- Category label: `18px`, weight `500`, line height `130%`.
- Category score: `18px`, weight `700`, line height `130%`.
- Button: `18px`, weight `700`, line height `130%`.

### 4.4 Shared dimensional rules

- Category row minimum height: `56px`.
- Category row radius: `12px`.
- Category icon reserved box: approximately `32 × 32px`.
- Icon-to-label gap: `8px`.
- Row leading inset: `8px`.
- Row trailing inset: `16px`.
- Achieved-score-to-maximum gap: `8px`.
- Button minimum height: `56px`.
- Button shape: pill.
- Use logical properties for inline and block spacing where practical.
- Do not use fixed text-container heights.

---

## 5. States and interactions

### 5.1 Ready state

The ready state renders the complete result overview, all four category rows, and the Continue button from valid data.

This is the only Figma-defined content state.

### 5.2 Invalid-data fallback

When validation fails:

- Do not render partial scores.
- Render the visible message `Results are unavailable.` inside `<main>`.
- Do not render the Continue action.
- Do not announce stale score content.
- Log a descriptive error during development when practical.
- Keep the fallback simple, legible, and accessible.
- A dedicated branded fallback design is outside scope.

Because validation occurs before the first score render, an `aria-live` region is not required for the initial fallback.

### 5.3 Button default state

- Background: `#303B59`.
- Text: white.
- Cursor indicates interactivity where applicable.
- Dimensions remain stable.

### 5.4 Button hover state

On devices that support hover:

- Replace the navy fill with:
  `linear-gradient(180deg, #7755FF 0%, #2F2CE9 100%)`.
- Gate the style with `(hover: hover)` or an equivalent capability query.
- Do not reveal required information only on hover.

### 5.5 Button pressed state

During native activation:

- Retain the gradient treatment.
- Provide immediate visual feedback.
- Do not change button dimensions.
- Do not scale or translate the button by default.

### 5.6 Button focus-visible state

- Show a visible `3px` outline using `#1125D6` in normal color modes.
- Use an outline offset of at least `3px`.
- Preserve enough surrounding space that the ring is not clipped.
- The ring remains visible with navy or gradient fill.
- Focus and hover styles can coexist.
- Do not remove the browser focus indicator unless the custom focus-visible replacement is active.
- In forced-colors mode, allow system colors to preserve button boundary and focus visibility.

### 5.7 Motion

- No animation is required.
- An optional color transition may be no longer than `150ms`.
- Transitions must not communicate required state by motion alone.
- Remove or minimize optional transitions for `prefers-reduced-motion: reduce`.

### 5.8 States not required

The initial scope does not require:

- Loading skeleton
- Async loading state
- Network error state
- Disabled button
- Button loading state
- Empty category state
- Success confirmation
- Navigation result after Continue

---

## 6. Accessibility requirements

### 6.1 Document and semantic structure

- `<html>` shall declare `lang="en"`.
- The document shall have a meaningful `<title>`.
- The page shall contain exactly one `<main>` landmark.
- The result heading shall be the page `<h1>`.
- The summary heading shall be an `<h2>`.
- Category results shall use one semantic description list:
  - One `<dl>` collection
  - One grouping element per category
  - `<dt>` for the category label
  - `<dd>` for the score
- The Continue action shall be a native button.
- Category rows shall not receive interactive roles.

### 6.2 Accessible score output

- The overall score shall expose `76 out of 100` as one accessible unit for the default data.
- Each category shall expose its label and complete score, for example `Reaction, 80 out of 100`.
- Visual fragments shall not cause duplicate screen-reader announcements.
- A valid approach may use visually hidden complete text and hide visual fragments from assistive technology, or an equally clear semantic solution.
- Do not place an `aria-label` on a non-interactive container when ordinary text semantics provide a clearer solution.

### 6.3 Icons

- Category icons are decorative because the visible labels provide their meaning.
- Icon images shall use empty alternative text; inline SVGs shall use `aria-hidden="true"` and remain unfocusable.
- Icons shall not enter the tab order.
- Missing icons shall not remove the visible category label.

### 6.4 Color and contrast

- Normal-sized meaningful text shall meet at least `4.5:1` against its rendered background.
- Large meaningful text shall meet at least `3:1`.
- Focus indication and meaningful non-text boundaries shall meet at least `3:1` against adjacent colors.
- The result heading shall use white.
- Category labels shall use the accessible colors in section 3.4.
- Category maximum-score text shall use solid `#5F677B`.
- Bright category icon colors may remain because the visible label carries meaning.
- The comparison message and score maximum may use `#CAC9FF` only after contrast is verified at their actual gradient positions.
- If a gradient-position check fails, lighten the affected foreground while preserving hierarchy.
- Information shall never be communicated by color alone.

### 6.5 Keyboard and pointer input

- The Continue button is the only interactive element in the current component.
- It shall be reachable with `Tab`.
- It shall activate with `Enter` and `Space` through native button behavior.
- Focus order shall match DOM and visual order.
- The target shall be at least `44 × 44px`; the design uses at least `56px` height.
- Focus shall not be fully obscured by another element.
- No action shall require a fine pointer or hover.

### 6.6 Reflow and zoom

- At `320px` viewport width, content shall remain readable without horizontal page scrolling.
- At `400%` browser zoom from a `1280px`-wide viewport, the effective layout shall reflow without overlap, clipping, or horizontal page scrolling.
- At `200%` zoom at common desktop sizes, content shall remain usable and reachable.
- Fixed Figma heights shall yield to content.
- Long words shall wrap safely.
- Score phrases shall remain distinguishable at increased text size.

### 6.7 Text-spacing overrides

The component shall remain usable when user styles apply at least:

- Line height: `1.5` times the font size
- Paragraph spacing: `2` times the font size
- Letter spacing: `0.12em`
- Word spacing: `0.16em`

Under these overrides:

- No text shall clip or overlap.
- Category rows and card sections shall grow.
- The button label shall remain visible.
- All content shall remain reachable.

### 6.8 Fonts and user preferences

- Load Hanken Grotesk locally.
- Use `font-display: swap` or equivalent visible-text behavior.
- Provide a system sans-serif fallback.
- Font fallback shall not cause clipped content.
- Respect `prefers-reduced-motion`.
- Preserve visible boundaries and focus in forced-colors mode.

---

## 7. Edge cases

### 7.1 Numeric boundaries

- Overall and category scores of `0` and `100` must fit.
- Three-digit `100` values must not overflow.
- Use tabular numerals when supported.
- Decimal, negative, infinite, `NaN`, or over-100 values are invalid.
- A maximum score other than `100` is invalid.

### 7.2 Content expansion

- Longer headings, rating, comparison text, labels, and action copy shall wrap without overlap.
- Category score phrases shall remain on one line.
- If a category label wraps, its row shall grow beyond `56px`.
- The result overview, summary panel, and card shall expand vertically.
- Wide columns shall remain equal in resulting height.
- Text expansion shall not clip the focus ring.

### 7.3 Category schema

- Exactly four validated categories render.
- Empty, partial, reordered, duplicated, or unknown category collections are invalid.
- Invalid category data triggers the complete fallback.
- Rendering still uses one reusable row-rendering path.

### 7.4 Viewport constraints

- Very short viewports shall scroll vertically.
- Safe centering shall not make content unreachable.
- Large viewports shall not stretch the card beyond `736px`.
- Narrow viewports shall not show pale gutters around the full-width result panel.
- The `700px` switch shall not create overlap or a horizontal scrollbar.

### 7.5 Asset and font failure

- Icon dimensions shall remain reserved.
- A missing icon shall not remove category meaning.
- A failed web font shall fall back without clipped content.
- Production shall not depend on temporary Figma URLs or paths outside the application runtime root.

### 7.6 Interaction integration

- One native activation invokes the supplied callback once.
- Multiple deliberate activations invoke it once each.
- With no callback, activation has no destructive side effect.
- The button shall not submit a surrounding form.

### 7.7 Localization boundary

- The first release is English and left-to-right.
- Moderate English text expansion is supported.
- Full localization, plural rules, and right-to-left layout are outside scope.

---

## 8. Acceptance criteria

Unless a criterion specifies otherwise, reference-frame geometry may differ by up to `4px` because of browser and font rendering. Tablet column proportions may differ by up to `8px` when needed for a simple resilient grid.

### 8.1 Build, assets, and data

- **AC-01:** `pnpm build` succeeds from `frontend/`.
- **AC-02:** TypeScript JSON-module resolution is enabled and the local JSON import type-checks.
- **AC-03:** The imported JSON is passed through runtime validation before score markup is rendered.
- **AC-04:** Runtime font and icon assets are served or imported from inside `frontend/`.
- **AC-05:** No production asset is loaded from a temporary Figma MCP URL.
- **AC-06:** Design-source files under `docs/design/` remain available as references and are not the application’s runtime dependency.

### 8.2 Content and validation

- **AC-07:** The default page displays overall `76`, Reaction `80`, Memory `92`, Verbal `61`, and Visual `73`.
- **AC-08:** The visible action label is `Continue`; no visible `Label` placeholder remains.
- **AC-09:** Visible content is generated from one local JSON object.
- **AC-10:** Category rows are generated by iterating over the validated array in source order.
- **AC-11:** The overall score remains `76` and is not recalculated to `76.5` or `77`.
- **AC-12:** A maximum score other than `100` triggers the fallback.
- **AC-13:** A missing, duplicate, unknown, reordered, or additional category triggers the fallback.
- **AC-14:** Invalid data displays `Results are unavailable.`, hides the complete score UI, and hides Continue.

### 8.3 Mobile visual and responsive behavior

- **AC-15:** At `375 × 809`, the result overview spans the viewport width, begins at the top, and has square top corners with `32px` bottom corners.
- **AC-16:** At `375px`, the result overview is approximately `356px` high with default content and uses a `140px` score circle.
- **AC-17:** At `375px`, the summary has approximately `30px` side gutters and a `24px` gap below the result overview.
- **AC-18:** Below `700px`, the page background is white and the two regions are stacked.
- **AC-19:** The mobile result panel uses the specified soft blue shadow.
- **AC-20:** At `320px`, no content overlaps and the page has no horizontal scrollbar.

### 8.4 Breakpoint, tablet, and desktop behavior

- **AC-21:** At `699px`, the component uses the mobile composition without horizontal overflow.
- **AC-22:** At `700px`, the component switches to a two-column card without overlap or an inaccessible jump.
- **AC-23:** At `701px`, the component remains a stable two-column card.
- **AC-24:** At `768 × 1080`, the card is centered, approximately `686–688px` wide, and `512px` high with default content.
- **AC-25:** At `1440 × 1080`, the card is `736 × 512px` with two approximately `368px` columns.
- **AC-26:** Wide cards are white, have a `32px` radius, and use the specified shadow.
- **AC-27:** Wide result and summary content are centered within their columns for the default dataset.
- **AC-28:** At wide sizes, the score circle is `200px`.
- **AC-29:** Summary content is approximately `269px` wide at `768px` and `288px` at the desktop maximum.
- **AC-30:** The card never grows wider than `736px`.
- **AC-31:** Content taller than `512px` expands the card and remains reachable through normal page scrolling.

### 8.5 Typography, color, and assets

- **AC-32:** Hanken Grotesk loads locally in the required `500`, `700`, and `800` weights, or through one variable file covering those weights.
- **AC-33:** Font loading uses visible-text behavior and a working sans-serif fallback.
- **AC-34:** The result panel and score circle use the specified gradients.
- **AC-35:** The four rows use the specified pale backgrounds and exact local category icons.
- **AC-36:** Category labels use the accessible colors in section 3.4.
- **AC-37:** Category maximum-score text uses solid `#5F677B`.
- **AC-38:** The result heading is white.
- **AC-39:** All meaningful text meets the required contrast at its actual rendered position.

### 8.6 Interaction behavior

- **AC-40:** Continue is a native `type="button"` element with at least `56px` height.
- **AC-41:** On hover-capable devices, hover changes the fill from navy to the result gradient.
- **AC-42:** Pressing retains clear gradient feedback without changing layout dimensions.
- **AC-43:** Keyboard focus shows a `3px` blue ring with at least `3px` offset in normal color modes.
- **AC-44:** The focus ring is not clipped and remains visible while the button is hovered.
- **AC-45:** Continue activates with `Enter` and `Space`.
- **AC-46:** A supplied callback runs once per activation; without one, the page does not submit, reload, or navigate.

### 8.7 Semantics and assistive technology

- **AC-47:** The document declares English and has a meaningful title.
- **AC-48:** The page contains exactly one `<main>`, one `<h1>` for the result heading, and one `<h2>` for the summary heading.
- **AC-49:** Category scores use one `<dl>` with one grouped `<dt>` and `<dd>` pair per category.
- **AC-50:** Screen readers receive `76 out of 100` as one coherent phrase without duplicate score fragments.
- **AC-51:** Screen readers receive each category label with its complete score.
- **AC-52:** Decorative icons are ignored by assistive technology and do not receive focus.
- **AC-53:** Continue has an accessible name and native button semantics.

### 8.8 Reflow and user preferences

- **AC-54:** At `400%` zoom from a `1280px` viewport, content reflows without overlap, clipping, or horizontal page scrolling.
- **AC-55:** At short viewport heights, all content remains reachable through normal vertical scrolling.
- **AC-56:** Applying the specified text-spacing overrides causes containers to grow rather than clip or overlap.
- **AC-57:** Optional transitions respect `prefers-reduced-motion`.
- **AC-58:** In forced-colors mode, Continue and its focus indicator remain identifiable.
- **AC-59:** If an icon fails, its category remains understandable and the row layout remains stable.
- **AC-60:** If Hanken Grotesk fails, fallback text remains readable without clipping.

---

## 9. Out of scope

The first implementation does not include:

- Backend or remote API integration
- Authentication or persistence
- Editing scores
- Charts or score history
- Loading skeletons
- Animated score counting
- Disabled or loading button variants
- Multiple result cards on one page
- Full internationalization or right-to-left support
- Dark theme
- A destination or success state after Continue
