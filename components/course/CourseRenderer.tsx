'use client'

/**
 * CourseRenderer — Screen Registry Pattern
 *
 * Accepts a screen from course.json and renders the correct component.
 * No switch statements. Extensible: add a new screen type by registering
 * a new component in SCREEN_REGISTRY.
 */

import React, { lazy, Suspense } from 'react'
import type { IntroScreen } from '@/types/course'

// ── Lazy-loaded screen components ──────────────────────────────

const TextScreen = lazy(() => import('./screens/TextScreen'))
const StoryScreen = lazy(() => import('./screens/StoryScreen'))
const InfoScreen = lazy(() => import('./screens/InfoScreen'))
const LanguageSelectScreen = lazy(() => import('./screens/LanguageSelectScreen'))
const GoalSelectionScreen = lazy(() => import('./screens/GoalSelectionScreen'))
const QuestionnaireScreen = lazy(() => import('./screens/QuestionnaireScreen'))
const DailyGoalScreen = lazy(() => import('./screens/DailyGoalScreen'))

// ── Props shared by every screen ───────────────────────────────

export interface ScreenProps {
  screen: IntroScreen
  onComplete: (meta?: Record<string, unknown>) => void
  onBack?: () => void
}

// ── Registry ───────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ScreenComponent = React.ComponentType<ScreenProps & any>

const SCREEN_REGISTRY: Partial<Record<string, ScreenComponent>> = {
  text: TextScreen,
  story: StoryScreen,
  info: InfoScreen,
  language_select: LanguageSelectScreen,
  goal_selection: GoalSelectionScreen,
  questionnaire: QuestionnaireScreen,
  daily_goal: DailyGoalScreen,
}

// ── Fallback for unknown screen types ──────────────────────────

function UnknownScreen({ screen, onComplete }: ScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-6 text-center px-6">
      <div className="text-[#E69A47] text-sm uppercase tracking-widest opacity-60">
        Screen type: {screen.type}
      </div>
      <p className="text-[#E6D8B8]/60 text-sm">
        This screen type is not yet implemented.
      </p>
      <button
        onClick={() => onComplete()}
        className="px-6 py-3 rounded-xl bg-[#D4AF37] text-[#1a1613] font-bold hover:brightness-110 transition-all"
      >
        {screen.button ?? 'Next →'}
      </button>
    </div>
  )
}

// ── Screen loading skeleton ─────────────────────────────────────

function ScreenSkeleton() {
  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto px-6 py-12 animate-pulse">
      <div className="h-8 bg-[#D4AF37]/10 rounded-xl w-3/4 mx-auto" />
      <div className="h-4 bg-[#E6D8B8]/5 rounded w-full" />
      <div className="h-4 bg-[#E6D8B8]/5 rounded w-5/6" />
      <div className="h-4 bg-[#E6D8B8]/5 rounded w-4/6" />
    </div>
  )
}

// ── Main renderer ───────────────────────────────────────────────

interface CourseRendererProps {
  screen: IntroScreen
  onComplete: (meta?: Record<string, unknown>) => void
  onBack?: () => void
}

export default function CourseRenderer({ screen, onComplete, onBack }: CourseRendererProps) {
  const Component = SCREEN_REGISTRY[screen.type] ?? UnknownScreen

  return (
    <Suspense fallback={<ScreenSkeleton />}>
      <Component
        screen={screen}
        onComplete={onComplete}
        onBack={onBack}
      />
    </Suspense>
  )
}
