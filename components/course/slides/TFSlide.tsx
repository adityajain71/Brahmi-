'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { CompiledSlide } from '@/app/learn/[module]/page'

const renderMixedText = (text: string) => {
  if (!text) return ''
  const regex = /([\u{11000}-\u{1107F}]+)/gu
  const parts = text.split(regex)
  return parts.map((part, i) => {
    if (/[\u{11000}-\u{1107F}]/u.test(part)) {
      return (
        <span key={i} className="font-brahmi" style={{ fontFamily: "'Noto Sans Brahmi', serif" }}>
          {part}
        </span>
      )
    }
    return <span key={i}>{part}</span>
  })
}

export default function TFSlide({ slide, language, onNext }: { slide: CompiledSlide, language: string, onNext: () => void }) {
  const data = slide.content
  
  // Normalize fields between trueFalseQuestions and bonusSampleTrueFalse
  const question = language === 'hi' ? (data.question_hindi || data.question) : (data.question_english || data.question_hindi || data.question)
  
  const isBonusFormat = data.options !== undefined
  
  const trueTextMap: Record<string, string> = {
    hi: 'सही',
    en: 'True',
    ta: 'சரி',
    kn: 'ಸರಿ'
  }
  const falseTextMap: Record<string, string> = {
    hi: 'गलत',
    en: 'False',
    ta: 'தவறு',
    kn: 'ತಪ್ಪು'
  }

  const trueText = trueTextMap[language] || 'True'
  const falseText = falseTextMap[language] || 'False'
  
  // If it's a bonus format, the correct answer is the string that matches options[0] (which is the "True" option)
  const correctAnswerBoolean = isBonusFormat ? (data.correctAnswer === data.options?.[0]) : data.correct_answer
  
  const explanation = language === 'hi' ? data.explanation_hindi : (data.explanation_english || data.explanation_hindi)

  const [selected, setSelected] = useState<boolean | null>(null)

  // Reset selection when slide changes
  useEffect(() => {
    setSelected(null)
  }, [slide.type])

  const getHeadingText = (lang: string) => {
    switch (lang) {
      case 'hi': return 'स्वर अभ्यास – देवनागरी → ब्राह्मी'
      case 'ta': return 'உயிரெழுத்து பயிற்சி – தேவநாகரி → பிராமி'
      case 'kn': return 'ಸ್ವರ ಅಭ್ಯಾಸ – ದೇವನಾಗರಿ → ಬ್ರಾಹ್ಮಿ'
      default: return 'Vowel Practice – Devanagari → Brahmi'
    }
  }

  const getSubheadingText = (lang: string) => {
    switch (lang) {
      case 'hi': return 'सही/गलत चुनिए'
      case 'ta': return 'சரி/தவறு தேர்ந்தெடுக்கவும்'
      case 'kn': return 'ಸರಿ/ತಪ್ಪು ಆರಿಸಿ'
      default: return 'Choose True/False'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto min-h-[400px] gap-8 px-4"
    >
      <div className="bg-[#2a2420] border-y-4 border-[#D4AF37] rounded-3xl px-6 md:px-10 py-12 shadow-[0_10px_30px_rgba(0,0,0,0.5)] w-full flex flex-col items-center gap-10">
        
        <div className="flex flex-col items-center gap-2 text-center -mt-2 mb-2 w-full">
          <h3 className="text-xl md:text-2xl font-bold text-[#D4AF37] tracking-wide">
            {getHeadingText(language)}
          </h3>
          <p className="text-lg md:text-xl text-[#D4AF37]/80">
            {getSubheadingText(language)}
          </p>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-[#E6D8B8] text-center leading-relaxed">
          {renderMixedText(question)}
        </h2>

        <div className="flex gap-4 md:gap-8 w-full justify-center">
          {[true, false].map((isTrueBtn) => {
            const btnText = isTrueBtn ? trueText : falseText
            
            let stateClass = "border-[#D4AF37]/30 bg-[#2a2420] text-[#D4AF37] hover:border-[#D4AF37] hover:bg-[#3a322c]"
            
            if (selected !== null) {
              if (isTrueBtn === correctAnswerBoolean) {
                stateClass = "border-green-500 bg-green-500/20 text-green-400" // Always highlight correct
              } else if (selected === isTrueBtn) {
                stateClass = "border-red-500 bg-red-500/20 text-red-400" // Highlight wrong if selected
              } else {
                stateClass = "border-[#D4AF37]/10 bg-[#2a2420] text-[#D4AF37]/50 opacity-50" // Dim others
              }
            }

            return (
              <motion.button
                key={isTrueBtn ? 'true' : 'false'}
                whileHover={selected === null ? { scale: 1.05 } : {}}
                whileTap={selected === null ? { scale: 0.95 } : {}}
                disabled={selected !== null}
                onClick={() => setSelected(isTrueBtn)}
                className={`px-8 md:px-12 py-4 rounded-2xl border-2 font-bold text-2xl shadow-lg min-w-[140px] transition-all ${stateClass}`}
              >
                {btnText}
              </motion.button>
            )
          })}
        </div>
        
        <AnimatePresence>
          {selected !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
              className="w-full flex flex-col items-center gap-6 overflow-hidden"
            >
              {explanation && (
                <div className="bg-[#1a1613] p-5 rounded-2xl border border-[#D4AF37]/20 text-[#E6D8B8] text-center max-w-lg w-full">
                  <p className="text-lg leading-relaxed">{renderMixedText(explanation)}</p>
                </div>
              )}
              
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNext}
                className="px-10 py-3 rounded-full bg-[#D4AF37] text-[#1a1613] font-bold text-lg hover:brightness-110 shadow-lg"
              >
                {language === 'hi' ? 'अगला' : language === 'ta' ? 'அடுத்து' : language === 'kn' ? 'ಮುಂದೆ' : 'Continue'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
