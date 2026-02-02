'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getUserProgress } from '@/lib/progress'
import { getCurrentIdentity, Identity } from '@/lib/guestIdentity'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

type Letter = {
    id: string
    letter_name: string
    brahmi_symbol: string
    order_no: number
}

// Exact path segments for animation
const PATH_SEGMENTS = [
    "M200 100 Q200 140 270 180 Q340 220 340 260 L340 280", // 0 -> 1
    "M340 280 Q340 320 200 360 Q60 400 60 440 L60 460",   // 1 -> 2
    "M60 460 Q60 500 270 540 Q340 580 340 620 L340 640",  // 2 -> 3
    "M340 640 Q340 680 200 720"                           // 3 -> 4
]

export default function LettersPage() {
    const [identity, setIdentity] = useState<Identity>({ type: 'none', id: null })
    const [isLoaded, setIsLoaded] = useState(false)
    const [letters, setLetters] = useState<Letter[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const loadIdentity = async () => {
            const currentIdentity = await getCurrentIdentity()
            setIdentity(currentIdentity)
            setIsLoaded(true)
        }
        loadIdentity()
    }, [supabase])

    // Progression State
    const [completedIds, setCompletedIds] = useState<string[]>([])
    const [activeIndex, setActiveIndex] = useState(0)

    // Animation State
    const [animatingPathIndex, setAnimatingPathIndex] = useState<number | null>(null)
    const [showCelebration, setShowCelebration] = useState(false)
    const [justCompletedIndex, setJustCompletedIndex] = useState<number | null>(null)
    const router = useRouter()

    // No authentication check needed - guests are allowed

    // 1. Fetch Letters Configuration
    useEffect(() => {
        async function fetchLetters() {
            const { data, error } = await supabase
                .from('letters')
                .select('id, letter_name, brahmi_symbol, order_no')
                .order('order_no', { ascending: true })

            if (error) {
                console.error('Error fetching letters:', error)
            } else {
                setLetters(data || [])
            }
            setLoading(false)
        }
        fetchLetters()
    }, [])

    // 2. Fetch User Progress & Trigger Animation
    useEffect(() => {
        if (!isLoaded) {
            console.log('LETTERS_DBG: Waiting for identity...', { isLoaded })
            return
        }

        async function fetchProgress() {
            console.log('LETTERS_DBG: Fetching progress for', identity)

            // Get progress using unified API
            const { completedIds: fetchedCompletedIds } = await getUserProgress(identity)
            const progressCount = fetchedCompletedIds.length

            // Get local count to detect "Just Completed" event
            const localCountStr = localStorage.getItem('brahmi_completed_count')
            const localCount = localCountStr ? parseInt(localCountStr) : 0

            console.log('LETTERS_DBG: State Check:', {
                progressCount,
                localCount,
                completedIds: fetchedCompletedIds,
                willAnimate: progressCount > localCount
            })

            // LOGIC: If progress has MORE items than local, user just finished a lesson
            if (progressCount > localCount) {
                console.log(`LETTERS_DBG: Progress Detected: Local ${localCount} -> Progress ${progressCount}`)

                // 1. Set initial state to BEFORE completion to allow animation
                setCompletedIds(fetchedCompletedIds.slice(0, localCount))
                setActiveIndex(localCount)
                setJustCompletedIndex(localCount)

                // 2. Start Animation Sequence
                setTimeout(() => {
                    setShowCelebration(true)

                    setTimeout(() => {
                        setShowCelebration(false)
                        setAnimatingPathIndex(localCount)
                    }, 400)

                    setTimeout(() => {
                        setAnimatingPathIndex(null)
                        setCompletedIds(fetchedCompletedIds)
                        setActiveIndex(progressCount)
                        setJustCompletedIndex(null)
                        localStorage.setItem('brahmi_completed_count', progressCount.toString())
                    }, 1000)
                }, 500)
            } else {
                // No new progress, just sync
                setCompletedIds(fetchedCompletedIds)
                setActiveIndex(progressCount)
                localStorage.setItem('brahmi_completed_count', progressCount.toString())
            }
        }

        if (letters.length > 0) {
            fetchProgress()
        }
    }, [isLoaded, identity.type, identity.id, letters.length])


    if (loading || !isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#1F1D3A]">
                <div className="text-xl text-[#D4AF37] font-serif animate-pulse">Loading journey...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#1F1D3A] text-white overflow-hidden relative">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#151428_100%)] pointer-events-none" />

            {/* Header */}
            <div className="w-full border-b border-[#D4AF37]/20 py-8 text-center bg-[#1F1D3A]/95 backdrop-blur-sm sticky top-0 z-50 relative">
                {/* Back Button */}
                <button
                    onClick={() => router.push('/')}
                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 flex items-center gap-2 text-[#D4AF37] hover:text-[#FFD6A5] transition-colors group"
                    aria-label="Back to home"
                >
                    <svg
                        className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="hidden md:inline text-sm font-medium">Back</span>
                </button>

                <div className="text-[#6C7BAF] font-bold tracking-[0.2em] text-xs mb-3 uppercase">Section 1</div>
                <h1 className="text-4xl font-serif text-white mb-2 font-bold tracking-wide">Vowels</h1>
                <p className="text-[#E6D8B8]/80 text-sm font-medium">Learn Brahmi vowels step by step</p>
                <div className="text-[10px] text-gray-500 mt-1">DEBUG: Check Console for Progress Logs</div>
            </div>

            {/* Journey Canvas */}
            <div className="w-full max-w-[400px] mx-auto relative mt-16 pb-40 flex flex-col items-center z-10 px-4">

                {/* Connecting Line (Base) */}
                <svg
                    className="absolute top-12 left-0 w-full h-full pointer-events-none -z-10"
                    viewBox="0 0 400 800"
                    preserveAspectRatio="xMidYMin slice"
                    style={{ minHeight: '800px' }}
                >
                    <defs>
                        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.1" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M200 40 L200 100 Q200 140 270 180 Q340 220 340 260 L340 280 Q340 320 200 360 Q60 400 60 440 L60 460 Q60 500 270 540 Q340 580 340 620 L340 640 Q340 680 200 720"
                        fill="none"
                        stroke="url(#pathGradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray="12 12"
                    />

                    {/* Animated Progression Overlay */}
                    <AnimatePresence>
                        {animatingPathIndex !== null && (
                            <motion.path
                                key={`path-${animatingPathIndex}`}
                                d={PATH_SEGMENTS[animatingPathIndex]}
                                fill="none"
                                stroke="#E69138" // Saffron fill
                                strokeWidth="8"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                            />
                        )}
                    </AnimatePresence>
                </svg>

                {letters.map((letter, index) => {
                    // Position Rules
                    let positionClass = 'mx-auto'
                    if (index === 1) positionClass = 'ml-auto mr-0 translate-x-[-20px]'
                    if (index === 2) positionClass = 'mr-auto ml-0 translate-x-[20px]'
                    if (index === 3) positionClass = 'ml-auto mr-0 translate-x-[-20px]'
                    if (index === 4) positionClass = 'mx-auto translate-y-[0px]'

                    // State Logic
                    // A node is completed if its ID is in the completed list
                    const isCompleted = completedIds.includes(letter.id)
                    // It is current if it's the next one after the last completed one
                    // OR if it's the one currently being "celebrated" as just finished
                    const isCurrent = index === activeIndex

                    // Celebration targets the node that was JUST completed
                    const isCelebrating = index === justCompletedIndex && showCelebration

                    // Visual Styling
                    let sizeClass = 'w-22 h-22 scale-95'
                    let bgClass = 'bg-[#D4AF37]/10 backdrop-blur-md border-2 border-[#D4AF37]/40 hover:bg-[#D4AF37]/20 hover:border-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                    let textClass = 'text-[#E6D8B8]'
                    let subTextClass = 'text-[#D4AF37]/80'

                    if (isCurrent) {
                        sizeClass = 'w-28 h-28'
                        bgClass = 'bg-[#E69138] shadow-[0_0_30px_rgba(230,145,56,0.4)] border-4 border-[#FFD6A5]'
                        textClass = 'text-white'
                        subTextClass = 'text-[#FFE8C8]'
                    } else if (isCompleted) {
                        sizeClass = 'w-22 h-22'
                        bgClass = 'bg-[#E69138]/20 border-2 border-[#E69138]/60'
                        textClass = 'text-[#E69138]'
                        subTextClass = 'text-[#E69138]/70'
                    }

                    const marginTop = index === 0 ? 'mt-0' : 'mt-16'

                    return (
                        <div key={letter.id} className={`${positionClass} ${marginTop} relative group`}>

                            {/* MASCOTS: Fixed Layout Indices (Persistent) */}

                            {/* Primary Mascot (Start) */}
                            {index === 0 && (
                                <div className="absolute -left-20 top-0 lg:translate-x-0 lg:-left-36 lg:top-6 w-16 md:w-20 lg:w-32 z-20">
                                    <Image
                                        src="/assets/mascot_1.png"
                                        alt="Mascot"
                                        width={128}
                                        height={128}
                                        className="object-contain transform scale-x-[-1] drop-shadow-2xl"
                                    />
                                    {/* Only show speech bubble if it's the very first lesson */}
                                    {activeIndex === 0 && (
                                        <div className="absolute -top-6 -right-4 bg-white px-4 py-2 rounded-xl text-sm font-black text-[#E69138] shadow-lg whitespace-nowrap arrow-right transform rotate-2">
                                            Let's Begin!
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Mid-Journey Mascot (Lesson 3) */}
                            {index === 2 && (
                                <div className="absolute -right-24 -top-4 lg:-right-96 lg:-top-8 w-16 md:w-20 lg:w-24 z-20">
                                    <Image
                                        src="/assets/mascot_2.png"
                                        alt="Mascot"
                                        width={128}
                                        height={128}
                                        className="object-contain drop-shadow-lg"
                                    />
                                    {/* Brief encouragement if active is near here */}
                                    {activeIndex === 2 && (
                                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-[#D4AF37] shadow-sm whitespace-nowrap border border-[#E6D8B8]">
                                            Keep Going!
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* End-Journey Mascot (Lesson 5) */}
                            {index === 4 && (
                                <div className="absolute -left-20 -bottom-8 lg:-left-28 lg:-bottom-14 w-16 md:w-20 lg:w-24 z-20">
                                    <Image
                                        src="/assets/mascot_3.png"
                                        alt="Mascot"
                                        width={112}
                                        height={112}
                                        className="object-contain transform scale-x-[-1] drop-shadow-md"
                                    />
                                    {activeIndex === 4 && (
                                        <div className="absolute -top-6 right-0 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold text-[#6C7BAF] shadow-sm whitespace-nowrap border border-[#E6D8B8]">
                                            Almost There
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Start Bubble CTA (Only on Current) */}
                            {isCurrent && (
                                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-[#E69138] border-2 border-[#FFD6A5] px-6 py-2 rounded-2xl text-center shadow-[0_4px_20px_rgba(0,0,0,0.3)] animate-bounce z-20">
                                    <span className="text-white font-black text-sm uppercase tracking-widest">Start</span>
                                    <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#E69138] border-b-2 border-r-2 border-[#FFD6A5] rotate-45"></div>
                                </div>
                            )}

                            <Link href={`/lesson/${letter.id}`}>
                                <motion.div
                                    className={`${sizeClass} ${bgClass} rounded-full flex flex-col items-center justify-center cursor-pointer relative z-10 text-center`}
                                    animate={isCelebrating ? { scale: 1.05, filter: "brightness(1.2)", boxShadow: "0px 0px 40px rgba(230,145,56,0.6)" } : { scale: isCurrent ? 1 : 0.95 }}
                                    transition={{ duration: 0.3 }}
                                >

                                    {/* Brahmi Symbol */}
                                    <span className={`text-3xl font-bold font-serif ${textClass}`}>
                                        {letter.brahmi_symbol}
                                    </span>

                                    {/* Devanagari Vowel */}
                                    <span className={`text-xs font-bold mt-1 tracking-wide ${subTextClass}`}>
                                        {letter.letter_name}
                                    </span>
                                </motion.div>
                            </Link>

                            {/* Node Glow (Upcoming only) */}
                            {!isCurrent && !isCompleted && (
                                <div className="absolute inset-0 bg-[#D4AF37] rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" />
                            )}
                        </div>
                    )
                })}
            </div>

            <style jsx>{`
                .arrow-right:after {
                    content: '';
                    position: absolute;
                    top: 60%;
                    right: -6px;
                    width: 12px;
                    height: 12px;
                    background: white;
                    transform: translateY(-50%) rotate(45deg);
                }
            `}</style>
        </div>
    )
}
