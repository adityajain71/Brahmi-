'use client'
import { motion } from 'framer-motion'
import type { ScreenProps } from '../CourseRenderer'
import type { TextScreen as StoryScreenType } from '@/types/course'
import JainBabaCharacter from '@/components/lesson/JainBabaCharacter'

export default function StoryScreen({ screen, onComplete }: ScreenProps) {
  const s = screen as StoryScreenType
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 24 }}
      className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-6"
    >
      <JainBabaCharacter message={s.content} variant="excited" />
      {s.title && (
        <h2 className="text-2xl md:text-3xl font-bold text-[#E69A47] font-serif text-center">
          {s.title}
        </h2>
      )}
      {/* Story card */}
      <div className="relative bg-[#2a2420]/80 border border-[#D4AF37]/20 rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="absolute -top-3 -left-2 text-5xl text-[#D4AF37]/20 font-serif select-none">&ldquo;</div>
        <p className="text-base md:text-lg text-[#E6D8B8]/90 leading-relaxed whitespace-pre-line">
          {s.content}
        </p>
        <div className="absolute -bottom-3 -right-2 text-5xl text-[#D4AF37]/20 font-serif select-none rotate-180">&ldquo;</div>
      </div>
      <div className="flex justify-center mt-2">
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
