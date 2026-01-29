import { Lesson } from '@/lib/getCourses'
import LessonContent from '@/components/course/LessonContent'
import QuizContent from '@/components/course/QuizContent'
import CanvasBoard from '@/components/course/CanvasBoard'

interface LessonRendererProps {
  lesson: Lesson
}

/**
 * LessonRenderer
 *
 * Central rendering logic that switches on lesson.type
 * and delegates to appropriate renderer component.
 */
export default function LessonRenderer({ lesson }: LessonRendererProps) {
  return (
    <div className='flex-1 p-4 md:p-8 max-w-5xl mx-auto'>
      <header className="mb-12 border-b pb-6">
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-2 uppercase tracking-widest font-semibold">
          <span>{lesson.type}</span>
          {lesson.type === 'lesson' && <span>•</span>}
          {lesson.type === 'lesson' && <span>Reading</span>}
          {lesson.type === 'canvas' && <span>•</span>}
          {lesson.type === 'canvas' && <span>Practice</span>}
        </div>
        <h1 className='text-2xl md:text-4xl font-extrabold text-gray-900'>{lesson.title}</h1>
      </header>

      {lesson.type === 'lesson' && <LessonContent content={lesson.content} />}
      {lesson.type === 'quiz' && <QuizContent questions={lesson.questions} />}
      {lesson.type === 'canvas' && <CanvasBoard traceCharacter={lesson.config?.traceCharacter || '?'} />}
    </div>
  )
}
