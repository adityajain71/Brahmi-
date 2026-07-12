'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface Props {
  vowel: string
  matraSign: string | null
  note?: string | null
}

export default function MatraTableEntrySlide({ vowel, matraSign, note }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto min-h-[60vh] gap-10 px-4"
    >
      {/* Header pill */}
      <div className="px-6 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold tracking-widest uppercase">
        मात्रा चिह्न
      </div>

      {/* Main card */}
      <div className="w-full bg-[#2a2420] border border-[#D4AF37]/25 rounded-3xl p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(212,175,55,0.08)_0%,transparent_60%)] pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-10 relative z-10">
          {/* Devanagari vowel */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-[#1a1613] border-2 border-[#D4AF37]/40 flex items-center justify-center shadow-inner">
              <span className="text-6xl sm:text-7xl text-[#E6D8B8] leading-none font-serif">
                {vowel}
              </span>
            </div>
            <span className="text-xs text-[#E6D8B8]/50 uppercase tracking-widest">देवनागरी</span>
          </motion.div>

          {/* Arrow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            className="text-3xl text-[#D4AF37]/50"
          >
            →
          </motion.div>

          {/* Brahmi matra sign */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.35, type: 'spring', stiffness: 200 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-[#1a1613] border-2 border-[#D4AF37]/60 flex items-center justify-center shadow-inner shadow-[#D4AF37]/5 relative group">
              {/* Glow ring on hover */}
              <div className="absolute inset-0 rounded-2xl ring-2 ring-[#D4AF37]/0 group-hover:ring-[#D4AF37]/30 transition-all duration-500" />
              {matraSign ? (
                <span
                  className="text-6xl sm:text-7xl text-[#FFD6A5] leading-none drop-shadow-[0_0_12px_rgba(212,175,55,0.5)]"
                  style={{ fontFamily: "'Noto Sans Brahmi', serif" }}
                >
                  {matraSign.replace('◌', '')}
                </span>
              ) : (
                <span className="text-sm text-[#E6D8B8]/40 text-center px-3 leading-relaxed">
                  कोई चिह्न नहीं
                </span>
              )}
            </div>
            <span className="text-xs text-[#E6D8B8]/50 uppercase tracking-widest">
              {matraSign ? 'मात्रा चिह्न' : 'स्वतः जुड़ता है'}
            </span>
          </motion.div>
        </div>

        {/* Note */}
        {note && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center text-[#D4AF37]/70 text-sm md:text-base italic leading-relaxed relative z-10"
          >
            {note}
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}
