import { Module } from '@/lib/getCourses'
import Link from 'next/link'

interface ModuleListProps {
  modules: Module[]
  courseId: string
}

export default function ModuleList({ modules, courseId }: ModuleListProps) {
  return (
    <div className='space-y-6'>
      {modules.map((module) => (
        <div key={module.moduleId}>
          <h3 className='text-lg font-bold mb-3'>{module.title}</h3>
          <div className='space-y-2 ml-4'>
            {module.lessons.map((lesson) => (
              <Link
                key={lesson.lessonId}
                href={`/learn/lesson/${lesson.lessonId}`}
              >
                <div className='p-3 bg-blue-50 hover:bg-blue-100 rounded cursor-pointer transition-colors'>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm'>
                      {lesson.type === 'lesson' && '📖'}
                      {lesson.type === 'quiz' && '❓'}
                      {lesson.type === 'canvas' && '🎨'}
                    </span>
                    <span className='font-medium'>{lesson.title}</span>
                    <span className='text-xs text-gray-500 ml-auto'>{lesson.type}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
