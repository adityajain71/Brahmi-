'use client'

import { Module, Lesson } from '@/lib/getCourses'
import Link from 'next/link'
import { useState } from 'react'

interface LessonSidebarProps {
  modules: Module[]
  courseId: string
  currentLessonId: string
}

export default function LessonSidebar({
  modules,
  courseId,
  currentLessonId,
}: LessonSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Toggle Bar */}
      <div className="md:hidden bg-white border-b p-4 flex justify-between items-center sticky top-0 z-20">
        <Link href={`/courses/${courseId}`} className="font-bold text-blue-600">
          ← Back
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg border"
        >
          {isOpen ? 'Hide Menu' : 'Show Course Menu'}
        </button>
      </div>

      {/* Sidebar Container - Hidden on mobile unless open, always block on desktop */}
      <aside className={`
        w-full md:w-64 bg-gray-50 border-r border-gray-200 
        md:block
        ${isOpen ? 'block' : 'hidden'}
      `}>
        <div className="p-4 md:h-screen md:overflow-y-auto sticky top-0">
          <Link href={`/courses/${courseId}`} className="hidden md:block">
            <h2 className='text-lg font-bold mb-4 cursor-pointer hover:text-blue-600'>← Back to Course</h2>
          </Link>

          <div className='space-y-4'>
            {modules.map((module) => (
              <div key={module.moduleId}>
                <h3 className='text-sm font-bold text-gray-700 mb-2'>{module.title}</h3>
                <div className='space-y-1'>
                  {module.lessons.map((lesson) => (
                    <Link
                      key={lesson.lessonId}
                      href={`/courses/${courseId}/lesson/${lesson.lessonId}`}
                      onClick={() => setIsOpen(false)} // Close menu on selection (mobile)
                    >
                      <div
                        className={`p-2 text-sm rounded cursor-pointer transition-colors ${currentLessonId === lesson.lessonId
                            ? 'bg-blue-500 text-white font-semibold'
                            : 'hover:bg-gray-200'
                          }`}
                      >
                        <span className='mr-2'>
                          {lesson.type === 'lesson' && '📖'}
                          {lesson.type === 'quiz' && '❓'}
                          {lesson.type === 'canvas' && '🎨'}
                        </span>
                        {lesson.title}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}
