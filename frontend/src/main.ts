import './styles/tokens.css'
import './styles/base.css'
import './styles/results-summary.css'

import resultsJson from './data/results.json'
import { renderResultsSummary } from './results-summary/render-results-summary.ts'
import { validateResultsSummary } from './results-summary/validate-results-summary.ts'

const mountNode = document.querySelector<HTMLDivElement>('#app')

if (!mountNode) {
  throw new Error('Unable to mount the application: #app was not found.')
}

const resultsSource: unknown = resultsJson
const validation = validateResultsSummary(resultsSource)
const main = document.createElement('main')

main.className = 'page-shell'

if (validation.ok) {
  main.append(renderResultsSummary(validation.data))
} else {
  const fallback = document.createElement('p')

  fallback.className = 'fallback-message'
  fallback.textContent = 'Results are unavailable.'
  main.append(fallback)

  if (import.meta.env.DEV) {
    console.error('Invalid results summary data:', validation.issues)
  }
}

mountNode.replaceChildren(main)
