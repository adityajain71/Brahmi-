import { Identity } from './guestIdentity'
import { getDataForLanguage } from '@/backend/data/index'
import { localizeDigits } from './utils'
import { loadAccountLessonProgress, saveAccountLessonProgress } from './supabase/lessonProgress'

const GUEST_INTRO_PROGRESS_KEY = 'brahmi_guest_intro_progress'

type GuestIntroProgress = {
  completedIds: string[]
  progressMap: Record<string, number>
  lastUpdated: string
}

// Types for introduction lessons
export type IntroLesson = {
  id: string
  module_id: string
  lesson_id: string
  title: string
  subtitle: string
  description: string
  thumbnail_icon: string
  order_no: number
  estimated_time_minutes: number
  is_completed?: boolean
}

export type IntroLessonContent = {
  id: string
  lesson_id: string
  content_type: 'title_slide' | 'text' | 'text_with_image' | 'mcq' | 'questionnaire' | 'quote' | 'key_points' | 'timeline' | 'comparison' | 'summary' | 'staircase_swar' | 'interactive_map'
  title: string
  content: string
  metadata?: any
  order_no: number
}

export type LetterStep = {
  id: string
  title: string
  content: string
  brahmi_symbol?: string
  devanagari_symbol?: string
  image_url?: string
  order_no: number
}

const DEVANAGARI_TO_TAMIL_CONSONANT_MAP: Record<string, string> = {
  'क': 'க', 'ख': 'க்ஹ', 'ग': 'க', 'घ': 'க்ஹ', 'ङ': 'ங',
  'च': 'ச', 'छ': 'ச்ஹ', 'ज': 'ஜ', 'झ': 'ஜ்ஹ', 'ञ': 'ஞ',
  'ट': 'ட', 'ठ': 'ட்ஹ', 'ड': 'ட', 'ढ': 'ட்ஹ', 'ण': 'ண',
  'त': 'த', 'थ': 'த்ஹ', 'द': 'த', 'ध': 'த்ஹ', 'न': 'ந',
  'प': 'ப', 'फ': 'ப்ஹ', 'ब': 'ப', 'भ': 'ப்ஹ', 'म': 'ம',
  'य': 'ய', 'र': 'ர', 'ल': 'ல', 'व': 'வ',
  'श': 'ஶ', 'ष': 'ஷ', 'स': 'ஸ', 'ह': 'ஹ'
}

function getTamilConsonantLabel(devanagari: string): string {
  return DEVANAGARI_TO_TAMIL_CONSONANT_MAP[devanagari] || devanagari
}

/**
 * Get guest intro progress from sessionStorage
 */
function getGuestIntroProgressFromStorage(): { completedIds: string[], progressMap: Record<string, number> } {
  if (typeof window === 'undefined') {
    return { completedIds: [], progressMap: {} }
  }
  try {
    const stored = sessionStorage.getItem(GUEST_INTRO_PROGRESS_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as GuestIntroProgress
      return {
        completedIds: parsed.completedIds || [],
        progressMap: parsed.progressMap || {}
      }
    }
  } catch (error) {
    console.error('Error parsing guest intro progress:', error)
  }
  return { completedIds: [], progressMap: {} }
}

/**
 * Save guest intro progress to sessionStorage
 */
function saveGuestIntroProgressToStorage(completedIds: string[], progressMap: Record<string, number>) {
  if (typeof window === 'undefined') return
  try {
    const progress: GuestIntroProgress = {
      completedIds,
      progressMap,
      lastUpdated: new Date().toISOString()
    }
    sessionStorage.setItem(GUEST_INTRO_PROGRESS_KEY, JSON.stringify(progress))
  } catch (error) {
    console.error('Error saving guest intro progress:', error)
  }
}

/**
 * Update progress for a lesson
 */
/**
 * Update progress for a lesson
 */
export async function saveProgress(
  lessonId: string,
  status: 'not_started' | 'in_progress' | 'completed',
  progress: number,
  identity: Identity
): Promise<void> {
  if (identity.type === 'guest') {
    const { completedIds, progressMap } = getGuestIntroProgressFromStorage()
    progressMap[lessonId] = progress
    if (status === 'completed' && !completedIds.includes(lessonId)) {
      completedIds.push(lessonId)
    }
    saveGuestIntroProgressToStorage(completedIds, progressMap)
    return
  }

  if (!identity.id) {
    return
  }

  await saveAccountLessonProgress('module-intro', lessonId, status, progress, identity.id)
}

/**
 * Save answer for interactive content
 */
export async function saveAnswer(
  lessonId: string,
  contentId: string,
  answer: string,
  isCorrect: boolean,
  identity: Identity
): Promise<void> {
  console.log(`[saveAnswer] Saving answer: lesson=${lessonId}, content=${contentId}, correct=${isCorrect}`)
  // Guest progress logic for answers could be added here if needed
}

/**
 * Get progress for all intro lessons
 */
export async function getIntroProgress(identity: Identity): Promise<{ completedIds: string[], progressMap: Record<string, number> }> {
  if (identity.type === 'guest') {
    return getGuestIntroProgressFromStorage()
  }

  if (!identity.id) {
    return { completedIds: [], progressMap: {} }
  }

  const progressRows = await loadAccountLessonProgress('module-intro', identity.id)
  const completedIds = Object.values(progressRows)
    .filter((entry) => entry.status === 'completed')
    .map((entry) => entry.lesson_id)
  const progressMap = Object.values(progressRows).reduce<Record<string, number>>((accumulator, entry) => {
    accumulator[entry.lesson_id] = entry.progress_percentage || 0
    return accumulator
  }, {})

  return { completedIds, progressMap }
}

/**
 * Get only completed lesson IDs for intro
 */
export async function getCompletedLessonIds(identity: Identity): Promise<string[]> {
  const { completedIds } = await getIntroProgress(identity)
  return completedIds
}

// Fetch introduction lessons for a specific language
export async function getIntroLessons(language: string = 'hi'): Promise<IntroLesson[]> {
  const data = getDataForLanguage(language)
  console.log(`getIntroLessons: Returning ${language} introduction lessons`)
  // Sort by order_no to ensure correct sequence
  return data.introduction.lessons.sort((a: IntroLesson, b: IntroLesson) => a.order_no - b.order_no)
}

// Fetch lesson content for a specific language
export async function getLessonContent(lessonId: string, language: string = 'hi'): Promise<IntroLessonContent[]> {
  const data = getDataForLanguage(language)
  console.log(`[getLessonContent] Returning ${language} content: lessonId=${lessonId}`)
  const lessonContent = data.introduction.content.filter((c: any) => c.lesson_id === lessonId) as IntroLessonContent[]
  return lessonContent
}

/**
 * Get the next lesson ID in the Introduction module
 * Returns null if this is the last lesson
 */
export async function getNextIntroLessonId(currentLessonId: string, language: string = 'hi'): Promise<string | null> {
  const lessons = await getIntroLessons(language)
  const currentIndex = lessons.findIndex(l => l.lesson_id === currentLessonId)
  
  if (currentIndex !== -1 && currentIndex < lessons.length - 1) {
    return lessons[currentIndex + 1].lesson_id
  }
  
  return null // This is the last lesson
}

// Get lesson info by lesson_id for a specific language
export async function getLessonInfo(lessonId: string, language: string = 'hi'): Promise<IntroLesson | null> {
  const data = getDataForLanguage(language)
  console.log(`[getLessonInfo] Returning ${language} lesson info: lessonId=${lessonId}`)
  const lesson = data.introduction.lessons.find((l: any) => l.lesson_id === lessonId)
  return lesson || null
}

/**
 * Fetch letter steps for a specific letter and language.
 */
export async function getLetterSteps(letterId: string, language: string = 'hi'): Promise<LetterStep[]> {
  console.log(`[getLetterSteps] Generating steps: letterId=${letterId}, language=${language}`)
  const data = getDataForLanguage(language)
  const getPracticeMatraExample = (matra: any) => {
    const isInherentMatra = (matra?.order === 1) || !matra?.matraSign
    return matra.example_combination || (isInherentMatra ? 'Consonant only' : '')
  }

  // Helper to build a Letter object compatible with LessonPage
  const buildLetter = (id: string, name: string, brahmi: string | null, order: number, type: 'vowel' | 'consonant') => ({
    id,
    letter_name: name,
    brahmi_symbol: brahmi || '',
    order_no: order || 0,
    letter_type: type
  })

  // Try swar (vowel) data first
  try {
    const swarData = data.swar
    if (letterId === 'practice-time' && swarData.practice_time) {
      const practiceTime = swarData.practice_time
      return [
        {
          id: 'practice-time-step-1',
          step_type: 'show',
          title: practiceTime.title || 'Practice Time',
          content: 'Now you can practice all quizzes and games.',
          order_no: 1,
          letters: buildLetter('practice-time', practiceTime.title || 'Practice Time', '▶', 13, 'vowel')
        },
        {
          id: 'practice-time-step-2',
          step_type: 'explanation',
          title: practiceTime.sections?.section_4_game_time?.game_title || 'Game Time',
          content: 'Roman/Latin → Brahmi. Now you can practice all 12 vowel questions.',
          order_no: 2,
          letters: buildLetter('practice-time', practiceTime.title || 'Practice Time', '▶', 13, 'vowel')
        },
        {
          id: 'practice-time-step-3',
          step_type: 'quiz',
          title: practiceTime.sections?.section_5_quiz1_native_to_brahmi?.title || 'Quiz',
          content: 'Now practice all vowel questions and reverse questions.',
          order_no: 3,
          letters: buildLetter('practice-time', practiceTime.title || 'Practice Time', '▶', 13, 'vowel')
        },
        {
          id: 'practice-time-step-4',
          step_type: 'reward',
          title: practiceTime.sections?.section_8_reward_1?.title || 'Reward',
          content: 'Practice Time completed.',
          order_no: 4,
          letters: buildLetter('practice-time', practiceTime.title || 'Practice Time', '▶', 13, 'vowel')
        }
      ] as unknown as LetterStep[]
    }
    const vowel = swarData.vowels.find((v: any) => v.id === letterId || v.devanagari === letterId)
    if (vowel) {
      const vowelLabel = getVowelDisplayLabel(vowel)
      const letters = buildLetter(vowel.id, vowelLabel, vowel.brahmi || '', vowel.order || 0, 'vowel')
      const steps: any[] = [
        {
          id: `${letterId}-step-1`,
          step_type: 'show',
          title: vowel.identification_title || 'Identification',
          content: vowel.identification_content || `This is the vowel '${vowelLabel}'.`,
          order_no: 1,
          letters
        }
      ]

      // Add Pronunciation step
      if (vowel.devanagari) {
        steps.push({
          id: `${letterId}-step-pronunciation`,
          step_type: 'sound',
          title: vowel.pronunciation_title || 'Pronunciation',
          content: vowel.pronunciation_content || `This vowel is pronounced as '${vowelLabel}'.`,
          order_no: 2,
          letters
        })
      }

      // Add More Info step
      const description = vowel.description || vowel.description_hindi || vowel.description_english || '';
      if (description) {
        steps.push({
          id: `${letterId}-step-description`,
          step_type: 'explanation',
          title: vowel.more_info_title || 'More Info',
          content: description,
          order_no: 3,
          letters
        })
      }

      // Add Example step (try to find matching matra)
      const matraData = data.matras
      const matra = (matraData.matras || []).find((m: any) => m.vowelDevanagari === vowel.devanagari)
      if (matra && matra.example_combination) {
        steps.push({
          id: `${letterId}-step-example`,
          step_type: 'example',
          title: vowel.example_title || 'Example',
          content: getPracticeMatraExample(matra),
          order_no: 4,
          letters
        })
      }

      return steps as unknown as LetterStep[]
    }
  } catch (e) {
    console.error('Error reading swar data in getLetterSteps', e)
  }

  // Try vyanjan (consonant) data next
  try {
    const vyanjanData = data.vyanjan
    const consonant = vyanjanData.consonants.find((c: any) => c.id === letterId || c.devanagari === letterId)
    if (consonant) {
      const letters = buildLetter(consonant.id, consonant.devanagari || '', consonant.brahmi || '', consonant.order || 0, 'consonant')
      const steps: any[] = [
        {
          id: `${letterId}-step-1`,
          step_type: 'show',
          title: consonant.identification_title || 'Identification',
          content: consonant.identification_content || `This is the consonant '${consonant.devanagari}'.`,
          order_no: 1,
          letters
        }
      ]

      // Add Pronunciation step
      if (consonant.devanagari) {
        steps.push({
          id: `${letterId}-step-pronunciation`,
          step_type: 'sound',
          title: consonant.pronunciation_title || 'Pronunciation',
          content: consonant.pronunciation_content || `This consonant is pronounced as '${consonant.romanized || consonant.devanagari}'.`,
          order_no: 2,
          letters
        })
      }

      // Add Category step
      const category = consonant.categoryHindi || consonant.categoryEnglish || consonant.categoryKannada || consonant.categoryTamil || consonant.category;
      if (category) {
        steps.push({
          id: `${letterId}-step-category`,
          step_type: 'explanation',
          title: consonant.category_title || 'Category',
          content: consonant.category_content || `This consonant belongs to the '${category}' category.`,
          order_no: 3,
          letters
        })
      }

      // Add More Info step
      const note = consonant.pronunciationNote || consonant.pronunciationNoteEnglish || consonant.pronunciationNoteHindi || consonant.pronunciationNoteKannada || consonant.pronunciationNoteTamil;
      if (note) {
        steps.push({
          id: `${letterId}-step-description`,
          step_type: 'explanation',
          title: consonant.more_info_title || 'More Info',
          content: note,
          order_no: 4,
          letters
        })
      }

      // Add Example step
      if (consonant.exampleWords && consonant.exampleWords.length > 0) {
        const examples = consonant.exampleWords.map((ex: any) => `${ex.tamil || ex.kannada || ex.devanagari} (${ex.english || ex.romanized})`).join(', ')
        steps.push({
          id: `${letterId}-step-example`,
          step_type: 'example',
          title: consonant.example_title || 'Examples',
          content: consonant.example_content || `Example words: ${examples}`,
          order_no: 5,
          letters
        })
      }

      return steps as unknown as LetterStep[]
    }
  } catch (e) {
    console.error('Error reading vyanjan data in getLetterSteps', e)
  }

  // Try matras data (example / fallback)
  try {
    const matraData = data.matras

    // First try to resolve matra by lesson mapping: some routes pass a lesson_id like 'matras-lesson-005'
    const matraLesson = (matraData.lessons || []).find((l: any) => l.lesson_id === letterId)
    let matra: any | undefined

    if (matraLesson) {
      const lessonSymbol = matraLesson.matra_symbol
      // Try to find a matra entry matching the lesson's matra symbol or order
      matra = (matraData.matras || []).find((m: any) =>
        m.matraSign === lessonSymbol || m.vowelBrahmi === lessonSymbol || (m.exampleBrahmi && m.exampleBrahmi.includes(lessonSymbol)) || m.order === matraLesson.order_no
      )

      // If not found, construct a minimal matra object from the lesson data as a fallback
      if (!matra) {
        matra = {
          id: matraLesson.lesson_id,
          order: matraLesson.order_no || 0,
          vowelDevanagari: matraLesson.title || '',
          matraName: matraLesson.title || '',
          matraSign: matraLesson.matra_symbol || '',
          exampleBrahmi: matraLesson.matra_symbol || ''
        }
      }
    } else {
      matra = (matraData.matras || []).find((m: any) => m.id === letterId || m.matraId === letterId)
    }

    if (matra) {
      const letters = buildLetter(matra.id, matra.matraName || '', matra.vowelBrahmi || '', matra.order || 0, 'vowel')
      const steps: any[] = [
        {
          id: `${letterId}-step-1`,
          step_type: 'show',
          title: matra.identification_title || 'Identification',
          content: matra.identification_content || `This is the matra '${matra.matraName}'.`,
          order_no: 1,
          letters
        }
      ]

      // Add More Info step
      const description = matra.description || matra.descriptionEnglish || matra.descriptionHindi;
      if (description) {
        steps.push({
          id: `${letterId}-step-2`,
          step_type: 'explanation',
          title: matra.more_info_title || 'More Info',
          content: description,
          order_no: 2,
          letters
        })
      }

      // Add Example step
      if (matra.example_combination) {
        steps.push({
          id: `${letterId}-step-3`,
          step_type: 'example',
          title: matra.example_title || 'Example',
          content: getPracticeMatraExample(matra),
          order_no: 3,
          letters
        })
      }

      return steps as unknown as LetterStep[]
    }
  } catch (e) {
    console.error('Error reading matra data in getLetterSteps', e)
  }

  // If nothing found, return empty
  console.warn(`[getLetterSteps] No letter found for id=${letterId}`)
  return []
}

/**
 * Fetch quiz questions for a specific letter and language.
 */
export async function getLetterQuiz(letterId: string, language: string = 'hi'): Promise<any[]> {
  console.log(`[getLetterQuiz] Fetching quiz: letterId=${letterId}, language=${language}`)
  const data = getDataForLanguage(language)
  const quizQuestions: any[] = []

  const getVowelLabel = (vowelId: string): string => {
    const vowel = data.swar?.vowels?.find((entry: any) => entry.id === vowelId)
    return vowel?.tamil || vowel?.kannada || vowel?.title || vowel?.romanized || vowel?.devanagari || ''
  }

  const getKannadaConsonantLabel = (consonantIdOrDevanagari: string): string => {
    const consonant = data.vyanjan?.consonants?.find((entry: any) => entry.id === consonantIdOrDevanagari || entry.devanagari === consonantIdOrDevanagari)
    return consonant?.tamil || consonant?.kannada || consonant?.devanagari || ''
  }

  // 1. Try Swar Quizzes
  if (data.swar) {
    const swar = data.swar
    const swarVowels = (swar.vowels || []) as any[]

    const isPracticeMode = letterId === 'practice-time'
    const tamilQ1Source = Array.isArray((swar as any).section_5_quiz1_native_to_brahmi?.questions)
      ? (swar as any).section_5_quiz1_native_to_brahmi.questions.map((question: any, index: number) => ({
          id: question.id || `quiz1-${String(index + 1).padStart(3, '0')}`,
          order: index + 1,
          question: question.question,
          question_type: 'devanagari_to_brahmi',
          correct_answer: question.correct,
          correct_vowel_id: swarVowels[index]?.id || `swar-${String(index + 1).padStart(3, '0')}`,
          wrong_options: (question.options_brahmi || [])
            .filter((option: string) => option !== question.correct)
            .map((option: string, wrongIndex: number) => ({
              id: `wrong-${String(index + 1).padStart(3, '0')}-${wrongIndex}`,
              brahmi: option,
              vowel_id: swarVowels.find((v: any) => v.brahmi === option)?.id || ''
            }))
        }))
      : []

    const tamilQ2Source = Array.isArray((swar as any).section_10_quiz2_brahmi_to_native?.questions)
      ? (swar as any).section_10_quiz2_brahmi_to_native.questions.map((question: any, index: number) => ({
          id: question.id || `quiz2-${String(index + 1).padStart(3, '0')}`,
          order: index + 1,
          question: question.brahmi,
          question_type: 'brahmi_to_devanagari',
          correct_answer: question.correct,
          correct_vowel_id: swarVowels[index]?.id || `swar-${String(index + 1).padStart(3, '0')}`,
          wrong_options: (question.options || [])
            .filter((option: string) => option !== question.correct)
            .map((option: string, wrongIndex: number) => ({
              id: `wrong-quiz2-${String(index + 1).padStart(3, '0')}-${wrongIndex}`,
              devanagari: option,
              vowel_id: swarVowels.find((v: any) => v.devanagari === option)?.id || ''
            }))
        }))
      : []

    const tamilTfSource = (() => {
      const pageContainer = (swar as any).section_15_true_false_quiz_stage_4?.pages || {}
      const pages = Object.values(pageContainer) as any[]
      return pages.flatMap((page: any, pageIndex: number) => {
        return Object.entries(page || {}).map(([key, item]: any, itemIndex: number) => {
          const order = pageIndex * 4 + itemIndex + 1
          return {
            id: `tf-${String(order).padStart(3, '0')}`,
            order,
            question_english: item.text,
            correct_answer: !!item.answer,
            vowel_id: swarVowels[order - 1]?.id || `swar-${String(order).padStart(3, '0')}`
          }
        })
      })
    })()

    const q1Base = swar.quiz1_devanagari_to_brahmi || tamilQ1Source
    const q2Base = swar.quiz2_brahmi_to_devanagari || tamilQ2Source
    const tfBase = swar.true_false_questions || tamilTfSource

    const q1Source = isPracticeMode ? q1Base : q1Base.filter((q: any) => q.correct_vowel_id === letterId)
    const q2Source = isPracticeMode ? q2Base : q2Base.filter((q: any) => q.correct_vowel_id === letterId)
    const tfSource = isPracticeMode ? tfBase : tfBase.filter((q: any) => q.vowel_id === letterId)
    
    // Quiz 1: Devanagari to Brahmi
    q1Source.forEach((q: any) => {
      quizQuestions.push({
        id: q.id,
        letter_id: letterId,
        question: q.question || q.title_english || `${getVowelLabel(q.correct_vowel_id)} ?`,
        order_no: q.order,
        options: [
          { id: `${q.id}-opt-correct`, question_id: q.id, option_text: q.correct_answer, is_correct: true, order_no: 1 },
          ...q.wrong_options.map((w: any, idx: number) => ({
            id: `${q.id}-opt-wrong-${idx}`,
            question_id: q.id,
            option_text: w.brahmi,
            is_correct: false,
            order_no: idx + 2
          }))
        ].sort(() => Math.random() - 0.5)
      })
    })

    // Quiz 2: Brahmi to Devanagari
    q2Source.forEach((q: any) => {
      quizQuestions.push({
        id: q.id,
        letter_id: letterId,
        question: q.question || q.title_english || `${q.brahmi} ?`,
        order_no: q.order,
        options: [
          { id: `${q.id}-opt-correct`, question_id: q.id, option_text: getVowelLabel(q.correct_vowel_id), is_correct: true, order_no: 1 },
          ...q.wrong_options.map((w: any, idx: number) => ({
            id: `${q.id}-opt-wrong-${idx}`,
            question_id: q.id,
            option_text: getVowelLabel(w.vowel_id),
            is_correct: false,
            order_no: idx + 2
          }))
        ].sort(() => Math.random() - 0.5)
      })
    })

    // True/False questions
    tfSource.forEach((q: any) => {
      quizQuestions.push({
        id: q.id,
        letter_id: letterId,
        question: q.question_english || q.question_hindi || q.question || '',
        order_no: q.order,
        options: [
          { id: `${q.id}-opt-true`, question_id: q.id, option_text: 'True / சரி / ಸರಿ / सत्य', is_correct: q.correct_answer === true, order_no: 1 },
          { id: `${q.id}-opt-false`, question_id: q.id, option_text: 'False / தவறு / ತಪ್ಪು / असत्य', is_correct: q.correct_answer === false, order_no: 2 }
        ]
      })
    })
  }

  // 2. Try Vyanjan Quizzes (Auto-generated matching)
  if (data.vyanjan) {
    const vyanjan = data.vyanjan
    const consonant = (vyanjan.consonants || []).find((c: any) => c.id === letterId)
    if (consonant) {
      const correctLabel = getKannadaConsonantLabel(consonant.id)
      // Add a Devanagari to Brahmi matching question
      quizQuestions.push({
        id: `quiz-vyanjan-${letterId}-1`,
        letter_id: letterId,
        question: `Choose the correct Brahmi for '${correctLabel}':`,
        order_no: 1,
        options: [
          { id: `opt-v1-correct`, question_id: `quiz-vyanjan-${letterId}-1`, option_text: consonant.brahmi, is_correct: true, order_no: 1 },
          // Pick 3 random wrong options from other consonants
          ...vyanjan.consonants
            .filter((c: any) => c.id !== letterId)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map((w: any, idx: number) => ({
              id: `opt-v1-wrong-${idx}`,
              question_id: `quiz-vyanjan-${letterId}-1`,
              option_text: w.brahmi,
              is_correct: false,
              order_no: idx + 2
            }))
        ].sort(() => Math.random() - 0.5)
      })

      // Add a Brahmi to Devanagari matching question
      quizQuestions.push({
        id: `quiz-vyanjan-${letterId}-2`,
        letter_id: letterId,
        question: `Choose the correct letter for Brahmi '${consonant.brahmi}':`,
        order_no: 2,
        options: [
          { id: `opt-v2-correct`, question_id: `quiz-vyanjan-${letterId}-2`, option_text: correctLabel, is_correct: true, order_no: 1 },
          // Pick 3 random wrong options from other consonants
          ...vyanjan.consonants
            .filter((c: any) => c.id !== letterId)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map((w: any, idx: number) => ({
              id: `opt-v2-wrong-${idx}`,
              question_id: `quiz-vyanjan-${letterId}-2`,
              option_text: getKannadaConsonantLabel(w.id),
              is_correct: false,
              order_no: idx + 2
            }))
        ].sort(() => Math.random() - 0.5)
      })
    }
  }

  return quizQuestions
}
