'use client'

import React from 'react'
import { motion } from 'framer-motion'
import type { CompiledSlide } from '@/app/learn/[module]/page'

export default function CongratsSlide({ slide, language = 'hi' }: { slide: CompiledSlide, language?: string }) {
  const data = typeof slide.content === 'object' ? slide.content : { content: slide.content }
  
  const langMap: Record<string, string> = {
    hi: 'hindi',
    en: 'english',
    ta: 'tamil',
    kn: 'kannada'
  }
  const langKey = langMap[language] || 'hindi'

  const title = data[`title_${langKey}`] || data.title || 'Congratulations!'
  const content = data[`message_${langKey}`] || data[`content_${langKey}`] || data.content || data.message || ''
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto min-h-[400px] gap-8 px-4"
    >
      <div className="bg-[#2a2420] border-t-4 border-b-4 border-[#D4AF37] rounded-3xl p-8 md:p-14 shadow-2xl w-full flex flex-col items-center gap-6 text-center relative overflow-hidden">
        
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.1)_0%,transparent_70%)] pointer-events-none" />

        {/* Decorative elements */}
        <div className="flex items-center gap-4 z-10 mb-2">
          <span className="text-[#D4AF37]">✦</span>
          <h2 className="text-3xl md:text-5xl font-bold text-[#E6D8B8] font-serif tracking-wide drop-shadow-md">
            {title}
          </h2>
          <span className="text-[#D4AF37]">✦</span>
        </div>

        {/* Content */}
        {content && (
          <div className="z-10 relative">
            <p className="text-base md:text-xl text-[#E6D8B8]/90 leading-relaxed max-w-lg mt-2 whitespace-pre-wrap">
              {content}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
