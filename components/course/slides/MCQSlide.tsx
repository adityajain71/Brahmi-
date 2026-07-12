'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import type { CompiledSlide } from '@/app/learn/[module]/page'

export default function MCQSlide({ slide, language }: { slide: CompiledSlide, language: string }) {
  const data = slide.content
  const title = language === 'hi' ? data.title_hindi : (data.title_english || data.title_hindi)
  
  const [selected, setSelected] = useState<string | null>(null)

  // Shuffle options on mount
  const options = useMemo(() => {
    if (!data.correct_answer || !data.wrong_options) return []
    const opts = [
      { text: data.correct_answer, isCorrect: true },
      ...data.wrong_options.map((w: any) => ({ text: w.brahmi || w.text || w.devanagari, isCorrect: false }))
    ]
    return opts.sort(() => Math.random() - 0.5)
  }, [data])

  // Reset selection when slide changes
  useEffect(() => {
    setSelected(null)
  }, [slide.type])

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto min-h-[400px] gap-8 px-4"
    >
      {title && (
        <h2 className="text-2xl md:text-3xl font-bold text-[#E6D8B8] text-center mb-4">
          {title}
        </h2>
      )}

      {/* The Question Prompt */}
      <div className="flex items-center justify-center bg-[#2a2420] w-32 h-32 md:w-40 md:h-40 rounded-3xl border-2 border-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
        <span className="text-6xl md:text-8xl font-bold text-[#D4AF37] font-brahmi">
          {data.question}
        </span>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-2 gap-4 w-full mt-6">
        {options.map((opt, i) => {
          let stateClass = "border-[#D4AF37]/30 bg-[#2a2420] hover:border-[#D4AF37]/60 hover:bg-[#3a322c]"
          
          if (selected) {
            if (opt.isCorrect) {
              stateClass = "border-green-500 bg-green-500/20 text-green-100" // Always highlight correct answer
            } else if (selected === opt.text) {
              stateClass = "border-red-500 bg-red-500/20 text-red-100" // Highlight wrong if selected
            } else {
              stateClass = "border-[#D4AF37]/10 bg-[#2a2420] opacity-50" // Dim others
            }
          }

          return (
            <motion.button
              key={i}
              whileHover={!selected ? { scale: 1.05 } : {}}
              whileTap={!selected ? { scale: 0.95 } : {}}
              disabled={selected !== null}
              onClick={() => setSelected(opt.text)}
              className={`p-6 md:p-8 rounded-2xl border-2 text-4xl md:text-6xl font-brahmi transition-all shadow-lg flex items-center justify-center ${stateClass}`}
            >
              {opt.text}
            </motion.button>
          )
        })}
      </div>
      
      {/* Feedback text */}
      <div className="h-12 flex items-center justify-center">
        {selected && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-xl font-bold ${selected === data.correct_answer ? 'text-green-400' : 'text-red-400'}`}
          >
            {selected === data.correct_answer ? 'Awesome!' : 'Oops, try to remember next time!'}
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}
