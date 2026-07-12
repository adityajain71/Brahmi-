'use client'

/**
 * LessonPlayer — JSON-driven lesson orchestrator
 *
 * Responsibilities:
 * - Tracks current screen index
 * - Handles next / back
 * - Auto-saves progress (debounced)
 * - Restores from last position on mount
 * - Fires onComplete when all screens are done
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CourseRenderer from '@/components/course/CourseRenderer'
import type { IntroScreen } from '@/types/course'
import { useLanguage } from '@/lib/LanguageContext'

interface LessonPlayerProps {
  lessonId: string
  moduleId: string
  screens: IntroScreen[]
  onComplete?: (meta?: Record<string, unknown>) => void
  initialScreenIndex?: number
}

// ── Progress persistence (localStorage for guest / will plug into Supabase) ──

function getStorageKey(lessonId: string) {
  return `brahmi_lesson_progress_${lessonId}`
}

function getSavedIndex(lessonId: string): number {
  if (typeof window === 'undefined') return 0
  try {
    const raw = localStorage.getItem(getStorageKey(lessonId))
    if (raw) return parseInt(raw, 10) || 0
  } catch { /* ignore */ }
  return 0
}

function saveIndex(lessonId: string, index: number) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(getStorageKey(lessonId), String(index))
  } catch { /* ignore */ }
}

function clearSavedIndex(lessonId: string) {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(getStorageKey(lessonId))
  } catch { /* ignore */ }
}

// ── Component ────────────────────────────────────────────────────

export default function LessonPlayer({
  lessonId,
  moduleId,
  screens,
  onComplete,
  initialScreenIndex,
}: LessonPlayerProps) {
  const { language } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(() =>
    initialScreenIndex ?? getSavedIndex(lessonId)
  )
  const [direction, setDirection] = useState(1)
  const [completedMeta, setCompletedMeta] = useState<Record<string, unknown>>({})
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Clamp index to valid range
  const safeIndex = Math.min(currentIndex, screens.length - 1)
  const currentScreen = screens[safeIndex]
  const isLast = safeIndex >= screens.length - 1
  const progressPercent = screens.length > 1
    ? Math.round(((safeIndex + 1) / screens.length) * 100)
    : 100

  // ── Debounced progress save ───────────────────────────────────

  const persistProgress = useCallback((index: number) => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      saveIndex(lessonId, index)
    }, 300)
  }, [lessonId])

  // ── Navigation ────────────────────────────────────────────────

  const handleNext = useCallback((meta?: Record<string, unknown>) => {
    if (meta) setCompletedMeta(prev => ({ ...prev, ...meta }))

    if (isLast) {
      clearSavedIndex(lessonId)
      onComplete?.({ ...completedMeta, ...meta, lessonId, moduleId, language })
      return
    }

    setDirection(1)
    setCurrentIndex(prev => {
      const next = Math.min(prev + 1, screens.length - 1)
      persistProgress(next)
      return next
    })
  }, [isLast, lessonId, moduleId, language, completedMeta, onComplete, screens.length, persistProgress])

  const handleBack = useCallback(() => {
    if (safeIndex === 0) return
    setDirection(-1)
    setCurrentIndex(prev => {
      const next = Math.max(prev - 1, 0)
      persistProgress(next)
      return next
    })
  }, [safeIndex, persistProgress])

  // ── Keyboard navigation ──────────────────────────────────────

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handleBack()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleNext, handleBack])

  // ── Guard ────────────────────────────────────────────────────

  if (!screens || screens.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-[#E6D8B8]/40">
        No screens in this lesson.
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#1C1C1C] text-[#E6D8B8] relative overflow-hidden">

      {/* ── Top Progress Bar ──────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-3 px-4 py-3 bg-[#1C1C1C]/90 backdrop-blur-sm border-b border-[#D4AF37]/10">
          {/* Back button */}
          <button
            onClick={handleBack}
            disabled={safeIndex === 0}
            className="shrink-0 p-2 rounded-full hover:bg-[#2a2420] text-[#D4AF37] disabled:opacity-20 transition-all"
          >
            ←
          </button>

          {/* Progress bar */}
          <div className="flex-1 h-2 bg-[#2a2420] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#D4AF37] to-[#E69A47] rounded-full"
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>

          {/* Counter */}
          <span className="shrink-0 text-xs text-[#D4AF37]/60 font-medium tabular-nums">
            {safeIndex + 1}/{screens.length}
          </span>
        </div>
      </div>

      {/* ── Screen Area ──────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center pt-16 pb-24 overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={safeIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -60 : 60 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="w-full"
          >
            <CourseRenderer
              screen={currentScreen}
              onComplete={handleNext}
              onBack={handleBack}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Mobile Bottom Nav ────────────────────────────────── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-[#1C1C1C] via-[#1C1C1C]/90 to-transparent pointer-events-none">
        <div className="pointer-events-auto flex justify-between items-center gap-3">
          <button
            onClick={handleBack}
            disabled={safeIndex === 0}
            className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-[#2a2420] border border-[#D4AF37]/20 text-[#D4AF37] font-medium disabled:opacity-20 transition-all text-sm"
          >
            ← पीछे
          </button>

          {/* Dot indicators */}
          <div className="flex gap-1.5">
            {screens.slice(0, Math.min(screens.length, 8)).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === safeIndex
                    ? 'w-4 bg-[#D4AF37]'
                    : i < safeIndex
                    ? 'w-1.5 bg-[#D4AF37]/40'
                    : 'w-1.5 bg-[#2a2420]'
                }`}
              />
            ))}
            {screens.length > 8 && (
              <span className="text-[#D4AF37]/40 text-xs self-center">…</span>
            )}
          </div>

          <button
            onClick={() => handleNext()}
            className="flex items-center gap-1.5 px-5 py-3 rounded-xl bg-[#D4AF37] text-[#1a1613] font-bold hover:brightness-110 transition-all text-sm shadow-lg"
          >
            {isLast ? 'पूर्ण ✓' : 'अगला →'}
          </button>
        </div>
      </div>
    </div>
  )
}
