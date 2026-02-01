import { createClient } from '@/lib/supabase/client'

export async function getUserProgress(userId: string | null) {
    if (!userId) {
        return { completedIds: [], currentId: null }
    }

    const supabase = createClient()
    const { data, error } = await supabase
        .from('user_progress')
        .select('letter_id, status')
        .eq('user_id', userId)

    if (error) {
        console.error('Error fetching progress:', error)
        return { completedIds: [], currentId: null }
    }

    const completedIds = data.filter(p => p.status === 'completed').map(p => p.letter_id)
    const currentItem = data.find(p => p.status === 'current')
    const currentId = currentItem ? currentItem.letter_id : null

    return { completedIds, currentId }
}

export async function markLessonComplete(userId: string | null, letterId: string) {
    if (!userId) {
        // Guest mode: Do nothing on DB side
        return
    }

    const supabase = createClient()

    // 1. Mark current as completed
    const { error: completeError } = await supabase
        .from('user_progress')
        .upsert({
            user_id: userId,
            letter_id: letterId,
            status: 'completed'
        })

    if (completeError) throw completeError

    // 2. Find next letter
    // Get current letter order
    const { data: currentLetter, error: letterError } = await supabase
        .from('letters')
        .select('order_no')
        .eq('id', letterId)
        .single()

    if (letterError || !currentLetter) return // specific error handling or end of course

    // Get next letter
    const { data: nextLetter } = await supabase
        .from('letters')
        .select('id')
        .gt('order_no', currentLetter.order_no)
        .order('order_no', { ascending: true })
        .limit(1)
        .single()

    // 3. Mark next as current (if exists)
    if (nextLetter) {
        // Check if already completed (re-doing lesson)
        const { data: existingProgress } = await supabase
            .from('user_progress')
            .select('status')
            .eq('user_id', userId)
            .eq('letter_id', nextLetter.id)
            .single()

        if (!existingProgress || existingProgress.status !== 'completed') {
            await supabase
                .from('user_progress')
                .upsert({
                    user_id: userId,
                    letter_id: nextLetter.id,
                    status: 'current'
                })
        }
    }
}
