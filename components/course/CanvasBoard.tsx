'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import * as fabric from 'fabric'
import ResizeObserver from 'resize-observer-polyfill'

interface CanvasBoardProps {
    traceCharacter: string
}

const CanvasBoard: React.FC<CanvasBoardProps> = ({ traceCharacter }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasEl = useRef<HTMLCanvasElement>(null)
    const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null)
    const [guideText, setGuideText] = useState<fabric.Text | null>(null)
    const [score, setScore] = useState<{ accuracy: number; message: string } | null>(null)

    // Initialize Canvas
    useEffect(() => {
        if (!canvasEl.current) return

        const canvas = new fabric.Canvas(canvasEl.current, {
            isDrawingMode: true,
            backgroundColor: '#f9fafb',
            selection: false,
        })

        // Customize Brush
        const brush = new fabric.PencilBrush(canvas)
        brush.color = 'black'
        brush.width = 12
        brush.strokeLineCap = 'round'
        brush.strokeLineJoin = 'round'
        canvas.freeDrawingBrush = brush

        setFabricCanvas(canvas)

        return () => {
            canvas.dispose()
        }
    }, [])

    // Handle Resizing and Guide Text placement
    useEffect(() => {
        if (!fabricCanvas || !containerRef.current) return

        const updateDimensions = () => {
            const width = containerRef.current?.offsetWidth || 300
            // Square aspect ratio or max height
            const height = Math.min(width, 500)

            fabricCanvas.setDimensions({ width, height })

            // Center Guide Text
            if (guideText) {
                fabricCanvas.remove(guideText)
            }

            const fontSize = Math.min(width, height) * 0.6

            const text = new fabric.Text(traceCharacter, {
                fontSize: fontSize,
                fill: '#e5e7eb',
                selectable: false,
                evented: false,
                originX: 'center',
                originY: 'center',
                left: width / 2,
                top: height / 2,
                fontFamily: 'sans-serif',
            })

            fabricCanvas.add(text)
            fabricCanvas.sendObjectToBack(text)
            setGuideText(text)
            fabricCanvas.requestRenderAll()
        }

        const resizeObserver = new ResizeObserver(() => {
            updateDimensions()
        })

        resizeObserver.observe(containerRef.current)
        updateDimensions() // Initial call

        return () => {
            resizeObserver.disconnect()
        }
    }, [fabricCanvas, traceCharacter])

    const clearCanvas = () => {
        if (fabricCanvas) {
            fabricCanvas.getObjects().forEach((obj) => {
                if (obj.type === 'path') {
                    fabricCanvas.remove(obj)
                }
            })
            setScore(null)
        }
    }

    const checkAccuracy = () => {
        if (!fabricCanvas || !guideText) return

        // 1. Setup offscreen canvas for analysis
        const width = fabricCanvas.width || 500
        const height = fabricCanvas.height || 500

        // Helper to extract pixels
        const getLayerPixels = (objectsToRender: fabric.Object[]) => {
            const tempCanvas = document.createElement('canvas')
            tempCanvas.width = width
            tempCanvas.height = height
            const ctx = tempCanvas.getContext('2d')
            if (!ctx) return null

            // Render objects
            // In a real app we might need to manually .render() each object onto this ctx
            // Since fabric objects are tied to the main canvas, we clone them or render carefully
            // Simpler approach: Iterate objects and render them to context

            objectsToRender.forEach(obj => {
                obj.render(ctx as any)
            })

            return ctx.getImageData(0, 0, width, height).data
        }

        // Capture Guide Layer
        const guidePixels = getLayerPixels([guideText])

        // Capture User Layer (all paths)
        const paths = fabricCanvas.getObjects().filter(o => o.type === 'path')
        if (paths.length === 0) {
            setScore({ accuracy: 0, message: "Use your finger to draw first!" })
            return
        }
        const userPixels = getLayerPixels(paths)

        if (!guidePixels || !userPixels) return

        let matched = 0
        let missed = 0 // Guide ON, User OFF
        let extra = 0  // Guide OFF, User ON
        let totalGuide = 0

        // Compare Pixel Data (RGBA) -> Stride = 4
        // We only check Alpha channel (index + 3) assuming simple drawing
        for (let i = 3; i < guidePixels.length; i += 4) {
            const guideAlpha = guidePixels[i]
            const userAlpha = userPixels[i]

            const isGuide = guideAlpha > 50
            const isUser = userAlpha > 50

            if (isGuide) totalGuide++

            if (isGuide && isUser) {
                matched++
            } else if (isGuide && !isUser) {
                missed++
            } else if (!isGuide && isUser) {
                extra++
            }
        }

        // Calculate Scores
        // Recall: How much of the character did we cover?
        const recall = totalGuide > 0 ? (matched / totalGuide) : 0

        // Precision: How much of our drawing was inside lines?
        // We relax precision a bit because tracing perfectly is hard
        const userTotal = matched + extra
        const precision = userTotal > 0 ? (matched / userTotal) : 0

        // F1 Score (Harmonic Mean)
        const f1 = (2 * recall * precision) / (recall + precision || 1)

        const percentage = Math.round(f1 * 100)

        let message = "Keep practicing!"
        if (percentage > 80) message = "Excellent! 🎉"
        else if (percentage > 50) message = "Good effort! 👍"
        else if (percentage > 20) message = "Getting there..."

        setScore({ accuracy: percentage, message })
    }

    return (
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
            {/* Canvas Container */}
            <div
                ref={containerRef}
                className="w-full aspect-square border-4 border-dashed border-gray-300 rounded-xl overflow-hidden shadow-sm relative touch-none bg-gray-50"
            >
                <canvas ref={canvasEl} />
                <div className="absolute top-4 right-4 bg-white/80 px-2 py-1 rounded text-xs text-gray-500 pointer-events-none select-none">
                    Canvas Mode
                </div>

                {score && (
                    <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center animate-in fade-in duration-300 z-10">
                        <div className="text-6xl font-black text-indigo-600 mb-2">{score.accuracy}%</div>
                        <div className="text-xl font-medium text-gray-700">{score.message}</div>
                        <button
                            onClick={() => setScore(null)}
                            className="mt-6 text-gray-500 underline hover:text-indigo-600"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="mt-6 grid grid-cols-2 gap-4 w-full">
                <button
                    onClick={clearCanvas}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition active:scale-95"
                >
                    Clear
                </button>
                <button
                    onClick={checkAccuracy}
                    className="flex-1 px-4 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition active:scale-95 shadow-lg shadow-indigo-200"
                >
                    Check ✓
                </button>
            </div>

            <p className="mt-4 text-gray-500 text-sm text-center">
                Trace the character on the screen using your finger or mouse.
            </p>
        </div>
    )
}

export default CanvasBoard
