'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import type { ScreenProps } from '../CourseRenderer'
import type { QuestionnaireScreen as QuestionnaireScreenType } from '@/types/course'
import JainBabaCharacter from '@/components/lesson/JainBabaCharacter'

export default function QuestionnaireScreen({ screen, onComplete }: ScreenProps) {
  const s = screen as QuestionnaireScreenType
  const [selected, setSelected] = useState<string | null>(null)

  const handleSelect = (option: string, idx: number) => {
    setSelected(option)
    setTimeout(() => onComplete({ answer: option, index: idx }), 400)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto px-6 py-10 flex flex-col gap-6"
    >
      <JainBabaCharacter message={s.title} variant="excited" />
      <h2 className="text-2xl md:text-3xl font-bold text-[#D4AF37] font-serif text-center">{s.title}</h2>

      <div className="flex flex-col gap-3">
        {s.options.map((option, idx) => (
          <motion.button
            key={option}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelect(option, idx)}
            className={`
              px-6 py-4 rounded-2xl border-2 font-medium text-base transition-all
              ${selected === option
                ? 'bg-[#D4AF37] border-[#D4AF37] text-[#1a1613]'
                : 'bg-[#2a2420] border-[#D4AF37]/20 text-[#E6D8B8] hover:border-[#D4AF37]/60'
              }
            `}
          >
            {option}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
