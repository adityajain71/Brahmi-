import { Card } from '@/components/ui/Card'
import { Section } from '@/components/ui/Section'

/**
 * QuizPlaceholder
 *
 * Renders a placeholder for quiz content.
 * TODO: Replace with actual quiz renderer and submission logic
 */
export default function QuizPlaceholder() {
  return (
    <Section>
      <Card className='p-8'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold mb-4'>❓ Quiz</h2>
          <p className='text-gray-600 mb-6'>
            This is a quiz placeholder. Questions will be rendered here once added.
          </p>
          <div className='bg-amber-50 border border-amber-200 rounded p-4'>
            <code className='text-sm text-gray-700'>lesson.type: "quiz"</code>
          </div>
        </div>
      </Card>
    </Section>
  )
}
