# Phase 9 Task — Complete Accessibility, Resilience, and Deployment-Path QA

## Decision

Treat the refined implementation as a release candidate and verify it systematically across build, data, semantics, keyboard input, reflow, text spacing, failure modes, deployment paths, and available browsers.

Record evidence honestly. An unavailable Safari, screen-reader, or forced-colors environment is `Not testable`, not an assumed pass.

## Objective

At completion:

- `pnpm test` and `pnpm build` pass.
- Keyboard and native activation behavior are verified.
- Accessibility-tree output is coherent and non-duplicated.
- Reflow works at 320px, 200% zoom, 400% zoom, and short viewports.
- WCAG text-spacing overrides do not clip content.
- Font, icon, and invalid-data failure modes remain usable.
- Nested-base build output resolves all runtime assets.
- Available browser and forced-colors checks are recorded.
- Every acceptance criterion AC-01 through AC-60 has a working status entry for finalization in Phase 10.

## Prerequisites

Phase 8 is complete:

- Reference-frame fidelity is within reviewed tolerance.
- Intermediate widths remain stable.
- Contrast and interaction states are complete.
- Approved data has been restored.
- Working tree contains only intended implementation changes.

## Read before testing

- `SPEC.md` acceptance criteria AC-01 through AC-60
- `PLAN.md` Phase 9
- `DESIGN.md` accessibility section
- `REVIEW.md`
- Current package scripts
- Current built application

## Files that may be created or updated

Begin a working draft of:

```text
IMPLEMENTATION.md
```

The file may remain incomplete during this phase, but it must contain the QA matrix and evidence needed for Phase 10.

Temporary files may be created only for local testing and must be removed before Phase 10.

## Out of scope

Do not:

- Add Playwright, Cypress, jsdom, Testing Library, or a visual service
- Redesign the component during QA without documenting the failed requirement
- Configure an actual hosting deployment
- Add Continue destination behavior
- Treat an automated accessibility score as proof of accessibility
- Commit invalid JSON fixtures
- Claim unavailable environments were tested

## QA recording format

Create a table or structured list in the `IMPLEMENTATION.md` draft with columns equivalent to:

```text
Criterion
Status: Passed | Failed | Not testable
Evidence
Environment
Follow-up
```

Also record:

```text
Node version
pnpm version
Browser versions
Operating system
Available assistive technology
Available forced-colors environment
```

When a criterion fails:

1. Record the failure.
2. Fix it in the smallest appropriate phase area.
3. Rerun affected tests.
4. Update the status and retain a concise note about the correction.

## Task A — Run automated baseline checks

From `frontend/`:

```bash
pnpm test
pnpm build
```

Confirm:

- Validator tests pass.
- TypeScript compilation passes.
- Vite build succeeds.
- Build output contains no missing asset warning.

Record command results under AC-01 through AC-06 and relevant data criteria.

## Task B — Run production preview

Start:

```bash
pnpm preview
```

Use the printed URL and confirm:

- The production bundle renders the same component as development.
- Title and favicon are correct.
- Font and all four icons resolve.
- No console error appears.
- No temporary development-only path is used.

Stop the preview server after testing.

## Task C — Verify keyboard behavior

Using only the keyboard:

1. Load the page with focus outside the document controls.
2. Press `Tab`.
3. Confirm Continue is the only interactive focus stop.
4. Confirm the complete focus ring is visible.
5. Activate with `Enter`.
6. Activate with `Space`.

Expected behavior:

- Native activation occurs.
- No page reload.
- No form submission.
- No navigation.
- No invented toast or success state.
- Focus remains usable.

Also test keyboard focus while the pointer is hovering over the button on a hover-capable device.

Map evidence to AC-40 through AC-46 and AC-53.

## Task D — Inspect semantic and accessibility-tree output

Use browser accessibility tools and, when available, a real screen reader.

Confirm:

- Exactly one main landmark.
- One level-one heading named `Your Result`.
- One level-two heading named `Summary`.
- One button named `Continue`.
- One description list with four term/definition groups.
- Overall score announced once as `76 out of 100`.
- Each category exposes its label and complete score.
- Visual score fragments are not announced a second time.
- Decorative icons have no accessible name and no focus stop.
- Grouping `<div>` elements inside `<dl>` do not add noisy or misleading roles.

### Screen-reader smoke test

When available, test with one calibrated environment, such as:

- NVDA + Firefox or Chromium on Windows
- VoiceOver + Safari on macOS

Record the exact combination.

When unavailable, mark the real screen-reader smoke test `Not testable`; accessibility-tree inspection can still pass independently.

Map evidence to AC-47 through AC-53.

## Task E — Verify viewport reflow

### 320px viewport

Confirm:

- No horizontal scrollbar.
- All content is readable.
- Category rows do not overlap.
- Score `100` can fit when tested.
- Result panel remains full width.

### 200% desktop zoom

At a common desktop window size:

- Set browser zoom to 200%.
- Confirm content remains reachable.
- Confirm no clipping or overlap.
- Confirm the layout changes when the effective CSS width crosses the 700px breakpoint.

### 400% zoom

From a `1280px`-wide viewport at 100%, set zoom to 400%.

Expected effective layout:

- Approximately 320 CSS pixels.
- Mobile composition.
- No horizontal page scrolling.
- All text and controls reachable.

### Short viewports

Test short portrait and landscape heights.

Confirm:

- Page scrolls vertically.
- Card top is reachable.
- Safe centering does not hide content above the viewport.

Map evidence to AC-20, AC-31, AC-54, and AC-55.

## Task F — Apply WCAG text-spacing overrides

Use browser developer tools, a bookmarklet, or user stylesheet to apply at least:

```css
* {
  line-height: 1.5 !important;
  letter-spacing: 0.12em !important;
  word-spacing: 0.16em !important;
}

p {
  margin-block-end: 2em !important;
}
```

Adapt the paragraph-spacing selector so it affects relevant text without turning the test into an unrelated universal-margin failure.

Confirm:

- Result panel grows.
- Summary panel and card grow.
- Category rows grow.
- Text does not clip or overlap.
- Score phrases remain distinguishable.
- Button label remains visible.
- Focus ring remains visible.
- All content remains reachable.

Map evidence to AC-56.

## Task G — Test font failure

In browser developer tools:

- Block or disable the Hanken Grotesk request.
- Reload the page.

Confirm:

- System sans-serif fallback is used.
- Text remains visible.
- No fixed-height clipping appears.
- Category labels and score phrases remain understandable.
- Mobile and wide layouts remain usable.

Restore normal font loading.

Map evidence to AC-33 and AC-60.

## Task H — Test icon failure

Block one category SVG request.

Confirm:

- The reserved icon box remains.
- Visible category label remains.
- Score remains aligned and understandable.
- Row does not collapse.
- No broken alt text is announced.

Repeat only when the icon-box implementation differs by category; otherwise one representative failure is sufficient.

Restore icon loading.

Map evidence to AC-59.

## Task I — Test invalid-data fallback

Use a temporary uncommitted invalid data change or a temporary local bootstrap fixture.

Required invalid examples:

- `maximumScore` not equal to 100
- Duplicate category
- Reordered categories
- Missing category
- Out-of-range score
- Blank required text

For at least one browser-visible invalid case, confirm:

- Only `Results are unavailable.` renders inside `<main>`.
- Continue is absent.
- No stale score content remains.
- No uncaught runtime error replaces the fallback.

Validator unit tests cover the full matrix. Browser fallback smoke testing only needs enough cases to verify bootstrap integration.

Restore valid data and confirm:

```bash
pnpm test
pnpm build
git diff -- frontend/src/data/results.json
```

The JSON diff must be empty.

Map evidence to AC-12 through AC-14.

## Task J — Run automated accessibility audits

Run available browser tooling, such as:

- Lighthouse accessibility audit
- axe browser extension or equivalent

Review every finding manually.

Do not accept a score alone. Automated tooling may not detect:

- Gradient-position contrast accurately
- Correct screen-reader phrasing
- Safe zoom behavior
- Whether Continue having no outcome is a product limitation

Record meaningful findings and resolutions.

## Task K — Test forced colors

When an environment supports forced-colors emulation or Windows High Contrast:

- Enable forced colors.
- Confirm Continue remains identifiable.
- Confirm the button boundary is visible.
- Confirm keyboard focus is visible.
- Confirm meaningful text remains readable.

When unavailable, record `Not testable` for the environmental verification while retaining a code-review result for the CSS query.

Map evidence to AC-58.

## Task L — Run nested-base deployment smoke test

### 1. Confirm normal build first

```bash
pnpm build
```

### 2. Create a temporary nested-base build

```bash
pnpm exec vite build \
  --base=/results-summary-component/ \
  --outDir=dist-base-test
```

### 3. Inspect output

Confirm generated HTML and asset URLs include the nested base where required.

Check:

- Favicon
- JavaScript entry
- CSS
- Variable font
- Four category SVGs

Search for suspicious root-absolute paths:

```bash
rg -n 'src="/|href="/|url\(/' dist-base-test
```

Review each result. Vite may legitimately output forms that need contextual interpretation.

### 4. Serve the nested-base output when practical

Use an appropriate static server configured so `/results-summary-component/` resolves to the temporary build. Confirm network requests succeed.

This is a smoke test, not hosting configuration.

### 5. Remove temporary output

```bash
rm -rf dist-base-test
```

Confirm it is absent from `git status`.

Map evidence to AC-04 through AC-06 and the deployment-path implementation requirement.

## Task M — Browser coverage

Test current available versions of:

- One Chromium-based browser
- Firefox
- Safari when available

For each, check:

- Page renders
- Variable font loads
- Responsive breakpoint works
- Description list appears sensibly in accessibility tools
- Focus outline is visible
- Button hover/pressed behavior is stable
- No horizontal overflow
- Summary inset formula renders correctly

Record browser name and version.

Do not mark Safari passed when no Safari environment exists.

## Task N — Console and network review

In development and production preview, confirm:

- No JavaScript exception
- No 404 asset request
- No temporary Figma URL
- No runtime request into `docs/design/`
- No source map or development warning that indicates a product issue

Search source:

```bash
rg -n "figma\.com/api/mcp|docs/design" frontend
```

Expected: no runtime reference.

## Acceptance-criteria matrix

Use `SPEC.md` as the checklist. At minimum, group evidence as:

```text
AC-01–06  Build, assets, data configuration
AC-07–14  Content and validation
AC-15–20  Mobile behavior
AC-21–31  Breakpoint, tablet, desktop
AC-32–39  Typography, color, gradients, icons
AC-40–46  Interaction
AC-47–53  Semantics and assistive technology
AC-54–60  Reflow, preferences, and failure modes
```

Every individual AC still needs its own final status.

## Commands summary

From `frontend/`:

```bash
pnpm test
pnpm build
pnpm preview
pnpm exec vite build --base=/results-summary-component/ --outDir=dist-base-test
rm -rf dist-base-test
```

## Stop conditions

Do not pass the release candidate when:

- Any required automated command fails.
- A horizontal scrollbar exists at required widths or zoom.
- Keyboard focus is hidden or clipped.
- Scores are duplicated in the accessibility tree.
- Invalid data renders partial UI.
- Font or icon failure removes meaning.
- Nested-base assets fail.
- A required environment is unavailable but recorded as passed.
- Approved JSON remains modified from a failure test.

## Verification checklist

- [ ] `pnpm test` passes.
- [ ] Normal `pnpm build` passes.
- [ ] Production preview renders without console errors.
- [ ] Keyboard Tab, Enter, and Space behavior is verified.
- [ ] Focus ring is fully visible.
- [ ] Accessibility tree has correct landmark and headings.
- [ ] Overall score is announced once.
- [ ] Category scores are associated correctly.
- [ ] Decorative icons are ignored.
- [ ] 320px reflow passes.
- [ ] 200% zoom passes.
- [ ] 400% zoom passes.
- [ ] Short viewport scrolling passes.
- [ ] Text-spacing override passes.
- [ ] Font failure remains usable.
- [ ] Icon failure remains understandable.
- [ ] Invalid-data fallback is browser-smoke-tested.
- [ ] Automated accessibility findings are reviewed.
- [ ] Forced colors is tested or marked unavailable.
- [ ] Nested-base build passes.
- [ ] Temporary nested build is removed.
- [ ] Chromium is tested.
- [ ] Firefox is tested.
- [ ] Safari is tested or marked unavailable.
- [ ] No runtime Figma or docs path exists.
- [ ] Every AC has a draft status and evidence.

## Deliverable

A release-candidate QA record with evidence and explicit status for AC-01 through AC-60, including honest environmental limitations.

## Suggested commit

When `IMPLEMENTATION.md` draft or QA-driven fixes are included:

```text
test: verify results summary acceptance criteria
```

Do not commit temporary invalid data, browser screenshots, or `dist-base-test`.

## Handoff to Phase 10

Phase 10 will remove all temporary material, finalize `IMPLEMENTATION.md`, update only factually necessary README/document values, run final commands, and prepare the final clean commit.