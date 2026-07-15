'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { MCQExample, MatraCombinationForm } from '@/lib/matraVyanjanData'

interface Props {
  title: string
  examples: MCQExample[]
  /** All matra forms for this consonant (used to generate distractors) */
  allForms: MatraCombinationForm[]
  consonant: string
  consonantBrahmi: string
  language?: string
  onNext: () => void
}

function buildQuestion(
  example: MCQExample,
  allForms: MatraCombinationForm[],
  index: number
) {
  const correct = example.answer
  // Distractors: other brahmi forms from allForms that aren't the answer
  const distractors = allForms
    .filter(f => f.combinedBrahmi !== correct && f.combinedBrahmi !== example.prompt)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(f => f.combinedBrahmi)

  // If not enough distractors, pad with rotations of correct
  while (distractors.length < 3) distractors.push(correct + '?')

  const options = [correct, ...distractors].sort(() => Math.random() - 0.5)
  return { prompt: example.prompt, correct, options }
}

export default function RecognitionMCQSlide({ title, examples, allForms, consonant, consonantBrahmi, language = 'hi', onNext }: Props) {
  const questions = useMemo(
    () => examples.map((ex, i) => buildQuestion(ex, allForms, i)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [examples]
  )

  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [allDone, setAllDone] = useState(false)

  const localMap: Record<string, Record<string, string>> = {
    en: {
      congrats: 'Well Done!',
      successMsg: 'Answered all questions correctly!',
      next: 'Next →',
      choosePrompt: 'Choose its Brahmi form',
      correctLabel: 'Correct Answer: ',
      tryAgain: 'Try Again'
    },
    kn: {
      congrats: 'ಅದ್ಭುತ!',
      successMsg: 'ಎಲ್ಲಾ ಪ್ರಶ್ನೆಗಳಿಗೂ ಸರಿಯಾಗಿ ಉತ್ತರಿಸಿದ್ದೀರಿ!',
      next: 'ಮುಂದೆ →',
      choosePrompt: 'ಇದರ ಬ್ರಾಹ್ಮಿ ರೂಪವನ್ನು ಆರಿಸಿ',
      correctLabel: 'ಸರಿಯಾದ ಉತ್ತರ: ',
      tryAgain: 'ಪುನಃ ಪ್ರಯತ್ನಿಸಿ'
    },
    ta: {
      congrats: 'நன்று!',
      successMsg: 'அனைத்து கேள்விகளுக்கும் சரியாக பதிலளித்துள்ளீர்கள்!',
      next: 'அடுத்து →',
      choosePrompt: 'இதன் பிராமி வடிவத்தைத் தேர்ந்தெடுக்கவும்',
      correctLabel: 'சரியான பதில்: ',
      tryAgain: 'மீண்டும் முயற்சி செய்'
    },
    hi: {
      congrats: 'शाबाश!',
      successMsg: 'सभी प्रश्न सही किए!',
      next: 'आगे →',
      choosePrompt: 'इसका ब्राह्मी रूप चुनें',
      correctLabel: 'सही उत्तर: ',
      tryAgain: 'फिर कोशिश'
    }
  }
  const t = localMap[language] || localMap.hi

  const q = questions[qIdx]
  const isCorrect = selected === q?.correct
  const isBrahmi = (s: string) => /[\u{11000}-\u{1107F}]/u.test(s) || /[\uD804]/.test(s) || s.startsWith('𑀅') || s.includes('𑀓')

  const handleSelect = (opt: string) => {
    if (selected) return
    setSelected(opt)
    if (opt === q.correct) {
      setTimeout(() => {
        if (qIdx < questions.length - 1) {
          setQIdx(qIdx + 1)
          setSelected(null)
        } else {
          setAllDone(true)
        }
      }, 900)
    }
  }

  if (!q) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center w-full max-w-2xl mx-auto min-h-[60vh] gap-6 px-4"
    >
      {/* Header */}
      <div className="text-center w-full">
        <div className="text-xs text-[#D4AF37]/60 uppercase tracking-widest mb-1">
          {qIdx + 1} / {questions.length}
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-[#E6D8B8] font-serif">{title}</h2>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${i < qIdx ? 'bg-[#D4AF37]' : i === qIdx ? 'bg-[#E69A47] scale-125' : 'bg-[#D4AF37]/20'}`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {allDone ? (
          <motion.div
            key="done"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-6 text-center py-8"
          >
            <div className="text-6xl">🎉</div>
            <h3 className="text-3xl font-bold text-[#D4AF37] font-serif">{t.congrats}</h3>
            <p className="text-[#E6D8B8]/70 text-lg">{t.successMsg}</p>
            <button
              onClick={onNext}
              className="mt-2 px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#E69A47] text-[#1a1613] font-bold rounded-full text-lg hover:scale-105 transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)]"
            >
              {t.next}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={qIdx}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="flex flex-col items-center gap-6 w-full"
          >
            {/* Prompt */}
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-[#1a1613] border-2 border-[#D4AF37]/40 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.1)]">
              <span className="text-5xl md:text-6xl text-[#E6D8B8] font-serif font-bold leading-none">
                {q.prompt}
              </span>
            </div>
            <p className="text-sm text-[#E6D8B8]/50">{t.choosePrompt}</p>

            {/* Options */}
            <div className="grid grid-cols-2 gap-3 w-full">
              {q.options.map((opt, i) => {
                let cls = 'border-[#D4AF37]/25 bg-[#2a2420] hover:border-[#D4AF37]/60 hover:bg-[#332a24]'
                if (selected) {
                  if (opt === q.correct) cls = 'border-emerald-400 bg-emerald-500/15 text-emerald-200 shadow-[0_0_15px_rgba(52,211,153,0.2)]'
                  else if (opt === selected) cls = 'border-red-400 bg-red-500/15 text-red-200'
                  else cls = 'border-[#D4AF37]/10 bg-[#2a2420] opacity-40'
                }
                return (
                  <motion.button
                    key={i}
                    whileHover={!selected ? { scale: 1.04 } : {}}
                    whileTap={!selected ? { scale: 0.96 } : {}}
                    disabled={!!selected}
                    onClick={() => handleSelect(opt)}
                    className={`py-6 rounded-2xl border-2 text-3xl md:text-4xl leading-none transition-all duration-200 flex items-center justify-center ${cls}`}
                    style={{ fontFamily: "'Noto Sans Brahmi', serif" }}
                  >
                    {opt}
                  </motion.button>
                )
              })}
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {selected && !isCorrect && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 bg-[#2a2420] border border-[#D4AF37]/20 rounded-2xl px-5 py-3"
                >
                  <span className="text-red-400">✗</span>
                  <span className="text-[#E6D8B8]/70 text-sm">
                    {t.correctLabel}<span className="text-[#FFD6A5]" style={{ fontFamily: "'Noto Sans Brahmi', serif" }}>{q.correct}</span>
                  </span>
                  <button
                    onClick={() => setSelected(null)}
                    className="ml-auto text-[#D4AF37]/60 hover:text-[#D4AF37] text-xs border border-[#D4AF37]/20 rounded-lg px-2 py-1 transition-colors"
                  >
                    {t.tryAgain}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
