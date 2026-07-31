# Phase 2 Task — Implement the Content Model and Runtime Validator

## Decision

Create one closed, runtime-validated data boundary before rendering any Results Summary UI.

The imported JSON is not trusted merely because TypeScript can import it. The application must accept only the complete approved schema or reject the entire object.

## Objective

At completion:

- Default content exists in one local JSON file.
- Category IDs and required order have one runtime source of truth.
- TypeScript types are derived from that source where practical.
- A handwritten validator accepts `unknown` and returns a discriminated result.
- Invalid values are rejected without mutation, clamping, reordering, or partial recovery.
- Node’s built-in test runner covers valid boundaries and meaningful invalid cases.
- `pnpm test` and `pnpm build` both pass.

## Prerequisites

Phase 1 is complete:

- Node is `22.18.0` or newer.
- `test: node --test` exists.
- `resolveJsonModule` is enabled.
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

Create the directories when they do not exist.

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
- Accept arbitrary category order or arbitrary maximum scores
- Produce a partial valid object from invalid input

## Required default data

Create `frontend/src/data/results.json` with exactly this content model and values:

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

Do not add icon paths, CSS color names, prebuilt comparison text, or presentation metadata to JSON.

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

Derive the ID type from the tuple rather than maintaining a separate string union:

```ts
export type ScoreCategoryId = (typeof SCORE_CATEGORY_IDS)[number];
```

This tuple is the shared source for:

- Runtime order validation
- Category ID typing
- Exhaustive icon mapping in Phase 3
- Test fixtures

### 2. Define the validated data types

Define:

```text
ScoreCategory
ResultsSummaryData
ValidationIssue or string issue representation
ValidationResult
```

The required shape is:

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

Issue strings should include useful field paths, for example:

```text
score must be an integer from 0 through 100
categories[2].id must be "verbal"
actionLabel must contain non-whitespace text
```

Do not throw for ordinary invalid content.

## Validator requirements

Create `validate-results-summary.ts` with one exported public function:

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

Do not silently trim and replace source values. Validation may use `trim()` to test emptiness, but valid returned data should reflect the original validated strings.

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

`maximumScore` must be the integer literal `100`. Any other value is invalid.

### Category validation

`categories` must:

- Be an array
- Contain exactly four entries
- Contain non-null objects
- Use each approved ID exactly once
- Use the exact order from `SCORE_CATEGORY_IDS`
- Contain no unknown or duplicate IDs

Do not sort or reorder valid-looking input. Wrong order is invalid.

### Object shape behavior

The specification requires the required fields. A strict unknown-property rejection is not required unless implemented consistently and documented.

Do not spend this phase building a generic schema engine. Use small, readable helpers specialized to this object.

### Mutation rules

The validator must not:

- Modify the input object
- Replace invalid values
- Clamp numbers
- Round decimals
- Trim returned strings
- Add missing categories
- Reorder categories
- Derive score values

Use a type assertion only after all corresponding runtime checks have passed.

## Test task

Create `frontend/tests/validate-results-summary.test.mjs`.

### Test environment

Use:

```js
import test from "node:test";
import assert from "node:assert/strict";
```

Import the TypeScript validator with an explicit `.ts` relative path. Do not use a Vite alias.

Read and parse the real JSON fixture from disk. Resolve paths relative to `import.meta.url` so tests do not depend on the caller’s current working directory.

Do not duplicate the complete default object as the primary fixture.

Use `structuredClone()` or an equivalent clear clone strategy before changing fixture variants.

### Required success tests

Test that validation succeeds for:

- The actual `results.json` file
- Overall score `0`
- Overall score `100`
- Each category score boundary `0`
- Each category score boundary `100`
- Percentile `0`
- Percentile `100`

Confirm the returned data preserves:

- Overall score `76` for the default fixture
- Maximum score `100`
- Visual score `73`
- Approved category order
- `Continue` action label

### Required root and text failure tests

Test rejection of:

- `null`
- Array root
- Primitive root values
- Missing `resultHeading`
- Missing another required root field
- Blank or whitespace-only `resultHeading`
- Blank `rating`
- Blank `summaryHeading`
- Blank `actionLabel`
- Blank category label

### Required numeric failure tests

Test rejection of:

- `maximumScore` equal to 99 or another non-100 value
- Negative overall score
- Overall score greater than 100
- Decimal overall score
- Numeric-string overall score
- `NaN` overall score supplied programmatically
- Infinite overall score supplied programmatically
- Category score outside range
- Decimal category score
- Percentile below 0
- Percentile above 100
- Decimal percentile

### Required category failure tests

Test rejection of:

- Missing `categories`
- Non-array `categories`
- Empty categories
- Three categories
- Five categories
- Duplicate category ID
- Unknown category ID
- Missing required category ID
- Correct IDs in wrong order
- Non-object category entry
- Category missing `id`, `label`, or `score`

### Test quality rules

- Give each test a behavior-focused name.
- Test public validator behavior, not private helper implementation.
- Do not make tests depend on issue-array ordering unless ordering is a deliberate contract.
- When checking errors, prefer confirming the relevant field path or message fragment.
- Keep tests deterministic and DOM-free.

## Execution sequence

### 1. Create directories

From the repository root:

```bash
mkdir -p frontend/src/data
mkdir -p frontend/src/results-summary
mkdir -p frontend/tests
```

### 2. Add the model and validator

Implement the model first, then the validator. Keep modules small and focused.

### 3. Add the actual JSON fixture

Validate that the file contains no trailing comments or non-JSON syntax.

### 4. Add tests

Run frequently from `frontend/`:

```bash
pnpm test
```

### 5. Run the application build

```bash
pnpm build
```

The Vite starter remains the rendered UI in this phase, but TypeScript must type-check the new modules.

### 6. Inspect the diff

```bash
git status --short
git diff -- frontend/src/data frontend/src/results-summary frontend/tests
```

## Stop conditions

Stop and resolve before proceeding when:

- Node cannot import the `.ts` validator under the declared runtime.
- Passing tests require non-erasable TypeScript syntax.
- A path alias is required by the test setup.
- A validation dependency appears necessary only because the validator became over-generalized.
- `pnpm build` fails because strict TypeScript options were relaxed or bypassed.

Do not silently switch test frameworks. Revise `PLAN.md` explicitly if the chosen runtime strategy proves invalid.

## Verification checklist

- [ ] Default JSON exactly matches the approved content.
- [ ] Overall score is stored independently.
- [ ] `maximumScore` is fixed to 100.
- [ ] Category order has one shared runtime tuple.
- [ ] ID type is derived from the tuple.
- [ ] Validator accepts `unknown`.
- [ ] Validator returns a discriminated result.
- [ ] Invalid data is rejected as a complete object.
- [ ] Validator does not mutate or repair input.
- [ ] Field-path issues are descriptive.
- [ ] Tests read the actual JSON fixture.
- [ ] Valid numeric boundaries are tested.
- [ ] Invalid root, text, number, and category cases are tested.
- [ ] Tests use Node’s built-in runner.
- [ ] No dependency was added.
- [ ] `pnpm test` passes.
- [ ] `pnpm build` passes.

## Acceptance criteria advanced

- AC-03 — imported data is runtime-validated before score markup is later rendered
- AC-07 — approved default values exist
- AC-08 — action data is `Continue`
- AC-09 — visible content has one future local JSON source
- AC-10 — category source order is defined
- AC-11 — overall score is not recalculated
- AC-12 — non-100 maximum is rejected
- AC-13 — invalid category collections are rejected
- AC-14 — invalid-data behavior is enabled for Phase 4 integration

## Deliverable

A complete, tested, DOM-independent content model and runtime validator that accepts only the approved Results Summary schema.

## Suggested commit

```text
feat: add validated results summary data
```

## Handoff to Phase 3

Phase 3 may import:

- `ResultsSummaryData`
- `ScoreCategoryId`
- The validated category structure
- The runtime icon assets copied in Phase 1

Phase 3 must not duplicate category IDs, content values, or validation rules.