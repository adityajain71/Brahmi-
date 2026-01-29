import React from 'react'
import CharacterGrid from './CharacterGrid'

interface ContentBlock {
    type: string
    value?: string
    items?: any[]
}

interface LessonContentProps {
    content: ContentBlock[]
}

const LessonContent: React.FC<LessonContentProps> = ({ content }) => {
    if (!content || content.length === 0) {
        return <div className="text-gray-500 italic">No content available for this lesson.</div>
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {content.map((block, index) => {
                switch (block.type) {
                    case 'text':
                        return (
                            <p key={index} className="text-lg text-gray-700 leading-relaxed max-w-2xl">
                                {block.value}
                            </p>
                        )
                    case 'character-grid':
                        return <CharacterGrid key={index} items={block.items || []} />
                    default:
                        return (
                            <div key={index} className="p-4 bg-red-50 text-red-600 rounded">
                                Unknown content type: {block.type}
                            </div>
                        )
                }
            })}
        </div>
    )
}

export default LessonContent
