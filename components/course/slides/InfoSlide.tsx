'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
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

const getCongratsText = (lang: string) => {
  switch (lang) {
    case 'hi': return 'बधाई हो!'
    case 'ta': return 'வாழ்த்துக்கள்!'
    case 'kn': return 'ಅಭಿನಂದನೆಗಳು!'
    default: return 'Congratulations!'
  }
}

export default function InfoSlide({ slide, language = 'hi', onNext }: { slide: CompiledSlide, language?: string, onNext?: () => void }) {
  const data = typeof slide.content === 'object' ? slide.content : { content: slide.content }
  
  const title = data.title || data.heading || data.prompt || data.vowel || (slide.type.includes('reward') ? getCongratsText(language) : '')
  const content = data.content || data.message || data.text || data.rule || (typeof slide.content === 'string' ? slide.content : '')
  const note = data.note
  const isPathChoice = slide.type.includes('pathChoice')
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto min-h-[400px] gap-8 px-4"
    >
      <div className="bg-[#2a2420] border-y-4 border-[#D4AF37] rounded-3xl px-6 md:px-10 py-12 shadow-[0_10px_30px_rgba(0,0,0,0.5)] w-full flex flex-col items-center gap-10 text-center">

        {/* Highlight badge */}
        {slide.type.includes('reward') && (
          <div className="px-5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-sm font-bold tracking-widest -mb-4">
            {getRewardText(language, slide.type)}
          </div>
        )}
        
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold text-[#E6D8B8] leading-relaxed drop-shadow-sm">
            {title}
          </h2>
        )}
        
        {content && (
          <p className="text-xl md:text-2xl text-[#E6D8B8]/90 leading-relaxed max-w-2xl whitespace-pre-wrap font-medium">
            {content}
          </p>
        )}

        {note && (
          <p className="text-sm md:text-base text-[#D4AF37]/80 leading-relaxed max-w-2xl whitespace-pre-wrap italic">
            {note}
          </p>
        )}

        {isPathChoice && data.options && (
          <div className="flex flex-col gap-4 w-full justify-center mt-2">
            {data.options.map((opt: string, i: number) => {
              const href = i === 0 ? '/learn/matra' : '/learn/vyanjan'
              return (
                <Link key={i} href={href} className="px-8 md:px-12 py-4 rounded-2xl border-2 font-bold text-2xl shadow-lg border-[#D4AF37]/30 bg-[#2a2420] text-[#D4AF37] mx-auto w-full max-w-md hover:bg-[#D4AF37] hover:text-[#2a2420] transition-colors cursor-pointer text-center block">
                  {opt}
                </Link>
              )
            })}
          </div>
        )}

      </div>
    </motion.div>
  )
}
