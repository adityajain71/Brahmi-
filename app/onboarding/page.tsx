'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { localizeDigits } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { getIntroSteps } from '@/lib/course'
import { saveProgress, type IntroLessonContent } from '@/lib/introModule'
import { getCurrentIdentity, type Identity } from '@/lib/guestIdentity'
import JainBabaCharacter from '@/components/lesson/JainBabaCharacter'
import { FloatingSignIn } from '@/components/auth/FloatingSignIn'
import { useLanguage } from '@/lib/LanguageContext'

function IntroGreetingImage({ src }: { src: string }) {
  return (
    <motion.div
      className="pointer-events-none hidden md:flex items-center justify-center self-center"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
      transition={{
        opacity: { duration: 0.25 },
        x: { duration: 0.3 },
        y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
      }}
      aria-hidden="true"
    >
      <Image
        src={src}
        alt=""
        width={170}
        height={313}
        className="h-52 w-auto object-contain drop-shadow-2xl lg:h-64"
        priority
      />
    </motion.div>
  )
}

// Unified Slide Component - Adapts JSON screen types to the old visual layouts
function UnifiedSlide({ 
  slideContent, 
  onOptionSelect 
}: { 
  slideContent: any;
  onOptionSelect?: (value: string, metaInfo?: Record<string, any>) => void;
}) {
  const { type, title, content, subtitle, options } = slideContent
  const [selected, setSelected] = useState<string | null>(null)

  const handleOptionSelect = (option: string) => {
    setSelected(option)
    
    // Pass metadata back up if this is a language or daily goal selection
    let metaInfo = {}
    if (type === 'language_select') {
      const languageMap: Record<string, string> = {
        'हिंदी': 'hi', 'English': 'en', 'ಕನ್ನಡ': 'kn', 'தமிழ்': 'ta'
      }
      metaInfo = { language: languageMap[option] || 'hi' }
    } else if (type === 'daily_goal') {
      metaInfo = { dailyGoal: option }
    }
    
    onOptionSelect?.(option, metaInfo)
  }

  // Reset selection when slide changes
  useEffect(() => {
    setSelected(null)
  }, [slideContent.page])

  // Map JSON types to the classic visual layouts
  switch (type) {
    // 1. TEXT SLIDES (text, story, info)
    case 'text':
    case 'story':
    case 'info':
      return (
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <JainBabaCharacter 
            message={content || title || ''}
            variant={type === 'story' ? 'excited' : 'default'}
          />
          {title && (
            <h2 className="text-2xl md:text-4xl font-bold text-[#D4AF37] mb-4 md:mb-6">{title}</h2>
          )}
          {subtitle && (
            <h3 className="text-xl md:text-2xl font-bold text-[#E69A47] mb-4 md:mb-6">{subtitle}</h3>
          )}
          {content && (
            <p className="text-base md:text-lg text-[#E6D8B8]/90 leading-relaxed whitespace-pre-line">
              {content}
            </p>
          )}
        </div>
      )

    // 2. QUESTIONNAIRE SLIDES (language_select, goal_selection, daily_goal, questionnaire)
    case 'language_select':
    case 'goal_selection':
    case 'daily_goal':
    case 'questionnaire':
    case 'mcq':
      return (
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <JainBabaCharacter 
            message={content || title || ''}
            variant="default"
          />
          {title && (
            <h2 className="text-2xl md:text-4xl font-bold text-[#D4AF37] mb-4 md:mb-6 text-center">{title}</h2>
          )}
          {content && (
            <p className="text-lg md:text-xl text-[#E6D8B8]/80 mb-6 md:mb-8 text-center">{content}</p>
          )}
          {options && options.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {options.map((option: string, idx: number) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOptionSelect(option)}
                  className={`
                    p-4 rounded-xl border-2 text-lg font-medium transition-all
                    ${selected === option
                      ? 'bg-[#D4AF37] border-[#D4AF37] text-[#1a1613]'
                      : 'bg-[#2a2420] border-[#D4AF37]/30 text-[#E6D8B8] hover:border-[#D4AF37]'
                    }
                  `}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          )}
        </div>
      )

    default:
      return (
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <p className="text-[#E6D8B8]/70">Unknown content type: {type}</p>
        </div>
      )
  }
}

export default function OnboardingPage() {
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  
  const [identity, setIdentity] = useState<Identity>({ type: 'none', id: null })
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)
  const [optionSelected, setOptionSelected] = useState(false)
  
  // JSON Screens
  const contents = useMemo(() => getIntroSteps(language), [language])

  useEffect(() => {
    async function loadIdentity() {
      const currentIdentity = await getCurrentIdentity()
      setIdentity(currentIdentity)
      
      // Mark module as started
      if (currentIdentity.type === 'user' || currentIdentity.type === 'guest') {
        await saveProgress('module-intro', 'in_progress', 0, currentIdentity)
      }
    }
    loadIdentity()
  }, [])

  // Reset option selection state when slide changes
  useEffect(() => {
    setOptionSelected(false)
  }, [currentSlide])

  const finishLesson = async () => {
    // Mark as completed
    if (identity.type === 'user' || identity.type === 'guest') {
      await saveProgress('module-intro', 'completed', 100, identity)
    }
    router.push('/learn/swar')
  }

  const handleNext = async () => {
    if (currentSlide < contents.length - 1) {
      setDirection(1)
      setCurrentSlide(currentSlide + 1)
      
      // Update progress
      const progress = Math.round(((currentSlide + 2) / contents.length) * 100)
      if (identity.type === 'user' || identity.type === 'guest') {
        await saveProgress('module-intro', 'in_progress', progress, identity)
      }
    } else {
      await finishLesson()
    }
  }

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setDirection(-1)
      setCurrentSlide(currentSlide - 1)
    }
  }

  if (!contents || contents.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#1a1613] via-[#2a2420] to-[#1a1613] flex items-center justify-center">
        <div className="text-[#D4AF37] text-xl">Loading...</div>
      </div>
    )
  }

  const currentContent = contents[currentSlide]
  const isLastSlide = currentSlide === contents.length - 1
  const progressNumber = (value: number | string) => localizeDigits(String(value), language)
  
  // Determine if it's a questionnaire-style slide that requires an option to be selected
  const requiresOptionSelection = ['language_select', 'goal_selection', 'questionnaire', 'daily_goal', 'mcq'].includes(currentContent.type)
  const canProceed = !requiresOptionSelection || optionSelected

  const greetingImageSrc = currentSlide > contents.length / 2 
    ? '/mascot/bramhi_jumping_clean_hires.png'
    : '/mascot/bramhi_greeting.png'

  return (
    <div className="min-h-screen bg-[#1C1C1C] text-[#E6D8B8] flex flex-col relative overflow-hidden">
      {/* Floating Back Button */}
      <Link 
        href="/learn"
        className="fixed top-3 left-3 sm:top-4 sm:left-4 z-50 flex items-center gap-1.5 px-1.5 py-1 sm:px-4 sm:py-2 bg-[#2C2C2C]/90 backdrop-blur-sm rounded-full text-[#D4AF37] hover:bg-[#3A3A3A] hover:text-[#FFD6A5] transition-all font-medium text-sm shadow-lg border border-[#D4AF37]/20"
      >
        <span className="text-sm sm:text-lg">←</span>
        <span className="hidden sm:inline">Exit</span>
      </Link>

      {/* Floating Sign In Button */}
      <FloatingSignIn />

      {/* Floating Progress Bar - Desktop Only */}
      <div className="hidden md:block fixed top-4 left-1/2 -translate-x-1/2 z-40 w-48 sm:w-64 md:w-80">
        <div className="h-2 bg-[#2C2C2C]/90 backdrop-blur-sm rounded-full overflow-hidden shadow-lg border border-[#D4AF37]/20">
          <motion.div
            className="h-full bg-linear-to-r from-[#D4AF37] to-[#F2D06B]"
            initial={{ width: 0 }}
            animate={{ width: `${((currentSlide + 1) / contents.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="text-center text-xs text-[#D4AF37]/60 mt-1">
          {progressNumber(currentSlide + 1)} / {progressNumber(contents.length)}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex items-center justify-center md:p-6 relative pt-16 md:pt-16 pb-24 md:pb-0 overflow-x-hidden">
        {/* Navigation Buttons (Left/Right) - Desktop Only */}
        <button
          onClick={handlePrevious}
          disabled={currentSlide === 0}
          className={`hidden md:block absolute left-2 md:left-10 z-10 p-3 md:p-4 rounded-full bg-[#2C2C2C] text-[#D4AF37] hover:bg-[#3A3A3A] disabled:opacity-30 disabled:cursor-not-allowed transition-all text-lg md:text-xl shadow-xl`}
        >
          ←
        </button>

        <div className="w-full h-full overflow-y-auto overflow-x-hidden max-w-6xl md:grid md:grid-cols-[minmax(0,1fr)_180px] lg:grid-cols-[minmax(0,1fr)_220px] md:items-center md:gap-6">
          <div className="min-w-0 w-full">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentSlide}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
                transition={{ duration: 0.3 }}
                className="w-full py-8"
              >
                <UnifiedSlide
                  slideContent={currentContent}
                  onOptionSelect={async (val, metaInfo) => {
                    setOptionSelected(true)
                    
                    const skipStrings = ['सीधे आगे बढ़ें?', 'Skip ahead?', 'ನೇರವಾಗಿ ಮುಂದೆ ಹೋಗಿ?', 'நேரடியாக முன்னேறவா?']
                    if (skipStrings.includes(val)) {
                      if (identity.type === 'user' || identity.type === 'guest') {
                        await saveProgress('module-intro', 'completed', 100, identity)
                      }
                      router.push('/learn/swar')
                      return
                    }
                    
                    // Handle language change immediately
                    if (metaInfo?.language) {
                      setLanguage(metaInfo.language as 'hi' | 'en' | 'kn' | 'ta')
                    }
                    
                    // Handle daily goal storage immediately
                    if (metaInfo?.dailyGoal) {
                      try {
                        localStorage.setItem('brahmi_daily_goal', String(metaInfo.dailyGoal))
                      } catch { /* ignore */ }
                    }
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <IntroGreetingImage src={greetingImageSrc} />
        </div>

        {/* Desktop Next / Arrow */}
        {canProceed ? (
          <button
            onClick={handleNext}
            className="hidden md:block absolute right-2 md:right-10 z-10 p-3 md:p-4 rounded-full bg-[#D4AF37] text-[#1C1C1C] font-bold hover:brightness-110 transition-all shadow-lg shadow-[#D4AF37]/20 text-lg md:text-xl"
          >
            {isLastSlide ? '✓' : '→'}
          </button>
        ) : (
          <button
            disabled
            className="hidden md:block absolute right-2 md:right-10 z-10 p-3 md:p-4 rounded-full bg-[#2C2C2C] text-[#D4AF37] opacity-30 cursor-not-allowed transition-all shadow-lg text-lg md:text-xl"
          >
            {isLastSlide ? '✓' : '→'}
          </button>
        )}
      </div>

      {/* Mobile Navigation Buttons (Bottom) - Only visible on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-linear-to-t from-[#1C1C1C] via-[#1C1C1C]/95 to-transparent pointer-events-none">
        <div className="flex justify-between items-center gap-3 pointer-events-auto">
          {/* Previous Button - Bottom Left */}
          <button
            onClick={handlePrevious}
            disabled={currentSlide === 0}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl bg-[#2C2C2C] text-[#D4AF37] border border-[#D4AF37]/30 font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg text-sm`}
          >
            <span className="text-lg">←</span>
            <span>Prev</span>
          </button>

          {/* Progress Indicator - Center */}
          <div className="flex flex-col items-center gap-1 px-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[#D4AF37] font-bold text-sm">{progressNumber(currentSlide + 1)}</span>
              <span className="text-[#D4AF37]/40 text-xs">/</span>
              <span className="text-[#D4AF37]/60 text-xs">{progressNumber(contents.length)}</span>
            </div>
            <div className="w-16 h-1 bg-[#2C2C2C] rounded-full overflow-hidden">
              <div 
                className="h-full bg-linear-to-r from-[#D4AF37] to-[#F2D06B] transition-all duration-300"
                style={{ width: `${((currentSlide + 1) / contents.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Next/Complete Button - Bottom Right */}
          {canProceed ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#D4AF37] text-[#1C1C1C] font-bold hover:brightness-110 transition-all shadow-lg shadow-[#D4AF37]/30 text-sm"
            >
              <span>{isLastSlide ? 'Complete' : 'Next'}</span>
              <span className="text-lg">{isLastSlide ? '✓' : '→'}</span>
            </button>
          ) : (
            <button
              disabled
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#2C2C2C] text-[#D4AF37] border border-[#D4AF37]/30 opacity-30 cursor-not-allowed font-medium transition-all shadow-lg text-sm"
            >
              <span>{isLastSlide ? 'Complete' : 'Next'}</span>
              <span className="text-lg">{isLastSlide ? '✓' : '→'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Keyboard navigation script */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
              const prevBtn = document.querySelector('button[disabled="false"]:first-child');
              prevBtn?.click();
            }
            if (e.key === 'ArrowRight') {
              const nextBtn = document.querySelector('button:last-child');
              nextBtn?.click();
            }
          });
        `
      }} />
    </div>
  )
}
