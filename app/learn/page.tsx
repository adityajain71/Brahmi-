'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { COURSE_MODULES } from '@/lib/courseData'

// --- Layout Constants ---
const VERTICAL_GAP = 280     // Large vertical spacing for clarity
const PADDING_TOP = 140
const SVG_WIDTH = 400
const CENTER_X = 200
const OFFSET = 50            // Gentle organic curve

/**
 * Calculate (x, y) coordinates for the snake path
 */
function getPosition(index: number) {
    const cycle = index % 4
    let x = CENTER_X

    if (cycle === 1) x = CENTER_X + OFFSET // Right
    if (cycle === 3) x = CENTER_X - OFFSET // Left

    const y = PADDING_TOP + (index * VERTICAL_GAP)
    return { x, y }
}

/**
 * Generate smooth Bezier path
 */
function generateSVGPath(count: number): string {
    if (count < 2) return ''
    const points = Array.from({ length: count }, (_, i) => getPosition(i))
    let d = `M ${points[0].x} ${points[0].y}`

    for (let i = 0; i < count - 1; i++) {
        const current = points[i]
        const next = points[i + 1]
        const cp1x = current.x
        const cp1y = current.y + (VERTICAL_GAP * 0.5)
        const cp2x = next.x
        const cp2y = next.y - (VERTICAL_GAP * 0.5)
        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`
    }
    return d
}

export default function LearnPage() {
    const router = useRouter()

    // In a real implementation, activeModuleIndex would come from DB
    // For now, let's say "Vowels" (Index 1) is active/in-progress
    const activeModuleIndex = 1
    const completedUpTo = 0 // Introduction is done

    return (
        // 1. ISOLATION: Explicit dark background, full height, no footer leakage
        <div className="min-h-screen w-full bg-[#1F1D3A] text-white flex flex-col items-center relative overflow-hidden font-sans">

            {/* 2. Header (Consistent with Vowels Page) */}
            <div className="w-full border-b border-[#D4AF37]/20 py-6 text-center bg-[#1F1D3A]/95 backdrop-blur-sm sticky top-0 z-50">
                <button onClick={() => router.push('/')} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D4AF37] hover:text-white transition-colors text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    ← Home
                </button>
                <div className="text-[#6C7BAF] font-bold tracking-[0.2em] text-[10px] mb-2 uppercase">Ancient Echoes</div>
                <h1 className="text-3xl font-serif text-white font-bold tracking-wide">Course Overview</h1>
            </div>

            {/* 3. Main Journey Container */}
            <div
                className="relative w-full max-w-[420px] mx-auto mt-4 pb-48"
                style={{ height: `${PADDING_TOP + (COURSE_MODULES.length * VERTICAL_GAP)}px` }}
            >
                {/* LAYER 0: The Path (Z-0) */}
                <svg
                    className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
                    viewBox={`0 0 ${SVG_WIDTH} ${PADDING_TOP + (COURSE_MODULES.length * VERTICAL_GAP)}`}
                    preserveAspectRatio="xMidYMin slice"
                >
                    {/* Path Glow Definition */}
                    <defs>
                        <filter id="path-glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* The Path Line */}
                    <motion.path
                        d={generateSVGPath(COURSE_MODULES.length)}
                        fill="none"
                        stroke="#D4AF37"
                        strokeOpacity="0.3"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray="12 12"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                </svg>

                {/* LAYER 1 & 2: Content */}
                {COURSE_MODULES.map((module, index) => {
                    const pos = getPosition(index)

                    // Logic: Even = Mascot Left, Odd = Mascot Right (Alternating)
                    const mascotSide = index % 2 === 0 ? 'left' : 'right'
                    const mascotImg = (index % 3) + 1

                    // State Logic
                    const isCompleted = index <= completedUpTo
                    // Everything is clickable ("Active" visual state for all future modules to imply accessibility)
                    const isActiveVisual = true

                    return (
                        <div
                            key={module.id}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                            style={{ left: pos.x, top: pos.y }}
                        >
                            {/* LAYER 1: Mascots (Z-10) */}
                            {/* Strictly anchored relative to node center */}
                            <div
                                className={`absolute w-40 pointer-events-none z-10 
                                    ${mascotSide === 'left' ? '-left-[180px]' : '-right-[180px]'}
                                `}
                            >
                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 4,
                                        ease: "easeInOut",
                                        delay: index * 0.7 // Staggered float
                                    }}
                                >
                                    <Image
                                        src={`/assets/mascot_${mascotImg}.png`}
                                        alt=""
                                        width={140} height={140}
                                        className={`object-contain opacity-90 ${mascotSide === 'right' ? 'scale-x-[-1]' : ''}`}
                                    />
                                </motion.div>
                            </div>

                            {/* LAYER 2: Module Node (Z-20) */}
                            <Link href={module.route} className="z-20 group relative cursor-pointer outline-none">
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2 + (index * 0.1), type: "spring" }}
                                    className={`
                                        w-32 h-32 rounded-full flex flex-col items-center justify-center 
                                        transition-all duration-300 relative bg-[#1F1D3A]
                                        ${isCompleted
                                            ? 'border-4 border-[#E69138] shadow-[0_0_40px_rgba(230,145,56,0.3)]'
                                            : 'border-2 border-[#D4AF37]/60 shadow-[0_0_20px_rgba(212,175,55,0.1)] hover:border-[#D4AF37] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]'
                                        }
                                        group-hover:scale-105
                                    `}
                                >
                                    {/* Inner Character/Icon */}
                                    <span className={`text-5xl mb-1 filter drop-shadow-lg ${isCompleted ? 'text-[#E69138]' : 'text-white'}`}>
                                        {module.icon}
                                    </span>

                                    {/* Completion Check (Optional visual flair) */}
                                    {isCompleted && index === 0 && ( // Just showing logic potential
                                        <div className="absolute -bottom-2 w-8 h-8 bg-[#E69138] rounded-full flex items-center justify-center border-4 border-[#1F1D3A]">
                                            <span className="text-[#1F1D3A] text-xs font-bold">✓</span>
                                        </div>
                                    )}
                                </motion.div>

                                {/* Text Label (Below) - Z-30 */}
                                <div className="absolute top-[140px] left-1/2 -translate-x-1/2 w-64 text-center z-30">
                                    <h3 className="text-[#D4AF37] font-bold text-xl leading-tight group-hover:text-white transition-colors font-serif">
                                        {module.title}
                                    </h3>
                                    <p className="text-[#6C7BAF] text-[10px] uppercase tracking-[0.15em] mt-2 font-bold opacity-80 group-hover:opacity-100 transition-opacity">
                                        {module.subtitle}
                                    </p>
                                </div>
                            </Link>

                        </div>
                    )
                })}
            </div>

            {/* NO FOOTER HERE */}
        </div>
    )
}
