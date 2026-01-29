"use client";

import React, { use } from 'react';
import LessonRenderer from '@/components/lesson/LessonRenderer';
import { sampleLesson } from '@/data/lessons/swar-a';
import Link from 'next/link';

import { getNextLessonId } from '@/lib/lessonFlow';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
    const { lessonId } = use(params);

    // In a real app we would fetch lesson by ID
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lessons: Record<string, any> = {
        'swar-a': sampleLesson,
        'intro-history': require('@/data/lessons/intro-history').lessonHistory,
        'concept-lipi': require('@/data/lessons/lesson-concept').lessonConcept,
    };
    const lesson = lessons[lessonId] || null;
    const nextLessonId = getNextLessonId(lessonId);

    if (!lesson) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Lesson not found</h1>
                <p className="text-gray-600 mb-8">Currently only "swar-a" is available.</p>
                <Link href="/learn/lesson/swar-a" className="text-orange-600 hover:underline">
                    Go to Swar 'A' Lesson
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            <header className="p-4 bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto flex items-center">
                    <Link href="/" className="text-gray-500 hover:text-gray-800 mr-4">
                        ← Back
                    </Link>
                    <span className="font-bold text-gray-800">Brahmi Learning Engine</span>
                </div>
            </header>

            <div className="flex-1">
                <LessonRenderer lesson={lesson} nextLessonId={nextLessonId} />
            </div>
        </main>
    );
}
