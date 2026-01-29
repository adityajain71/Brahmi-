import React from 'react'

interface CharacterItem {
    devanagari: string
    brahmi: string
    transliteration?: string
}

interface CharacterGridProps {
    items: CharacterItem[]
}

const CharacterGrid: React.FC<CharacterGridProps> = ({ items }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-8">
            {items.map((item, index) => (
                <div key={index} className="flex flex-col items-center bg-amber-50 rounded-xl p-6 border-2 border-amber-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-sm text-gray-500 font-medium mb-2 uppercase tracking-widest">
                        {item.transliteration}
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="text-4xl font-bold text-gray-800" lang="hi">
                            {item.devanagari}
                        </div>
                        <div className="text-2xl text-gray-300">→</div>
                        <div className="text-5xl font-bold text-amber-700" title="Brahmi">
                            {item.brahmi}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default CharacterGrid
