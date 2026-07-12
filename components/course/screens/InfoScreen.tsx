'use client'
import { motion } from 'framer-motion'
import type { ScreenProps } from '../CourseRenderer'
import type { InfoScreen as InfoScreenType } from '@/types/course'

export default function InfoScreen({ screen, onComplete }: ScreenProps) {
  const s = screen as InfoScreenType
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-6"
    >
      {/* Highlight badge */}
      <div className="mx-auto px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold uppercase tracking-widest">
        ✦ महत्वपूर्ण
      </div>
      <h2 className="text-2xl md:text-4xl font-bold text-[#D4AF37] font-serif text-center">
        {s.title}
      </h2>
      <div className="bg-[#2a2420] border-l-4 border-[#E69A47] rounded-r-2xl px-6 py-5 shadow-lg">
        <p className="text-base md:text-lg text-[#E6D8B8]/90 leading-relaxed">
          {s.content}
        </p>
      </div>
      <div className="flex justify-center mt-4">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onComplete()}
          className="px-8 py-3 rounded-2xl bg-[#D4AF37] text-[#1a1613] font-bold text-lg shadow-lg hover:brightness-110"
        >
          {s.button ?? 'समझ गया →'}
        </motion.button>
      </div>
    </motion.div>
  )
}
