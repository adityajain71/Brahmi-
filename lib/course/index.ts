/**
 * Course Engine — lib/course/index.ts
 *
 * Single source of truth: content/{lang}/course.json
 * All functions are pure, synchronous, and type-safe.
 * Import lazily to avoid bundling all language JSONs at once.
 */

import type {
  Course,
  CourseModule,
  Vowel,
  ConsonantItem,
  ConsonantGroup,
  ConsonantLesson,
  MatraCombination,
  MatraTableEntry,
  IntroScreen,
  Reward,
  QuizQuestion,
  QuizOption,
} from '@/types/course'

// ── JSON Loaders (per-language, cached) ─────────────────────────

const courseCache: Record<string, Course> = {}

export function getCourse(language: string = 'hi'): Course {
  if (courseCache[language]) return courseCache[language]

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const data = require(`@/content/${language}/course.json`) as Course
    courseCache[language] = data
    return data
  } catch {
    // Fallback to Hindi if language not found
    if (language !== 'hi') {
      console.warn(`[CourseEngine] No course.json for "${language}", falling back to "hi"`)
      return getCourse('hi')
    }
    throw new Error(`[CourseEngine] Could not load course.json for language: ${language}`)
  }
}

// ── Module List (for map / dashboard) ──────────────────────────

export function getCourseModules(language: string = 'hi'): CourseModule[] {
  const course = getCourse(language)

  const vowelCount = course.swar.vowels.length
  const consonantCount = Array.isArray(course.vyanjan) 
    ? course.vyanjan.filter((s: any) => s.type === 'form_pronunciation' || s.type === 'matra_table_entry').length || 33
    : course.vyanjan.groups?.reduce((acc: number, g: any) => acc + g.items.length, 0) || 33

  return [
    {
      id: 'module-intro',
      title: language === 'hi' ? 'परिचय' : 'Introduction',
      subtitle: language === 'hi' ? 'ब्राह्मी का इतिहास' : 'History of Brahmi',
      icon: '📜',
      iconType: 'emoji',
      route: '/onboarding',
      order: 1,
      locked: false,
      lessonCount: course.introduction.steps.length,
    },
    {
      id: 'module-swar',
      title: language === 'hi' ? 'स्वर (Swar)' : 'Swar (Vowels)',
      subtitle: language === 'hi' ? 'लिपि की आत्मा' : 'The Soul of Script',
      icon: 'अ',
      iconType: 'text',
      route: '/learn/swar',
      order: 2,
      locked: false,
      lessonCount: vowelCount,
    },
    {
      id: 'module-vyanjan',
      title: language === 'hi' ? 'व्यंजन (Vyanjan)' : 'Vyanjan (Consonants)',
      subtitle: language === 'hi' ? 'लिपि का शरीर' : 'The Body of Script',
      icon: 'क',
      iconType: 'text',
      route: '/learn/vyanjan',
      order: 3,
      locked: false,
      lessonCount: consonantCount,
    },
    {
      id: 'module-matra',
      title: language === 'hi' ? 'मात्रा (Mātrā)' : 'Mātrā (Matras)',
      subtitle: language === 'hi' ? 'स्वर चिह्न कला' : 'The Art of Vowel Diacritics',
      icon: 'का',
      iconType: 'text',
      route: '/learn/matra',
      order: 4,
      locked: false,
      lessonCount: course.matra?.matraTracingCards?.items?.length || 12,
    },
  ]
}

// ── Introduction ────────────────────────────────────────────────

export function getIntroSteps(language: string = 'hi'): IntroScreen[] {
  return getCourse(language).introduction.steps
}

export function getIntroStep(page: number, language: string = 'hi'): IntroScreen | undefined {
  return getCourse(language).introduction.steps.find(s => s.page === page)
}

// ── Vowels / Swar ───────────────────────────────────────────────

export function getAllVowels(language: string = 'hi'): Vowel[] {
  return getCourse(language).swar.vowels
}

export function getVowelById(id: string, language: string = 'hi'): Vowel | undefined {
  return getAllVowels(language).find(v => v.id === id)
}

export function getVowelByDevanagari(devanagari: string, language: string = 'hi'): Vowel | undefined {
  return getAllVowels(language).find(v => v.devanagari === devanagari)
}

export function getVowelGroups(language: string = 'hi') {
  const course = getCourse(language)
  return course.swar.vowelDisplayGroups.map(group => ({
    pageStart: group.pageStart,
    vowels: group.vowels
      .map(d => getVowelByDevanagari(d, language))
      .filter((v): v is Vowel => v !== undefined),
  }))
}

export function getSwarRewards(language: string = 'hi'): Reward[] {
  return getCourse(language).swar.rewards
}

export function getMatraTable(language: string = 'hi'): MatraTableEntry[] {
  return getCourse(language).swar.matraTable
}

// ── Consonants / Vyanjan ────────────────────────────────────────

export function getAllConsonantGroups(language: string = 'hi'): ConsonantGroup[] {
  const v = getCourse(language).vyanjan
  if (Array.isArray(v)) return [] // Legacy groups not available in flat array
  return v.groups || []
}

export function getAllConsonants(language: string = 'hi'): ConsonantItem[] {
  return getAllConsonantGroups(language).flatMap(g => g.items)
}

export function getConsonantById(id: string, language: string = 'hi'): ConsonantItem | undefined {
  return getAllConsonants(language).find(c => c.id === id)
}

export function getConsonantByDevanagari(
  devanagari: string,
  language: string = 'hi'
): ConsonantItem | undefined {
  return getAllConsonants(language).find(c => c.devanagari === devanagari)
}

export function getConsonantGroup(groupId: string, language: string = 'hi'): ConsonantGroup | undefined {
  return getAllConsonantGroups(language).find(g => g.groupId === groupId)
}

// ── Consonant Lessons (detailed per-consonant data) ─────────────

export function getConsonantLesson(
  consonantId: string,
  language: string = 'hi'
): ConsonantLesson | undefined {
  const v = getCourse(language).vyanjan
  if (Array.isArray(v)) return undefined
  return v.consonantLessons?.find(
    l => l.consonantId === consonantId
  )
}

/**
 * Get matra combinations for any consonant.
 * If a ConsonantLesson exists, use its matra data (authoritative from PDF).
 * Otherwise, derive combinations from the matraCombinationTemplate + consonant brahmi.
 */
export function getMatraCombinations(
  consonantId: string,
  language: string = 'hi'
): MatraCombination[] {
  const lesson = getConsonantLesson(consonantId, language)
  if (lesson) return lesson.matraCombinations

  // Derive from template
  const consonant = getConsonantById(consonantId, language)
  if (!consonant) return []

  const course = getCourse(language)
  const template = course.vyanjan.matraCombinationTemplate

  // Build a map from vowel devanagari to Brahmi
  const vowelMap: Record<string, string> = {}
  course.swar.vowels.forEach(v => { vowelMap[v.devanagari] = v.brahmi })

  // Devanagari combination map (consonant base + vowel sign)
  const devanagariMap: Record<string, string> = {
    'अ': consonant.devanagari,
    'आ': consonant.devanagari + 'ा',
    'इ': consonant.devanagari + 'ि',
    'ई': consonant.devanagari + 'ी',
    'उ': consonant.devanagari + 'ु',
    'ऊ': consonant.devanagari + 'ू',
    'ए': consonant.devanagari + 'े',
    'ऐ': consonant.devanagari + 'ै',
    'ओ': consonant.devanagari + 'ो',
    'औ': consonant.devanagari + 'ौ',
    'अं': consonant.devanagari + 'ं',
    'अः': consonant.devanagari + 'ः',
  }

  return template.map(entry => ({
    vowel: entry.vowel,
    matraSign: entry.matraSign,
    combinedDevanagari: devanagariMap[entry.vowel] ?? consonant.devanagari,
    combinedBrahmi: entry.matraSign
      ? consonant.brahmi + entry.matraSign
      : consonant.brahmi,
  }))
}

// ── Quiz Generation ─────────────────────────────────────────────

/**
 * Generate MCQ questions for vowels: devanagari → brahmi
 */
export function generateVowelMCQ(
  language: string = 'hi',
  count: number = 12
): QuizQuestion[] {
  const vowels = getAllVowels(language)
  const shuffled = [...vowels].sort(() => Math.random() - 0.5).slice(0, count)

  return shuffled.map(vowel => {
    const distractors = vowels
      .filter(v => v.id !== vowel.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)

    const options: QuizOption[] = [
      { id: `${vowel.id}-correct`, text: vowel.brahmi, brahmi: vowel.brahmi, devanagari: vowel.devanagari, isCorrect: true },
      ...distractors.map((d, i) => ({
        id: `${vowel.id}-wrong-${i}`,
        text: d.brahmi,
        brahmi: d.brahmi,
        devanagari: d.devanagari,
        isCorrect: false,
      })),
    ].sort(() => Math.random() - 0.5)

    return {
      id: `vowel-mcq-${vowel.id}`,
      type: 'mcq' as const,
      question: `"${vowel.devanagari}" का ब्राह्मी चिह्न क्या है?`,
      options,
      correctAnswer: vowel.brahmi,
    }
  })
}

/**
 * Generate reverse MCQ: brahmi → devanagari
 */
export function generateVowelReverseMCQ(
  language: string = 'hi',
  count: number = 12
): QuizQuestion[] {
  const vowels = getAllVowels(language)
  const shuffled = [...vowels].sort(() => Math.random() - 0.5).slice(0, count)

  return shuffled.map(vowel => {
    const distractors = vowels
      .filter(v => v.id !== vowel.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)

    const options: QuizOption[] = [
      { id: `${vowel.id}-correct`, text: vowel.devanagari, brahmi: vowel.brahmi, isCorrect: true },
      ...distractors.map((d, i) => ({
        id: `${vowel.id}-wrong-${i}`,
        text: d.devanagari,
        brahmi: d.brahmi,
        isCorrect: false,
      })),
    ].sort(() => Math.random() - 0.5)

    return {
      id: `vowel-reverse-${vowel.id}`,
      type: 'reverse_mcq' as const,
      question: `"${vowel.brahmi}" किस स्वर का ब्राह्मी चिह्न है?`,
      options,
      correctAnswer: vowel.devanagari,
    }
  })
}

/**
 * Generate MCQ for a consonant's matra combinations
 */
export function generateConsonantMatraMCQ(
  consonantId: string,
  language: string = 'hi'
): QuizQuestion[] {
  const combinations = getMatraCombinations(consonantId, language)
  const consonant = getConsonantById(consonantId, language)
  if (!consonant || combinations.length === 0) return []

  return combinations
    .filter(combo => combo.matraSign !== null) // skip inherent vowel
    .map(combo => {
      const distractors = combinations
        .filter(c => c.vowel !== combo.vowel && c.matraSign !== null)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)

      const options: QuizOption[] = [
        { id: `${consonantId}-${combo.vowel}-correct`, text: combo.combinedBrahmi, isCorrect: true },
        ...distractors.map((d, i) => ({
          id: `${consonantId}-${d.vowel}-wrong-${i}`,
          text: d.combinedBrahmi,
          isCorrect: false,
        })),
      ].sort(() => Math.random() - 0.5)

      return {
        id: `consonant-mcq-${consonantId}-${combo.vowel}`,
        type: 'mcq' as const,
        question: `"${combo.combinedDevanagari}" का ब्राह्मी रूप क्या है?`,
        options,
        correctAnswer: combo.combinedBrahmi,
      }
    })
}

// ── Character lookup (unified) ──────────────────────────────────

export type CharacterType = 'vowel' | 'consonant'

export interface Character {
  id: string
  devanagari: string
  brahmi: string
  romanized: string
  type: CharacterType
  group?: string
  order?: number
}

export function getCharacter(id: string, language: string = 'hi'): Character | undefined {
  // Try vowel
  const vowel = getVowelById(id, language)
  if (vowel) {
    return { ...vowel, type: 'vowel' }
  }

  // Try consonant
  const groups = getAllConsonantGroups(language)
  for (const group of groups) {
    const consonant = group.items.find(c => c.id === id)
    if (consonant) {
      return { ...consonant, type: 'consonant', group: group.groupName }
    }
  }

  return undefined
}

export function getAllCharacters(language: string = 'hi'): Character[] {
  const vowels: Character[] = getAllVowels(language).map(v => ({
    ...v, type: 'vowel' as const
  }))
  const consonants: Character[] = getAllConsonants(language).map(c => ({
    ...c, type: 'consonant' as const
  }))
  return [...vowels, ...consonants]
}
