'use client'

import React from 'react'
import { motion } from 'framer-motion'
import type { CompiledSlide } from '@/app/learn/[module]/page'
import SvgTracer, { BrahmiIcon } from '@/components/tracer/SvgTracer'

interface TracingSlideProps {
  slide: CompiledSlide
  language?: string
  onNext: () => void
  /** Override attempt gating. Default 3 for tracingSequence. */
  requiredAttempts?: number
}

export default function TracingSlide({
  slide,
  language = 'hi',
  onNext,
  requiredAttempts = 3,
}: TracingSlideProps) {
  const data = slide.content

  // Extract data from tracingSequence JSON structure
  const brahmiChar = data.brahmi || '𑀅'
  const devanagari = data.devanagari || ''

  // Language-resolved title and instruction
  const langMap: Record<string, string> = { hi: 'hindi', en: 'english', kn: 'kannada', ta: 'tamil' }
  const langKey = langMap[language] || 'hindi'
  
  const title = data[`title_${langKey}`] || data.title_hindi || data.title_english || `${devanagari} → ${brahmiChar}`
  const instruction = data[`instruction_${langKey}`] || data.instruction_hindi || data.instruction_english || ''

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto min-h-[500px] gap-6 px-4"
    >
      {/* Header: Title + Instruction */}
      <div className="text-center flex flex-col gap-2">
        <h2 className="text-3xl md:text-5xl font-bold text-[#D4AF37] tracking-wide drop-shadow-sm flex items-center justify-center gap-3">
          {devanagari && <span className="font-serif">{devanagari}</span>}
          {devanagari && <span className="text-[#D4AF37]/60">→</span>}
          <BrahmiIcon character={brahmiChar} className="text-4xl md:text-6xl text-[#D4AF37]" />
        </h2>
        {instruction && (
          <p className="text-base md:text-lg text-[#E6D8B8]/80 font-medium">
            {instruction}
          </p>
        )}
      </div>

      {/* Tracer Card */}
      <div className="bg-[#2a2420] border border-[#D4AF37]/20 rounded-3xl p-6 shadow-2xl flex flex-col items-center">
        <SvgTracer
          character={brahmiChar}
          requiredAttempts={requiredAttempts}
          onComplete={onNext}
          language={language}
        />
      </div>
    </motion.div>
  )
}
