// ─────────────────────────────────────────────────────────────
// Course Content Types
// Single source of truth: content/{lang}/course.json
// ─────────────────────────────────────────────────────────────

// ── Introduction Screen Types ──────────────────────────────────

export type ScreenType =
  | 'language_select'
  | 'text'
  | 'story'
  | 'info'
  | 'goal_selection'
  | 'questionnaire'
  | 'daily_goal'
  | 'character'
  | 'character_group'
  | 'matra'
  | 'matra_table'
  | 'matra_rules'
  | 'tracing'
  | 'mcq'
  | 'matching'
  | 'fill_blank'
  | 'true_false'
  | 'reward'
  | 'completion'
  | 'title_slide'
  | 'form_pronunciation'
  | 'bina_matra'
  | 'matra_combinations'
  | 'pronunciation_drill'
  | 'recognition_mcq'
  | 'reverse_mcq'
  | 'matching_game'
  | 'trace_practice'
  | 'practice_modes'
  | 'quiz_mode'
  | 'mixed_quiz'
  | 'summary'

export interface BaseScreen {
  page?: number
  type: ScreenType
  button?: string
}

export interface LanguageSelectScreen extends BaseScreen {
  type: 'language_select'
  title: string
  options: string[]
}

export interface TextScreen extends BaseScreen {
  type: 'text' | 'story'
  content: string
  title?: string
  subtitle?: string
}

export interface InfoScreen extends BaseScreen {
  type: 'info'
  title: string
  content: string
}

export interface GoalSelectionScreen extends BaseScreen {
  type: 'goal_selection'
  title: string
  options: string[]
}

export interface QuestionnaireScreen extends BaseScreen {
  type: 'questionnaire'
  title: string
  options: string[]
}

export interface DailyGoalScreen extends BaseScreen {
  type: 'daily_goal'
  title: string
  options: string[]
}

export type IntroScreen =
  | LanguageSelectScreen
  | TextScreen
  | InfoScreen
  | GoalSelectionScreen
  | QuestionnaireScreen
  | DailyGoalScreen

// ── Vowel / Swar Types ──────────────────────────────────────────

export interface Vowel {
  id: string
  order: number
  devanagari: string
  brahmi: string
  romanized: string
}

export interface VowelDisplayGroup {
  pageStart: number
  vowels: string[]
}

export interface MatraTableEntry {
  vowel: string
  matraSign: string | null
  note?: string
}

export interface MatraRule {
  ruleNumber: number
  title: string
  description: string
  examples?: string[]
  example?: string
}

export interface Reward {
  id?: string
  page?: number
  badge: string
  points: number
  message?: string
}

export interface SwarSection {
  sourcePages: number[]
  vowels: Vowel[]
  vowelDisplayGroups: VowelDisplayGroup[]
  practicePrompt: {
    page: number
    prompt: string
    yes: string
    no: string
  }
  rewards: Reward[]
  matraIntro: {
    sourcePages: number[]
    text1: string
    text2: string
  }
  matraTable: MatraTableEntry[]
  matraRules: MatraRule[]
}

// ── Consonant / Vyanjan Types ───────────────────────────────────

export interface ConsonantItem {
  number: number
  id: string
  devanagari: string
  brahmi: string
  romanized: string
}

export interface ConsonantGroup {
  groupId: string
  groupName: string
  groupNote: string
  sourcePage?: number
  items: ConsonantItem[]
}

export interface MatraCombination {
  vowel: string
  matraSign: string | null
  combinedDevanagari: string
  combinedBrahmi: string
}

export interface ConsonantLesson {
  consonant: string
  brahmi: string
  consonantId: string
  sourcePages?: number[]
  exampleWords: Array<{ devanagari: string; romanized: string }>
  drill: string
  matraCombinations: MatraCombination[]
  reward: { badge: string; points: number }
}

export interface VyanjanSection {
  sourcePages: number[]
  intro: { page: number; title: string; subtitle: string }
  groups: ConsonantGroup[]
  matraCombinationTemplate: Array<{ vowel: string; matraSign: string | null }>
  consonantLessons: ConsonantLesson[]
}

// ── Root Course Type ────────────────────────────────────────────

export interface CourseMeta {
  source: string
  sourceFile: string
  totalPages: number
  language: string
}

export interface IntroductionSection {
  sourcePages: number[]
  steps: IntroScreen[]
}

export interface MatraTracingCard {
  vowel: string
  independentForm: string
  matraSign: string | null
  uxNote?: string
  exampleShown?: string
}

export interface MatraSection {
  sourcePages?: number[]
  pathChoiceScreen: {
    sourcePages: number[]
    prompt: string
    options: string[]
    note?: string
    confirmationMessage: string
  }
  matraTracingCards: {
    sourcePages: number[]
    note?: string
    items: MatraTracingCard[]
  }
  matraTable_sourcePages?: number[]
}

export interface Course {
  meta: CourseMeta
  introduction: IntroductionSection
  swar: SwarSection
  matra: MatraSection
  vyanjan: VyanjanSection
}

// ── Derived / Computed Types ────────────────────────────────────

/** Flat module list derived from course JSON for the map/dashboard */
export interface CourseModule {
  id: string
  title: string
  subtitle: string
  icon: string
  iconType: 'text' | 'emoji'
  route: string
  order: number
  locked?: boolean
  lessonCount?: number
}

/** A renderable lesson node — used by LessonPlayer */
export interface LessonNode {
  id: string
  moduleId: string
  title: string
  screens: IntroScreen[]
  reward?: Reward
}

// ── Quiz Types (generated from JSON at runtime) ─────────────────

export interface QuizOption {
  id: string
  text: string
  brahmi?: string
  devanagari?: string
  isCorrect: boolean
}

export interface QuizQuestion {
  id: string
  type: 'mcq' | 'reverse_mcq' | 'true_false' | 'fill_blank' | 'matching'
  question: string
  options?: QuizOption[]
  correctAnswer?: string | boolean
  explanation?: string
}
