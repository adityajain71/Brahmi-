'use client'

/**
 * /consonant/[consonant_id] — Individual consonant lesson
 *
 * For consonants that have a full lesson (क, ख, ग, घ, ङ from PDF):
 *   Shows matra combinations, pronunciation drill, and quiz.
 *
 * For all other consonants:
 *   Uses derived matra combinations from the JSON template.
 */

import { useMemo, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/lib/LanguageContext'
import {
  getConsonantById,
  getConsonantLesson,
  getMatraCombinations,
  generateConsonantMatraMCQ,
} from '@/lib/course'
import QuizEngine from '@/components/quiz/QuizEngine'
import type { MatraCombination } from '@/types/course'

type Tab = 'learn' | 'matra' | 'quiz'

// ── Matra Grid ──────────────────────────────────────────────────

function MatraGrid({ combinations }: { combinations: MatraCombination[] }) {
  const [active, setActive] = useState<string | null>(null)
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {combinations.map(combo => (
        <motion.button
          key={combo.vowel}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActive(active === combo.vowel ? null : combo.vowel)}
          className={`
            flex flex-col items-center gap-1 p-3 rounded-2xl border transition-all
            ${active === combo.vowel
              ? 'bg-[#D4AF37]/15 border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.25)]'
              : 'bg-[#2a2420] border-[#D4AF37]/15 hover:border-[#D4AF37]/50'
            }
          `}
        >
          <span
            className="text-2xl text-[#D4AF37] leading-none"
            style={{ fontFamily: "'Noto Sans Brahmi', serif" }}
          >
            {combo.combinedBrahmi}
          </span>
          <span className="text-base font-bold text-[#E6D8B8]">{combo.combinedDevanagari}</span>
          <span className="text-[9px] text-[#E6D8B8]/30 uppercase tracking-wide">{combo.vowel}</span>
        </motion.button>
      ))}
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────

export default function ConsonantLessonPage() {
  const router = useRouter()
  const params = useParams()
  const { language } = useLanguage()
  const consonantId = params?.consonant_id as string

  const [tab, setTab] = useState<Tab>('learn')

  const consonant = useMemo(() => getConsonantById(consonantId, language), [consonantId, language])
  const lesson = useMemo(() => getConsonantLesson(consonantId, language), [consonantId, language])
  const combinations = useMemo(() => getMatraCombinations(consonantId, language), [consonantId, language])
  const quizQuestions = useMemo(() => generateConsonantMatraMCQ(consonantId, language), [consonantId, language])

  if (!consonant) {
    return (
      <div className="min-h-screen bg-[#1a1613] flex items-center justify-center text-[#E6D8B8]/50">
        व्यंजन नहीं मिला।
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1613] to-[#2a2420] text-[#F5F1E8]">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 bg-[#1a1613]/90 backdrop-blur-sm border-b border-[#D4AF37]/15 px-4 py-3">
        <div className="flex items-center gap-3 max-w-xl mx-auto">
          <button onClick={() => router.back()} className="text-[#D4AF37] p-2 rounded-full hover:bg-[#2a2420] transition-all">
            ←
          </button>
          <div className="flex items-center gap-3">
            <span
              className="text-3xl text-[#D4AF37]"
              style={{ fontFamily: "'Noto Sans Brahmi', serif" }}
            >
              {consonant.brahmi}
            </span>
            <div>
              <div className="text-lg font-bold text-[#D4AF37] font-serif leading-tight">{consonant.devanagari}</div>
              <div className="text-xs text-[#E6D8B8]/40 uppercase tracking-widest">{consonant.romanized}</div>
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 mt-3 max-w-xl mx-auto">
          {(['learn', 'matra', 'quiz'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                tab === t
                  ? 'bg-[#D4AF37] text-[#1a1613]'
                  : 'text-[#E6D8B8]/50 hover:text-[#E6D8B8] hover:bg-[#2a2420]'
              }`}
            >
              {t === 'learn' ? '📖 परिचय' : t === 'matra' ? '✦ मात्राएं' : '✏️ क्विज़'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────── */}
      <div className="max-w-xl mx-auto px-4 py-6 pb-20">
        <AnimatePresence mode="wait">
          {tab === 'learn' && (
            <motion.div key="learn" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-6">
              <div className="text-center py-8">
                <motion.div
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-8xl text-[#D4AF37] mb-3"
                  style={{ fontFamily: "'Noto Sans Brahmi', serif" }}
                >
                  {consonant.brahmi}
                </motion.div>
                <div className="text-2xl font-bold text-[#E6D8B8] font-serif">{consonant.devanagari}</div>
                <div className="text-sm text-[#E6D8B8]/40 mt-1 uppercase tracking-widest">{consonant.romanized}</div>
              </div>

              {lesson?.exampleWords && (
                <div className="bg-[#2a2420] rounded-2xl p-5 border border-[#D4AF37]/15">
                  <h3 className="text-xs uppercase tracking-widest text-[#E69A47] mb-3 font-bold">उदाहरण शब्द</h3>
                  <div className="flex flex-col gap-2">
                    {lesson.exampleWords.map(word => (
                      <div key={word.devanagari} className="flex items-center gap-3">
                        <span className="text-xl font-bold text-[#D4AF37]">{word.devanagari}</span>
                        <span className="text-[#E6D8B8]/50 text-sm">{word.romanized}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {lesson?.drill && (
                <div className="bg-[#2a2420]/60 border border-[#E69A47]/20 rounded-2xl p-5 text-center">
                  <div className="text-2xl mb-2">🗣️</div>
                  <p className="text-[#E6D8B8]/80 text-sm">{lesson.drill}</p>
                </div>
              )}

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => setTab('matra')}
                className="w-full py-4 rounded-2xl bg-[#D4AF37] text-[#1a1613] font-bold text-lg hover:brightness-110 transition-all shadow-lg"
              >
                मात्राएं सीखें →
              </motion.button>
            </motion.div>
          )}

          {tab === 'matra' && (
            <motion.div key="matra" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-5">
              <div className="text-center">
                <h2 className="text-xl font-bold text-[#D4AF37] font-serif">{consonant.devanagari} + मात्राएं</h2>
                <p className="text-[#E6D8B8]/40 text-xs mt-1">सभी रूपों पर क्लिक करें</p>
              </div>
              <MatraGrid combinations={combinations} />
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => setTab('quiz')}
                className="w-full py-4 rounded-2xl bg-[#D4AF37] text-[#1a1613] font-bold text-lg hover:brightness-110 transition-all shadow-lg mt-2"
              >
                क्विज़ दें →
              </motion.button>
            </motion.div>
          )}

          {tab === 'quiz' && (
            <motion.div key="quiz" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {quizQuestions.length === 0 ? (
                <div className="text-center py-12 text-[#E6D8B8]/40 text-sm">क्विज़ के लिए पर्याप्त डेटा नहीं है।</div>
              ) : (
                <QuizEngine
                  key={consonantId}
                  questions={quizQuestions}
                  moduleId="module-vyanjan"
                  title={`${consonant.devanagari} — मात्रा क्विज़`}
                  onComplete={() => setTab('learn')}
                  onExit={() => setTab('matra')}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
