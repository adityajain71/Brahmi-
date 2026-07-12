import React from 'react'
import { motion } from 'framer-motion'
import { CompiledSlide } from '@/app/learn/[module]/page'

export default function MatraTracingSlide({ slide, language, onNext }: { slide: CompiledSlide, language: string, onNext: () => void }) {
  const item = slide.content
  const isHindi = language === 'hi'
  const title = isHindi ? `मात्रा चिह्न - ${item.vowel}` : `Matra Sign - ${item.vowel}`

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-8 w-full max-w-4xl mx-auto min-h-[60vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 sm:mb-12"
      >
        <h2 className="text-3xl sm:text-4xl text-[#D4AF37] font-bold mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          {title}
        </h2>
        {item.exampleShown && (
          <p className="text-lg sm:text-xl text-[#E6D8B8]/80 mb-2 font-medium">
            {isHindi ? 'उदाहरण: ' : 'Example: '}{item.exampleShown}
          </p>
        )}
      </motion.div>

      <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-16 bg-[#2a2420] p-8 sm:p-12 rounded-3xl border border-[#D4AF37]/30 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/5 to-transparent pointer-events-none" />

        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-2xl bg-[#1a1613] border-2 border-[#D4AF37]/50 flex items-center justify-center shadow-inner relative">
            <span className="text-6xl sm:text-8xl text-[#FFD6A5] font-brahmi leading-none drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
              {item.independentForm}
            </span>
            <div className="absolute -bottom-4 bg-[#D4AF37] text-[#1a1613] px-4 py-1 rounded-full text-sm font-bold shadow-md whitespace-nowrap">
              {isHindi ? 'स्वतन्त्र रूप' : 'Independent Form'}
            </div>
          </div>
        </motion.div>

        {item.matraSign && (
          <>
            <div className="text-4xl text-[#D4AF37]/50 font-light">+</div>
            
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center"
            >
              <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-2xl bg-[#1a1613] border-2 border-[#D4AF37]/50 flex items-center justify-center shadow-inner relative group cursor-crosshair">
                <span className="text-6xl sm:text-8xl text-[#FFD6A5] font-brahmi leading-none group-hover:scale-110 transition-transform duration-300">
                  {item.matraSign.replace('◌', '')}
                </span>
                <span className="absolute text-8xl text-[#D4AF37]/10 pointer-events-none">◌</span>
                <div className="absolute -bottom-4 bg-[#D4AF37] text-[#1a1613] px-4 py-1 rounded-full text-sm font-bold shadow-md whitespace-nowrap">
                  {isHindi ? 'मात्रा चिह्न' : 'Matra Sign'}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 text-center"
      >
        <p className="text-[#D4AF37]/70 text-sm mb-6 max-w-md mx-auto">
          {item.uxNote || (isHindi ? 'चिह्न को ध्यान से देखें और याद करें।' : 'Observe the sign carefully and remember it.')}
        </p>
        <button
          onClick={onNext}
          className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#F2D06B] text-[#1a1613] text-lg font-bold rounded-full hover:scale-105 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]"
        >
          {isHindi ? 'अगला चिह्न' : 'Next Sign'}
        </button>
      </motion.div>
    </div>
  )
}
