'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { localizeDigits } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/lib/LanguageContext'
import { getCourse } from '@/lib/course'
import { saveProgress } from '@/lib/introModule'
import { getCurrentIdentity, type Identity } from '@/lib/guestIdentity'
import { FloatingSignIn } from '@/components/auth/FloatingSignIn'
import { SlideManager } from '@/components/course/SlideManager'

// --- Slide Compiler Logic ---
const SLIDE_SECTION_KEYS = [
  'vowelDisplayGroups',
  'practicePrompt',
  'reward1',
  'reward2',
  'reward3',
  'reward4',
  'gameTimeQuiz1_devanagariToBrahmi',
  'reverseQuiz2_brahmiToDevanagari',
  'trueFalseQuestions',
  'tracingSequence',
  'bonusSampleTrueFalse',
  'gameTimeTitle1',
  'transitionToQuiz2',
  'transitionToTracing',
  'encouragementSlides',
  'pathChoiceScreen',
  'congratsMessage',
  'matraTracingCards',
  'matraTable_sourcePages',
  'gameOutro',
  'info'
]

export type CompiledSlide = {
  type: string
  content: any
  startPage: number
  endPage: number
}

function getPages(obj: any): [number, number] | null {
  if (!obj || !obj.sourcePages || !Array.isArray(obj.sourcePages)) return null
  return [obj.sourcePages[0], obj.sourcePages[1] || obj.sourcePages[0]]
}

function compileModule(moduleData: any): CompiledSlide[] {
  if (!moduleData) return []
  
  const slides: CompiledSlide[] = []
  
  // New Array-based module format (Matra, Vyanjan)
  if (Array.isArray(moduleData)) {
    moduleData.forEach((slide) => {
      // Normalize page from sourcePages if needed
      let pageNum = slide.page
      if (pageNum === undefined && slide.sourcePages && slide.sourcePages.length > 0) {
        pageNum = slide.sourcePages[0]
      }
      slides.push({
        type: slide.type,
        content: slide,
        startPage: pageNum || 0,
        endPage: slide.sourcePages ? slide.sourcePages[1] : pageNum || 0
      })
    })
    return slides
  }
  
  // Legacy Object-based module format (Swar)
  // 1. First Pass: Extract all items
  
  SLIDE_SECTION_KEYS.forEach(key => {
    const val = moduleData[key]
    if (!val) return
    
    if (Array.isArray(val)) {
      val.forEach((v, i) => {
        const p = getPages(v)
        if (p) slides.push({ type: `${key}[${i}]`, content: v, startPage: p[0], endPage: p[1] })
      })
    } else if (typeof val === 'object' && val !== null) {
      
      let foundSub = false
      Object.keys(val).forEach(sub => {
        if (sub === 'sourcePages' || sub === 'pageRange') return
        
        if (Array.isArray(val[sub])) {
          val[sub].forEach((v: any, i: number) => {
            if (typeof v !== 'object' || v === null) return
            
            let p = getPages(v)
            if (!p) {
               // Fallback: Synthesize page if parent has a range
               const parentP = getPages(val)
               // Use a tiny fractional increment so they stay grouped together and don't spill over to later pages
               if (parentP) p = [parentP[0] + (i * 0.001), parentP[0] + (i * 0.001)]
            }
            if (p) {
              slides.push({ type: `${key}.${sub}[${i}]`, content: v, startPage: p[0], endPage: p[1] })
              foundSub = true
            }
          })
        }
      })
      if (!foundSub) {
        const p = getPages(val)
        if (p) slides.push({ type: key, content: val, startPage: p[0], endPage: p[1] })
      }
    }
  })

  // 2. Sort by Tiebreaker rules
  slides.sort((a, b) => {
    if (a.startPage !== b.startPage) return a.startPage - b.startPage
    
    // Tiebreaker 1: Shorter page range first
    const lenA = a.endPage - a.startPage
    const lenB = b.endPage - b.startPage
    if (lenA !== lenB) return lenA - lenB
    
    // Tiebreaker 2: Non-rewards before rewards
    const aIsReward = a.type.toLowerCase().includes('reward')
    const bIsReward = b.type.toLowerCase().includes('reward')
    if (aIsReward !== bIsReward) return aIsReward ? 1 : -1
    
    // Tiebreaker 2.5: Titles before non-titles
    const aIsTitle = a.type.toLowerCase().includes('title')
    const bIsTitle = b.type.toLowerCase().includes('title')
    if (aIsTitle !== bIsTitle) return aIsTitle ? -1 : 1
    
    // Tiebreaker 3: Alphabetical
    return a.type.localeCompare(b.type)
  })

  // Removed hardcoded Matra cluster injection so Swar ends at pathChoiceScreen

  return slides
}

export default function LearnModulePage() {
  const router = useRouter()
  const params = useParams()
  const moduleName = params.module as string
  const { language } = useLanguage()
  
  const [identity, setIdentity] = useState<Identity>({ type: 'none', id: null })
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)
  
  const [courseData, setCourseData] = useState<any>(null)
  
  // Load Course and State
  useEffect(() => {
    async function init() {
      try {
        const course = getCourse(language)
        
        const currentIdentity = await getCurrentIdentity()
        setIdentity(currentIdentity)
        
        const modData = (course as any)[moduleName]
        if (!modData) {
          router.push('/')
          return
        }
        setCourseData(modData)
        
        // Mark module as started
        if (currentIdentity.type === 'user' || currentIdentity.type === 'guest') {
          await saveProgress(`module-${moduleName}`, 'in_progress', 0, currentIdentity)
        }
      } catch (err) {
        console.error('Error in init:', err)
        router.push('/')
      }
    }
    init()
  }, [language, moduleName, router])

  const slides = useMemo(() => compileModule(courseData), [courseData])
  console.log('courseData for module', moduleName, courseData)
  console.log('compiled slides', slides)

  if (!courseData || slides.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1613] via-[#2a2420] to-[#1a1613] flex items-center justify-center">
        <div className="text-[#D4AF37] text-xl animate-pulse">Loading {moduleName}...</div>
      </div>
    )
  }

  const finishModule = async () => {
    if (identity.type === 'user' || identity.type === 'guest') {
      await saveProgress(`module-${moduleName}`, 'completed', 100, identity)
    }
    router.push('/learn/swar')
  }

  const handleNext = async () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1)
      setCurrentSlide(currentSlide + 1)
      
      const progress = Math.round(((currentSlide + 2) / slides.length) * 100)
      if (identity.type === 'user' || identity.type === 'guest') {
        await saveProgress(`module-${moduleName}`, 'in_progress', progress, identity)
      }
    } else {
      await finishModule()
    }
  }

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setDirection(-1)
      setCurrentSlide(currentSlide - 1)
    }
  }

  const currentContent = slides[currentSlide]
  const isLastSlide = currentSlide === slides.length - 1
  const progressNumber = (value: number | string) => localizeDigits(String(value), language)
  
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

      <FloatingSignIn />

      {/* Progress Bar - Desktop */}
      <div className="hidden md:block fixed top-4 left-1/2 -translate-x-1/2 z-40 w-48 sm:w-64 md:w-80">
        <div className="h-2 bg-[#2C2C2C]/90 backdrop-blur-sm rounded-full overflow-hidden shadow-lg border border-[#D4AF37]/20">
          <motion.div
            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F2D06B]"
            initial={{ width: 0 }}
            animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="text-center text-xs text-[#D4AF37]/60 mt-1">
          {progressNumber(currentSlide + 1)} / {progressNumber(slides.length)}
        </div>
      </div>

      {/* Main Slide Area */}
      <div className="flex-1 flex items-center justify-center md:p-6 relative pt-16 md:pt-16 pb-24 md:pb-0 overflow-x-hidden">
        {/* Nav Left - Desktop */}
        <button
          onClick={handlePrevious}
          disabled={currentSlide === 0}
          className="hidden md:block absolute left-2 md:left-10 z-10 p-3 md:p-4 rounded-full bg-[#2C2C2C] text-[#D4AF37] hover:bg-[#3A3A3A] disabled:opacity-30 disabled:cursor-not-allowed transition-all text-lg md:text-xl shadow-xl"
        >
          ←
        </button>

        <div className="w-full h-full overflow-y-auto overflow-x-hidden max-w-6xl flex justify-center items-center">
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
                {moduleName === 'swar' && currentSlide <= 2 && (
                  <div className="w-full text-center mb-6">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#D4AF37] font-serif tracking-widest drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                      {language === 'hi' ? 'स्वर' : 'Swar'}
                    </h1>
                  </div>
                )}
                <SlideManager 
                  slide={currentContent} 
                  moduleData={courseData}
                  language={language}
                  onNext={handleNext}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Nav Right - Desktop */}
        <button
          onClick={handleNext}
          className="hidden md:block absolute right-2 md:right-10 z-10 p-3 md:p-4 rounded-full bg-[#D4AF37] text-[#1C1C1C] hover:brightness-110 transition-all text-lg md:text-xl shadow-xl shadow-[#D4AF37]/20 font-bold"
        >
          {isLastSlide ? '✓' : '→'}
        </button>
      </div>
      
      {/* Mobile Footer / Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-[#1C1C1C] via-[#1C1C1C]/95 to-transparent pointer-events-none">
        <div className="flex justify-between items-center gap-3 pointer-events-auto">
          <button
            onClick={handlePrevious}
            disabled={currentSlide === 0}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#2C2C2C] text-[#D4AF37] border border-[#D4AF37]/30 font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg text-sm"
          >
            <span className="text-lg">←</span>
            <span>Prev</span>
          </button>

          <div className="flex flex-col items-center gap-1 px-3 w-full">
            <div className="w-full h-1 bg-[#2C2C2C] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F2D06B] transition-all duration-300"
                style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
              />
            </div>
          </div>
          
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#D4AF37] text-[#1C1C1C] font-bold hover:brightness-110 transition-all shadow-lg shadow-[#D4AF37]/30 text-sm whitespace-nowrap"
          >
            <span>{isLastSlide ? 'Done' : 'Next'}</span>
            <span className="text-lg">{isLastSlide ? '✓' : '→'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
