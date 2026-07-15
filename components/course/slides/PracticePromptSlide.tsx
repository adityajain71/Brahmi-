'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
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

export default function PracticePromptSlide({ slide, onNext }: { slide: CompiledSlide, onNext: () => void }) {
  const router = useRouter()
  const data = slide.content

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto min-h-[400px] gap-8 px-4"
    >
      <div className="bg-[#2a2420] border-y-4 border-[#D4AF37] rounded-3xl px-6 md:px-10 py-12 shadow-[0_10px_30px_rgba(0,0,0,0.5)] w-full flex flex-col items-center gap-10">
        <h2 className="text-3xl md:text-4xl font-bold text-[#E6D8B8] text-center leading-relaxed">
          {renderMixedText(data.prompt || data.question || JSON.stringify(data))}
        </h2>

        <div className="flex gap-4 md:gap-8 w-full justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="px-8 md:px-12 py-4 rounded-2xl bg-[#D4AF37] text-[#1a1613] font-bold text-2xl shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:brightness-110 min-w-[140px]"
          >
            {data.yes || 'Yes'}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/learn')}
            className="px-8 md:px-12 py-4 rounded-2xl bg-[#2a2420] border-2 border-[#D4AF37]/30 text-[#D4AF37] font-bold text-2xl shadow-lg hover:border-[#D4AF37] hover:bg-[#3a322c] min-w-[140px]"
          >
            {data.no || 'No'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
