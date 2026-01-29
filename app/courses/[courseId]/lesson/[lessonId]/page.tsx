import { getLessonById } from '@/lib/getCourseById'
import { getCourses } from '@/lib/getCourses'
import LessonSidebar from '@/components/LessonSidebar'
import LessonRenderer from '@/components/LessonRenderer'
import { notFound } from 'next/navigation'

interface LessonPageProps {
  params: Promise<{
    courseId: string
    lessonId: string
  }>
}

export async function generateStaticParams() {
  const courses = await getCourses()
  const params: Array<{
    courseId: string
    lessonId: string
  }> = []

  for (const course of courses) {
    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        params.push({
          courseId: course.courseId,
          lessonId: lesson.lessonId,
        })
      }
    }
  }

  return params
}

export async function generateMetadata(props: LessonPageProps) {
  const params = await props.params
  const data = await getLessonById(params.courseId, params.lessonId)

  if (!data) {
    return {
      title: 'Lesson Not Found',
    }
  }

  return {
    title: `${data.lesson.title} | ${data.course.title}`,
    description: data.course.description,
  }
}

export default async function LessonPage(props: LessonPageProps) {
  const params = await props.params
  const data = await getLessonById(params.courseId, params.lessonId)

  if (!data) {
    notFound()
  }

  const { lesson, module, course } = data

  return (
    <main className='flex flex-col md:flex-row min-h-screen bg-gray-50'>
      <LessonSidebar
        modules={course.modules}
        courseId={course.courseId}
        currentLessonId={lesson.lessonId}
      />
      <LessonRenderer lesson={lesson} />
    </main>
  )
}
