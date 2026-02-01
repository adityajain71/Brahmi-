import { supabase } from '@/lib/supabase'

// TypeScript types for our data
type Letter = {
    id: string
    letter_name: string
    brahmi_symbol: string
    order_no: number
}

type LetterStep = {
    id: string
    letter_id: string
    step_type: string
    content: string
    order_no: number
    letters: Letter // Single object for many-to-one relationship
}

async function getLessonSteps() {
    // Fetch steps joined with letter data, ordered by step order
    const { data, error } = await supabase
        .from('letter_steps')
        .select(`
      id,
      letter_id,
      step_type,
      content,
      order_no,
      letters (
        id,
        letter_name,
        brahmi_symbol,
        order_no
      )
    `)
        .order('order_no', { ascending: true })

    if (error) {
        console.error('Error fetching lesson steps:', error)
        return []
    }

    // Cast to unknown first to handle Supabase's type inference quirk
    return data as unknown as LetterStep[]
}

export default async function LessonPage() {
    const steps = await getLessonSteps()

    // If no steps found
    if (!steps || steps.length === 0) {
        return (
            <div style={{ padding: '20px' }}>
                <h1>No lesson steps found</h1>
                <p>Make sure you have data in your Supabase tables.</p>
                <p>Check your .env file has correct NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY</p>
            </div>
        )
    }

    // Debug: Check if letters data exists
    console.log('First step:', steps[0])
    console.log('Letters array:', steps[0].letters)

    // Get the letter info from the first step
    const letter = steps[0].letters

    // If letter data is missing, show error
    if (!letter) {
        return (
            <div style={{ padding: '20px' }}>
                <h1>Error: Letter data not found</h1>
                <p>Steps were fetched but the letter relationship is missing.</p>
                <p>Make sure your letter_steps.letter_id foreign key is set up correctly in Supabase.</p>
                <details style={{ marginTop: '20px' }}>
                    <summary>Debug Info (click to expand)</summary>
                    <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
                        {JSON.stringify(steps, null, 2)}
                    </pre>
                </details>
            </div>
        )
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            {/* Letter name at the top */}
            <h1 style={{ fontSize: '48px', marginBottom: '40px' }}>
                {letter.letter_name}
            </h1>

            {/* Render each step in order */}
            <div>
                {steps.map((step, index) => (
                    <div
                        key={step.id}
                        style={{
                            marginBottom: '30px',
                            padding: '15px',
                            border: '1px solid #ccc',
                            borderRadius: '8px'
                        }}
                    >
                        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                            Step {index + 1}: {step.step_type}
                        </div>
                        <div style={{ color: '#555' }}>
                            {step.content}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
