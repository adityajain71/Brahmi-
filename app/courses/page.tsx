import { getCourses } from '@/lib/getCourses'
import { Section } from '@/components/ui/Section'
import SyllabusRenderer from '@/components/course/SyllabusRenderer'

export const metadata = {
  title: 'Ancient Echoes - Brahmi Course',
  description: 'The definitive course to learn Brahmi Script.',
}

export default async function CoursesPage() {
  const courses = await getCourses()

  // Since we only have one main course now, we find it.
  const mainCourse = courses.find(c => c.courseId === 'ancient-echoes-brahmi') || courses[0];

  return (
    <main className='min-h-screen bg-gray-50'>
      <Section className='py-4'>
        {mainCourse ? (
          <SyllabusRenderer course={mainCourse} />
        ) : (
          <div className='bg-yellow-50 border border-yellow-200 rounded p-8 text-center max-w-lg mx-auto mt-12'>
            <p className='text-gray-600'>Course content not found.</p>
            <p className='text-sm text-gray-500 mt-2'>
              Please ensure <code>ancient-echoes.json</code> exists in content/courses.
            </p>
          </div>
        )}
      </Section>
    </main>
  )
}
