# Review — Figma, DESIGN.md, and SPEC.md

## Review status

This review compares:

- The Figma mobile, tablet, and desktop frames
- The Figma component and button variants
- `DESIGN.md`
- `SPEC.md`
- The current Vite and TypeScript project structure under `frontend/`

The review focuses on contradictions, responsive gaps, accessibility requirements, unclear assumptions, and implementation risks.

The source documents were updated as part of this review. This file records what changed and what still requires implementation-time verification.

---

## 1. Overall conclusion

The design and specification are now aligned enough to proceed to implementation planning.

The core visual structure was already accurately documented, but the previous documents contained several contradictions caused by decisions being resolved in `SPEC.md` without being synchronized back into `DESIGN.md`. The previous specification also generalized parts of the data model beyond what the visual design and acceptance criteria could safely support.

The review resolved those issues by:

- Synchronizing resolved decisions across both documents
- Constraining the first-release data schema to the actual four-category, 100-point design
- Completing missing mobile and wide-layout requirements
- Expanding accessibility requirements beyond color contrast and keyboard focus
- Making runtime asset and JSON-import requirements compatible with the repository structure
- Adding build and breakpoint acceptance criteria

No unresolved contradiction currently blocks planning.

---

## 2. Findings and changes

### 2.1 Contradictory unresolved decisions

**Finding:** `DESIGN.md` still described the button copy, button Active mapping, responsive switch, contrast remediation, and data states as unresolved, while `SPEC.md` had already made final decisions.

**Risk:** An implementer could follow the older unresolved language, re-open settled decisions, or produce a hybrid of Figma placeholders and specification requirements.

**Change:** `DESIGN.md` now records the production resolutions:

- Button copy: `Continue`
- Active variant: hover and pressed
- Focus: separate visible ring
- Layout switch: `700px`
- Overall score: independent data
- Maximum score: exactly `100`
- Accessible label and secondary-score colors
- Invalid-data fallback with no loading state

**Status:** Resolved.

---

### 2.2 Arbitrary maximum score contradicted the visual system

**Finding:** The previous data rules allowed any positive `maximumScore`, while the Figma composition, copy, score widths, edge-case tests, and acceptance criteria all assumed `100`.

**Risk:** A value such as `1000` could pass validation but overflow the score circle and invalidate the fixed “out of 100” semantics.

**Change:** The first release now requires `maximumScore` to equal `100`. Any other maximum triggers the complete invalid-data fallback.

**Tradeoff:** The component is less generic, but the contract is now honest and testable. Supporting arbitrary scoring scales would require a separate design exercise.

**Status:** Resolved.

---

### 2.3 Category-count flexibility contradicted the closed category mapping

**Finding:** The previous specification said the renderer should tolerate a different positive category count while the category ID type and presentation map only supported four known IDs.

**Risk:** The contract appeared extensible but could not define icons, colors, ordering, or validation for additional categories.

**Change:** The validator now requires exactly four unique categories in Figma order:

1. Reaction
2. Memory
3. Verbal
4. Visual

Rendering still iterates over one array and uses one reusable row path.

**Tradeoff:** Future categories require an explicit schema and design update rather than silently inheriting incomplete behavior.

**Status:** Resolved.

---

### 2.4 Runtime assets were specified as design-document paths

**Finding:** The source fonts and SVGs live under `docs/design/`, while the Vite application root is `frontend/`.

**Risk:** Direct production imports from documentation folders create fragile paths and can conflict with Vite root and file-serving boundaries. The documentation directory should remain a design source, not an application runtime dependency.

**Change:** The specification now requires exact copies of the needed source assets inside an application-owned runtime location under `frontend/` while preserving `docs/design/` unchanged.

**Status:** Resolved in documentation; implementation pending.

---

### 2.5 JSON import requirement did not include TypeScript configuration

**Finding:** `SPEC.md` required build-time JSON import, but the current `frontend/tsconfig.json` did not explicitly enable JSON-module resolution.

**Risk:** The required data strategy could fail TypeScript’s build step even if Vite can process JSON.

**Change:** The specification now requires TypeScript JSON-module resolution and adds a build acceptance criterion. The imported JSON must also pass runtime validation before rendering.

**Status:** Resolved in documentation; implementation pending.

---

### 2.6 Runtime validation was under-specified

**Finding:** The previous specification required validation but did not clearly distinguish TypeScript inference or assertions from runtime validation.

**Risk:** An unsafe cast could satisfy the compiler while malformed JSON still produces partial or misleading UI.

**Change:** The specification now states that the imported value must be validated at runtime and that the complete object is rejected when any field fails. No partial score UI may render.

**Status:** Resolved.

---

### 2.7 Mobile shadow was missing from functional requirements

**Finding:** Figma and `DESIGN.md` place the soft blue shadow on the full-width mobile result panel, but the previous responsive requirements and acceptance criteria only explicitly tested the wide-card shadow.

**Risk:** A visually important separation effect could be omitted on mobile without failing the specification.

**Change:** Mobile responsive rules and acceptance criteria now require the shadow.

**Status:** Resolved.

---

### 2.8 Wide result alignment was implicit

**Finding:** Figma vertically and horizontally centers the result content, but the previous wide-layout requirements only specified dimensions and gaps.

**Risk:** A top-aligned implementation could satisfy most measurements while visibly diverging from Figma.

**Change:** Both result and summary default content are now explicitly centered within their wide columns.

**Status:** Resolved.

---

### 2.9 Breakpoint behavior needed stronger definition

**Finding:** The `700px` switch was defined, but the page-width relationship and the exact threshold transition were not fully testable.

**Risk:** The implementation could overflow at the threshold or reproduce the tablet frame with brittle fixed widths.

**Change:** The specification now defines:

- Mobile below `700px`
- Wide layout at `700px` and above
- Approximately `40px` wide-layout page gutters
- A `736px` card maximum
- Explicit checks at `699px`, `700px`, and `701px`

At `768px`, the resulting available width is approximately `688px`, intentionally within tolerance of the Figma `686px` card.

**Status:** Resolved; visual verification pending.

---

### 2.10 Safe vertical centering was not explicit enough

**Finding:** The card should be centered on wide, tall viewports, but ordinary centering strategies can place overflowing content above the reachable viewport on short screens.

**Risk:** Browser zoom, text spacing, or a short landscape viewport could make the top of the card unreachable.

**Change:** The page shell now requires safe centering: center only when the card and required padding fit; otherwise use normal flow and vertical scrolling.

**Status:** Resolved.

---

### 2.11 Accessibility coverage stopped short of WCAG reflow and text spacing

**Finding:** The previous documents covered `320px`, `200%` zoom, contrast, semantics, focus, reduced motion, and forced colors, but omitted:

- High-zoom reflow equivalent to a `320px` CSS viewport
- WCAG text-spacing override behavior
- Document language and title
- Focus not being clipped or obscured
- Visible text during font loading

**Risk:** The component could pass the original acceptance list while still clipping at high zoom or under user text styles.

**Change:** The specification now requires:

- `400%` zoom testing from a `1280px` viewport
- Text-spacing overrides for line, paragraph, letter, and word spacing
- `<html lang="en">`
- Meaningful document title
- `font-display: swap` or equivalent
- Unclipped focus ring
- Normal scrolling on short viewports

**Status:** Resolved in documentation; implementation and testing pending.

---

### 2.12 Category secondary score contrast needed an explicit production color

**Finding:** Figma uses navy at 50% opacity for `/ 100`, which is too light on the pale row backgrounds.

**Risk:** The maximum score is meaningful text, not decoration, and could fail normal-text contrast.

**Change:** Production uses solid `#5F677B` for the slash and maximum score.

**Status:** Resolved.

---

### 2.13 Gradient-position contrast remains a rendered-output risk

**Finding:** `#CAC9FF` changes contrast as the result and score gradients change beneath it.

**Risk:** Endpoint calculations alone do not prove the actual comparison message and score maximum pass at their rendered positions.

**Change:** Both documents require browser verification at the actual positions. If either fails, the foreground must be lightened while preserving hierarchy.

**Status:** Open verification item; not a specification contradiction.

---

## 3. Responsive review matrix

| Width or condition | Required composition | Review concern |
|---|---|---|
| `320px` | Full-width mobile result plus fluid-gutter summary | Verify no overflow with `100 / 100`, long labels, and focus ring |
| `375px` | Match mobile reference | Verify `356px` default result height, `30px` gutters, and mobile shadow |
| `699px` | Mobile composition | Verify a large full-width result panel still feels intentional |
| `700px` | First wide composition | Verify two columns fit without score-row compression |
| `701px` | Stable wide composition | Verify no one-pixel oscillation or overflow |
| `768px` | Match tablet reference | Verify approximately `688px` card and summary content proportions |
| `1440px` | Match desktop reference | Verify `736 × 512px` default card |
| Short landscape | Composition based on width, normal vertical scrolling | Verify safe centering fallback |
| `400%` zoom | Effective narrow reflow | Verify no horizontal page scrolling |
| Text-spacing override | Containers grow | Verify rows, card, and focus ring remain intact |

---

## 4. Accessibility review outcome

The documentation now covers:

- Landmark and heading hierarchy
- Semantic description-list structure
- Native button behavior
- Coherent screen-reader score phrases
- Decorative icon handling
- Text and non-text contrast
- Accessible production color deviations
- Keyboard activation
- Visible focus and focus coexistence with hover
- Target size
- Reflow at narrow widths and high zoom
- Text-spacing overrides
- Reduced motion
- Forced colors
- Font loading and fallback
- Document language and title
- Short-viewport reachability

### Remaining accessibility verification

Implementation review must still verify:

- Actual gradient-position contrast
- Screen-reader output without duplicate number fragments
- Focus ring visibility in forced colors
- Layout under text-spacing overrides
- Layout with the fallback font

---

## 5. Implementation risks

### 5.1 Starter-code replacement

The current application is still the default Vite starter. Implementation must remove starter-specific assets, counter behavior, and unrelated markup without damaging the Vite and TypeScript build setup.

### 5.2 Asset duplication

Copying design assets into `frontend/` creates intentional duplication. The implementation plan should identify the design-source path and runtime path clearly so future updates do not modify one copy and forget the other.

### 5.3 JSON validation complexity

The schema is small enough for a focused manual validator. Over-engineering it with a dependency or generic validation framework would add unnecessary weight; under-engineering it with a type assertion would violate the fallback contract.

### 5.4 CSS breakpoint discontinuity

The layout changes substantially at `700px`: page background, outer container, corner treatment, score size, typography, and column structure all change together. Testing immediately around the threshold is mandatory.

### 5.5 Fixed visual heights versus accessibility growth

The `356px` mobile result and `512px` wide card are visual targets, not maximums. Implementations that use fixed heights or hidden overflow are likely to fail zoom and text-spacing requirements.

### 5.6 Accessible color divergence

Automated screenshot comparison against Figma will show intentional differences in:

- Result heading color
- Reaction label color
- Memory label color
- Verbal label color
- Category maximum-score color
- Focus ring

Visual review must not classify these documented accessibility changes as regressions.

### 5.7 Continue behavior

The button has no destination or success behavior in the current product scope. Implementation should provide a clean callback boundary and avoid inventing navigation.

### 5.8 Invalid-state appearance

Figma contains no invalid-data state. The fallback should remain minimal and accessible rather than introducing an unreviewed branded error component.

---

## 6. Review decisions and tradeoffs

### Exact four-category schema

**Decision:** Validate exactly four known categories.

**Benefit:** Honest mapping between data, icon, color, order, and visual design.

**Cost:** Additional categories require a future design and schema change.

### Exact 100-point maximum

**Decision:** Require `100`.

**Benefit:** Prevents unsupported score lengths and keeps accessible phrases consistent.

**Cost:** The component is not a generic arbitrary-scale result card.

### `700px` breakpoint

**Decision:** Keep the reviewed `700px` threshold.

**Benefit:** Provides approximately `620px` of card space after wide gutters and can support two minimum viable columns.

**Cost:** The mobile composition remains active on relatively wide small-tablet viewports. This must be visually checked rather than assumed correct.

### Runtime asset copies

**Decision:** Copy exact source assets under `frontend/`.

**Benefit:** Stable Vite ownership and no dependency on documentation or temporary URLs.

**Cost:** Requires disciplined synchronization if source assets change.

### Accessibility color corrections

**Decision:** Preserve bright category colors on icons and use darker colors on text.

**Benefit:** Retains category identity while meeting contrast requirements.

**Cost:** Text will not be pixel-identical to Figma.

---

## 7. Final review checklist

The documents are ready for `PLAN.md` when the following statements remain true:

- [x] Figma reference dimensions are documented.
- [x] Mobile and wide compositions are structurally distinct.
- [x] The responsive switch is explicit.
- [x] Threshold behavior is testable.
- [x] Content order and semantics are explicit.
- [x] Data validation is complete and non-partial.
- [x] The scoring scale and category set are honest constraints.
- [x] Button copy and states are resolved.
- [x] Accessibility color deviations are documented.
- [x] High zoom, text spacing, forced colors, and reduced motion are covered.
- [x] Runtime asset ownership is defined.
- [x] Build compatibility requirements are included.
- [x] Remaining uncertainties are implementation-verification items rather than hidden assumptions.

---

## 8. Recommended next step

Create `PLAN.md` with small, reviewable implementation stages. The plan should begin with project cleanup, runtime asset placement, data validation, and semantic markup before visual styling and responsive refinement.
