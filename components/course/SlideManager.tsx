import { CompiledSlide } from '@/app/learn/[module]/page'
import React from 'react'
import InfoSlide from './slides/InfoSlide'
import VowelGridSlide from './slides/VowelGridSlide'
import MCQSlide from './slides/MCQSlide'
import TFSlide from './slides/TFSlide'
import PracticePromptSlide from './slides/PracticePromptSlide'
import GameTimeTitleSlide from './slides/GameTimeTitleSlide'
import CongratsSlide from './slides/CongratsSlide'
import RewardSlide from './slides/RewardSlide'
import TracingSlide from './slides/TracingSlide'
import MatraTracingSlide from './slides/MatraTracingSlide'
import MatraTableEntrySlide from './slides/MatraTableEntrySlide'
import MatraRuleSlide from './slides/MatraRuleSlide'
import MatraCombinationsSlide from './slides/MatraCombinationsSlide'
import RecognitionMCQSlide from './slides/RecognitionMCQSlide'
import ReverseMCQSlide from './slides/ReverseMCQSlide'
import MatchingGameSlide from './slides/MatchingGameSlide'
import FillBlankSlide from './slides/FillBlankSlide'
import SummarySlide from './slides/SummarySlide'
import { FallbackSlide } from './slides/FallbackSlide'

// Placeholder slides
const Placeholder = ({ slide, onNext }: { slide: CompiledSlide, onNext: () => void }) => (
  <div className="flex flex-col items-center justify-center p-8 bg-[#2a2420] rounded-2xl border border-[#D4AF37]/20 w-full min-h-[400px]">
    <h2 className="text-2xl text-[#D4AF37] mb-4 font-bold">{slide.type}</h2>
    <p className="text-[#E6D8B8]/80 mb-8 max-w-lg text-center">
      {JSON.stringify(slide.content, null, 2)}
    </p>
    <button
      onClick={onNext}
      className="px-6 py-3 bg-[#D4AF37] text-[#1a1613] font-bold rounded-xl hover:bg-[#F2D06B] transition-all"
    >
      Next Slide
    </button>
  </div>
)

export function SlideManager({ 
  slide, 
  moduleData,
  language,
  onNext 
}: { 
  slide: CompiledSlide
  moduleData: any
  language: string
  onNext: () => void 
}) {
  const t = slide.type.toLowerCase()
  const data = slide.content

  // ── Matra Table Entry ────────────────────────────────────────
  if (t === 'matra_table_entry') {
    return (
      <MatraTableEntrySlide
        vowel={data.vowel || ''}
        matraSign={data.matraSign}
        note={data.note}
      />
    )
  }

  // ── Matra Rule ───────────────────────────────────────────────
  if (t === 'matra_rule') {
    return (
      <MatraRuleSlide
        ruleNumber={data.ruleNumber || 1}
        title={data.title || ''}
        description={data.description || ''}
        examples={data.examples}
        example={data.example}
        guidance={data.guidance}
      />
    )
  }

  // ── Matra Tracing Card ───────────────────────────────────────
  if (t.includes('matratracingcards.items') || t === 'matra_tracing_card') {
    return <MatraTracingSlide slide={slide} language={language} onNext={onNext} />
  }

  // ── Matra Combinations ───────────────────────────────────────
  if (t === 'matra_combinations') {
    return (
      <MatraCombinationsSlide
        title={data.title || 'मात्राओं के साथ'}
        consonant={data.consonant || ''}
        consonantBrahmi={data.consonantBrahmi || ''}
        forms={data.forms || []}
        language={language}
      />
    )
  }

  // ── Recognition MCQ (Devanagari → Brahmi) ───────────────────
  if (t === 'recognition_mcq') {
    // Gather all forms from the parent module for distractors
    const allForms = Array.isArray(moduleData)
      ? moduleData
          .filter((s: any) => s.type === 'matra_combinations' && s.consonant === data.consonant)
          .flatMap((s: any) => s.forms || [])
      : []
    return (
      <RecognitionMCQSlide
        title={data.title || 'पहचान अभ्यास'}
        examples={data.examples || []}
        allForms={allForms}
        consonant={data.consonant || ''}
        consonantBrahmi={data.consonantBrahmi || ''}
        language={language}
        onNext={onNext}
      />
    )
  }

  // ── Reverse MCQ (Brahmi → Devanagari) ───────────────────────
  if (t === 'reverse_mcq') {
    const allForms = Array.isArray(moduleData)
      ? moduleData
          .filter((s: any) => s.type === 'matra_combinations' && s.consonant === data.consonant)
          .flatMap((s: any) => s.forms || [])
      : []
    return (
      <ReverseMCQSlide
        title={data.title || 'उल्टा अभ्यास'}
        examples={data.examples || []}
        allForms={allForms}
        consonant={data.consonant || ''}
        consonantBrahmi={data.consonantBrahmi || ''}
        language={language}
        onNext={onNext}
      />
    )
  }

  // ── Matching Game ────────────────────────────────────────────
  if (t === 'matching_game') {
    return (
      <MatchingGameSlide
        title={data.title || 'मिलानी गेम'}
        columnA={data.columnA || []}
        columnB={data.columnB || []}
        note={data.note}
        language={language}
        onNext={onNext}
      />
    )
  }

  // ── Fill Blank ───────────────────────────────────────────────
  if (t === 'fill_blank') {
    const allForms = Array.isArray(moduleData)
      ? moduleData
          .filter((s: any) => s.type === 'matra_combinations' && s.consonant === data.consonant)
          .flatMap((s: any) => s.forms || [])
      : []
    return (
      <FillBlankSlide
        title={data.title || 'रिक्त स्थान भरें'}
        questions={data.questions || []}
        allForms={allForms}
        consonant={data.consonant || ''}
        consonantBrahmi={data.consonantBrahmi || ''}
        language={language}
        onNext={onNext}
      />
    )
  }

  // ── Summary ──────────────────────────────────────────────────
  if (t === 'summary') {
    return (
      <SummarySlide
        title={data.title || 'समापन'}
        content={data.content || ''}
        consonant={data.consonant || ''}
        consonantBrahmi={data.consonantBrahmi || ''}
        bonusUnlock={data.bonusUnlock}
        language={language}
        onNext={onNext}
      />
    )
  }

  // ── Trace Practice ─────────────────────────────────────────────
  if (t === 'trace_practice') {
    // Re-map to match TracingSlide expectations
    const mappedSlide = {
      ...slide,
      content: {
        ...slide.content,
        brahmi: data.consonantBrahmi,
        devanagari: data.consonant,
      }
    }
    return <TracingSlide slide={mappedSlide} language={language} onNext={onNext} />
  }

  // ── Legacy / Swar module types ───────────────────────────────

  if (t.includes('practiceprompt')) {
    return <PracticePromptSlide slide={slide} onNext={onNext} />
  }

  if (t.includes('gametimetitle') || t.includes('transition')) {
    return <GameTimeTitleSlide slide={slide} language={language} onNext={onNext} />
  }

  if (t.includes('reward')) {
    return <RewardSlide slide={slide} language={language} />
  }

  if (t.includes('congrats')) {
    return <CongratsSlide slide={slide} language={language} />
  }

  const INFO_TYPES = [
    'info', 'pathchoice', 'gameoutro', 'encouragementslides', 'matraintro', 'tracingnote',
    'text', 'path_choice_confirmation', 'bonus_title', 'matra_recap_intro',
    'group_list', 'consonant_selection_recap',
    'form_pronunciation', 'bina_matra', 'pronunciation_drill', 'practice_modes',
    'quiz_modes', 'trace_loop_reference', 'mixed_quiz', 'choice_screen'
  ]

  if (INFO_TYPES.some(type => t.includes(type))) {
    return <InfoSlide slide={slide} language={language} onNext={onNext} />
  }

  if (t.includes('voweldisplaygroups')) {
    return <VowelGridSlide slide={slide} moduleData={moduleData} />
  }

  if (t.includes('gametimequiz1') || t.includes('reversequiz2')) {
    return <MCQSlide slide={slide} language={language} />
  }

  if (t.includes('truefalse') || t.includes('bonussample')) {
    return <TFSlide slide={slide} language={language} onNext={onNext} />
  }

  if (t.includes('tracingsequence')) {
    return <TracingSlide slide={slide} language={language} onNext={onNext} />
  }

  if (t.includes('matratable')) {
    return <Placeholder slide={slide} onNext={onNext} />
  }

  if (t.includes('matrarules')) {
    return <Placeholder slide={slide} onNext={onNext} />
  }

  // Fallback for anything else
  return <Placeholder slide={slide} onNext={onNext} />
}
