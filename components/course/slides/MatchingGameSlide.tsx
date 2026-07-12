'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  title: string
  columnA: string[] // Brahmi
  columnB: string[] // Devanagari
  note?: string
  onNext: () => void
}

type Pair = { a: string; b: string }

export default function MatchingGameSlide({ title, columnA, columnB, note, onNext }: Props) {
  const [selectedA, setSelectedA] = useState<string | null>(null)
  const [selectedB, setSelectedB] = useState<string | null>(null)
  const [matched, setMatched] = useState<Pair[]>([])
  const [wrong, setWrong] = useState<string | null>(null) // 'a:X' or 'b:X'
  const allDone = matched.length === columnA.length

  // Build the correct pairs: columnA[i] ↔ columnB[i]
  const correctPairs: Record<string, string> = {}
  columnA.forEach((a, i) => { correctPairs[a] = columnB[i] })
  const correctByB: Record<string, string> = {}
  columnB.forEach((b, i) => { correctByB[b] = columnA[i] })

  const isMatchedA = (a: string) => matched.some(p => p.a === a)
  const isMatchedB = (b: string) => matched.some(p => p.b === b)

  const handleSelectA = useCallback((a: string) => {
    if (isMatchedA(a)) return
    setSelectedA(prev => prev === a ? null : a)
    // If B is already selected, check match
    if (selectedB) checkMatch(a, selectedB)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedB, matched])

  const handleSelectB = useCallback((b: string) => {
    if (isMatchedB(b)) return
    setSelectedB(prev => prev === b ? null : b)
    if (selectedA) checkMatch(selectedA, b)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedA, matched])

  const checkMatch = (a: string, b: string) => {
    if (correctPairs[a] === b) {
      setMatched(prev => [...prev, { a, b }])
      setSelectedA(null)
      setSelectedB(null)
      setWrong(null)
    } else {
      setWrong(`${a}|${b}`)
      setTimeout(() => {
        setWrong(null)
        setSelectedA(null)
        setSelectedB(null)
      }, 700)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center w-full max-w-2xl mx-auto min-h-[60vh] gap-6 px-4"
    >
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/25 rounded-full px-5 py-1.5 mb-2">
          <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-wider">मिलानी</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-[#E6D8B8] font-serif">{title}</h2>
        {note && <p className="text-xs text-[#E6D8B8]/40 mt-1">{note}</p>}
      </div>

      {/* Score */}
      <div className="flex gap-1">
        {columnA.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${i < matched.length ? 'bg-[#D4AF37] scale-110' : 'bg-[#D4AF37]/20'}`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {allDone ? (
          <motion.div
            key="done"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-6 text-center py-8"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6 }}
              className="text-6xl"
            >
              🏅
            </motion.div>
            <h3 className="text-3xl font-bold text-[#D4AF37] font-serif">सभी मिलान सही!</h3>
            <p className="text-[#E6D8B8]/70 text-lg">बधाई हो!</p>
            <button
              onClick={onNext}
              className="mt-2 px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#E69A47] text-[#1a1613] font-bold rounded-full text-lg hover:scale-105 transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)]"
            >
              आगे →
            </button>
          </motion.div>
        ) : (
          <div className="w-full grid grid-cols-2 gap-4">
            {/* Column A — Brahmi */}
            <div className="flex flex-col gap-3">
              <div className="text-center text-xs text-[#D4AF37]/50 uppercase tracking-wider font-bold mb-1">ब्राह्मी</div>
              {columnA.map((a) => {
                const matched_ = isMatchedA(a)
                const isSelected = selectedA === a
                const isWrong = wrong?.startsWith(a + '|')
                let cls = 'border-[#D4AF37]/25 bg-[#2a2420] hover:border-[#D4AF37]/50 cursor-pointer'
                if (matched_) cls = 'border-emerald-400/60 bg-emerald-500/10 text-emerald-300 cursor-default opacity-60'
                else if (isWrong) cls = 'border-red-400 bg-red-500/15 scale-95'
                else if (isSelected) cls = 'border-[#D4AF37] bg-[#D4AF37]/15 shadow-[0_0_15px_rgba(212,175,55,0.25)]'

                return (
                  <motion.button
                    key={a}
                    whileHover={!matched_ ? { scale: 1.04 } : {}}
                    whileTap={!matched_ ? { scale: 0.96 } : {}}
                    disabled={matched_}
                    onClick={() => handleSelectA(a)}
                    className={`py-5 rounded-2xl border-2 text-3xl md:text-4xl leading-none transition-all duration-200 flex items-center justify-center ${cls}`}
                    style={{ fontFamily: "'Noto Sans Brahmi', serif" }}
                  >
                    {a}
                    {matched_ && <span className="ml-1 text-sm">✓</span>}
                  </motion.button>
                )
              })}
            </div>

            {/* Column B — Devanagari */}
            <div className="flex flex-col gap-3">
              <div className="text-center text-xs text-[#D4AF37]/50 uppercase tracking-wider font-bold mb-1">देवनागरी</div>
              {/* Shuffle display order for challenge */}
              {[...columnB].reverse().map((b) => {
                const matched_ = isMatchedB(b)
                const isSelected = selectedB === b
                const wrongParts = wrong?.split('|')
                const isWrong = wrongParts?.[1] === b
                let cls = 'border-[#D4AF37]/25 bg-[#2a2420] hover:border-[#D4AF37]/50 cursor-pointer'
                if (matched_) cls = 'border-emerald-400/60 bg-emerald-500/10 text-emerald-300 cursor-default opacity-60'
                else if (isWrong) cls = 'border-red-400 bg-red-500/15 scale-95'
                else if (isSelected) cls = 'border-[#D4AF37] bg-[#D4AF37]/15 shadow-[0_0_15px_rgba(212,175,55,0.25)]'

                return (
                  <motion.button
                    key={b}
                    whileHover={!matched_ ? { scale: 1.04 } : {}}
                    whileTap={!matched_ ? { scale: 0.96 } : {}}
                    disabled={matched_}
                    onClick={() => handleSelectB(b)}
                    className={`py-5 rounded-2xl border-2 text-2xl md:text-3xl font-serif font-bold transition-all duration-200 flex items-center justify-center ${cls}`}
                  >
                    {b}
                    {matched_ && <span className="ml-1 text-sm">✓</span>}
                  </motion.button>
                )
              })}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Instruction */}
      {!allDone && (
        <p className="text-xs text-[#E6D8B8]/30 text-center">
          दोनों कॉलम से एक-एक चुनें — सही जोड़ मिलाएं
        </p>
      )}
    </motion.div>
  )
}
