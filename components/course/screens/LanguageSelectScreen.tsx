'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import type { ScreenProps } from '../CourseRenderer'
import type { LanguageSelectScreen as LanguageSelectScreenType } from '@/types/course'

const LANGUAGE_META: Record<string, { code: string; flag: string }> = {
  'हिंदी':    { code: 'hi', flag: '🇮🇳' },
  'தமிழ்':    { code: 'ta', flag: '🏛️' },
  'తెలుగు':   { code: 'te', flag: '🏛️' },
  'বাংলা':    { code: 'bn', flag: '🇧🇩' },
  'ગુજરાતી':  { code: 'gu', flag: '🏛️' },
  'ಕನ್ನಡ':    { code: 'kn', flag: '🏛️' },
  'ଓଡ଼ିଆ':    { code: 'or', flag: '🏛️' },
  'ਪੰਜਾਬੀ':  { code: 'pa', flag: '🏛️' },
  'English':  { code: 'en', flag: '🌐' },
}

export default function LanguageSelectScreen({ screen, onComplete }: ScreenProps) {
  const s = screen as LanguageSelectScreenType
  const [selected, setSelected] = useState<string | null>(null)

  const handleSelect = (option: string) => {
    setSelected(option)
    const meta = LANGUAGE_META[option]
    // Small delay so user sees the selection, then advance
    setTimeout(() => onComplete({ language: meta?.code ?? 'hi', label: option }), 400)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto px-6 py-10 flex flex-col gap-6"
    >
      <div className="text-center">
        <div className="text-5xl mb-4">🌏</div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#D4AF37] font-serif">{s.title}</h1>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {s.options.map((option) => {
          const meta = LANGUAGE_META[option]
          return (
            <motion.button
              key={option}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(option)}
              className={`
                flex items-center gap-4 px-5 py-4 rounded-2xl border-2 font-medium text-lg transition-all text-left
                ${selected === option
                  ? 'bg-[#D4AF37] border-[#D4AF37] text-[#1a1613] shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                  : 'bg-[#2a2420] border-[#D4AF37]/20 text-[#E6D8B8] hover:border-[#D4AF37]/60 hover:bg-[#2a2420]/80'
                }
              `}
            >
              <span className="text-2xl">{meta?.flag ?? '🌐'}</span>
              <span>{option}</span>
              {selected === option && <span className="ml-auto">✓</span>}
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
