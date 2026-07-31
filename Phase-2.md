# Phase 2 Task — Implement the Content Model and Runtime Validator

## Decision

Create one closed, runtime-validated data boundary before rendering Results Summary UI.

The imported JSON is not trusted merely because TypeScript can import it. The application accepts only the complete approved schema or rejects the entire object.

## Objective

At completion:

- Default content exists in one local JSON file.
- Category IDs and required order have one runtime source of truth.
- TypeScript types are derived from that source where practical.
- A handwritten validator accepts `unknown` and returns a discriminated result.
- Invalid values are rejected without mutation, clamping, reordering, or partial recovery.
- Node’s built-in test runner covers valid boundaries and meaningful invalid cases.
- The validator and every runtime module it imports are directly executable by Node’s TypeScript type-stripping runtime.
- `pnpm test` and `pnpm build` pass.

## Prerequisites

Phase 1 is complete:

- Node is `22.18.0` or newer.
- `test: node --test` exists.
- `resolveJsonModule` is enabled.
- `allowImportingTsExtensions` remains enabled.
- The current starter still builds.

## Read before editing

- `PLAN.md` Phase 2
- `SPEC.md` sections 3.1 through 3.3
- `frontend/package.json`
- `frontend/tsconfig.json`

## Files to create

```text
frontend/src/data/results.json
frontend/src/results-summary/results-summary.model.ts
frontend/src/results-summary/validate-results-summary.ts
frontend/tests/validate-results-summary.test.mjs
```

Create directories when they do not exist.

## Out of scope

Do not:

- Render DOM
- Import icons
- Create CSS
- Replace `main.ts`
- Remove starter files
- Add a validation dependency
- Add a DOM test environment
- Recalculate the overall score from category scores
- Accept arbitrary category order or maximum scores
- Produce a partial valid object from invalid input
- Introduce path aliases or package-style internal imports

## Required default data

Create `frontend/src/data/results.json` with exactly:

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

Do not add icon paths, CSS colors, prebuilt comparison text, or presentation metadata to JSON.

The comparison sentence is derived later from `percentile`.

## Required model design

### 1. Define category order once

In `results-summary.model.ts`, export an immutable ordered tuple equivalent to:

```ts
export const SCORE_CATEGORY_IDS = [
  "reaction",
  "memory",
  "verbal",
  "visual",
] as const;
```

Derive the ID type from the tuple:

```ts
export type ScoreCategoryId = (typeof SCORE_CATEGORY_IDS)[number];
```

This tuple is the shared source for:

- Runtime order validation
- Category ID typing
- Exhaustive icon mapping in Phase 3
- Test fixtures

Do not maintain a second string union or validator-only category array.

### 2. Define validated data types

Define:

```text
ScoreCategory
ResultsSummaryData
ValidationResult
```

Required shape:

```text
ResultsSummaryData
├── resultHeading: string
├── score: integer 0–100
├── maximumScore: literal 100
├── rating: string
├── percentile: integer 0–100
├── summaryHeading: string
├── actionLabel: string
└── categories: exactly four ScoreCategory values in approved order

ScoreCategory
├── id: ScoreCategoryId
├── label: string
└── score: integer 0–100
```

Use only erasable TypeScript syntax. Do not use:

- `enum`
- Namespace declarations
- Parameter properties
- Decorators
- Runtime aliases that Node cannot resolve

### 3. Define a discriminated validation result

Use a result equivalent to:

```text
{ ok: true, data: ResultsSummaryData }
{ ok: false, issues: string[] }
```

Issue strings include useful field paths, for example:

```text
score must be an integer from 0 through 100
categories[2].id must be "verbal"
actionLabel must contain non-whitespace text
```

Do not throw for ordinary invalid content.

## Node-compatible import contract

The tests import the TypeScript validator directly with Node, not through Vite. Node does not apply `tsconfig.json` path resolution while stripping TypeScript types.

Therefore:

- The test imports the validator with an explicit `.ts` extension.
- Every runtime import reached from the validator also uses an explicit relative `.ts` extension.
- In particular, `validate-results-summary.ts` imports runtime values from `results-summary.model.ts` using a path equivalent to:

```ts
import { SCORE_CATEGORY_IDS } from "./results-summary.model.ts";
```

- Type-only imports also use explicit relative `.ts` paths when present.
- No path alias, extensionless runtime import, directory import, or package export map is introduced.

This contract is compatible with the existing `allowImportingTsExtensions` setting and must be tested with `pnpm test`, not assumed.

## Validator requirements

Create `validate-results-summary.ts` with one public function:

```text
validateResultsSummary(value: unknown): ValidationResult
```

### Root validation

Reject when the root is:

- `null`
- An array
- A string, number, boolean, bigint, symbol, or function

Use a focused helper such as `isRecord` rather than repeated unsafe casts.

### Text validation

These values must be strings containing at least one non-whitespace character:

- `resultHeading`
- `rating`
- `summaryHeading`
- `actionLabel`
- Every category `label`

Validation may use `trim()` to test emptiness, but returned valid strings preserve the original source value.

### Numeric validation

The following must be finite integers from `0` through `100`, inclusive:

- `score`
- `percentile`
- Every category `score`

Reject:

- Negative values
- Values greater than 100
- Decimals
- Numeric strings
- `NaN`
- `Infinity`
- `-Infinity`

`maximumScore` must be the integer literal `100`.

### Category validation

`categories` must:

- Be an array
- Contain exactly four entries
- Contain non-null objects
- Use each approved ID exactly once
- Use exact `SCORE_CATEGORY_IDS` order
- Contain no unknown or duplicate IDs

Do not sort or repair wrong-order input.

### Object shape behavior

Required fields must be present. Strict rejection of unknown extra properties is not required unless implemented consistently and documented.

Do not build a generic schema engine. Use small helpers specialized to this object.

### Mutation rules

The validator must not:

- Modify input
- Replace invalid values
- Clamp numbers
- Round decimals
- Trim returned strings
- Add categories
- Reorder categories
- Derive score values

Use a type assertion only after corresponding runtime checks succeed.

## Test task

Create `frontend/tests/validate-results-summary.test.mjs`.

### Test environment

Use:

```js
import test from "node:test";
import assert from "node:assert/strict";
```

Import the validator through an explicit relative `.ts` path.

Read and parse the real JSON fixture from disk. Resolve paths relative to `import.meta.url`, not the caller’s working directory.

Do not duplicate the complete default object as the primary fixture.

Use `structuredClone()` or an equally clear clone strategy before changing fixture variants.

### Required success tests

Validation succeeds for:

- Actual `results.json`
- Overall score `0`
- Overall score `100`
- Category score `0`
- Category score `100`
- Percentile `0`
- Percentile `100`

Confirm default returned data preserves:

- Overall `76`
- Maximum `100`
- Visual `73`
- Approved category order
- `Continue`

### Required root and text failures

Test rejection of:

- `null`
- Array root
- Primitive root
- Missing required root field
- Blank or whitespace-only result heading
- Blank rating
- Blank summary heading
- Blank action label
- Blank category label

### Required numeric failures

Test rejection of:

- Maximum other than 100
- Negative overall score
- Overall score above 100
- Decimal overall score
- Numeric-string score
- Programmatic `NaN`
- Programmatic infinity
- Out-of-range category score
- Decimal category score
- Percentile below 0
- Percentile above 100
- Decimal percentile

### Required category failures

Test rejection of:

- Missing categories
- Non-array categories
- Empty categories
- Three categories
- Five categories
- Duplicate ID
- Unknown ID
- Missing required ID
- Correct IDs in wrong order
- Non-object category
- Category missing `id`, `label`, or `score`

### Test quality rules

- Use behavior-focused names.
- Test the public validator, not private helpers.
- Avoid depending on issue-array ordering unless deliberately specified.
- Check relevant field-path or message fragments.
- Keep tests deterministic and DOM-free.

## Execution sequence

### 1. Create directories

```bash
mkdir -p frontend/src/data
mkdir -p frontend/src/results-summary
mkdir -p frontend/tests
```

### 2. Add model, then validator

Use explicit `.ts` extensions for runtime internal imports that Node will execute.

### 3. Add valid JSON

Ensure no comments or non-JSON syntax.

### 4. Add tests and run them frequently

From `frontend/`:

```bash
pnpm test
```

A module-resolution failure is a task failure. Do not work around it by moving tests into Vite.

### 5. Run application build

```bash
pnpm build
```

The Vite starter remains rendered, but TypeScript checks new modules.

### 6. Inspect diff

```bash
git status --short
git diff -- frontend/src/data frontend/src/results-summary frontend/tests
```

## Stop conditions

Stop and revise before proceeding when:

- Node cannot import the validator or its model dependency.
- An internal runtime import is extensionless.
- Passing tests require non-erasable TypeScript syntax.
- A path alias is required.
- A validation dependency appears necessary only because the validator became over-generalized.
- Strict TypeScript options are relaxed or bypassed.

Do not silently switch test frameworks. Revise `PLAN.md` explicitly if the runtime strategy proves invalid.

## Verification checklist

- [ ] Default JSON matches approved content.
- [ ] Overall score is independent.
- [ ] Maximum is fixed to 100.
- [ ] Category order has one runtime tuple.
- [ ] ID type derives from the tuple.
- [ ] Validator accepts `unknown`.
- [ ] Validator returns a discriminated result.
- [ ] Invalid data is rejected completely.
- [ ] Validator does not mutate or repair input.
- [ ] Field-path issues are descriptive.
- [ ] Test imports validator with `.ts` extension.
- [ ] Validator runtime imports use explicit `.ts` extensions.
- [ ] No path alias exists in the Node execution path.
- [ ] Tests read actual JSON.
- [ ] Valid numeric boundaries are tested.
- [ ] Invalid root, text, number, and category cases are tested.
- [ ] Tests use Node’s built-in runner.
- [ ] No dependency was added.
- [ ] `pnpm test` passes.
- [ ] `pnpm build` passes.

## Acceptance criteria advanced

- AC-03 — runtime validation exists
- AC-07 — approved default values
- AC-08 — action data is Continue
- AC-09 — one local JSON source
- AC-10 — category source order
- AC-11 — overall score is not recalculated
- AC-12 — non-100 maximum rejected
- AC-13 — invalid category collections rejected
- AC-14 — fallback integration enabled for Phase 4

## Deliverable

A complete, tested, DOM-independent content model and validator directly executable through the declared Node test runtime.

## Suggested commit

```text
feat: add validated results summary data
```

## Handoff to Phase 3

Phase 3 may import:

- `ResultsSummaryData`
- `ScoreCategoryId`
- Validated category structure
- Runtime icon assets

It must not duplicate category IDs, values, or validation rules.