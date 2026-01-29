import React from 'react';
import Link from 'next/link';
import { Course, Module, Lesson } from '@/lib/getCourses';

interface SyllabusProps {
    course: Course;
}

const SyllabusRenderer: React.FC<SyllabusProps> = ({ course }) => {
    return (
        <div className="max-w-3xl mx-auto space-y-12 py-8">
            {/* Course Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-serif text-gray-900">{course.title}</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    {course.description}
                </p>
            </div>

            {/* Phases (Modules) */}
            <div className="space-y-8 relative">
                <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gray-200 hidden md:block" />

                {course.modules.map((module, index) => (
                    <div key={module.moduleId} className="relative md:pl-24 group">
                        {/* Timeline Node */}
                        <div className="absolute left-[29px] top-6 w-4 h-4 bg-orange-100 border-2 border-orange-500 rounded-full hidden md:block z-10 group-hover:scale-125 transition-transform origin-center" />

                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            {/* Module Header */}
                            <div className="bg-orange-50/50 px-6 py-4 border-b border-orange-100/50 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-800 font-serif">
                                    {module.title}
                                </h2>
                                <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                                    {module.lessons.length} Lessons
                                </span>
                            </div>

                            {/* Lesson List */}
                            <div className="divide-y divide-gray-50">
                                {module.lessons.map((lesson) => (
                                    <Link
                                        key={lesson.lessonId}
                                        href={`/learn/lesson/${lesson.lessonId}`}
                                        className="block hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="px-6 py-4 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg shadow-inner">
                                                {lesson.type === 'canvas' ? '✍️' : (lesson.type === 'quiz' ? '❓' : '📜')}
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="text-gray-900 font-medium group-hover:text-orange-700 transition-colors">
                                                    {lesson.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-0.5">
                                                    {getLessonTypeLabel(lesson.type)}
                                                </p>
                                            </div>

                                            <div className="text-gray-300">
                                                →
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

function getLessonTypeLabel(type: string) {
    switch (type) {
        case 'lesson': return 'Interactive Lesson';
        case 'quiz': return 'Quiz Challenge';
        case 'canvas': return 'Tracing Practice';
        default: return 'Module';
    }
}

export default SyllabusRenderer;
