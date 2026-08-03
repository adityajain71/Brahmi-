'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { FillBlankQuestion, MatraCombinationForm } from '@/lib/matraVyanjanData'

interface Props {
  title: string
  questions: FillBlankQuestion[]
  allForms: MatraCombinationForm[]
  consonant: string
  consonantBrahmi: string
  language?: string
  onNext: () => void
}

/** Extract the Brahmi base and result from prompt like "𑀓 ___ = कि" */
function parsePrompt(prompt: string) {
  // Format: "{brahmi_base} ___ = {result}"
  const parts = prompt.split('=')
  const left = parts[0]?.trim().replace('___', '').trim() || ''
  let right = parts[1]?.trim() || ''
  // Ensure if short-i was inverted as 'ि' + consonant, it is normalized to consonant + 'ि'
  if (right.startsWith('ि') && right.length >= 2) {
    right = right.slice(1) + 'ि'
  }
  return { base: left, result: right }
}

export default function FillBlankSlide({ title, questions, allForms, consonant, consonantBrahmi, language = 'hi', onNext }: Props) {
  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [allDone, setAllDone] = useState(false)

  const q = questions[qIdx]
  const { base, result } = parsePrompt(q.prompt)
  const isCorrect = selected === q.answer

  // Build options: the correct matra sign + 3 others from allForms
  const options = (() => {
    const correct = q.answer
    const others = allForms
      .filter(f => f.matraSign && f.matraSign !== correct)
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
      .map(f => f.matraSign!)
    return [...new Set([correct, ...others])].sort(() => Math.random() - 0.5).slice(0, 6)
  })()

  const handleSelect = (opt: string) => {
    if (selected) return
    setSelected(opt)
    if (opt === q.answer) {
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

  const localMap: Record<string, Record<string, string>> = {
    en: {
      quest: 'Question',
      congrats: 'Great Job!',
      successMsg: 'Filled all blanks correctly!',
      next: 'Next →',
      consonant: 'Consonant',
      matra: 'Matra',
      target: 'Target',
      correctLabel: 'Correct Answer: ',
      tryAgain: 'Try Again',
      instruction: 'Choose the correct matra sign'
    },
    kn: {
      quest: 'ಪ್ರಶ್ನೆ',
      congrats: 'ಬಹಳ ಒಳ್ಳೆಯದು!',
      successMsg: 'ಎಲ್ಲಾ ಖಾಲಿ ಜಾಗಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿದ್ದೀರಿ!',
      next: 'ಮುಂದೆ →',
      consonant: 'ವ್ಯಂಜನ',
      matra: 'ಮಾತ್ರಾ',
      target: 'ಗುರಿ',
      correctLabel: 'ಸರಿಯಾದ ಉತ್ತರ: ',
      tryAgain: 'ಪುನಃ ಪ್ರಯತ್ನಿಸಿ',
      instruction: 'ಸರಿಯಾದ ಮಾತ್ರಾ ಚಿಹ್ನೆಯನ್ನು ಆರಿಸಿ'
    },
    ta: {
      quest: 'கேள்வி',
      congrats: 'மிகவும் நன்று!',
      successMsg: 'அனைத்து கோடிட்ட இடங்களையும் நிரப்பியுள்ளீர்கள்!',
      next: 'அடுத்து →',
      consonant: 'மெய்யெழுத்து',
      matra: 'மாத்ரா',
      target: 'இலக்கு',
      correctLabel: 'சரியான பதில்: ',
      tryAgain: 'மீண்டும் முயற்சி செய்',
      instruction: 'சரியான மாத்ரா குறியீட்டைத் தேர்ந்தெடுக்கவும்'
    },
    hi: {
      quest: 'प्रश्न',
      congrats: 'बहुत बढ़यिा!',
      successMsg: 'सभी रिक्त स्थान भरे!',
      next: 'आगे →',
      consonant: 'व्यंजन',
      matra: 'मात्रा',
      target: 'लक्ष्य',
      correctLabel: 'सही उत्तर: ',
      tryAgain: 'फिर कोशिश',
      instruction: 'सही मात्रा चिह्न चुनें'
    }
  }
  const t = localMap[language] || localMap.hi

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center w-full max-w-2xl mx-auto min-h-[60vh] gap-6 px-4"
    >
      {/* Header */}
      <div className="text-center w-full">
        <div className="text-xs text-[#D4AF37]/60 uppercase tracking-widest mb-1">
          {t.quest} {qIdx + 1} / {questions.length}
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-[#E6D8B8] font-serif">{title}</h2>
      </div>

      {/* Progress */}
      <div className="flex gap-2">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all flex-1 ${i < qIdx ? 'bg-[#D4AF37]' : i === qIdx ? 'bg-[#E69A47]' : 'bg-[#D4AF37]/20'}`}
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
            <div className="text-6xl">🌟</div>
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
            className="flex flex-col items-center gap-8 w-full"
          >
            {/* Equation display */}
            <div className="flex items-center justify-center gap-3 md:gap-4 flex-wrap">
              {/* Base consonant */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[#1a1613] border-2 border-[#D4AF37]/30 flex items-center justify-center">
                  <span
                    className="text-4xl md:text-5xl text-[#E6D8B8]/70 leading-none"
                    style={{ fontFamily: "'Noto Sans Brahmi', serif" }}
                  >
                    {base}
                  </span>
                </div>
                <span className="text-[9px] text-[#E6D8B8]/30 uppercase tracking-wider">{t.consonant}</span>
              </div>

              <span className="text-2xl text-[#D4AF37]/40">+</span>

              {/* Blank */}
              <div className="flex flex-col items-center gap-1">
                <motion.div
                  animate={{ borderColor: selected ? (isCorrect ? 'rgba(52,211,153,0.6)' : 'rgba(248,113,113,0.6)') : ['rgba(212,175,55,0.4)', 'rgba(212,175,55,0.8)', 'rgba(212,175,55,0.4)'] }}
                  transition={{ duration: 1.5, repeat: selected ? 0 : Infinity }}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[#1a1613] border-2 flex items-center justify-center"
                >
                  {selected ? (
                    <span
                      className={`text-4xl md:text-5xl leading-none ${isCorrect ? 'text-emerald-300' : 'text-red-300'}`}
                      style={{ fontFamily: "'Noto Sans Brahmi', serif" }}
                    >
                      {selected.replace('◌', '')}
                    </span>
                  ) : (
                    <span className="text-3xl text-[#D4AF37]/30">?</span>
                  )}
                </motion.div>
                <span className="text-[9px] text-[#E6D8B8]/30 uppercase tracking-wider">{t.matra}</span>
              </div>

              <span className="text-2xl text-[#D4AF37]/40">=</span>

              {/* Result */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[#D4AF37]/10 border-2 border-[#D4AF37]/40 flex items-center justify-center">
                  <span className="text-3xl md:text-4xl text-[#E6D8B8] font-serif font-bold leading-none">
                    {result}
                  </span>
                </div>
                <span className="text-[9px] text-[#E6D8B8]/30 uppercase tracking-wider">{t.target}</span>
              </div>
            </div>

            {/* Wrong feedback */}
            <AnimatePresence>
              {selected && !isCorrect && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 bg-[#2a2420] border border-red-500/30 rounded-2xl px-5 py-3 w-full"
                >
                  <span className="text-red-400 text-lg">✗</span>
                  <span className="text-[#E6D8B8]/70 text-sm">
                    {t.correctLabel}{' '}
                    <span className="text-[#FFD6A5]" style={{ fontFamily: "'Noto Sans Brahmi', serif" }}>
                      {q.answer.replace('◌', '')}
                    </span>
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

            {/* Matra options grid */}
            <div className="w-full">
              <p className="text-xs text-[#E6D8B8]/40 text-center mb-3">{t.instruction}</p>
              <div className="grid grid-cols-3 gap-3">
                {options.map((opt, i) => {
                  let cls = 'border-[#D4AF37]/25 bg-[#2a2420] hover:border-[#D4AF37]/60 hover:bg-[#332a24] cursor-pointer'
                  if (selected) {
                    if (opt === q.answer) cls = 'border-emerald-400 bg-emerald-500/15 text-emerald-200 shadow-[0_0_12px_rgba(52,211,153,0.2)]'
                    else if (opt === selected) cls = 'border-red-400 bg-red-500/15 text-red-200'
                    else cls = 'border-[#D4AF37]/10 bg-[#2a2420] opacity-40'
                  }
                  return (
                    <motion.button
                      key={i}
                      whileHover={!selected ? { scale: 1.06, y: -2 } : {}}
                      whileTap={!selected ? { scale: 0.94 } : {}}
                      disabled={!!selected}
                      onClick={() => handleSelect(opt)}
                      className={`py-5 rounded-2xl border-2 text-3xl md:text-4xl leading-none transition-all duration-200 flex items-center justify-center ${cls}`}
                      style={{ fontFamily: "'Noto Sans Brahmi', serif" }}
                    >
                      {opt.replace('◌', '')}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
