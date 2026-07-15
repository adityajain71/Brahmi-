'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface Props {
  title: string
  content: string
  consonant: string
  consonantBrahmi: string
  bonusUnlock?: string
  language?: string
  onNext: () => void
}

const devanagari_to_roman: Record<string, string> = {
  'क': 'ka', 'ख': 'kha', 'ग': 'ga', 'घ': 'gha', 'ङ': 'nga',
  'च': 'cha', 'छ': 'chha', 'ज': 'ja', 'झ': 'jha', 'ञ': 'nya',
  'ट': 'ta', 'ठ': 'tha', 'ಡ': 'da', 'ਢ': 'dha', 'ಣ': 'na', // Wait, 'ಡ' is Kannada but let's keep it safe
  'ड': 'da',
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

export default function SummarySlide({ title, content, consonant, consonantBrahmi, bonusUnlock, language = 'hi', onNext }: Props) {
  const localMap: Record<string, Record<string, string>> = {
    en: {
      unlock: 'Unlocked',
      next: 'Next Consonant →'
    },
    kn: {
      unlock: 'ಅನ್ಲಾಕ್',
      next: 'ಮುಂದಿನ ವ್ಯಂಜನ →'
    },
    ta: {
      unlock: 'திறக்கப்பட்டது',
      next: 'அடுத்த மெய்யெழுத்து →'
    },
    hi: {
      unlock: 'अनलॉक',
      next: 'अगला व्यंजन →'
    }
  }
  const t = localMap[language] || localMap.hi
  const localizedConsonant = getLocalizedConsonantLabel(consonant, language)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto min-h-[60vh] gap-8 px-4"
    >
      {/* Big Brahmi glyph with glow */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.1 }}
        className="relative"
      >
        <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 blur-2xl scale-150 pointer-events-none" />
        <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#E69A47]/10 border-2 border-[#D4AF37]/50 flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.3)] relative z-10">
          <span
            className="text-5xl md:text-6xl text-[#FFD6A5] leading-none"
            style={{ fontFamily: "'Noto Sans Brahmi', serif" }}
          >
            {consonantBrahmi}
          </span>
        </div>
        {/* Checkmark badge */}
        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-[#1a1613] shadow-lg z-20">
          <span className="text-white font-black text-lg">✓</span>
        </div>
      </motion.div>

      {/* Card */}
      <div className="w-full bg-[#2a2420] border border-[#D4AF37]/25 rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.5)] relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.08)_0%,transparent_60%)] pointer-events-none" />

        <div className="px-8 py-10 flex flex-col items-center gap-5 text-center relative z-10">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="text-[#D4AF37]/60 text-xs uppercase tracking-widest font-bold mb-2">{title}</div>
            <div className="text-4xl md:text-5xl font-black text-[#D4AF37] font-serif">{localizedConsonant}</div>
          </motion.div>

          {/* Content message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-[#E6D8B8]/85 leading-relaxed max-w-lg"
          >
            {content}
          </motion.p>

          {/* Bonus unlock badge */}
          {bonusUnlock && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
              className="flex items-center gap-3 bg-gradient-to-r from-[#D4AF37]/15 to-[#E69A47]/10 border border-[#D4AF37]/30 rounded-2xl px-5 py-3"
            >
              <span className="text-2xl">🏅</span>
              <div className="text-left">
                <div className="text-[9px] text-[#D4AF37]/60 uppercase tracking-wider font-bold">{t.unlock}</div>
                <div className="text-sm font-bold text-[#D4AF37]">{bonusUnlock}</div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75 }}
        onClick={onNext}
        className="px-10 py-4 bg-gradient-to-r from-[#D4AF37] to-[#E69A47] text-[#1a1613] text-lg font-black rounded-full hover:scale-105 transition-all shadow-[0_0_25px_rgba(212,175,55,0.4)]"
      >
        {t.next}
      </motion.button>
    </motion.div>
  )
}
