'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import type { ScreenProps } from '../CourseRenderer'
import type { GoalSelectionScreen as GoalSelectionScreenType } from '@/types/course'

const GOAL_ICONS: Record<string, string> = {
  'धार्मिक ज्ञान के लिए': '🕉️',
  'ऐतिहासिक शोध':         '📜',
  'कौशल विकास':           '🎯',
  'परीक्षा/करियर':        '🎓',
}

export default function GoalSelectionScreen({ screen, onComplete }: ScreenProps) {
  const s = screen as GoalSelectionScreenType
  const [selected, setSelected] = useState<string | null>(null)

  const handleSelect = (option: string) => {
    setSelected(option)
    setTimeout(() => onComplete({ goal: option }), 500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto px-6 py-10 flex flex-col gap-6"
    >
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#D4AF37] font-serif">{s.title}</h2>
        <p className="text-[#E6D8B8]/60 text-sm mt-2">एक विकल्प चुनें</p>
      </div>

      <div className="flex flex-col gap-3">
        {s.options.map((option, idx) => (
          <motion.button
            key={option}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelect(option)}
            className={`
              flex items-center gap-4 px-5 py-4 rounded-2xl border-2 font-medium text-base transition-all text-left
              ${selected === option
                ? 'bg-[#D4AF37] border-[#D4AF37] text-[#1a1613] shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                : 'bg-[#2a2420] border-[#D4AF37]/20 text-[#E6D8B8] hover:border-[#D4AF37]/60'
              }
            `}
          >
            <span className="text-2xl">{GOAL_ICONS[option] ?? '✦'}</span>
            <span>{option}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
