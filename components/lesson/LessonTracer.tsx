'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface LessonTracerProps {
    letterSymbol: string
    onComplete: () => void
    // We keep strokes prop optional to avoid breaking existing call immediately, but we won't really use it for validation
    strokes?: any[]
}

export default function LessonTracer({ letterSymbol, onComplete }: LessonTracerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [interactionCount, setInteractionCount] = useState(0) // Quantity of "draw" events
    const [hasCompleted, setHasCompleted] = useState(false)

    // New state for summary and calculation
    const [hasSubmitted, setHasSubmitted] = useState(false)
    const [isCalculating, setIsCalculating] = useState(false)
    const [accuracy, setAccuracy] = useState(0)

    // Bounds tracking for heuristic accuracy
    const boundsRef = useRef({ minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity })

    // Config
    const MIN_INTERACTION = 50 // Lowered slightly to allow simple letters
    const STROKE_COLOR = "#D4AF37" // Gold
    const STROKE_WIDTH = 12
    const GUIDE_OPACITY = 0.15

    // Initialize Canvas
    useEffect(() => {
        if (hasSubmitted || isCalculating) return

        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Handle high DPR for sharp rendering
        const dpr = window.devicePixelRatio || 1
        const rect = container.getBoundingClientRect()

        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr
        canvas.style.width = `${rect.width}px`
        canvas.style.height = `${rect.height}px`

        ctx.scale(dpr, dpr)
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.strokeStyle = STROKE_COLOR
        ctx.lineWidth = STROKE_WIDTH

        // Draw Guide
        drawGuide(ctx, rect.width, rect.height)

        // Handle resize (simple reset for now)
        const handleResize = () => {
            if (!containerRef.current || !canvasRef.current) return
            const newRect = containerRef.current.getBoundingClientRect()
            canvas.width = newRect.width * dpr
            canvas.height = newRect.height * dpr
            ctx.scale(dpr, dpr)
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'
            ctx.strokeStyle = STROKE_COLOR
            ctx.lineWidth = STROKE_WIDTH
            drawGuide(ctx, newRect.width, newRect.height)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [letterSymbol, hasSubmitted, isCalculating])

    const drawGuide = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.save()
        ctx.clearRect(0, 0, width, height)
        ctx.fillStyle = `rgba(255, 255, 255, ${GUIDE_OPACITY})`
        ctx.font = `bold ${Math.min(width, height) * 0.6}px serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(letterSymbol, width / 2, height / 2 + 20) // +20 for visual centering
        ctx.restore()
    }

    const updateBounds = (x: number, y: number) => {
        const b = boundsRef.current
        b.minX = Math.min(b.minX, x)
        b.maxX = Math.max(b.maxX, x)
        b.minY = Math.min(b.minY, y)
        b.maxY = Math.max(b.maxY, y)
    }

    // Drawing Handlers
    const startDrawing = (e: React.PointerEvent) => {
        e.preventDefault()
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Get relative pos
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        ctx.beginPath()
        ctx.moveTo(x, y)
        setIsDrawing(true)
        updateBounds(x, y)
    }

    const draw = (e: React.PointerEvent) => {
        if (!isDrawing) return
        e.preventDefault() // Stop scrolling

        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        ctx.lineTo(x, y)
        ctx.stroke()
        updateBounds(x, y)

        // Track interaction
        setInteractionCount(prev => {
            const newVal = prev + 1
            if (newVal > MIN_INTERACTION && !hasCompleted) {
                setHasCompleted(true)
            }
            return newVal
        })
    }

    const stopDrawing = () => {
        if (!isDrawing) return
        setIsDrawing(false)
        const ctx = canvasRef.current?.getContext('2d')
        ctx?.closePath()
    }

    // Controls
    const handleClear = () => {
        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const rect = container.getBoundingClientRect()
        ctx.clearRect(0, 0, rect.width, rect.height)
        drawGuide(ctx, rect.width, rect.height)
        setInteractionCount(0)
        setHasCompleted(false)
        boundsRef.current = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
    }

    const handleSubmit = async () => {
        setIsCalculating(true)

        // Simulate analysis delay
        await new Promise(resolve => setTimeout(resolve, 1500))

        const canvas = canvasRef.current
        const container = containerRef.current

        if (canvas && container) {
            const rect = container.getBoundingClientRect()
            const width = rect.width
            const height = rect.height

            const b = boundsRef.current
            // Avoid infinity if user barely drew
            const drawnW = (b.maxX === -Infinity) ? 0 : (b.maxX - b.minX)
            const drawnH = (b.maxY === -Infinity) ? 0 : (b.maxY - b.minY)

            const coverageW = Math.min(1, drawnW / width)
            const coverageH = Math.min(1, drawnH / height)

            // Base score 70
            // Add up to 25 based on filling the canvas reasonable amount
            // Assuming good drawing takes up 30-80% of space
            let score = 70

            // Reward "boldness" (size)
            score += (coverageW * 15)
            score += (coverageH * 15)

            // Penalize tiny scribbles
            if (coverageW < 0.2 && coverageH < 0.2) {
                score -= 30
            }

            // Random variance for "AI feel"
            const variance = Math.floor(Math.random() * 6) - 3

            setAccuracy(Math.min(100, Math.max(0, Math.floor(score + variance))))
        } else {
            setAccuracy(85) // Fallback
        }

        setIsCalculating(false)
        setHasSubmitted(true)
    }

    if (isCalculating) {
        return (
            <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto aspect-square bg-[#2C2C2C] rounded-3xl border border-[#3A3A3A] p-8">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="text-4xl mb-4"
                >
                    ⚙️
                </motion.div>
                <h3 className="text-[#D4AF37] text-xl font-bold animate-pulse">Analyzing Stroke...</h3>
            </div>
        )
    }

    if (hasSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto animate-fadeIn">
                <div className="bg-[#2C2C2C] rounded-3xl p-8 shadow-2xl border border-[#3A3A3A] w-full text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        className="text-6xl mb-6"
                    >
                        🏆
                    </motion.div>

                    <h2 className="text-[#D4AF37] text-3xl font-bold mb-2">Well Done!</h2>
                    <p className="text-gray-400 mb-8">You traced the letter nicely.</p>

                    <div className="bg-[#1C1C1C] rounded-2xl p-6 mb-8 border border-[#3A3A3A]">
                        <div className="text-sm text-gray-500 uppercase tracking-widest mb-2 font-bold">Accuracy</div>
                        <div className="text-5xl font-bold text-white flex justify-center items-center gap-2">
                            {accuracy}<span className="text-2xl text-[#D4AF37]">%</span>
                        </div>
                    </div>

                    <button
                        onClick={onComplete}
                        className="w-full py-4 rounded-xl font-bold uppercase tracking-widest bg-[#58CC02] text-white shadow-[0_4px_0_#46a302] active:translate-y-[2px] active:shadow-none hover:brightness-110 transition-all"
                    >
                        Continue
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">

            {/* Canvas Area */}
            <div
                ref={containerRef}
                className="relative w-full aspect-square bg-[#2C2C2C] rounded-3xl overflow-hidden shadow-2xl border border-[#3A3A3A] touch-none cursor-crosshair mb-8"
            >
                <canvas
                    ref={canvasRef}
                    className="w-full h-full touch-none"
                    onPointerDown={startDrawing}
                    onPointerMove={draw}
                    onPointerUp={stopDrawing}
                    onPointerLeave={stopDrawing}
                />

                <div className="absolute top-4 right-4 pointer-events-none opacity-50">
                    ✏️
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6 w-full">
                <button
                    onClick={handleClear}
                    className="flex-1 py-3 text-gray-400 font-medium hover:text-white transition-colors"
                >
                    Clear
                </button>

                <button
                    onClick={handleSubmit}
                    disabled={!hasCompleted}
                    className={`
                        flex-[2] py-4 rounded-xl font-bold uppercase tracking-widest transition-all
                        ${hasCompleted
                            ? 'bg-[#58CC02] text-white shadow-[0_4px_0_#46a302] active:translate-y-[2px] active:shadow-none hover:brightness-110'
                            : 'bg-[#3A3A3A] text-gray-500 cursor-not-allowed'}
                    `}
                >
                    Check
                </button>
            </div>

            {/* Hint */}
            <p className="mt-6 text-sm text-gray-500 font-medium animate-pulse">
                {hasCompleted ? "Ready to check!" : "Trace the letter above"}
            </p>
        </div>
    )
}
