'use client'

import React from 'react'
import { motion } from 'framer-motion'
import type { CompiledSlide } from '@/app/learn/[module]/page'

const getRewardText = (lang: string, slideType?: string) => {
  const numMatch = slideType?.match(/\d+/)
  const num = numMatch ? ` ${numMatch[0]}` : ''
  switch (lang) {
    case 'hi': return `पुरस्कार${num}`
    case 'ta': return `விருது${num}`
    case 'kn': return `ಬಹುಮಾನ${num}`
    default: return `Reward${num}`
  }
}

export default function RewardSlide({ slide, language = 'hi' }: { slide: CompiledSlide, language?: string }) {
  const data = typeof slide.content === 'object' ? slide.content : { content: slide.content }
  
  const langMap: Record<string, string> = {
    hi: 'hindi',
    en: 'english',
    ta: 'tamil',
    kn: 'kannada'
  }
  const langKey = langMap[language] || 'hindi'

  const rawTitle = data[`title_${langKey}`] || data.title || 'Reward'
  const title = (rawTitle.toUpperCase() === 'REWARD') ? getRewardText(language, slide.type) : rawTitle
  const badge = data[`badge_${langKey}`] || data.badge || 'Achievement Unlocked'
  const message = data[`message_${langKey}`] || data.message || data.content || ''
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto min-h-[450px] gap-8 px-4"
    >
      <div className="bg-[#2a2420] border-y-4 border-[#D4AF37] rounded-3xl p-8 md:p-12 shadow-[0_10px_30px_rgba(0,0,0,0.5)] w-full flex flex-col items-center gap-6 text-center relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.15)_0%,transparent_70%)] pointer-events-none" />

        {/* Small "Reward" pill */}
        <div className="z-10 px-5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-sm font-bold tracking-widest -mb-2">
          ✦ {title}
        </div>

        {/* Medal/Badge Icon */}
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
          className="z-10 w-24 h-24 rounded-full bg-linear-to-br from-[#D4AF37] to-[#E69A47] p-1 shadow-[0_0_30px_rgba(212,175,55,0.4)]"
        >
          <div className="w-full h-full rounded-full bg-[#1C1C1C] border-2 border-[#1C1C1C] flex items-center justify-center">
            <span className="text-4xl">🏆</span>
          </div>
        </motion.div>

        {/* Badge Name */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="z-10 text-3xl md:text-5xl font-bold text-[#E6D8B8] font-serif tracking-wide drop-shadow-md"
        >
          {badge}
        </motion.h2>

        {/* Message */}
        {message && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="z-10 text-base md:text-lg text-[#E6D8B8]/80 leading-relaxed max-w-lg mt-2"
          >
            {message}
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}
