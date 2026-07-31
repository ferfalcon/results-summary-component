import memoryIcon from '../assets/icons/icon-memory.svg'
import reactionIcon from '../assets/icons/icon-reaction.svg'
import verbalIcon from '../assets/icons/icon-verbal.svg'
import visualIcon from '../assets/icons/icon-visual.svg'
import type { ScoreCategoryId } from './results-summary.model.ts'

export const categoryIcons = {
  reaction: reactionIcon,
  memory: memoryIcon,
  verbal: verbalIcon,
  visual: visualIcon,
} satisfies Record<ScoreCategoryId, string>
