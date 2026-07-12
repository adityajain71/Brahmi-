'use client'

import React from 'react'
import { motion } from 'framer-motion'
import type { CompiledSlide } from '@/app/learn/[module]/page'

export default function GameTimeTitleSlide({ slide, language = 'hi', onNext }: { slide: CompiledSlide, language?: string, onNext: () => void }) {
  const data = typeof slide.content === 'object' ? slide.content : {}
  
  const defaultTitles: Record<string, string> = {
    hi: 'गेम टाइम',
    en: 'Game Time',
    ta: 'விளையாட்டு நேரம்',
    kn: 'ಆಟದ ಸಮಯ'
  }
  
  const defaultSubtitles: Record<string, string> = {
    hi: 'तैयार हो जाएं!',
    en: 'Get ready!',
    ta: 'தயாராகுங்கள்!',
    kn: 'ಸಿದ್ಧರಾಗಿ!'
  }

  const playNowText: Record<string, string> = {
    hi: 'अभी खेलें',
    en: 'Play Now',
    ta: 'இப்போது விளையாடு',
    kn: 'ಈಗ ಆಟವಾಡಿ'
  }

  const langMap: Record<string, string> = {
    hi: 'hindi',
    en: 'english',
    ta: 'tamil',
    kn: 'kannada'
  }
  const langKey = langMap[language] || 'hindi'

  const title = data[`title_${langKey}`] || data.title || defaultTitles[language] || 'Game Time'
  const subtitle = data.subtitle || defaultSubtitles[language] || 'Get ready!'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto min-h-[400px] gap-8 px-4"
    >
      <div className="bg-[#2a2420] border-y-4 border-[#D4AF37] rounded-3xl px-6 md:px-12 py-14 shadow-2xl w-full flex flex-col items-center gap-8 text-center relative overflow-hidden">
        
        {/* Subtle background glow inside the card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05)_0%,transparent_60%)] pointer-events-none" />

        {/* Minimal Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#1C1C1C] border border-[#D4AF37]/30 flex items-center justify-center mb-2 z-10 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <div className="z-10 flex flex-col gap-3">
          <h2 className="text-3xl md:text-5xl font-bold text-[#D4AF37] tracking-wide drop-shadow-sm">
            {title}
          </h2>
          
          <h3 className="text-lg md:text-2xl text-[#E6D8B8]/80 font-medium">
            {subtitle}
          </h3>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="mt-4 z-10 px-10 py-4 rounded-xl bg-linear-to-r from-[#D4AF37] to-[#E69A47] text-[#1a1613] font-bold text-xl shadow-[0_4px_14px_rgba(212,175,55,0.3)] hover:brightness-110 transition-all"
        >
          {data.button || playNowText[language] || "Play Now"}
        </motion.button>
      </div>
    </motion.div>
  )
}
