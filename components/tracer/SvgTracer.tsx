'use client'

import React, { useRef, useState, useCallback, useEffect } from 'react'
import glyphOutlines from '@/data/brahmi_glyph_outlines.json'

// ── Types ────────────────────────────────────────────────────
type GlyphEntry = {
  char: string
  label: string
  svgPathFlipped: string
  advanceWidth: number
  unitsPerEm: number
  suggestedViewBox: string
}

interface SvgTracerProps {
  /** The Brahmi Unicode character to trace (e.g. "𑀅"). Looked up in brahmi_glyph_outlines.json. */
  character: string
  /** Number of clear-and-redraw cycles before "Next" enables. 0 = no gating (immediate). */
  requiredAttempts?: number
  /** Called when user is allowed to proceed (gating satisfied + user clicks Next). */
  onComplete?: () => void
  /** Label localization */
  language?: string
}

// ── Glyph lookup ─────────────────────────────────────────────
function lookupGlyph(char: string): GlyphEntry | null {
  const entries = glyphOutlines as Record<string, GlyphEntry>
  // Direct char match
  for (const entry of Object.values(entries)) {
    if (entry.char === char) return entry
  }
  // Label match fallback
  for (const entry of Object.values(entries)) {
    if (entry.label === char) return entry
  }
  return null
}

// ── SVG path bounding box computation ────────────────────────
// Parses SVG path `d` attribute and computes axis-aligned bounding box.
// Handles M, L, H, V, Q, C, Z commands (both absolute and relative).
function computePathBounds(d: string): { minX: number; minY: number; maxX: number; maxY: number } | null {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  let cx = 0, cy = 0 // current point
  let mx = 0, my = 0 // move-to point (for Z)

  function track(x: number, y: number) {
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
    cx = x
    cy = y
  }

  // Tokenize: split into commands + their numeric arguments
  const tokens = d.match(/[MmLlHhVvQqCcZz]|[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/g)
  if (!tokens) return null

  let cmd = ''
  let i = 0
  
  function nextNum(): number {
    return parseFloat(tokens![++i]) || 0
  }

  while (i < tokens.length) {
    const t = tokens[i]
    if (/[A-Za-z]/.test(t)) {
      cmd = t
      if (cmd === 'Z' || cmd === 'z') {
        cx = mx; cy = my
        i++
        continue
      }
      i++
    }

    switch (cmd) {
      case 'M': {
        const x = parseFloat(tokens[i]); const y = parseFloat(tokens[++i])
        track(x, y); mx = x; my = y
        cmd = 'L' // subsequent coords after M are implicit L
        i++; break
      }
      case 'm': {
        const dx = parseFloat(tokens[i]); const dy = parseFloat(tokens[++i])
        track(cx + dx, cy + dy); mx = cx; my = cy
        cmd = 'l'
        i++; break
      }
      case 'L': {
        const x = parseFloat(tokens[i]); const y = parseFloat(tokens[++i])
        track(x, y); i++; break
      }
      case 'l': {
        const dx = parseFloat(tokens[i]); const dy = parseFloat(tokens[++i])
        track(cx + dx, cy + dy); i++; break
      }
      case 'H': {
        const x = parseFloat(tokens[i])
        track(x, cy); i++; break
      }
      case 'h': {
        const dx = parseFloat(tokens[i])
        track(cx + dx, cy); i++; break
      }
      case 'V': {
        const y = parseFloat(tokens[i])
        track(cx, y); i++; break
      }
      case 'v': {
        const dy = parseFloat(tokens[i])
        track(cx, cy + dy); i++; break
      }
      case 'Q': {
        const cpx = parseFloat(tokens[i]); const cpy = parseFloat(tokens[++i])
        const x = parseFloat(tokens[++i]); const y = parseFloat(tokens[++i])
        track(cpx, cpy); track(x, y); i++; break
      }
      case 'q': {
        const dcpx = parseFloat(tokens[i]); const dcpy = parseFloat(tokens[++i])
        const dx = parseFloat(tokens[++i]); const dy = parseFloat(tokens[++i])
        track(cx + dcpx, cy + dcpy); track(cx + dx, cy + dy); i++; break
      }
      case 'C': {
        const cp1x = parseFloat(tokens[i]); const cp1y = parseFloat(tokens[++i])
        const cp2x = parseFloat(tokens[++i]); const cp2y = parseFloat(tokens[++i])
        const x = parseFloat(tokens[++i]); const y = parseFloat(tokens[++i])
        track(cp1x, cp1y); track(cp2x, cp2y); track(x, y); i++; break
      }
      case 'c': {
        const d1x = parseFloat(tokens[i]); const d1y = parseFloat(tokens[++i])
        const d2x = parseFloat(tokens[++i]); const d2y = parseFloat(tokens[++i])
        const dx = parseFloat(tokens[++i]); const dy = parseFloat(tokens[++i])
        track(cx + d1x, cy + d1y); track(cx + d2x, cy + d2y); track(cx + dx, cy + dy); i++; break
      }
      default:
        i++ // skip unknown
    }
  }

  if (minX === Infinity) return null
  return { minX, minY, maxX, maxY }
}

function computeViewBox(pathD: string, padding = 0.15): string {
  const bounds = computePathBounds(pathD)
  if (!bounds) return '0 -1500 1500 1500' // generous fallback
  
  const w = bounds.maxX - bounds.minX
  const h = bounds.maxY - bounds.minY
  const size = Math.max(w, h)
  const pad = size * padding
  
  // Center the glyph in a square viewBox
  const cx = bounds.minX + w / 2
  const cy = bounds.minY + h / 2
  
  const vbX = cx - size / 2 - pad
  const vbY = cy - size / 2 - pad
  const vbSize = size + pad * 2
  
  return `${Math.round(vbX)} ${Math.round(vbY)} ${Math.round(vbSize)} ${Math.round(vbSize)}`
}

// ── Localized strings ────────────────────────────────────────
const L = {
  clear: { hi: 'साफ़ करें', en: 'Clear', kn: 'ಅಳಿಸಿ', ta: 'அழி' },
  next: { hi: 'अगला', en: 'Next', kn: 'ಮುಂದೆ', ta: 'அடுத்து' },
  attempt: { hi: 'प्रयास', en: 'Attempt', kn: 'ಪ್ರಯತ್ನ', ta: 'முயற்சி' },
  traceHint: { hi: 'अक्षर के ऊपर ट्रेस करें', en: 'Trace over the letter', kn: 'ಅಕ್ಷರದ ಮೇಲೆ ಟ್ರೇಸ್ ಮಾಡಿ', ta: 'எழுத்தின் மேல் வரையவும்' },
  clearMore: { hi: 'और {n} बार साफ़ करें', en: 'Clear {n} more time(s)', kn: 'ಇನ್ನೂ {n} ಬಾರಿ ಅಳಿಸಿ', ta: 'இன்னும் {n} முறை அழிக்கவும்' },
} as Record<string, Record<string, string>>

function t(key: string, lang: string, vars?: Record<string, string | number>): string {
  let str = L[key]?.[lang] || L[key]?.['en'] || key
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => { str = str.replace(`{${k}}`, String(v)) })
  }
  return str
}

// ── Component ────────────────────────────────────────────────
export default function SvgTracer({
  character,
  requiredAttempts = 0, // Ignored now, kept for prop compatibility if needed
  onComplete,
  language = 'hi',
}: SvgTracerProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const currentPathRef = useRef<SVGPathElement | null>(null)
  const isDrawingRef = useRef(false)
  const strokesRef = useRef<string[]>([])
  const [renderTick, setRenderTick] = useState(0)
  
  const hasStrokes = strokesRef.current.length > 0
  
  // Lookup glyph data
  let glyph = lookupGlyph(character)
  let baseGlyphs: GlyphEntry[] = []
  
  // If no direct match, try splitting into codepoints (e.g. for base + matra combinations like 𑀅𑀁)
  if (!glyph && [...character].length > 1) {
    const parts = [...character]
    const resolved = parts.map(lookupGlyph)
    if (resolved.every(g => g !== null)) {
      glyph = resolved[resolved.length - 1]
      baseGlyphs = resolved.slice(0, -1) as GlyphEntry[]
    }
  }
  
  // Compute transform and viewBox to center combining marks over base characters
  let targetTransform = ''
  let viewBox = '0 -1500 1500 1500'
  
  if (glyph) {
    if (baseGlyphs.length > 0) {
      const baseBounds = computePathBounds(baseGlyphs.map(g => g.svgPathFlipped).join(' '))
      const targetBounds = computePathBounds(glyph.svgPathFlipped)
      
      if (baseBounds && targetBounds) {
        let dx = 0;
        if (glyph.char === '𑀂') {
          // Visarga goes on the right side with a 150 unit gap
          dx = baseBounds.maxX - targetBounds.minX + 150;
        } else {
          // Center the target mark horizontally over the base character
          const baseCenterX = (baseBounds.minX + baseBounds.maxX) / 2
          const targetCenterX = (targetBounds.minX + targetBounds.maxX) / 2
          dx = baseCenterX - targetCenterX
        }
        targetTransform = `translate(${dx}, 0)`
        
        // Compute combined viewBox with the shifted target
        const shiftedTargetMinX = targetBounds.minX + dx
        const shiftedTargetMaxX = targetBounds.maxX + dx
        
        const minX = Math.min(baseBounds.minX, shiftedTargetMinX)
        const maxX = Math.max(baseBounds.maxX, shiftedTargetMaxX)
        const minY = Math.min(baseBounds.minY, targetBounds.minY)
        const maxY = Math.max(baseBounds.maxY, targetBounds.maxY)
        
        // Add 10% padding
        const w = maxX - minX
        const h = maxY - minY
        viewBox = `${minX - w * 0.1} ${minY - h * 0.1} ${w * 1.2} ${h * 1.2}`
      } else {
        viewBox = computeViewBox(glyph.svgPathFlipped)
      }
    } else {
      viewBox = computeViewBox(glyph.svgPathFlipped)
    }
  }
  
  // Compute stroke width relative to viewBox size (approximately 2.5% of viewBox)
  const vbParts = viewBox.split(' ').map(Number)
  const vbSize = Math.max(vbParts[2], vbParts[3])
  const strokeWidth = Math.max(vbSize * 0.025, 15)
  
  // Unique clip-path ID (stable per character to avoid SSR mismatch)
  const clipId = `letterClip-${(glyph?.char || character).codePointAt(0)?.toString(16) || 'x'}`
  
  const canProceed = hasStrokes
  
  // ── Coordinate conversion ──────────────────────────────────
  const toSVGCoords = useCallback((clientX: number, clientY: number): { x: number; y: number } | null => {
    const svg = svgRef.current
    if (!svg) return null
    
    const ctm = svg.getScreenCTM()
    if (ctm) {
      try {
        const pt = svg.createSVGPoint()
        pt.x = clientX
        pt.y = clientY
        const svgPt = pt.matrixTransform(ctm.inverse())
        return { x: svgPt.x, y: svgPt.y }
      } catch (err) {
        // Ignore matrix error and fallback
      }
    }
    
    // Fallback using BoundingClientRect
    const rect = svg.getBoundingClientRect()
    const vbParts = viewBox.split(' ').map(Number)
    if (vbParts.length === 4 && rect.width > 0 && rect.height > 0) {
      const scaleX = vbParts[2] / rect.width
      const scaleY = vbParts[3] / rect.height
      return {
        x: vbParts[0] + (clientX - rect.left) * scaleX,
        y: vbParts[1] + (clientY - rect.top) * scaleY
      }
    }
    
    return null
  }, [viewBox])
  
  // ── Pointer handlers ───────────────────────────────────────
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    console.log('[tracer] pointerdown', e.clientX, e.clientY)
    const svg = svgRef.current
    if (!svg) return
    
    try {
      ;(e.target as Element).setPointerCapture(e.pointerId)
    } catch (err) {
      console.warn('Pointer capture failed:', err)
    }
    
    const pt = toSVGCoords(e.clientX, e.clientY)
    if (!pt) return
    
    isDrawingRef.current = true
    strokesRef.current.push(`M ${pt.x} ${pt.y}`)
    setRenderTick(t => t + 1)
  }, [toSVGCoords])
  
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDrawingRef.current) return
    console.log('[tracer] pointermove', currentPathRef.current)
    
    const pt = toSVGCoords(e.clientX, e.clientY)
    if (!pt) return
    
    const lastIdx = strokesRef.current.length - 1
    if (lastIdx >= 0) {
      strokesRef.current[lastIdx] += ` L ${pt.x} ${pt.y}`
      if (!currentPathRef.current) return
      currentPathRef.current.setAttribute('d', strokesRef.current[lastIdx])
    }
  }, [toSVGCoords])
  
  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    isDrawingRef.current = false
    currentPathRef.current = null
    setRenderTick(t => t + 1)
  }, [])
  
  // ── Clear handler ──────────────────────────────────────────
  const handleClear = useCallback(() => {
    strokesRef.current = []
    currentPathRef.current = null
    isDrawingRef.current = false
    setRenderTick(t => t + 1)
  }, [])
  
  // ── Next handler ───────────────────────────────────
  const handleNext = useCallback(() => {
    if (canProceed && onComplete) {
      onComplete()
    }
  }, [canProceed, onComplete])
  
  // ── Reset when character changes ───────────────────────────
  useEffect(() => {
    strokesRef.current = []
    currentPathRef.current = null
    isDrawingRef.current = false
    setRenderTick(t => t + 1)
  }, [character])
  
  // ── Error state ────────────────────────────────────────────
  if (!glyph) {
    return (
      <div className="flex items-center justify-center w-full aspect-square max-w-[340px] bg-[#2a2420] rounded-2xl border-2 border-red-500/30">
        <p className="text-red-400/70 text-sm text-center px-4">
          Glyph data not found for: {character}
        </p>
      </div>
    )
  }
  
  return (
    <div className="flex flex-col items-center gap-4 w-full select-none">
      {/* SVG Tracer Canvas */}
      <div 
        className="relative w-full max-w-[340px] aspect-square rounded-2xl overflow-hidden"
        style={{
          background: '#2a2420', // Updated to match website theme (was #13122a)
          border: '2px solid rgba(212, 175, 55, 0.3)', // Made border match gold theme
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        <svg
          ref={svgRef}
          viewBox={viewBox}
          className="w-full h-full"
          style={{ touchAction: 'none' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <defs>
            <mask id={clipId}>
              <g transform={targetTransform || undefined}>
                <path d={glyph.svgPathFlipped} fill="white" />
              </g>
            </mask>
          </defs>
          
          {/* Static Base Context (e.g. for combined matra characters) */}
          {baseGlyphs.map((g, i) => (
            <path
              key={`base-${i}`}
              d={g.svgPathFlipped}
              fill="#D4AF37"
              opacity={0.4}
            />
          ))}
          
          {/* Guide outline — faint gold */}
          <g transform={targetTransform || undefined}>
            <path
              d={glyph.svgPathFlipped}
              fill="#D4AF37"
              opacity={0.15}
            />
          </g>
          
          {/* Masked ink group — strokes only visible inside the letter shape */}
          <g mask={`url(#${clipId})`}>
            {strokesRef.current.map((d, i) => (
              <path
                key={i}
                ref={i === strokesRef.current.length - 1 ? currentPathRef : null}
                d={d}
                fill="none"
                stroke="#D4AF37"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.85}
              />
            ))}
          </g>
          
          {/* Pointer capture rect — covers full viewBox, transparent */}
          <rect
            x={vbParts[0]}
            y={vbParts[1]}
            width={vbParts[2]}
            height={vbParts[3]}
            fill="none"
            pointerEvents="all"
          />
        </svg>
        
        {/* Hint text overlay */}
        {!hasStrokes && (
          <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none">
            <span className="text-xs text-[#D4AF37]/60 font-medium">
              {t('traceHint', language)}
            </span>
          </div>
        )}
      </div>
      
      {/* Controls */}
      <div className="flex gap-3 w-full max-w-[340px]">
        {/* Clear button */}
        <button
          onClick={handleClear}
          disabled={!hasStrokes}
          className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            color: '#E6D8B8',
            border: '1px solid rgba(212, 175, 55, 0.2)',
          }}
        >
          🧹 {t('clear', language)}
        </button>
        
        {/* Next button */}
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className="flex-1 px-4 py-2.5 text-sm font-bold rounded-xl transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: canProceed ? '#D4AF37' : 'rgba(212, 175, 55, 0.15)',
            color: canProceed ? '#1C1C1C' : 'rgba(212, 175, 55, 0.4)',
            boxShadow: canProceed ? '0 4px 12px rgba(212, 175, 55, 0.25)' : 'none',
          }}
        >
          {t('next', language)} →
        </button>
      </div>
    </div>
  )
}

// ── Exported Icon Component for Headers ──────────────────────
export function BrahmiIcon({ character, className }: { character: string, className?: string }) {
  let glyph = lookupGlyph(character)
  let baseGlyphs: GlyphEntry[] = []
  
  if (!glyph && [...character].length > 1) {
    const parts = [...character]
    const resolved = parts.map(lookupGlyph)
    if (resolved.every(g => g !== null)) {
      glyph = resolved[resolved.length - 1]
      baseGlyphs = resolved.slice(0, -1) as GlyphEntry[]
    }
  }
  
  if (!glyph) return <span className={className}>{character}</span>
  
  let targetTransform = ''
  let viewBox = '0 -1500 1500 1500'
  
  if (baseGlyphs.length > 0) {
    const baseBounds = computePathBounds(baseGlyphs.map(g => g.svgPathFlipped).join(' '))
    const targetBounds = computePathBounds(glyph.svgPathFlipped)
    if (baseBounds && targetBounds) {
      let dx = 0;
      if (glyph.char === '𑀂') {
        // Visarga goes on the right side with a 150 unit gap
        dx = baseBounds.maxX - targetBounds.minX + 150;
      } else {
        // Center the target mark horizontally over the base character
        const baseCenterX = (baseBounds.minX + baseBounds.maxX) / 2
        const targetCenterX = (targetBounds.minX + targetBounds.maxX) / 2
        dx = baseCenterX - targetCenterX
      }
      targetTransform = `translate(${dx}, 0)`
      
      const shiftedTargetMinX = targetBounds.minX + dx
      const shiftedTargetMaxX = targetBounds.maxX + dx
      const minX = Math.min(baseBounds.minX, shiftedTargetMinX)
      const maxX = Math.max(baseBounds.maxX, shiftedTargetMaxX)
      const minY = Math.min(baseBounds.minY, targetBounds.minY)
      const maxY = Math.max(baseBounds.maxY, targetBounds.maxY)
      const w = maxX - minX
      const h = maxY - minY
      viewBox = `${minX - w * 0.1} ${minY - h * 0.1} ${w * 1.2} ${h * 1.2}`
    } else {
      viewBox = computeViewBox(glyph.svgPathFlipped)
    }
  } else {
    viewBox = computeViewBox(glyph.svgPathFlipped)
  }

  return (
    <svg viewBox={viewBox} className={className} style={{ height: '1em', width: 'auto', display: 'inline-block', verticalAlign: 'middle' }}>
      {baseGlyphs.map((g, i) => (
        <path key={`base-${i}`} d={g.svgPathFlipped} fill="currentColor" />
      ))}
      <g transform={targetTransform}>
        <path d={glyph.svgPathFlipped} fill="currentColor" />
      </g>
    </svg>
  )
}
