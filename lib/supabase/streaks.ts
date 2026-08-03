import { getSupabaseBrowserClient } from './client'
import type { StreakData } from '../streak'

export async function fetchUserStreak(userId: string): Promise<StreakData> {
  const supabase = getSupabaseBrowserClient()
  if (!supabase || !userId) {
    return { currentStreak: 0, longestStreak: 0, lastLoginDate: null, isNewStreak: false }
  }

  const { data, error } = await (supabase.from('user_streaks') as any)
    .select('current_streak, longest_streak, last_login_date')
    .eq('user_id', userId)
    .maybeSingle()

  if (error || !data) {
    return { currentStreak: 0, longestStreak: 0, lastLoginDate: null, isNewStreak: false }
  }

  return {
    currentStreak: data.current_streak || 0,
    longestStreak: data.longest_streak || 0,
    lastLoginDate: data.last_login_date || null,
    isNewStreak: false,
  }
}

export async function syncUserStreak(userId: string): Promise<StreakData> {
  const supabase = getSupabaseBrowserClient()
  if (!supabase || !userId) {
    return { currentStreak: 0, longestStreak: 0, lastLoginDate: null, isNewStreak: false }
  }

  const todayStr = new Date().toISOString().split('T')[0]
  const existing = await fetchUserStreak(userId)

  if (existing.lastLoginDate === todayStr) {
    return existing
  }

  let currentStreak = 1
  let isNewStreak = true

  if (existing.lastLoginDate) {
    const lastDate = new Date(existing.lastLoginDate)
    const today = new Date(todayStr)
    const diffTime = today.getTime() - lastDate.getTime()
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24))

    if (diffDays === 1) {
      currentStreak = existing.currentStreak + 1
    } else if (diffDays === 0) {
      currentStreak = existing.currentStreak
      isNewStreak = false
    } else {
      currentStreak = 1
    }
  }

  const longestStreak = Math.max(currentStreak, existing.longestStreak)

  const payload = {
    user_id: userId,
    current_streak: currentStreak,
    longest_streak: longestStreak,
    last_login_date: todayStr,
    updated_at: new Date().toISOString(),
  }

  const { error } = await (supabase.from('user_streaks') as any)
    .upsert(payload, { onConflict: 'user_id' })

  if (error) {
    console.warn('Failed to update streak in Supabase:', error.message)
  }

  return {
    currentStreak,
    longestStreak,
    lastLoginDate: todayStr,
    isNewStreak,
  }
}
