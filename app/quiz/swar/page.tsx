'use client'

/**
 * /quiz/swar — Vowel recognition quiz
 *
 * Generates questions dynamically from course.json vowels.
 * Supports both forward (devanagari→brahmi) and reverse (brahmi→devanagari).
 */

import { useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLanguage } from '@/lib/LanguageContext'
import { generateVowelMCQ, generateVowelReverseMCQ } from '@/lib/course'
import QuizEngine, { type QuizResult } from '@/components/quiz/QuizEngine'
import { motion } from 'framer-motion'

type QuizMode = 'devanagari_to_brahmi' | 'brahmi_to_devanagari'

function ModeSelector({ onSelect }: { onSelect: (mode: QuizMode) => void }) {
  return (
    <div className="min-h-screen bg-[#1C1C1C] flex flex-col items-center justify-center px-6 gap-8">
      <div className="text-center">
        <div className="text-5xl mb-4">✦</div>
        <h1 className="text-3xl font-bold text-[#D4AF37] font-serif">स्वर क्विज़</h1>
        <p className="text-[#E6D8B8]/60 mt-2">कौन सा अभ्यास करना चाहेंगे?</p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect('devanagari_to_brahmi')}
          className="flex flex-col items-center gap-2 px-6 py-5 rounded-2xl bg-[#2a2420] border-2 border-[#D4AF37]/30 hover:border-[#D4AF37] text-[#E6D8B8] transition-all"
        >
          <div className="flex items-center gap-4 text-3xl font-bold">
            <span className="text-[#D4AF37]">अ</span>
            <span className="text-[#E6D8B8]/30 text-xl">→</span>
            <span className="text-[#E69A47]">𑀅</span>
          </div>
          <span className="text-sm font-medium text-[#E6D8B8]/70">देवनागरी → ब्राह्मी</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect('brahmi_to_devanagari')}
          className="flex flex-col items-center gap-2 px-6 py-5 rounded-2xl bg-[#2a2420] border-2 border-[#D4AF37]/30 hover:border-[#D4AF37] text-[#E6D8B8] transition-all"
        >
          <div className="flex items-center gap-4 text-3xl font-bold">
            <span className="text-[#E69A47]">𑀅</span>
            <span className="text-[#E6D8B8]/30 text-xl">→</span>
            <span className="text-[#D4AF37]">अ</span>
          </div>
          <span className="text-sm font-medium text-[#E6D8B8]/70">ब्राह्मी → देवनागरी</span>
        </motion.button>
      </div>
    </div>
  )
}

export default function SwarQuizPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const [mode, setMode] = useState<QuizMode | null>(null)
  const [done, setDone] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)

  const questions = useMemo(() => {
    if (!mode) return []
    return mode === 'devanagari_to_brahmi'
      ? generateVowelMCQ(language, 12)
      : generateVowelReverseMCQ(language, 12)
  }, [mode, language])

  const handleComplete = (r: QuizResult) => {
    setResult(r)
    setDone(true)
  }

  if (!mode) return <ModeSelector onSelect={setMode} />

  return (
    <QuizEngine
      key={mode} // remount when mode changes to regenerate questions
      questions={questions}
      moduleId="module-swar"
      title={mode === 'devanagari_to_brahmi' ? 'देवनागरी → ब्राह्मी' : 'ब्राह्मी → देवनागरी'}
      onComplete={handleComplete}
      onExit={() => router.back()}
    />
  )
}
