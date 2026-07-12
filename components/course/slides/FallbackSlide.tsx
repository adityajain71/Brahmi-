import React from 'react'

export const FallbackSlide = ({ content }: { content: any }) => {
  // Strip out any answer-bearing keys so we don't spoil interactive quizzes
  const safeContent = { ...content }
  
  Object.keys(safeContent).forEach(key => {
    const lowerKey = key.toLowerCase()
    if (lowerKey.includes('answer') || lowerKey.includes('correct') || lowerKey.includes('solution')) {
      safeContent[key] = '[HIDDEN TO PREVENT SPOILERS]'
    }
  })

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(245,158,11,0.1)] backdrop-blur-sm max-w-md">
        <h3 className="text-xl font-sanskrit text-amber-500 mb-2">
          Interactive version coming soon!
        </h3>
        <p className="text-stone-400 text-sm">
          This slide ({content.type}) requires a bespoke interactive component that is currently under development.
        </p>
      </div>

      <div className="bg-black/30 border border-white/5 rounded-xl p-4 w-full text-left overflow-x-auto text-xs font-mono text-stone-300">
        <pre>{JSON.stringify(safeContent, null, 2)}</pre>
      </div>
    </div>
  )
}
