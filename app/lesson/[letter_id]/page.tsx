'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { markLessonComplete } from '@/lib/progress'
import { useRouter } from 'next/navigation'
import LessonQuiz, { McqQuestion, McqOption } from '@/components/lesson/LessonQuiz'
import LessonTracer from '@/components/lesson/LessonTracer'

// TypeScript types
type Letter = {
    id: string
    letter_name: string
    brahmi_symbol: string
    order_no: number
}

type LetterStep = {
    id: string
    letter_id: string
    step_type: 'show' | 'sound' | 'explanation' | 'example' | 'practice' | 'complete'
    content: string
    order_no: number
    letters: Letter
}

export default function LessonPage({ params }: { params: Promise<{ letter_id: string }> }) {
    const [userId, setUserId] = useState<string | null>(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const router = useRouter()
    const [steps, setSteps] = useState<LetterStep[]>([])
    const supabase = createClient()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUserId(user?.id ?? null)
            setIsLoaded(true)
        }
        checkUser()
    }, [supabase])
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [letterId, setLetterId] = useState<string | null>(null)
    const [isAnimating, setIsAnimating] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)

    // Quiz state
    const [quizMode, setQuizMode] = useState(false)
    const [quizQuestions, setQuizQuestions] = useState<McqQuestion[]>([])

    // Trace state
    const [traceMode, setTraceMode] = useState(false)
    // Removed strokes state as it's no longer needed

    useEffect(() => {
        if (isLoaded && !userId) {
            router.push('/login')
        }
    }, [isLoaded, userId, router])

    // Unwrap params
    useEffect(() => {
        params.then((p) => {
            setLetterId(p.letter_id)
        })
    }, [params])

    // Fetch steps for this specific letter
    useEffect(() => {
        if (!letterId) return

        async function fetchLessonData() {
            setLoading(true)
            setError(null)

            // 1. Fetch Steps
            const { data: stepsData, error: fetchError } = await supabase
                .from('letter_steps')
                .select(`
          id,
          letter_id,
          step_type,
          content,
          order_no,
          letters (
            id,
            letter_name,
            brahmi_symbol,
            order_no
          )
        `)
                .eq('letter_id', letterId)
                .order('order_no', { ascending: true })

            if (fetchError) {
                console.error('Error fetching lesson steps:', fetchError)
                setError(`Failed to load lesson. Error: ${fetchError.message}`)
                setLoading(false)
                return
            }

            if (!stepsData || stepsData.length === 0) {
                setError('No steps found for this letter.')
                setLoading(false)
                return
            }

            setSteps(stepsData as unknown as LetterStep[])

            // 2. Fetch Quiz Questions
            const { data: quizData, error: quizError } = await supabase
                .from('mcq_questions')
                .select(`
                    id,
                    letter_id,
                    question,
                    order_no,
                    mcq_options (
                        id,
                        question_id,
                        option_text,
                        is_correct,
                        order_no
                    )
                `)
                .eq('letter_id', letterId)
                .order('order_no', { ascending: true })

            if (quizData && quizData.length > 0) {
                const formattedQuiz = quizData.map(q => ({
                    ...q,
                    options: (q.mcq_options as unknown as McqOption[]).sort((a, b) => a.order_no - b.order_no)
                }))
                setQuizQuestions(formattedQuiz)
            }

            setLoading(false)
        }

        fetchLessonData()
    }, [letterId])

    // Trigger animation on step change
    useEffect(() => {
        setIsAnimating(true)
        const timer = setTimeout(() => setIsAnimating(false), 500)
        return () => clearTimeout(timer)
    }, [currentStepIndex])

    // Handle next step
    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1)
        }
    }

    // Handle previous step
    const handlePrevious = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(currentStepIndex - 1)
        }
    }

    // Handle lesson/quiz/trace completion flow
    const handleFlowComplete = async () => {
        // FLOW: Lesson Steps -> Quiz (if available) -> Trace -> Complete

        // 1. If currently in Quiz mode, finish Quiz and go to Trace
        if (quizMode) {
            setQuizMode(false)
            setTraceMode(true)
            return
        }

        // 2. If currently in Trace mode, finish everything
        if (traceMode) {
            console.log('Completing lesson...', { userId, letterId })
            if (!isLoaded) return

            if (userId && letterId) {
                try {
                    await markLessonComplete(userId, letterId)
                } catch (err) {
                    console.error('Code Error:', err)
                    alert('Error saving progress.')
                }
            }
            router.push('/letters')
            return
        }

        // 3. If currently in Lesson mode (default implied by !quizMode && !traceMode)

        // a. If quiz exists, go to Quiz
        if (quizQuestions.length > 0) {
            setQuizMode(true)
            return
        }

        // b. If no quiz, go straight to Trace
        setTraceMode(true)
    }

    // Pronounce text using Web Speech API
    const pronounce = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel()
            let soundToSpeak = text
            const quoteMatch = text.match(/['"]([^'"]+)['"]/)
            if (quoteMatch) {
                soundToSpeak = quoteMatch[1]
            } else {
                const colonMatch = text.match(/:\s*(.+)/)
                const asMatch = text.match(/as\s+(.+)/i)
                if (colonMatch) soundToSpeak = colonMatch[1].trim()
                else if (asMatch) soundToSpeak = asMatch[1].trim()
            }

            const utterance = new SpeechSynthesisUtterance(soundToSpeak)
            utterance.lang = 'en-US'
            utterance.rate = 0.7
            utterance.pitch = 1
            utterance.onstart = () => setIsSpeaking(true)
            utterance.onend = () => setIsSpeaking(false)
            utterance.onerror = () => setIsSpeaking(false)
            window.speechSynthesis.speak(utterance)
        } else {
            alert('Sorry, your browser does not support text-to-speech.')
        }
    }

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#1C1C1C]">
                <div className="bg-[#2C2C2C] rounded-2xl p-8 shadow-2xl">
                    <h2 className="text-[#D4AF37] text-xl">Loading lesson...</h2>
                </div>
            </div>
        )
    }

    // Error state
    if (error || steps.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-5 bg-[#1C1C1C] p-4 text-center">
                <div className="bg-[#2C2C2C] rounded-2xl p-8 shadow-2xl max-w-md w-full">
                    <h2 className="text-red-500 mb-2 font-bold text-xl">Error</h2>
                    <p className="text-gray-400 mb-6">{error || 'No steps available'}</p>
                    <button
                        onClick={() => router.push('/letters')}
                        className="px-8 py-3 bg-[#D4AF37] text-[#1C1C1C] font-bold rounded-xl hover:brightness-110 transition-all"
                    >
                        Back to Letters
                    </button>
                </div>
            </div>
        )
    }

    // IF TRACE MODE IS ACTIVE
    if (traceMode) {
        return (
            <div className="min-h-screen bg-[#1C1C1C] p-4 md:p-8 flex items-center justify-center flex-col">
                <h2 className="text-[#D4AF37] text-2xl font-bold mb-8 text-center uppercase tracking-widest">
                    Trace the Letter
                </h2>
                <LessonTracer
                    letterSymbol={steps[0]?.letters.brahmi_symbol || '?'}
                    onComplete={handleFlowComplete}
                />
            </div>
        )
    }

    // IF QUIZ MODE IS ACTIVE
    if (quizMode) {
        return (
            <div className="min-h-screen bg-[#1C1C1C] p-4 md:p-8 flex items-center justify-center">
                <LessonQuiz
                    questions={quizQuestions}
                    onComplete={handleFlowComplete}
                />
            </div>
        )
    }

    // NORMAL LESSON FLOW
    const currentStep = steps[currentStepIndex]
    const letter = currentStep.letters
    const isLastStep = currentStepIndex === steps.length - 1

    const getStepColor = (stepType: string) => {
        const colors = {
            show: { primary: '#D4AF37', secondary: '#F2D06B' }, // Gold
            sound: { primary: '#E27D60', secondary: '#FF9E80' }, // Terracotta
            explanation: { primary: '#41B3A3', secondary: '#85DCB' }, // Teal
            example: { primary: '#C38D9E', secondary: '#E8A7B8' }, // Rose
            practice: { primary: '#E8A87C', secondary: '#FFD4B8' }, // Orange
            complete: { primary: '#85DCB0', secondary: '#A8F2C8' }  // Green
        }
        return colors[stepType as keyof typeof colors] || colors.show
    }

    const stepColors = getStepColor(currentStep.step_type)

    const renderStepContent = () => {
        const brahmiSymbol = letter.brahmi_symbol
        const stepType = currentStep.step_type
        const content = currentStep.content

        const baseCardStyle = {
            backgroundColor: '#2C2C2C', // Dark card
            borderRadius: '24px',
            padding: '40px 60px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            border: '1px solid #3A3A3A',
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            gap: '40px',
            transform: isAnimating ? 'scale(0.95)' : 'scale(1)',
            opacity: isAnimating ? 0.7 : 1,
            transition: 'all 0.3s ease-out',
            position: 'relative' as const,
            overflow: 'hidden' as const,
            maxWidth: '100%',
            color: 'white'
        }

        const symbolStyle = {
            fontWeight: 'bold' as const,
            backgroundImage: `linear-gradient(135deg, ${stepColors.primary}, ${stepColors.secondary})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            position: 'relative' as const,
        }

        switch (stepType) {
            case 'show':
                return (
                    <div style={{ ...baseCardStyle, padding: '80px' }}>
                        <div style={{ ...symbolStyle, fontSize: '180px' }}>{brahmiSymbol}</div>
                        <div style={{ fontSize: '24px', color: '#888', letterSpacing: '2px' }}>{letter.letter_name}</div>
                    </div>
                )
            case 'sound':
                return (
                    <div style={{ ...baseCardStyle, maxWidth: '700px' }}>
                        <div style={{ ...symbolStyle, fontSize: '140px' }}>{brahmiSymbol}</div>
                        <div className="flex items-center gap-4 bg-[#1C1C1C] p-4 rounded-xl border border-[#3A3A3A]">
                            <button
                                onClick={() => pronounce(content)}
                                className="w-12 h-12 rounded-full bg-[#D4AF37] text-black flex items-center justify-center text-xl hover:scale-110 transition-transform"
                            >
                                {isSpeaking ? '🔊' : '🔉'}
                            </button>
                            <span className="text-xl text-white">{content}</span>
                        </div>
                    </div>
                )
            default:
                return (
                    <div style={{ ...baseCardStyle, maxWidth: '800px' }}>
                        <div style={{ ...symbolStyle, fontSize: '120px' }}>{brahmiSymbol}</div>
                        <div className="text-xl text-gray-300 text-center leading-relaxed">
                            {content}
                        </div>
                    </div>
                )
        }
    }

    return (
        <div className="min-h-screen bg-[#1C1C1C] text-white flex flex-col">
            {/* Header / Progress */}
            <div className="h-20 border-b border-[#3A3A3A] flex items-center justify-between px-6 md:px-10">
                <button onClick={() => router.push('/letters')} className="text-gray-400 hover:text-white">✕</button>
                <div className="flex-1 max-w-md mx-4 h-3 bg-[#2C2C2C] rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#D4AF37] transition-all duration-500"
                        style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                    />
                </div>
                <div className="w-8" />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-6 relative">
                {/* Navigation Buttons (Left/Right) */}
                <button
                    onClick={handlePrevious}
                    disabled={currentStepIndex === 0}
                    className={`absolute left-4 md:left-10 p-4 rounded-full bg-[#2C2C2C] text-[#D4AF37] hover:bg-[#3A3A3A] disabled:opacity-30 disabled:cursor-not-allowed transition-all`}
                >
                    ←
                </button>

                {renderStepContent()}

                <button
                    onClick={isLastStep ? handleFlowComplete : handleNext}
                    className="absolute right-4 md:right-10 p-4 rounded-full bg-[#D4AF37] text-[#1C1C1C] font-bold hover:brightness-110 transition-all shadow-lg shadow-[#D4AF37]/20"
                >
                    {isLastStep ? (quizQuestions.length > 0 ? 'Quiz →' : 'Trace →') : '→'}
                </button>
            </div>
        </div>
    )
}
