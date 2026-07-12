'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface Props {
  ruleNumber: number
  title: string
  description: string
  examples?: string[]
  example?: string
  guidance?: string
}

const RULE_ICONS = ['①', '②', '③', '④']

export default function MatraRuleSlide({ ruleNumber, title, description, examples, example, guidance }: Props) {
  const icon = RULE_ICONS[(ruleNumber - 1) % RULE_ICONS.length] || `${ruleNumber}.`

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto min-h-[60vh] gap-8 px-4"
    >
      {/* Rule badge */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 220 }}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#E69A47] flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.4)]"
      >
        <span className="text-[#1a1613] text-2xl font-black">{ruleNumber}</span>
      </motion.div>

      {/* Card */}
      <div className="w-full bg-[#2a2420] border border-[#D4AF37]/25 rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
        {/* Title bar */}
        <div className="bg-gradient-to-r from-[#D4AF37]/15 to-transparent border-b border-[#D4AF37]/20 px-8 py-5 flex items-center gap-4">
          <span className="text-2xl text-[#D4AF37]">{icon}</span>
          <h2 className="text-2xl md:text-3xl font-bold text-[#E6D8B8] font-serif">{title}</h2>
        </div>

        {/* Body */}
        <div className="px-8 py-8 flex flex-col gap-6">
          {/* Description */}
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-[#E6D8B8]/90 leading-relaxed"
          >
            {description}
          </motion.p>

          {/* Single example */}
          {example && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 bg-[#1a1613] rounded-2xl px-6 py-4 border border-[#D4AF37]/20"
            >
              <span className="text-[#D4AF37]/60 text-sm font-bold uppercase tracking-wider">उदाहरण</span>
              <span
                className="text-2xl md:text-3xl text-[#FFD6A5]"
                style={{ fontFamily: "'Noto Sans Brahmi', serif" }}
              >
                {example}
              </span>
            </motion.div>
          )}

          {/* Multiple examples */}
          {examples && examples.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col gap-3"
            >
              <span className="text-[#D4AF37]/60 text-sm font-bold uppercase tracking-wider">उदाहरण</span>
              <div className="flex flex-wrap gap-3">
                {examples.map((ex, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="bg-[#1a1613] border border-[#D4AF37]/20 rounded-xl px-5 py-3 text-lg md:text-xl text-[#FFD6A5] font-serif"
                    style={{ fontFamily: "'Noto Sans Brahmi', serif" }}
                  >
                    {ex}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Guidance */}
          {guidance && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="flex items-start gap-3 bg-[#D4AF37]/8 border border-[#D4AF37]/20 rounded-2xl px-6 py-4"
            >
              <span className="text-[#D4AF37] text-lg mt-0.5">💡</span>
              <p className="text-[#D4AF37]/80 text-sm md:text-base leading-relaxed">{guidance}</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
