'use client'

/**
 * /learn/vyanjan/lesson — Full Vyanjan (consonant) lesson
 *
 * Reads brahmi_matra_vyanjan_final.json → vyanjan[]
 * Renders each slide through SlideManager for rich interactivity.
 */

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { getVyanjanSlides, getSlidePageNumber, type VyanjanSlide } from '@/lib/matraVyanjanData'
import { SlideManager } from '@/components/course/SlideManager'

// ── Compile ───────────────────────────────────────────────────────

function compileVyanjanSlides(slides: VyanjanSlide[]) {
  return slides
    .filter(s => s.type !== 'group_list')
    .map((s, i) => {
      const page = getSlidePageNumber(s)
      return {
        id: i,
        type: s.type,
      content: s,
      startPage: page,
      endPage: ('sourcePages' in s && s.sourcePages ? s.sourcePages[1] : page) || page,
    }
  })
}

// ── Consonant progress indicator ──────────────────────────────────

function getConsonantProgress(slides: any[], currentIdx: number) {
  // Count how many consonant cycles are done vs total
  const bonusTitles = slides.filter(s => s.type === 'bonus_title')
  const completedConsonants = slides
    .slice(0, currentIdx + 1)
    .filter(s => s.type === 'bonus_title').length
  return { total: bonusTitles.length, completed: completedConsonants }
}

// ── Page ──────────────────────────────────────────────────────────

function VyanjanLessonContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawSlides = useMemo(() => getVyanjanSlides(), [])
  const slides = useMemo(() => compileVyanjanSlides(rawSlides), [rawSlides])

  // Determine initial slide based on ?start=क
  const initialSlide = useMemo(() => {
    const startChar = searchParams.get('start')
    if (startChar) {
      const idx = slides.findIndex(s => s.content.consonant === startChar && s.type !== 'group_list')
      if (idx !== -1) return idx
    }
    return 0
  }, [searchParams, slides])

  const [currentSlide, setCurrentSlide] = useState(initialSlide)
  const [direction, setDirection] = useState(0)

  // Keep state in sync if URL param changes
  useEffect(() => {
    setCurrentSlide(initialSlide)
  }, [initialSlide])

  const isLastSlide = currentSlide === slides.length - 1
  const progress = Math.round(((currentSlide + 1) / slides.length) * 100)
  const { total: totalConsonants, completed: completedConsonants } = getConsonantProgress(slides, currentSlide)

  // Find the current consonant for the sticky header
  const currentConsonant = (() => {
    for (let i = currentSlide; i >= 0; i--) {
      const s = slides[i]?.content
      if (s?.type === 'bonus_title' && s.consonant) {
        return { devanagari: s.consonant, brahmi: s.consonantBrahmi || '' }
      }
    }
    return null
  })()

  const handleNext = () => {
    // If the current slide is the choice screen, redirect to the vyanjan map 
    // so the user can choose a consonant
    if (slide.type === 'choice_screen') {
      router.push('/learn/vyanjan')
      return
    }

    if (currentSlide < slides.length - 1) {
      setDirection(1)
      setCurrentSlide(s => s + 1)
    } else {
      router.push('/learn')
    }
  }

  const handlePrev = () => {
    if (currentSlide > 0) {
      setDirection(-1)
      setCurrentSlide(s => s - 1)
    }
  }

  const slide = slides[currentSlide]

  return (
    <div className="min-h-screen bg-[#1C1C1C] text-[#E6D8B8] flex flex-col relative overflow-hidden">

      {/* Back button */}
      <Link
        href="/learn/vyanjan"
        className="fixed top-3 left-3 sm:top-4 sm:left-4 z-50 flex items-center gap-1.5 px-3 py-2 bg-[#2C2C2C]/90 backdrop-blur-sm rounded-full text-[#D4AF37] hover:bg-[#3A3A3A] hover:text-[#FFD6A5] transition-all font-medium text-sm shadow-lg border border-[#D4AF37]/20"
      >
        <span className="text-lg">←</span>
        <span className="hidden sm:inline">व्यंजन सूची</span>
      </Link>

      {/* Sticky header — module name + current consonant */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-center pt-3 pb-2 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentConsonant?.devanagari || 'intro'}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="flex flex-col items-center"
          >
            <div className="flex items-center gap-2">
              <span className="text-[#D4AF37] font-black text-lg font-serif tracking-wider">व्यंजन</span>
              {currentConsonant && (
                <>
                  <span className="text-[#D4AF37]/40 text-sm">·</span>
                  <span className="text-[#E6D8B8]/80 text-sm font-serif font-bold">{currentConsonant.devanagari}</span>
                  <span
                    className="text-[#FFD6A5]/70 text-lg"
                    style={{ fontFamily: "'Noto Sans Brahmi', serif" }}
                  >
                    {currentConsonant.brahmi}
                  </span>
                </>
              )}
            </div>
            {totalConsonants > 0 && (
              <div className="text-[9px] text-[#E6D8B8]/30 uppercase tracking-widest">
                {completedConsonants} / {totalConsonants} व्यंजन
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress bar — desktop */}
      <div className="hidden md:block fixed top-4 right-4 z-40 w-48">
        <div className="h-2 bg-[#2C2C2C]/90 backdrop-blur-sm rounded-full overflow-hidden shadow-lg border border-[#D4AF37]/20">
          <motion.div
            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F2D06B]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="text-center text-xs text-[#D4AF37]/60 mt-1">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>

      {/* Slide area */}
      <div className="flex-1 flex items-center justify-center md:p-6 relative pt-20 pb-28 md:pb-8 overflow-x-hidden">

        {/* Left nav — desktop */}
        <button
          onClick={handlePrev}
          disabled={currentSlide === 0}
          className="hidden md:block absolute left-4 z-10 p-4 rounded-full bg-[#2C2C2C] text-[#D4AF37] hover:bg-[#3A3A3A] disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xl shadow-xl"
        >
          ←
        </button>

        <div className="w-full max-w-4xl flex justify-center items-center overflow-x-hidden">
          <div className="min-w-0 w-full">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentSlide}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
                transition={{ duration: 0.28 }}
                className="w-full py-4"
              >
                <SlideManager
                  slide={slide}
                  moduleData={rawSlides}
                  language="hi"
                  onNext={handleNext}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right nav — desktop */}
        <button
          onClick={handleNext}
          className="hidden md:block absolute right-4 z-10 p-4 rounded-full bg-[#D4AF37] text-[#1C1C1C] hover:brightness-110 transition-all text-xl shadow-xl shadow-[#D4AF37]/20 font-bold"
        >
          {isLastSlide ? '✓' : '→'}
        </button>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-[#1C1C1C] via-[#1C1C1C]/95 to-transparent pointer-events-none">
        <div className="flex justify-between items-center gap-3 pointer-events-auto">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#2C2C2C] text-[#D4AF37] border border-[#D4AF37]/30 font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg text-sm"
          >
            <span className="text-lg">←</span>
            <span>पिछला</span>
          </button>

          <div className="flex flex-col items-center gap-1 px-3 w-full">
            <div className="w-full h-1 bg-[#2C2C2C] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F2D06B] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[10px] text-[#D4AF37]/50">{currentSlide + 1}/{slides.length}</span>
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#D4AF37] text-[#1C1C1C] font-bold hover:brightness-110 transition-all shadow-lg shadow-[#D4AF37]/30 text-sm whitespace-nowrap"
          >
            <span>{isLastSlide ? 'पूर्ण' : 'अगला'}</span>
            <span className="text-lg">{isLastSlide ? '✓' : '→'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function VyanjanLessonPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1C1C1C]" />}>
      <VyanjanLessonContent />
    </Suspense>
  )
}
