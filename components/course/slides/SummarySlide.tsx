'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface Props {
  title: string
  content: string
  consonant: string
  consonantBrahmi: string
  bonusUnlock?: string
  onNext: () => void
}

export default function SummarySlide({ title, content, consonant, consonantBrahmi, bonusUnlock, onNext }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto min-h-[60vh] gap-8 px-4"
    >
      {/* Big Brahmi glyph with glow */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.1 }}
        className="relative"
      >
        <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 blur-2xl scale-150 pointer-events-none" />
        <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#E69A47]/10 border-2 border-[#D4AF37]/50 flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.3)] relative z-10">
          <span
            className="text-5xl md:text-6xl text-[#FFD6A5] leading-none"
            style={{ fontFamily: "'Noto Sans Brahmi', serif" }}
          >
            {consonantBrahmi}
          </span>
        </div>
        {/* Checkmark badge */}
        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-[#1a1613] shadow-lg z-20">
          <span className="text-white font-black text-lg">✓</span>
        </div>
      </motion.div>

      {/* Card */}
      <div className="w-full bg-[#2a2420] border border-[#D4AF37]/25 rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.5)] relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.08)_0%,transparent_60%)] pointer-events-none" />

        <div className="px-8 py-10 flex flex-col items-center gap-5 text-center relative z-10">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="text-[#D4AF37]/60 text-xs uppercase tracking-widest font-bold mb-2">{title}</div>
            <div className="text-4xl md:text-5xl font-black text-[#D4AF37] font-serif">{consonant}</div>
          </motion.div>

          {/* Content message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-[#E6D8B8]/85 leading-relaxed max-w-lg"
          >
            {content}
          </motion.p>

          {/* Bonus unlock badge */}
          {bonusUnlock && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
              className="flex items-center gap-3 bg-gradient-to-r from-[#D4AF37]/15 to-[#E69A47]/10 border border-[#D4AF37]/30 rounded-2xl px-5 py-3"
            >
              <span className="text-2xl">🏅</span>
              <div className="text-left">
                <div className="text-[9px] text-[#D4AF37]/60 uppercase tracking-wider font-bold">अनलॉक</div>
                <div className="text-sm font-bold text-[#D4AF37]">{bonusUnlock}</div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75 }}
        onClick={onNext}
        className="px-10 py-4 bg-gradient-to-r from-[#D4AF37] to-[#E69A47] text-[#1a1613] text-lg font-black rounded-full hover:scale-105 transition-all shadow-[0_0_25px_rgba(212,175,55,0.4)]"
      >
        अगला व्यंजन →
      </motion.button>
    </motion.div>
  )
}
