import { categoryIcons } from './category-icons.ts'
import type {
  ResultsSummaryData,
  ScoreCategory,
} from './results-summary.model.ts'

export type RenderResultsSummaryOptions = {
  readonly onContinue?: () => void
}

function createScoreItem(
  category: ScoreCategory,
  maximumScore: number,
): HTMLDivElement {
  const item = document.createElement('div')
  const topic = document.createElement('dt')
  const iconBox = document.createElement('span')
  const icon = document.createElement('img')
  const label = document.createElement('span')
  const value = document.createElement('dd')
  const visualValue = document.createElement('span')
  const achieved = document.createElement('span')
  const maximum = document.createElement('span')
  const accessibleValue = document.createElement('span')

  item.className = 'score-item'
  item.dataset.category = category.id

  topic.className = 'score-item__topic'
  iconBox.className = 'score-item__icon-box'
  icon.className = 'score-item__icon'
  icon.src = categoryIcons[category.id]
  icon.alt = ''
  icon.width = 20
  icon.height = 20
  icon.draggable = false
  label.className = 'score-item__label'
  label.textContent = category.label
  iconBox.append(icon)
  topic.append(iconBox, label)

  value.className = 'score-item__value'
  visualValue.className = 'score-item__visual'
  visualValue.setAttribute('aria-hidden', 'true')
  achieved.className = 'score-item__achieved'
  achieved.textContent = String(category.score)
  maximum.className = 'score-item__maximum'
  maximum.textContent = `/ ${maximumScore}`
  visualValue.append(achieved, maximum)

  accessibleValue.className = 'visually-hidden'
  accessibleValue.textContent = `${category.score} out of ${maximumScore}`
  value.append(visualValue, accessibleValue)

  item.append(topic, value)
  return item
}

export function renderResultsSummary(
  data: ResultsSummaryData,
  options: RenderResultsSummaryOptions = {},
): HTMLElement {
  const root = document.createElement('div')
  const resultOverview = document.createElement('section')
  const resultContent = document.createElement('div')
  const resultHeading = document.createElement('h1')
  const scoreDisplay = document.createElement('div')
  const scoreVisual = document.createElement('div')
  const score = document.createElement('span')
  const scoreMaximum = document.createElement('span')
  const accessibleScore = document.createElement('span')
  const feedback = document.createElement('div')
  const rating = document.createElement('p')
  const message = document.createElement('p')
  const summaryPanel = document.createElement('section')
  const summaryContent = document.createElement('div')
  const summaryHeading = document.createElement('h2')
  const scoreList = document.createElement('dl')
  const continueButton = document.createElement('button')

  root.className = 'results-summary'

  resultOverview.className = 'result-overview'
  resultContent.className = 'result-overview__content'
  resultHeading.className = 'result-overview__heading'
  resultHeading.textContent = data.resultHeading

  scoreDisplay.className = 'score-display'
  scoreVisual.className = 'score-display__visual'
  scoreVisual.setAttribute('aria-hidden', 'true')
  score.className = 'score-display__score'
  score.textContent = String(data.score)
  scoreMaximum.className = 'score-display__maximum'
  scoreMaximum.textContent = `of ${data.maximumScore}`
  scoreVisual.append(score, scoreMaximum)

  accessibleScore.className = 'visually-hidden'
  accessibleScore.textContent = `${data.score} out of ${data.maximumScore}`
  scoreDisplay.append(scoreVisual, accessibleScore)

  feedback.className = 'result-feedback'
  rating.className = 'result-feedback__rating'
  rating.textContent = data.rating
  message.className = 'result-feedback__message'
  message.textContent =
    `You scored higher than ${data.percentile}% of the people who have taken these tests.`
  feedback.append(rating, message)
  resultContent.append(resultHeading, scoreDisplay, feedback)
  resultOverview.append(resultContent)

  summaryPanel.className = 'summary-panel'
  summaryContent.className = 'summary-panel__content'
  summaryHeading.className = 'summary-panel__heading'
  summaryHeading.textContent = data.summaryHeading
  scoreList.className = 'score-list'

  for (const category of data.categories) {
    scoreList.append(createScoreItem(category, data.maximumScore))
  }

  continueButton.className = 'continue-button'
  continueButton.type = 'button'
  continueButton.textContent = data.actionLabel

  if (options.onContinue) {
    continueButton.addEventListener('click', options.onContinue)
  }

  summaryContent.append(summaryHeading, scoreList, continueButton)
  summaryPanel.append(summaryContent)
  root.append(resultOverview, summaryPanel)

  return root
}
