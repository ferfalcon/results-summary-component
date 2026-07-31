export const SCORE_CATEGORY_IDS = [
  'reaction',
  'memory',
  'verbal',
  'visual',
] as const

export type ScoreCategoryId = (typeof SCORE_CATEGORY_IDS)[number]

export type ScoreCategory = {
  readonly id: ScoreCategoryId
  readonly label: string
  readonly score: number
}

export type ResultsSummaryData = {
  readonly resultHeading: string
  readonly score: number
  readonly maximumScore: 100
  readonly rating: string
  readonly percentile: number
  readonly summaryHeading: string
  readonly actionLabel: string
  readonly categories: readonly [
    ScoreCategory,
    ScoreCategory,
    ScoreCategory,
    ScoreCategory,
  ]
}

export type ValidationResult =
  | { readonly ok: true; readonly data: ResultsSummaryData }
  | { readonly ok: false; readonly issues: readonly string[] }
