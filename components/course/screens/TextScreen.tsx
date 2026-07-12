'use client'
import { motion } from 'framer-motion'
import type { ScreenProps } from '../CourseRenderer'
import type { TextScreen as TextScreenType } from '@/types/course'
import JainBabaCharacter from '@/components/lesson/JainBabaCharacter'

export default function TextScreen({ screen, onComplete }: ScreenProps) {
  const s = screen as TextScreenType
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-6"
    >
      <JainBabaCharacter message={s.content} variant="default" />
      {s.title && (
        <h2 className="text-2xl md:text-3xl font-bold text-[#D4AF37] font-serif text-center">
          {s.title}
        </h2>
      )}
      <p className="text-base md:text-lg text-[#E6D8B8]/90 leading-relaxed text-center whitespace-pre-line">
        {s.content}
      </p>
      {s.subtitle && (
        <p className="text-sm text-[#E6D8B8]/60 text-center italic">{s.subtitle}</p>
      )}
      <div className="flex justify-center mt-4">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onComplete()}
          className="px-8 py-3 rounded-2xl bg-[#D4AF37] text-[#1a1613] font-bold text-lg shadow-lg hover:brightness-110 transition-all"
        >
          {s.button ?? 'अगला →'}
        </motion.button>
      </div>
    </motion.div>
  )
}
