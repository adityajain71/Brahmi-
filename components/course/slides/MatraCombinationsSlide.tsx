'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { MatraCombinationForm } from '@/lib/matraVyanjanData'

interface Props {
  title: string
  consonant: string
  consonantBrahmi: string
  forms: MatraCombinationForm[]
  language?: string
}

const devanagari_to_roman: Record<string, string> = {
  'क': 'ka', 'ख': 'kha', 'ग': 'ga', 'घ': 'gha', 'ङ': 'nga',
  'च': 'cha', 'छ': 'chha', 'ज': 'ja', 'झ': 'jha', 'ञ': 'nya',
  'ट': 'ta', 'ठ': 'tha', 'ड': 'da', 'ढ': 'dha', 'ण': 'na',
  'त': 'ta', 'थ': 'tha', 'द': 'da', 'ध': 'dha', 'न': 'na',
  'प': 'pa', 'फ': 'pha', 'ब': 'ba', 'भ': 'bha', 'म': 'ma',
  'य': 'ya', 'र': 'ra', 'ल': 'la', 'व': 'va',
  'श': 'sha', 'ष': 'sha', 'स': 'sa', 'ह': 'ha'
};

const devanagari_to_kannada: Record<string, string> = {
  'क': 'ಕ', 'ख': 'ಖ', 'ग': 'ಗ', 'घ': 'ಘ', 'ङ': 'ಙ',
  'च': 'ಚ', 'छ': 'ಛ', 'ಜ': 'ಜ', 'झ': 'ಝ', 'ञ': 'ಞ',
  'ट': 'ಟ', 'ठ': 'ಠ', 'ಡ': 'ಡ', 'ढ': 'ಢ', 'ಣ': 'ಣ',
  'त': 'ತ', 'थ': 'ಥ', 'ದ': 'ದ', 'ಧ': 'ಧ', 'ನ': 'ನ',
  'प': 'ಪ', 'फ': 'ಫ', 'ಬ': 'ಬ', 'ಭ': 'ಭ', 'ಮ': 'ಮ',
  'य': 'ಯ', 'ರ': 'ರ', 'ಲ': 'ಲ', 'ವ': 'ವ',
  'श': 'ಶ', 'ष': 'ಷ', 'ಸ': 'ಸ', 'ಹ': 'ಹ'
};

const devanagari_to_tamil: Record<string, string> = {
  'क': 'க', 'ख': 'க்ஹ', 'ग': 'க', 'घ': 'க்ஹ', 'ङ': 'ங',
  'च': 'ச', 'छ': 'ச்ஹ', 'ज': 'ஜ', 'झ': 'ஜ்ஹ', 'ञ': 'ஞ',
  'ट': 'ட', 'ठ': 'ட்ஹ', 'ड': 'ட', 'ढ': 'ட்ஹ', 'ण': 'ண',
  'त': 'த', 'थ': 'த்ஹ', 'द': 'த', 'ध': 'த்ஹ', 'ந': 'ந',
  'प': 'ப', 'फ': 'ப்ஹ', 'ब': 'ப', 'भ': 'ப்ஹ', 'ம': 'ம',
  'य': 'ய', 'ர': 'ர', 'ल': 'ல', 'व': 'வ',
  'श': 'ஶ', 'ष': 'ஷ', 'ச': 'ஸ', 'ஹ': 'ஹ'
};

function getLocalizedConsonantLabel(devanagari: string, lang: string): string {
  if (lang === 'en') {
    return devanagari_to_roman[devanagari] ? devanagari_to_roman[devanagari].toUpperCase() : devanagari;
  }
  if (lang === 'kn') {
    return devanagari_to_kannada[devanagari] ?? devanagari;
  }
  if (lang === 'ta') {
    return devanagari_to_tamil[devanagari] ?? devanagari;
  }
  return devanagari;
}

export default function MatraCombinationsSlide({ title, consonant, consonantBrahmi, forms, language = 'hi' }: Props) {
  const [selected, setSelected] = useState<number | null>(null)

  const instructionMap: Record<string, string> = {
    hi: 'किसी चिह्न पर टैप करें',
    en: 'Tap on a symbol',
    kn: 'ಯಾವುದಾದರೂ ಒಂದು ಚಿಹ್ನೆಯನ್ನು ಟ್ಯಾಪ್ ಮಾಡಿ',
    ta: 'ஏதேனும் ஒரு குறியீட்டைத் தட்டவும்'
  }
  const localizedConsonant = getLocalizedConsonantLabel(consonant, language)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center w-full max-w-3xl mx-auto min-h-[60vh] gap-6 px-2 sm:px-4 py-4"
    >
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 bg-[#D4AF37]/10 border border-[#D4AF37]/25 rounded-full px-6 py-2 mb-3">
          <span
            className="text-3xl text-[#FFD6A5] leading-none"
            style={{ fontFamily: "'Noto Sans Brahmi', serif" }}
          >
            {consonantBrahmi}
          </span>
          <span className="text-[#D4AF37]/60 text-sm font-bold">({localizedConsonant})</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-[#E6D8B8] font-serif">{title}</h2>
        <p className="text-xs text-[#E6D8B8]/40 mt-1">{instructionMap[language] || instructionMap.hi}</p>
      </div>

      {/* Grid */}
      <div className="w-full grid grid-cols-4 sm:grid-cols-6 gap-2">
        {forms.map((form, i) => {
          const isSelected = selected === i
          return (
            <motion.button
              key={form.vowel}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04, type: 'spring', stiffness: 260 }}
              whileHover={{ scale: 1.07, y: -2 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => setSelected(isSelected ? null : i)}
              className={`relative flex flex-col items-center justify-center gap-1 rounded-2xl p-2 sm:p-3 border-2 transition-all duration-200
                ${isSelected
                  ? 'border-[#D4AF37] bg-[#D4AF37]/15 shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                  : 'border-[#D4AF37]/20 bg-[#2a2420] hover:border-[#D4AF37]/50'
                }`}
            >
              {/* Combined Brahmi form */}
              <span
                className={`text-2xl sm:text-3xl leading-none transition-colors ${isSelected ? 'text-[#FFD6A5]' : 'text-[#D4AF37]/80'}`}
                style={{ fontFamily: "'Noto Sans Brahmi', serif" }}
              >
                {form.combinedBrahmi}
              </span>
              {/* Devanagari label */}
              <span className="text-[10px] text-[#E6D8B8]/60 font-medium">{form.combinedDevanagari}</span>

              {/* Matra sign pill */}
              {form.matraSign && (
                <span className="absolute -top-2 -right-1 bg-[#E69A47] text-[#1a1613] text-[8px] font-black px-1.5 py-0.5 rounded-full leading-none shadow-md">
                  {form.vowel}
                </span>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Selected detail panel */}
      <AnimatePresence mode="wait">
        {selected !== null && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            className="w-full bg-[#2a2420] border border-[#D4AF37]/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-5 shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
          >
            {/* Formula display */}
            <div className="flex items-center gap-3 text-4xl" style={{ fontFamily: "'Noto Sans Brahmi', serif" }}>
              <span className="text-[#E6D8B8]/70">{consonantBrahmi}</span>
              <span className="text-[#D4AF37]/40 text-2xl">+</span>
              <span className="text-[#D4AF37]/70">{forms[selected].matraSign?.replace('◌', '') || '∅'}</span>
              <span className="text-[#D4AF37]/40 text-2xl">=</span>
              <span className="text-[#FFD6A5] drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]">
                {forms[selected].combinedBrahmi}
              </span>
            </div>

            {/* Text info */}
            <div className="flex flex-col items-center sm:items-start gap-1">
              <div className="text-2xl md:text-3xl text-[#E6D8B8] font-serif font-bold">
                {forms[selected].combinedDevanagari}
              </div>
              <div className="text-sm text-[#E6D8B8]/50">
                {localizedConsonant} + {forms[selected].vowel}
                {forms[selected].note && <span className="italic ml-2">— {forms[selected].note}</span>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
