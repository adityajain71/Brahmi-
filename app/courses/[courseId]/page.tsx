import { getCourseById } from '@/lib/getCourseById'
import { getCourses } from '@/lib/getCourses'
import ModuleList from '@/components/ModuleList'
import Link from 'next/link'
import { Section } from '@/components/ui/Section'
import { notFound } from 'next/navigation'

interface CoursePageProps {
  params: Promise<{
    courseId: string
  }>
}

export async function generateStaticParams() {
  const courses = await getCourses()
  return courses.map((course) => ({
    courseId: course.courseId,
  }))
}

export async function generateMetadata(props: CoursePageProps) {
  const params = await props.params
  const course = await getCourseById(params.courseId)

  if (!course) {
    return {
      title: 'Course Not Found',
    }
  }

  return {
    title: course.title,
    description: course.description,
  }
}

export default async function CoursePage(props: CoursePageProps) {
  const params = await props.params
  const course = await getCourseById(params.courseId)

  if (!course) {
    notFound()
  }

  return (
    <main className='min-h-screen bg-gray-50'>
      <Section className='py-12'>
        <Link href='/courses' className='text-blue-600 hover:underline mb-6 block'>
          ← Back to Courses
        </Link>

        <div className='mb-12'>
          <h1 className='text-4xl font-bold mb-4'>{course.title}</h1>
          <p className='text-gray-600 text-lg'>{course.description}</p>
        </div>

        <div className='bg-white rounded-lg shadow p-8'>
          <h2 className='text-2xl font-bold mb-6'>Course Content</h2>
          <ModuleList modules={course.modules} courseId={course.courseId} />
        </div>
      </Section>
    </main>
  )
}
