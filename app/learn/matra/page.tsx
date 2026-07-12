'use client'

/**
 * /learn/matra — Matra (vowel diacritics) lesson page
 *
 * Reads directly from brahmi_matra_vyanjan_final.json → matra[]
 * Slide engine mirrors the pattern in [module]/page.tsx
 */

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { getMatraSlides, type MatraSlide } from '@/lib/matraVyanjanData'
import MatraTableEntrySlide from '@/components/course/slides/MatraTableEntrySlide'
import MatraRuleSlide from '@/components/course/slides/MatraRuleSlide'
import MatraTracingSlide from '@/components/course/slides/MatraTracingSlide'
import InfoSlide from '@/components/course/slides/InfoSlide'

// ── Compile matra slides ──────────────────────────────────────────

function compileMatraSlides(slides: MatraSlide[]) {
  return slides.map((s, i) => ({
    id: i,
    type: s.type,
    content: s,
    startPage: s.page,
    endPage: s.page,
  }))
}

// ── Slide renderer (no SlideManager — self-contained) ────────────

function MatraSlideRenderer({
  slide,
  onNext,
}: {
  slide: ReturnType<typeof compileMatraSlides>[number]
  onNext: () => void
}) {
  const { type, content } = slide

  if (type === 'matra_table_entry') {
    return (
      <MatraTableEntrySlide
        vowel={content.vowel || ''}
        matraSign={content.matraSign ?? null}
        note={content.note}
      />
    )
  }

  if (type === 'matra_rule') {
    return (
      <MatraRuleSlide
        ruleNumber={content.ruleNumber || 1}
        title={content.title || ''}
        description={content.description || ''}
        examples={content.examples}
        example={content.example}
        guidance={content.guidance}
      />
    )
  }

  if (type === 'matra_tracing_card') {
    // Adapt to CompiledSlide shape expected by MatraTracingSlide
    return (
      <MatraTracingSlide
        slide={{ type, content, startPage: content.page, endPage: content.page }}
        language="hi"
        onNext={onNext}
      />
    )
  }

  if (type === 'reward') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto min-h-[50vh] gap-8 px-4"
      >
        <div className="w-full bg-[#2a2420] border-y-4 border-[#D4AF37] rounded-3xl p-8 md:p-12 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col items-center gap-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.15)_0%,transparent_70%)] pointer-events-none" />
          <div className="z-10 px-5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-sm font-bold tracking-widest">
            ✦ पुरस्कार
          </div>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
            className="z-10 w-24 h-24 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#E69A47] p-1 shadow-[0_0_30px_rgba(212,175,55,0.4)]"
          >
            <div className="w-full h-full rounded-full bg-[#1C1C1C] flex items-center justify-center">
              <span className="text-4xl">🏆</span>
            </div>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="z-10 text-3xl md:text-5xl font-bold text-[#E6D8B8] font-serif tracking-wide"
          >
            {content.badge}
          </motion.h2>
          {content.message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="z-10 text-base md:text-lg text-[#E6D8B8]/80 leading-relaxed max-w-lg"
            >
              {content.message}
            </motion.p>
          )}
        </div>
      </motion.div>
    )
  }

  // Generic text / path_choice_confirmation / etc.
  return (
    <InfoSlide
      slide={{ type, content, startPage: content.page, endPage: content.page }}
      language="hi"
    />
  )
}

// ── Page ─────────────────────────────────────────────────────────

export default function MatraPage() {
  const router = useRouter()
  const slides = useMemo(() => compileMatraSlides(getMatraSlides()), [])

  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)

  const isLastSlide = currentSlide === slides.length - 1
  const progress = Math.round(((currentSlide + 1) / slides.length) * 100)

  const handleNext = () => {
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
        href="/learn"
        className="fixed top-3 left-3 sm:top-4 sm:left-4 z-50 flex items-center gap-1.5 px-3 py-2 bg-[#2C2C2C]/90 backdrop-blur-sm rounded-full text-[#D4AF37] hover:bg-[#3A3A3A] hover:text-[#FFD6A5] transition-all font-medium text-sm shadow-lg border border-[#D4AF37]/20"
      >
        <span className="text-lg">←</span>
        <span className="hidden sm:inline">वापस</span>
      </Link>

      {/* Module label */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1">
        <div className="text-[#D4AF37] font-black text-lg font-serif tracking-wider drop-shadow">मात्रा</div>
        <div className="text-[10px] text-[#E6D8B8]/40 uppercase tracking-widest">Vowel Diacritics</div>
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

        <div className="w-full max-w-3xl flex justify-center items-center overflow-x-hidden">
          <div className="min-w-0 w-full">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentSlide}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
                transition={{ duration: 0.3 }}
                className="w-full py-4"
              >
                <MatraSlideRenderer slide={slide} onNext={handleNext} />
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
