# Functional and Technical Specification — Results Summary Component

## Document status

This document converts the visual and UX definition in `DESIGN.md` into functional, technical, and testable requirements for the Results Summary project.

The Figma file remains the visual source of truth. `DESIGN.md` remains the design-intent source of truth. Explicit decisions in this specification override unresolved placeholders or accessibility problems in Figma.

This specification defines the required behavior. It does not prescribe the final file structure or implementation sequence; those belong in `PLAN.md`.

---

## 1. Scope and technical context

The project is a single-page Vite application implemented with semantic HTML, TypeScript, and maintainable CSS.

### 1.1 Required technical constraints

- Use the repository's existing Vite and TypeScript setup.
- Do not add a UI framework or CSS framework.
- Use CSS custom properties for reusable colors, spacing, typography, radii, gradients, and shadow values.
- Load Hanken Grotesk from the local font files already included in the repository.
- Use the local SVG category icons already included under `docs/design/images/`.
- Do not reference temporary Figma asset URLs in production code.
- Render the visible content from one structured data source rather than duplicating category markup and values manually.
- Use a local JSON file imported at build time. The initial implementation does not require a network request.
- Support current evergreen browsers.

### 1.2 Required decisions resolved by this specification

| Topic | Requirement |
|---|---|
| Action label | Use `Continue` |
| Overall score | Store it independently; do not derive it from the category average |
| Visual category score | Use `73` for Visual, matching Figma |
| Responsive switch | Switch to the horizontal card at `700px` |
| Figma `Active` button variant | Use the gradient treatment for hover and pressed states |
| Keyboard focus | Add a separate visible focus ring; the gradient alone is insufficient |
| Data delivery | Import local JSON at build time; no loading state is required |
| Invalid data | Render a safe fallback instead of partial or misleading scores |
| Contrast failures | Apply the accessible color exceptions defined in this document |

---

## 2. Page and component responsibilities

The names below describe logical responsibilities. They do not require a specific framework or one-file-per-component architecture.

### 2.1 Page shell

The page shell shall:

- Provide the document's main landmark.
- Mount one Results Summary instance.
- Control page-level background, responsive centering, outer padding, and vertical overflow.
- Use natural page scrolling when the component is taller than the viewport.
- Avoid adding unrelated navigation, footer content, or decorative content.

### 2.2 Results Summary

The Results Summary shall:

- Receive or import one complete `ResultsSummaryData` object.
- Validate the data before rendering the score UI.
- Coordinate the result overview, summary heading, category collection, and primary action.
- Preserve the reading order at every viewport width:
  1. Result heading
  2. Overall score
  3. Rating
  4. Comparison message
  5. Summary heading
  6. Category scores
  7. Continue action
- Change visual layout without changing DOM reading order.
- Render a visible fallback when the data is invalid.

### 2.3 Result overview

The result overview shall:

- Display the result heading, overall score, maximum score, rating, and comparison message.
- Present the score as the dominant visual element.
- Expose one coherent accessible score phrase such as `76 out of 100`.
- Use the overall score supplied by the data model without recalculating it from categories.
- Render the comparison sentence from the percentile value.

### 2.4 Summary panel

The summary panel shall:

- Display the `Summary` heading.
- Render category entries from the data array in source order.
- Keep the score values visually aligned on the trailing edge.
- Place the Continue action after the complete category collection.
- Expand naturally when content or category count requires additional height.

### 2.5 Category score item

Each category item shall:

- Display one decorative category icon.
- Display one visible text label.
- Display the achieved score and maximum score.
- Derive icon, background, icon color, and accessible label color from its category identifier.
- Use a minimum height of `56px`, but grow if text wrapping requires more space.
- Keep the numeric score phrase on one line.
- Remain understandable when the icon fails to load.

### 2.6 Continue action

The Continue action shall:

- Be a native `<button type="button">`.
- Use the visible label `Continue`.
- Expose a single integration boundary for a future continue handler.
- Invoke a supplied handler once per activation.
- Cause no form submission, page reload, or navigation when no handler is supplied.
- Support pointer, keyboard, and touch activation.

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
  maximumScore: number;
  rating: string;
  percentile: number;
  summaryHeading: string;
  actionLabel: string;
  categories: readonly ScoreCategory[];
}
```

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

The rendered comparison sentence shall be:

> You scored higher than 65% of the people who have taken these tests.

### 3.3 Data rules

- `resultHeading`, `rating`, `summaryHeading`, `actionLabel`, and every category `label` must contain non-whitespace text.
- `maximumScore` must be a positive integer.
- `score` and every category score must be integers from `0` through `maximumScore`, inclusive.
- `percentile` must be an integer from `0` through `100`, inclusive.
- Category identifiers must be unique.
- The required project dataset contains exactly four categories in the Figma order.
- Rendering must iterate over the array; it must not hardcode four separate row templates.
- The overall score must not be calculated from category values.
- Invalid numeric values must not be silently clamped or rounded.
- Invalid data shall trigger the fallback state.

### 3.4 Category presentation mapping

| ID | Icon | Row background | Icon color | Accessible label color |
|---|---|---|---|---|
| `reaction` | Lightning | `#FFF6F6` | `#FF5555` | `#C93838` |
| `memory` | Brain | `#FFFBF4` | `#FFB21E` | `#8A5A00` |
| `verbal` | Speech bubble | `#F2FCF9` | `#00BB8F` | `#007A5E` |
| `visual` | Eye | `#F3F4FD` | `#1125D6` | `#1125D6` |

The darker label colors are intentional accessibility deviations from Figma. The original brighter colors remain on decorative icons to preserve category identity.

---

## 4. Responsive rules

### 4.1 Supported range

- The interface shall work without horizontal scrolling from `320px` viewport width upward.
- The layout shall remain coherent on large screens beyond the `1440px` Figma frame.
- The layout shall reflow correctly at `200%` browser zoom.
- The `700px` breakpoint applies to layout and responsive type changes.

### 4.2 Narrow layout: below `700px`

The page shall use the mobile composition.

#### Page shell

- Background: white.
- The component begins at the top of the page rather than being vertically centered.
- The page shall provide approximately `30px` of bottom breathing room at the `375px` reference width.
- Short landscape viewports shall remain vertically scrollable.

#### Result overview

- Width: `100%` of the viewport or containing page.
- Minimum height at the `375px` reference width: `356px`.
- Top corners: square.
- Bottom corners: `32px` radius.
- Internal horizontal alignment: centered.
- Internal content maximum width: `260px`.
- Default vertical inset: `32px`.
- Primary internal gap: `24px`.
- Score circle: `140 × 140px`.
- The section may grow taller when text wraps or user text settings require it.

#### Summary panel

- Width: `100%` of the available page width.
- Horizontal inset shall use a fluid gutter that resolves to `30px` at `375px` and does not become smaller than `24px` at supported widths.
- Gap from result overview: `24px`.
- Gap between summary heading, category list, and button: `24px`.
- Category row gap: `16px`.
- Button width: `100%` of the summary content area.

#### Mobile typography

- Result heading: `18px`, weight `700`, line height `130%`.
- Score: `56px`, weight `800`, line height `100%`.
- Maximum score: `16px`, weight `700`, line height `130%`.
- Rating: `24px`, weight `700`, line height `130%`.
- Comparison message: `16px`, weight `500`, line height `130%`.
- Summary heading: `18px`, weight `700`, line height `130%`.
- Category label and value: `16px`, weights `500` and `700` respectively.
- Button: `18px`, weight `700`, line height `130%`.

### 4.3 Wide layout: `700px` and above

The page shall use the tablet/desktop card composition.

#### Page shell

- Background: `#F3F4FD`.
- Minimum block size: `100svh`.
- The card shall appear horizontally and vertically centered when it fits in the viewport.
- The page shall preserve at least `32px` vertical breathing room and approximately `40px` horizontal breathing room.
- When the card is taller than the available viewport, it shall remain reachable through normal page scrolling and must not be clipped above or below the viewport.

#### Composite card

- Maximum width: `736px`.
- At the `768px` reference viewport, target width: approximately `686–688px`.
- Default minimum height: `512px`.
- Height shall expand naturally for content reflow.
- Corner radius: `32px`.
- Background: white.
- Shadow: `0 30px 60px rgb(61 108 236 / 15%)`.
- Layout: two approximately equal columns.
- Both columns shall stretch to the same resulting height.

#### Result overview

- Occupies the first column.
- Has a `32px` radius on all four corners.
- Internal content maximum width: `260px`.
- Score circle: `200 × 200px`.
- Primary internal gap: `32px`.
- Rating-to-description gap: `16px`.

#### Summary panel

- Occupies the second column.
- Internal horizontal inset shall scale between approximately `24px` and `40px` so the content is about `269px` wide at `768px` and `288px` wide at the desktop maximum.
- Internal vertical alignment: centered when the default content fits.
- Gap between heading, category list, and button: `32px`.
- Category row gap: `16px`.
- Button width: `100%` of the summary content width.

#### Wide typography

- Result and summary headings: `24px`, weight `700`, line height `130%`.
- Score: `72px`, weight `800`, line height `100%`.
- Maximum score: `18px`, weight `700`, line height `130%`.
- Rating: `32px`, weight `700`, line height `130%`.
- Comparison message: `18px`, weight `500`, line height `130%`.
- Category label and value: `18px`, weights `500` and `700` respectively.
- Button: `18px`, weight `700`, line height `130%`.

### 4.4 Shared dimensional rules

- Category rows: minimum height `56px`, radius `12px`.
- Category icon layout box: approximately `32 × 32px`.
- Icon-to-label gap: `8px`.
- Row leading inset: `8px`.
- Row trailing inset: `16px`.
- Score-to-maximum gap: `8px`.
- Button: minimum height `56px`, pill radius.
- Use logical properties for inline and block spacing where practical.
- Do not use absolute positioning for the primary responsive layout.

---

## 5. States and interactions

### 5.1 Ready state

The ready state renders the complete result overview, all category rows, and the Continue button from valid data.

This is the only Figma-defined content state.

### 5.2 Invalid-data fallback

When validation fails:

- Do not render partial scores.
- Render a concise visible message: `Results are unavailable.`
- Keep the message inside the page's main landmark.
- Log a descriptive development error identifying the invalid field when practical.
- Do not show the Continue action.
- A dedicated visual design for this state is out of scope; it should remain simple, legible, and accessible.

### 5.3 Button default state

- Background: `#303B59`.
- Text: white.
- Cursor indicates interactivity where applicable.
- The button remains visually stable with no layout movement.

### 5.4 Button hover state

On devices that support hover:

- Replace the navy background with the Figma result gradient:
  `linear-gradient(180deg, #7755FF 0%, #2F2CE9 100%)`.
- Do not rely on hover to reveal required information.
- Do not apply hover behavior through a media query on touch-only devices.

### 5.5 Button pressed state

During pointer or keyboard activation:

- Retain the gradient treatment.
- Provide immediate state feedback without changing dimensions or moving surrounding content.
- A scale or translation effect is not required and should not be added by default.

### 5.6 Button focus-visible state

- Show a visible `3px` outline using `#1125D6`.
- Use an outline offset of at least `3px`.
- The focus ring must remain visible whether the button is navy or gradient-filled.
- Do not remove the browser focus indicator unless the custom replacement is active.
- Focus and hover styles must be able to coexist.

### 5.7 Motion

- No animation is required.
- Any optional color transition shall be subtle, no longer than `150ms`, and not required to understand state.
- Optional transitions shall be removed or minimized when `prefers-reduced-motion: reduce` is active.

### 5.8 States not required

Because the data is imported at build time and the design defines no such states, the initial scope does not require:

- Loading skeleton
- Async loading state
- Disabled button
- Button loading state
- Empty category state
- Network error state
- Success confirmation after Continue

---

## 6. Accessibility requirements

### 6.1 Semantic structure

- The page shall contain one `<main>` landmark.
- `Your Result` shall be the page's `<h1>`.
- `Summary` shall be an `<h2>`.
- The category scores shall use a semantic description list:
  - One `<dl>` for the collection
  - One grouping element per category
  - `<dt>` for the category label
  - `<dd>` for the score
- The Continue action shall use a native button.
- Do not add interactive roles to non-interactive category rows.

### 6.2 Accessible score output

- The overall score shall expose the phrase `76 out of 100` as one accessible unit.
- Each category score shall expose a phrase such as `Reaction, 80 out of 100` through normal semantics or an accessible label.
- Visually separated number fragments must not cause duplicate or confusing screen-reader announcements.
- The visual slash and maximum may be hidden from assistive technology when an equivalent complete accessible phrase is provided.

### 6.3 Icons

- Category icons are decorative because the visible category label provides the same meaning.
- SVGs or images shall use `aria-hidden="true"` or empty alternative text as appropriate.
- Icons shall not receive keyboard focus.
- The row must remain understandable if an icon is unavailable.

### 6.4 Color and contrast

- Normal-sized text shall meet at least `4.5:1` contrast against its rendered background.
- Large text shall meet at least `3:1` contrast.
- Focus indication shall meet at least `3:1` contrast against adjacent colors.
- `Your Result` shall use solid white rather than the lower-contrast lavender shown in Figma.
- The comparison message may use `#CAC9FF` because it sits in the darker lower region of the result gradient; the rendered implementation must still verify a ratio of at least `4.5:1` at its actual position.
- The maximum-score text inside the darker score circle may use `#CAC9FF`.
- Category text shall use the accessible label colors defined in section 3.4.
- Category icons may retain the brighter Figma colors because the text label provides the information.
- Information shall never be communicated by color alone.

### 6.5 Keyboard and input

- The only interactive element in the current component is the Continue button.
- It shall be reachable using `Tab`.
- It shall activate using `Enter` and `Space` according to native button behavior.
- Focus order shall follow visual and DOM reading order.
- The target shall be at least `44 × 44px`; the specified `56px` height exceeds this minimum.
- No action shall require a fine pointer or hover.

### 6.6 Reflow, zoom, and text resizing

- At `320px` width, all content shall remain readable without horizontal page scrolling.
- At `200%` browser zoom, the layout shall reflow rather than overlap or clip.
- Text shall not be truncated to preserve Figma's fixed heights.
- Long words shall wrap safely rather than force horizontal overflow.
- Score values shall remain visually distinguishable at increased text size.

### 6.7 Fonts and user preferences

- Provide a system sans-serif fallback after Hanken Grotesk.
- The layout shall remain usable while the web font loads or if it fails.
- Respect `prefers-reduced-motion` for any optional transitions.
- In forced-colors mode, preserve a visible button boundary and focus indicator.

---

## 7. Edge cases

### 7.1 Numeric boundaries

- Scores of `0` and `100` must fit inside the score circle and category rows.
- Three-digit values must not overflow their containers.
- Use tabular numerals when supported.
- Decimal, negative, infinite, `NaN`, or over-maximum values are invalid and trigger the fallback.

### 7.2 Content expansion

- Longer result headings, ratings, comparison text, category labels, and action labels shall wrap without overlap.
- Category score phrases shall remain on one line when possible.
- If a category label requires multiple lines, its row shall grow beyond `56px` rather than clip the text.
- The result overview, summary panel, and composite card shall expand vertically when required.
- The two columns in wide layout shall remain equal in resulting height.

### 7.3 Category count

- The required dataset contains four categories.
- The rendering logic shall tolerate a different positive category count without clipping; the list and card shall grow naturally.
- An empty category array is invalid and triggers the fallback.
- Unknown or duplicate category identifiers are invalid.

### 7.4 Viewport constraints

- Very short viewports shall scroll vertically.
- The wide card must not become inaccessible because of vertical centering.
- Large desktop viewports shall not stretch the card beyond `736px`.
- Narrow viewports shall not show pale page gutters around the full-width result section.

### 7.5 Asset and font failure

- Icon dimensions shall be reserved to avoid layout shift.
- A missing icon shall not remove the visible category name.
- Font fallback shall not cause clipped text or fixed-height overflow.

### 7.6 Interaction integration

- Multiple rapid activations shall invoke the supplied Continue handler once per native activation.
- In the default demo with no handler, activation shall have no destructive side effect.
- The button must not accidentally submit a surrounding form.

### 7.7 Localization boundary

- The first release is English and left-to-right.
- The layout shall tolerate moderate English text expansion.
- Full localization, pluralization, and right-to-left design are outside the initial scope.

---

## 8. Acceptance criteria

### 8.1 Content and data

- **AC-01:** The page displays the Figma content values: overall `76`, Reaction `80`, Memory `92`, Verbal `61`, and Visual `73`.
- **AC-02:** The visible action label is `Continue`; no visible `Label` placeholder remains.
- **AC-03:** All visible result content is generated from one structured local JSON data source.
- **AC-04:** Category rows are generated by iterating over the category array in source order.
- **AC-05:** The overall score remains `76` and is not recalculated as `76.5` or rounded to `77`.
- **AC-06:** Invalid data displays `Results are unavailable.`, hides the score UI and Continue action, and does not display partial results.

### 8.2 Mobile visual and responsive behavior

- **AC-07:** At `375 × 809`, the result overview spans the full viewport width, begins at the top, and has square top corners with `32px` rounded bottom corners.
- **AC-08:** At `375px`, the result overview is approximately `356px` high with the default content and the score circle is `140px`.
- **AC-09:** At `375px`, the summary content has approximately `30px` side gutters and a `24px` gap below the result overview.
- **AC-10:** Below `700px`, the page background is white and the result and summary regions are stacked.
- **AC-11:** At `320px`, the page has no horizontal scrollbar and no label, score, or button content overlaps.

### 8.3 Tablet and desktop visual behavior

- **AC-12:** At `768 × 1080`, the component is a centered two-column card approximately `686–688px` wide and `512px` high with the default content.
- **AC-13:** At `1440 × 1080`, the centered card is `736 × 512px` with two approximately `368px` columns.
- **AC-14:** At wide sizes, the outer card is white, has a `32px` radius, and uses the specified soft blue shadow.
- **AC-15:** At wide sizes, the score circle is `200px` and the summary content is approximately `269px` wide at `768px` and `288px` at the desktop maximum.
- **AC-16:** The card does not grow wider than `736px` on large screens.
- **AC-17:** When content becomes taller than `512px`, the card expands without clipping and remains vertically scrollable.

### 8.4 Typography, color, and assets

- **AC-18:** Hanken Grotesk loads from local repository assets in weights `500`, `700`, and `800`, with a working sans-serif fallback.
- **AC-19:** The result panel and score circle use the two specified vertical gradients.
- **AC-20:** The four category rows use the specified pale backgrounds and provided local icons.
- **AC-21:** Category labels use the accessible colors in section 3.4; decorative icons retain the brighter Figma colors.
- **AC-22:** `Your Result` is white and all meaningful text meets the required contrast ratio at its rendered position.
- **AC-23:** No production asset is loaded from a temporary Figma MCP URL.

### 8.5 Interaction behavior

- **AC-24:** The Continue control is a native `type="button"` element with a minimum height of `56px`.
- **AC-25:** On hover-capable devices, hovering changes the button from navy to the result gradient.
- **AC-26:** Pressing the button retains clear gradient feedback without changing layout dimensions.
- **AC-27:** Keyboard focus displays the specified `3px` blue focus ring with visible offset.
- **AC-28:** The button activates with both `Enter` and `Space`.
- **AC-29:** A supplied Continue handler is invoked once for each activation; without a handler, the page does not reload, navigate, or submit.

### 8.6 Accessibility and resilience

- **AC-30:** The page contains one `<main>`, one `<h1>` for `Your Result`, and one `<h2>` for `Summary`.
- **AC-31:** Category scores use semantic description-list markup or an equivalently strong key-value structure approved during review.
- **AC-32:** Screen readers receive `76 out of 100` as one coherent score phrase and receive each category label with its complete score.
- **AC-33:** Decorative icons are ignored by assistive technology and do not receive focus.
- **AC-34:** At `200%` browser zoom, no content overlaps, clips, or requires horizontal page scrolling.
- **AC-35:** At short viewport heights, all content remains reachable through normal vertical scrolling.
- **AC-36:** The button has an accessible name, visible focus state, and a target size of at least `44 × 44px`.
- **AC-37:** Optional transitions respect `prefers-reduced-motion`.
- **AC-38:** In forced-colors mode, the Continue button and its focus indicator remain visually identifiable.

---

## 9. Out of scope

The first implementation does not include:

- Backend or remote API integration
- Authentication or user-specific persistence
- Editing scores
- Charts or score history
- Loading skeletons
- Animated score counting
- Disabled or loading button variants
- Multiple result cards on one page
- Full internationalization or right-to-left support
- Dark theme
- Navigation destination after Continue
