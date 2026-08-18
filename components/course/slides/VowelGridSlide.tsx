'use client'

import React from 'react'
import { motion } from 'framer-motion'
import type { CompiledSlide } from '@/app/learn/[module]/page'

export default function VowelGridSlide({ slide, moduleData }: { slide: CompiledSlide, moduleData: any }) {
  const letters = slide.content?.vowels || []
  
  // Resolve letters from moduleData
  const resolvedLetters = letters.map((char: string) => {
    // Find the vowel object in moduleData.vowels where devanagari matches
    const allVowels = Object.values(moduleData.vowels || {}) as any[]
    return allVowels.find(v => v.devanagari === char) || { devanagari: char, brahmi: '?', romanized: '' }
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center w-full min-h-[400px] gap-12"
    >
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
        {resolvedLetters.map((letter: any, i: number) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.15 }}
            className="flex flex-col items-center gap-4 bg-[#2a2420] p-4 sm:p-6 md:p-8 rounded-3xl border-2 border-[#D4AF37]/30 shadow-2xl hover:border-[#D4AF37] transition-all group w-[calc(50%-0.75rem)] sm:w-40 md:w-48"
          >
            {/* Brahmi Character */}
            <div className="text-6xl md:text-8xl text-[#D4AF37] font-brahmi drop-shadow-[0_0_15px_rgba(212,175,55,0.4)] group-hover:scale-110 transition-transform">
              {letter.brahmi}
            </div>
            
            {/* Line separator */}
            <div className="w-12 h-0.5 bg-[#D4AF37]/30 rounded-full" />
            
            {/* Native & Romanized */}
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-3xl md:text-4xl font-bold text-[#E6D8B8]">
                {letter.devanagari}
              </span>
              <span className="text-sm md:text-base text-[#D4AF37]/60 tracking-widest uppercase">
                {letter.romanized}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
