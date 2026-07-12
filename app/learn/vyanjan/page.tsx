'use client'

/**
 * /learn/vyanjan — Consonant (Vyanjan) learning map
 *
 * Shows all 33 consonants organized by their phonetic groups.
 * Links to the full slide-based lesson at /learn/vyanjan/lesson
 * Data comes entirely from content/{lang}/course.json.
 */

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getVyanjanSlides } from '@/lib/matraVyanjanData'

function ConsonantCard({
  consonant,
  index,
  onSelect,
}: {
  consonant: { devanagari: string; brahmi: string; number?: number }
  index: number
  onSelect: (devanagari: string) => void
}) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(consonant.devanagari)}
      className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-[#2a2420] border border-[#D4AF37]/20 hover:border-[#D4AF37] hover:shadow-[0_0_16px_rgba(212,175,55,0.2)] transition-all group"
    >
      {/* Brahmi glyph */}
      <span
        className="text-3xl text-[#D4AF37] group-hover:text-[#E69A47] transition-colors leading-none"
        style={{ fontFamily: "'Noto Sans Brahmi', serif" }}
      >
        {consonant.brahmi}
      </span>
      {/* Devanagari label */}
      <span className="text-sm text-[#E6D8B8]/70 font-medium">{consonant.devanagari}</span>
    </motion.button>
  )
}

export default function VyanjanPage() {
  const router = useRouter()
  
  const groups = useMemo(() => {
    const slides = getVyanjanSlides()
    return slides.filter(s => s.type === 'group_list')
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1613] via-[#2a2420] to-[#1a1613] text-[#F5F1E8]">

      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#1a1613]/90 backdrop-blur-sm border-b border-[#D4AF37]/15 px-4 py-4">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="text-[#D4AF37] p-2 rounded-full hover:bg-[#2a2420] transition-all"
          >
            ←
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#D4AF37] font-serif">व्यंजन</h1>
            <p className="text-[10px] text-[#E6D8B8]/40 uppercase tracking-widest">Consonants</p>
          </div>
          <div className="ml-auto text-xs text-[#E6D8B8]/40">
            {groups.reduce((acc, g) => acc + (g.items?.length || 0), 0)} व्यंजन
          </div>
        </div>
      </div>


      {/* Lesson Start Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-2xl mx-auto px-4 pt-4"
      >
        <Link
          href="/learn/vyanjan/lesson"
          className="group flex items-center justify-between w-full bg-gradient-to-r from-[#D4AF37]/15 to-[#E69A47]/10 border border-[#D4AF37]/35 rounded-2xl px-5 py-4 hover:border-[#D4AF37]/70 hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center border border-[#D4AF37]/30">
              <span className="text-xl" style={{ fontFamily: "'Noto Sans Brahmi', serif" }}>𑀓</span>
            </div>
            <div>
              <div className="text-sm font-bold text-[#D4AF37]">पूर्ण व्यंजन पाठ</div>
              <div className="text-xs text-[#E6D8B8]/50">मात्रा · उच्चारण · अभ्यास</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-[#D4AF37] text-[#1a1613] rounded-xl px-4 py-2 text-sm font-black group-hover:scale-105 transition-transform shadow-md">
            पाठ शुरू →
          </div>
        </Link>
      </motion.div>

      {/* Consonant groups */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8 pb-20">
        {groups.map((group: any, gIdx: number) => (
          <motion.section
            key={group.groupName || gIdx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gIdx * 0.08 }}
          >
            {/* Group header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-[#D4AF37]/15" />
              <div className="text-center">
                <div className="text-sm font-bold text-[#D4AF37] font-serif">{group.groupName}</div>
                <div className="text-[10px] text-[#E6D8B8]/40 uppercase tracking-widest">{group.groupNote}</div>
              </div>
              <div className="flex-1 h-px bg-[#D4AF37]/15" />
            </div>

            {/* Consonant cards grid */}
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-5 md:gap-3">
              {group.items?.map((consonant: any, cIdx: number) => (
                <ConsonantCard
                  key={consonant.number || cIdx}
                  consonant={consonant}
                  index={gIdx * 5 + cIdx}
                  onSelect={(dev) => router.push(`/learn/vyanjan/lesson?start=${dev}`)}
                />
              ))}
            </div>
          </motion.section>
        ))}

        {/* Bottom CTA */}
        <div className="text-center pt-4 pb-8 flex flex-col items-center gap-3">
          <p className="text-[#E6D8B8]/30 text-xs">
            किसी भी व्यंजन पर क्लिक करके उसका विवरण देखें
          </p>
          <Link
            href="/learn/vyanjan/lesson"
            className="inline-flex items-center gap-2 text-[#D4AF37]/60 hover:text-[#D4AF37] text-xs font-bold uppercase tracking-widest transition-colors"
          >
            <span>पूर्ण पाठ शुरू करें</span>
            <span>→</span>
          </Link>
        </div>
      </div>

    </div>
  )
}
