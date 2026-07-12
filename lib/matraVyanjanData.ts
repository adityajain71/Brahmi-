/**
 * matraVyanjanData.ts
 *
 * Typed loader for brahmi_matra_vyanjan_final.json.
 * Provides slide arrays for the Matra and Vyanjan lesson modules.
 */

// ── Raw JSON Types ────────────────────────────────────────────────

export type MatraSlideType =
  | 'path_choice_confirmation'
  | 'reward'
  | 'text'
  | 'matra_table_entry'
  | 'matra_rule'
  | 'matra_tracing_card'

export type VyanjanSlideType =
  | 'text'
  | 'choice_screen'
  | 'group_list'
  | 'consonant_selection_recap'
  | 'bonus_title'
  | 'form_pronunciation'
  | 'bina_matra'
  | 'matra_combinations'
  | 'pronunciation_drill'
  | 'recognition_mcq'
  | 'reverse_mcq'
  | 'matching_game'
  | 'fill_blank'
  | 'trace_practice'
  | 'trace_loop_reference'
  | 'summary'
  | 'practice_modes'
  | 'quiz_modes'
  | 'mixed_quiz'
  | 'matra_recap_intro'

// Matra slide shapes
export interface MatraSlide {
  page: number
  type: MatraSlideType
  // reward
  badge?: string
  points?: number
  message?: string
  // text / confirmation
  content?: string
  note?: string
  // matra_table_entry
  vowel?: string
  matraSign?: string | null
  // matra_rule
  ruleNumber?: number
  title?: string
  description?: string
  examples?: string[]
  example?: string
  guidance?: string
  // matra_tracing_card
  independentForm?: string
  uxNote?: string
  exampleShown?: string
}

// Vyanjan slide shapes
export interface MatraCombinationForm {
  vowel: string
  matraSign: string | null
  combinedDevanagari: string
  combinedBrahmi: string
  note?: string
}

export interface GroupListItem {
  number: number
  devanagari: string
  brahmi: string
}

export interface GroupList {
  groupName: string
  groupNote?: string
  items: GroupListItem[]
}

export interface MCQExample {
  prompt: string
  answer: string
}

export interface FillBlankQuestion {
  prompt: string
  answer: string
}

export interface VyanjanSlide {
  page?: number
  sourcePages?: number[]
  type: VyanjanSlideType
  // shared
  content?: string
  note?: string
  title?: string
  consonant?: string
  consonantBrahmi?: string
  // group_list
  groupName?: string
  groupNote?: string
  items?: GroupListItem[]
  // consonant_selection_recap
  groupsRecap?: GroupList[]
  // bonus_title / text
  subtitle?: string
  // form_pronunciation
  drill?: string
  // matra_combinations
  forms?: MatraCombinationForm[]
  // recognition_mcq / reverse_mcq
  examples?: MCQExample[]
  // matching_game
  columnA?: string[]
  columnB?: string[]
  // fill_blank
  questions?: FillBlankQuestion[]
  // practice_modes / quiz_modes / mixed_quiz
  modes?: string[]
  // summary
  bonusUnlock?: string
  // prompt (choice_screen)
  prompt?: string
}

// ── Loader ───────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-require-imports
const RAW = require('@/brahmi_matra_vyanjan_final.json') as {
  matra: MatraSlide[]
  vyanjan: VyanjanSlide[]
}

export function getMatraSlides(): MatraSlide[] {
  return RAW.matra
}

export function getVyanjanSlides(): VyanjanSlide[] {
  return RAW.vyanjan
}

/**
 * Returns the page number for a slide (handles sourcePages fallback).
 */
export function getSlidePageNumber(slide: VyanjanSlide | MatraSlide): number {
  if ('page' in slide && slide.page !== undefined) return slide.page
  if ('sourcePages' in slide && slide.sourcePages && slide.sourcePages.length > 0) {
    return slide.sourcePages[0]
  }
  return 0
}

/**
 * Groups vyanjan slides by consonant. Returns a map: devanagari → slides[]
 * The group_list / selection slides are returned under the '__intro__' key.
 */
export function getVyanjanByConsonant(): { key: string; slides: VyanjanSlide[] }[] {
  const slides = getVyanjanSlides()
  const groups: { key: string; slides: VyanjanSlide[] }[] = []
  let current: { key: string; slides: VyanjanSlide[] } = { key: '__intro__', slides: [] }

  for (const slide of slides) {
    if (slide.type === 'bonus_title' && slide.consonant) {
      if (current.slides.length > 0) groups.push(current)
      current = { key: slide.consonant, slides: [slide] }
    } else {
      current.slides.push(slide)
    }
  }
  if (current.slides.length > 0) groups.push(current)
  return groups
}

/**
 * All unique consonants that have a full lesson cycle in the JSON.
 */
export function getVyanjanConsonants(): { devanagari: string; brahmi: string }[] {
  return getVyanjanSlides()
    .filter(s => s.type === 'bonus_title' && s.consonant && s.consonantBrahmi)
    .map(s => ({ devanagari: s.consonant!, brahmi: s.consonantBrahmi! }))
}
