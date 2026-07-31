import {
  SCORE_CATEGORY_IDS,
  type ResultsSummaryData,
  type ValidationResult,
} from './results-summary.model.ts'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNonBlankString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isScore(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 100
  )
}

export function validateResultsSummary(value: unknown): ValidationResult {
  if (!isRecord(value)) {
    return {
      ok: false,
      issues: ['root must be a non-null object'],
    }
  }

  const issues: string[] = []
  const textFields = [
    'resultHeading',
    'rating',
    'summaryHeading',
    'actionLabel',
  ] as const

  for (const field of textFields) {
    if (!isNonBlankString(value[field])) {
      issues.push(`${field} must contain non-whitespace text`)
    }
  }

  if (!isScore(value.score)) {
    issues.push('score must be an integer from 0 through 100')
  }

  if (value.maximumScore !== 100) {
    issues.push('maximumScore must equal 100')
  }

  if (!isScore(value.percentile)) {
    issues.push('percentile must be an integer from 0 through 100')
  }

  if (!Array.isArray(value.categories)) {
    issues.push('categories must be an array')
  } else {
    if (value.categories.length !== SCORE_CATEGORY_IDS.length) {
      issues.push(`categories must contain exactly ${SCORE_CATEGORY_IDS.length} entries`)
    }

    for (let index = 0; index < SCORE_CATEGORY_IDS.length; index += 1) {
      const category = value.categories[index]
      const path = `categories[${index}]`

      if (!isRecord(category)) {
        issues.push(`${path} must be a non-null object`)
        continue
      }

      if (category.id !== SCORE_CATEGORY_IDS[index]) {
        issues.push(`${path}.id must equal ${SCORE_CATEGORY_IDS[index]}`)
      }

      if (!isNonBlankString(category.label)) {
        issues.push(`${path}.label must contain non-whitespace text`)
      }

      if (!isScore(category.score)) {
        issues.push(`${path}.score must be an integer from 0 through 100`)
      }
    }
  }

  if (issues.length > 0) {
    return { ok: false, issues }
  }

  return {
    ok: true,
    data: value as ResultsSummaryData,
  }
}
