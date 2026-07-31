import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { validateResultsSummary } from '../src/results-summary/validate-results-summary.ts'

const fixtureUrl = new URL('../src/data/results.json', import.meta.url)
const fixture = JSON.parse(readFileSync(fixtureUrl, 'utf8'))

function cloneFixture() {
  return structuredClone(fixture)
}

function expectInvalid(value, issueFragment) {
  const result = validateResultsSummary(value)

  assert.equal(result.ok, false)
  assert.ok(
    result.issues.some((issue) => issue.includes(issueFragment)),
    `Expected an issue containing "${issueFragment}", received: ${result.issues.join(', ')}`,
  )
}

test('accepts the actual default results fixture', () => {
  const result = validateResultsSummary(fixture)

  assert.equal(result.ok, true)

  if (!result.ok) {
    return
  }

  assert.equal(result.data.score, 76)
  assert.equal(result.data.maximumScore, 100)
  assert.equal(result.data.categories[3].score, 73)
  assert.deepEqual(
    result.data.categories.map(({ id }) => id),
    ['reaction', 'memory', 'verbal', 'visual'],
  )
  assert.equal(result.data.actionLabel, 'Continue')
})

for (const [name, mutate] of [
  ['overall score 0', (data) => { data.score = 0 }],
  ['overall score 100', (data) => { data.score = 100 }],
  ['category score 0', (data) => { data.categories[0].score = 0 }],
  ['category score 100', (data) => { data.categories[0].score = 100 }],
  ['percentile 0', (data) => { data.percentile = 0 }],
  ['percentile 100', (data) => { data.percentile = 100 }],
]) {
  test(`accepts ${name}`, () => {
    const data = cloneFixture()
    mutate(data)

    assert.equal(validateResultsSummary(data).ok, true)
  })
}

test('preserves valid source strings without trimming them', () => {
  const data = cloneFixture()
  data.rating = '  Great  '
  const result = validateResultsSummary(data)

  assert.equal(result.ok, true)

  if (result.ok) {
    assert.equal(result.data.rating, '  Great  ')
  }
})

for (const [name, value] of [
  ['null root', null],
  ['array root', []],
  ['string root', 'invalid'],
  ['number root', 76],
  ['boolean root', true],
]) {
  test(`rejects ${name}`, () => {
    expectInvalid(value, 'root')
  })
}

test('rejects a missing required root field', () => {
  const data = cloneFixture()
  delete data.score

  expectInvalid(data, 'score')
})

for (const field of [
  'resultHeading',
  'rating',
  'summaryHeading',
  'actionLabel',
]) {
  test(`rejects blank ${field}`, () => {
    const data = cloneFixture()
    data[field] = '   '

    expectInvalid(data, field)
  })
}

test('rejects a blank category label', () => {
  const data = cloneFixture()
  data.categories[2].label = '\t'

  expectInvalid(data, 'categories[2].label')
})

for (const [name, field, value, issue] of [
  ['maximum other than 100', 'maximumScore', 99, 'maximumScore'],
  ['negative overall score', 'score', -1, 'score'],
  ['overall score above 100', 'score', 101, 'score'],
  ['decimal overall score', 'score', 76.5, 'score'],
  ['numeric-string score', 'score', '76', 'score'],
  ['NaN overall score', 'score', Number.NaN, 'score'],
  ['infinite overall score', 'score', Number.POSITIVE_INFINITY, 'score'],
  ['percentile below 0', 'percentile', -1, 'percentile'],
  ['percentile above 100', 'percentile', 101, 'percentile'],
  ['decimal percentile', 'percentile', 65.5, 'percentile'],
]) {
  test(`rejects ${name}`, () => {
    const data = cloneFixture()
    data[field] = value

    expectInvalid(data, issue)
  })
}

for (const [name, value] of [
  ['out-of-range category score', 101],
  ['negative category score', -1],
  ['decimal category score', 61.5],
  ['numeric-string category score', '61'],
]) {
  test(`rejects ${name}`, () => {
    const data = cloneFixture()
    data.categories[2].score = value

    expectInvalid(data, 'categories[2].score')
  })
}

test('rejects missing categories', () => {
  const data = cloneFixture()
  delete data.categories

  expectInvalid(data, 'categories must be an array')
})

test('rejects non-array categories', () => {
  const data = cloneFixture()
  data.categories = {}

  expectInvalid(data, 'categories must be an array')
})

for (const [name, categories] of [
  ['empty categories', []],
  ['three categories', cloneFixture().categories.slice(0, 3)],
  [
    'five categories',
    [
      ...cloneFixture().categories,
      { id: 'visual', label: 'Visual', score: 73 },
    ],
  ],
]) {
  test(`rejects ${name}`, () => {
    const data = cloneFixture()
    data.categories = categories

    expectInvalid(data, 'exactly 4')
  })
}

test('rejects a duplicate category id', () => {
  const data = cloneFixture()
  data.categories[1].id = 'reaction'

  expectInvalid(data, 'categories[1].id')
})

test('rejects an unknown category id', () => {
  const data = cloneFixture()
  data.categories[2].id = 'language'

  expectInvalid(data, 'categories[2].id')
})

test('rejects a missing category id', () => {
  const data = cloneFixture()
  delete data.categories[0].id

  expectInvalid(data, 'categories[0].id')
})

test('rejects correct category ids in the wrong order', () => {
  const data = cloneFixture()
  ;[data.categories[0], data.categories[1]] = [
    data.categories[1],
    data.categories[0],
  ]

  expectInvalid(data, 'categories[0].id')
})

test('rejects a non-object category', () => {
  const data = cloneFixture()
  data.categories[1] = null

  expectInvalid(data, 'categories[1]')
})

for (const field of ['id', 'label', 'score']) {
  test(`rejects a category missing ${field}`, () => {
    const data = cloneFixture()
    delete data.categories[3][field]

    expectInvalid(data, `categories[3].${field}`)
  })
}
