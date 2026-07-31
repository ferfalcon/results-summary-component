# Phase 0 Task — Establish a Clean Baseline

## Decision

Verify the existing Vite starter, local toolchain, and zero-dependency testing prerequisites before changing product code.

This phase is a gate. Do not begin Phase 1 until the baseline build is understood and Node satisfies the runtime requirement used by the planned `node:test` setup.

## Objective

Produce a trustworthy starting point that distinguishes pre-existing repository or environment problems from regressions introduced by the Results Summary implementation.

At completion:

- The starter application installs, builds, and runs.
- Node and pnpm versions are recorded.
- Node is at least `22.18.0`.
- The repository working tree is clean.
- Relevant project-local web guidance has been reviewed.
- The Figma mobile, tablet, desktop, and button-state references are available for later phases.

## Read before starting

Review these files without editing them:

- `PLAN.md`
- `DESIGN.md`
- `SPEC.md`
- `REVIEW.md`
- `frontend/package.json`
- `frontend/tsconfig.json`
- `frontend/src/main.ts`
- `frontend/src/style.css`
- `.agents/skills/modern-web-guidance/SKILL.md`
- `.agents/skills/modern-web-guidance/references/accessibility.md`
- `.agents/skills/modern-web-guidance/references/css-layouts.md`

Use `SPEC.md` as the functional and accessibility authority. Use Figma and `DESIGN.md` for visual intent.

## Scope

This phase includes:

- Environment inspection
- Dependency installation
- Baseline build verification
- Baseline runtime smoke test
- Working-tree verification
- Review of implementation guidance
- Preservation of visual references

## Out of scope

Do not:

- Modify product source files
- Add dependencies
- Add tests
- Change Node requirements in `package.json`
- Copy runtime assets
- Remove Vite starter files
- Begin the Results Summary implementation
- Create `IMPLEMENTATION.md` yet

## Working branch

Create and use a focused branch:

```bash
git switch -c feat/results-summary-component
```

When the branch already exists locally, switch to it rather than creating a duplicate.

Do not perform implementation work directly on `main`.

## Step-by-step task

### 1. Confirm repository state

From the repository root:

```bash
git status --short
git branch --show-current
```

Expected result:

- The working tree has no uncommitted changes.
- The active branch is the focused feature branch.

When unrelated changes already exist, stop. Preserve or resolve them before continuing; do not hide them with a broad stash without understanding their ownership.

### 2. Record the toolchain

From `frontend/`:

```bash
node --version
pnpm --version
```

Record both values in working notes or the eventual pull-request description.

Required Node decision:

- `v22.18.0` or newer: continue.
- Older than `v22.18.0`: stop and update the local Node environment, or revise `PLAN.md` and the testing strategy explicitly.

Do not silently install Vitest, Jest, or another test framework as a workaround.

### 3. Install the existing application

From `frontend/`:

```bash
pnpm install
```

Check:

- Installation completes successfully.
- The lockfile is not unexpectedly rewritten.
- No dependency is added or removed.

When `pnpm-lock.yaml` changes during a no-change install, inspect the diff and tool version before continuing.

### 4. Build the untouched starter

Run:

```bash
pnpm build
```

Capture:

- Exit status
- TypeScript errors, if any
- Vite warnings, if any
- Output directory creation

Any pre-existing failure must be recorded before implementation. Do not attribute it later to a Results Summary change.

### 5. Run the starter application

Start the development server:

```bash
pnpm dev
```

Open the printed local URL and confirm:

- The Vite starter renders.
- The browser console has no unexpected error.
- Current assets resolve.
- The page is responsive enough to confirm the server is serving the intended project.

Stop the server after the smoke test.

### 6. Review local web guidance

Run the Modern Web Guidance search when network access is available:

```bash
npx -y modern-web-guidance@latest search "build a semantic responsive results summary component with CSS Grid, focus-visible, reflow, and safe overflow" --skill-version 2026_05_16-c5e78707
```

Retrieve only clearly relevant guidance. Independently read the bundled accessibility and CSS-layout references even when the search cannot run.

Record any guidance that materially changes implementation choices. Do not introduce an API or dependency merely because it appears in a guide.

### 7. Preserve visual references

Confirm access to the Figma frames and repository references for:

- Mobile: `375 × 809`
- Tablet: `768 × 1080`
- Desktop: `1440 × 1080`
- Default button state
- Gradient Active button state

Also confirm these local files exist:

```text
docs/design/mobile-design.jpg
docs/design/desktop-design.jpg
docs/design/desktop-preview.jpg
docs/design/active-states.jpg
```

Figma remains the primary visual source. Local JPGs are supporting references.

### 8. Recheck the working tree

After all baseline commands:

```bash
git status --short
```

Expected result: no product or lockfile changes.

## Stop conditions

Stop this phase and resolve the issue before proceeding when:

- Node is below `22.18.0`.
- `pnpm install` fails.
- The untouched starter does not build.
- The development server does not render the expected project.
- The working tree contains unexplained changes.
- Required Figma or design-source references are unavailable.

Do not compensate by changing implementation architecture inside this phase.

## Verification checklist

- [ ] Active work is on a focused feature branch.
- [ ] Initial working tree was clean.
- [ ] Node version was recorded.
- [ ] Node is `22.18.0` or newer.
- [ ] pnpm version was recorded.
- [ ] `pnpm install` completed.
- [ ] `pnpm build` completed before product changes.
- [ ] The Vite starter rendered in a browser.
- [ ] Browser console was checked.
- [ ] Relevant local web guidance was reviewed.
- [ ] Figma mobile, tablet, desktop, and button-state references are available.
- [ ] Final working tree remains clean.

## Evidence to retain

Keep a small baseline record containing:

```text
Node:
pnpm:
Baseline install:
Baseline build:
Baseline runtime:
Pre-existing warnings:
Unavailable tools or environments:
```

This evidence will be summarized later in `IMPLEMENTATION.md`; do not create that file during Phase 0.

## Acceptance criteria supported

This phase does not complete a visual acceptance criterion. It establishes the trustworthy environment required to evaluate:

- AC-01 — production build succeeds
- The Node-based validation test gate used from Phase 2 onward

## Deliverable

A verified, unchanged, buildable starter on the focused feature branch with documented environment details.

## Commit guidance

No commit is expected when this phase produces no file changes.

When a pre-existing repository fix is genuinely required, stop and document it as a separate task rather than mixing it into Results Summary implementation.