import { Card } from '@/components/ui/Card'
import { Section } from '@/components/ui/Section'

/**
 * CanvasPlaceholder
 *
 * Renders a placeholder for interactive canvas/drawing areas.
 * TODO: Replace with actual canvas rendering engine
 */
export default function CanvasPlaceholder() {
  return (
    <Section>
      <Card className='p-8'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold mb-4'>🎨 Canvas</h2>
          <p className='text-gray-600 mb-6'>
            This is a canvas placeholder. Interactive content will be rendered here once configured.
          </p>
          <div className='bg-green-50 border border-green-200 rounded p-4'>
            <code className='text-sm text-gray-700'>lesson.type: "canvas"</code>
          </div>
        </div>
      </Card>
    </Section>
  )
}
