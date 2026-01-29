'use client'

import React, { useState } from 'react'

interface Option {
    value: string
    label: string
}

interface Question {
    id: string
    type: 'multiple-choice' | 'boolean'
    question: string
    options?: Option[]
    correctAnswer: string | boolean
    explanation?: string
}

interface QuizContentProps {
    questions: Question[]
}

const QuizContent: React.FC<QuizContentProps> = ({ questions }) => {
    const [answers, setAnswers] = useState<Record<string, any>>({})
    const [showResult, setShowResult] = useState<Record<string, boolean>>({})

    const handleSelect = (questionId: string, value: any) => {
        if (showResult[questionId]) return // Prevent changing after revealing

        setAnswers(prev => ({ ...prev, [questionId]: value }))
    }

    const checkAnswer = (questionId: string, correctAnswer: any) => {
        setShowResult(prev => ({ ...prev, [questionId]: true }))
    }

    return (
        <div className="space-y-12 max-w-3xl">
            {questions.map((q, index) => {
                const isAnswered = answers[q.id] !== undefined
                const isRevealed = showResult[q.id]
                const isCorrect = isRevealed && answers[q.id] === q.correctAnswer
                const isWrong = isRevealed && answers[q.id] !== q.correctAnswer

                return (
                    <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-semibold mb-6">
                            <span className="text-gray-400 mr-2">{index + 1}.</span>
                            {q.question}
                        </h3>

                        <div className="space-y-3">
                            {q.type === 'multiple-choice' && q.options?.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleSelect(q.id, opt.value)}
                                    disabled={isRevealed}
                                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${answers[q.id] === opt.value
                                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                            : 'border-gray-200 hover:border-gray-300'
                                        } ${isRevealed && opt.value === q.correctAnswer ? 'bg-green-100 border-green-500 !text-green-800' : ''}
                    ${isRevealed && answers[q.id] === opt.value && answers[q.id] !== q.correctAnswer ? 'bg-red-100 border-red-500 !text-red-800' : ''}
                  `}
                                >
                                    <span className="text-2xl mr-4">{opt.label}</span>
                                </button>
                            ))}

                            {q.type === 'boolean' && (
                                <div className="flex gap-4">
                                    {[true, false].map((val) => (
                                        <button
                                            key={String(val)}
                                            onClick={() => handleSelect(q.id, val)}
                                            disabled={isRevealed}
                                            className={`flex-1 p-4 rounded-lg border-2 font-bold transition-all ${answers[q.id] === val
                                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                } ${isRevealed && val === q.correctAnswer ? 'bg-green-100 border-green-500 !text-green-800' : ''}
                        ${isRevealed && answers[q.id] === val && answers[q.id] !== q.correctAnswer ? 'bg-red-100 border-red-500 !text-red-800' : ''}
                      `}
                                        >
                                            {val ? 'True (सही)' : 'False (गलत)'}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {!isRevealed && isAnswered && (
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => checkAnswer(q.id, q.correctAnswer)}
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                                >
                                    Check Answer
                                </button>
                            </div>
                        )}

                        {isRevealed && (
                            <div className={`mt-6 p-4 rounded-lg ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                                <p className="font-bold mb-1">
                                    {isCorrect ? '✨ Correct!' : '❌ Incorrect'}
                                </p>
                                {q.explanation && (
                                    <p className="text-sm opacity-90">{q.explanation}</p>
                                )}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default QuizContent
