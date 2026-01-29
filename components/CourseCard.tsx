import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Course } from '@/lib/getCourses'

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  const lessonCount = course.modules.reduce((acc, module) => acc + module.lessons.length, 0)

  return (
    <Link href={`/courses/${course.courseId}`}>
      <Card className='p-6 hover:shadow-lg transition-shadow cursor-pointer h-full'>
        <h3 className='text-xl font-bold mb-2'>{course.title}</h3>
        <p className='text-gray-600 text-sm mb-4'>{course.description}</p>
        <div className='flex justify-between text-xs text-gray-500'>
          <span>{course.modules.length} modules</span>
          <span>{lessonCount} lessons</span>
        </div>
      </Card>
    </Link>
  )
}
