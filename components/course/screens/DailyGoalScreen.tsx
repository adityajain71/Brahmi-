'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import type { ScreenProps } from '../CourseRenderer'
import type { DailyGoalScreen as DailyGoalScreenType } from '@/types/course'

const TIME_ICONS: Record<string, string> = {
  '3 मिनट': '⚡',
  '5 मिनट': '🌱',
  '8 मिनट': '📚',
  '10 मिनट': '🎯',
  '15 मिनट': '🏆',
}

export default function DailyGoalScreen({ screen, onComplete }: ScreenProps) {
  const s = screen as DailyGoalScreenType
  const [selected, setSelected] = useState<string | null>(null)

  const handleSelect = (option: string) => {
    setSelected(option)
    setTimeout(() => onComplete({ dailyGoal: option }), 500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto px-6 py-10 flex flex-col gap-6"
    >
      <div className="text-center">
        <div className="text-5xl mb-3">⏱️</div>
        <h2 className="text-xl md:text-2xl font-bold text-[#D4AF37] font-serif">{s.title}</h2>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {s.options.map((option, idx) => (
          <motion.button
            key={option}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.07 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelect(option)}
            className={`
              flex items-center gap-4 px-5 py-4 rounded-2xl border-2 font-medium text-lg transition-all
              ${selected === option
                ? 'bg-[#D4AF37] border-[#D4AF37] text-[#1a1613] shadow-[0_0_24px_rgba(212,175,55,0.5)]'
                : 'bg-[#2a2420] border-[#D4AF37]/20 text-[#E6D8B8] hover:border-[#D4AF37]/50'
              }
            `}
          >
            <span className="text-2xl">{TIME_ICONS[option] ?? '⏰'}</span>
            <span>{option}</span>
            {selected === option && <span className="ml-auto font-bold">✓</span>}
          </motion.button>
        ))}
      </div>

      <p className="text-center text-[#E6D8B8]/40 text-xs mt-2">
        आप बाद में बदल सकते हैं
      </p>
    </motion.div>
  )
}
