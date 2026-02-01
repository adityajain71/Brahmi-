'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Canvas, PencilBrush, Text } from 'fabric'

interface CanvasBoardProps {
    traceCharacter: string
}

const CanvasBoard: React.FC<CanvasBoardProps> = ({ traceCharacter }) => {
    const canvasEl = useRef<HTMLCanvasElement>(null)
    const [canvas, setCanvas] = useState<Canvas | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!canvasEl.current) return

        // Create canvas
        const newCanvas = new Canvas(canvasEl.current, {
            isDrawingMode: true,
            width: 300,
            height: 300,
            backgroundColor: '#ffffff',
        })

        // Configure brush
        const brush = new PencilBrush(newCanvas)
        brush.width = 12
        brush.color = '#111827' // gray-900
        newCanvas.freeDrawingBrush = brush

        setCanvas(newCanvas)

        return () => {
            newCanvas.dispose()
        }
    }, [])

    // Update character when props change or canvas is ready
    useEffect(() => {
        if (!canvas || !traceCharacter) return

        // Clear existing content 
        canvas.clear()

        // Restore background color
        canvas.backgroundColor = '#ffffff'

        // Add the character to trace
        const text = new Text(traceCharacter, {
            fontSize: 200,
            fontFamily: 'serif',
            fill: '#e5e7eb', // gray-200 for tracing guide
            selectable: false,
            evented: false,
            originX: 'center',
            originY: 'center',
            left: (canvas.width || 300) / 2,
            top: (canvas.height || 300) / 2,
        })

        canvas.add(text)
        canvas.renderAll()

    }, [canvas, traceCharacter])

    const clearCanvas = () => {
        if (!canvas) return
        canvas.clear()
        canvas.backgroundColor = '#ffffff'

        // Re-add text
        const text = new Text(traceCharacter, {
            fontSize: 200,
            fontFamily: 'serif',
            fill: '#e5e7eb',
            selectable: false,
            evented: false,
            originX: 'center',
            originY: 'center',
            left: (canvas.width || 300) / 2,
            top: (canvas.height || 300) / 2,
        })
        canvas.add(text)
        canvas.renderAll()
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <div
                ref={containerRef}
                className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden shadow-sm bg-white"
            >
                <canvas ref={canvasEl} width={300} height={300} />
            </div>

            <button
                onClick={clearCanvas}
                className="text-sm text-gray-500 hover:text-gray-900 underline underline-offset-4"
            >
                Clear Drawing
            </button>
        </div>
    )
}

export default CanvasBoard
