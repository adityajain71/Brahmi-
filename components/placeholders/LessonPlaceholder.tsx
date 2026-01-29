import { Card } from '@/components/ui/Card'
import { Section } from '@/components/ui/Section'

/**
 * LessonPlaceholder
 *
 * Renders a placeholder for standard lesson content.
 * TODO: Replace with actual lesson content renderer
 */
export default function LessonPlaceholder() {
  return (
    <Section>
      <Card className='p-8'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold mb-4'>📖 Lesson Content</h2>
          <p className='text-gray-600 mb-6'>
            This is a lesson placeholder. Content will be rendered here once added.
          </p>
          <div className='bg-blue-50 border border-blue-200 rounded p-4'>
            <code className='text-sm text-gray-700'>lesson.type: "lesson"</code>
          </div>
        </div>
      </Card>
    </Section>
  )
}
